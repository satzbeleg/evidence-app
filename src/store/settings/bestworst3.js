export default {
  namespaced: true,
  state: () => ({
    reorderpoint: 4,
    orderquantity: 5
  }),
  mutations: {
    setR: (state, newval) => { state.reorderpoint = newval },
    setQ: (state, newval) => { state.orderquantity = newval }
  },
  actions: {},
  getters: {
    getR: (state) => { return state.reorderpoint },
    getQ: (state) => { return state.orderquantity }
  }
}