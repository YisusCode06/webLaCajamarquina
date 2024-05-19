import express from 'express';
import { createOrder, updateOrderById, deleteOrderById, getOrderById, getAllOrders } from '../controllers/order.controller.js';

const routerOrder = express.Router();

// Ruta para crear una nueva orden
routerOrder.post('/neworder', createOrder);

// Ruta para obtener todas las órdenes
routerOrder.get('/getorders', getAllOrders);

// Ruta para obtener una orden por su ID
routerOrder.get('/getorder/:id', getOrderById);

// Ruta para actualizar una orden por su ID
routerOrder.put('/updateorder/:id', updateOrderById);

// Ruta para eliminar una orden por su ID
routerOrder.delete('/deleteorder/:id', deleteOrderById);

export default routerOrder;
