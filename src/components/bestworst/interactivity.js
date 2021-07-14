import { reactive, ref, watch } from 'vue';
import { sampling, ranking } from 'bwsample';  // counting
import { useApi, useAuth } from '@/functions/axios-evidence.js';
// import { v4 as uuid4 } from 'uuid'; // nur für dev
import { useBwsSettings } from '@/components/bestworst/bws-settings.js';
import { useQueue } from '@/components/bestworst/queue.js';
import { useGeneralSettings } from '@/components/settings/general-settings.js';


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
 * Computes the Density (PDF) for a given histogram bin
 * 
 * Example:
 * --------
 *    const data = Array.from({length: 40}, () => Math.random())
 *    const bin_edges = [.1, .25, .5, .75, 9.].sort()
 *    const probas = histpdf(data, bin_edges)
 */
const histpdf = (data, bin_edges) => {
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


/**
 * Filter IDs from the `pool` that have been shown to the user at 
 * least `max_displays` times. Move these IDs to the deletion list.
 * 
 * @param {JSON}      pool          see `useInteractivity`
 * @param {Array[ID]} avail_ids     List with unprocessed IDs
 * @param {Array[ID]} del_ids       List with IDs to be deleted
 * @param {Int}       max_displays  Maximum number of times an example should be displayed to the user
 * @param {Bool}      debugVerbose         (Optional) Flag to print logging info
 * 
 * Notes:
 * ------
 *  - This function is only used in `useInteractity/dropExamplesFromPool`
 */
const deletionCriteriaDisplays = (pool, 
                                  avail_ids, 
                                  del_ids, 
                                  max_displays, 
                                  debugVerbose=false) => {
  if (Number.isInteger(max_displays)){
    var i = avail_ids.length;
    while( i-- ){
      if (pool[avail_ids[i]].num_displayed >= max_displays){
        del_ids.push(avail_ids.pop())
      }
    }
    if (debugVerbose){console.log("Selected for deletion (Max Displays):", del_ids);}
  }else{
    if (debugVerbose){console.log(`max_displays=${max_displays} is not an integer`);}
  }
}


/**
 * Filter IDs from the `pool` if its model scores converged, i.e. 
 * `|delta score|<eps_score_change`. Move these IDs to the deletion list.
 * 
 * @param {JSON}      pool          see `useInteractivity`
 * @param {Array[ID]} avail_ids     List with unprocessed IDs
 * @param {Array[ID]} del_ids       List with IDs to be deleted
 * @param {Float}     eps_score_change   Abort criteria for model score changes
 * @param {Bool}      debugVerbose         (Optional) Flag to print logging info
 * 
 * Notes:
 * ------
 *  - This function is only used in `useInteractity/dropExamplesFromPool`
 */
 const deletionCriteriaConvergence = (pool, 
                                      avail_ids, 
                                      del_ids, 
                                      eps_score_change, 
                                      debugVerbose=false) => {
  if (Number.isFinite(eps_score_change)){
    var i = avail_ids.length;
    while( i-- ){
      if (pool[avail_ids[i]].change_model_score < eps_score_change){
        del_ids.push(avail_ids.pop())
      }
    }
    if (debugVerbose){console.log("Selected for deletion (Covergence):", del_ids);}
  }else{
    if (debugVerbose){console.log(`eps_score_change=${eps_score_change} is not a number`);}
  }
}


/**
 * Filter IDs if their training scores are overrepresented in the pool.
 * The purpose is to maintain a balanced training set. Move these IDs to 
 * the deletion list.
 * 
 * @param {JSON}      pool          see `useInteractivity`
 * @param {Array[ID]} avail_ids     List with unprocessed IDs
 * @param {Array[ID]} del_ids       List with IDs to be deleted
 * @param {Array}     bin_edges     The bin edges of the histogram, e.g. [0.0, ..., 1.0]
 * @param {Array}     target_probas The desired densities for each bin
 * @param {Bool}      debugVerbose         (Optional) Flag to print logging info
 * 
 * Notes:
 * ------
 *  - This function is only used in `useInteractity/dropExamplesFromPool`
 */
const deletionCriteriaDistribution = (pool, 
                                      avail_ids, 
                                      del_ids, 
                                      bin_edges,
                                      target_probas,
                                      debugVerbose=false) => {
  // declare variables
  var idx, excess_proba, num_del, bin_ids, disp, conv;
  const num_examples = avail_ids.length;

  if (Array.isArray(target_probas) && Array.isArray(bin_edges)){
    // copy model scores into Array
    var model_scores = [];
    avail_ids.forEach(key => {
      model_scores.push( pool[key]["last_training_score"] );
    });
    // estimate the empirical distribution
    const empirical_probas = histpdf(model_scores, bin_edges);
    // console.log(empirical_probas, target_probas)

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
          var s = pool[key]["last_training_score"];
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
    if (debugVerbose){console.log("Selected for deletion (Distribution):", del_ids);}
  }else{
    if (debugVerbose){console.log(`target_probas and/or bin_edges are not arrays`);}
  }
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
    Object.keys(pool).forEach(key => {
      var idx = sortedids.indexOf(key);
      pool[key].training_score_history.push(scores[idx]);
    });

  } else if (smoothing_method === "ema") {
    // add the Exponential MA as the new training score
    Object.keys(pool).forEach(key => {
      var idx = sortedids.indexOf(key);
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
  // Initialize data variables
  const pool = reactive({});   // key-value database for each sentences
  const pairs = reactive({});  // sparse LIL matrix with paired comparisons
  const isPoolInitiallyLoaded = ref(false);  // For `flagInitialLoadOnly`. Reset in `onSearchLemmata`
  const deletedPool = reactive({});

  // Informational variables
  const errorMessage = ref("");

  // Load General Settings
  const { hasDataDonationConsent, debugVerbose, loadGeneralSettings } = useGeneralSettings();
  loadGeneralSettings();

  // Load Interactivity Settings
  const {
    // Settings for (1) and (2), e.g. dropExamplesFromPool, addExamplesToPool
    flagInitialLoadOnly,
    min_pool_size, max_pool_size,
    flagDropDistribution, flagAddDistribution, bin_edges, target_probas, 
    // Settings for (1) and (3)
    flagDropMaxDisplay, flagExcludeMaxDisplay, max_displays, 
    // Settings for (1)
    flagDropConverge, eps_score_change,
    flagDropPairs,
    // Settings for (3), e.g. sampleBwsSets
    num_items_per_set, num_preload_bwssets, 
      bws_sampling_method, item_sampling_method,
    // Settings for (5), e.g. computeTrainingScores
    // smoothing_method, ema_alpha
    loadBwsSettings
  } = useBwsSettings();
  loadBwsSettings();

  
  // Update current metrics
  // We are not using Vue computed to avoid quadratic recomputations
  const updateCurrentPoolMetrics = (pool) => {
    Object.keys(pool).forEach(key => {
      // Number of times an item was displayed
      pool[key]["num_displayed"] = pool[key].displayed.reduce(
        (a,b) => Number(a) + Number(b), 0);
      // Last training score
      pool[key]["last_training_score"] = getLast(pool[key].training_score_history);
      // Last model score
      pool[key]["last_model_score"] = getLast(pool[key].model_score_history);
      // Model score change
      pool[key]["change_model_score"] = getLastAbsChange(pool[key].model_score_history);
    })
  }
  updateCurrentPoolMetrics(pool);

  
  /**
   * (1) Drop examples from pool
   * 
   * Global Variables:
   * -----------------
   * @param {JSON}  pool 
   * @param {JSON}  pairs 
   * @param {Bool}  debugVerbose 
   * @param {Int}   min_pool_size 
   * @param {Array} target_probas
   * @param {Array} bin_edges
   * @param {Int}   max_displays
   * @param {Float} eps_score_change
   * @param {Bool}  flagDropPairs
   * 
   * Examples:
   * ---------
   * const min_pool_size = ref(10);
   * const target_probas = reactive({value: [0.1, 0.2, 0.3, 0.4]});
   * const bin_edges = reactive({value: [.0, .25, .5, .75, 1.]});
   * const max_displays = ref(1);
   * const eps_score_change = ref(1e-1);
   * const flagDropPairs = ref(false);
   * 
   * Required Functions:
   * -------------------
   *  - deletionCriteriaDistribution
   *  - deletionCriteriaDisplays
   *  - deletionCriteriaConvergence
   * 
   * Explanations:
   * -------------
   * - `drop_config.flagDropPairs`: If the flag is enabled, the all columns and 
   *    rows of the deleted IDs are removed from the paired comparision matrix
   *    `pairs`.
   *      - Pros: The memory footprint of `pairs` is limited.
   *      - Con: The training scores are affected.
   *    Dropped pairs are NOT sent to API for backup in `dropExamplesFromPool`
   *    because it would be repeated unnecessarily as the pairs (per use) can 
   *    be computed from the raw evaluations already sent to the server. 
   */
  const dropExamplesFromPool = () => {
    // save IDs to be deletion
    var del_ids = [];
    var avail_ids = Object.keys(pool);
    const max_deletions = avail_ids.length - min_pool_size.value;

    // identify IDs that should be deleted
    if ( max_deletions > 0 ){
      // (a) Drop examples with overrepresented training scores
      if (flagDropDistribution.value){
        deletionCriteriaDistribution(
          pool, avail_ids, del_ids, bin_edges.value, target_probas.value, debugVerbose.value);
      }
      // (b) Drop if example reached `max_displays`
      if (flagDropMaxDisplay.value){
        deletionCriteriaDisplays(
          pool, avail_ids, del_ids, max_displays.value, debugVerbose.value);
      }
      // (c) Drop if example's model scores converged `|delta score|<eps_score_change`
      if (flagDropConverge.value){
        deletionCriteriaConvergence(
          pool, avail_ids, del_ids, eps_score_change.value, debugVerbose.value);
      }
      // Restrict deletions
      del_ids = del_ids.slice(0, max_deletions);
    }

    // (Optional) Delete IDs from paired comparision matrix
    del_ids.forEach(key => {
      if (flagDropPairs.value){
        delete pairs[key];
        for(var key2 in pairs){
          delete pairs[key2][key]
        }  
      }
    });

    // Copy pool data to buffer
    // var deletedData = {}  // API buffer
    del_ids.forEach(key => {
      deletedPool[key] = {
        "training_score_history": JSON.parse(JSON.stringify(pool[key].training_score_history)),
        "model_score_history": JSON.parse(JSON.stringify(pool[key].model_score_history)),
        "displayed": JSON.parse(JSON.stringify(pool[key].displayed))
      };
      delete pool[key];
    });

    if (debugVerbose.value){
      console.log("Deleted data:", JSON.parse(JSON.stringify(deletedPool)) );
    }
  }

  /**
   * (1b) Send deleted pool data to API/DB
   * - Start asynchronous AJAX request to backup deleted examples
   * - Storing app data to the API/DB works only if `hasDataDonationConsent` is true
   */
  const saveDeletedPool = () => {
    return new Promise((resolve, reject) => {
      if (hasDataDonationConsent.value){
        // load other functions and objects
        const { getToken } = useAuth();
        const { api } = useApi(getToken());
        // Start API request
        api.post(`v1/interactivity/deleted-episodes`, JSON.parse(JSON.stringify(deletedPool)) )
          .then(response => {
            response.data['stored-sentids'].forEach(key => {
              delete deletedPool[key];
            })
            if(debugVerbose.value){console.log(response)}
            resolve(response);
          })
          .catch(error => {
            if(debugVerbose.value){console.log(error)}
            reject(error);
          })
          .finally(() => {        
          });
      }else{
        // just delete the data permanently
        Object.keys(deletedPool).forEach(key => {
          delete deletedPool[key];
        });
        if(debugVerbose.value){console.log("Dropped pool examples permanently because hasConsent=false.")}
      }
    });
  }

  /**
   * (1c) watch `deletedPool` to trigger sync with API/DB
   */
  watch(
    () => Object.keys(deletedPool).length,
    (num_deleted_examples) => {
      if (num_deleted_examples > 0){
        if(debugVerbose.value){console.log(`try to store ${num_deleted_examples} deleted example(s)`)}
        saveDeletedPool();
      }
    }
  );


  /**
   * (2a) Add examples to pool
   * 
   * Global Variables:
   * -----------------
   * @param {JSON}    pool 
   * @param {String}  errorMessage
   * @param {Int}     max_pool_size
   * @param {Int}     max_displays
   * 
   * Example:
   * --------
   *  // watch `pool` to trigger sync with API/DB
   *  watch( () => Object.keys(pool).length, (current_pool_size) => {
   *    if (current_pool_size < max_pool_size.value){
   *      if(debugVerbose.value){console.log(`Only examples ${current_pool_size} in pool.`)}
   *        addExamplesToPool(searchlemmata.value);
   *  }  });
   */
  const addExamplesToPool = (lemmata) => {
    // not implemented
    if(debugVerbose.value){console.log("Not implemented: ", flagAddDistribution.value);}
    if(debugVerbose.value){console.log("Not implemented: ", flagInitialLoadOnly.value);}

    return new Promise((resolve, reject) => {
      // replenish pool with sentence examples
      const num_additions = max_pool_size.value - Object.keys(pool).length;

      if (num_additions > 0  &&  !(flagInitialLoadOnly.value && isPoolInitiallyLoaded.value) ){
        // settings
        var params = {
          "lemmata": lemmata.split(',').map(s => s.trim()),
          //"exclude_deleted_ids": true,
          "max_displays": max_displays.value,
        }

        // load API conn
        const { getToken } = useAuth();
        const { api } = useApi(getToken());
        // start AJAX call
        api.post(`v1/interactivity/training-examples/${num_additions}/100/0`, params)
          .then(response => {
            if ('msg' in response.data){
              errorMessage.value = response.data['msg'];
            } else {
              response.data.forEach(row => {
                pool[row.id] = {
                  "text": row.text,
                  "spans": row.spans,
                  "context": row.context,
                  "features": row.features,
                  "training_score_history": [undefined],
                  "model_score_history": [row.score],
                  "displayed": [false]
                }
              })
            }
            if(debugVerbose.value){console.log(response)}
            resolve(response);
          })
          .catch(error => {
            if(debugVerbose.value){console.log(error)}
            reject(error);
          })
          .finally(() => {
            isPoolInitiallyLoaded.value = true;  // for `flagInitialLoadOnly`
            updateCurrentPoolMetrics(pool);  // compute current metrics manually
          });
      }  
    });
  }

  /**
   * (2b) Reset the pool
   * - Call this function if a new lemma search was submitted (e.g. in `onSearchLemmata`)
   */
  const resetPool = () => {
    // set the initial loading flag to false
    isPoolInitiallyLoaded.value = false;
    // delete pool data
    Object.keys(pool).forEach(key => {delete pool[key];});
    // delete pairs matrix
    Object.keys(pairs).forEach(key => {delete pairs[key];});
  }


  /**
   * (2c) watch `pool` to trigger sync with API/DB
   */
  const { searchlemmata } = useQueue();
  watch( () => Object.keys(pool).length, (current_pool_size) => {
    if (current_pool_size < max_pool_size.value && searchlemmata.value){
      if(debugVerbose.value){console.log(`Only examples ${current_pool_size} in pool.`)}
      addExamplesToPool(searchlemmata.value);
    }
  });


  /**
   * (3) Sample 1,2,3... BWS sets from pool
   * 
   * Global Variables:
   * -----------------
   * @param {JSON}  pool 
   * @param {Int}   num_items_per_set 
   * @param {Int}   num_preload_bwssets 
   * @param {Sting} item_sampling_method 
   * @param {Bool}  debugVerbose 
   * 
   * Example:
   * --------
   *  // load settings
   *  const num_items_per_set = ref(4);
   *  const num_preload_bwssets = ref(3);   // settings: Number BWS sets to preload
   *  const item_sampling_method = ref("random"); // "random", "exploit", "newer-unstable"
   *  const debugVerbose = false;
   *  // run the code
   *  var sampled_bwssets = sampleBwsSets();
   */
  const sampleBwsSets = () => {
    // (0) Ensure that the metrics are recomputed
    updateCurrentPoolMetrics(pool);

    // (A) Compute the number of sentence examples to sample from pool
    var num_examples = Math.max(num_preload_bwssets.value, 1) * Math.max(1, num_items_per_set.value - 1);
    num_examples = Math.max(num_items_per_set.value, num_examples);

    if (debugVerbose.value) {
      console.log(`Num of items to sample from pool: ${num_examples}`)
    }

    // (B) Copy keys (IDs) from pool
    var all_ids = [];
    if (flagExcludeMaxDisplay){
      // Remove IDs that have been shown too often
      Object.keys(pool).forEach(key => {
        if (pool[key].num_displayed < max_displays.value){
          all_ids.push(key)
        }
      });
    }else{
      // just copy all IDs from pool
      all_ids = Object.keys(pool);
    }

    // (C) Sort ID Array (all_ids) so that items to pick are at the beginning of the array
    // You must specify the item sampling `method`
    if (item_sampling_method.value === "random") {
      // Draw random sentence examples from pool (Baseline)
      all_ids.sort(() => (Math.random() > .5) ? 1 : -1);  // shuffle

    } else if (item_sampling_method.value === "exploit") {
      // Prefer the items with highest model scores
      all_ids.sort((key1, key2) => {
        if (pool[key1].last_model_score < pool[key2].last_model_score) return 1;
        if (pool[key1].last_model_score > pool[key2].last_model_score) return -1;
        return 0;
      });

    } else if (item_sampling_method.value === "newer-unstable") {
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

    if (debugVerbose.value) {
      console.log(`sampled_ids.length=${sampled_ids.length}`);
      console.log("Sampled IDs:", sampled_ids);
    }

    // (E) Generate BWS set samples (Sorry for the naming confusion)
    var sampled_bwssets = sampling.sample(
      sampled_ids, num_items_per_set.value, bws_sampling_method.value, false);

    if (debugVerbose.value) {
      console.log("BWS samples:", sampled_bwssets);
    }

    // done
    return sampled_bwssets;
  }


  // (4) Update pairs comparison matrix


  // (5) Compute the new target scores
  // const smoothing_method = ref("ema");
  // const ema_alpha = 0.7;
  // computeTrainingScores(pairs, pool, smoothing_method.value, ema_alpha.value);


  // (6) Re-train the ML model

  // (7) Predict the new model scores for the whole pool

  // Go to (1)
  return { 
    errorMessage,
    pool, pairs, resetPool,
    dropExamplesFromPool, addExamplesToPool,
    sampleBwsSets, 
    computeTrainingScores, 
  }
}
