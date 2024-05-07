<script setup>
import Sidebar from '@/components/dashboard/sidebar/Sidebar.vue'
</script>

<template>
  <Sidebar />
  <div class="content-dashboard">
    <router-view />
  </div>
</template>
