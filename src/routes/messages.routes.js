import Router from "express";
import messagesController from "../controllers/messages.controllers.js";
import { JWTFlag, OwnJWT } from "../config.js";
const router = Router();
if (JWTFlag.JWTFlag === true || OwnJWT.Flag === true) {
    router.route('/messages')
        .get(messagesController.getMessageJWT)
    router.route('/messages/send/text')
        .post(messagesController.postTextMessageJWT)
    router.route('/messages/send/location')
        .post(messagesController.postLocationMessageJWT)
    router.route('/messages/accountphones')
        .get(messagesController.getAccountPhonesJWT)

}
else {
    router.route('/messages')
        .get(messagesController.getMessage)
    router.route('/messages/text')
        .post(messagesController.postTextMessage)
    router.route('/messages/location')
        .post(messagesController.postLocationMessage)
    router.route('/messages/accountphones')
        .get(messagesController.getAccountPhones)
}

export default router