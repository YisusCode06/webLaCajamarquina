<script setup>
import Sidebar from '@/components/dashboard/sidebar/Sidebar.vue'
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/');
  }
});
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
  min-width: 320px;
}
.content-dashboard {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #e3e9f7;
}
</style>
