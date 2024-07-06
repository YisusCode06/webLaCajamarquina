<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { apiUrl } from '@/utils/api.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);

const handleSubmit = async (event) => {
  event.preventDefault();
  loading.value = true;

  const email = event.target.querySelector('input[type="email"]').value;
  const password = event.target.querySelector('input[type="password"]').value;
  const formData = { email, password };

  try {
    const response = await axios.post(`${apiUrl}login`, formData);

    if (response.status === 200) {
      const data = response.data;
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } else {
      console.error("Error al enviar la solicitud:", response.statusText);
    }
  } catch (error) {
    console.error("Error de red:", error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="gen-container">
    <div class="form-container">
      <div class="header-form">
        <h1>Bienvenido!</h1>
        <img src="../assets/laCajamarquina/logoCajamarquina.png" />
      </div>

      <form class="login-form" @submit="handleSubmit">
        <div class="input-box">
          <input type="email" placeholder="Email" required />
          <ion-icon name="mail"></ion-icon>
        </div>
        <div class="input-box">
          <input type="password" placeholder="Contraseña" required />
          <ion-icon name="key"></ion-icon>
        </div>
        <button type="submit" class="login-button" :disabled="loading">
          <span v-if="loading">Cargando...</span>
          <span v-else>Ingresar</span>
        </button>
        <div class="link-passoff">
          <a href="">Si Olvidaste la contraseña contacte al administrador</a>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import url('./Login.css');
</style>
