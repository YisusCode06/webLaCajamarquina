<script setup>
import { ref, watch, computed } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const number = ref(route.params.number);

// Estados para los inputs y resultados de búsqueda
const clientName = ref('');
const menuName = ref('');
const searchResults = ref([]);
const selectedMenus = ref([]);

// Función para realizar la búsqueda del menú
const searchMenu = async () => {
    if (menuName.value.trim() === '') {
        searchResults.value = [];
        return;
    }

    try {
        const response = await axios.get(`http://localhost:3000/api/v1/getmenubyname/${menuName.value}`);
        searchResults.value = response.data.menus;
    } catch (error) {
        console.error('Error al buscar el menú:', error.message);
    }
};

// Ver el cambio en el valor de menuName
watch(menuName, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        searchMenu();
    }
});

// Función para manejar la selección de un menú
const selectMenu = (menu) => {
    selectedMenus.value.push({ ...menu, quantity: 1, specialInstructions: '' });
    searchResults.value = [];
    menuName.value = '';
};

// Función para quitar un menú de la tabla
const removeMenu = (index) => {
    selectedMenus.value.splice(index, 1);
};

// Función para calcular el subtotal de un menú
const calculateSubtotal = (menu) => {
    return menu.price * menu.quantity;
};

// Computed para calcular el total del pedido
const total = computed(() => {
    return selectedMenus.value.reduce((acc, menu) => acc + calculateSubtotal(menu), 0);
});
</script>

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
                <input type="text" v-model.trim="menuName" id="menuName" placeholder="Ingrese nombre de menú">

                <ul v-if="searchResults.length > 0" class="menu-list">
                    <p>Seleciona una opcion para agregar:</p>
                    <li v-for="menu in searchResults" :key="menu.id" @click="selectMenu(menu)">{{ menu.name }}</li>
                </ul>

                <table v-if="selectedMenus.length > 0">
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
                        <tr v-for="(menu, index) in selectedMenus" :key="menu.id">
                            <td>{{ menu.name }}</td>
                            <td>{{ menu.price }}</td>
                            <td><input type="number" v-model.number="menu.quantity" min="1" max="10"></td>
                            <td>{{ calculateSubtotal(menu) }}</td>
                            <td><input type="text" v-model.trim="menu.specialInstructions"></td>
                            <td><button @click.prevent="removeMenu(index)">Quitar</button></td>
                        </tr>
                    </tbody>
                </table>
                <h3>Total pedido: S/.{{ total }}</h3>
                <div class="cont-btn">
                    <button>
                        Asignar Pedido
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
@import url('./AsignOrder.css');
</style>
