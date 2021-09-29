<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      class="elevation-1"
      :loading="loading"
      loading-text="Loading... Please wait"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ titleName }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical />
          <v-spacer />

          <v-btn text icon class="mb-2 ml-2" @click="initialize">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:[`item.item`]="{ value }">
        <a :href="value" target="_blank">
          {{ value | truncate(20, "...") }}
          <span class="mdi mdi-open-in-new"></span>
        </a>
      </template>

      <template v-slot:[`item.gender`]="{ value }">
        {{ getGenderByID(value) }}
      </template>

      <template v-slot:[`item.category_id`]="{ value }">
        {{ getCategoryById(value).title }}
      </template>

      <template v-slot:[`item.createdAt`]="{ value }">
        {{ value.toDate() }}
      </template>

      <template v-slot:[`body.prepend`]="{ headers }">
        <tr class="mx-0 px-0">
          <td :colspan="headers.length" class="mx-0 px-0">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="ค้นหา"
              single-line
              hide-details
              filled
              class="px-0 mx-0"
            />
          </td>
        </tr>
      </template>

      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>

    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" text @click="snack = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { storage } from "firebase";
import { mapActions, mapGetters } from "vuex";
import componentConfig from "./index";
let { mainModuleName, tableHeader, titleName } = componentConfig;

export default {
  data() {
    return {
      titleName,
      // forms,
      snack: false,
      snackColor: "",
      snackText: "",
      search: "",
      loading: true,
      dialog: false,
      headers: tableHeader,
      editedIndex: -1,
      editedItem: {
        title: "",
        item: "",
      },
      defaultItem: {
        title: "",
        item: "",
      },
      genders: [
        {
          id: "m",
          title: "ชาย",
        },
        {
          id: "f",
          title: "หญิง",
        },
      ],
      titleRule: [(v) => !!v || "กรุณากรอกชื่อ"],
      priceRule: [(v) => !!v || "กรุณากรอกราคา"],
      itemRule: [
        (v) =>
          /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(
            v
          ) || "ข้อมูลไม่ถูฏต้อง",
      ],
      categoryRule: [(v) => !!v || "กรุณาระบุ หมวดหมู่"],
    };
  },
  computed: {
    ...mapActions({
      loadItems: `${mainModuleName}/loadItems`,
      loadCategories: "categories/loadCategories",
    }),
    ...mapGetters({
      items: `${mainModuleName}/getItems`,
      categories: "categories/categories",
    }),
    formTitle() {
      return this.editedIndex === -1 ? "สร้าง บริการ" : "แก้ไข บริการ";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
  },
  methods: {
    ...mapActions({
      addItem: `${mainModuleName}/addItem`,
      updateItem: `${mainModuleName}/updateItem`,
      removeItem: `${mainModuleName}/removeItem`,
    }),
    getCategoryById: function (id) {
      let category = this.categories.filter((c) => c.id == id)[0];
      if (category === undefined) {
        console.log("undefined qarşim");
        return { title: "Unknown" };
      }
      return category;
    },
    getGenderByID(id) {
      // return this.genders.find((el) => el.id == id).title;
      return id;
    },
    async initialize() {
      this.loading = true;
      try {
        await this.loadItems;
        await this.loadCategories;
      } catch (e) {
        console.error(e);
      }
      this.loading = false;
    },
    selectFile() {
      let file = this.$refs.uploader.files[0];
      if (file != null && file.name) {
        this.loading = true;
        let ref = storage()
          .ref()
          .child("items/" + file.name);
        let vm = this;
        ref.put(file).then((snapshot) => {
          this.loading = false;
          if (snapshot.state == "success") {
            snapshot.ref.getDownloadURL().then(function (downloadURL) {
              vm.editedItem.item = downloadURL;
            });
          } else {
            this.snack = true;
            this.snackColor = "error";
            this.snackText = "File could not be uploaded";
          }
          file = null;
        });
      } else {
        //müzik seçilmedi
      }
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async deleteItem(item) {
      this.loading = true;
      if (confirm("Are you sure you want to delete this item?")) {
        this.loading = true;
        try {
          await this.removeItem(item);
          storage().refFromURL(item.item).delete();
          this.loading = false;

          this.snack = true;
          this.snackColor = "success";
          this.snackText = "Item has been deleted";
        } catch (e) {
          this.loading = false;

          this.snack = true;
          this.snackColor = "error";
          this.snackText = "Item could not be deleted";

          console.error(e);
        }
      } else {
        this.loading = false;
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if (!this.$refs.dialogForm.validate()) return;

      if (this.editedIndex > -1) {
        this.loading = true;
        try {
          await this.updateItem({
            index: this.editedIndex,
            item: this.editedItem,
          });
          this.loading = false;
          this.close();

          this.snack = true;
          this.snackColor = "success";
          this.snackText = "Item has been updated";
        } catch (e) {
          this.loading = false;
          this.close();

          this.snack = true;
          this.snackColor = "error";
          this.snackText = "Item could not be updated";

          console.error(e);
        }
      } else {
        this.loading = true;
        try {
          await this.addItem(this.editedItem);
          this.loading = false;
          this.close();

          this.snack = true;
          this.snackColor = "success";
          this.snackText = "Item has been added";
        } catch (e) {
          this.loading = false;
          this.close();

          this.snack = true;
          this.snackColor = "error";
          this.snackText = "Item could not be created";

          console.error(e);
        }
      }
    },
  },
  filters: {
    truncate: function (text, length, suffix) {
      if (text.length > length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    },
  },
};
</script>