import { firestoreAction } from "vuexfire"
import { db } from "./db"
import pluralize from "pluralize"

const nameCase = (name) => {
  let stateName = name.toLowerCase()
  let fkKey = `${pluralize.singular(stateName)}_id`
  let nameSingular = `${pluralize.singular(stateName)}`
  let pluralizeName = pluralize(stateName)
  return { nameSingular, stateName, fkKey, pluralizeName }
}

//   relations: { belongsTo: [{ name: "Categories", to: "items" }] },

const template = (collName) => ({
  state: {
    items: [],
    belongsTo: [],
    hasMany: [],
  },
  getters: {
    getItems: (state) => {
      return state.items.map((item) => {
        if (state.belongsTo.length) {
          state.belongsTo.map((belong) => {
            const { nameSingular } = nameCase(belong.name)
            try {
              item[nameSingular] = state[belong.stateName].find((el) => item[belong.fkKey] == el.id)
            } catch (e) {
              item[nameSingular] = {}
              console.error(e)
            }
          })
        }
        if (state.hasMany.length) {
          state.hasMany.map((hasM) => {
            const { pluralizeName } = nameCase(hasM.name)
            try {
              item[pluralizeName] = state[hasM.stateName].filter((el) => item["id"] == el[hasM.pk])
            } catch (e) {
              item[pluralizeName] = {}
              console.error(e)
            }
          })
        }
        return item
      })
    },
  },
  mutations: {
    SET_BELONGS_TO(state, payload) {
      state["belongsTo"].push(payload)
      let uniqueBelongsTo = [...new Set(state["belongsTo"])]
      state["belongsTo"] = uniqueBelongsTo
    },
    SET_HAS_MANY(state, payload) {
      state["hasMany"].push(payload)
      let uniqueBelongsTo = [...new Set(state["hasMany"])]
      state["hasMany"] = uniqueBelongsTo
    },
  },
  actions: {
    bindItems: firestoreAction(async ({ bindFirestoreRef }, { query, stateBind = "items" }) => {
      return await bindFirestoreRef(stateBind, query)
    }),
    async loadItems({ dispatch, commit }, { relations }) {
      await dispatch("bindItems", { query: db.collection(collName) })
      if (relations) {
        if (relations.belongsTo && relations.belongsTo.length) {
          relations.belongsTo.map(async (relation) => {
            const { stateName, fkKey } = nameCase(relation.name)
            await dispatch("loadBelongsTo", relation)
            commit("SET_BELONGS_TO", { ...relation, stateName, fkKey })
          })
        }

        if (relations.hasMany && relations.hasMany.length) {
          relations.hasMany.map(async (relation) => {
            const { stateName } = nameCase(relation.name)
            await dispatch("loadHasMany", relation)
            commit("SET_HAS_MANY", { ...relation, stateName })
          })
        }
      }
    },
    addItem: firestoreAction(async (context, item) => {
      return await db.collection(collName).add(item)
    }),
    updateItem: firestoreAction(async (context, payload) => {
      return await db
        .collection(collName)
        .doc(payload.item.id)
        .set(payload.item)
    }),
    removeItem: firestoreAction(async (context, item) => {
      return await db
        .collection(collName)
        .doc(item.id)
        .delete()
    }),
    loadBelongsTo({ dispatch, state }, { name, to }) {
      const { stateName, fkKey } = nameCase(name)

      let belongsId = state[to].map((el) => {
        if (el[fkKey]) {
          return el[fkKey]
        }
      })
      belongsId = belongsId.filter((el) => el != undefined)

      let uniqueBelongsId = [...new Set(belongsId)]
      dispatch("bindItems", {
        query: db.collection(name).where("id", "in", uniqueBelongsId),
        stateBind: stateName,
      })
    },
    loadHasMany({ dispatch, state }, { name, to, pk }) {
      const { stateName, fkKey } = nameCase(name)

      console.log({ stateName, fkKey, d: state[to] })
      let manyId = state[to].map((el) => {
        if (el["id"]) {
          return el["id"]
        }
      })
      manyId = manyId.filter((el) => el != undefined)

      let uniqueManyId = [...new Set(manyId)]
      dispatch("bindItems", {
        query: db.collection(name).where(pk, "in", uniqueManyId),
        stateBind: stateName,
      })
    },
  },
})

export default template
