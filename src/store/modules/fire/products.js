import templateFire from "./template"
const colName = "Products"
const { state, getters, mutations, actions } = templateFire(colName)
const products = {
  namespaced: true,

  state: {
    ...state,
    categories: [],
  },
  mutations: {
    ...mutations,
  },
  getters: {
    ...getters,
  },
  actions: {
    ...actions,
  },
}

export default products
