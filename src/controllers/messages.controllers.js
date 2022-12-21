
import message from "../models/messages.models.js";
import {  urlMeta  } from "../config.js";
import axios from "axios";
import { permissionJWTVerify } from "./jwt.controllers.js";
import { JWTFlag } from "../config.js";

const messagesController = {};
function unixTimestamp() {
    return Math.floor(
        Date.now() / 1000
    )
}


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
        const permission = await permissionJWTVerify(baererToken, JWTFlag.permissionNameEdit)
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
                        if (req.query.from) {
                            const messageCount = await message.count({ from: req.query.from });
                            const result = []
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                            const messages = await message.find({ from: req.query.from }).skip((elements * page) - elements).limit(elements);
                            result.push({ messages: messages })
                            res.status(200).json(result);
                        }
                        if (req.query.to) {
                            const messageCount = await message.count({ to: req.query.to });
                            const result = []
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                            const messages = await message.find({ to: req.query.to }).skip((elements * page) - elements).limit(elements);
                            result.push({ messages: messages })
                            res.status(200).json(result);
                        }
                        if (req.query.all == "true") {
                            const messageCount = await message.count();
                            const result = []
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                            const messages = await message.find().skip((elements * page) - elements).limit(elements);
                            result.push({ messages: messages })
                            res.status(200).json(result);
                        }
                    } else {
                        res.status(500).json({
                            mensaje: "error al obtener informacion",
                        });
                    }
                } else {
                    if (req.query.page) {
                        const page = req.query.page
                        if (req.query.from) {
                            const messageCount = await message.count({ from: req.query.from, whatsappBussinessId: permission.user.user.bussinesAccountId });
                            const result = []
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                            const messages = await message.find({ from: req.query.from, whatsappBussinessId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                            result.push({ messages: messages })
                            res.status(200).json(result);
                        }
                        if (req.query.to) {
                            const messageCount = await message.count({ to: req.query.to, whatsappBussinessId: permission.user.user.bussinesAccountId });
                            const result = []
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                            const messages = await message.find({ to: req.query.to, whatsappBussinessId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                            result.push({ messages: messages })
                            res.status(200).json(result);
                        }
                        if (req.query.all == "true") {
                            const messageCount = await message.count({ whatsappBussinessId: permission.user.user.bussinesAccountId });
                            const result = []
                            result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                            const messages = await message.find({ whatsappBussinessId: permission.user.user.bussinesAccountId }).skip((elements * page) - elements).limit(elements);
                            result.push({ messages: messages })
                            res.status(200).json(result);
                        }
                    } else {
                        res.status(500).json({
                            mensaje: "error al obtener informacion",
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
                result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                const messages = await message.find({ from: req.query.from }).skip((elements * page) - elements).limit(elements);
                result.push({ messages: messages })
                res.status(200).json(result);
            }
            if (req.query.to) {
                const messageCount = await message.count({ to: req.query.to });
                const result = []
                result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                const messages = await message.find({ to: req.query.to }).skip((elements * page) - elements).limit(elements);
                result.push({ messages: messages })
                res.status(200).json(result);
            }
            if (req.query.all == "true") {
                const messageCount = await message.count();
                const result = []
                result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                const messages = await message.find().skip((elements * page) - elements).limit(elements);
                result.push({ messages: messages })
                res.status(200).json(result);
            }
        } else {
            res.status(500).json({
                mensaje: "error al obtener informacion",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "error al obtener informacion",
        });
    }
};

messagesController.postTextMessageJWT = async (req, res) => {
    const baererHeader = req.headers.authorization;
    if (typeof baererHeader !== 'undefined') {
        const baererToken = baererHeader.split(" ")[1]
        req.token = baererToken;
        const permission = await permissionJWTVerify(baererToken, JWTFlag.permissionNameEdit)
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
                            .then(function (response) {
                                res.status(200).json({ mensaje: "enviado" });
                            })
                            .catch(function (error) {
                                res.status(500).json({
                                    mensaje: "error al obtener informacion",
                                });
                                console.log(error);
                            });
                    } catch (error) {
                        console.log(error);
                        res.status(500).json({
                            mensaje: "error al obtener informacion",
                        });
                    }
                } else {
                    res.status(500).json({
                        mensaje: "error al obtener informacion",
                    });
                }
            } else {
                res.status(500).json({
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
                    .then(function (response) {
                        res.status(200).json({ mensaje: "enviado" });
                    })
                    .catch(function (error) {
                        res.status(500).json({
                            mensaje: "error al obtener informacion",
                        });
                        console.log(error);
                    });
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    mensaje: "error al obtener informacion",
                });
            }
        } else {
            res.status(500).json({
                mensaje: "error al obtener informacion",
            });
        }
    } else {
        res.status(500).json({
            mensaje: "error al obtener informacion",
        });
    }

};

messagesController.postLocationMessageJWT = async (req, res) => {
    const baererHeader = req.headers.authorization;
    if (typeof baererHeader !== 'undefined') {
        const baererToken = baererHeader.split(" ")[1]
        req.token = baererToken;
        const permission = await permissionJWTVerify(baererToken, JWTFlag.permissionNameEdit)
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
                            .then(function (response) {
                                res.status(200).json({ mensaje: "enviado" });
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    } catch (error) {
                        console.log(error);
                        res.status(500).json({
                            mensaje: "error al obtener informacion",
                        });
                    }
                } else {
                    res.status(500).json({
                        mensaje: "error al obtener informacion",
                    });
                }
            } else {
                res.status(500).json({
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
                    .then(function (response) {
                        res.status(200).json({ mensaje: "enviado" });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    mensaje: "error al obtener informacion",
                });
            }
        } else {
            res.status(500).json({
                mensaje: "error al obtener informacion",
            });
        }
    } else {
        res.status(500).json({
            mensaje: "error al obtener informacion",
        });
    }
};

messagesController.getAccountPhonesJWT = async (req, res) => {
    const baererHeader = req.headers.authorization;
    if (typeof baererHeader !== 'undefined') {
        const baererToken = baererHeader.split(" ")[1]
        req.token = baererToken;
        const permission = await permissionJWTVerify(baererToken, JWTFlag.permissionNameEdit)
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
                        res.status(200).json(response.data.data);
                    })
                    .catch(function (error) {
                        console.log(error);
                        res.status(500).json({
                            mensaje: "error al obtener informacion",
                        });
                    });
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
                    res.status(200).json(response.data.data);
                })
                .catch(function (error) {
                    console.log(error);
                    res.status(500).json({
                        mensaje: "error al obtener informacion",
                    });
                });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: "error al obtener informacion",
        });
    }
}

export default messagesController;