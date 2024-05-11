<template>
  <div class="gen-container">
    <div class="cont-profile">
      <div class="cont-close">
        <button @click="logout">Cerrar Sesión</button>
      </div>
      <h1>Perfil Usuario</h1>
      <form @submit.prevent="saveChanges">
        <label for="name">Nombre:</label>
        <input type="text" name="name" id="name" v-model="userData.name" :disabled="!editMode">

        <label for="dni">DNI:</label>
        <input type="text" name="dni" id="dni" v-model="userData.dni" :disabled="!editMode">

        <label for="phone">Teléfono:</label>
        <input type="text" name="phone" id="phone" v-model="userData.phone" :disabled="!editMode">

        <label for="email">Email:</label>
        <input type="email" name="email" id="email" v-model="userData.email" :disabled="!editMode">

        <label for="password">Contraseña:</label>
        <input type="password" name="password" id="password" v-model="userData.password" disabled>

        <label for="role">Rol:</label>
        <input type="text" name="role" id="role" v-model="userData.role" disabled>

        <button v-if="!editMode" @click="enableEditMode">Editar</button>
        <button v-if="editMode" type="submit">Guardar</button>
        <button v-if="editMode" @click="cancelEdit">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const editMode = ref(false);
const userData = ref({
  name: "",
  dni: "",
  phone: "",
  email: "",
  password: "",
  role: "",
  _id: ""
});

const enableEditMode = () => {
  editMode.value = true;
};

const saveChanges = async () => {
  console.log('Guardando cambios...');
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No se ha encontrado un token de autenticación.');
    return;
  }
  try {
    const dataToUpdate = {
      name: userData.value.name,
      email: userData.value.email,
      phone: userData.value.phone,
      dni: userData.value.dni,
    };

    const response = await axios.put(
      `http://localhost:3000/api/v1/edituser/${userData.value._id}`,
      dataToUpdate, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    );
    console.log(response.data);
    editMode.value = false;
  } catch (error) {
    console.error('Error al guardar los cambios:', error.message);
  }
};

const cancelEdit = () => {
  editMode.value = false;
};

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
    const { name, dni, phone, email, password, role, _id } = response.data.user;
    userData.value = { name, dni, phone, email, password, role, _id };
    console.log(userData.value)
  } catch (error) {
    console.error('Error al obtener los datos del perfil:', error.message);
  }
});
const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/';
};

</script>

<style scoped>
@import url('./Profile.css');
</style>