<template>
  <div class="entry-list">
    <div class="entry" v-for="(entry, index) in processedEntries" :key="index" :class="{ clicked: index === activeIndex }" @click="emitEntry(index)">
      <div class="entry-info">
        <div class="entry-website">{{ entry.website }}</div>
        <div class="entry-username">{{ entry.username }}</div>
      </div>
      <div class="entry-timestamp">
        {{ entry.localTimestamp }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      searchInput: String
    },
    name: 'EntryListComponent',
    data() {
      return {
        entries: [],
        activeIndex: null, // Add this line to track the index of the active entry
        isActive: false
      };
    },
    computed: {
      processedEntries() {
        return this.entries.map(entry => ({
          ...entry,
          localTimestamp: new Date(entry.timestamp).toLocaleString('zh-CN', {
            timeZone: 'Asia/Shanghai', // Specify the time zone
            hour12: false // Use 24-hour format
          }).replace(',', '')
        }));
      }
    },
    mounted() {
      this.refresh();
    },
    methods: {
      emitEntry(index) {
        this.activeIndex = this.activeIndex === index ? null : index; // Toggle active index
        this.$emit('entry-clicked', this.entries[index]);
      },
      refresh() {
        //console.log("this.searchInput:", this.searchInput);
        const url = `/api/data${this.searchInput ? `?website=${encodeURIComponent(this.searchInput)}` : ''}`;

        this.$http.get(url)
          .then(response => {
            this.entries = response.data; // 將數據存儲到 entries
            this.$emit('refresh', this.entries);
            //console.log('數據加載成功:', this.entries);
          })
          .catch(error => {
            // 處理錯誤
            console.error('Error:', error);
          });
      }
    },
  }
</script>

<style>
  @import '@/assets/css/main.css';
</style>