<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

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
        Swal.fire('Error', 'Error al cargar mesas...', 'error');
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
        Swal.fire('Error', 'Error al cargar los menus...', 'error');
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
        Swal.fire('Error', 'Error al cargar usuarios...', 'error');
    }
};

const loadOrders = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/getorders');
        orders.value = response.data.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error('Error al cargar los pedidos del día:', error.message);
        Swal.fire('Error', 'Error al cargar los pedidos del día', 'error');
    }
};

const changeOrderStatus = async (orderId, newStatus) => {
    try {
        const response = await axios.put(`http://localhost:3000/api/v1/updateorder/${orderId}`, { status: newStatus });
        const index = orders.value.findIndex(order => order._id === orderId);
        if (index !== -1) {
            orders.value[index] = response.data.order;
            Swal.fire('Éxito', 'Estado del pedido cambiado', 'success');
        }
    } catch (error) {
        console.error('Error al cambiar el estado del pedido:', error.message);
        Swal.fire('Error', 'Error al cambiar el estado del pedido', 'error');
    }
};

const markOrderAsPaid = async (orderId, tableId) => {
    try {
        const response = await axios.put(`http://localhost:3000/api/v1/updateorder/${orderId}`, { isPaid: true });
        const index = orders.value.findIndex(order => order._id === orderId);
        if (index !== -1) {
            orders.value[index] = response.data.order;
        }
        await axios.put(`http://localhost:3000/api/v1/updatetable/${tableId}`, { isOccupied: false });
        Swal.fire('Éxito', 'Pedido marcado como pagado', 'success');
    } catch (error) {
        console.error('Error al marcar el pedido como pagado:', error.message);
        Swal.fire('Error', 'Error al marcar el pedido como pagado', 'error');
    }
};

const deleteOrder = async (orderId, tableId) => {
    try {
        await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`http://localhost:3000/api/v1/deleteorder/${orderId}`);
                orders.value = orders.value.filter(order => order._id !== orderId);
                await axios.put(`http://localhost:3000/api/v1/updatetable/${tableId}`, { isOccupied: false });
                Swal.fire('Eliminado!', 'El pedido ha sido eliminado.', 'success');
            }
        });
    } catch (error) {
        console.error('Error al eliminar el pedido:', error.message);
        Swal.fire('Error', 'Error al eliminar el pedido', 'error');
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
                            <th>Indicaciones</th>
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
                                <select v-if="!order.isPaid" v-model="order.status"
                                    @change="changeOrderStatus(order._id, order.status)">
                                    <option value="POR ATENDER">POR ATENDER</option>
                                    <option value="EN PROCESO">EN PROCESO</option>
                                    <option value="ATENDIDA">ATENDIDA</option>
                                </select>
                                <button v-if="order.status == 'ATENDIDA'"
                                    @click="markOrderAsPaid(order._id, order.table)">Pagado</button>
                                <router-link v-if="order.status == 'EN PROCESO' || order.status == 'POR ATENDER'"
                                    :to="`edit-order/${order._id}`">
                                    <button>Editar</button>
                                </router-link>
                                <button v-if="order.status != 'ATENDIDA'"
                                    @click="deleteOrder(order._id, order.table)">Eliminar</button>
                            </td>
                            <td>{{ order.clientName }}</td>
                            <td>{{ tables[order.table] ? tables[order.table].number : 'Mesa no encontrada' }}</td>
                            <td>
                                <ul>
                                    <li v-for="item in order.items" :key="item._id">
                                        {{ item.quantity }} x {{ menus[item.menu] ? menus[item.menu].name : 'Menu no encontrado' }} (S/. {{ item.subtotal }})
                                    </li>
                                </ul>
                            </td>
                            <td>
                                <p v-for="item in order.items" :key="item._id">✔️{{ item.specialInstructions }}</p>
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
