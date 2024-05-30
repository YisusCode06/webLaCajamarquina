<template>
  <div class="gen-container">
    <div class="mesa-container">
      <h2>Mesas</h2>
      <div class="cont-newTable">
        <button v-if="!showNewMesaForm" @click="toggleNewMesaForm">Nueva Mesa</button>
        <form v-if="showNewMesaForm" @submit.prevent="confirmSaveNewMesa">
          <label for="newNumber">Numero:</label>
          <input type="text" id="newNumber" v-model.trim="newTable.number" required>

          <label for="newCapacity">Capacidad:</label>
          <input type="text" id="newCapacity" v-model.trim="newTable.capacity" required>

          <label for="newLocation">Ubicacion:</label>
          <select id="newLocation" v-model="newTable.location" required>
            <option value="ESPACIO1">Espacio 1</option>
            <option value="ESPACIO2">Espacio 2</option>
          </select>
          
          <label for="newIsOccupied">Ocupado:</label>
          <select id="newIsOccupied" v-model="newTable.isOccupied" required>
            <option :value="true">Sí</option>
            <option :value="false">No</option>
          </select>

          <div class="form-buttons">
            <button type="submit">Guardar</button>
            <button type="button" @click="cancelNewTable">Cancelar</button>
          </div>
        </form>
      </div>
      <table>
        <thead>
          <tr>
            <th>Numero</th>
            <th>Capacidad</th>
            <th>Ubicacion</th>
            <th>Ocupado</th>
            <th class="th-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="menu in mesas" :key="menu._id">
            <td>{{ menu.number }}</td>
            <td>{{ menu.capacity }}</td>
            <td>{{ menu.location }}</td>
            <td>{{ menu.isOccupied ? 'Sí' : 'No' }}</td>
            <td>
              <button @click="editTable(menu)">Editar</button>
              <button disabled @click="confirmDeleteTable(menu._id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import {apiUrl} from '@/utils/api.js'

const mesas = ref([]);
const showNewMesaForm = ref(false);
const newTable = ref({
  number: '',
  capacity: '',
  location: 'ESPACIO1',
  isOccupied: false
});

const fetchMesas = async () => {
  try {
    const response = await axios.get(`${apiUrl}getables`);
    mesas.value = response.data.tables;
  } catch (error) {
    console.error('Error al obtener la lista de mesas:', error.message);
  }
};

const toggleNewMesaForm = () => {
  showNewMesaForm.value = !showNewMesaForm.value;
};

const cancelNewTable = () => {
  newTable.value = {
    number: '',
    capacity: '',
    location: 'ESPACIO1',
    isOccupied: false
  };
  showNewMesaForm.value = false;
};

const confirmSaveNewMesa = () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡Deseas guardar esta mesa!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, guardar'
  }).then((result) => {
    if (result.isConfirmed) {
      saveNewMesa();
    }
  });
};

const saveNewMesa = async () => {
  try {
    if (!newTable.value._id) {
      const response = await axios.post(`${apiUrl}newtable`, newTable.value);
      mesas.value.push(response.data.table);
    } else {
      const response = await axios.put(`${apiUrl}updatetable/${newTable.value._id}`, newTable.value);
      const index = mesas.value.findIndex(mesa => mesa._id === newTable.value._id);
      if (index !== -1) {
        mesas.value[index] = response.data.table;
      }
    }

    newTable.value = { number: '', capacity: '', location: 'ESPACIO1', isOccupied: false };
    showNewMesaForm.value = false;
    Swal.fire(
      'Guardado!',
      'La mesa ha sido guardada.',
      'success'
    );
  } catch (error) {
    console.error('Error al guardar la mesa:', error.message);
    Swal.fire(
      'Error!',
      'Hubo un problema al guardar la mesa.',
      'error'
    );
  }
};

const editTable = (table) => {
  newTable.value = { ...table };
  showNewMesaForm.value = true;
};

const confirmDeleteTable = (tableId) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteTable(tableId);
    }
  });
};

const deleteTable = async (tableId) => {
  try {
    await axios.delete(`${apiUrl}deletetable/${tableId}`);
    mesas.value = mesas.value.filter(menu => menu._id !== tableId);
    Swal.fire(
      'Eliminado!',
      'La mesa ha sido eliminada.',
      'success'
    );
  } catch (error) {
    console.error('Error al eliminar la mesa:', error.message);
    Swal.fire(
      'Error!',
      'Hubo un problema al eliminar la mesa.',
      'error'
    );
  }
};

onMounted(fetchMesas);
</script>


<style scoped>
@import url('./Tables.css');
</style>