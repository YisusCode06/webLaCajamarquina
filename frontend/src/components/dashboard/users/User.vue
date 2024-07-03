<template>
    <div class="gen-container">
        <div class="user-container">
            <h2>Usuarios</h2>
            <div class="cont-newuser">
                <button v-if="!showNewUserForm" @click="toggleNewUserForm">Nuevo Usuario</button>
                <!-- form crear nuevo usuario -->
                <form v-if="showNewUserForm" @submit.prevent="saveNewUser">
                    <label for="newName">Nombre:</label>
                    <input type="text" id="newName" v-model="newUser.name" required>

                    <label for="newDni">DNI:</label>
                    <input type="text" id="newDni" v-model="newUser.dni" required>

                    <label for="newEmail">Email:</label>
                    <input type="email" id="newEmail" v-model="newUser.email" required>

                    <label for="newPassword">Contraseña:</label>
                    <input type="password" id="newPassword" v-model="newUser.password" required>

                    <label for="newrePassword">Vuelva a escribir su contraseña:</label>
                    <input type="password" id="newrePassword" v-model="newUser.repassword" required>

                    <label for="newPhone">Teléfono:</label>
                    <input type="text" id="newPhone" v-model="newUser.phone" required>

                    <label for="newRole">Rol:</label>
                    <select id="newRole" v-model="newUser.role" required>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>

                    <div class="form-buttons">
                        <button type="submit">Guardar</button>
                        <button type="button" @click="cancelNewUser">Cancelar</button>
                    </div>
                </form>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>dni</th>
                        <th>Email</th>
                        <th>Telefono</th>
                        <th>Rol</th>
                        <th class="th-acciones">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user._id">
                        <td>{{ user.name }}</td>
                        <td>{{ user.dni }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.phone }}</td>
                        <td>{{ user.role }}</td>
                        <td>
                            <button @click="toggleUserRole(user)">Cambiar Rol</button>
                            <button disabled @click="deleteUser(user._id)">Eliminar</button>
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

const users = ref([]);
const showNewUserForm = ref(false);
const newUser = ref({
    name: '',
    dni: '',
    email: '',
    password: '',
    repassword: '',
    phone: '',
    role: 'USER'
});

const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No se ha encontrado un token de autenticación.');
        return;
    }
    try {
        const response = await axios.get(`${apiUrl}users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        users.value = response.data.users;
    } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error.message);
    }
};

const toggleNewUserForm = () => {
    showNewUserForm.value = !showNewUserForm.value;
};
const cancelNewUser = () => {
    newUser.value = {
        name: '',
        dni: '',
        email: '',
        phone: '',
        password: '',
        repassword: '',
        role: 'USER'
    };
    showNewUserForm.value = false;
};

const saveNewUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No se ha encontrado un token de autenticación.');
        return;
    }
    try {
        await axios.post(`${apiUrl}register`, newUser.value, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        users.value.push(newUser.value);
        // Limpiar el formulario
        newUser.value = {
            name: '',
            dni: '',
            email: '',
            phone: '',
            password: '',
            repassword: '',
            role: 'USER'
        };
        showNewUserForm.value = false;
    } catch (error) {
        console.error('Error al crear un nuevo usuario:', error.message);
    }
};

onMounted(fetchUsers);

const deleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No se ha encontrado un token de autenticación.');
        return;
    }
    try {
        const userToDelete = users.value.find(user => user._id === userId);
        if (userToDelete.role === 'ADMIN') {
            const adminCount = users.value.filter(user => user.role === 'ADMIN').length;
            if (adminCount === 1) {
                Swal.fire({
                    title: 'No se puede eliminar el último administrador.',
                    icon: 'error'
                });
                return;
            }
        }
        // Mostrar alerta de confirmación
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Si se confirma la eliminación, proceder
                await axios.delete(`${apiUrl}deleteuser/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                users.value = users.value.filter(user => user._id !== userId);
                Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
            }
        });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error.message);
    }
};


const toggleUserRole = async (user) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No se ha encontrado un token de autenticación.');
        return;
    }
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    // Mostrar alerta de confirmación
    Swal.fire({
        title: '¿Estás seguro?',
        text: `Deseas cambiar el rol de ${user.name} a ${newRole === 'ADMIN' ? 'Administrador' : 'Usuario'}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            // Si se confirma el cambio de rol, proceder
            try {
                await axios.put(`${apiUrl}edituser/${user._id}`, { role: newRole }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                user.role = newRole;
                Swal.fire('Cambiado!', 'El rol del usuario ha sido actualizado.', 'success');
            } catch (error) {
                console.error('Error al cambiar el rol del usuario:', error.message);
                Swal.fire('Error!', 'Hubo un problema al cambiar el rol del usuario.', 'error');
            }
        }
    });
};
</script>

<style scoped>
@import url('./Users.css');
</style>