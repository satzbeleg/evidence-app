/** "bestworst1/current" to annotate the current example set */
export default {
  namespaced: true,

  state: () => ({
    /** The example set that is ranked/annotated by the user currently */
    exampleset: {},
    rankings: undefined,
  }),

  mutations: {
    ASSIGN_EXAMPLESET: (state, newExampleSet) => {
      state.exampleset = newExampleSet;
    },
    RESET_RANKINGS: (state, setId) => {
      state.rankings = {"set_id": setId};
    }
  },

  actions: {
    /** move to bestword/ranked/result
     *  pull from bestworst1/unlabeled/queue */
    next(state) {
      // move ranking results
      if(typeof state.rankings !== 'undefined'){
        //this.dispatch("bestworst1/rankings/saveResult", state.rankings);
        console.log(state.rankings)
      }
      // pull new example set
      // we need to strip the reactive observer stuff
      //const newExampleSet = JSON.parse(JSON.stringify(this.getters["bestworst1/unlabeled/dequeueNext"]));
      const newExampleSet = this.getters["bestworst1/unlabeled/dequeueNext"];
      state.commit("ASSIGN_EXAMPLESET", newExampleSet);
      state.commit("RESET_RANKINGS", newExampleSet.set_id);
    },
  },
  
  getters: {
    getExamples: (state) => {
      return state.exampleset.examples;
    },
  }
}
