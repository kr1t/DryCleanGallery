<template>
  <div class="container">
    <div class="p-4 text-center">
      <h1>เลือกบริการ</h1>
      <div class="row">
        <div class="col-6" v-for="category in categories" :key="category.id">
          <div class="card bg-primary">
            <div class="card-body" @click="setActive(category.id)">
              <div>
                <img :src="category.image" alt="" />
              </div>

              {{ category.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("fire/categories", {
      categories: "getItems",
    }),
  },
  methods: {
    ...mapActions({
      loadCategoriesWithProducts: "categories/loadCategoriesWithProducts",
    }),
    ...mapActions("fire/categories", {
      setCategoryActive: "setCategoryActive",
    }),
    setActive(id) {
      this.setCategoryActive(id);
      this.$emit("changePage", "selectProducts");
    },
  },
};
</script>
