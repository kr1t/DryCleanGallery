import Vue from "vue"
import Vuex from "vuex"

import { vuexfireMutations } from "vuexfire"

import auth from "./modules/auth"
import sounds from "./modules/sounds"
import products from "./modules/products"
import categories from "./modules/categories"
import root from "./modules/root"
import lineUser from "./modules/lineUser"

import fire from "./modules/fire"

// // import VuexORM from "@vuex-orm/core"
// import User from "@/models/User"
// import Post from "@/models/Post"

// // Create a new instance of Database.
// const database = new VuexORM.Database()

// // Register Models to Database.
// database.register(User)
// database.register(Post)

Vue.use(Vuex)

export default new Vuex.Store({
  // plugins: [VuexORM.install(database)],
  modules: {
    auth,
    categories,
    sounds,
    products,
    root,
    lineUser,
    fire,
  },
  mutations: vuexfireMutations,
})
