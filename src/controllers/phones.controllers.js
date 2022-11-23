

import { JWTFlag } from "../config.js";
import phone from "../models/phones.models.js";
import { permissionJWTVerify } from "./messages.controllers.js";
const phonesController = {};


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
phonesController.getPhonesJWT = async (req, res) => {
    try {
        const baererHeader = req.headers.authorization;
        if (typeof baererHeader !== 'undefined') {
            const baererToken = baererHeader.split(" ")[1]
            req.token = baererToken;
            const permission = await permissionJWTVerify(baererToken, JWTFlag.permissionNameView)
            if (permission == false) {
                res.sendStatus(403)
            } else {
                try {
                    const phones = await phone.find();
                    res.status(200).json(phones);
                } catch (error) {
                    console.log(error);
                    res.status(500).json({
                        mensaje: "error al obtener informacion",
                    });
                }
            }
        } else {
            res.sendStatus(403)
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "error al obtener informacion",
        });
    }
};

phonesController.postCreatePhone = async (req, res) => {
    try {
        const { phoneNumber, businessUnit, name, email } = req.body;
        const newPhone = new phone({
            name: name,
            email: email,
            businessUnit: businessUnit,
            phoneNumber: phoneNumber,
            enable: false,
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
phonesController.postCreatePhoneJWT = async (req, res) => {
    try {
        const baererHeader = req.headers.authorization;
        if (typeof baererHeader !== 'undefined') {
            const baererToken = baererHeader.split(" ")[1]
            req.token = baererToken;
            const permission = await permissionJWTVerify(baererToken, JWTFlag.permissionNameEdit)
            if (permission == false) {
                res.sendStatus(403)
            } else {
                try {
                    const { phoneNumber, businessUnit, name, email } = req.body;
                    const newPhone = new phone({
                        name: name,
                        email: email,
                        businessUnit: businessUnit,
                        phoneNumber: phoneNumber,
                        enable: false,
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
            }
        } else {
            res.sendStatus(403)
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "error al obtener informacion",
        });
    }

};

phonesController.getPhoneHitsJWT = async (req, res) => {
    try {
        const baererHeader = req.headers.authorization;
        if (typeof baererHeader !== 'undefined') {
            const baererToken = baererHeader.split(" ")[1]
            req.token = baererToken;
            const permission = await permissionJWTVerify(baererToken, JWTFlag.permissionNameView)
            if (permission == false) {
                res.sendStatus(403)
            } else {
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
            }
        } else {
            res.sendStatus(403)
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "error al obtener informacion",
        });
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
        const { phoneNumber, businessUnit, name, email, enable, oldNumber } = req.body;
        const newPhone = {
            name: name,
            email: email,
            businessUnit: businessUnit,
            phoneNumber: phoneNumber,
            enable: enable,
            hits: 0
        };
        const updatePhone = await phone.findOneAndUpdate({ phoneNumber: oldNumber }, newPhone, { useFindAndModify: true });
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
phonesController.postUpdatePhoneJWT = async (req, res) => {
    try {
        const baererHeader = req.headers.authorization;
        if (typeof baererHeader !== 'undefined') {
            const baererToken = baererHeader.split(" ")[1]
            req.token = baererToken;
            const permission = await permissionJWTVerify(baererToken, JWTFlag.permissionNameEdit)
            if (permission == false) {
                res.sendStatus(403)
            } else {
                try {
                    const { phoneNumber, businessUnit, name, email, enable, oldNumber } = req.body;
                    const newPhone = {
                        name: name,
                        email: email,
                        businessUnit: businessUnit,
                        phoneNumber: phoneNumber,
                        enable: enable,
                        hits: 0
                    };
                    const updatePhone = await phone.findOneAndUpdate({ phoneNumber: oldNumber }, newPhone, { useFindAndModify: true });
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
            }
        } else {
            res.sendStatus(403)
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "error al obtener informacion",
        });
    }

};

export default phonesController;