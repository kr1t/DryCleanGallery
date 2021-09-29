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
          <v-toolbar-title>Items</v-toolbar-title>
          <v-divider class="mx-4" inset vertical />
          <v-spacer />

          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"
                >New Item</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form
                    v-bind:disabled="loading"
                    lazy-validation
                    ref="dialogForm"
                  >
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          :disabled="loading"
                          :rules="titleRule"
                          v-model="editedItem.title"
                          label="Item Name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <input
                          type="file"
                          class="d-none"
                          ref="uploader"
                          accept=".mp3"
                          @change="selectFile()"
                        />
                        <v-text-field
                          :rules="itemRule"
                          :disabled="loading"
                          v-model="editedItem.item"
                          label="Item Url"
                          prepend-icon="mdi-music-box"
                          @click:prepend="$refs.uploader.click()"
                        >
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" sm="12" md="12">
                        <v-select
                          :items="categories"
                          :rules="categoryRule"
                          v-model="editedItem.category_id"
                          name="category"
                          item-text="title"
                          item-value="id"
                          label="Select a category"
                          solo
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="loading"
                  color="blue darken-1"
                  text
                  @click="close"
                  >Cancel</v-btn
                >
                <v-btn
                  :disabled="loading"
                  color="blue darken-1"
                  text
                  @click="save"
                  >Save</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

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

      <template v-slot:[`item.category_id`]="{ value }">
        {{ getCategoryById(value).title }}
      </template>

      <template v-slot:[`body.prepend`]="{ headers }">
        <tr class="mx-0 px-0">
          <td :colspan="headers.length" class="mx-0 px-0">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              filled
              class="px-0 mx-0"
            />
          </td>
        </tr>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)" color="error">
          mdi-delete
        </v-icon>
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
let mainModule = "products";
export default {
  data() {
    return {
      snack: false,
      snackColor: "",
      snackText: "",
      search: "",
      loading: true,
      dialog: false,
      headers: [
        {
          text: "Item Name",
          align: "start",
          sortable: true,
          value: "title",
        },
        { text: "Item URL", value: "item" },
        { text: "Category Name", value: "category_id" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        title: "",
        item: "",
      },
      defaultItem: {
        title: "",
        item: "",
      },
      titleRule: [(v) => !!v || "Item name is required"],
      itemRule: [
        (v) =>
          /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(
            v
          ) || "Item link must be valid",
      ],
      categoryRule: [(v) => !!v || "Category is required"],
    };
  },
  computed: {
    ...mapActions({
      loadItems: `${mainModule}/loadItems`,
      loadCategories: "categories/loadCategories",
    }),
    ...mapGetters({
      items: `${mainModule}/getItems`,
      categories: "categories/categories",
    }),
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
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
      addItem: `${mainModule}/addItem`,
      updateItem: `${mainModule}/updateItem`,
      removeItem: `${mainModule}/removeItem`,
    }),
    getCategoryById: function (id) {
      let category = this.categories.filter((c) => c.id == id)[0];
      if (category === undefined) {
        console.log("undefined qarşim");
        return { title: "Unknown" };
      }
      return category;
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