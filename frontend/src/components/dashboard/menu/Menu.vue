<template>
    <div class="gen-container">
        <div class="title">
            <h1>Menús</h1>
        </div>
        <div class="new-menu">
            <button @click="toggleNewMenuForm">Nuevo Menú</button>
        </div>
        <div class="filter-container">
            <label for="categoryFilter">Filtrar por Categoría:</label>
            <select id="categoryFilter" v-model="selectedCategory">
                <option value="ALL">Todas</option>
                <option v-for="menuCat in uniqueCategories" :key="menuCat" :value="menuCat">{{ menuCat }}</option>
            </select>
        </div>
        <div class="new-menu-form" v-if="showNewMenuForm">
            <h2>{{ editingMenu ? 'Editar Menú' : 'Nuevo Menú' }}</h2>
            <form @submit.prevent="confirmSaveMenu">
                <label for="menuName">Nombre:</label>
                <input type="text" id="menuName" :value="menuNameValue" @input="updateMenuName" required>

                <label for="menuCategory">Categoría:</label>
                <input type="text" id="menuCategory" :value="menuCategoryValue" @input="updateCategory" required>

                <label for="menuPrice">Precio S/. :</label>
                <input type="number" id="menuPrice" :value="menuPriceValue" @input="updatePrice" required>

                <label for="menuDescription">Descripción:</label>
                <textarea id="menuDescription" :value="menuDescriptionValue" @input="updateDescription" required></textarea>

                <label for="menuAvailability">Disponibilidad:</label>
                <select id="menuAvailability" :value="menuAvailabilityValue" @input="updateAvailability" required>
                    <option value="true">Disponible</option>
                    <option value="false">No Disponible</option>
                </select>

                <div class="form-buttons">
                    <button type="submit">Guardar</button>
                    <button type="button" @click="cancelNewMenu">Cancelar</button>
                </div>
            </form>
        </div>
        <div class="cont-menu">
            <div v-for="menuItem in filteredMenuItems" :key="menuItem._id" class="menu-card">
                <div class="menu-details">
                    <h3>{{ menuItem.name }}</h3>
                    <p>Categoría: {{ menuItem.category }}</p>
                    <p>Precio: S/ {{ menuItem.price }}</p>
                    <h4 :class="{ available: menuItem.availability, unavailable: !menuItem.availability }">
                        Disponibilidad: {{ menuItem.availability ? 'Disponible' : 'No Disponible' }}
                    </h4>                </div>
                <div class="menu-image">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-MEkyTaPGun0hSPmtBo9JygJspXETz8Li8A&usqp=CAU" alt="Imagen del plato">
                </div>
                <div class="menu-actions">
                    <button @click="editMenuItem(menuItem)">Editar</button>
                    <button disabled @click="confirmDeleteMenuItem(menuItem._id)">Eliminar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import {apiUrl} from '@/utils/api.js'

const menuItems = ref([]);
const showNewMenuForm = ref(false);
const editingMenu = ref(false);

const selectedCategory = ref('ALL');

const newMenuItem = ref({
    name: '',
    category: '',
    price: 0,
    description: '',
    availability: true
});

const editedMenuItem = ref({
    name: '',
    category: '',
    price: 0,
    description: '',
    availability: true
});

const toggleNewMenuForm = () => {
    showNewMenuForm.value = !showNewMenuForm.value;
    editingMenu.value = false;
    resetFormValues();
};

const cancelNewMenu = () => {
    resetFormValues();
    showNewMenuForm.value = false;
};

const resetFormValues = () => {
    newMenuItem.value = {
        name: '',
        category: '',
        price: 0,
        description: '',
        availability: true
    };
    editedMenuItem.value = {
        name: '',
        category: '',
        price: 0,
        description: '',
        availability: true
    };
};

const fetchMenus = async () => {
    try {
        const response = await axios.get(`${apiUrl}getmenus`);
        menuItems.value = response.data.menus;
    } catch (error) {
        console.error('Error al obtener la lista de menús:', error.message);
    }
};

