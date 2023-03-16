
import express from "express";
import morgan from "morgan";
import path from "path";
import "./database.js";
import cors from "cors";
import message from "./models/messages.models.js";
import messagesRoutes from "./routes/messages.routes.js"
import phonesRoutes from "./routes/phones.routes.js"
import { PORT, whatsappToken } from "./config.js";
import phone from "./models/phones.models.js";
import contactsRoutes from "./routes/contacts.routes.js"
import { fileURLToPath } from "url";
import { dirname } from "path";
import fileUpload from "express-fileupload";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.listen(PORT.PORT, () => console.log("webhook is listening"));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir:"/tmp/",
    debug: true
  }));
app.post("/webhook", async (req, res) => {
    if (req && req.body && req.body.object) {
        if (
            req.body.entry &&
            req.body.entry[0].changes &&
            req.body.entry[0].changes[0] &&
            req.body.entry[0].changes[0].value.messages &&
            req.body.entry[0].changes[0].value.messages[0]
        ) {
            try {
                const to = req.body.entry[0].changes[0].value.metadata.display_phone_number
                const phoneAux = await phone.find({phoneNumber: to})
                await phone.findOneAndUpdate({ phoneNumber: to }, { $inc: { 'hits': 1 } });
                const newMessage = new message({
                    message: req.body.entry[0].changes[0].value.messages[0].text.body,
                    from: req.body.entry[0].changes[0].value.messages[0].from,
                    to: to,
                    whatsappBussinessId: req.body.entry[0].id,
                    tiendaId: phoneAux[0].tiendaId
                })
                await newMessage.save()
            } catch (error) {
                console.log(error)
            }
        }
        res.sendStatus(200);
    } else {
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
app.use("/api", phonesRoutes);
app.use("/api", contactsRoutes);
