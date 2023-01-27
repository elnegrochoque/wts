
import message from "../models/messages.models.js";
import { urlMeta } from "../config.js";
import axios from "axios";
import { permissionJWTVerify } from "./jwt.controllers.js";
import phone from "../models/phones.models.js";
import formidable from "formidable";
import { fileType, mediaLimits, validateMediaSize } from "./helpers.js";
import fs from "fs";
import request from "request";
const messagesController = {};


const getPhoneNumberWhitID = async (phoneNumber, bussinesAccountId, messageToken) => {
    let phone = {
        exist: false,
        id: 0
    }
    try {
        var config = {
            method: 'get',
            url: urlMeta.url + bussinesAccountId + '/phone_numbers',
            headers: {
                'Authorization': 'Bearer ' + messageToken
            }
        };
        await axios(config)
            .then(function (response) {
                const phones = response.data.data;
                for (let i = 0; i < phones.length; i++) {
                    if (phones[i].display_phone_number == phoneNumber) {
                        phone = {
                            exist: true,
                            id: phones[i].id
                        }
                        return phone
                    }
                }
            })
            .catch(function (error) {
                console.log(error);

            });
    } catch (error) {
        console.log(error);
        return phone
    }
    return phone
}




messagesController.getMessageJWT = async (req, res) => {
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
                let elements = 5
                if (req.query.elements) {
                    elements = parseInt(req.query.elements)
                }
                if (permission.user.user.permisions.find(permissionsAux => permissionsAux === 'admin')) {
                    if (req.query.page) {
                        const page = req.query.page
                        if (req.query.number) {
                            const messageCount = await message.count({ $or: [{ from: { $regex: req.query.number }, whatsappBussinessId: permission.user.user.bussinesAccountId }, { to: { $regex: req.query.number }, whatsappBussinessId: permission.user.user.bussinesAccountId }] });
                            const result = []
                            result.push({ status: true })
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                            const messages = await message.find({ $or: [{ from: { $regex: req.query.number }, whatsappBussinessId: permission.user.user.bussinesAccountId }, { to: { $regex: req.query.number }, whatsappBussinessId: permission.user.user.bussinesAccountId }] }).skip((elements * page) - elements).limit(elements);
                            result.push({ messages: messages })
                            res.status(200).json(result);
                        }
                        if (req.query.from) {
                            const messageCount = await message.count({ from: req.query.from });
                            const result = []
                            result.push({ status: true })
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                            const messages = await message.find({ from: req.query.from }).skip((elements * page) - elements).limit(elements);
                            result.push({ messages: messages })
                            res.status(200).json(result);
                        }
                        if (req.query.to) {
                            const messageCount = await message.count({ to: req.query.to });
                            const result = []
                            result.push({ status: true })
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                            const messages = await message.find({ to: req.query.to }).skip((elements * page) - elements).limit(elements);
                            result.push({ messages: messages })
                            res.status(200).json(result);
                        }
                        if (req.query.all == "true") {
                            const messageCount = await message.count();
                            const result = []
                            result.push({ status: true })
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                            const messages = await message.find().skip((elements * page) - elements).limit(elements);
                            result.push({ messages: messages })
                            res.status(200).json(result);
                        }
                        if (req.query.date == "true" && req.query.start && typeof req.query.start == "string" && req.query.end && typeof req.query.end == "string") {
                            const startAux = req.query.start.split("-")
                            const endAux = req.query.end.split("-")
                            const start = new Date(startAux[2], startAux[1] - 1, startAux[0])
                            const end = new Date(endAux[2], endAux[1] - 1, endAux[0])
                            const messageCount = await message.count({ createdAt: { $gte: start, $lt: end } });
                            const result = []
                            result.push({ status: true })
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                            const messages = await message.find({ createdAt: { $gte: start, $lt: end } }).skip((elements * page) - elements).limit(elements);
                            result.push({ messages: messages })
                            res.status(200).json(result);
                        } else {
                            res.status(500).json({
                                status: false,
                                mensaje: "error al obtener informacion",
                            });
                        }
                    } else {
                        res.status(500).json({
                            status: false,
                            mensaje: "error al obtener informacion",
                        });
                    }
                } else {
                    if (req.query.page) {
                        const page = req.query.page
                        if (req.query.number) {
                            const messageCount = await message.count({ $or: [{ from: { $regex: req.query.number }, whatsappBussinessId: permission.user.user.bussinesAccountId }, { to: { $regex: req.query.number }, whatsappBussinessId: permission.user.user.bussinesAccountId }] });
                            const result = []
                            result.push({ status: true })
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                            const messages = await message.find({ $or: [{ from: { $regex: req.query.number }, whatsappBussinessId: permission.user.user.bussinesAccountId }, { to: { $regex: req.query.number }, whatsappBussinessId: permission.user.user.bussinesAccountId }] }).skip((elements * page) - elements).limit(elements);
                            result.push({ messages: messages })
                            res.status(200).json(result);
                        }

                        if (req.query.from) {
                            const messageCount = await message.count({ from: req.query.from, whatsappBussinessId: permission.user.user.bussinesAccountId });
                            const result = []
                            result.push({ status: true })
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                            const messages = await message.find({ from: req.query.from, whatsappBussinessId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                            result.push({ messages: messages })
                            res.status(200).json(result);
                        }
                        if (req.query.to) {
                            const messageCount = await message.count({ to: req.query.to, whatsappBussinessId: permission.user.user.bussinesAccountId });
                            const result = []
                            result.push({ status: true })
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                            const messages = await message.find({ to: req.query.to, whatsappBussinessId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                            result.push({ messages: messages })
                            res.status(200).json(result);
                        }
                        if (req.query.all == "true") {
                            const messageCount = await message.count({ whatsappBussinessId: permission.user.user.bussinesAccountId });
                            const result = []
                            result.push({ status: true })
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                            const messages = await message.find({ whatsappBussinessId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                            result.push({ messages: messages })
                            res.status(200).json(result);
                        }
                        if (req.query.date == "true" && req.query.start && typeof req.query.start == "string" && req.query.end && typeof req.query.end == "string") {
                            const startAux = req.query.start.split("-")
                            const endAux = req.query.end.split("-")
                            const start = new Date(startAux[2], startAux[1] - 1, startAux[0])
                            const end = new Date(endAux[2], endAux[1] - 1, endAux[0])
                            const messageCount = await message.count({ whatsappBussinessId: permission.user.user.bussinesAccountId, createdAt: { $gte: start, $lt: end } });
                            const result = []
                            result.push({ status: true })
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                            const messages = await message.find({ whatsappBussinessId: permission.user.user.bussinesAccountId, createdAt: { $gte: start, $lt: end } }).skip((elements * page) - elements).limit(elements);
                            result.push({ messages: messages })
                            res.status(200).json(result);
                        }
                        if (req.query.tiendaId == "true") {
                            const messageCount = await message.count({ tiendaId: permission.user.user.tiendaId, whatsappBussinessId: permission.user.user.bussinesAccountId });
                            const result = []
                            result.push({ status: true })
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                            const messages = await message.find({ tiendaId: permission.user.user.tiendaId, whatsappBussinessId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                            result.push({ messages: messages })
                            res.status(200).json(result);
                        }
                    } else {
                        res.status(500).json({
                            status: false,
                            mensaje: "error al obtener informacion",
                        });
                    }
                }

            } catch (error) {
                console.log(error);
                res.status(500).json({
                    status: false,
                    mensaje: "error al obtener informacion",
                });
            }
        }
    } else {
        res.sendStatus(403)
    }
};

messagesController.getMessage = async (req, res) => {
    try {
        let elements = 5
        if (req.query.elements) {
            elements = parseInt(req.query.elements)
        }
        if (req.query.page) {
            const page = req.query.page
            if (req.query.from) {
                const messageCount = await message.count({ from: req.query.from });
                const result = []
                result.push({ status: true })
                result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                const messages = await message.find({ from: req.query.from }).skip((elements * page) - elements).limit(elements);
                result.push({ messages: messages })
                res.status(200).json(result);
            }
            if (req.query.to) {
                const messageCount = await message.count({ to: req.query.to });
                const result = []
                result.push({ status: true })
                result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                const messages = await message.find({ to: req.query.to }).skip((elements * page) - elements).limit(elements);
                result.push({ messages: messages })
                res.status(200).json(result);
            }
            if (req.query.all == "true") {
                const messageCount = await message.count();
                const result = []
                result.push({ status: true })
                result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                const messages = await message.find().skip((elements * page) - elements).limit(elements);
                result.push({ messages: messages })
                res.status(200).json(result);
            }
            if (req.query.tiendaId) {
                const messageCount = await message.count({ tiendaId: req.query.tiendaId });
                const result = []
                result.push({ status: true })
                result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                const messages = await message.find({ tiendaId: req.query.tiendaId }).skip((elements * page) - elements).limit(elements);
                result.push({ messages: messages })
                res.status(200).json(result);
            }
        } else {
            res.status(500).json({
                status: false,
                mensaje: "error al obtener informacion",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            mensaje: "error al obtener informacion",
        });
    }
};

messagesController.postTextMessageJWT = async (req, res) => {
    const baererHeader = req.headers.authorization;
    if (typeof baererHeader !== 'undefined') {
        const baererToken = baererHeader.split(" ")[1]
        req.token = baererToken;
        const permission = await permissionJWTVerify(baererToken)
        if (permission.flag == false) {
            res.sendStatus(403)
        } else {
            if (req.body.to && req.body.text && req.body.from) {
                const idNumber = await getPhoneNumberWhitID(req.body.from, permission.user.user.bussinesAccountId, permission.user.user.messageToken)
                if (idNumber.exist == true) {
                    try {
                        var data = JSON.stringify({
                            "messaging_product": "whatsapp",
                            "recipient_type": "individual",
                            "to": req.body.to,
                            "type": "text",
                            "text": {
                                "preview_url": false,
                                "body": req.body.text
                            }
                        });
                        var config = {
                            method: 'post',
                            url: urlMeta.url + idNumber.id + '/messages',
                            headers: {
                                'Authorization': 'Bearer ' + permission.user.user.messageToken,
                                'Content-Type': 'application/json'
                            },
                            data: data
                        };
                        axios(config)
                            .then(async function (response) {
                                await phone.findOneAndUpdate({ phoneNumber: req.body.from }, { $inc: { 'messages': 1 } });
                                const newMessage = new message({
                                    message: req.body.text,
                                    from: req.body.from,
                                    to: req.body.to,
                                    whatsappBussinessId: permission.user.user.bussinesAccountId,
                                    tiendaId: permission.user.user.tiendaId
                                })
                                await newMessage.save()
                                res.status(200).json({
                                    status: true,
                                    mensaje: "enviado"
                                });

                            })
                            .catch(function (error) {
                                res.status(500).json({
                                    status: false,
                                    mensaje: "error al obtener informacion",
                                });
                                console.log(error);
                            });
                    } catch (error) {
                        console.log(error);
                        res.status(500).json({
                            status: false,
                            mensaje: "error al obtener informacion",
                        });
                    }
                } else {
                    res.status(500).json({
                        status: false,
                        mensaje: "error al obtener informacion",
                    });
                }
            } else {
                res.status(500).json({
                    status: false,
                    mensaje: "error al obtener informacion",
                });
            }
        }
    } else {
        res.sendStatus(403)
    }
};

messagesController.postTextMessage = async (req, res) => {
    if (req.body.to && req.body.text && req.body.from && req.body.bussinesAccountId && req.body.messageToken) {
        const idNumber = await getPhoneNumberWhitID(req.body.from, req.body.messageToken, req.body.bussinesAccountId)
        if (idNumber.exist == true) {
            try {
                var data = JSON.stringify({
                    "messaging_product": "whatsapp",
                    "recipient_type": "individual",
                    "to": req.body.to,
                    "type": "text",
                    "text": {
                        "preview_url": false,
                        "body": req.body.text
                    }
                });
                var config = {
                    method: 'post',
                    url: urlMeta.url + idNumber.id + '/messages',
                    headers: {
                        'Authorization': 'Bearer ' + req.body.messageToken,
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                axios(config)
                    .then(async function (response) {
                        res.status(200).json({ status: true, mensaje: "enviado" });
                        await phone.findOneAndUpdate({ phoneNumber: req.body.from }, { $inc: { 'messages': 1 } });
                    })
                    .catch(function (error) {
                        res.status(500).json({
                            status: false,
                            mensaje: "error al obtener informacion",
                        });
                        console.log(error);
                    });
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    status: false,
                    mensaje: "error al obtener informacion",
                });
            }
        } else {
            res.status(500).json({
                status: false,
                mensaje: "error al obtener informacion",
            });
        }
    } else {
        res.status(500).json({
            status: false,
            mensaje: "error al obtener informacion",
        });
    }

};

messagesController.postLocationMessageJWT = async (req, res) => {
    const baererHeader = req.headers.authorization;
    if (typeof baererHeader !== 'undefined') {
        const baererToken = baererHeader.split(" ")[1]
        req.token = baererToken;
        const permission = await permissionJWTVerify(baererToken)
        if (permission.flag == false) {
            res.sendStatus(403)
        } else {
            if (req.body.from && req.body.to && req.body.longitude && req.body.latitude && req.body.name && req.body.address) {
                const idNumber = await getPhoneNumberWhitID(req.body.from, permission.user.user.bussinesAccountId, permission.user.user.messageToken)
                if (idNumber.exist == true) {
                    try {
                        var data = JSON.stringify({
                            "messaging_product": "whatsapp",
                            "to": req.body.to,
                            "type": "location",
                            "location": {
                                "longitude": req.body.longitude,
                                "latitude": req.body.latitude,
                                "name": req.body.name,
                                "address": req.body.address
                            }
                        });
                        var config = {
                            method: 'post',
                            url: urlMeta.url + idNumber.id + '/messages',
                            headers: {
                                'Authorization': 'Bearer ' + permission.user.user.messageToken,
                                'Content-Type': 'application/json'
                            },
                            data: data
                        };
                        axios(config)
                            .then(async function (response) {
                                const textMessage = "Location: " + "Latitude: " + req.body.latitude + ", Longitude: " + req.body.longitude
                                const newMessage = new message({
                                    message: textMessage,
                                    from: req.body.from,
                                    to: req.body.to,
                                    whatsappBussinessId: permission.user.user.bussinesAccountId,
                                    tiendaId: permission.user.user.tiendaId
                                })
                                await newMessage.save()
                                await phone.findOneAndUpdate({ phoneNumber: req.body.from }, { $inc: { 'messages': 1 } });
                                res.status(200).json({ status: true, mensaje: "enviado" });
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    } catch (error) {
                        console.log(error);
                        res.status(500).json({
                            status: false,
                            mensaje: "error al obtener informacion",
                        });
                    }
                } else {
                    res.status(500).json({
                        status: false,
                        mensaje: "error al obtener informacion",
                    });
                }
            } else {
                res.status(500).json({
                    status: false,
                    mensaje: "error al obtener informacion",
                });
            }
        }
    } else {
        res.sendStatus(403)
    }
};

messagesController.postLocationMessage = async (req, res) => {
    if (req.body.to && req.body.longitude && req.body.latitude && req.body.name && req.body.adress && req.body.bussinesAccountId && req.body.messageToken) {
        const idNumber = await getPhoneNumberWhitID(req.body.from, req.body.messageToken, req.body.bussinesAccountId)
        const phoneNumber = await phone.find({ number: req.body.from });
        if (phoneNumber.message > 2000) {
            res.status(500).json({
                status: false,
                mensaje: "maxima cantidad de mensajes alcanzada",
            });
        }
        if (idNumber.exist == true) {
            try {
                var data = JSON.stringify({
                    "messaging_product": "whatsapp",
                    "to": req.body.to,
                    "type": "location",
                    "location": {
                        "longitude": req.body.longitude,
                        "latitude": req.body.latitude,
                        "name": req.body.name,
                        "address": req.body.adress
                    }
                });
                var config = {
                    method: 'post',
                    url: urlMeta.url + idNumber.id + '/messages',
                    headers: {
                        'Authorization': 'Bearer EAAOTTeeRA1IBAP3ef65R8T1CzIhnBZBZBK3ys7o17Wis8flDxmCCYBZBc5VPmBiwtHkKXH0ajC1Vu8nsy1PYZCHRqeWtWvgVPY6kK5HRgoWrtmllvN6UDwefy7ZBTrdLr9IZCUMRBNiOCatedqp9rHZAx5U0tUD9V0kECBdrZApOzw2QZCyXSKSzk',
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                axios(config)
                    .then(async function (response) {

                        await phone.findOneAndUpdate({ phoneNumber: req.body.from }, { $inc: { 'messages': 1 } });
                        const textMessage = "Location: " + "Latitude: " + req.body.latitude + ", Longitude: " + req.body.longitude
                        const newMessage = new message({
                            message: textMessage,
                            from: req.body.from,
                            to: req.body.to,
                            whatsappBussinessId: permission.user.user.bussinesAccountId,
                            tiendaId: permission.user.user.tiendaId
                        })
                        await newMessage.save()
                        res.status(200).json({ status: true, mensaje: "enviado" });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    status: false,
                    mensaje: "error al obtener informacion",
                });
            }
        } else {
            res.status(500).json({
                status: false,
                mensaje: "error al obtener informacion",
            });
        }
    } else {
        res.status(500).json({
            status: false,
            mensaje: "error al obtener informacion",
        });
    }
};

messagesController.getAccountPhonesJWT = async (req, res) => {
    const baererHeader = req.headers.authorization;
    if (typeof baererHeader !== 'undefined') {
        const baererToken = baererHeader.split(" ")[1]
        req.token = baererToken;
        const permission = await permissionJWTVerify(baererToken)
        if (permission.flag == false) {
            res.sendStatus(403)
        } else {
            try {
                var config = {
                    method: 'get',
                    url: urlMeta.url + permission.user.user.bussinesAccountId + '/phone_numbers',
                    headers: {
                        'Authorization': 'Bearer ' + permission.user.user.messageToken
                    }
                };
                axios(config)
                    .then(function (response) {
                        response.data.data.push({ status: true })
                        res.status(200).json(response.data.data);
                    })
                    .catch(function (error) {
                        console.log(error);
                        res.status(500).json({
                            status: false,
                            mensaje: "error al obtener informacion",
                        });
                    });
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    status: false,
                    mensaje: "error al obtener informacion",
                });
            }
        }
    } else {
        res.sendStatus(403)
    }
};

messagesController.getAccountPhones = async (req, res) => {
    try {
        if (req.body.bussinesAccountId && req.body.messageToken) {
            var config = {
                method: 'get',
                url: urlMeta.url + req.body.bussinesAccountId + '/phone_numbers',
                headers: {
                    'Authorization': 'Bearer ' + req.body.messageToken
                }
            };
            axios(config)
                .then(function (response) {
                    response.data.data.push({ status: true })
                    res.status(200).json(response.data.data);
                })
                .catch(function (error) {
                    console.log(error);
                    res.status(500).json({
                        status: false,
                        mensaje: "error al obtener informacion",
                    });
                });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            mensaje: "error al obtener informacion",
        });
    }
}

messagesController.postTemplateIssueJWT = async (req, res) => {
    const baererHeader = req.headers.authorization;
    if (typeof baererHeader !== 'undefined') {
        const baererToken = baererHeader.split(" ")[1]
        req.token = baererToken;
        const permission = await permissionJWTVerify(baererToken)
        if (permission.flag == false) {
            res.sendStatus(403)
        } else {
            if (req.body.to && req.body.name && req.body.from) {
                const idNumber = await getPhoneNumberWhitID(req.body.from, permission.user.user.bussinesAccountId, permission.user.user.messageToken)
                if (idNumber.exist == true) {
                    try {
                        var data = JSON.stringify({
                            "messaging_product": "whatsapp",
                            "to": req.body.to,
                            "type": "template",
                            "template": {
                                "name": "sample_issue_resolution",
                                "language": {
                                    "code": "es",
                                    "policy": "deterministic"
                                },
                                "components": [
                                    {
                                        "type": "body",
                                        "parameters": [
                                            {
                                                "type": "text",
                                                "text": req.body.name
                                            }
                                        ]
                                    },
                                    {
                                        "type": "button",
                                        "sub_type": "quick_reply",
                                        "index": 0,
                                        "parameters": [
                                            {
                                                "type": "text",
                                                "text": "Yes"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "button",
                                        "sub_type": "quick_reply",
                                        "index": 1,
                                        "parameters": [
                                            {
                                                "type": "text",
                                                "text": "No"
                                            }
                                        ]
                                    }
                                ]
                            }
                        });
                        var config = {
                            method: 'post',
                            url: urlMeta.url + idNumber.id + '/messages',
                            headers: {
                                'Authorization': 'Bearer ' + permission.user.user.messageToken,
                                'Content-Type': 'application/json'
                            },
                            data: data
                        };
                        axios(config)
                            .then(async function (response) {
                                await phone.findOneAndUpdate({ phoneNumber: req.body.from }, { $inc: { 'messages': 1 } });
                                const textMessage = "Template: Issue " + "name: " + req.body.name
                                const newMessage = new message({
                                    message: textMessage,
                                    from: req.body.from,
                                    to: req.body.to,
                                    whatsappBussinessId: permission.user.user.bussinesAccountId,
                                    tiendaId: permission.user.user.tiendaId
                                })
                                await newMessage.save()
                                res.status(200).json({ status: true, mensaje: "enviado" });

                            })
                            .catch(function (error) {
                                res.status(500).json({
                                    status: false,
                                    mensaje: "error al obtener informacion",
                                });
                                console.log(error);
                            });
                    } catch (error) {
                        console.log(error);
                        res.status(500).json({
                            status: false,
                            mensaje: "error al obtener informacion",
                        });
                    }
                } else {
                    res.status(500).json({
                        status: false,
                        mensaje: "error al obtener informacion",
                    });
                }
            } else {
                res.status(500).json({
                    status: false,
                    mensaje: "error al obtener informacion",
                });
            }
        }
    } else {
        res.sendStatus(403)
    }
};

messagesController.postTemplateThanksForBuyJWT = async (req, res) => {
    const baererHeader = req.headers.authorization;
    if (typeof baererHeader !== 'undefined') {
        const baererToken = baererHeader.split(" ")[1]
        req.token = baererToken;
        const permission = await permissionJWTVerify(baererToken)
        if (permission.flag == false) {
            res.sendStatus(403)
        } else {
            if (req.body.to && req.body.name && req.body.from && req.body.link) {
                const idNumber = await getPhoneNumberWhitID(req.body.from, permission.user.user.bussinesAccountId, permission.user.user.messageToken)
                if (idNumber.exist == true) {
                    try {
                        var data = JSON.stringify(
                            {
                                "messaging_product": "whatsapp",
                                "to": req.body.to,
                                "type": "template",
                                "template": {
                                    "name": "sample_purchase_feedback",
                                    "language": {
                                        "code": "es",
                                        "policy": "deterministic"
                                    },
                                    "components": [
                                        {
                                            "type": "header",
                                            "parameters": [
                                                {
                                                    "type": "image",
                                                    "image": {
                                                        "link": req.body.link
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            "type": "body",
                                            "parameters": [
                                                {
                                                    "type": "text",
                                                    "text": req.body.name
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        );
                        var config = {
                            method: 'post',
                            url: urlMeta.url + idNumber.id + '/messages',
                            headers: {
                                'Authorization': 'Bearer ' + permission.user.user.messageToken,
                                'Content-Type': 'application/json'
                            },
                            data: data
                        };
                        axios(config)
                            .then(async function (response) {
                                await phone.findOneAndUpdate({ phoneNumber: req.body.from }, { $inc: { 'messages': 1 } });
                                const textMessage = "Template: ThanksForBuy " + "name: " + req.body.name + ", Link: " + req.body.link
                                const newMessage = new message({
                                    message: textMessage,
                                    from: req.body.from,
                                    to: req.body.to,
                                    whatsappBussinessId: permission.user.user.bussinesAccountId,
                                    tiendaId: permission.user.user.tiendaId
                                })
                                await newMessage.save()
                                res.status(200).json({ status: true, mensaje: "enviado" });

                            })
                            .catch(function (error) {
                                res.status(500).json({
                                    status: false,
                                    mensaje: "error al obtener informacion",
                                });
                                console.log(error);
                            });
                    } catch (error) {
                        console.log(error);
                        res.status(500).json({
                            status: false,
                            mensaje: "error al obtener informacion",
                        });
                    }
                } else {
                    res.status(500).json({
                        status: false,
                        mensaje: "error al obtener informacion",
                    });
                }
            } else {
                res.status(500).json({
                    status: false,
                    mensaje: "error al obtener informacion",
                });
            }
        }
    } else {
        res.sendStatus(403)
    }
};

messagesController.postTemplateHelloWorldJWT = async (req, res) => {
    const baererHeader = req.headers.authorization;
    if (typeof baererHeader !== 'undefined') {
        const baererToken = baererHeader.split(" ")[1]
        req.token = baererToken;
        const permission = await permissionJWTVerify(baererToken)
        if (permission.flag == false) {
            res.sendStatus(403)
        } else {
            if (req.body.to && req.body.from) {
                const idNumber = await getPhoneNumberWhitID(req.body.from, permission.user.user.bussinesAccountId, permission.user.user.messageToken)
                if (idNumber.exist == true) {
                    try {
                        var data = JSON.stringify(
                            {
                                "messaging_product": "whatsapp",
                                "to": req.body.to,
                                "type": "template",
                                "template": {
                                    "name": "hello_world",
                                    "language": {
                                        "code": "en_US"
                                    }
                                }
                            }
                        );
                        var config = {
                            method: 'post',
                            url: urlMeta.url + idNumber.id + '/messages',
                            headers: {
                                'Authorization': 'Bearer ' + permission.user.user.messageToken,
                                'Content-Type': 'application/json'
                            },
                            data: data
                        };
                        axios(config)
                            .then(async function (response) {
                                await phone.findOneAndUpdate({ phoneNumber: req.body.from }, { $inc: { 'messages': 1 } });
                                const textMessage = "Template: HelloWorld "
                                const newMessage = new message({
                                    message: textMessage,
                                    from: req.body.from,
                                    to: req.body.to,
                                    whatsappBussinessId: permission.user.user.bussinesAccountId,
                                    tiendaId: permission.user.user.tiendaId
                                })
                                await newMessage.save()
                                res.status(200).json({ status: true, mensaje: "enviado" });
                            })
                            .catch(function (error) {
                                res.status(500).json({
                                    status: false,
                                    mensaje: "error al obtener informacion",
                                });
                                console.log(error);
                            });
                    } catch (error) {
                        console.log(error);
                        res.status(500).json({
                            status: false,
                            mensaje: "error al obtener informacion",
                        });
                    }
                } else {
                    res.status(500).json({
                        status: false,
                        mensaje: "error al obtener informacion",
                    });
                }
            } else {
                res.status(500).json({
                    status: false,
                    mensaje: "error al obtener informacion",
                });
            }
        }
    } else {
        res.sendStatus(403)
    }
};
messagesController.postSendImage = async (req, res) => {

    const baererHeader = req.headers.authorization;
    if (typeof baererHeader !== 'undefined') {
        const baererToken = baererHeader.split(" ")[1]
        req.token = baererToken;
        const permission = await permissionJWTVerify(baererToken)
        if (permission.flag == false) {
            res.sendStatus(403)
        } else {
            let form = new formidable.IncomingForm();
            form.keepExtensions = true;
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(400).json({
                        status: false,
                        error: "Media could not be uploaded",
                    });
                }
                if (!files.file) {
                    return res.status(400).json({
                        status: false,
                        error: "Media File is required",
                    });
                }
                let isFileValidSize = validateMediaSize(files.file.size, files.file.mimetype);
                if (!isFileValidSize) {
                    return res.status(400).json({
                        status: false,
                        error: `Media File size should be less than ${mediaLimits(
                            files.file.mimetype
                        )}`,
                    });
                }
                request.post(
                    {
                        url: `https://graph.facebook.com/v13.0/112456731683954/media`,
                        formData: {
                            file: {
                                value: fs.createReadStream(files.file.filepath),
                                options: {
                                    filename: files.file.originalFilename,
                                    contentType: files.file.mimetype,
                                },
                            },
                            type: files.file.mimetype,
                            messaging_product: "whatsapp",
                        },
                        headers: {
                            Authorization: `Bearer ` + permission.user.user.messageToken,
                            "content-type": "multipart/form-data",
                        },
                    },
                    async function (err, resp, body) {
                        if (err) {
                            console.log("Error!");
                        } else {
                            const idNumber = await getPhoneNumberWhitID(req.query.from, permission.user.user.bussinesAccountId, permission.user.user.messageToken)

                            const bodyAux = JSON.parse(body)
                            const fileTypeAux = fileType(files.file.mimetype)
                            if (idNumber.exist == true) {
                                try {
                                    const jsonAux = {
                                        "messaging_product": "whatsapp",
                                        "recipient_type": "individual",
                                        "to": req.query.to,
                                        "type": fileTypeAux[0]
                                    }
                                    if (fileTypeAux[0] == "IMAGE" || fileTypeAux[0] == "VIDEO") {
                                        jsonAux[fileTypeAux[1]] = {
                                            "id": bodyAux.id
                                        }
                                    } else {
                                        jsonAux[fileTypeAux[1]] = {
                                            "id": bodyAux.id,
                                            "filename": files.file.originalFilename,
                                        }
                                    }
                                    var data = JSON.stringify(jsonAux);
                                    var config = {
                                        method: 'post',
                                        url: urlMeta.url + idNumber.id + '/messages',
                                        headers: {
                                            'Authorization': 'Bearer ' + permission.user.user.messageToken,
                                            'Content-Type': 'application/json'
                                        },
                                        data: data
                                    };
                                    axios(config)
                                        .then(async function (response) {
                                            await phone.findOneAndUpdate({ phoneNumber: req.body.from }, { $inc: { 'messages': 1 } });
                                            const textMessage = "Image" + "name: " + files.file.originalFilename
                                            const newMessage = new message({
                                                message: textMessage,
                                                from: req.query.from,
                                                to: req.query.to,
                                                whatsappBussinessId: permission.user.user.bussinesAccountId,
                                                tiendaId: permission.user.user.tiendaId
                                            })
                                            await newMessage.save()
                                            res.status(200).json({ status: true, mensaje: "enviado" });

                                        })
                                        .catch(function (error) {
                                            res.status(500).json({
                                                status: false,
                                                mensaje: "error al obtener informacion",
                                            });
                                            console.log(error);
                                        });
                                } catch (error) {
                                    console.log(error);
                                    res.status(500).json({
                                        status: false,
                                        mensaje: "error al obtener informacion",
                                    });
                                }
                            } else {
                                res.status(500).json({
                                    status: false,
                                    mensaje: "error al obtener informacion",
                                });
                            }


                        }
                    }
                );
            });
        }
    }

};

messagesController.postSendImageURL = async (req, res) => {
    const baererHeader = req.headers.authorization;
    if (typeof baererHeader !== 'undefined') {
        const baererToken = baererHeader.split(" ")[1]
        req.token = baererToken;
        const permission = await permissionJWTVerify(baererToken)
        if (permission.flag == false) {
            res.sendStatus(403)
        } else {
            if (req.body.to && req.body.from && req.body.url) {
                const idNumber = await getPhoneNumberWhitID(req.body.from, permission.user.user.bussinesAccountId, permission.user.user.messageToken)
                if (idNumber.exist == true) {
                    try {
                        var data = JSON.stringify({
                            "messaging_product": "whatsapp",
                            "recipient_type": "individual",
                            "to": req.body.to,
                            "type": "image",
                            "image": {
                                "link": req.body.url
                            }
                        });

                        var config = {
                            method: 'post',
                            url: urlMeta.url + idNumber.id + '/messages',
                            headers: {
                                'Authorization': 'Bearer ' + permission.user.user.messageToken,
                                'Content-Type': 'application/json'
                            },
                            data: data
                        };
                        axios(config)
                            .then(async function (response) {
                                await phone.findOneAndUpdate({ phoneNumber: req.body.from }, { $inc: { 'messages': 1 } });
                                const textMessage = "Image" + "Link: " + req.body.url
                                const newMessage = new message({
                                    message: textMessage,
                                    from: req.body.from,
                                    to: req.body.to,
                                    whatsappBussinessId: permission.user.user.bussinesAccountId,
                                    tiendaId: permission.user.user.tiendaId
                                })
                                await newMessage.save()
                                res.status(200).json({ status: true, mensaje: "enviado" });
                            })
                            .catch(function (error) {
                                res.status(500).json({
                                    status: false,
                                    mensaje: "error al obtener informacion",
                                });
                                console.log(error);
                            });
                    } catch (error) {
                        console.log(error);
                        res.status(500).json({
                            status: false,
                            mensaje: "error al obtener informacion",
                        });
                    }
                } else {
                    res.status(500).json({
                        status: false,
                        mensaje: "error al obtener informacion",
                    });
                }
            } else {
                res.status(500).json({
                    status: false,
                    mensaje: "error al obtener informacion",
                });
            }
        }
    } else {
        res.sendStatus(403)
    }
};
export default messagesController;