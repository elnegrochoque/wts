import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema(
    {
        name: String,
        lastName: String,
        tiendaId: String,
        bussinesAccountId: String, 
        email: String,
        phone: { type: String, unique: true, required: true } 
    }, { timestamps: true }

);

const contact = mongoose.model("contact", contactSchema, "contact");
export default contact;