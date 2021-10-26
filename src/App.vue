<template>
  <div>
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      color="#ffffff"
      :opacity="1"
      :is-full-page="fullPage"
      background-color="#233aa6"
      :lock-scroll="true"
    ></loading>
    <router-view />
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  components: {
    Loading,
  },
  data: () => ({
    offsetTop: 0,
    stick: false,
    fullPage: true,
    d: "233aa6",
  }),
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
html,body{
  font-family: 'Prompt', sans-serif !important;
}
.btn-primary{
  background-color: #233aa6 !important;
  border-radius: 30px !important;
  padding: 10px 20px !important;
}
.btn-outline-secondary{
  color: #233aa6 !important;
  border: 1px solid #233aa6 !important;
  border-radius: 30px !important;
  padding: 10px 20px !important;
}
</style>