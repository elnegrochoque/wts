import mongoose, { Schema } from "mongoose";

const phoneSchema = new Schema(
    {
        number: { type: String, unique: true },
        hits: Number,
        active: Boolean,
        country: String
    }, { timestamps: true }

);

const phone = mongoose.model("phone", phoneSchema, "phone");
export default phone;