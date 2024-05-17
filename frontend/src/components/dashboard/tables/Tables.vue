<template>
    <div class="gen-container">
        <div class="mesa-container">
            <h2>Mesas</h2>
            <div class="cont-newTable">
                <button v-if="!showNewMesaForm" @click="toggleNewMesaForm">Nueva Mesa</button>
                <!-- Formulario para crear nueva mesa -->
                <form v-if="showNewMesaForm" @submit.prevent="saveNewMesa">
                    <label for="newNumber">Numero:</label>
                    <input type="text" id="newNumber" v-model.trim="newTable.number" required>

                    <label for="newCapacity">Capacidad:</label>
                    <input type="text" id="newCapacity" v-model.trim="newTable.capacity" required>

                    <label for="newLocation">Ubicacion:</label>
                    <select id="newLocation" v-model="newTable.location" required>
                        <option value="ESPACIO1">Espacio 1</option>
                        <option value="ESPACIO2">Espacio 2</option>
                    </select>

                    <!-- <label for="newIsOccupied">Ocupado:</label>
                    <input type="checkbox" id="newIsOccupied" v-model="newTable.isOccupied"> -->

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
                            <button @click="deleteTable(menu._id)">Eliminar</button>
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
        const response = await axios.get('http://localhost:3000/api/v1/getables');
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

const saveNewMesa = async () => {
    try {
        if (!newTable.value._id) {
            // Crear nueva mesa
            const response = await axios.post('http://localhost:3000/api/v1/newtable', newTable.value);
            mesas.value.push(response.data.table);
        } else {
            // Editar mesa existente
            const response = await axios.put(`http://localhost:3000/api/v1/updatetable/${newTable.value._id}`, newTable.value);
            const index = mesas.value.findIndex(mesa => mesa._id === newTable.value._id);
            if (index !== -1) {
                mesas.value[index] = response.data.table;
            }
        }

        newTable.value = { number: '', capacity: '', location: 'ESPACIO1', isOccupied: false };
        showNewMesaForm.value = false;
    } catch (error) {
        console.error('Error al guardar la mesa:', error.message);
    }
};

const editTable = (table) => {
    newTable.value = { ...table };
    showNewMesaForm.value = true;
};

onMounted(fetchMesas);

const deleteTable = async (tableId) => {
    try {
        await axios.delete(`http://localhost:3000/api/v1/deletetable/${tableId}`);
        mesas.value = mesas.value.filter(menu => menu._id !== tableId);
    } catch (error) {
        console.error('Error al eliminar la mesa:', error.message);
    }
};
</script>

<style scoped>
@import url('./Tables.css');
</style>
