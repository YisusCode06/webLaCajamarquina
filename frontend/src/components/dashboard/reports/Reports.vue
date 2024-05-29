<script setup>

</script>

<template>
  <div class="gen-container">
    <div class="content-reports">
      <div class="title">
        <h1>Reportes de pedidos</h1>
        <div class="total">Total: S/. </div>
      </div>
      
      <div class="controls">
        <div class="control1">
          <label for="start-date">Seleccione periodo de tiempo:</label>
          <div>
            de:
            <input type="date" id="start-date" name="start-date">
            hasta:
            <input type="date" id="end-date" name="end-date">
          </div>
        </div>
        
        <div class="control2">
          <label for="user-select">Pedidos por usuario:</label>
          <select name="user-select" id="user-select">
            <option v-for="i in 10" :value="i">user {{ i }}</option>
          </select>
        </div>
      </div>
      
      <div class="abstract">
        <h2>Pedidos Totales por Usuario:</h2>
        <div class="users">
          <div class="user-card" v-for="i in 18" :key="i">
            <div>Juan: {{ i }} pedidos</div>
            <div>Saldo S/. {{ i + i }}</div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
@import url('./Reports.css');
</style>
