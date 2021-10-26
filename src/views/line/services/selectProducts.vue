<template>
  <div>
    <div class="p-4 text-center">
      <h1 class="h1-laundry my-2">เลือกบริการ</h1>

      <button @click="$emit('changePage', 'selectCategory')">back</button>

      <!-- selectGenderActive -->
      <div class="selectGenderActive" v-if="categoryActive.type == 'g'">
        <button
          class="btn"
          :class="activeClassGender('all')"
          @click="setGenderActive('all')"
        >
          ทั้งหมด
        </button>

        <button
          class="btn spaceBtn"
          :class="activeClassGender('f')"
          @click="setGenderActive('f')"
        >
          หญิง
        </button>
        <button
          class="btn spaceBtn"
          :class="activeClassGender('m')"
          @click="setGenderActive('m')"
        >
          ชาย
        </button>
      </div>
      <!-- selectGenderActive -->

      <div class="productsContainer mt-4">
        <!-- // PRODUCT GENDER -->
        <div class="productsGender" v-if="categoryActive.type == 'g'">
          <div class="productsFemale" v-if="selectGender != 'm'">
            <ProductItem
              :title="`${categoryActive.title} (หญิง)`"
              :products="[...getProductsByGender('f')]"
              v-if="getProductsByGender('f').length"
              key="f"
            />
            <div v-else>ไม่พบบริการ {{ `${categoryActive.title} (หญิง)` }}</div>
          </div>
          <hr />

          <div class="productsMale" v-if="selectGender != 'f'">
            {{ [...getProductsByGender("m")] }}
            <ProductItem
              :title="`${categoryActive.title} (ชาย)`"
              :products="[...getProductsByGender('m')]"
              v-if="getProductsByGender('m').length"
              key="m"
            />
            <div v-else>ไม่พบบริการ {{ `${categoryActive.title} (ชาย)` }}</div>
          </div>
        </div>
        <!-- // PRODUCT GENDER -->

        <!-- // PRODUCT NORMAL -->
        <div class="productsNormal" v-if="categoryActive.type == 'n'">
          <div class="productsNormalAll">
            <ProductItem
              :title="`${categoryActive.title}`"
              :products="categoryActive.products"
              v-if="categoryActive.products.length"
              key="n"
            />
            <div v-else>ไม่พบบริการ {{ `${categoryActive.title}` }}</div>
          </div>
        </div>
        <!-- // PRODUCT NORMAL -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ProductItem from "./components/ProductItem.vue";
export default {
  components: {
    ProductItem,
  },
  computed: {
    ...mapGetters("fire/categories", {
      categoryActive: "categoryActive",
    }),
  },
  data: () => ({
    selectGender: "all",
  }),
  methods: {
    activeClassGender(name) {
      return this.selectGender == name
        ? "btn-primary"
        : "btn-outline-secondary";
    },
    setGenderActive(name) {
      this.selectGender = name;
    },
    getProductsByGender(genderName) {
      try {
        return this.categoryActive.products.filter(
          (product) => product.gender == genderName
        );
      } catch {
        return [];
      }
    },
  },
};
</script>

<style lang="scss">
.spaceBtn {
  margin-left: 12px;
}
</style>