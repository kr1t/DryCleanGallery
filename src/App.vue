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