import { reactive, ref, watchEffect } from 'vue';
import { useApi, useAuth } from '@/functions/axios-evidence.js';


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
  const reorderpoint = ref();
  const orderquantity = ref();
  const sampling_numtop = ref();
  const sampling_offset = ref();

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
  const num_items_per_set = ref();
  const num_preload_bwssets = ref();   // settings: Number BWS sets to preload
  const item_sampling_method = ref(); // "random", "exploit", "newer-unstable"
  const bws_sampling_method = ref() // overlap, twice

  // Settings for (5) 
  const smoothing_method = ref();
  const ema_alpha = ref();


  /**
   * (B.1) download user's settings from database
   */
  const loadBwsSettings = () => {
    return new Promise((resolve, reject) => {
      const { getToken } = useAuth();
      const { api } = useApi(getToken());
      api.get(`v1/user/settings`)
        .then(response => {
          // also used in bestworst3
          reorderpoint.value = response.data['reorderpoint'] || 3;
          orderquantity.value = response.data['orderquantity'] || 10;
          sampling_numtop.value = response.data['sampling-numtop'] || 100;
          sampling_offset.value = response.data['sampling-offset'] || 0;
          // Settings for (1) and (2), e.g. dropExamplesFromPool, addExamplesToPool
          flagInitialLoadOnly.value = response.data['flagInitialLoadOnly'] || true;
          min_pool_size.value  = response.data['min_pool_size'] || 10;
          max_pool_size.value = response.data['max_pool_size'] || 500;
          flagDropDistribution.value = response.data['flagDropDistribution'] || false;
          flagAddDistribution.value = response.data['flagAddDistribution'] || false;
          bin_edges.value = response.data['bin_edges'] || [.0, .25, .5, .75, 1.];
          target_probas.value = response.data['target_probas'] || [.25, .25, .25, .25];
          // Settings for (1) and (3)
          flagDropMaxDisplay.value = response.data['flagDropMaxDisplay'] || false;
          flagExcludeMaxDisplay.value = response.data['flagExcludeMaxDisplay'] || true;
          max_displays.value = response.data['max_displays'] || 3;
          // Settings for (1)
          flagDropConverge.value = response.data['flagDropConverge'] || false;
          eps_score_change.value = response.data['eps_score_change'] || 1e-6;
          flagDropPairs.value = response.data['flagDropPairs'] || false;
          // Settings for (3), e.g. sampleBwsSets
          num_items_per_set.value = response.data['num_items_per_set'] || 4;
          num_preload_bwssets.value = response.data['num_preload_bwssets'] || 3;
          bws_sampling_method.value = response.data['bws_sampling_method'] || "overlap";
          item_sampling_method.value = response.data['item_sampling_method'] || "exploit";
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
      const { api } = useApi(getToken());
      api.post(`v1/user/settings`, {
        // also used in bestworst3
        'reorderpoint': reorderpoint.value,
        'orderquantity': orderquantity.value,
        'sampling-numtop': sampling_numtop.value,
        'sampling-offset': sampling_offset.value,
        // Settings for (1) and (2), e.g. dropExamplesFromPool, addExamplesToPool
        'flagInitialLoadOnly': flagInitialLoadOnly.value,
        'min_pool_size': min_pool_size.value, 
        'max_pool_size': max_pool_size.value,
        'flagDropDistribution': flagDropDistribution.value, 
        'flagAddDistribution': flagAddDistribution.value, 
        'bin_edges': bin_edges.value, 
        'target_probas': target_probas.value, 
        // Settings for (1) and (3)
        'flagDropMaxDisplay': flagDropMaxDisplay.value, 
        'flagExcludeMaxDisplay': flagExcludeMaxDisplay.value, 
        'max_displays': max_displays.value, 
        // Settings for (1)
        'flagDropConverge': flagDropConverge.value, 
        'eps_score_change': eps_score_change.value,
        'flagDropPairs': flagDropPairs.value,
        // Settings for (3), e.g. sampleBwsSets
        'num_items_per_set': num_items_per_set.value, 
        'num_preload_bwssets': num_preload_bwssets.value, 
        'bws_sampling_method': bws_sampling_method.value, 
        'item_sampling_method': item_sampling_method.value,
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
    reorderpoint,
    orderquantity,
    sampling_numtop,
    sampling_offset,
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
    num_items_per_set, num_preload_bwssets, bws_sampling_method, item_sampling_method,
    // Settings for (5), e.g. computeTrainingScores
    smoothing_method, ema_alpha
  }
}
