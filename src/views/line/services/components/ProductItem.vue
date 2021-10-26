<template>
  <div class="products">
    <h5 class="title-product">{{ title }}</h5>
    <!-- {{ pros }} -->
    <div v-for="(product, i) in products" :key="product.id">
      <div class="row" v-if="i < showItem">
        <div class="col-5">
          <p class="product-name">{{ product.title }}</p> 
        </div>
        <div class="col-3">
          <p class="product-price">{{ product.price }} บาท</p> 
        </div>
        <div class="col-4">
          <button class="btn-outline-product" @click="dec(i)">-</button>
          <span class="product-amount">{{ pros[i] }}</span>
          <button class="btn-product" @click="inc(i)">+</button>
        </div>
      </div>
    </div>

    <button
      class="btn btn-outline-secondary mt-3"
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
.title-product{
  text-align: left;
  font-weight: 700;
}
.product-name{
  text-align: left;
  font-weight: 600;
}
.product-price{
  text-align: left;
  font-weight: 600;
  color: #233aa6;
}
.product-amount{
  font-weight: 600;
  margin: 0px 10px;
}
.btn-product{
  width: 25px;
  height: 25px;
  border: 1px solid rgb(27, 27, 27);
  border-radius: 50%;
}
.btn-outline-product{
  width: 25px;
  height: 25px;
  color: rgb(194, 194, 194);
  border: 1px solid rgb(194, 194, 194);
  border-radius: 50%;
}
</style>    