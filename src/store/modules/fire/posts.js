import { firestoreAction } from "vuexfire"
import { db } from "./db"

const collName = "Products"

const posts = {
  namespaced: true,

  state: {
    items: [],
  },
  getters: {
    getItems: (state) => {
      return state.items
    },
  },
  actions: {
    bindItems: firestoreAction(async ({ bindFirestoreRef }, query) => {
      return await bindFirestoreRef("items", query)
    }),
    loadItems({ dispatch }) {
      dispatch("bindItems", db.collection(collName))
    },
    addItem: firestoreAction((context, item) => {
      console.log(item)
      return db.collection(collName).add(item)
    }),
    updateItem: firestoreAction((context, payload) => {
      return db
        .collection(collName)
        .doc(payload.item.id)
        .set(payload.item)
    }),
    removeItem: firestoreAction((context, item) => {
      return db
        .collection(collName)
        .doc(item.id)
        .delete()
    }),
    create(context, payload) {
      console.log(payload)
      // dispatch("addItem", payload)
      return db.collection(collName).add(payload)
    },
  },
}

export default posts
