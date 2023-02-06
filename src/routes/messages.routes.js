import Router from "express";
import messagesController from "../controllers/messages.controllers.js";
import { OwnJWT } from "../config.js";
const router = Router();
if (OwnJWT.Flag === true) {
    router.route('/messages')
        .get(messagesController.getMessageJWT)
    router.route('/messages/send/text')
        .post(messagesController.postTextMessageJWT)
    router.route('/messages/send/location')
        .post(messagesController.postLocationMessageJWT)
    router.route('/messages/send/template/issue')
        .post(messagesController.postTemplateIssueJWT)
    router.route('/messages/send/template/thanksforbuy')
        .post(messagesController.postTemplateThanksForBuyJWT)
    router.route('/messages/send/template/helloworld')
        .post(messagesController.postTemplateHelloWorldJWT)
    router.route('/messages/send/image')
        .post(messagesController.postSendImage)
    router.route('/messages/send/imageurl')
        .post(messagesController.postSendImageURL)
    router.route('/messages/accountphones')
        .get(messagesController.getAccountPhonesJWT)
    router.route('/messages/files/:id')
        .get(messagesController.getfiles)
    router.route('/messages/files')
        .get(messagesController.getMessageWhitFilesJWT)

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