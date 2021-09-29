<template>
  <div>
    <selectCategory
      v-if="currentPage == 'selectCategory'"
      @changePage="setCurrentPage"
    />
    <selectProducts
      v-if="currentPage == 'selectProducts'"
      @changePage="setCurrentPage"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import selectCategory from "./selectCategory.vue";
import selectProducts from "./selectProducts.vue";

export default {
  components: {
    selectCategory,
    selectProducts,
  },
  data: () => ({
    currentPage: "selectCategory",
  }),
  computed: {
    ...mapGetters("fire/products", {
      products: "getItems",
    }),
  },
  methods: {
    ...mapActions("fire/categories", {
      loadCategories: "loadItems",
    }),
    ...mapActions({
      loadCategoriesWithProducts: "categories/loadCategoriesWithProducts",
    }),
    ...mapActions("fire/products", {
      addProduct: "addItem",
      loadProducts: "loadItems",
    }),
    setCurrentPage(pageName) {
      this.currentPage = pageName;
    },
  },
  async created() {
    this.loadingStart();
    await this.loadCategories({
      relations: {
        hasMany: [{ name: "Products", to: "items", pk: "category_id" }],
      },
    });
    this.loadingStop();
  },
};
</script>

<style>
</style>