<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Pie, Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from 'chart.js';
import * as XLSX from 'xlsx';

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

const orders = ref([]);
const users = ref({});
const menus = ref({});
const orders_periodo = ref([]);
const startDate = ref(null);
const endDate = ref(null);
const selectedUserId = ref(null);

const loadOrders = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/getorders');
    orders.value = response.data.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    filterOrders();
  } catch (error) {
    console.error('Error al cargar los pedidos:', error.message);
    Swal.fire('Error', 'Error al cargar los pedidos', 'error');
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
    console.log(users.value);
  } catch (error) {
    console.error('Error al cargar los Usuarios:', error.message);
    Swal.fire('Error', 'Error al cargar usuarios...', 'error');
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

const filterOrders = () => {
  let filteredOrders = orders.value;
  if (startDate.value && endDate.value) {
    filteredOrders = filteredOrders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= new Date(startDate.value) && orderDate <= new Date(endDate.value);
    });
  }
  if (selectedUserId.value) {
    filteredOrders = filteredOrders.filter(order => order.attendedBy === selectedUserId.value);
  }
  orders_periodo.value = filteredOrders;
};

const totalAmount = computed(() => {
  return orders_periodo.value.reduce((sum, order) => sum + order.total, 0);
});

const ordersByUser = computed(() => {
  const userOrders = {};
  orders_periodo.value.forEach(order => {
    if (order.status === 'ATENDIDA') {
      const userId = order.attendedBy;
      if (!userOrders[userId]) {
        userOrders[userId] = {
          name: users.value[userId]?.name || 'Unknown',
          totalOrders: 0,
          totalAmount: 0
        };
      }
      userOrders[userId].totalOrders += 1;
      userOrders[userId].totalAmount += order.total;
    }
  });
  return Object.values(userOrders);
});

const menuData = computed(() => {
  const menuCount = {};
  orders_periodo.value.forEach(order => {
    order.items.forEach(item => {
      if (!menuCount[item.menu]) {
        menuCount[item.menu] = 0;
      }
      menuCount[item.menu] += item.quantity;
    });
  });
  return {
    labels: Object.keys(menuCount).map(menuId => menus.value[menuId]?.name || 'Unknown'),
    datasets: [
      {
        data: Object.values(menuCount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
});

const dailyIncomeData = computed(() => {
  const dailyIncome = {};
  orders_periodo.value.forEach(order => {
    const date = new Date(order.date).toISOString().split('T')[0]; // Get only the date part
    if (!dailyIncome[date]) {
      dailyIncome[date] = 0;
    }
    dailyIncome[date] += order.total;
  });
  return {
    labels: Object.keys(dailyIncome),
    datasets: [
      {
        label: 'Ingresos diarios',
        data: Object.values(dailyIncome),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };
});

const exportToExcel = () => {
  const data = orders_periodo.value.map(order => {
    return {
      Fecha: new Date(order.date).toLocaleDateString(),
      Usuario: users.value[order.attendedBy]?.name || 'Unknown',
      Total: order.total,
      Items: order.items.map(item => `${item.quantity} x ${menus.value[item.menu]?.name || 'Unknown'}`).join(', ')
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
  XLSX.writeFile(wb, 'Reportes_Pedidos.xlsx');
};

watch([startDate, endDate, selectedUserId], filterOrders);

onMounted(() => {
  loadOrders();
  loadUsers();
  loadMenus();
});
</script>

<template>
  <div class="gen-container">
    <div class="content-reports">
      <div class="title">
        <h1>Reportes de pedidos</h1>
        <div class="total">Total: S/.{{ totalAmount }} </div>
      </div>

      <div class="controls">
        <div class="control1">
          <label for="start-date">Seleccione periodo de tiempo:</label>
          <div>
            de:
            <input type="date" id="start-date" name="start-date" v-model="startDate">
            hasta:
            <input type="date" id="end-date" name="end-date" v-model="endDate">
          </div>
        </div>

        <div class="control2">
          <label for="user-select">Pedidos por usuario:</label>
          <select name="user-select" id="user-select" v-model="selectedUserId">
            <option :value="null">Todos</option>
            <option v-for="user in users" :value="user._id"> {{ user.name }}</option>
          </select>
        </div>
      </div>

      <div class="abstract">
        <h2>Pedidos Totales por Usuario:</h2>
        <div class="users">
          <div class="user-card" v-for="user in ordersByUser" :key="user.name">
            <div>{{ user.name }}: {{ user.totalOrders }} pedidos</div>
            <div>Saldo S/. {{ user.totalAmount }}</div>
          </div>
        </div>
      </div>

      <div class="grafics">
        <div class="gr1">
          <h2>Gráfico de Menús</h2>
          <Pie :data="menuData" />
        </div>

        <div class="gr2">
          <h2>Ingresos Diarios</h2>
          <Bar :data="dailyIncomeData" />
        </div>
      </div>
      <div class="grafics">
        <button @click="exportToExcel">Exportar Excel <ion-icon name="download"></ion-icon></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('./Reports.css');
</style>
