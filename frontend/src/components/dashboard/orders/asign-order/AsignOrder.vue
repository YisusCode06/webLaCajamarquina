<template>
    <div class="gen-container">
        <div class="title">
            <h2>Nuevo pedido a mesa número: {{ number }}</h2>
        </div>
        <div class="cont-new-order">
            <form>
                <label for="clientName">Nombre Cliente (Opcional):</label>
                <input type="text" v-model.trim="clientName" id="clientName">

                <label for="menuName">Buscar Menú por Nombre:</label>
                <input type="text" v-model.trim="menuName" id="menuName" @input="searchMenu" placeholder="Ingrese nombre de menú">

                <!-- Aquí mostraremos los resultados de la búsqueda -->
                <ul v-if="searchResults.length > 0">
                    <li v-for="menu in searchResults" :key="menu.id" @click="selectMenu(menu)">{{ menu.name }}</li>
                </ul>

                <table v-if="selectedMenu">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                            <th>Características</th>
                            <th>Quitar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ selectedMenu.name }}</td>
                            <td>{{ selectedMenu.price }}</td>
                            <td><input type="number" v-model.number="quantity" min="1" max="10"></td>
                            <td>{{ selectedMenu.price * quantity }}</td>
                            <td><input type="text" v-model.trim="specialInstructions"></td>
                            <td><button @click.prevent="quitar">Quitar de la tabla</button></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const clientName = ref('');
const menuName = ref('');
const selectedMenu = ref(null);
const quantity = ref(1);
const specialInstructions = ref('');
const searchResults = ref([]);
const number = ref(0); // Debes definir este valor en tu componente

const searchMenu = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/api/v1/getmenubyname/${menuName.value}`);
        if (response.data.success && response.data.menu) {
            // Guardamos los resultados de la búsqueda
            searchResults.value = [response.data.menu];
        } else {
            // Si no se encuentra ningún menú, limpiamos los resultados de la búsqueda
            searchResults.value = [];
            console.error('Menú no encontrado');
        }
    } catch (error) {
        console.error('Error al buscar el menú:', error);
    }
};

const selectMenu = (menu) => {
    // Al hacer clic en un resultado de búsqueda, seleccionamos ese menú
    selectedMenu.value = menu;
};

const quitar = () => {
    if (selectedMenu.value) {
        // Limpiamos el menú seleccionado
        selectedMenu.value = null;
        // Restablecemos la cantidad a 1
        quantity.value = 1;
        // Limpiamos las instrucciones especiales
        specialInstructions.value = '';
    } else {
        console.error('Ningún menú seleccionado');
    }
};
</script>

<style scoped>
@import url('./AsignOrder.css');
</style>
