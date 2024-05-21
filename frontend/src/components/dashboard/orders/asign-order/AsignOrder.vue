<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const userData = ref(null);
const route = useRoute();
const router = useRouter();
const number = ref(route.params.number);
const numberTable = ref(null);

// Estados para los inputs y resultados de búsqueda
const clientName = ref('');
const menuName = ref('');
const searchResults = ref([]);
const selectedMenus = ref([]);

// Guardar el estado en localStorage
const saveStateToLocalStorage = () => {
    const orderState = {
        clientName: clientName.value,
        selectedMenus: selectedMenus.value,
        tableNumber: number.value
    };
    localStorage.setItem('orderState', JSON.stringify(orderState));
};

// Recuperar el estado desde localStorage
const loadStateFromLocalStorage = () => {
    const savedState = localStorage.getItem('orderState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        clientName.value = parsedState.clientName;
        selectedMenus.value = parsedState.selectedMenus;
        number.value = parsedState.tableNumber;
    }
};

// Vigilar cambios y guardar en localStorage
watch([clientName, selectedMenus], saveStateToLocalStorage, { deep: true });

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
        Swal.fire('Error!', 'Hubo un problema al buscar el menú.', 'error');
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

const loadnumbertable = async () => {
    const response = await axios.get(`http://localhost:3000/api/v1/getable/${number.value}`);

    numberTable.value = response.data.table;
    console.log(numberTable)
}

// Función para capturar el usuario de la acción
onMounted(async () => {

    loadnumbertable();

    const token = localStorage.getItem('token');
    if (!token) {
        Swal.fire('Error!', 'No se ha encontrado un token de autenticación.', 'error');
        router.push('/login'); // Redirige al login si no hay token
        return;
    }

    try {
        const response = await axios.get('http://localhost:3000/api/v1/getuser', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        userData.value = response.data.user;
    } catch (error) {
        console.error('Error al obtener los datos del perfil:', error.message);
        Swal.fire('Error!', 'Hubo un problema al obtener los datos del perfil.', 'error');
    }

    loadStateFromLocalStorage();
});

// Limpiar localStorage cuando se asigne el pedido
const clearLocalStorage = () => {
    localStorage.removeItem('orderState');
};

// Función para guardar el pedido
const saveOrder = async () => {
    if (selectedMenus.value.length === 0) {
        Swal.fire('Error!', 'Por favor, selecciona al menos un menú.', 'error');
        return;
    }

    const order = {
        clientName: clientName.value,
        table: number.value,
        items: selectedMenus.value.map(menu => ({
            menu: menu._id,
            quantity: menu.quantity,
            subtotal: calculateSubtotal(menu),
            specialInstructions: menu.specialInstructions
        })),
        total: total.value,
        status: 'POR ATENDER',
        isPaid: false,
        attendedBy: userData.value._id,
        date: new Date()
    };

    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Deseas asignar este pedido!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, asignar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.post('http://localhost:3000/api/v1/neworder', order);
                await axios.put(`http://localhost:3000/api/v1/updatetable/${number.value}`, { isOccupied: true });
                Swal.fire('Asignado!', 'Pedido asignado exitosamente', 'success');
                clearLocalStorage();
                router.push('/dashboard/orders');
            } catch (error) {
                console.error('Error al guardar el pedido:', error.message);
                Swal.fire('Error!', 'Hubo un error al asignar el pedido. Por favor, intenta nuevamente.', 'error');
            }
        }
    });
};

// Función para confirmar la cancelación
const confirmCancel = () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Todos los cambios se perderán!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            clearLocalStorage();
            router.push('/dashboard/orders');
        }
    });
};
</script>

<template>
    <div class="gen-container">
        <div class="title">
            <h2>Nuevo pedido a mesa número: {{ numberTable ? numberTable.number : 'N/A' }}</h2>
        </div>

        <div class="cont-new-order">
            <form @submit.prevent="saveOrder">
                <label for="clientName">Nombre Cliente (Opcional):</label>
                <input type="text" v-model.trim="clientName" id="clientName">

                <label for="menuName">Buscar Menú por Nombre:</label>
                <input type="text" v-model.trim="menuName" id="menuName" placeholder="Ingrese nombre de menú">

                <ul v-if="searchResults.length > 0" class="menu-list">
                    <p>Selecciona una opción para agregar:</p>
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
                    <button type="button" @click="confirmCancel">Cancelar</button>
                    <button type="submit">Asignar Pedido</button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
@import url('./AsignOrder.css');
</style>
