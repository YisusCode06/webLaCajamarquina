<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';

const userData = ref(null);
const currentTime = ref('');

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No se ha encontrado un token de autenticación.');
    return;
  }

  try {
    const response = await axios.get('http://localhost:3000/api/v1/getuser', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    userData.value = response.data.user;
    console.log(userData.value);


    const now = new Date();
    const hour = now.getHours();


    if (hour >= 6 && hour < 12) {
      currentTime.value = 'dias';
    } else if (hour >= 12 && hour < 18) {
      currentTime.value = 'tardes';
    } else {
      currentTime.value = 'noches';
    }
  } catch (error) {
    console.error('Error al obtener los datos del perfil:', error.message);
  }
});
</script>

<template>
  <div class="gen-container">
    <div class="content-dashboard">
      <h1>Buenas {{ currentTime }}, sr. {{ userData ? userData.name : '' }}</h1>
    </div>
  </div>
</template>

<style scoped>
@import url('./Dashboard.css');
</style>
