<script setup>
import { ref } from 'vue'
const menuOpen = ref(false)
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
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
        <router-link
          to="/dashboard/users"
          :class="[menuOpen ? 'option-container' : 'option-container-collapsed']"
        >
          <ion-icon name="people-outline"></ion-icon>
          <span>Usuarios</span>
        </router-link>
        <router-link
          to="/dashboard/menu"
          :class="[menuOpen ? 'option-container' : 'option-container-collapsed']"
        >
          <ion-icon name="book-outline"></ion-icon>
          <span>Menus</span>
        </router-link>
        <router-link
          to="/dashboard/tables"
          :class="[menuOpen ? 'option-container' : 'option-container-collapsed']"
        >
          <ion-icon name="bowling-ball-outline"></ion-icon>
          <span>Mesas</span>
        </router-link>
        <router-link
          to="/dashboard/orders"
          :class="[menuOpen ? 'option-container' : 'option-container-collapsed']"
        >
          <ion-icon name="apps-outline"></ion-icon>
          <span>Pedidos</span>
        </router-link>
        <router-link
          to="/dashboard/reports"
          :class="[menuOpen ? 'option-container' : 'option-container-collapsed']"
        >
          <ion-icon name="server-outline"></ion-icon>
          <span>Reportes</span>
        </router-link>
      </div>
    </div>
    <router-link to="/dashboard/profile">
      <div :class="[menuOpen ? 'content-perfil' : 'content-perfil-collapsed']">
        <img src="https://pics.filmaffinity.com/brad_pitt-180902992984558-nm_large.jpg" alt="" />
        <p>Jesus Bernui</p>
      </div>
    </router-link>
  </div>
</template>
<style>
@import url('./Sidebar.css');
</style>
