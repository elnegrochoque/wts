import mongoose, { Schema } from "mongoose";
const permisionsSchema = new Schema({ name: String });
const userSchema = new Schema(
    {
        messageToken: { type: String, unique: true, required: true },
        bussinesAccountId: { type: String, unique: true, required: true },
        user: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        permisions: [] ,
    }, { timestamps: true }

);


const user = mongoose.model("user", userSchema, "user");
export default user;