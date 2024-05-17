<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    number: String
});
</script>

<template>
    <div>Asignar Pedido a mesa número: {{ number }}</div>
</template>
