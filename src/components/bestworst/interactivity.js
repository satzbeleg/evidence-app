import { reactive, ref } from 'vue';
import { sampling, counting, ranking } from 'bwsample';
// import { useApi, useAuth } from '@/functions/axios-evidence.js';


const getLast = (arr) => {
  if (arr.length  > 0){
    return arr[arr.length - 1];
  }else{
    return undefined
  }
}

// const getNextToLast = (arr) => {
//   if (arr.length  > 1){
//     return arr[arr.length - 2];
//   }else{
//     return undefined
//   }
// }

const getLastAbsChange = (arr) => {
  if (arr.length  > 1){
    return Math.abs(arr[arr.length - 1] - arr[arr.length - 2]);
  }else{
    return undefined
  }
}

/**
 * see `dropExamplesFromPool` 
 * 
 * const data = Array.from({length: 40}, () => Math.random())
 * const bin_edges = [.1, .25, .5, .75, 9.].sort()
 * const probas = histogram(data, bin_edges)
 */
const histogram = (data, bin_edges) => {
  const num_bins = bin_edges.length - 1;
  var count = Array.from({length: num_bins}, () => 0);
  var i;
  // Count occurences inside the bins
  data.forEach(val => {
    if (val <= bin_edges[0]){
      count[0] += 1;
      return;  // break "forEach" loop
    }
    if (val > bin_edges[num_bins]){
      count[0] += 1;
      return;  // break "forEach" loop
    }
    for(i = 0; i < num_bins; i++){
      if (bin_edges[i] < val && val <= bin_edges[i+1]){
        count[i] += 1;
        continue;  // break "for" loop
      }
    }
  })
  // convert counts to probabilities
  const num_sample_size = data.length;
  var probas = []
  count.forEach(val => {
    probas.push(val / num_sample_size);
  })
  // done
  return probas;
}

// dropExamplesFromPool
// Drop if example reached `max_displays`
const deletionCriteriaDisplays = (pool, 
                                  avail_ids, 
                                  del_ids, 
                                  max_displays, 
                                  debug=false) => {
  if (Number.isInteger(max_displays)){
    var i = avail_ids.length;
    while( i-- ){
      if (pool[avail_ids[i]].num_displayed >= max_displays){
        del_ids.push(avail_ids.pop())
      }
    }
    if (debug){console.log("Selected for deletion:", del_ids);}
  }else{
    if (debug){console.log(`max_displays=${max_displays} is not an integer`);}
  }
}

// dropExamplesFromPool
// Drop if example's model scores converged `|delta score|<eps_score_change`
const deletionCriteriaConvergence = (pool, 
                                     avail_ids, 
                                     del_ids, 
                                     eps_score_change, 
                                     debug=false) => {
  if (Number.isFinite(eps_score_change)){
    var i = avail_ids.length;
    while( i-- ){
      if (pool[avail_ids[i]].change_model_score < eps_score_change){
        del_ids.push(avail_ids.pop())
      }
    }
    if (debug){console.log("Selected for deletion:", del_ids);}
  }else{
    if (debug){console.log(`eps_score_change=${eps_score_change} is not a number`);}
  }
}

