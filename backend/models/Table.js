import mongoose from "mongoose";
const { Schema, model } = mongoose;

const tableSchema = new Schema({
    number: {
        type: String,
        required: true,
        unique:true
    },
    capacity: {
        type: Number
    },
    location: {
        type: String,
        enum: ["ESPACIO1", "ESPACIO2"],
        required: true
    }

})

export const Table = model("table", tableSchema);