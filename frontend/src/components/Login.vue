<script setup>
import "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js";
import "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js";
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const handleSubmit = async (event) => {
  event.preventDefault();

  const email = event.target.querySelector('input[type="email"]').value;
  const password = event.target.querySelector('input[type="password"]').value;
  const formData = {
    email,
    password,
  };
  console.log(formData);

  try {
    const response = await axios.post("http://localhost:3000/api/v1/login", formData);

    if (response.status === 200) {
      const data = response.data;
      console.log(data);
      router.push('/dashboard');
    } else {
      console.error("Error al enviar la solicitud:", response.statusText);
    }
  } catch (error) {
    console.error("Error de red:", error.message);
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
          <input type="email" placeholder="Email" />
          <ion-icon name="mail"></ion-icon>
        </div>
        <div class="input-box">
          <input type="password" placeholder="Contraseña" />
          <ion-icon name="key"></ion-icon>
        </div>
        <button type="submit" class="login-button">Ingresar</button>
        <div class="link-passoff">
          <a class="" href="">¿Olvidaste tu contraseña?</a>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import url('./Login.css');
</style>
