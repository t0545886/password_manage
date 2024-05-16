<template>
  <v-app>
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" right bottom>
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Use Vuetify's container and row/col grid system -->
    <sidebar-component :entryCount="entries.length" class="pa-0 ma-0"></sidebar-component>
    <v-container fluid class="pa-0 ma-0">
      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
          <v-card-title class="text-h5">確認刪除</v-card-title>
          <v-card-text>您確定要刪除此條目嗎？ 此操作無法返回</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">取消</v-btn>
            <v-btn color="red darken-1" text @click="deleteNewEntry">確認</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <header-component @increment-clicked="createNewEntry" @decrement-clicked="dialog = true" @exportData-clicked="exportData"></header-component>
      <v-row>
        <v-col cols="9" class="pa-5 ma-0">
          <search-component @input-change="search"></search-component>
          <entry-list-component :entries="entries" :searchInput="searchInput" ref="entryListComponent" @entry-clicked="handleSelectedEntry" @refresh="refreshCount" />
        </v-col>
        <v-col cols="3">
          <entry-detail :entry="selectedEntry" ref="entryDetail" @saveentry="saveentry" />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
  import {
    saveAs
  } from 'file-saver';
  import ExcelJS from 'exceljs';
  import SidebarComponent from './components/SidebarComponent.vue'
  import HeaderComponent from './components/HeaderComponent.vue'
  import SearchComponent from './components/SearchComponent.vue'
  import EntryListComponent from './components/EntryListComponent.vue'
  import EntryDetail from './components/EntryDetail.vue'
  export default {
    name: 'App',
    components: {
      SidebarComponent,
      HeaderComponent,
      SearchComponent,
      EntryListComponent,
      EntryDetail
    },
    data() {
      return {
        entries: [], // 假設的 entries 數據
        selectedEntry: null,
        snackbarText: '',
        snackbarColor: '',
        dialog: false,
        searchInput: ''
      };
    },
    methods: {
      handleSelectedEntry(entry) {
        this.selectedEntry = entry;
        this.$refs.entryDetail.open(false);
      },
      refreshCount(entries) {
        this.entries = entries;
        //console.log("this.entries.length:", this.entries.length);
      },
      createNewEntry() {
        this.$refs.entryDetail.open(true);
      },
      deleteNewEntry() {
        if (this.selectedEntry != null) {
          this.$http({
              method: 'delete',
              url: `/api/entries/${this.selectedEntry.identy}` // Correctly using template literals here
            })
            .then(() => { // Removed 'response' since it's not used
              this.snackbar = true;
              this.snackbarText = 'Entry deleted successfully!';
              this.snackbarColor = 'success';
              this.$refs.entryListComponent.refresh();
            })
            .catch(error => {
              console.error('Error deleting the entry:', error);
              this.snackbar = true;
              this.snackbarText = 'Error deleting the entry';
              this.snackbarColor = 'error';
            });
        } else {
          this.snackbar = true;
          this.snackbarText = '未選擇項目';
          this.snackbarColor = 'error';
        }
        this.dialog = false; // Close the dialog
      },
      saveentry() {
        this.$refs.entryListComponent.refresh();
      },
      search(input) {
        this.searchInput = input;

        // 使用 $nextTick 確保 searchInput 的更新已經傳遞給子組件
        this.$nextTick(() => {
          this.$refs.entryListComponent.refresh();
        });
      },
      async exportData() {
        this.searchInput = "";
        // 使用 $nextTick 確保 searchInput 的更新已經傳遞給子組件
        this.$nextTick(async () => { // 注意在這裡添加 async
          this.$refs.entryListComponent.refresh();
          const workbook = new ExcelJS.Workbook(); // 創建一個工作簿
          const worksheet = workbook.addWorksheet('My Sheet'); // 添加一個工作表

          // 添加標題行
          worksheet.addRow(['identy', 'website', 'username','password','uri','timestamp']);

          // 添加數據行
          this.entries.forEach(entry => {
            worksheet.addRow([entry.identy, entry.website, entry.username, entry.password, entry.uri, entry.timestamp]);
          });

          // 使用 file-saver 觸發下載
          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          saveAs(blob, 'entries.xlsx');
        });
      }

    }

  };
</script>
<style>
  @import '@/assets/css/main.css';

  .v-application__wrap {
    flex-direction: row;
  }
</style>