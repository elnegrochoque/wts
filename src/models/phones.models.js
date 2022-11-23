import mongoose, { Schema } from "mongoose";

const phoneSchema = new Schema(
    {
        phoneNumber: { type: String, unique: true },
        name: String,
        email: String,
        hits: Number,
        enable : Boolean,
        businessUnit: String
    }, { timestamps: true }

);

const phone = mongoose.model("phone", phoneSchema, "phone");
export default phone;