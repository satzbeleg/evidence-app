import { reactive, ref } from 'vue';
import { sampling, counting, ranking } from 'bwsample';

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

  Object.entries(pool).forEach(([key, value]) => {
    console.log(key, getLast(value.training_score_history) )
  })

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

  // (2) Add examples to pool
  // - Ajax Call to load new sentence examples
  // - max_load: The maximum number of sentence examples to add
  // - max_pool_size: 


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
    sampleBwsSets, num_items_per_set, num_preload_bwssets, item_sampling_method,
    computeTrainingScores, smoothing_method, ema_alpha
  }
}
