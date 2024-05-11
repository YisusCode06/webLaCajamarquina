<template>
    <div class="gen-container">
        <div class="title">
            <h1>Menus</h1>
        </div>
        <div class="new-menu">
            <button>Añandir Menu</button>
        </div>
        <div class="cont-menu">
            <div v-for="i in 10" class="menu-card">
                <div class="menu-details">
                    <h3>{{ menuItem.name }}</h3>
                    <p>Categoría: {{ menuItem.category }}</p>
                    <p>Precio: {{ menuItem.price }}</p>
                </div>
                <div class="menu-image">
                    <img :src="menuItem.image" alt="Imagen del plato">
                </div>
                <div class="menu-actions">
                    <button @click="editMenuItem">Editar</button>
                    <button @click="deleteMenuItem">Eliminar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';


const menuItem = ref({
    name: 'Nombre del plato',
    category: 'Categoría',
    price: 'Precio',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnvRX6L0VgAcjDkqNx9cpH9AfsBUj6C5dbVA&usqp=CAU', 
});

const editMenuItem = () => {

};

const deleteMenuItem = () => {

};
</script>

<style scoped>
@import url('./Menu.css');
</style>