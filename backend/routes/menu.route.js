import express from 'express';
import { createMenu, editMenuById, deleteMenuById, getMenuById, getAllMenus } from '../controllers/menu.controller.js';

const routerMenu = express.Router();

// Ruta para crear un nuevo menú
routerMenu.post('/newmenu', createMenu);

// Ruta para editar un menú por su ID
routerMenu.put('/updatemenu/:id', editMenuById);

// Ruta para eliminar un menú por su ID
routerMenu.delete('/deletemenu/:id', deleteMenuById);

// Ruta para obtener un menú por su ID
routerMenu.get('/getmenu/:id', getMenuById);

// Ruta para obtener todos los menús
routerMenu.get('/getmenus', getAllMenus);

export default routerMenu;
