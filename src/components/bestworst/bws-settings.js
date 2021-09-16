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
  const flagInitialLoadOnly = ref();

  const flagDropDistribution = ref();
  const flagAddDistribution = ref();  // NOT USED SO FAR
  const target_probas = reactive({value: []});
  const bin_edges = reactive({value: []});

  const flagExcludeMaxDisplay = ref();  // NOT USED SO FAR
  const flagDropMaxDisplay = ref();
  const max_displays = ref();

  const flagDropConverge = ref();
  const eps_score_change = ref();

  const flagDropPairs = ref();
  

  // Settings for (3) 
  const bwsset_num_items = ref();
  const num_preload_bwssets = ref();   // settings: Number BWS sets to preload
  const item_sampling_method = ref(); // "random", "exploit", "newer-unstable"
  const bwsset_sampling_method = ref() // overlap, twice

  // Settings for (5) 
  const smoothing_method = ref();
  const ema_alpha = ref();


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
          flagInitialLoadOnly.value = response.data['flagInitialLoadOnly'] || true;
          min_pool_size.value  = response.data['min-pool-size'] || 10;
          max_pool_size.value = response.data['max-pool-size'] || 500;
          flagDropDistribution.value = response.data['flagDropDistribution'] || false;
          flagAddDistribution.value = response.data['flagAddDistribution'] || false;
          bin_edges.value = response.data['bin-edges'] || [.0, .25, .5, .75, 1.];
          target_probas.value = response.data['target-probas'] || [.25, .25, .25, .25];
          // Settings for (1) and (3)
          flagDropMaxDisplay.value = response.data['flagDropMaxDisplay'] || false;
          flagExcludeMaxDisplay.value = response.data['flagExcludeMaxDisplay'] || true;
          max_displays.value = response.data['max-displays'] || 3;
          // Settings for (1)
          flagDropConverge.value = response.data['flagDropConverge'] || false;
          eps_score_change.value = response.data['eps-score-change'] || 1e-6;
          flagDropPairs.value = response.data['flagDropPairs'] || false;
          // Settings for (3), e.g. sampleBwsSets
          bwsset_num_items.value = response.data['bwsset-num-items'] || 4;
          bwsset_sampling_method.value = response.data['bwsset-sampling-method'] || "overlap";
          num_preload_bwssets.value = response.data['num_preload_bwssets'] || 3;
          item_sampling_method.value = response.data['item-sampling-method'] || "exploit";
          // Settings for (5), e.g. computeTrainingScores
          smoothing_method.value = response.data['smoothing_method'] || "ema";
          ema_alpha.value = response.data['ema_alpha'] || 0.7;
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
        'flagInitialLoadOnly': flagInitialLoadOnly.value,
        'min-pool-size': min_pool_size.value, 
        'max-pool-size': max_pool_size.value,
        'flagDropDistribution': flagDropDistribution.value, 
        'flagAddDistribution': flagAddDistribution.value, 
        'bin-edges': bin_edges.value, 
        'target-probas': target_probas.value, 
        // Settings for (1) and (3)
        'flagDropMaxDisplay': flagDropMaxDisplay.value, 
        'flagExcludeMaxDisplay': flagExcludeMaxDisplay.value, 
        'max-displays': max_displays.value, 
        // Settings for (1)
        'flagDropConverge': flagDropConverge.value, 
        'eps-score-change': eps_score_change.value,
        'flagDropPairs': flagDropPairs.value,
        // Settings for (3), e.g. sampleBwsSets
        'bwsset-num-items': bwsset_num_items.value, 
        'bwsset-sampling-method': bwsset_sampling_method.value, 
        'num_preload_bwssets': num_preload_bwssets.value, 
        'item-sampling-method': item_sampling_method.value,
        // Settings for (5), e.g. computeTrainingScores
        'smoothing_method': smoothing_method.value, 
        'ema_alpha': ema_alpha.value
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

  return {
    loadBwsSettings, saveBwsSettings,
    // also used in bestworst3
    queue_reorderpoint,
    queue_orderquantity,
    item_sampling_numtop,
    item_sampling_offset,
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
    bwsset_num_items, num_preload_bwssets, bwsset_sampling_method, item_sampling_method,
    // Settings for (5), e.g. computeTrainingScores
    smoothing_method, ema_alpha
  }
}
