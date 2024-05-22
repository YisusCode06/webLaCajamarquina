<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const orders = ref([]);
const tables = ref({});
const users = ref({});
const menus = ref({});

const loadTables = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/getables');
        response.data.tables.forEach(table => {
            tables.value[table._id] = table;
        });
    } catch (error) {
        console.error('Error al cargar las mesas:', error.message);
        alert('Error al cargar mesas...');
    }
};
const loadMenus = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/getmenus');
        response.data.menus.forEach(menu => {
            menus.value[menu._id] = menu;
        });
    } catch (error) {
        console.error('Error al cargar los menus:', error.message);
        alert('Error al cargar los menus...');
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
    } catch (error) {
        console.error('Error al cargar los Usuarios:', error.message);
        alert('Error al cargar usuarios...');
    }
};
const loadOrders = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/getorders');
        orders.value = response.data.orders;
    } catch (error) {
        console.error('Error al cargar los pedidos del día:', error.message);
    }
};

onMounted(() => {
    loadOrders();
    loadTables();
    loadUsers();
    loadMenus();
});
</script>

<template>
    <div class="gen-container">
        <div class="title">
            <h2>Pedidos del día</h2>
        </div>
        <div class="cont-list-order">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Acciones</th>
                            <th>Cliente</th>
                            <th>Mesa</th>
                            <th>Ítems</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Pagado</th>
                            <th>Atendido por</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in orders" :key="order._id">
                            <td>
                                <button>Cambiar Estado</button>
                                <button>Pagado</button>
                                <button>Editar</button>
                                <button>Eliminar</button>
                            </td>
                            <td>{{ order.clientName }}</td>
                            <!-- Obtener el nombre de la mesa usando el _id -->
                            <td>{{ tables[order.table] ? tables[order.table].number : 'Mesa no encontrada' }}</td>
                            <td>
                                <ul>
                                    <li v-for="item in order.items" :key="item._id">
                                        {{ item.quantity }} x {{ menus[item.menu] ? menus[item.menu].name : 'Menu no encontrado' }} (S/. {{ item.subtotal }})
                                    </li>
                                </ul>
                            </td>
                            <td>S/. {{ order.total }}</td>
                            <td>{{ order.status }}</td>
                            <td>{{ order.isPaid ? 'Sí' : 'No' }}</td>
                            <td>{{ users[order.attendedBy] ? users[order.attendedBy].name : 'Usuario no encontrado' }}
                            </td>
                            <td>{{ new Date(order.date).toLocaleString() }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('./ListOrders.css');
</style>
