import templateFire from "./template"
const colName = "Categories"
const { state, getters, mutations, actions } = templateFire(colName)
const categories = {
  namespaced: true,

  state: {
    ...state,
    products: [],
    idActive: "",
  },
  getters: {
    ...getters,
    categoryActive: (state) => {
      let item = state.items.find((category) => category.id == state.idActive)
      item.products = item.products.map((el) => {
        el.model = 0
        return el
      })
      return item
    },
  },
  mutations: {
    ...mutations,
    SET_CATEGORY_ACTIVE(state, categoryActive) {
      state.idActive = categoryActive
    },
  },

  actions: {
    ...actions,
    setCategoryActive({ commit }, activeId) {
      commit("SET_CATEGORY_ACTIVE", activeId)
    },
  },
}

export default categories
