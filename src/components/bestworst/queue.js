import { reactive, ref } from 'vue';
import { traverseObject } from '@/functions/traverse-objects.js';
import { useApi2, useAuth } from '@/functions/axios-evidence.js';

export const useQueue = () => {
  // UI-name
  const uispec = reactive({"name": "noname"})

  // Search string for headword/keywords
  const search_headword = ref("");

  // reactive data of this component
  const queueData = reactive({
    // Array with unlabelled example sets. It's a FIFO queue
    queue: [],
    // The current BWS-exampleset displayed inside the app
    current: [],
    current_setid: undefined,
    current_headword: undefined, //'Hello world,cool',
    // Use to trigger component re-rendering with :key
    counter: 1,
    // Post this to the REST API (see saveEvaluations)
    evaluated: []
  });

  // AJAX status flags and messages
  const isReplenishing = ref(false);
  const isSaving = ref(false);
  const message_suggestion = ref("Not connected! Please login.");
  
  /**
   * Pull a new BWS set from the local queue
   * 
   * Requires:
   * ---------
   * - loadSettings
   * - replenishQueue
   * 
   * Example:
   * --------
   *    const { pullFromQueue } = useQueue();
   *    pullFromQueue();
   */
  const pullFromQueue = () => {
    // Trigger initial replenishment if the queueData.queue is empty
      if (queueData.queue.length > 0){
      // Read the 1st element, and delete it from queue (FIFO principle)
      const tmp = queueData.queue.shift()

      if (typeof tmp !== 'undefined' ){
        queueData.current = tmp.examples;
        queueData.current_setid = tmp.set_id;
        queueData.current_headword = tmp.headword;
      }else{
        queueData.current = [];
        queueData.current_setid = undefined;
        queueData.current_headword = undefined;
      }
    }
  }

  /**
   * Store evaluation results, pull next example set from queue, trigger re-rendering
   * 
   * Requires:
   * ---------
   * - loadSettings  (see `pullFromQueue`)
   * - replenishQueue
   * 
   * Example:
   * --------
   *    const { nextExampleSet } = useQueue(loadSettings, replenishQueue);
   *    nextExampleSet(history)
   * 
   */
  const nextExampleSet = (history) => {
    // abort if the setId still exists in queueData.evaluated, i.e. the current setId
    // was not saved yet but the user keeps pushing the submit buttons (i.e. calling
    // the `nextExampleSet` function)
    queueData.evaluated.forEach(elem => {
      if (elem['set-id'] === queueData.current_setid){
        console.warn(`The set-id='${elem['set-id']}' cannot be stored twice`);
        if (queueData.queue.length == 0){
          queueData.current = [];
          queueData.current_setid = undefined;
          queueData.current_headword = undefined;
          message_suggestion.value = 'No Examples Left Over! Search of for another headword!'
        }
        return;
      }
    });
    //console.log(queueData.evaluated)
    // Map states with SentenceIDs (Don't send raw examples `queueData.current` back to API)
    var state_sentid_map = {}
    queueData.current.forEach((ex, i) => state_sentid_map[i] = ex.id)
    // Store latest evaluation
    queueData.evaluated.push({
      'set-id': queueData.current_setid,  // Only required for App/API-Sync
      'ui-spec': JSON.parse(JSON.stringify(uispec)), // DB SQL CHANGE REQUIRED
      'ui-name': uispec.name,  // DELETE THIS
      'headword': queueData.current_headword.trim(),
      'event-history': JSON.parse(JSON.stringify(history)),  // to be stored in DB
      'state-sentid-map': state_sentid_map,  // to be stored in DB
      'tracking-data': {
        'window': traverseObject(window, 0),
        'screen': traverseObject(window.screen, 1),
        'navigator': traverseObject(window.navigator, 1)
      }
    });
    // Load the next example set
    pullFromQueue();
    // enforce rerendering via :key
    queueData.counter++;
  }

  /**
   * Save evaluated sets into the database
   * 
   * Example:
   * --------
   *    const { isSaving, saveEvaluations } = useQueue();
   *    watch( () => queueData.evaluated.length, 
   *      (num_evaluated) => {
   *        if (num_evaluated > 0 && !isSaving.value){
   *          saveEvaluations();
   *        }
   *    });
   */
  const saveEvaluations = () => {
    return new Promise((resolve, reject) => {
      isSaving.value = true;
      const { getToken } = useAuth();
      const { api } = useApi2(getToken());
      api.post(`v1/bestworst/evaluations`, queueData.evaluated)
      .then(response => {
        // delete evaluated sets if API confirms its storage
        response.data['stored-setids'].forEach(setid => {
          var idx = -1;
          while(( idx = queueData.evaluated.findIndex(elem => elem['set-id'] == setid) ) !== -1){
            queueData.evaluated.splice(idx, 1);
          }
        });
        console.log(`Stored example sets: ${response.data['stored-setids'].length}`);
        resolve(response);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        isSaving.value = false;
      });
    });
  }

  /**
   * Delete evaluated BWS sets
   * 
   * Example:
   * --------
   * import { useQueue } from '@/components/bestworst/queue.js';
   * import { useGeneralSettings } from '@/components/settings/general-settings.js';
   * const { has_data_donation_consent } = useGeneralSettings();
   * const { saveEvaluations, flushEvaluations } = useQueue();
   * // process queueData.evaluations
   * postProcess(queueData.evaluations)
   * // check information consent
   * if( has_data_donation_consent.value ){
   *    saveEvaluations();
   * } else {
   *    flushEvaluations(); 
   * }
   */
  const flushEvaluations = () => {
    queueData.evaluated = [];
  }
  
  /**
   * Reset Queue
   */
  const resetQueue = () => {
    // reset `search_headword`
    search_headword.value = ""
    // delete current example set in UI
    queueData.current = [];
    queueData.current_setid = undefined;
    queueData.current_headword = undefined;
    // delete lined up BWS sets
    queueData.queue = []; 
  }


  /// done
  return {
    uispec, search_headword, queueData,
    isReplenishing, isSaving, message_suggestion,
    pullFromQueue,
    nextExampleSet,
    saveEvaluations, flushEvaluations,
    resetQueue
  }
}


