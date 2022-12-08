
import message from "../models/messages.models.js";
import jwt from "jsonwebtoken";
import { OwnJWT, whatsappToken } from "../config.js";
import axios from "axios";
import { permissionJWTVerify } from "./jwt.controllers.js";
import { JWTFlag } from "../config.js";

const messagesController = {};
function unixTimestamp() {
    return Math.floor(
        Date.now() / 1000
    )
}


const getPhoneNumberWhitID = async (phoneNumber) => {
    let phone = {
        exist: false,
        id: 0
    }
    try {
        var config = {
            method: 'get',
            url: 'https://graph.facebook.com/v15.0/' + whatsappToken.bussinesAccountId + '/phone_numbers',
            headers: {
                'Authorization': 'Bearer ' + whatsappToken.messageToken
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
        if (permission == false) {
            res.sendStatus(403)
        } else {
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
                        const messageCount = await message.count({ from: req.query.to });
                        const result = []
                        result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                        const messages = await message.find({ from: req.query.to }).skip((elements * page) - elements).limit(elements);
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
                const messageCount = await message.count({ from: req.query.to });
                const result = []
                result.push({ pagination: { "page": page, "maxObjectsPerPage": parseInt(elements), "totalObjects": messageCount } })
                const messages = await message.find({ from: req.query.to }).skip((elements * page) - elements).limit(elements);
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
        if (permission == false) {
            res.sendStatus(403)
        } else {
            if (req.body.to && req.body.text && req.body.from) {
                const idNumber = await getPhoneNumberWhitID(req.body.from)
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
                            url: 'https://graph.facebook.com/v15.0/' + idNumber.id + '/messages',
                            headers: {
                                'Authorization': 'Bearer ' + whatsappToken.messageToken,
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
    if (req.body.to && req.body.text && req.body.from) {
        const idNumber = await getPhoneNumberWhitID(req.body.from)
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
                    url: 'https://graph.facebook.com/v15.0/' + idNumber.id + '/messages',
                    headers: {
                        'Authorization': 'Bearer ' + whatsappToken.messageToken,
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
        if (permission == false) {
            res.sendStatus(403)
        } else {
            if (req.body.from && req.body.to && req.body.longitude && req.body.latitude && req.body.name && req.body.address) {
                const idNumber = await getPhoneNumberWhitID(req.body.from)
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
                            url: 'https://graph.facebook.com/v15.0/' + idNumber.id + '/messages',
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
        }
    } else {
        res.sendStatus(403)
    }
};

messagesController.postLocationMessage = async (req, res) => {
    if (req.body.to && req.body.longitude && req.body.latitude && req.body.name && req.body.adress) {
        const idNumber = await getPhoneNumberWhitID(req.body.from)
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
                    url: 'https://graph.facebook.com/v15.0/'+idNumber.id+'/messages',
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
        if (permission == false) {
            res.sendStatus(403)
        } else {
            try {
                var config = {
                    method: 'get',
                    url: 'https://graph.facebook.com/v15.0/' + whatsappToken.bussinesAccountId + '/phone_numbers',
                    headers: {
                        'Authorization': 'Bearer ' + whatsappToken.messageToken
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
        var config = {
            method: 'get',
            url: 'https://graph.facebook.com/v15.0/' + whatsappToken.bussinesAccountId + '/phone_numbers',
            headers: {
                'Authorization': 'Bearer ' + whatsappToken.messageToken
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

export default messagesController;