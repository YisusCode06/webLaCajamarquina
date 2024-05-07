<script setup>
import { onMounted } from 'vue';
import Login from '@/components/Login.vue';
import { useRouter } from 'vue-router';
import { getRefreshTokenFromCookies } from '../utils/cookies.js';

const router = useRouter();

onMounted(() => {
  const refreshToken = getRefreshTokenFromCookies();
  console.log(refreshToken);
  if (refreshToken) {
    router.push('/dashboard');
  }
});
</script>

<template>
    <Login />
</template>
