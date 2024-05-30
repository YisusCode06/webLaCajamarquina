<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import {apiUrl} from '@/utils/api.js'

const userData = ref(null);
const menuOpen = ref(false)
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No se ha encontrado un token de autenticación.');
    return;
  }

  try {
    const response = await axios.get(`${apiUrl}getuser`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    userData.value = response.data.user;
    console.log(userData.value);

  } catch (error) {
    console.error('Error al obtener los datos del perfil:', error.message);
  }
});
</script>
<template>
  <div :class="[menuOpen ? 'gen-sidebar' : 'collapsed']">
    <div class="btn-control" @click="toggleMenu">
      <ion-icon :name="menuOpen ? 'close-outline' : 'menu-outline'"></ion-icon>
    </div>
    <div class="content-sidebar">
      <div class="image-container">
        <router-link to="/dashboard">
          <img src="../../../assets/laCajamarquina/logoCajamarquina.png" alt="" />
        </router-link>
      </div>
      <div class="options-conteiner">
        <router-link v-if="userData && userData.role !== 'USER'" to="/dashboard/users"
          :class="[menuOpen ? 'option-container' : 'option-container-collapsed']">
          <ion-icon name="people-outline"></ion-icon>
          <span>Usuarios</span>
        </router-link>
        <router-link to="/dashboard/tables" :class="[menuOpen ? 'option-container' : 'option-container-collapsed']">
          <ion-icon name="bowling-ball-outline"></ion-icon>
          <span>Mesas</span>
        </router-link>
        <router-link to="/dashboard/menu" :class="[menuOpen ? 'option-container' : 'option-container-collapsed']">
          <ion-icon name="book-outline"></ion-icon>
          <span>Menus</span>
        </router-link>
        <router-link to="/dashboard/orders" :class="[menuOpen ? 'option-container' : 'option-container-collapsed']">
          <ion-icon name="apps-outline"></ion-icon>
          <span>Pedidos</span>
        </router-link>
        <router-link to="/dashboard/reports" :class="[menuOpen ? 'option-container' : 'option-container-collapsed']">
          <ion-icon name="document-outline"></ion-icon>
          <span>Reportes</span>
        </router-link>
      </div>
    </div>
    <router-link to="/dashboard/profile">
      <div :class="[menuOpen ? 'content-perfil' : 'content-perfil-collapsed']">
        <img src="https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" alt="" />
        <p>{{ userData ? userData.name : '' }}</p>
      </div>
    </router-link>
  </div>
</template>
<style>
@import url('./Sidebar.css');
</style>
