import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
    {
        message: String,
        from: String,
        to: String,
        whatsappBussinessId: String, 
        tiendaId: String
    }, { timestamps: true }

);

const message = mongoose.model("message", messageSchema, "message");
export default message;