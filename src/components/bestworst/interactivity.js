import { reactive, ref, watch, unref } from 'vue';
import { sampling, counting, ranking } from 'bwsample';
import { histpdf } from 'histpdf';
import { useApi2, useAuth } from '@/functions/axios-evidence.js';
// import { v4 as uuid4 } from 'uuid'; // nur für dev
import { useBwsSettings } from '@/components/bestworst/bws-settings.js';
import { useQueue } from '@/components/bestworst/queue.js';
import { useGeneralSettings } from '@/components/settings/general-settings.js';
import * as tf from '@tensorflow/tfjs';
import router from '@/router';
import { int2float, int8_to_bool } from '@/components/bestworst/transform.js';



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
  const current_training_losses = ref([]);
  const last_training_loss = ref();

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
    txtlen_noise,
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
      if( typeof pairs[key] === "undefined"){
        pool[key]["num_displayed"]  = 0;
      }else{
        pool[key]["num_displayed"] = Object.values(pairs[key]).reduce((a,b) => Number(a) + Number(b), 0);
      }
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
  const dropExamplesFromPool = async() => {
    return new Promise((resolve) => {
      // logging
      if (debug_verbose.value){
        console.group();
        console.log("(1) Drop examples from pool (dropExamplesFromPool)");
        console.log(`- min_pool_size=${min_pool_size.value}`);
        console.log(`- drop_distribution=${drop_distribution.value}`);
        if(drop_distribution.value){
          console.log(`- bin_edges=${bin_edges.value}`);
          console.log(`- target_probas=${target_probas.value}`);
        }
        console.log(`- drop_max_display=${drop_max_display.value}`);  
        if(drop_max_display.value){
          console.log(`- max_displays=${max_displays}`);
        }
        console.log(`- drop_converge=${drop_converge.value}`);
        if(drop_converge.value){
          console.log(`- eps_score_change=${eps_score_change}`);
          console.log(`- converge_patience=${converge_patience}`);  
        }
        console.log(`- drop_pairs=${drop_pairs}`);
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
          "example-id": pool[key].example_id,
          "sentence-text": pool[key].text,
          "headword": pool[key].headword,
          "training-score-history": JSON.parse(JSON.stringify(pool[key].training_score_history)),
          "model-score-history": JSON.parse(JSON.stringify(pool[key].model_score_history)),
          "displayed": JSON.parse(JSON.stringify(pool[key].displayed))
        };
        delete pool[key];
      });

      // logging
      if (debug_verbose.value){
        console.log(`- New pool size: ${Object.keys(pool).length}`);
        console.log(`- Num deleted examples: ${Object.keys(deleted_pool).length}`);
        console.log("- deleted_pool:", JSON.parse(JSON.stringify(deleted_pool)) );
        console.groupEnd();
      }

      resolve();
    });
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
      console.log(`- has_data_donation_consent=${has_data_donation_consent.value}`)
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
        const { getToken, logout } = useAuth();
        const { api } = useApi2(getToken());
        // Start API request
        api.post(`v1/interactivity/deleted-episodes`, JSON.parse(JSON.stringify(deleted_pool)) )
          .then(response => {
            response.data['stored-example-ids'].forEach(key => {
              delete deleted_pool[key];
            })
            if(debug_verbose.value){console.log("Response (saveDeletedPool): ", response)}
            resolve(response);
          })
          .catch(error => {
            if (error.response.status === 401) {
              console.log("Unauthorized: ", error.response.data);
              logout();
              router.push('/auth/login');
            }
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
   *        addExamplesToPool(search_headword.value);
   *  }  });
   */
  const addExamplesToPool = (headword) => {
    // logging
    if (debug_verbose.value){
      console.group();
      console.log("(2a) addExamplesToPool: Add examples to pool");
      console.log(`- current_pool_size=${Object.keys(pool).length}`);
      console.log(`- max_pool_size=${max_pool_size.value}`);
      console.log(`- num_additions=${max_pool_size.value - Object.keys(pool).length}`);
      console.log(`- item_sampling_numtop=${item_sampling_numtop.value}`);
      console.log(`- item_sampling_offset=${item_sampling_offset.value}`);
      console.log(`- search_headword=${headword}`);
      console.log(`- initial_load_only=${initial_load_only.value}`)
      console.log(`- is_pool_initially_loaded=${is_pool_initially_loaded.value}`)
      console.log(`- max_displays=${max_displays.value}`);
      console.log(`- N.A.: add_distribution=${add_distribution.value}`);
      console.groupEnd();
    }
    return new Promise((resolve, reject) => {
      // replenish pool with sentence examples
      const num_additions = max_pool_size.value - Object.keys(pool).length;
      const flag = initial_load_only.value ? !is_pool_initially_loaded.value : true
      if (num_additions > 0  &&  flag ){
        // settings
        var params = {
          "headword": headword.trim(),
          "limit": num_additions,
          //"exclude_deleted_ids": true,
          // "max_displays": max_displays.value,
        }

        // load API conn
        const { getToken, logout } = useAuth();
        const { api } = useApi2(getToken());

        // removed: num_additions, item_sampling_numtop, item_sampling_offset

        // start AJAX call
        api.post(`v1/serialized-features`, params)
          .then(response => {
            if ('msg' in response.data){
              error_message.value = response.data['msg'];
            } else {
              response.data.examples.forEach(row => {
                pool[row.example_id] = {
                  "example_id": row.example_id,
                  "text": row.sentence,
                  "headword": row.headword,
                  "spans": JSON.parse(row.spans),
                  "context": {
                    "license": row.license,
                    "biblio": row.biblio,
                    "sentence_id": row.sentence_id
                  },
                  "features": int2float(
                    row.feats1,
                    row.feats2,
                    row.feats3,
                    row.feats4,
                    row.feats5,
                    row.feats6,
                    row.feats7,
                    row.feats8,
                    row.feats9,
                    row.feats12,
                    row.feats13,
                    row.feats14,
                  ),
                  "hashes": {
                    "semantic": int8_to_bool(row.feats1),
                    "grammar": row.hashes15,
                    "duplicate": row.hashes16,
                    "biblio": row.hashes18,
                  },
                  "training_score_history": [undefined],
                  // "model_score_history": [row.score],
                  "model_score_history": [],  // call predictScores
                  "displayed": [false]
                }
              })
            }
            predictScores()
            if(debug_verbose.value){console.log("Response (addExamplesToPool): ", response)}
            resolve(response);
          })
          .catch(error => {
            if (error.response.status === 401) {
              console.log("Unauthorized: ", error.response.data);
              logout();
              router.push('/auth/login');
            }
            if(debug_verbose.value){console.log("Error (addExamplesToPool): ", error)}
            reject(error);
          })
          .finally(() => {
            is_pool_initially_loaded.value = true;  // for `initial_load_only`
            updateCurrentPoolMetrics(pool);  // compute current metrics manually
        });
      }
      else {
        resolve("No additions to pool.");
      }
    });
  }
  /**
   * (2a) watch `pool` to trigger sync with API/DB
   */
  const { search_headword } = useQueue();
  watch( 
    () => Object.keys(pool).length, 
    (current_pool_size) => {
      if (current_pool_size < max_pool_size.value && search_headword.value){
        addExamplesToPool(search_headword.value);
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
    // reset last key for BWS sample
    lastSampledMainKey.value = undefined;

    // logging
    if (debug_verbose.value){
      console.groupEnd();
    }
  }


  /**
   * (3) Sample BWS sets from pool
   * 
   * Global Variables:
   * -----------------
   * @param {JSON}  pool 
   * @param {Int}   bwsset_num_items 
   * @param {Int}   num_preload_bwssets 
   * @param {String} item_sampling_method 
   * @param {Bool}  exclude_max_display
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
  const lastSampledMainKey = ref(undefined);  // for item_sampling_method.value === "semantic-similar"

  const sampleBwsSets = () => {
    // logging
    if (debug_verbose.value){
      console.group();
      console.log("(3) sampleBwsSets: Sample BWS sets from pool");
      console.log(`- bwsset_num_items=${bwsset_num_items.value}`);
      console.log(`- num_preload_bwssets=${num_preload_bwssets.value}`);
      console.log(`- item_sampling_method=${item_sampling_method.value}`);
      console.log(`- exclude_max_display=${exclude_max_display}`);
      if(exclude_max_display.value){console.log(`- max_displays=${max_displays}`);}
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
    if (exclude_max_display.value){
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

    } else if (item_sampling_method.value === "newer") {
      // Select the least displayed sentence examples
      all_ids.sort((key1, key2) => {
        // prefer the least displayed items (ascending)
        if (pool[key1].num_displayed < pool[key2].num_displayed) return -1;
        if (pool[key1].num_displayed > pool[key2].num_displayed) return 1;
        return 0;
      });

    } else if (item_sampling_method.value === "unstable") {
      // Select highly fluctuating model scores
      all_ids.sort((key1, key2) => {
        // if same number of displays, prefer most fluctating model scores (descending)
        if (pool[key1].change_model_score < pool[key2].change_model_score) return 1;
        if (pool[key1].change_model_score > pool[key2].change_model_score) return -1;
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

    } else if (item_sampling_method.value === "semantic-similar") {
      // randomly pick a main key or use a semantic different example
      let key_main;
      if (lastSampledMainKey.value === undefined){
        const idx = Math.floor(Math.random() * (all_ids.length + 1));
        key_main = all_ids[idx];
        lastSampledMainKey.value = key_main;
      }else{
        let sortedKeys = Object.entries(pool[lastSampledMainKey.value]['similarities']['semantic'])
          .filter(r => all_ids.includes(r[0]) )
          .sort(([,a],[,b]) => a-b)
          .reduce((r, [k, ]) => ([ ...r, k ]), []);  // sort by ascending order (smallest similarity)
        // sortedKeys = sortedKeys.slice(0, Math.max(1, sortedKeys.length - num_examples)); // exlcude previously sampled keys
        sortedKeys = sortedKeys.slice(0, Math.max(bwsset_num_items.value, sortedKeys.length * 0.1)); // PARAM: 10% of the least similar
        console.log("Least similar, num: ", sortedKeys.length)
        sortedKeys.sort(() => (Math.random() > .5) ? 1 : -1);  // shuffle
        key_main = sortedKeys[0];
      }
      // sort by semantic similarity
      all_ids.sort((key1, key2) => {
        // prefer largest semantic similarity (descending)
        if (pool[key_main]['similarities']['semantic'][key1] < pool[key_main]['similarities']['semantic'][key2]) return 1;
        if (pool[key_main]['similarities']['semantic'][key1] > pool[key_main]['similarities']['semantic'][key2]) return -1;
        return 0;
      });
    }
    // (D) Pick the first `num_examples` items of the sorted ids
    var sampled_ids = all_ids.slice(0, num_examples);

    // sort by text length + 10% noise
    sampled_ids.sort((key1, key2) => {
        // sort by shortest text length
        const len2 = pool[key2].text.length * (1.0 - txtlen_noise.value + Math.random() * 2.0 * txtlen_noise.value)
        if (pool[key1].text.length < len2){return -1;}
        else{ return 1;}
    });

    // (E) Generate BWS set samples (Sorry for the naming confusion)
    var sampled_bwssets = sampling.sample(
      sampled_ids, bwsset_num_items.value, bwsset_sampling_method.value, true);

    // logging
    if (debug_verbose.value) {
      console.log("- Sampled IDs:", sampled_ids);
      console.log("- Sampled BWS sets:", sampled_bwssets);
      console.groupEnd()
    }

    // done
    return sampled_bwssets;
  }


  /**
   * (4) Update pairs comparison matrix
   * 
   * @param {Array} queueData.evaluated
   * @param {JSON}  pairs
   */
  const updatePairMatrix = (queueData) => {
    // logging
    if (debug_verbose.value){
      console.group();
      console.log("(4) Update pairs comparison matrix (updatePairMatrix)");
      console.log(`- queueData.evaluated.length=${queueData.evaluated.length}`);
    }

    // start update of `pairs` object
    let agg =  {};
    queueData.evaluated.forEach(bwsset => {
      if(bwsset['status-bestworst4'] === undefined){
        let tmp = getLast(bwsset['event-history']);
        if(tmp['message'] === "submitted"){
          // read states and associated IDs from the 2nd last element
          let tmp2 = getNextToLast(bwsset['event-history']);
          let combostates = Object.values(tmp2['state']);
          let stateids = Object.values(bwsset['state-sentid-map']);
          // if(debug_verbose.value){console.log("- Final State: ", combostates, stateids);}
          // Extract paired comparisons from BWS set
          agg = counting.directExtract(stateids, combostates, agg)[0];
          // mark BWS set as processed
          bwsset['status-bestworst4'] = "processed"
        }
      } else{
        console.warn(`Undeleted BWS set: ${bwsset['status-bestworst4']}`)
      }
    });
    counting.lilAddInplace(pairs, agg);

    // logging
    if (debug_verbose.value){
      console.log("- Added pairs:", JSON.parse(JSON.stringify(agg)));
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
      console.log("(5) Compute the new target scores (computeTrainingScores)");
      console.log(`- smoothing_method=${smoothing_method.value}`);
      console.log(`- ema_alpha=${ema_alpha.value}`);
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
      console.log("- Pool with new training scores:", JSON.parse(JSON.stringify(pool)))
      console.groupEnd();
    }
  }


  /** (6/7) Load the TFJS model
   */
  const getTfjsModel = async() => {
    try{
      // try to load model from App's IndexDB
      return await tf.loadLayersModel(
        'indexeddb://user-specific-scoring-model');
    }catch{
      // setup model architecture from scratch
      const model = tf.sequential();
      model.add(tf.layers.dense({
        inputShape: [1181], 
        units: 32, 
        kernelInitializer: tf.initializers.heNormal({seed: 42}),
        useBias: true, 
        biasInitializer: 'zeros', 
        biasRegularizer: tf.regularizers.l2({l2: 0.01}),
        activation: 'swish', 
      }));
      model.add(tf.layers.dropout({
        rate: 0.5
      }));  // 0.5 to 0.8
      model.add(tf.layers.dense({
        units: 1, 
        kernelInitializer: tf.initializers.heNormal({seed: 42}),
        useBias: false, 
        activation: 'sigmoid', 
      }));
      model.compile({optimizer: 'adagrad', loss: 'meanSquaredError'});
      // try to load model weights from server
      if( has_data_donation_consent.value ){
        await loadModelWeights(model);
      }else{
        console.log("No data donation consent given. Use baseline model.")
      }
      // model.getWeights().forEach(w => {
      //   console.log(`Tensor: ${w.dataSync()}`)
      // });
      // done
      return model;
    }
  }; 

  const loadModelWeights = async (model) => {
    return new Promise((resolve, reject) => {
      const { getToken, logout } = useAuth();
      const { api } = useApi2(getToken());
      api.post(`v1/model/load`)
      .then(response => {
        console.log(`Model Loading Status: ${response.data['status']}`);
        if(response.data['status'] === 'success'){
          console.log(`Model Timestamp: ${response.data['timestamp']}`);
          let wgts = []
          response.data["weights"].forEach((wgt) => {
            console.log(`Tensor Shape: ${wgt["shape"]}`)
            wgts.push(tf.tensor(Array.from(wgt["values"]), wgt["shape"]));
          });
          model.setWeights(wgts);
        }
        resolve(response);
      })
      .catch(error => {
        if (error.response.status === 401) {
          console.log("Unauthorized: ", error.response.data);
          logout();
          router.push('/auth/login');
        }
        reject(error);
      });
    });
  }


  const saveModelWeights = async (model) => {
    // extract weights
    let wgts = []
    model.getWeights().forEach((wgt) => {
      wgts.push({"values": Array.from(wgt.dataSync()), "shape": wgt.shape})
    });

    // send to database
    return new Promise((resolve, reject) => {
      const { getToken, logout } = useAuth();
      const { api } = useApi2(getToken());
      api.post(`v1/model/save`, {"weights": wgts})
      .then(response => {
        console.log(`Model Saving Status: ${response.data['status']}`);
        resolve(response);
      })
      .catch(error => {
        if (error.response.status === 401) {
          console.log("Unauthorized: ", error.response.data);
          logout();
          router.push('/auth/login');
        }
        reject(error);
      });
    });
  }

  const downloadModelWeights = () => {
    // load model
    getTfjsModel().then((model) => {
      // extract weights
      let wgts = []
      model.getWeights().forEach((wgt) => {
        wgts.push({"values": Array.from(wgt.dataSync()), "shape": wgt.shape})
      });
      // stringify to JSON and create blob
      const jsonBlob = new Blob([JSON.stringify(wgts)]);
      // create an href element that points to the memory location of the blob
      const link = document.createElement("a");
      link.href = URL.createObjectURL(jsonBlob);
      link.download = "model_weights.json";
      document.body.appendChild(link);    
      // Dispatch click event on the link
      link.dispatchEvent(
        new MouseEvent('click', { 
          bubbles: true, 
          cancelable: true, 
          view: window 
        })
      );
      // Remove link from body
      document.body.removeChild(link);
    });
  }

 
  /** (6) Re-train the ML model
   * 
   * Global Variables:
   * -----------------
   * @param {Float}  pool[].last_training_score
   * @param {Array}  pool[].features
   * @param {Int}    train_minsample
   * @param {String} train_optimizer
   * @param {Float}  train_lrate
   * @param {Int}    train_epochs
   * @param {String} train_loss
   * 
   * Changed
   * -------
   * @param {tf.keras.Model} model
   */
  const retrainModel = () => {
    // logging
    if (debug_verbose.value){
      console.group();
      console.log("(6a) retrainModel: Prepare Training Set");
      console.log(`- train_minsample=${train_minsample.value}`);
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
        console.log("(6b) retrainModel: Re-train the ML model");
        console.log(`- train_optimizer=${train_optimizer.value}`);
        console.log(`- train_lrate=${train_lrate.value}`);
        console.log(`- train_epochs=${train_epochs.value}`);
        console.log(`- train_loss=${train_loss.value}`);
          // console.log("- Model before training:", model);
        // model.getWeights().forEach((wgt) => {console.log("- Model weights after training:", wgt.dataSync());})
        // const wgts1 = model.getWeights(); console.log("- Last bias weight before training:", wgts1[wgts1.length - 1].dataSync());
        console.log("- weights before training:"); model.getWeights().forEach((wgt) => {console.log(Array.from(wgt.dataSync()));})
        console.groupEnd();
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
        // send model weights to database
        if( has_data_donation_consent.value ){
          saveModelWeights(model);
        }else{
          console.log("No consent to save model weights");
        }
        // update current loss
        current_training_losses.value.push({
          'loss': res.history.loss[res.history.loss.length - 1],
          'headword': unref(pool[Object.keys(pool)[0]]?.headword),
        });
        last_training_loss.value = res.history.loss[res.history.loss.length - 1];
        // logging
        if (debug_verbose.value){
          console.group();
          console.log("(6c) After training");
          console.log("- training losses (res.history.loss):", res.history.loss);
          console.log("- weight after training:"); model.getWeights().forEach((wgt) => {console.log(Array.from(wgt.dataSync()));})
          console.groupEnd();
        }
      });
      if (debug_verbose.value){console.groupEnd();}
    });

  }


  /** (7) Predict the new model scores for the whole pool
   * 
   * Global Variables:
   * -----------------
   * @param {Array}          pool[].features
   * @param {tf.keras.Model} model
   * 
   * Changed
   * -------
   * @param {Array}  pool[].model_score_history
   */
  const predictScores = () => {
    // logging
    if (debug_verbose.value){
      console.group();
      console.log("(7a) predictScores: Prepare examples to predict");
    }

    // read features
    var x_feats = [];
    var x_ids = []
    Object.keys(pool).forEach(key => {
      x_feats.push( pool[key]['features'] );
      x_ids.push( key );
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
    error_message, current_training_losses, last_training_loss,
    pool, 
    pairs, 
    resetPool,
    dropExamplesFromPool, 
    addExamplesToPool,
    sampleBwsSets,
    updatePairMatrix,
    computeTrainingScores, 
    retrainModel,
    predictScores,
    downloadModelWeights,
    // for UploadModelWeights.vue
    saveModelWeights, getTfjsModel,
  }
}
