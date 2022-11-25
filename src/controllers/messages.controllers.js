
import message from "../models/messages.models.js";
import jwt from "jsonwebtoken";


const messagesController = {};
function unixTimestamp() {
    return Math.floor(
        Date.now() / 1000
    )
}



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