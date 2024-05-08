<script setup>
import Sidebar from '@/components/dashboard/sidebar/Sidebar.vue'
</script>

<template>
  <div class="gendash">
    <Sidebar />
    <div class="content-dashboard">
      <router-view />
    </div>
  </div>
</template>
<style scoped>
.gendash {
  display: flex;
  min-height: 100vh;
  background-color: #e3e9f7;
}
.content-dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #e3e9f7;
  padding: 15px;
}
</style>
