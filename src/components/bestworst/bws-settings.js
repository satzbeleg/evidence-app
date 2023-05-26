import { reactive, ref, watchEffect } from 'vue';
import { useApi2, useAuth } from '@/functions/axios-evidence.js';


/** 
 * Sync Interactivity UI Settings with REST API
 * 
 * EXAMPLE:
 * --------
    const { min_pool_size, loadBwsSettings } = useBwsSettings();
    async function waitForSettings(){
      await loadBwsSettings();
      await forSomeThingElse();
      console.log(`Min Pool Size: ${min_pool_size.value}`); 
    }
    waitForSettings();
*/
export const useBwsSettings = () => {
  /**
   * (A) Initialize reactive variables
   */
  // Also used in bestworst3
  const queue_reorderpoint = ref();
  const queue_orderquantity = ref();
  const item_sampling_numtop = ref();
  const item_sampling_offset = ref();

  // bestworst4
  const min_pool_size = ref();
  const max_pool_size = ref();
  const initial_load_only = ref();

  const drop_distribution = ref();
  const add_distribution = ref();
  const target_probas = reactive({value: []});
  const bin_edges = reactive({value: []});

  const exclude_max_display = ref();
  const drop_max_display = ref();
  const max_displays = ref();

  const drop_converge = ref();
  const eps_score_change = ref();
  const converge_patience = ref();

  const drop_pairs = ref();
  

  // Settings for (3) 
  const bwsset_num_items = ref();
  const num_preload_bwssets = ref();   // settings: Number BWS sets to preload
  const item_sampling_method = ref(); // "random", "exploit", "newer-unstable", "semantic-similar"
  const bwsset_sampling_method = ref() // overlap, twice

  // Settings for (5) 
  const smoothing_method = ref();
  const ema_alpha = ref();

  // Settings for (6)
  const train_optimizer = ref();  // sgd, adagrad, rmsprop, adam
  const train_lrate = ref();  // float
  const train_epochs = ref();  // int
  const train_loss = ref();  // meanSquaredError, huberLoss, absoluteDifference
  const train_minsample = ref();  // low number of evals

  // Settings for 4/5/6
  const retrain_patience = ref();


  /**
   * (B.1) download user's settings from database
   */
  const loadBwsSettings = () => {
    return new Promise((resolve, reject) => {
      const { getToken } = useAuth();
      const { api } = useApi2(getToken());
      api.get(`v1/user/settings`)
        .then(response => {
          // also used in bestworst3
          queue_reorderpoint.value = response.data['queue-reorderpoint'] || 3;
          queue_orderquantity.value = response.data['queue-orderquantity'] || 10;
          item_sampling_numtop.value = response.data['item-sampling-numtop'] || 100;
          item_sampling_offset.value = response.data['item-sampling-offset'] || 0;
          // Settings for (1) and (2), e.g. dropExamplesFromPool, addExamplesToPool
          initial_load_only.value = response.data['initial-load-only'] || false;
          min_pool_size.value  = response.data['min-pool-size'] || 10;
          max_pool_size.value = response.data['max-pool-size'] || 100;
          drop_distribution.value = response.data['drop-distribution'] || false;
          add_distribution.value = response.data['add-distribution'] || false;
          bin_edges.value = response.data['bin-edges'] || [.0, .25, .5, .75, 1.];
          target_probas.value = response.data['target-probas'] || [.25, .25, .25, .25];
          // Settings for (1) and (3)
          drop_max_display.value = response.data['drop-max-display'] || false;
          exclude_max_display.value = response.data['exclude-max-display'] || true;
          max_displays.value = response.data['max-displays'] || 2;
          // Settings for (1)
          drop_converge.value = response.data['drop-converge'] || false;
          eps_score_change.value = response.data['eps-score-change'] || 1e-6;
          converge_patience.value = response.data['converge-patience'] || 0;
          drop_pairs.value = response.data['drop-pairs'] || false;
          // Settings for (3): sampleBwsSets
          bwsset_num_items.value = response.data['bwsset-num-items'] || 4;
          bwsset_sampling_method.value = response.data['bwsset-sampling-method'] || "overlap";
          num_preload_bwssets.value = response.data['num-preload-bwssets'] || 3;
          item_sampling_method.value = response.data['item-sampling-method'] || "semantic-similar";
          // Settings for 4/5/6
          retrain_patience.value = response.data['retrain-patience'] || 1;
          // Settings for (5): computeTrainingScores
          smoothing_method.value = response.data['smoothing-method'] || "ema";
          ema_alpha.value = response.data['ema-alpha'] || 0.7;
          // Settings for (6): retrainModel
          train_optimizer.value = response.data['train-optimizer'] || "adam";
          train_lrate.value = response.data['train-lrate'] || 0.001;
          train_epochs.value = response.data['train-epochs'] || 5;
          train_loss.value = response.data['train-loss'] || "meanSquaredError";
          train_minsample.value = response.data['train-minsample'] || 5;
          // done
          resolve(response);
        })
        .catch(error => {
          reject(error);
        })
    });
  }

  // (B.2) force to load data initially
  loadBwsSettings();

  /**
   * (C.1) save user's settings to database
   */
  const saveBwsSettings = () => {
    return new Promise((resolve, reject) => {
      const { getToken } = useAuth();
      const { api } = useApi2(getToken());
      api.post(`v1/user/settings`, {
        // also used in bestworst3
        'queue-reorderpoint': queue_reorderpoint.value,
        'queue-orderquantity': queue_orderquantity.value,
        'item-sampling-numtop': item_sampling_numtop.value,
        'item-sampling-offset': item_sampling_offset.value,
        // Settings for (1) and (2), e.g. dropExamplesFromPool, addExamplesToPool
        'initial-load-only': initial_load_only.value,
        'min-pool-size': min_pool_size.value, 
        'max-pool-size': max_pool_size.value,
        'drop-distribution': drop_distribution.value, 
        'add-distribution': add_distribution.value, 
        'bin-edges': bin_edges.value, 
        'target-probas': target_probas.value, 
        // Settings for (1) and (3)
        'drop-max-display': drop_max_display.value, 
        'exclude-max-display': exclude_max_display.value, 
        'max-displays': max_displays.value, 
        // Settings for (1)
        'drop-converge': drop_converge.value, 
        'eps-score-change': eps_score_change.value,
        'converge-patience': converge_patience.value,
        'drop-pairs': drop_pairs.value,
        // Settings for (3), e.g. sampleBwsSets
        'bwsset-num-items': bwsset_num_items.value, 
        'bwsset-sampling-method': bwsset_sampling_method.value, 
        'num-preload-bwssets': num_preload_bwssets.value, 
        'item-sampling-method': item_sampling_method.value,
        // Settings for 4/5/6
        'retrain-patience': retrain_patience.value,
        // Settings for (5), e.g. computeTrainingScores
        'smoothing-method': smoothing_method.value, 
        'ema-alpha': ema_alpha.value,
        // Settings for (6): retrainModel
        'train-optimizer': train_optimizer.value,
        'train-lrate': train_lrate.value, 
        'train-epochs': train_epochs.value,
        'train-loss': train_loss.value,
        'train-minsample': train_minsample.value
        })
        .then(response => {
          console.log("SAVED");
          resolve(response);
        })
        .catch(error => {
          reject(error);
        })
    });
  }

  // (C.2) Watch all changes
  watchEffect(() => {
    saveBwsSettings();
  });

  // reset settings
  const factoryResetBws = () => {
    // also used in bestworst3
    queue_reorderpoint.value = 3;
    queue_orderquantity.value = 10;
    item_sampling_numtop.value = 100;
    item_sampling_offset.value =  0;
    // Settings for (1) and (2), e.g. dropExamplesFromPool, addExamplesToPool
    initial_load_only.value = false;
    min_pool_size.value  = 10;
    max_pool_size.value = 100;
    drop_distribution.value = false;
    add_distribution.value = false;
    bin_edges.value = [.0, .25, .5, .75, 1.];
    target_probas.value = [.25, .25, .25, .25];
    // Settings for (1) and (3)
    drop_max_display.value = false;
    exclude_max_display.value = true;
    max_displays.value = 2;
    // Settings for (1)
    drop_converge.value = false;
    eps_score_change.value = 1e-6;
    converge_patience.value = 0;
    drop_pairs.value = false;
    // Settings for (3): sampleBwsSets
    bwsset_num_items.value = 4;
    bwsset_sampling_method.value = "overlap";
    num_preload_bwssets.value = 3;
    item_sampling_method.value = "semantic-similar";
    // Settings for 4/5/6
    retrain_patience.value = 1;
    // Settings for (5): computeTrainingScores
    smoothing_method.value = "ema";
    ema_alpha.value = 0.7;
    // Settings for (6): retrainModel
    train_optimizer.value = "adam";
    train_lrate.value = 0.001;
    train_epochs.value = 5;
    train_loss.value =  "meanSquaredError";
    train_minsample.value = 5;
  }

  return {
    loadBwsSettings, saveBwsSettings,
    // also used in bestworst3
    queue_reorderpoint,  // queue.js
    queue_orderquantity,  // queue.js
    item_sampling_numtop,  // queue.js
    item_sampling_offset,  // queue.js
    // Settings for (1) and (2), e.g. dropExamplesFromPool, addExamplesToPool
    initial_load_only,
    min_pool_size, max_pool_size,
    drop_distribution, add_distribution, bin_edges, target_probas, 
    // Settings for (1) and (3)
    drop_max_display, exclude_max_display, max_displays, 
    // Settings for (1)
    drop_converge, eps_score_change, converge_patience,
    drop_pairs,
    // Settings for (3), e.g. sampleBwsSets
    bwsset_num_items, num_preload_bwssets, bwsset_sampling_method, item_sampling_method,
    // Settings for 4/5/6
    retrain_patience,
    // Settings for (5), e.g. computeTrainingScores
    smoothing_method, ema_alpha,
    // Settings for (6): retrainModel
    train_optimizer, train_lrate, train_epochs, train_loss, train_minsample,
    // reset
    factoryResetBws
  }
}