// dropExamplesFromPool
// Drop examples with overrepresented model scores
const deletionCriteriaDistribution = (pool, 
                                      avail_ids, 
                                      del_ids, 
                                      bin_edges,
                                      target_probas,
                                      debug=false) => {
  // declare variables
  var idx, excess_proba, num_del, bin_ids, disp, conv;
  const num_examples = avail_ids.length;

  if (Array.isArray(target_probas) && Array.isArray(bin_edges)){
    // copy model scores into Array
    var model_scores = [];
    avail_ids.forEach(key => {
      model_scores.push( pool[key]["last_model_score"] );
    });
    // estimate the empirical distribution
    const empirical_probas = histogram(model_scores, bin_edges);
    //console.log(empirical_probas, target_probas)

    // If the empirical proba exceeds the desired proba in a certain bin
    // then randomly pick IDs with model scores of this bin
    for (var j = 0; j < empirical_probas.length; j++){
      // Compute number IDs to delete in this bin
      excess_proba = empirical_probas[j] - target_probas[j];
      num_del = Math.trunc( excess_proba * num_examples );

      if (num_del > 0){
        // find all IDs inside the bin
        bin_ids = [];
        disp = [];
        conv = [];
        avail_ids.forEach(key => {
          var s = pool[key]["last_model_score"];
          var crit1 = (j === 0) ? true : bin_edges[j] < s;
          var crit2 = (j === bin_edges.length - 1) ? true : s <= bin_edges[j+1];
          if( crit1 && crit2 ){
            bin_ids.push(key);
            disp.push(pool[key].num_displayed);
            conv.push(pool[key].change_model_score);
          }
        });

        while (num_del > 0){
          if (num_del % 2){  // delete by display criteria
            idx = disp.indexOf(Math.max(...disp));
          }else{  // delete by convergence criteria
            idx = conv.indexOf(Math.min(...conv));
          }
          // save deletion ID
          avail_ids.splice(avail_ids.indexOf(bin_ids[idx]))
          del_ids.push(bin_ids[idx]);
          // remove tmp data
          bin_ids.splice(idx, 1);
          disp.splice(idx, 1);
          conv.splice(idx, 1);
          num_del -= 1;
        }
        //console.log("Del:", j, num_del, excess_proba)
      }
    }
    if (debug){console.log("Selected for deletion:", del_ids);}
  }else{
    if (debug){console.log(`target_probas and/or bin_edges are not arrays`);}
  }
}

/**
 * (1) Drop examples from pool
 * 
 * @param {JSON} pool 
 * @param {JSON} cfg 
 * 
 * cfg = {
 *  "target_probas": [0.1, 0.2, 0.3, 0.4],
 *  "bin_edges": [.0, .25, .5, .75, 1.],
 *  "max_displays": 10,
 *  "eps_score_change": 1e-6,
 *  "drop_pairs": false
 * }
 * 
 * Explanations
 * - `cfg.drop_pairs`: If the flag is enabled, the all columns and rows of 
 *    the deleted IDs are removed from the paired comparision matrix `pairs`.
 *      - Pros: The memory footprint of `pairs` is limited.
 *      - Con: The training scores are affected.
 *    Dropped pairs are NOT sent to API for backup in `dropExamplesFromPool`
 *    because it would be repeated unnecessarily as the pairs (per use) can 
 *    be computed from the raw evaluations already sent to the server. 
 */
 const dropExamplesFromPool = (cfg, 
                               pool, 
                               min_pool_size=0, 
                               pairs=undefined, 
                               debug=true) => {
  // save IDs to be deletion
  var del_ids = [];
  var avail_ids = Object.keys(pool);
  const max_deletions = avail_ids.length - min_pool_size;

  // identify IDs that should be deleted
  if ( max_deletions > 0 ){
    // (a) Drop examples with overrepresented model scores
    deletionCriteriaDistribution(
      pool, avail_ids, del_ids, cfg.bin_edges, cfg.target_probas, debug);
    // (b) Drop if example reached `max_displays`
    deletionCriteriaDisplays(
      pool, avail_ids, del_ids, cfg.max_displays, debug);
    // (c) Drop if example's model scores converged `|delta score|<eps_score_change`
    deletionCriteriaConvergence(
      pool, avail_ids, del_ids, cfg.eps_score_change, debug);
    // Restrict deletions
    del_ids = del_ids.slice(0, max_deletions);
  }

  if (debug){
    console.log("Deleted data:", deletedData);
  }

  // (Optional) Delete IDs from paired comparision matrix
  del_ids.forEach(key => {
    if (pairs && cfg.drop_pairs){
      delete pairs[key];
      for(var key2 in pairs){
        delete pairs[key2][key]
      }  
    }
  });

  // Copy pool data to buffer
  var deletedData = {}  // API buffer
  del_ids.forEach(key => {
      deletedData[key] = {
        "training_score_history": pool[key].training_score_history,
        "model_score_history": pool[key].model_score_history,
        "displayed": pool[key].displayed
      };
      delete pool[key];
  });

  // return new Promise((resolve, reject) => {
  //   // load other functions and objects
  //   const { getToken } = useAuth();
  //   const { api } = useApi(getToken());
  //   api.post(`v1/bestworst/evaluations`, deletedData)
  //     .then(response => {})
  //     .catch(error => {})
  //     .finally(() => {});
  // });

}

