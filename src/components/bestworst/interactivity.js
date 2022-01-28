import { reactive, ref, watch, unref } from 'vue';
import { sampling, counting, ranking } from 'bwsample';
import { histpdf } from 'histpdf';
import { useApi2, useAuth } from '@/functions/axios-evidence.js';
// import { v4 as uuid4 } from 'uuid'; // nur für dev
import { useBwsSettings } from '@/components/bestworst/bws-settings.js';
import { useQueue } from '@/components/bestworst/queue.js';
import { useGeneralSettings } from '@/components/settings/general-settings.js';
import * as tf from '@tensorflow/tfjs';


const getLast = (arr) => {
  if (arr.length  > 0){
    return arr[arr.length - 1];
  }else{
    return undefined
  }
}

const getNextToLast = (arr) => {
  if (arr.length  > 1){
    return arr[arr.length - 2];
  }else{
    return undefined
  }
}

const getLastAbsChange = (arr) => {
  if (arr.length  > 1){
    return Math.abs(arr[arr.length - 1] - arr[arr.length - 2]);
  }else{
    return undefined
  }
}


/**
 * Filter IDs from the `pool` that have been shown to the user at 
 * least `max_displays` times. Move these IDs to the deletion list.
 * 
 * @param {JSON}      pool          see `useInteractivity`
 * @param {Array[ID]} avail_ids     List with unprocessed IDs
 * @param {Array[ID]} del_ids       List with IDs to be deleted
 * @param {Int}       max_displays  Maximum number of times an example should be displayed to the user
 * @param {Bool}      debug_verbose         (Optional) Flag to print logging info
 * 
 * Notes:
 * ------
 *  - This function is only used in `useInteractity/dropExamplesFromPool`
 */
