<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const orders = ref([]);
const users = ref({});

const loadOrders = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/getorders');
        orders.value = response.data.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
      } catch (error) {
        console.error('Error al cargar los pedidos:', error.message);
        Swal.fire('Error', 'Error al cargar los pedidos', 'error');
    }
};
const loadUsers = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://localhost:3000/api/v1/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        response.data.users.forEach(user => {
            users.value[user._id] = user;
        });
        console.log(users.value);
    } catch (error) {
        console.error('Error al cargar los Usuarios:', error.message);
        Swal.fire('Error', 'Error al cargar usuarios...', 'error');
    }
};

onMounted(() => {
    loadOrders();
    loadUsers();
});

</script>

<template>
  <div class="gen-container">
    <div class="content-reports">
      <div class="title">
        <h1>Reportes de pedidos</h1>
        <div class="total">Total: S/. </div>
      </div>
      
      <div class="controls">
        <div class="control1">
          <label for="start-date">Seleccione periodo de tiempo:</label>
          <div>
            de:
            <input type="date" id="start-date" name="start-date">
            hasta:
            <input type="date" id="end-date" name="end-date">
          </div>
        </div>
        
        <div class="control2">
          <label for="user-select">Pedidos por usuario:</label>
          <select name="user-select" id="user-select">
            <option v-for="user in users" :value="user"> {{ user.name }}</option>
          </select>
        </div>
      </div>
      
      <div class="abstract">
        <h2>Pedidos Totales por Usuario:</h2>
        <div class="users">
          <div class="user-card" v-for="i in 18" :key="i">
            <div>Juan: {{ i }} pedidos</div>
            <div>Saldo S/. {{ i + i }}</div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
@import url('./Reports.css');
</style>
