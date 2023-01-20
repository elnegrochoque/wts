
import message from "../models/messages.models.js";
import { urlMeta } from "../config.js";
import axios from "axios";
import { permissionJWTVerify } from "./jwt.controllers.js";
import contact from "../models/contacts.models.js";


const contactController = {};

function isNum(val) {
    return !isNaN(val)
}

contactController.getContactsJWT = async (req, res) => {
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
                            const contactCount = await contact.count({});
                            const result = []
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": contactCount } })
                            const contacts = await contact.find({}).skip((elements * page) - elements).limit(elements);
                            result.push({ contact: contacts })
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
                                if (req.query.lastName) {
                                    const lastName = req.query.lastName
                                    if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin')) {
                                        const contactCount = await contact.count({ lastName: lastName });
                                        const contacts = await contact.find({ lastName: lastName }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": contactCount } })
                                        result.push({ contacts: contacts })
                                        res.status(200).json(result);
                                    } else {
                                        const contactsCount = await contact.count({ lastName: lastName, bussinesAccountId: permission.user.user.bussinesAccountId });
                                        const contacts = await contact.find({ lastName: lastName, bussinesAccountId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": contactsCount } })
                                        result.push({ contacts: contacts })
                                        res.status(200).json(result);
                                    }
                                }
                                if (req.query.name) {
                                    const name = req.query.name
                                    if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin')) {
                                        const contactsCount = await contact.count({ name: { $regex: name, $options: 'i' } });
                                        const contacts = await contact.find({ name: { $regex: name, $options: 'i' } }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": contactsCount } })
                                        result.push({ contacts: contacts })
                                        res.status(200).json(result);
                                    } else {
                                        const contactsCount = await contact.count({ name: { $regex: name, $options: 'i' }, bussinesAccountId: permission.user.user.bussinesAccountId });
                                        const contacts = await contact.find({ name: { $regex: name, $options: 'i' }, bussinesAccountId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": contactsCount } })
                                        result.push({ contacts: contacts })
                                        res.status(200).json(result);
                                    }
                                }

                                if (req.query.email) {
                                    const email = req.query.email
                                    if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin')) {
                                        const contactsCount = await contact.count({ email: email });
                                        const contacts = await contact.find({ email: email }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": contactsCount } })
                                        result.push({ contacts: contacts })
                                        res.status(200).json(result);
                                    } else {
                                        const contactsCount = await contact.count({ email: email, bussinesAccountId: permission.user.user.bussinesAccountId });
                                        const contacts = await contact.find({ email: email, bussinesAccountId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": contactsCount } })
                                        result.push({ contacts: contacts })
                                        res.status(200).json(result);
                                    }
                                }
                                if (req.query.phone) {
                                    const phone = req.query.phone
                                    if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin')) {
                                        const contactsCount = await contact.count({ phone: phone });
                                        const contacts = await contact.find({ phone: phone }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": contactsCount } })
                                        result.push({ contacts: contacts })
                                        res.status(200).json(result);
                                    } else {
                                        const contactsCount = await contact.count({ phone: phone, bussinesAccountId: permission.user.user.bussinesAccountId });
                                        const contacts = await contact.find({ phone: phone, bussinesAccountId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": contactsCount } })
                                        result.push({ contacts: contacts })
                                        res.status(200).json(result);
                                    }
                                }
                                if (req.query.tiendaId && req.query.tiendaId == "true") {

                                    if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin')) {
                                        const contactsCount = await contact.count({ tiendaId: permission.user.user.tiendaId });
                                        const contacts = await contact.find({ tiendaId: permission.user.user.tiendaId }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": contactsCount } })
                                        result.push({ contacts: contacts })
                                        res.status(200).json(result);
                                    } else {
                                        const contactsCount = await contact.count({ tiendaId: permission.user.user.tiendaId, bussinesAccountId: permission.user.user.bussinesAccountId });
                                        const contacts = await contact.find({ tiendaId: permission.user.user.tiendaId, bussinesAccountId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": contactsCount } })
                                        result.push({ contacts: contacts })
                                        res.status(200).json(result);
                                    }
                                }
                                if (req.query.bussinesAccountId == "true") {
                                    if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin') && req.query.bussinesAccountIdString) {
                                        const bussinesAccountId = req.query.bussinesAccountIdString
                                        const contactsCount = await contact.count({ bussinesAccountId: bussinesAccountId });
                                        const contacts = await contact.find({ bussinesAccountId: bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": contactsCount } })
                                        result.push({ contacts: contacts })
                                        res.status(200).json(result);
                                    } else {
                                        const contactsCount = await contact.count({ bussinesAccountId: permission.user.user.bussinesAccountId });
                                        const contacts = await contact.find({ bussinesAccountId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                                        const result = []
                                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": contactsCount } })
                                        result.push({ contacts: contacts })
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

contactController.postCreateContact = async (req, res) => {
    try {
        const { name, lastName, email, bussinesAccountId, tiendaId, phone } = req.body;
        if (isNum(phone)) {
            const newContact = new contact({
                name: name,
                lastName: lastName,
                tiendaId: tiendaId,
                bussinesAccountId: bussinesAccountId,
                email: email,
                phone: phone
            });
            await newContact.save();
            res.status(201).json({
                mensaje: "Contacto agregado",
            });
        } else {
            res.status(500).json({
                mensaje: "Problemas al crear el contacto",
            });
        }
    } catch (error) {
        console.log(error);
        if (error.code && error.code == 11000) {
            res.status(500).json({
                mensaje: "Ya existe el contacto",
            });
        } else {
            res.status(500).json({
                mensaje: "Problemas al crear el Contacto",
            });
        }

    }
};
contactController.postCreateContactJWT = async (req, res) => {
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
                        const { name, lastName, email, bussinesAccountId, tiendaId, phone } = req.body;
                        if (isNum(phone)) {
                            const newContact = new contact({
                                name: name,
                                lastName: lastName,
                                tiendaId: tiendaId,
                                bussinesAccountId: bussinesAccountId,
                                email: email,
                                phone: phone
                            });
                            await newContact.save();
                            res.status(201).json({
                                mensaje: "Contacto agregado",
                            });
                        } else {
                            res.status(500).json({
                                mensaje: "Problemas al crear el contacto",
                            });
                        }
                    } else {
                        const { name, lastName, email, phone } = req.body;
                        if (isNum(phone)) {
                            const newcontact = new contact({
                                name: name,
                                lastName: lastName,
                                email: email,
                                phone: phone,
                                bussinesAccountId: permission.user.user.bussinesAccountId,
                                tiendaId: permission.user.user.tiendaId
                            });
                            await newcontact.save();
                            res.status(201).json({
                                mensaje: "Contacto agregado",
                            });
                        } else {
                            res.status(500).json({
                                mensaje: "Problemas al crear el contacto",
                            });
                        }
                    }
                } catch (error) {
                    console.log(error);
                    if (error.code && error.code == 11000) {
                        res.status(500).json({
                            mensaje: "Ya existe el contacto",
                        });
                    } else {
                        res.status(500).json({
                            mensaje: "Problemas al crear contacto",
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

contactController.putContactById = async (req, res) => {
    try {
        const { name, lastName, email, phone, bussinesAccountId, tiendaId } = req.body;
        if (isNum(phone)) {
            const newContact = new contact({
                name: name,
                lastName: lastName,
                email: email,
                phone: phone,
                bussinesAccountId: bussinesAccountId,
                tiendaId: tiendaId
            });
            const updateContact = await contact.findOneAndUpdate({ _id: req.params.id }, newContact, { useFindAndModify: true });
            if (updateContact == null) {
                res.status(201).json({
                    mensaje: "Contacto inexistente",
                });
            } else {
                res.status(201).json({
                    mensaje: "Contacto modificado",
                });
            }
        } else {
            res.status(500).json({
                mensaje: "Problemas al crear el contacto",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Problemas al modificar el Contacto",
        });
    }
};
contactController.putContactByIdJWT = async (req, res) => {
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
                        const { name, lastName, email, phone, bussinesAccountId, tiendaId } = req.body;
                        if (isNum(phone)) {
                            const newContact = new contact({
                                name: name,
                                lastName: lastName,
                                email: email,
                                phone: phone,
                                bussinesAccountId: bussinesAccountId,
                                tiendaId: tiendaId
                            });
                            const updateContact = await contact.findOneAndUpdate({ _id: req.params.id }, newContact, { useFindAndModify: true });
                            if (updateContact == null) {
                                res.status(201).json({
                                    mensaje: "Contacto inexistente",
                                });
                            } else {
                                res.status(201).json({
                                    mensaje: "Contacto modificado",
                                });
                            }
                        }
                    } else {
                        const { name, lastName, email, phone } = req.body;
                        if (isNum(phone)) {
                            const newContact = {
                                name: name,
                                lastName: lastName,
                                email: email,
                                phone: phone,
                                bussinesAccountId: permission.user.user.bussinesAccountId,
                                tiendaId: permission.user.user.tiendaId
                            };
                            const updateContact = await contact.findOneAndUpdate({ _id: req.params.id }, newContact, { useFindAndModify: true });
                            if (updateContact == null) {
                                res.status(201).json({
                                    mensaje: "Contacto inexistente",
                                });
                            } else {
                                res.status(201).json({
                                    mensaje: "Contacto modificado",
                                });
                            }
                        }
                    }

                } catch (error) {
                    console.log(error);
                    res.status(500).json({
                        mensaje: "Problemas al modificar el contacto",
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


contactController.deleteContactByIdJWT = async (req, res) => {
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
                        const deleteContact = await contact.deleteOne({ _id: req.params.id });
                        if (deletePhone.deletedCount > 0) {
                            res.status(201).json({
                                mensaje: "Contacto eliminado",
                            });
                        } else {
                            res.status(201).json({
                                mensaje: "Contacto no encontrado",
                            });
                        }
                    } else {
                        const deleteContact = await contact.deleteOne({ _id: req.params.id, bussinesAccountId: permission.user.user.bussinesAccountId });
                        if (deleteContact.deletedCount > 0) {
                            res.status(201).json({
                                mensaje: "Contacto eliminado",
                            });
                        } else {
                            res.status(201).json({
                                mensaje: "Contacto no encontrado",
                            });
                        }
                    }
                } catch (error) {
                    console.log(error);
                    res.status(500).json({
                        mensaje: "Problemas al elminar el Contacto",
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

contactController.deleteContacById = async (req, res) => {
    try {
        const deleteContact = await contact.deleteOne({ _id: req.params.id });
        if (deleteContact.deletedCount > 0) {
            res.status(201).json({
                mensaje: "Contacto eliminado",
            });
        } else {
            res.status(201).json({
                mensaje: "Contacto no encontrado",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "Problemas al modificar el contacto",
        });
    }
};
export default contactController;