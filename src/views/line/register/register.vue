<template>
  <div class="container">
    <div v-if="currentPage == 1">
      <div class="card p-4" v-if="lineUser">
        <div class="profile text-center">
          <b-avatar :src="lineUser.pictureUrl" size="10rem"></b-avatar>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="form-group">
              <input
                type="text"
                name=""
                id=""
                v-model="form.firstName"
                class="form-control"
                placeholder="ชื่อ"
                aria-describedby="helpId"
              />
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <input
                type="text"
                name=""
                id=""
                v-model="form.lastName"
                class="form-control"
                placeholder="นามสกุล"
                aria-describedby="helpId"
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="form-group">
              <input
                type="tel"
                name=""
                id=""
                v-model="form.tel"
                class="form-control"
                placeholder="เบอร์โทร"
                aria-describedby="helpId"
              />
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <input
                type="email"
                name=""
                id=""
                v-model="form.email"
                class="form-control"
                placeholder="อีเมล"
                aria-describedby="helpId"
              />
            </div>
          </div>
        </div>
        <hr />
        <button class="btn btn-primary" @click="createUser()">
          สมัครสมาชิก
        </button>
      </div>
    </div>
    <div v-if="currentPage == 2">
      <div class="card p-4">
        ขอบคุณ
        <h3>
          คุณ {{ lineUser.registerData.firstName }}
          {{ lineUser.registerData.lastName }}
        </h3>
        สำหรับการลงทะเบียน
        <hr />
        <button class="btn btn-primary" @click="closeWindow()">
          ปิดหน้าจอนี้
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data: () => ({
    currentPage: 0,
    form: {
      firstName: "",
      lastName: "",
      tel: "",
      email: "",
      gender: "",
    },
  }),
  async created() {
    await this.liffInit({ liffId: "1656462036-gk7j8oAR" });
  },
  methods: {
    ...mapActions({
      register: `lineUser/register`,
    }),
    async createUser() {
      this.loadingStart();
      await this.register(this.form);
      this.loadingStop();
      this.currentPage = 2;
    },
  },
  watch: {
    lineUser() {
      if (this.lineUser.registerData) {
        this.currentPage = 2;
      } else {
        this.currentPage = 1;
        this.form.email = this.lineUser.email;
      }
    },
  },
};
</script>

<style>
</style>