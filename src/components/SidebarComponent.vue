<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <i class="menu-icon"></i>
      <span class="header-title">全部</span>
    </div>
    <div v-for="item in menuItems" :key="item.id" class="menu-item" :class="{ active: activeItem === item.id }" @click="setActive(item.id)">
      <div class="item-content">
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </div>
      <span class="header-count">{{ item.count }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    entryCount: {
    type: Number,
    default: 0 // 如果没有传递 entryCount，将使用 0 作为默认值
  }
  },
  name: 'SidebarComponent',
  data() {
    return {
      activeItem: 'loginItems'
    };
  },
  computed: {
    menuItems() {
      return [
        { id: 'loginItems', label: '登入項目', icon: 'icon-login', count: this.entryCount }
      ];
    }
  },
  methods: {
    setActive(item) {
      this.activeItem = item;
    },
  }
}
</script>

<style>
  @import '@/assets/css/main.css';
</style>