// (2) Add examples to pool
// - Ajax Call to load new sentence examples
// - max_load: The maximum number of sentence examples to add
// - max_pool_size: 
// const addExamplesToPool = (pool,
//                            max_pool_size) => {
//   // precomputations happens immediatly
//   // how many examples to add?
//   var num_load_examples = max_pool_size - Object.keys(pool).length;

//   // asynchron AJAX call
//   return new Promise((resolve, reject) => {
//     if (num_load_examples > 0){
//       // load
//     }
//   });
// }

/**
 * (3) Sample 1,2,3... BWS sets from pool
 * 
 * @param {JSON}  pool 
 * @param {Int}   num_items 
 * @param {Int}   num_preload 
 * @param {Sting} item_sampling_method 
 * @param {Bool}  debug 
 * 
 * Example:
 *  // load settings
 *  const num_items_per_set = ref(4);
 *  const num_preload_bwssets = ref(3);   // settings: Number BWS sets to preload
 *  const item_sampling_method = ref("random"); // "random", "exploit", "newer-unstable"
 *  const debug = false;
 *  // run the code
 *  var sampled_bwssets = sampleBwsSets(
 *    pool, num_items_per_set.value, num_preload_bwssets.value, method.value, debug);
 */
const sampleBwsSets = (pool,
                       num_items,
                       num_preload,
                       item_sampling_method = "newer-unstable",
                       debug = false) => {
  // (A) Compute the number of sentence examples to sample from pool
  var num_examples = Math.max(num_preload, 1) * Math.max(1, num_items - 1);
  num_examples = Math.max(num_items, num_examples);

  if (debug) {
    console.log(`Num of items to sample from pool: ${num_examples}`)
  }

  // (B) Copy all keys (IDs) from pool
  var all_ids = [];
  Object.keys(pool).forEach(key => {
    all_ids.push(key);
  });

  if (debug) {
    console.log(`Current pool size: ${all_ids.length}`);
  }

  // (C) Sort ID Array (all_ids) so that items to pick are at the beginning of the array
  // You must specify the item sampling `method`
  if (item_sampling_method === "random") {
    // Draw random sentence examples from pool (Baseline)
    all_ids.sort(() => (Math.random() > .5) ? 1 : -1);  // shuffle

  } else if (item_sampling_method === "exploit") {
    // Prefer the items with highest model scores
    all_ids.sort((key1, key2) => {
      if (pool[key1].last_model_score < pool[key2].last_model_score) return 1;
      if (pool[key1].last_model_score > pool[key2].last_model_score) return -1;
      return 0;
    });

  } else if (item_sampling_method === "newer-unstable") {
    // Prefer the least displayed sentence examples, and 
    // most fluctuating model scores
    all_ids.sort((key1, key2) => {
      // prefer the least displayed items (ascending)
      if (pool[key1].num_displayed < pool[key2].num_displayed) return -1;
      if (pool[key1].num_displayed > pool[key2].num_displayed) return 1;
      // if same number of displays, prefer most fluctating model scores (descending)
      if (pool[key1].change_model_score < pool[key2].change_model_score) return 1;
      if (pool[key1].change_model_score > pool[key2].change_model_score) return -1;
      return 0;
    });
  }
  // (D) Pick the first `num_examples` items of the sorted ids
  var sampled_ids = all_ids.slice(0, num_examples);

  if (debug) {
    console.log(`sampled_ids.length=${sampled_ids.length}`);
    console.log("Sampled IDs:", sampled_ids);
  }

  // (E) Generate BWS set samples (Sorry for the naming confusion)
  var sampled_bwssets = sampling.sample(sampled_ids, num_items, "overlap", false);

  if (debug) {
    console.log("BWS samples:", sampled_bwssets);
  }

  // done
  return sampled_bwssets;
}


/**
 * (5) Compute the new target scores
 * 
 * @param {JSON}    pairs 
 * @param {JSON}    pool 
 * @param {String}  smoothing_method 
 * @param {Float}   ema_alpha 
 * 
 * Example 1:
 *    computeTrainingScores(pairs, pool, "ema", 0.7);
 * Example 2:
 *    const smoothing_method = ref("ema");
 *    const ema_alpha = 0.7;
 *    computeTrainingScores(pairs, pool, smoothing_method.value, ema_alpha.value);
 */
