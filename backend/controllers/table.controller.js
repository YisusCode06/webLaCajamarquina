import { Table } from "../models/Table.js";

// Controlador para crear una nueva mesa
export const createTable = async (req, res) => {
  const { number, capacity, location, isOccupied } = req.body;
  try {
    const newTable = new Table({ number, capacity, location, isOccupied });
    await newTable.save();
    return res.status(201).json({ success: true, table: newTable });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Error de servidor" });
  }
};

// Controlador para editar una mesa por su ID
export const updateTableById = async (req, res) => {
  const { id } = req.params;
  const { number, capacity, location, isOccupied } = req.body;
  try {
    const updatedTable = await Table.findByIdAndUpdate(
      id, 
      { number, capacity, location, isOccupied },
      { new: true }
    );
    if (!updatedTable) {
      return res.status(404).json({ success: false, error: "Mesa no encontrada" });
    }
    return res.status(200).json({ success: true, table: updatedTable });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Error de servidor" });
  }
};

// Controlador para eliminar una mesa por su ID
export const deleteTableById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTable = await Table.findByIdAndDelete(id);
    if (!deletedTable) {
      return res.status(404).json({ success: false, error: "Mesa no encontrada" });
    }
    return res.status(200).json({ success: true, message: "Mesa eliminada correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Error de servidor" });
  }
};

// Controlador para obtener una mesa por su ID
export const getTableById = async (req, res) => {
  const { id } = req.params;
  try {
    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({ success: false, error: "Mesa no encontrada" });
    }
    return res.status(200).json({ success: true, table });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Error de servidor" });
  }
};

// Controlador para listar todas las mesas
export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find();
    return res.status(200).json({ success: true, tables });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Error de servidor" });
  }
};
