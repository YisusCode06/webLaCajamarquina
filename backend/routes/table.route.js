import express from 'express';
import { createTable, updateTableById, deleteTableById, getTableById, getAllTables } from '../controllers/table.controller.js';

const routerTable = express.Router();

// Ruta para crear una nueva mesa
routerTable.post('/newtable', createTable);

// Ruta para editar una mesa por su ID
routerTable.put('/updatetable/:id', updateTableById);

// Ruta para eliminar una mesa por su ID
routerTable.delete('/deletetable/:id', deleteTableById);

// Ruta para obtener una mesa por su ID
routerTable.get('/getable/:id', getTableById);

// Ruta para obtener todas las mesas
routerTable.get('/getables', getAllTables);

export default routerTable;
