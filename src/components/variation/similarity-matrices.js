import { ref, reactive } from 'vue';
import { useApi2, useAuth } from '@/functions/axios-evidence.js';
import { useGeneralSettings } from '@/components/settings/general-settings.js';
import * as tf from '@tensorflow/tfjs';

export const useSimilarityMatrices = () => {

  // Informational variables
  const error_message = ref("");

  // Load General Settings
  const { 
    debug_verbose, 
    loadGeneralSettings 
  } = useGeneralSettings();
  loadGeneralSettings();

  // Specify matrices
  const sentences = reactive([])
  const biblio = reactive([])
  const good_scores = reactive([])
  const simi_semantic = reactive([])
  const simi_grammar = reactive([])
  const simi_duplicate = reactive([])
  const simi_biblio = reactive([])

  // progress indicator
  const simi_matrices_are_loading = ref(false);
  const trigger_matrix_aggregation = ref(false);

  /**
   * Load Similarity Matrices
   * 
   * Global Variables:
   * -----------------
   * @param {String}  error_message
   * 
   * Example:
   * --------
   * n.a.
   */
   const loadSimilarityMatrices = (headword, limit) => {
    // logging
    if (debug_verbose.value){
      console.group();
      console.log("loadSimilarityMatrices:");
      console.log(`- headword=${headword}`);
      console.log(`- limit=${limit}`);
      console.groupEnd();
    }
    return new Promise((resolve, reject) => {
      simi_matrices_are_loading.value = true
      // settings
      var params = {
        "headword": headword.trim(),
        "limit": limit,
      }
      // load API conn
      const { getToken } = useAuth();
      const { api } = useApi2(getToken());
      // start AJAX call
      api.post(`v1/variation/similarity-matrices`, params)
        .then(response => {
          if ('msg' in response.data){
            error_message.value = response.data['msg'];
          } else {
            Object.assign(sentences, response.data.sentences)
            Object.assign(biblio, response.data.biblio)
            Object.assign(good_scores, response.data.scores)
            Object.assign(simi_semantic, response.data['simi-semantic'])
            Object.assign(simi_grammar, response.data['simi-grammar'])
            Object.assign(simi_duplicate, response.data['simi-duplicate'])
            Object.assign(simi_biblio, response.data['simi-biblio'])
            // evaluaute with individual model
            try{
              tf.loadLayersModel('indexeddb://user-specific-scoring-model').then((model) => {
                const y_pred = model.predict(
                  tf.tensor(response.data['features']).squeeze()
                );
                y_pred.arraySync().forEach((val, i) => {
                  good_scores[i] = val[0]
                });
                if(debug_verbose.value){console.log("Local scoring model applied", good_scores);}
              });
            }catch{
              if(debug_verbose.value){console.log("Cannot load model from IndexDB.");}
            }
          }
          if(debug_verbose.value){console.log("Response (loadSimilarityMatrices): ", response)}
          resolve(response);
        })
        .catch(error => {
          if(debug_verbose.value){console.log("Error (loadSimilarityMatrices): ", error)}
          reject(error);
        })
        .finally(() => {
          // compute stuff 
          simi_matrices_are_loading.value = false
          trigger_matrix_aggregation.value = true
      });  
    });
  }


  return {
    sentences,
    biblio,
    good_scores,
    simi_semantic,
    simi_grammar,
    simi_duplicate,
    simi_biblio,
    loadSimilarityMatrices,
    simi_matrices_are_loading,
    trigger_matrix_aggregation
  }
}