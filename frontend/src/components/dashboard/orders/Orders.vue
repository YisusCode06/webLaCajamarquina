<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const mesas = ref([]);
const selectedLocation = ref('ALL');

const fetchMesas = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/getables');
        mesas.value = response.data.tables;
    } catch (error) {
        console.error('Error al obtener la lista de mesas:', error.message);
    }
};

onMounted(fetchMesas);

const filteredMesas = computed(() => {
    if (selectedLocation.value === 'ALL') {
        return mesas.value;
    } else {
        return mesas.value.filter(mesa => mesa.location === selectedLocation.value);
    }
});
</script>

<template>
    <div class="gen-container">
        <div class="title">
            <h1>Pedidos</h1>
            <router-link to="list-orders">
                <button class="btn-list-orders">
                    Lista de Pedidos
                </button>
            </router-link>
        </div>
        <div class="filter-container">
            <label for="locationFilter">Filtrar por Ubicación:</label>
            <select id="locationFilter" v-model="selectedLocation">
                <option value="ALL">Todas</option>
                <option value="ESPACIO1">Espacio 1</option>
                <option value="ESPACIO2">Espacio 2</option>
            </select>
        </div>
        <div class="cont-tables">
            <div v-for="mesa in filteredMesas" :key="mesa._id" class="table-card">
                <div class="table-details">
                    <h1>MESA:</h1>
                    <h1>{{ mesa.number }}</h1>
                    <p>{{ mesa.isOccupied ? 'Ocupado' : 'Desocupado' }}</p>
                </div>
                <div class="table-actions">
                    <router-link :to="`asign-order/${mesa._id}`">
                        <button :disabled="mesa.isOccupied">
                        Asignar Pedido
                    </button>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('./Orders.css');
</style>