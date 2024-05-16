<template>
  <div class="search-container">
    <div class="search-icon">
      🔍
    </div>
    <input type="text" class="search-input" placeholder="搜尋" @keyup.enter="handleInput" />
  </div>
</template>

<script>
  export default {
    name: 'SearchComponent',
    methods: {
      handleInput(event) {
        this.$emit('input-change', event.target.value);
      }
    }
  }
</script>

<style>
  @import '@/assets/css/main.css';
</style>