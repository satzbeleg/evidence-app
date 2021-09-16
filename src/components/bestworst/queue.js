import { reactive, ref } from 'vue';
import { traverseObject } from '@/functions/traverse-objects.js';
import { useApi2, useAuth } from '@/functions/axios-evidence.js';

export const useQueue = () => {
  // UI-name
  const uispec = reactive({"name": "noname"})

  // Search string for lemmata/keywords
  const searchlemmata = ref("");

  // reactive data of this component
  const data = reactive({
    // Array with unlabelled example sets. It's a FIFO queue
    queue: [],
    // The current BWS-exampleset displayed inside the app
    current: [],
    current_setid: undefined,
    current_lemmata: undefined, //'Hello world,cool',
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
    // Trigger initial replenishment if the data.queue is empty
      if (data.queue.length > 0){
      // Read the 1st element, and delete it from queue (FIFO principle)
      const tmp = data.queue.shift()

      if (typeof tmp !== 'undefined' ){
        data.current = tmp.examples;
        data.current_setid = tmp.set_id;
        data.current_lemmata = tmp.lemmata.join(", ");
      }else{
        data.current = [];
        data.current_setid = undefined;
        data.current_lemmata = undefined;
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
    // abort if the setId still exists in data.evaluated, i.e. the current setId
    // was not saved yet but the user keeps pushing the submit buttons (i.e. calling
    // the `nextExampleSet` function)
    data.evaluated.forEach(elem => {
      if (elem['set-id'] === data.current_setid){
        console.log(`The set-id='${elem['set-id']}' cannot be stored twice`);
        return;
      }
    });
    //console.log(data.evaluated)
    // Map states with SentenceIDs (Don't send raw examples `data.current` back to API)
    var state_sentid_map = {}
    data.current.forEach((ex, i) => state_sentid_map[i] = ex.id)
    // Store latest evaluation
    data.evaluated.push({
      'set-id': data.current_setid,  // Only required for App/API-Sync
      'ui-spec': JSON.parse(JSON.stringify(uispec)), // DB SQL CHANGE REQUIRED
      'ui-name': uispec.name,  // DELETE THIS
      'lemmata': data.current_lemmata.split(',').map(s => s.trim()),
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
    data.counter++;
  }

  /**
   * Save evaluated sets into the database
   * 
   * Example:
   * --------
   *    const { isSaving, saveEvaluations } = useQueue();
   *    watch( () => data.evaluated.length, 
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
      api.post(`v1/bestworst/evaluations`, data.evaluated)
      .then(response => {
        // delete evaluated sets if API confirms its storage
        response.data['stored-setids'].forEach(setid => {
          var idx = -1;
          while(( idx = data.evaluated.findIndex(elem => elem['set-id'] == setid) ) !== -1){
            data.evaluated.splice(idx, 1);
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
   * Reset Queue
   */
  const resetQueue = () => {
    // reset `searchlemmata`
    searchlemmata.value = ""
    // delete current example set in UI
    data.current = [];
    data.current_setid = undefined;
    data.current_lemmata = undefined;
    // delete lined up BWS sets
    data.queue = []; 
  }


  /// done
  return {
    uispec, searchlemmata, data,
    isReplenishing, isSaving, message_suggestion,
    pullFromQueue,
    nextExampleSet,
    saveEvaluations,
    resetQueue
  }
}


