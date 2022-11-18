
import message from "../models/messages.models.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { urlJWT } from "../config.js";
import phone from "../models/phones.models.js";
const phonesController = {};

phonesController.getPhonesJWT = async (req, res) => {
    const baererHeader = req.headers.authorization;
    if (typeof baererHeader !== 'undefined') {
        const baererToken = baererHeader.split(" ")[1]
        req.token = baererToken;
        jwt.verify(req.token, 'secretkey', async (error, authData) => {
            if (error) {
                res.sendStatus(403)
            } else {
                try {
                    const events = await message.find();
                    res.status(200).json(authData);
                } catch (error) {
                    console.log(error);
                    res.status(500).json({
                        mensaje: "error al obtener informacion",
                    });
                }
            }
        })
    } else {
        res.sendStatus(403)
    }
};

phonesController.getPhones = async (req, res) => {
    try {
        const phones = await phone.find();
        res.status(200).json(phones);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "error al obtener informacion",
        });
    }
};

phonesController.postCreatePhone = async (req, res) => {
    try {
        const { number, country } = req.body;
        const newPhone = new phone({
            number: number,
            country: country,
            hits: 0
        });
        await newPhone.save();
        res.status(201).json({
            mensaje: "Teléfono agregado",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Problemas al crear el teléfono",
        });
    }
};
phonesController.postCreatePhone = async (req, res) => {
    try {
        const { number, country } = req.body;
        const newPhone = new phone({
            number: number,
            country: country,
            active: false,
            hits: 0
        });
        await newPhone.save();
        res.status(201).json({
            mensaje: "Teléfono agregado",
        });
    } catch (error) {
        console.log(error);
        if (error.code && error.code == 11000) {
            res.status(500).json({
                mensaje: "Ya existe el numero",
            });
        } else {
            res.status(500).json({
                mensaje: "Problemas al crear el teléfono",
            });
        }

    }
};

phonesController.getPhoneHits = async (req, res) => {
    try {
        const phones = await phone.find({ active: true }).sort("hits").limit(1);
        if (phones[0].hits >= 5) {
            await phone.updateMany({}, { hits: 0 })

        } else {
            await phone.findOneAndUpdate({ number: phones[0].number }, { $inc: { 'hits': 1 } });
        }
        res.status(200).json(phones);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "error al obtener informacion",
        });
    }
};

phonesController.postUpdatePhone = async (req, res) => {
    try {
        const { newNumber, oldNumber, country, active } = req.body;
        const newPhone = {
            number: newNumber,
            country: country,
            hits: 0,
            active: active
        };
        const updatePhone = await phone.findOneAndUpdate({ number: oldNumber }, newPhone, { useFindAndModify: true });
        if (updatePhone == null) {
            res.status(201).json({
                mensaje: "Teléfono inexistente",
            });
        } else {
            res.status(201).json({
                mensaje: "Teléfono modificado",
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Problemas al modificar el teléfono",
        });
    }
};

export default phonesController;