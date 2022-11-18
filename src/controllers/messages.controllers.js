
import message from "../models/messages.models.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { urlJWT } from "../config.js";
const messagesController = {};


messagesController.postMessage = async (req, res) => {
    let url = "https://security.viajobien.com/auth/token";
    let data = { id: "lucas.matw", password: "ec03bien" };
    try {
        if (req.body.object) {
            if (
                req.body.entry &&
                req.body.entry[0].changes &&
                req.body.entry[0].changes[0] &&
                req.body.entry[0].changes[0].value.messages &&
                req.body.entry[0].changes[0].value.messages[0]
            ) {
                const newMessage = new message({
                    message: req.body.entry[0].changes[0].value.messages[0].text.body,
                    from: req.body.entry[0].changes[0].value.messages[0].from,
                    to: req.body.entry[0].changes[0].value.metadata.display_phone_number
                })
                await newMessage.save()
                res.status(200).json({
                    mensaje: "mensaje guardado",
                });
            }
        }
    } catch (error) {
        console.log(error)
    }
    // const baererHeader = req.headers.authorization;
    // if (typeof baererHeader !== 'undefined') {
    //     const baererToken = baererHeader.split(" ")[1]
    //     req.token = baererToken;
    //     jwt.verify(req.token, 'secretkey', async (error, authData) => {
    //         if (error) {
    //             res.sendStatus(403)
    //         } else {
    //             try {
    //                 const events = await sensorEvent.find();
    //                 res.status(200).json(authData);
    //             } catch (error) {
    //                 console.log(error);
    //                 res.status(500).json({
    //                     mensaje: "error al obtener informacion",
    //                 });
    //             }
    //         }
    //     })
    // } else {
    //     res.sendStatus(403)
    // }
};
const permissionJWT = async (data) => {
    let url = urlJWT;
   
    try {
        const consulta = await axios.post(url, data)
        console.log(consulta.data.token)
        var decoded = jwt_decode(consulta.data.token);
        console.log(decoded.permissions)
        const permissions = decoded.permissions.slice(11, -3)
        const arrayPermissions = permissions.split("\"},{\"value\":\"")
        console.log(arrayPermissions)
        for (let i = 0; i < arrayPermissions.length; i++) {
            if (arrayPermissions[i] == "users") {
                console.log("tiene permisos")
                break
            }
        }
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

messagesController.getMessage = async (req, res) => {
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

export default messagesController;