

import { JWTFlag } from "../config.js";
import phone from "../models/phones.models.js";
import { permissionJWTVerify } from "./jwt.controllers.js";
const phonesController = {};


phonesController.getPhonesAll = async (req, res) => {
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
phonesController.getPhones = async (req, res) => {
    try {
        if (req.query.all && req.query.all == "true") {
            if (req.query.page) {
                const page = req.query.page
                let elements = 5
                if (req.query.elements) {
                    elements = req.query.elements
                }
                const phonesCount = await phone.count({});
                const result = []
                result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": phonesCount } })
                const phones = await phone.find({}).skip((elements * page) - elements).limit(elements);
                result.push({ phones: phones })
                res.status(200).json(result);
            } else {
                res.status(500).json({
                    mensaje: "error al obtener paginado",
                });
            }
        } else {
            if (req.query.bu && req.query.page) {
                const bu = req.query.bu
                const page = req.query.page
                let elements = 5
                let counter = 0
                const phones = await phone.find({ businessUnit: bu });
                if (req.query.elements) {
                    elements = req.query.elements
                    if (parseInt(req.query.elements) > phones.length) {
                        elements = phone.length
                    }
                }
                const result = []
                const phonesAux = []
                result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": phones.length } })
                for (let index = (parseInt(page) - 1) * parseInt(elements); index < phones.length; index++) {
                    counter = counter + 1
                    if (counter > elements) {
                        break
                    }
                    phonesAux.push(phones[index])
                }
                result.push({ phones: phonesAux })
                res.status(200).json(result);
            }
            else {
                res.status(500).json({
                    mensaje: "error al obtener unidad de negocio o pagina",
                });
            }
        }
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
                    if (req.query.all && req.query.all == "true") {
                        if (req.query.page) {
                            const page = req.query.page
                            let elements = 5
                            if (req.query.elements) {
                                elements = req.query.elements
                            }
                            const phonesCount = await phone.count({});
                            const result = []
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": phonesCount } })
                            const phones = await phone.find({}).skip((elements * page) - elements).limit(elements);
                            result.push({ phones: phones })
                            res.status(200).json(result);
                        } else {
                            res.status(500).json({
                                mensaje: "error al obtener paginado",
                            });
                        }
                    } else {
                        if (req.query.bu && req.query.page) {
                            const bu = req.query.bu
                            const page = req.query.page
                            let elements = 5
                            let counter = 0
                            const phones = await phone.find({ businessUnit: bu });
                            if (req.query.elements) {
                                elements = req.query.elements
                                if (parseInt(req.query.elements) > phones.length) {
                                    elements = phone.length
                                }
                            }
                            const result = []
                            const phonesAux = []
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": phones.length } })
                            for (let index = (parseInt(page) - 1) * parseInt(elements); index < phones.length; index++) {
                                counter = counter + 1
                                if (counter > elements) {
                                    break
                                }
                                phonesAux.push(phones[index])
                            }
                            result.push({ phones: phonesAux })
                            res.status(200).json(result);
                        }
                        else {
                            res.status(500).json({
                                mensaje: "error al obtener paginado",
                            });
                        }
                    }

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
                    const phones = await phone.find({ enable: true }).sort("hits").limit(1);
                    if (phones[0] && phones[0].hits) {
                        if (phones[0].hits >= 5) {
                            await phone.updateMany({}, { hits: 0 })
                        }
                        //else {
                        //    await phone.findOneAndUpdate({ number: phones[0].number }, { $inc: { 'hits': 1 } });
                        //}
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
        const phones = await phone.find({ enable: true }).sort("hits").limit(1);
        if (phones[0] && phones[0].hits) {
            if (phones[0].hits >= 5) {
                await phone.updateMany({}, { hits: 0 })

            }
            //else {
            //    await phone.findOneAndUpdate({ number: phones[0].number }, { $inc: { 'hits': 1 } });
            //}
        }
        res.status(200).json(phones);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "error al obtener informacion",
        });
    }
};

phonesController.putPhone = async (req, res) => {
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
phonesController.putPhoneJWT = async (req, res) => {
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

phonesController.putPhoneById = async (req, res) => {
    try {
        const { phoneNumber, businessUnit, name, email, enable } = req.body;
        const newPhone = {
            name: name,
            email: email,
            businessUnit: businessUnit,
            phoneNumber: phoneNumber,
            enable: enable,
            hits: 0
        };
        const updatePhone = await phone.findOneAndUpdate({ _id: req.params.id }, newPhone, { useFindAndModify: true });
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
phonesController.putPhoneByIdJWT = async (req, res) => {
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
                    const { phoneNumber, businessUnit, name, email, enable } = req.body;
                    const newPhone = {
                        name: name,
                        email: email,
                        businessUnit: businessUnit,
                        phoneNumber: phoneNumber,
                        enable: enable,
                        hits: 0
                    };
                    const updatePhone = await phone.findOneAndUpdate({ _id: req.params.id }, newPhone, { useFindAndModify: true });
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
phonesController.deletePhoneJWT = async (req, res) => {
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
                    const { oldNumber } = req.body;
                    const deletePhone = await phone.deleteOne({ phoneNumber: oldNumber });
                    console.log(deletePhone)
                    if (deletePhone.deletedCount > 0) {
                        res.status(201).json({
                            mensaje: "Teléfono eliminado",
                        });
                    } else {
                        res.status(201).json({
                            mensaje: "Teléfono no encontrado",
                        });
                    }
                } catch (error) {
                    console.log(error);
                    res.status(500).json({
                        mensaje: "Problemas al elminar el teléfono",
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

phonesController.deletePhone = async (req, res) => {
    try {
        const { oldNumber } = req.body;
        const deletePhone = await phone.deleteOne({ phoneNumber: oldNumber });
        if (deletePhone.deletedCount > 0) {
            res.status(201).json({
                mensaje: "Teléfono eliminado",
            });
        } else {
            res.status(201).json({
                mensaje: "Teléfono no encontrado",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Problemas al modificar el teléfono",
        });
    }
};

phonesController.deletePhoneByIdJWT = async (req, res) => {
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
                    const deletePhone = await phone.deleteOne({ _id: req.params.id });
                    if (deletePhone.deletedCount > 0) {
                        res.status(201).json({
                            mensaje: "Teléfono eliminado",
                        });
                    } else {
                        res.status(201).json({
                            mensaje: "Teléfono no encontrado",
                        });
                    }
                } catch (error) {
                    console.log(error);
                    res.status(500).json({
                        mensaje: "Problemas al elminar el teléfono",
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

phonesController.deletePhoneById = async (req, res) => {
    try {
        const deletePhone = await phone.deleteOne({ _id: req.params.id });
        if (deletePhone.deletedCount > 0) {
            res.status(201).json({
                mensaje: "Teléfono eliminado",
            });
        } else {
            res.status(201).json({
                mensaje: "Teléfono no encontrado",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Problemas al modificar el teléfono",
        });
    }
};
phonesController.getPhone = async (req, res) => {
    try {
        const id = req.params.id
        const objectPhone = await phone.findById(id)
        res.status(200).json(objectPhone);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "error al obtener informacion",
        });
    }
};
phonesController.getPhoneJWT = async (req, res) => {
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
                    const id = req.params.id
                    const objectPhone = await phone.findById(id);
                    res.status(200).json(objectPhone);
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
export default phonesController;