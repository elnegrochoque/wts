import Router from "express";
import messagesController from "../controllers/messages.controllers.js";

const router = Router();

router.route('/messages')
    .post(messagesController.postMessage)
    .get(messagesController.getMessage)
export default router