const deletionCriteriaDisplays = (pool, 
                                  avail_ids, 
                                  del_ids, 
                                  max_displays, 
                                  debug_verbose=false) => {
  // logging
  if(debug_verbose.value){
    console.log(`deletionCriteriaDisplays: max_displays=${max_displays}`);
  }
  // abort if param is missing
  if ( !Number.isInteger(max_displays) ){
    console.warn(`deletionCriteriaDisplays: max_displays=${max_displays} is not an integer`);
    return
  }
  // run it
  var i = avail_ids.length;
  while( i-- ){
    if (pool[avail_ids[i]].num_displayed >= max_displays){
      del_ids.push(avail_ids.pop())
    }
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
 * @param {Int}       patience      Number model evaluations to wait before applying this criteria 
 * @param {Bool}      debug_verbose (Optional) Flag to print logging info
 * 
 * Notes:
 * ------
 *  - This function is only used in `useInteractity/dropExamplesFromPool`
 */
const deletionCriteriaConvergence = (pool, 
                                     avail_ids, 
                                     del_ids, 
                                     eps_score_change, 
                                     patience=0,
                                     debug_verbose=false) => {
  // logging
  if(debug_verbose.value){
    console.log(`deletionCriteriaConvergence: eps_score_change=${eps_score_change}`);
  }
  // abort if param is missing
  if ( !Number.isFinite(eps_score_change) ){
    console.warn(`deletionCriteriaConvergence: eps_score_change=${eps_score_change} is not a number`);
    return 
  }
  // run it 
  var i = avail_ids.length;
  while( i-- ){
    if (pool[avail_ids[i]].model_score_history.length > patience){
      if (pool[avail_ids[i]].change_model_score < eps_score_change){
        del_ids.push(avail_ids.pop())
      }
    }
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
 * @param {Bool}      debug_verbose         (Optional) Flag to print logging info
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
                                      debug_verbose=false) => {
  // logging
  if(debug_verbose.value){
    console.log(`deletionCriteriaDistribution:`);
    console.log(`- bin_edges=${bin_edges}`);
    console.log(`- target_probas=${target_probas}`);
  }
  // abort if param is missing
  if ( !Array.isArray(bin_edges) || !Array.isArray(target_probas) ){
    console.warn(`deletionCriteriaDistribution: bin_edges=${bin_edges} or/and target_probas=${target_probas} are not Arrays`);
    return 
  }
  // declare variables
  var idx, excess_proba, num_del, bin_ids, disp, conv;
  const num_examples = avail_ids.length;

  // copy model scores into Array
  var model_scores = [];
  avail_ids.forEach(key => {
    model_scores.push( pool[key]["last_training_score"] );
  });
  // estimate the empirical distribution
  const empirical_probas = histpdf(model_scores, bin_edges);
  if(debug_verbose.value){
    console.log(`- empirical_probas=${empirical_probas}`);
  }

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
}


export const useInteractivity = () => {
  // Initialize data variables
  const pool = reactive({});   // key-value database for each sentences
  const pairs = reactive({});  // sparse LIL matrix with paired comparisons
  const is_pool_initially_loaded = ref(false);  // For `initial_load_only`. Reset in `onSearchLemmata`
  const deleted_pool = reactive({});

  // Informational variables
  const error_message = ref("");

  // Load General Settings
  const { 
    has_data_donation_consent, 
    debug_verbose, 
    loadGeneralSettings 
  } = useGeneralSettings();
  loadGeneralSettings();

  // Load Interactivity Settings
  const {
    item_sampling_numtop, 
    item_sampling_offset,
    // Settings for (1) and (2), e.g. dropExamplesFromPool, addExamplesToPool
    initial_load_only,
    min_pool_size, 
    max_pool_size,
    drop_distribution, 
    add_distribution, 
    bin_edges, 
    target_probas, 
    // Settings for (1) and (3)
    drop_max_display, 
    exclude_max_display, 
    max_displays, 
    // Settings for (1)
    drop_converge, 
    eps_score_change,
    converge_patience,
    drop_pairs,
    // Settings for (3), e.g. sampleBwsSets
    bwsset_num_items, 
    num_preload_bwssets, 
    bwsset_sampling_method, 
    item_sampling_method,
    // Settings for (5), e.g. computeTrainingScores
    smoothing_method, 
    ema_alpha,
    loadBwsSettings,
    // Settings for (6): retrainModel
    train_optimizer,
    train_lrate, 
    train_epochs,
    train_loss,
    train_minsample
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
   * @param {Bool}  debug_verbose 
   * @param {Int}   min_pool_size 
   * @param {Array} target_probas
   * @param {Array} bin_edges
   * @param {Int}   max_displays
   * @param {Float} eps_score_change
   * @param {Bool}  drop_pairs
   * 
   * Examples:
   * ---------
   * const min_pool_size = ref(10);
   * const target_probas = reactive({value: [0.1, 0.2, 0.3, 0.4]});
   * const bin_edges = reactive({value: [.0, .25, .5, .75, 1.]});
   * const max_displays = ref(1);
   * const eps_score_change = ref(1e-1);
   * const drop_pairs = ref(false);
   * 
   * Required Functions:
   * -------------------
   *  - deletionCriteriaDistribution
   *  - deletionCriteriaDisplays
   *  - deletionCriteriaConvergence
   * 
   * Explanations:
   * -------------
   * - `drop_config.drop_pairs`: If the flag is enabled, the all columns and 
   *    rows of the deleted IDs are removed from the paired comparision matrix
   *    `pairs`.
   *      - Pros: The memory footprint of `pairs` is limited.
   *      - Con: The training scores are affected.
   *    Dropped pairs are NOT sent to API for backup in `dropExamplesFromPool`
   *    because it would be repeated unnecessarily as the pairs (per use) can 
   *    be computed from the raw evaluations already sent to the server. 
   */
  const dropExamplesFromPool = () => {
    // logging
    if (debug_verbose.value){
      console.group();
      console.log("(1) Drop examples from pool (dropExamplesFromPool)");
    }
    // save IDs to be deletion
    var del_ids = [];
    var avail_ids = Object.keys(pool);
    const max_deletions = avail_ids.length - min_pool_size.value;

    // identify IDs that should be deleted
    if ( max_deletions > 0 ){
      // (a) Drop examples with overrepresented training scores
      if (drop_distribution.value){
        deletionCriteriaDistribution(
          pool, avail_ids, del_ids, bin_edges.value, target_probas.value, debug_verbose.value);
      }
      // (b) Drop if example reached `max_displays`
      if (drop_max_display.value){
        deletionCriteriaDisplays(
          pool, avail_ids, del_ids, max_displays.value, debug_verbose.value);
      }
      // (c) Drop if example's model scores converged `|delta score|<eps_score_change`
      if (drop_converge.value){
        deletionCriteriaConvergence(
          pool, avail_ids, del_ids, eps_score_change.value, converge_patience.value, debug_verbose.value);
      }
      // Restrict deletions
      del_ids = del_ids.slice(0, max_deletions);
    }

    // (Optional) Delete IDs from paired comparision matrix
    del_ids.forEach(key => {
      if (drop_pairs.value){
        delete pairs[key];
        for(var key2 in pairs){
          delete pairs[key2][key]
        }  
      }
    });

    // Copy pool data to buffer
    // var deletedData = {}  // API buffer
    del_ids.forEach(key => {
      deleted_pool[key] = {
        "training_score_history": JSON.parse(JSON.stringify(pool[key].training_score_history)),
        "model_score_history": JSON.parse(JSON.stringify(pool[key].model_score_history)),
        "displayed": JSON.parse(JSON.stringify(pool[key].displayed))
      };
      delete pool[key];
    });
    // logging
    if (debug_verbose.value){
      console.log("Deleted data:", JSON.parse(JSON.stringify(deleted_pool)) );
      console.groupEnd();
    }
  }


  /**
   * (1b) Send deleted pool data to API/DB
   * - Start asynchronous AJAX request to backup deleted examples
   * - Storing app data to the API/DB works only if `has_data_donation_consent` is true
   */
  const saveDeletedPool = () => {
    // logging
    if (debug_verbose.value){
      console.group();
      console.log("(1b) Send deleted pool data to API/DB (saveDeletedPool)");
      if( has_data_donation_consent.value ){
        console.log(`try to store ${Object.keys(deleted_pool).length} deleted example(s)`);
      }else{
        console.log(`Drop pool examples permanently because has_data_donation_consent=${has_data_donation_consent}`)
      }
      console.groupEnd();
    }
    return new Promise((resolve, reject) => {
      // save data
      if (has_data_donation_consent.value){
        // load other functions and objects
        const { getToken } = useAuth();
        const { api } = useApi2(getToken());
        // Start API request
        api.post(`v1/interactivity/deleted-episodes`, JSON.parse(JSON.stringify(deleted_pool)) )
          .then(response => {
            response.data['stored-sentids'].forEach(key => {
              delete deleted_pool[key];
            })
            if(debug_verbose.value){console.log("Response (saveDeletedPool): ", response)}
            resolve(response);
          })
          .catch(error => {
            if(debug_verbose.value){console.log("Error (saveDeletedPool): ", error)}
            reject(error);
          })
          .finally(() => {        
          });
      }else{
        // just delete the data permanently
        Object.keys(deleted_pool).forEach(key => {
          delete deleted_pool[key];
        });
      }
    });
  }
  /**
   * (1b) watch `deleted_pool` to trigger sync with API/DB
   */
   watch(
    () => Object.keys(deleted_pool).length,
    (num_deleted_examples) => {
      if (num_deleted_examples > 0){
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
   * @param {String}  error_message
   * @param {Int}     max_pool_size
   * @param {Int}     max_displays
   * 
   * Example:
   * --------
   *  // watch `pool` to trigger sync with API/DB
   *  watch( () => Object.keys(pool).length, (current_pool_size) => {
   *    if (current_pool_size < max_pool_size.value){
   *      if(debug_verbose.value){console.log(`Only examples ${current_pool_size} in pool.`)}
   *        addExamplesToPool(searchlemmata.value);
   *  }  });
   */
  const addExamplesToPool = (lemmata) => {
    // logging
    if (debug_verbose.value){
      console.group();
      console.log("(2a) Add examples to pool (addExamplesToPool)");
      console.log(`- current_pool_size=${Object.keys(pool).length}`);
      console.log(`- max_pool_size=${max_pool_size.value}`);
      console.log(`- num_additions=${max_pool_size.value - Object.keys(pool).length}`);
      console.log(`- item_sampling_numtop=${item_sampling_numtop.value}`);
      console.log(`- item_sampling_offset=${item_sampling_offset.value}`);
      console.log(`- searchlemmata=${lemmata}`);
      console.log(`- initial_load_only=${initial_load_only.value}`)
      console.log(`- is_pool_initially_loaded=${is_pool_initially_loaded.value}`)
      console.log(`- max_displays=${max_displays.value}`);
      console.log(`- N.A.: add_distribution=${add_distribution.value}`);
      console.groupEnd();
    }
    return new Promise((resolve, reject) => {
      // replenish pool with sentence examples
      const num_additions = max_pool_size.value - Object.keys(pool).length;

      if (num_additions > 0  &&  !(initial_load_only.value && is_pool_initially_loaded.value) ){
        // settings
        var params = {
          "lemmata": lemmata.split(',').map(s => s.trim()),
          //"exclude_deleted_ids": true,
          "max_displays": max_displays.value,
        }

        // load API conn
        const { getToken } = useAuth();
        const { api } = useApi2(getToken());
        // start AJAX call
        api.post(`v1/interactivity/training-examples/${num_additions}/${unref(item_sampling_numtop)}/${unref(item_sampling_offset)}`, params)
          .then(response => {
            if ('msg' in response.data){
              error_message.value = response.data['msg'];
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
            if(debug_verbose.value){console.log("Response (addExamplesToPool): ", response)}
            resolve(response);
          })
          .catch(error => {
            if(debug_verbose.value){console.log("Error (addExamplesToPool): ", error)}
            reject(error);
          })
          .finally(() => {
            is_pool_initially_loaded.value = true;  // for `initial_load_only`
            updateCurrentPoolMetrics(pool);  // compute current metrics manually
        });
      }
    });
  }
  /**
   * (2a) watch `pool` to trigger sync with API/DB
   */
  const { searchlemmata } = useQueue();
  watch( 
    () => Object.keys(pool).length, 
    (current_pool_size) => {
      if (current_pool_size < max_pool_size.value && searchlemmata.value){
        addExamplesToPool(searchlemmata.value);
      }
      if(debug_verbose.value){console.log(`new_pool_size=${current_pool_size}`)}
    }
  );

  
  /**
   * (2b) Reset the pool
   * - Call this function if a new lemma search was submitted (e.g. in `onSearchLemmata`)
   */
  const resetPool = () => {
    // logging
    if (debug_verbose.value){
      console.group();
      console.log("(2b) Reset the pool (resetPool)")
    }

    // set the initial loading flag to false
    is_pool_initially_loaded.value = false;
    // delete pool data
    Object.keys(pool).forEach(key => {delete pool[key];});
    // delete pairs matrix
    Object.keys(pairs).forEach(key => {delete pairs[key];});

    // logging
    if (debug_verbose.value){
      console.groupEnd();
    }
  }


  /**
   * (3) Sample 1,2,3... BWS sets from pool
   * 
   * Global Variables:
   * -----------------
   * @param {JSON}  pool 
   * @param {Int}   bwsset_num_items 
   * @param {Int}   num_preload_bwssets 
   * @param {String} item_sampling_method 
   * @param {Bool}  debug_verbose 
   * 
   * Example:
   * --------
   *  // load settings
   *  const bwsset_num_items = ref(4);
   *  const num_preload_bwssets = ref(3);   // settings: Number BWS sets to preload
   *  const item_sampling_method = ref("random"); // "random", "exploit", "newer-unstable"
   *  const debug_verbose = false;
   *  // run the code
   *  var sampled_bwssets = sampleBwsSets();
   */
  const sampleBwsSets = () => {
    // logging
    if (debug_verbose.value){
      console.group();
      console.log("(3) Sample 1,2,3... BWS sets from pool (sampleBwsSets)")
    }

    // (0) Ensure that the metrics are recomputed
    updateCurrentPoolMetrics(pool);

    // (A) Compute the number of sentence examples to sample from pool
    var num_examples = Math.max(num_preload_bwssets.value, 1) * Math.max(1, bwsset_num_items.value - 1);
    num_examples = Math.max(bwsset_num_items.value, num_examples);

    if (debug_verbose.value) {
      console.log(`- Num of items to sample from pool: ${num_examples}`)
    }

    // (B) Copy keys (IDs) from pool
    var all_ids = [];
    if (exclude_max_display){
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

    if (debug_verbose.value) {
      // console.log(`- sampled_ids.length=${sampled_ids.length}`);
      console.log("- Sampled IDs:", sampled_ids);
    }

    // (E) Generate BWS set samples (Sorry for the naming confusion)
    var sampled_bwssets = sampling.sample(
      sampled_ids, bwsset_num_items.value, bwsset_sampling_method.value, false);

    // logging
    if (debug_verbose.value) {
      console.log("- BWS samples:", sampled_bwssets);
      console.groupEnd()
    }

    // done
    return sampled_bwssets;
  }


  /**
   * (4) Update pairs comparison matrix
   * 
   * @param {*} data 
   */
  const updatePairMatrix = (data) => {
    // logging
    if (debug_verbose.value){
      console.group();
      console.log("(4) Update pairs comparison matrix (updatePairMatrix)")
    }

    // start update of `pairs` object
    let agg =  {};
    data.evaluated.forEach(bwsset => {
      if(bwsset['status-bestworst4'] === undefined){
        let tmp = getLast(bwsset['event-history']);
        if(tmp['message'] === "submitted"){
          // read states and associated IDs from the 2nd last element
          let tmp2 = getNextToLast(bwsset['event-history']);
          let combostates = Object.values(tmp2['state']);
          let stateids = Object.values(bwsset['state-sentid-map']);
          if(debug_verbose.value){console.log("Final State: ", combostates, stateids);}
          // Extract paired comparisons from BWS set
          agg = counting.directExtract(stateids, combostates, agg)[0];
          // mark BWS set as processed
          bwsset['status-bestworst4'] = "processed"
        }
      } //else{console.log(bwsset['status-bestworst4'])}
    });
    counting.lilAddInplace(pairs, agg);

    // logging
    if (debug_verbose.value){
      console.log("- Updated pairs:", JSON.parse(JSON.stringify(pairs)));
      console.groupEnd();
    }
  }


  /**
   * (5) Compute the new target scores
   * 
   * Global Variables:
   * -----------------
   * @param {JSON}    pairs 
   * @param {JSON}    pool 
   * @param {String}  smoothing_method 
   * @param {Float}   ema_alpha 
   * 
   * Example:
   * --------
   *  const pairs = ...
   *  const pool = ...
   *  const smoothing_method = ref("ema");
   *  const ema_alpha = ref(0.7);
   *  computeTrainingScores();
   */
  const computeTrainingScores = () => {
    // logging
    if (debug_verbose.value){
      console.group();
      console.log("(5) Compute the new target scores (computeTrainingScores)")
    }

    // compute ranking from paired comparisons
    var tmp = ranking.rank(pairs, "ratio", "quantile", "exist");
    var sortedids = tmp[1]
    var scores = tmp[3]

    if (smoothing_method.value === "last") {
      // add the new training score as last value
      Object.keys(pool).forEach(key => {
        var idx = sortedids.indexOf(key);
        if( scores[idx] !== undefined ){ 
          pool[key].training_score_history.push(scores[idx]);
        }
      });

    } else if (smoothing_method.value === "ema") {
      // add the Exponential MA as the new training score
      Object.keys(pool).forEach(key => {
        var idx = sortedids.indexOf(key);
        if( scores[idx] !== undefined ){ 
          var idx_last = pool[key].training_score_history.length - 1
          var prev = pool[key].training_score_history[idx_last];
          if (prev === undefined) {
            pool[key].training_score_history.push(scores[idx])
          } else {
            pool[key].training_score_history.push(
              ema_alpha.value * scores[idx] + (1.0 - ema_alpha.value) * prev); // <= EMA update formula
          }
        }
      });
    } else {
      console.warn("Error: No valid `smoothing_method` specified.")
    }
    updateCurrentPoolMetrics(pool);

    // logging
    if (debug_verbose.value){
      console.log("Pool with new training scores:", JSON.parse(JSON.stringify(pool)))
      console.groupEnd();
    }
  }


  // (6) Re-train the ML model
  const getTfjsModel = async() => {
    try{
      // try to load model from App's IndexDB
      return await tf.loadLayersModel(
        'indexeddb://user-specific-scoring-model');
    }catch{
      if(debug_verbose){console.log("Load the baseline TFJS model from server")}
      const model = await tf.loadLayersModel(
        'https://tfjs-models-1.storage.googleapis.com/v0.4x-44-42-f32/model.json');
      // store the baseline model as new personal/individual edge model
      await model.save('indexeddb://user-specific-scoring-model');
      return model;
    }
  }; 

 
  const retrainModel = () => {
    // logging
    if (debug_verbose.value){
      console.group();
      console.log("(6a) retrainModel: Prepare Training Set")
    }

    // prepare training set
    var x_train = [];
    var y_train = [];
    Object.keys(pool).forEach(key => {
      if( pool[key]['last_training_score'] !== undefined ){
        y_train.push( pool[key]['last_training_score'] );
        x_train.push( pool[key]['features'] );
      }
    });
    // console.log("Pool", pool)

    // abort
    if ( y_train.length < (train_minsample.value || 1) ){
      if (debug_verbose.value){
        console.log(`- Not enough training examples: ${y_train.length}`);
        console.groupEnd();
      }
      return;
    }
    
    // convert to tf tensor
    x_train = tf.tensor(x_train).squeeze();
    y_train = tf.tensor(y_train).squeeze();

    // logging
    if (debug_verbose.value){
      console.log("- Training set (y_train, x_train):", y_train.arraySync(), x_train.arraySync())
      console.groupEnd();
    }

    // load baseline model (async) and execute training
    getTfjsModel().then((model) => {
      if (debug_verbose.value){
        console.group();
        console.log("(6b) retrainModel: Re-train the ML model")
        // console.log("- Model before training:", model);
        // model.getWeights().forEach((wgt) => {console.log("- Model weights after training:", wgt.dataSync());})
        const wgts1 = model.getWeights(); console.log("- Last bias weight before training:", wgts1[wgts1.length - 1].dataSync());
      }

      // specify optimization
      model.compile({
        optimizer: train_optimizer.value || 'adam',
        loss: train_loss.value || 'meanSquaredError',
        //metrics: [train_loss.value || 'meanSquaredError']
      });

      // fit model
      model.fit(x_train, y_train, {
        epochs: train_epochs.value || 5,
        learningRate: train_lrate.value || 0.001
      })
      .then(res => {
        // save model here
        model.save('indexeddb://user-specific-scoring-model');
        // logging
        if (debug_verbose.value){
          console.log("- Training losses (res.history.loss):", res.history.loss);
          // console.log("- Model after training:", model);
          // model.getWeights().forEach((wgt) => {console.log("- Model weights after training:", wgt.dataSync());})
          let wgts2 = model.getWeights(); console.log("- Last bias weight after training:", wgts2[wgts2.length - 1].dataSync());
          console.groupEnd();
        }
      });
    });

  }


  // (7) Predict the new model scores for the whole pool
  const predictScores = () => {
    // logging
    if (debug_verbose.value){
      console.group();
      console.log("(7a) predictScores: Prepare examples to predict")
    }

    // read features
    var x_feats = [];
    var x_ids = []
    Object.keys(pool).forEach(key => {
      if( pool[key]['last_training_score'] !== undefined ){
        x_feats.push( pool[key]['features'] );
        x_ids.push( key );
      }
    });
    // abort
    if ( x_feats.length < 1 ){
      if (debug_verbose.value){
        console.log(`- No examples to predict: ${x_feats.length}`);
        console.groupEnd();
      }
      return;
    }
    // convert to tf tensor
    x_feats = tf.tensor(x_feats).squeeze();

    // logging
    if (debug_verbose.value){
      console.log("- Features (x_feats):", x_feats.arraySync());
      console.log("- Example IDs:", x_ids);
      console.groupEnd();
    }

    // load model (async) and execute prediction 
    getTfjsModel().then((model) => {
      // logging
      if (debug_verbose.value){
        console.group();
        console.log("(7b) predictScores: Predict the new model scores for the whole pool")
        console.log("- Prediction Model:", model);
        // model.getWeights().forEach((wgt) => {console.log("- Model weights:", wgt.dataSync());})
      }

      // predict
      const y_pred = model.predict(x_feats);
      if (debug_verbose.value){
        console.log("- Predicted scores (y_pred):", y_pred.arraySync());
      }

      // store new model scores in pool
      y_pred.arraySync().forEach((val, i) => {
        const key = x_ids[i]
        if( pool[key] !== undefined ){
          pool[key].model_score_history.push(val[0])
        }
      });
      updateCurrentPoolMetrics(pool);

      // logging
      if (debug_verbose.value){
        console.groupEnd();
      }
    });
  }


  // Go to (1)
  return { 
    error_message,
    pool, 
    pairs, 
    resetPool,
    dropExamplesFromPool, 
    addExamplesToPool,
    sampleBwsSets,
    updatePairMatrix,
    computeTrainingScores, 
    retrainModel,
    predictScores
  }
}
