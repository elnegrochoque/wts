import request from "request";
import express from "express";
import morgan from "morgan";
import "./database";
import "./controllers/webhook.controllers.js"
import cors from "cors";
import message from "./models/messages.models.js";
import messagesRoutes from "./routes/messages.routes.js"
import { PORT, whatsappToken } from "./config";
const app = express();
app.listen( PORT.PORT , () => console.log("webhook is listening"));
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());


app.post("/webhook", async (req, res) => {

    console.log("json", JSON.stringify(req.body, null, 2));
    if (req.body.object) {
        if (
            req.body.entry &&
            req.body.entry[0].changes &&
            req.body.entry[0].changes[0] &&
            req.body.entry[0].changes[0].value.messages &&
            req.body.entry[0].changes[0].value.messages[0]
        ) {
            console.log("escribieron")
            //console.log(req.body.entry[0].changes[0].value.messages[0].text.body)
            //console.log(req.body.entry[0].changes[0].value.messages[0].from)
            //console.log(req.body.entry[0].changes[0].value.metadata.display_phone_number)
            try {
                const newMessage = new message({
                    message: req.body.entry[0].changes[0].value.messages[0].text.body,
                    from: req.body.entry[0].changes[0].value.messages[0].from,
                    to: req.body.entry[0].changes[0].value.metadata.display_phone_number
                })
                await newMessage.save()
            } catch (error) {
                console.log(error)
            }
            //console.log(req.body.entry[0].changes[0].value.messages[0])
            //console.log(req.body.entry[0].changes[0].value.messages[0].text.body)
            //let phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
            //let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
            //let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
        }
        res.sendStatus(200);
    } else {
        // Return a '404 Not Found' if event is not from a WhatsApp API
        res.sendStatus(404);
    }
});
app.get("/webhook", (req, res) => {
    const verify_token = whatsappToken.token;
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    if (mode && token) {
        if (mode === "subscribe" && token === verify_token) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});  

app.use("/api", messagesRoutes);