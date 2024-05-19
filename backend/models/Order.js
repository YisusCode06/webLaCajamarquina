import mongoose from "mongoose";
const { Schema, model } = mongoose;

const orderItemSchema = new Schema({
    menu: {
        type: Schema.Types.ObjectId,
        ref: 'Menu',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    specialInstructions: String 
});

const orderSchema = new Schema({
    clientName: String, 
    table: {
        type: Schema.Types.ObjectId,
        ref: 'Table',
        required: true
    },
    items: [orderItemSchema],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['POR ATENDER', 'EN PROCESO', 'ATENDIDA'],
        default: 'POR ATENDER'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    attendedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export const Order = model('Order', orderSchema);
