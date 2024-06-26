import mongoose from "mongoose";
const { Schema, model } = mongoose;

const menuSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    availability: {
        type: Boolean,
        required: true,
        default: true
    }
});

export const Menu = model("Menu", menuSchema);
