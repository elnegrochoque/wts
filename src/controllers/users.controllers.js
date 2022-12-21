import { JWTFlag } from "../config.js";
import user from "../models/users.models.js";
import { permissionJWTVerify } from "./jwt.controllers.js";
const userControllers = {};



userControllers.getUsersAll = async (req, res) => {
    try {
        const users = await user.find();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "error al obtener informacion",
        });
    }
};


userControllers.postCreateUser = async (req, res) => {
    try {
        const { permisions, password, userName, bussinesAccountId, messageToken } = req.body;
        const newUser = new user({
            permisions: permisions,
            password: password,
            user: userName,
            bussinesAccountId: bussinesAccountId,
            messageToken: messageToken,
        });
        await newUser.save();
        res.status(201).json({
            mensaje: "Usuario agregado",
        });
    } catch (error) {
        console.log(error);
        if (error.code && error.code == 11000) {
            res.status(500).json({
                mensaje: "Ya existe usuario",
            });
        } else {
            res.status(500).json({
                mensaje: "Problemas al crear el usuario",
            });
        }

    }
};

userControllers.putUser = async (req, res) => {
    try {
        const { permisions, password, userName, bussinesAccountId, messageToken } = req.body;
        const newUser = ({
            permisions: permisions,
            password: password,
            user: userName,
            bussinesAccountId: bussinesAccountId,
            messageToken: messageToken,
        });
        const updateUser = await user.findOneAndUpdate({ _id: req.params.id }, newUser, { useFindAndModify: true });
        if (updateUser == null) {
            res.status(201).json({
                mensaje: "Usuario inexistente",
            });
        } else {
            res.status(201).json({
                mensaje: "Usuario modificado",
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Problemas al modificar el usuario",
        });
    }
};

userControllers.deleteUserById = async (req, res) => {
    try {
        const deleteUser = await user.deleteOne({ _id: req.params.id });
        if (deleteUser.deletedCount > 0) {
            res.status(201).json({
                mensaje: "Usuario eliminado",
            });
        } else {
            res.status(201).json({
                mensaje: "Usuario no encontrado",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Problemas al modificar el usuario",
        });
    }
};



export default userControllers;