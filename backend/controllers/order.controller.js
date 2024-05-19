import { Order } from '../models/Order.js';

// Controlador para crear una nueva orden
export const createOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ success: true, message: 'Orden creada exitosamente', order: newOrder });
    } catch (error) {
        console.error('Error al crear la orden:', error);
        res.status(500).json({ success: false, error: 'Error de servidor' });
    }
};

// Controlador para obtener todas las órdenes
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        res.status(500).json({ success: false, error: 'Error de servidor' });
    }
};

// Controlador para obtener una orden por su ID
export const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Orden no encontrada' });
        }
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error('Error al obtener la orden:', error);
        res.status(500).json({ success: false, error: 'Error de servidor' });
    }
};

// Controlador para actualizar una orden por su ID
export const updateOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Orden no encontrada' });
        }
        res.status(200).json({ success: true, message: 'Orden actualizada exitosamente', order: updatedOrder });
    } catch (error) {
        console.error('Error al actualizar la orden:', error);
        res.status(500).json({ success: false, error: 'Error de servidor' });
    }
};

// Controlador para eliminar una orden por su ID
export const deleteOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: 'Orden no encontrada' });
        }
        res.status(200).json({ success: true, message: 'Orden eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la orden:', error);
        res.status(500).json({ success: false, error: 'Error de servidor' });
    }
};