const computeTrainingScores = (pairs,
                               pool,
                               smoothing_method = "last",
                               ema_alpha = 0.8) => {
  // compute ranking from paired comparisons
  var tmp = ranking.rank(pairs, "ratio", "quantile", "exist");
  var sortedids = tmp[1]
  var scores = tmp[3]

  if (smoothing_method === "last") {
    // add the new training score as last value
    sortedids.forEach((key, idx) => {
      pool[key].training_score_history.push(scores[idx]);
    });

  } else if (smoothing_method === "ema") {
    // add the Exponential MA as the new training score
    sortedids.forEach((key, idx) => {
      console.log(key)
      var idx_last = pool[key].training_score_history.length - 1
      var prev = pool[key].training_score_history[idx_last];
      if (prev === undefined) {
        pool[key].training_score_history.push(scores[idx])
      } else {
        pool[key].training_score_history.push(
          ema_alpha * scores[idx] + (1.0 - ema_alpha) * prev); // <= EMA update formula
      }
    });
  }
}


export const useInteractivity = () => {
  // initialize data variables
  const pool = reactive({});   // key-value database for each sentences
  const pairs = reactive({});  // sparse LIL matrix with paired comparisons
  // const dropped = reactive({});

  // DEMO: fake paired comparisons (DELETE THIS LATER!)
  counting.incr_lil(pairs, "abc", "ghi");
  counting.incr_lil(pairs, "abc", "ghi");
  Object.assign(pairs, {'abc': {'ghi': 1}, 'def': {'ghi': 1}, 'jkl': {'abc': 1, 'def': 1, 'ghi': 1}});

  // DEMO: fake sentence examples (DELETE THIS LATER!)
  for(var key of ["abc", "ghi", "def", "jkl"]){
    pool[key] = {
      features: Array.from({length: 567}, () => Math.random()),
      training_score_history: [undefined, 0.7 + 0.3 * Math.random()],
      model_score_history: [0.5 + 0.1 * Math.random(), 0.6 + 0.1 * Math.random()],
      displayed: [false, false, true],
    };
  }

  // Object.entries(pool).forEach(([key, value]) => {
  //   console.log(key, getLast(value.training_score_history) )
  // })
  
  // Update current metrics
  // We are not using Vue computed to avoid quadratic recomputations
  const updateCurrentPoolMetrics = (pool) => {
    Object.keys(pool).forEach(key => {
      // Number of times an item was displayed
      pool[key]["num_displayed"] = pool[key].displayed.reduce(
        (a,b) => Number(a) + Number(b), 0);
      // Last model score
      pool[key]["last_model_score"] = getLast(pool[key].model_score_history);
      // Model score change
      pool[key]["change_model_score"] = getLastAbsChange(pool[key].model_score_history);
    })
  }
  updateCurrentPoolMetrics(pool);

  // (1) Drop examples from pool
  const min_pool_size = ref(3);
  const drop_config = reactive({
    "target_probas": [0.1, 0.2, 0.3, 0.4],
    "bin_edges": [.0, .25, .5, .75, 1.],
    "max_displays": 1,
    "eps_score_change": 1e-1,
    "drop_pairs": true
  })
  //dropExamplesFromPool(drop_config, pool, min_pool_size.value, pairs);

  // (2) Add examples to pool
  //addExamplesToPool();


  // (3) Sample 1,2,3... BWS sets from pool
  const num_items_per_set = ref(3);
  const num_preload_bwssets = ref(3);   // settings: Number BWS sets to preload
  const item_sampling_method = ref("random"); // "random", "exploit", "newer-unstable"
  // var sampled_bwssets = sampleBwsSets(
  //   pool, num_items_per_set.value, num_preload_bwssets.value, 
  //   item_sampling_method.value, false);
  // console.log("BWS samples:", sampled_bwssets);


  // (4) Update pairs comparison matrix


  // (5) Compute the new target scores
  const smoothing_method = ref("ema");
  const ema_alpha = 0.7;
  // computeTrainingScores(pairs, pool, smoothing_method.value, ema_alpha.value);


  // (6) Re-train the ML model

  // (7) Predict the new model scores for the whole pool

  // Go to (1)
  return { 
    pool, 
    pairs,
    dropExamplesFromPool, drop_config, min_pool_size,
    sampleBwsSets, num_items_per_set, num_preload_bwssets, item_sampling_method,
    computeTrainingScores, smoothing_method, ema_alpha
  }
}
