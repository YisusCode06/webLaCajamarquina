<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const _id = route.params._id;

const clientName = ref('');
const menuName = ref('');
const searchResults = ref([]);
const selectedMenus = ref([]);
const total = ref(0);
const tableNumber = ref('');
const orderStatus = ref('');
const isPaid = ref(false);
const attendedBy = ref('');
const date = ref('');

const users = ref({});
const tables = ref({});
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

const loadOrder = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/api/v1/getorder/${_id}`);
        const order = response.data.order;
        clientName.value = order.clientName;
        selectedMenus.value = order.items.map(item => ({
            id: item.menu,
            quantity: item.quantity,
            subtotal: item.subtotal,
            specialInstructions: item.specialInstructions,
            name: menus.value[item.menu]?.name || 'Menu no encontrado',
            price: item.subtotal / item.quantity
        }));
        tableNumber.value = order.table;
        orderStatus.value = order.status;
        isPaid.value = order.isPaid;
        attendedBy.value = order.attendedBy;
        date.value = order.date;
        calculateTotal();
    } catch (error) {
        console.error('Error al cargar el pedido:', error.message);
        Swal.fire('Error', 'Error al cargar el pedido', 'error');
    }
};

const calculateSubtotal = (menu) => {
    return menu.quantity * menu.price;
};

const calculateTotal = () => {
    total.value = selectedMenus.value.reduce((acc, menu) => acc + calculateSubtotal(menu), 0);
};

const selectMenu = (menu) => {
    const existingMenu = selectedMenus.value.find(item => item.id === menu._id);
    if (existingMenu) {
        existingMenu.quantity++;
    } else {
        selectedMenus.value.push({ 
            id: menu._id, 
            name: menu.name, 
            price: menu.price, 
            quantity: 1, 
            specialInstructions: '' 
        });
    }
    calculateTotal();
};

const removeMenu = (index) => {
    selectedMenus.value.splice(index, 1);
    calculateTotal();
};

const searchMenu = async () => {
    if (menuName.value.trim() === '') {
        searchResults.value = [];
        return;
    }

    try {
        const response = await axios.get(`http://localhost:3000/api/v1/getmenubyname/${menuName.value}`);
        searchResults.value = response.data.menus.filter(menu => menu.availability);
    } catch (error) {
        console.error('Error al buscar el menú:', error.message);
        Swal.fire('Error', 'Hubo un problema al buscar el menú.', 'error');
    }
};

watch(menuName, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        searchMenu();
    }
});

const confirmCancel = () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No se guardarán los cambios!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            router.push('/dashboard/orders');
        }
    });
};

const saveOrder = async () => {
    try {
        const updatedOrder = {
            clientName: clientName.value,
            table: tableNumber.value,
            items: selectedMenus.value.map(menu => ({
                menu: menu.id,
                quantity: menu.quantity,
                subtotal: calculateSubtotal(menu),
                specialInstructions: menu.specialInstructions
            })),
            total: total.value,
            status: orderStatus.value,
            isPaid: isPaid.value,
            attendedBy: attendedBy.value,
            date: date.value
        };
        await axios.put(`http://localhost:3000/api/v1/updateorder/${_id}`, updatedOrder);
        Swal.fire('Éxito', 'Pedido actualizado correctamente', 'success');
        router.push('/dashboard/orders');
    } catch (error) {
        console.error('Error al guardar el pedido:', error.message);
        Swal.fire('Error', 'Error al guardar el pedido', 'error');
    }
};

onMounted(() => {
    loadTables();
    loadMenus();
    loadUsers();
    loadOrder();
});
</script>

<template>
    <div class="gen-container">
        <div class="title">
            <h2>Editar Pedido</h2>
        </div>

        <div class="cont-new-order">
            <form @submit.prevent="saveOrder">
                <label for="clientName">Nombre Cliente (Opcional):</label>
                <input type="text" v-model.trim="clientName" id="clientName">

                <label for="menuName">Buscar Menú por Nombre:</label>
                <input type="text" v-model.trim="menuName" id="menuName" placeholder="Ingrese nombre de menú">

                <ul v-if="searchResults.length > 0" class="menu-list">
                    <p>Selecciona una opción para agregar:</p>
                    <li v-for="menu in searchResults" :key="menu._id" @click="selectMenu(menu)">{{ menu.name }}</li>
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
                            <td><input type="number" v-model.number="menu.quantity" min="1" max="10" @input="calculateTotal"></td>
                            <td>{{ calculateSubtotal(menu) }}</td>
                            <td><input type="text" v-model.trim="menu.specialInstructions"></td>
                            <td><button @click.prevent="removeMenu(index)">Quitar</button></td>
                        </tr>
                    </tbody>
                </table>
                <h3>Total pedido: S/.{{ total }}</h3>
                <!-- <div>
                    <label for="orderStatus">Estado del Pedido:</label>
                    <select v-model="orderStatus" id="orderStatus">
                        <option value="POR ATENDER">POR ATENDER</option>
                        <option value="EN PROCESO">EN PROCESO</option>
                        <option value="ATENDIDA">ATENDIDA</option>
                    </select>
                </div>
                <div>
                    <label for="isPaid">Pagado:</label>
                    <input type="checkbox" v-model="isPaid" id="isPaid">
                </div>
                <div>
                    <label for="attendedBy">Atendido por:</label>
                    <select v-model="attendedBy" id="attendedBy">
                        <option v-for="user in Object.values(users)" :key="user._id" :value="user._id">{{ user.name }}</option>
                    </select>
                </div>
                <div>
                    <label for="tableNumber">Número de Mesa:</label>
                    <select v-model="tableNumber" id="tableNumber">
                        <option v-for="table in Object.values(tables)" :key="table._id" :value="table._id">{{ table.number }}</option>
                    </select>
                </div>
                <div>
                    <label for="date">Fecha:</label>
                    <input type="datetime-local" v-model="date" id="date">
                </div> -->
                <div class="buttons">
                    <button type="submit">Guardar Pedido</button>
                    <button @click.prevent="confirmCancel">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
@import url('./EditOrder.css');
</style>
