<template>
  <div class="products">
    <h5>{{ title }}</h5>
    {{ pros }}
    <div v-for="(product, i) in products" :key="product.id">
      <div class="row" v-if="i < showItem">
        <div class="col-7 text-left">
          {{ product.title }}
        </div>
        <div class="col-5">
          <button @click="dec(i)">-</button>
          {{ pros[i] }}
          <button @click="inc(i)">+</button>
        </div>
      </div>
    </div>

    <button
      class="btn btn-outline-secondary"
      @click="showItem += 3"
      v-if="products.length >= showItem"
    >
      ดูเพิ่มเติม
    </button>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Category Name",
    },
    products: {
      default: [],
    },
  },
  data: () => ({
    productNumber: 0,
    showItem: 3,
    pros: [],
  }),

  methods: {
    inc(i) {
      this.pros[i] += 1;
      console.log("i", this.pros[i]);
    },
    dec(i) {
      if (this.pros[i] > 0) {
        this.pros[i]--;
        console.log("d", this.pros[i]);
      }
    },
  },
  created() {
    this.products.map(() => {
      this.pros.push(0);
    });

    console.log(this.pros);
  },
};
</script>

<style>
</style>    