import { firestore } from "firebase"
import { withCreateTimeStamp } from "@/utils/datetime"

const collName = "LineUsers"

const items = {
  namespaced: true,
  state: {
    items: [],
    currentUser: null,
  },
  getters: {
    getItems: (state) => {
      return state.items
    },
    currentUser: (state) => {
      return state.currentUser
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
    SET_CURRENT_USER(state, data) {
      state.currentUser = data
    },
  },
  actions: {
    async loadCurrentUser({ commit }, user) {
      try {
        const querySnapshot = await firestore()
          .collection("LineUsers")
          .where("line_user_id", "==", user.userId)
          .limit(1)
          .get()

        let item
        let items = querySnapshot.docs.map(function(doc) {
          item = doc.data()
          item.id = doc.id
          return item
        })
        user.registerData = items.length ? items[0] : null
      } catch {
        user.registerData = null
      }

      commit("SET_CURRENT_USER", user)
    },
    async register({ commit, dispatch, state }, item) {
      item.line_user_id = state.currentUser.userId

      item = withCreateTimeStamp(item)

      const docRef = await firestore()
        .collection(collName)
        .add(item)
      item.id = docRef.id
      dispatch("loadCurrentUser", state.currentUser)
      commit("ADD_ITEM", item)
    },

    async addItem({ commit }, item) {
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
