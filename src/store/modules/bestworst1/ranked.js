/** "bestworst1/ranked" to dump the annotated example set */
export default {
  namespaced: true,
  state: () => ({
    /** Ranked examples ready to sync. Push app history when the user finished with one example */
    results: [
      {
        "set_id": "some-rnd-id-generated-0",
        "ui": "bestworst1",
        "event-timestamp": 1242.34,
        "posix-timestamp": 1600159293,
        "best_id": 123,
        "worst_id": 456,
        "other_ids": [78, 90]
      }
    ]
  }),

  mutations: {
    APPEND_EXAMPLE: (state, rankedExampleSet) => {
      state.results.push(rankedExampleSet);
    }
  },

  actions: {
    saveResult: async (state, rankedExampleSet) => {
      return new Promise((resolve, reject) => {
        try{
          state.commit("APPEND_EXAMPLE", rankedExampleSet);
          resolve("it worked");
        }catch(err){
          reject(err);
        }
      });
    }
  },

  getters: {}
}
