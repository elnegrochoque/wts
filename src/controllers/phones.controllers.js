import phone from "../models/phones.models.js";
import { permissionJWTVerify } from "./jwt.controllers.js";
const phonesController = {};

function isNum(val) {
    return !isNaN(val)
}
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
            const permission = await permissionJWTVerify(baererToken)
            if (permission.flag == false) {
                res.sendStatus(403)
            } else {
                try {
                    if (req.query.all && req.query.all == "true" && req.query.page) {
                        if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin')) {
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
                                mensaje: "permisos insuficientes",
                            });
                        }
                    } else {
                        if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'view') || permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin')) {
                            let elements = 5
                            if (req.query.elements) {
                                elements = req.query.elements
                            }
                            if (req.query.page) {
                                const page = req.query.page
                                if (req.query.bu) {
                                    const bu = req.query.bu
                                    if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin')) {
                                        const phonesCount = await phone.count({ businessUnit: bu });
                                        const phones = await phone.find({ businessUnit: bu }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": phonesCount } })
                                        result.push({ phones: phones })
                                        res.status(200).json(result);
                                    } else {
                                        const phonesCount = await phone.count({ businessUnit: bu, bussinesAccountId: permission.user.user.bussinesAccountId });
                                        const phones = await phone.find({ businessUnit: bu, bussinesAccountId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": phonesCount } })
                                        result.push({ phones: phones })
                                        res.status(200).json(result);
                                    }
                                }
                                if (req.query.name) {
                                    const name = req.query.name
                                    if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin')) {
                                        const phonesCount = await phone.count({ name: name });
                                        const phones = await phone.find({ name: name }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": phonesCount } })
                                        result.push({ phones: phones })
                                        res.status(200).json(result);
                                    } else {
                                        const phonesCount = await phone.count({ name: name, bussinesAccountId: permission.user.user.bussinesAccountId });
                                        const phones = await phone.find({ name: name, bussinesAccountId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": phonesCount } })
                                        result.push({ phones: phones })
                                        res.status(200).json(result);
                                    }
                                }

                                if (req.query.email) {
                                    const email = req.query.email
                                    if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin')) {
                                        const phonesCount = await phone.count({ email: email });
                                        const phones = await phone.find({ email: email }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": phonesCount } })
                                        result.push({ phones: phones })
                                        res.status(200).json(result);
                                    } else {
                                        const phonesCount = await phone.count({ email: email, bussinesAccountId: permission.user.user.bussinesAccountId });
                                        const phones = await phone.find({ email: email, bussinesAccountId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": phonesCount } })
                                        result.push({ phones: phones })
                                        res.status(200).json(result);
                                    }
                                }
                                if (req.query.phoneNumber) {
                                    const phoneNumber = req.query.phoneNumber
                                    if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin')) {
                                        const phonesCount = await phone.count({ phoneNumber: phoneNumber });
                                        const phones = await phone.find({ phoneNumber: phoneNumber }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": phonesCount } })
                                        result.push({ phones: phones })
                                        res.status(200).json(result);
                                    } else {
                                        const phonesCount = await phone.count({ phoneNumber: phoneNumber, bussinesAccountId: permission.user.user.bussinesAccountId });
                                        const phones = await phone.find({ phoneNumber: phoneNumber, bussinesAccountId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": phonesCount } })
                                        result.push({ phones: phones })
                                        res.status(200).json(result);
                                    }
                                }
                                if (req.query.tiendaId && req.query.tiendaId == "true") {

                                    if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin')) {
                                        const phonesCount = await phone.count({ tiendaId: permission.user.user.tiendaId });
                                        const phones = await phone.find({ tiendaId: permission.user.user.tiendaId }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": phonesCount } })
                                        result.push({ phones: phones })
                                        res.status(200).json(result);
                                    } else {
                                        const phonesCount = await phone.count({ tiendaId: permission.user.user.tiendaId, bussinesAccountId: permission.user.user.bussinesAccountId });
                                        const phones = await phone.find({ tiendaId: permission.user.user.tiendaId, bussinesAccountId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        console.log(permission.user.user)
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": phonesCount } })
                                        result.push({ phones: phones })
                                        res.status(200).json(result);
                                    }
                                }
                                if (req.query.bussinesAccountId == "true") {
                                    if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin') && req.query.bussinesAccountIdString) {
                                        const bussinesAccountId = req.query.bussinesAccountIdString
                                        const phonesCount = await phone.count({ bussinesAccountId: bussinesAccountId });
                                        const phones = await phone.find({ bussinesAccountId: bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": phonesCount } })
                                        result.push({ phones: phones })
                                        res.status(200).json(result);
                                    } else {
                                        const phonesCount = await phone.count({ bussinesAccountId: permission.user.user.bussinesAccountId });
                                        const phones = await phone.find({ bussinesAccountId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": phonesCount } })
                                        result.push({ phones: phones })
                                        res.status(200).json(result);
                                    }
                                }

                            }
                            else {
                                res.status(500).json({
                                    mensaje: "error al obtener paginado",
                                });
                            }
                        } else {
                            res.status(500).json({
                                mensaje: "permisos insuficientes",
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
        const { phoneNumber, businessUnit, name, email, user } = req.body;
        const regex = /^[0-9]*$/;
        const onlyNumbers = regex.test(phoneNumber);
        console.log(onlyNumbers)
        const newPhone = new phone({
            name: name,
            email: email,
            businessUnit: businessUnit,
            phoneNumber: phoneNumber,
            enable: false,
            hits: 0,
            user: user,
            messages: 0
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
            const permission = await permissionJWTVerify(baererToken)
            if (permission.flag == false || (
                permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin') == undefined &&
                permission.user.user.permisions.find(permissionsAux => permissionsAux === 'create') == undefined)) {
                res.sendStatus(403)
            } else {
                try {
                    if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin')) {
                        const { phoneNumber, businessUnit, name, email, bussinesAccountId, tiendaId } = req.body;

                        const newPhone = new phone({
                            name: name,
                            email: email,
                            businessUnit: businessUnit,
                            phoneNumber: phoneNumber,
                            enable: false,
                            hits: 0,
                            bussinesAccountId: bussinesAccountId,
                            messages: 0,
                            tiendaId: tiendaId
                        });
                        await newPhone.save();
                        res.status(201).json({
                            mensaje: "Teléfono agregado",
                        });
                    } else {
                        const { phoneNumber, businessUnit, name, email } = req.body;
                        if (isNum(phoneNumber)) {
                            const newPhone = new phone({
                                name: name,
                                email: email,
                                businessUnit: businessUnit,
                                phoneNumber: phoneNumber,
                                enable: false,
                                hits: 0,
                                bussinesAccountId: permission.user.user.bussinesAccountId,
                                messages: 0,
                                tiendaId: permission.user.user.tiendaId
                            });
                            await newPhone.save();
                            res.status(201).json({
                                mensaje: "Teléfono agregado",
                            });
                        } else {
                            res.status(500).json({
                                mensaje: "Problemas al crear el teléfono",
                            });
                        }
                    }
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
            const permission = await permissionJWTVerify(baererToken)
            if (permission.flag == false) {
                res.sendStatus(403)
            } else {
                try {
                    if (req.query.bu || req.query.all) {
                        const bu = req.query.bu
                        let phones
                        if (req.query.bu) {
                            phones = await phone.find({ enable: true, businessUnit: bu }).sort("hits").limit(1);
                        }
                        if (req.query.all == "true") {
                            phones = await phone.find({ enable: true }).sort("hits").limit(1);
                        }
                        if (phones[0] && phones[0].hits) {
                            if (phones[0].hits >= 5) {
                                await phone.updateMany({}, { hits: 0 })
                            }
                            //else {
                            //    await phone.findOneAndUpdate({ number: phones[0].number }, { $inc: { 'hits': 1 } });
                            //}
                        }
                        res.status(200).json(phones);
                    } else {
                        res.status(500).json({
                            mensaje: "error al obtener unidad de negocio",
                        });
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
phonesController.getPhoneHits = async (req, res) => {

    try {
        if (req.query.bu || req.query.all) {
            const bu = req.query.bu
            let phones
            if (req.query.bu) {
                phones = await phone.find({ enable: true, businessUnit: bu }).sort("hits").limit(1);
            }
            if (req.query.all == "true") {
                phones = await phone.find({ enable: true }).sort("hits").limit(1);
            }
            if (phones[0] && phones[0].hits) {
                if (phones[0].hits >= 5) {
                    await phone.updateMany({}, { hits: 0 })
                }
                //else {
                //    await phone.findOneAndUpdate({ number: phones[0].number }, { $inc: { 'hits': 1 } });
                //}
            }
            res.status(200).json(phones);
        } else {
            res.status(500).json({
                mensaje: "error al obtener unidad de negocio",
            });
        }
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
            const permission = await permissionJWTVerify(baererToken)
            if (permission.flag == false || (
                permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin') == undefined &&
                permission.user.user.permisions.find(permissionsAux => permissionsAux === 'edit') == undefined)) {
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
            const permission = await permissionJWTVerify(baererToken)
            if (permission.flag == false || (
                permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin') == undefined &&
                permission.user.user.permisions.find(permissionsAux => permissionsAux === 'edit') == undefined)) {
                res.sendStatus(403)
            } else {
                try {
                    if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin')) {
                        const { phoneNumber, businessUnit, name, email, enable, bussinesAccountId, tiendaId } = req.body;
                        const newPhone = {
                            name: name,
                            email: email,
                            businessUnit: businessUnit,
                            phoneNumber: phoneNumber,
                            enable: enable,
                            hits: 0,
                            bussinesAccountId: bussinesAccountId,
                            tiendaId: tiendaId
                        };
                        const updatePhone = await phone.findOneAndUpdate({ _id: req.params.id, bussinesAccountId: permission.user.user.bussinesAccountId }, newPhone, { useFindAndModify: true });
                        if (updatePhone == null) {
                            res.status(201).json({
                                mensaje: "Teléfono inexistente",
                            });
                        } else {
                            res.status(201).json({
                                mensaje: "Teléfono modificado",
                            });
                        }
                    } else {
                        const { phoneNumber, businessUnit, name, email, enable } = req.body;
                        const newPhone = {
                            name: name,
                            email: email,
                            businessUnit: businessUnit,
                            phoneNumber: phoneNumber,
                            enable: enable,
                            hits: 0
                        };
                        const updatePhone = await phone.findOneAndUpdate({ _id: req.params.id, bussinesAccountId: permission.user.user.bussinesAccountId }, newPhone, { useFindAndModify: true });
                        if (updatePhone == null) {
                            res.status(201).json({
                                mensaje: "Teléfono inexistente",
                            });
                        } else {
                            res.status(201).json({
                                mensaje: "Teléfono modificado",
                            });
                        }
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
            const permission = await permissionJWTVerify(baererToken)
            if (permission.flag == false) {
                res.sendStatus(403)
            } else {
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
            const permission = await permissionJWTVerify(baererToken)
            if (permission.flag == false || (
                permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin') == undefined &&
                permission.user.user.permisions.find(permissionsAux => permissionsAux === 'edit') == undefined)) {
                res.sendStatus(403)
            } else {
                try {
                    if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin')) {
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
                    } else {
                        const deletePhone = await phone.deleteOne({ _id: req.params.id, bussinesAccountId: permission.user.user.bussinesAccountId });
                        if (deletePhone.deletedCount > 0) {
                            res.status(201).json({
                                mensaje: "Teléfono eliminado",
                            });
                        } else {
                            res.status(201).json({
                                mensaje: "Teléfono no encontrado",
                            });
                        }
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
            const permission = await permissionJWTVerify(baererToken)
            if (permission.flag == false || (
                permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin') == undefined &&
                permission.user.user.permisions.find(permissionsAux => permissionsAux === 'view') == undefined)) {
                res.sendStatus(403)
            } else {
                try {
                    if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin')) {
                        const id = req.params.id
                        const objectPhone = await phone.findById(id);
                        res.status(200).json(objectPhone);
                    } else {
                        const id = req.params.id
                        const objectPhone = await phone.find({ _id: id, bussinesAccountId: permission.user.user.bussinesAccountId });
                        res.status(200).json(objectPhone);
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
export default phonesController;