const confirmSaveMenu = () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: editingMenu.value ? "¡Deseas guardar los cambios en el menú!" : "¡Deseas crear este menú!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardar'
    }).then((result) => {
        if (result.isConfirmed) {
            editingMenu.value ? saveEditedMenu() : saveNewMenu();
        }
    });
};

const saveNewMenu = async () => {
    try {
        await axios.post('`${apiUrl}newmenu', newMenuItem.value);
        fetchMenus();
        resetFormValues();
        showNewMenuForm.value = false;
        Swal.fire('Guardado!', 'El menú ha sido creado.', 'success');
    } catch (error) {
        console.error('Error al crear un nuevo menú:', error.message);
        Swal.fire('Error!', 'Hubo un problema al crear el menú.', 'error');
    }
};

const saveEditedMenu = async () => {
    try {
        await axios.put(`${apiUrl}updatemenu/${editedMenuItem.value._id}`, editedMenuItem.value);
        fetchMenus();
        resetFormValues();
        showNewMenuForm.value = false;
        Swal.fire('Guardado!', 'El menú ha sido actualizado.', 'success');
    } catch (error) {
        console.error('Error al editar el menú:', error.message);
        Swal.fire('Error!', 'Hubo un problema al editar el menú.', 'error');
    }
};

const editMenuItem = (menuItem) => {
    editingMenu.value = true;
    editedMenuItem.value = { ...menuItem };
    showNewMenuForm.value = true;
};

const confirmDeleteMenuItem = (menuId) => {
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
            deleteMenuItem(menuId);
        }
    });
};

const deleteMenuItem = async (menuId) => {
    try {
        await axios.delete(`${apiUrl}deletemenu/${menuId}`);
        menuItems.value = menuItems.value.filter(menuItem => menuItem._id !== menuId);
        Swal.fire('Eliminado!', 'El menú ha sido eliminado.', 'success');
    } catch (error) {
        console.error('Error al eliminar el menú:', error.message);
        Swal.fire('Error!', 'Hubo un problema al eliminar el menú.', 'error');
    }
};

const menuNameValue = computed(() => {
    return editingMenu.value ? editedMenuItem.value.name : newMenuItem.value.name;
});

const menuCategoryValue = computed(() => {
    return editingMenu.value ? editedMenuItem.value.category : newMenuItem.value.category;
});

const menuPriceValue = computed(() => {
    return editingMenu.value ? editedMenuItem.value.price : newMenuItem.value.price;
});

const menuDescriptionValue = computed(() => {
    return editingMenu.value ? editedMenuItem.value.description : newMenuItem.value.description;
});

const menuAvailabilityValue = computed(() => {
    return editingMenu.value ? editedMenuItem.value.availability : newMenuItem.value.availability;
});

const updateMenuName = (event) => {
    if (editingMenu.value) {
        editedMenuItem.value.name = event.target.value;
    } else {
        newMenuItem.value.name = event.target.value;
    }
};

const updateCategory = (event) => {
    if (editingMenu.value) {
        editedMenuItem.value.category = event.target.value;
    } else {
        newMenuItem.value.category = event.target.value;
    }
};

const updatePrice = (event) => {
    if (editingMenu.value) {
        editedMenuItem.value.price = event.target.value;
    } else {
        newMenuItem.value.price = event.target.value;
    }
};

const updateDescription = (event) => {
    if (editingMenu.value) {
        editedMenuItem.value.description = event.target.value;
    } else {
        newMenuItem.value.description = event.target.value;
    }
};

const updateAvailability = (event) => {
    if (editingMenu.value) {
        editedMenuItem.value.availability = event.target.value === 'true';
    } else {
        newMenuItem.value.availability = event.target.value === 'true';
    }
};

const uniqueCategories = computed(() => {
    const categories = menuItems.value.map(item => item.category);
    return [...new Set(categories)];
});

const filteredMenuItems = computed(() => {
    if (selectedCategory.value === 'ALL') {
        return menuItems.value;
    } else {
        return menuItems.value.filter(item => item.category === selectedCategory.value);
    }
});

fetchMenus();
</script>

<style scoped>
@import url('./Menu.css');
</style>
