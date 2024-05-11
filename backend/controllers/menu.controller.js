import { Menu } from '../models/Menu.js';

// Controlador para crear un nuevo menú
export const createMenu = async (req, res) => {
    const { name, type, description, category, price } = req.body;
    try {
        const menu = new Menu({ name, type, description, category, price });
        await menu.save();
        return res.status(201).json({ success: true, message: 'Menú creado exitosamente', menu });
    } catch (error) {
        console.error('Error al crear el menú:', error);
        return res.status(500).json({ success: false, error: 'Error de servidor' });
    }
};

// Controlador para editar un menú por su ID
export const editMenuById = async (req, res) => {
    const { id } = req.params;
    const { name, type, description, category, price } = req.body;
    try {
        const updatedMenu = await Menu.findByIdAndUpdate(id, { name, type, description, category, price }, { new: true });
        if (!updatedMenu) {
            return res.status(404).json({ success: false, message: 'Menú no encontrado' });
        }
        return res.status(200).json({ success: true, message: 'Menú actualizado exitosamente', menu: updatedMenu });
    } catch (error) {
        console.error('Error al actualizar el menú:', error);
        return res.status(500).json({ success: false, error: 'Error de servidor' });
    }
};

// Controlador para eliminar un menú por su ID
export const deleteMenuById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedMenu = await Menu.findByIdAndDelete(id);
        if (!deletedMenu) {
            return res.status(404).json({ success: false, message: 'Menú no encontrado' });
        }
        return res.status(200).json({ success: true, message: 'Menú eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el menú:', error);
        return res.status(500).json({ success: false, error: 'Error de servidor' });
    }
};

// Controlador para obtener un menú por su ID
export const getMenuById = async (req, res) => {
    const { id } = req.params;
    try {
        const menu = await Menu.findById(id);
        if (!menu) {
            return res.status(404).json({ success: false, message: 'Menú no encontrado' });
        }
        return res.status(200).json({ success: true, menu });
    } catch (error) {
        console.error('Error al obtener el menú:', error);
        return res.status(500).json({ success: false, error: 'Error de servidor' });
    }
};

// Controlador para obtener todos los menús
export const getAllMenus = async (req, res) => {
    try {
        const menus = await Menu.find();
        return res.status(200).json({ success: true, menus });
    } catch (error) {
        console.error('Error al obtener los menús:', error);
        return res.status(500).json({ success: false, error: 'Error de servidor' });
    }
};
