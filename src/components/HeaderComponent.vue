<template>
  <div class="header">
    <div class="header-controls">
      <button @click="increment" class="control-button plus-button">
        +
      </button>
      <button @click="decrement" class="control-button minus-button">
        -
      </button>
      <button @click="exportData" class="control-button export-button">
        匯出
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HeaderComponent',
    data() {
      return {
        showLogo: true // Set this to false if you want to hide the logo
      };
    },
    mounted() {
      //console.log('HeaderComponent mounted');
    },

    created() {
      //console.log('HeaderComponent created');
    },

    methods: {
      increment() {
        this.$emit('increment-clicked');
      },
      decrement() {
        this.$emit('decrement-clicked');
      },
      exportData() {
        this.$emit('exportData-clicked');
      }
    }
  }
</script>

<style>
  @import '@/assets/css/main.css';
</style>