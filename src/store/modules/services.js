import { firestore } from "firebase"

const collName = "Services"

const items = {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {
    getItems: (state) => {
      return state.items
    },
  },
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },
    ADD_ITEM(state, item) {
      state.items.push(item)
    },
    UPDATE_ITEM(state, payload) {
      Object.assign(state.items[payload.index], payload.item)
    },
    REMOVE_ITEM(state, item) {
      const index = state.items.indexOf(item)
      state.items.splice(index, 1)
    },
  },
  actions: {
    async addItem({ commit, state }, item) {
      item.line_user_id = state.currentUser.userId
      const docRef = await firestore()
        .collection(collName)
        .add(item)
      item.id = docRef.id
      commit("ADD_ITEM", item)
    },
    async loadItems({ commit }) {
      const querySnapshot = await firestore()
        .collection(collName)
        .get()
      let item
      let items = querySnapshot.docs.map(function(doc) {
        item = doc.data()
        item.id = doc.id
        return item
      })
      commit("SET_ITEMS", items)
    },

    // 1 to Many
    async loadItemsByCategoryId(payload, categoryId) {
      const querySnapshot = await firestore()
        .collection(collName)
        .where("category_id", "==", categoryId)
        .get()
      let item
      let items = querySnapshot.docs.map(function(doc) {
        item = doc.data()
        item.id = doc.id
        return item
      })
      return items
    },
    async updateItem({ commit }, payload) {
      await firestore()
        .collection(collName)
        .doc(payload.item.id)
        .set(payload.item)
      commit("UPDATE_ITEM", payload)
    },
    async removeItem({ commit }, item) {
      await firestore()
        .collection(collName)
        .doc(item.id)
        .delete()
      commit("REMOVE_ITEM", item)
    },
  },
}

export default items
