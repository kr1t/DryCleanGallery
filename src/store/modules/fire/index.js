import products from "./products"
import categories from "./categories"
import posts from "./posts"

export default {
  namespaced: true,
  modules: {
    products,
    posts,
    categories,
  },
}
