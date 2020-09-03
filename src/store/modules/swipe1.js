export default {
  namespaced: true,

  state: () => ({
    swipes: []
  }),

  mutations: {
    ADD_SWIPE: (state, { item_id, direction, timestamp }) => {
      state.swipes.push({
        'item_id': item_id,
        'direction': direction,
        'event-timestamp': timestamp, // Event.timeStamp, the time since the web document was created
        'posix-timestamp': new Date().getTime()
      });
    }
  },

  actions: {
    addSwipe: (state, { item_id, direction, timestamp }) => {
      state.commit('ADD_SWIPE', { item_id, direction, timestamp });
    }
  },

  getters: {
    getLast: (state) => {
      return state.swipes[state.swipes.length - 1];
    }
  }
}