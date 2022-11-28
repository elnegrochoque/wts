import request from "request";
import express from "express";
import morgan from "morgan";
import "./database.js";
import "./controllers/webhook.controllers.js"
import cors from "cors";
import message from "./models/messages.models.js";
import messagesRoutes from "./routes/messages.routes.js"
import phonesRoutes from "./routes/phones.routes.js"
import jwtRoutes from "./routes/jwt.routes.js"
import { PORT, whatsappToken } from "./config.js";
const app = express();
app.listen( PORT.PORT , () => console.log("webhook is listening"));
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());


app.use("/api", messagesRoutes);
app.use("/api", phonesRoutes);
app.use("/api", jwtRoutes)