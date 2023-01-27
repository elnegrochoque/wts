import Router from "express";
import phonesController from "../controllers/phones.controllers.js";

import { OwnJWT } from "../config.js";
const router = Router();


if (OwnJWT.Flag === true) {
    router.route('/phones')
        .post(phonesController.postCreatePhoneJWT)
        .get(phonesController.getPhonesJWT)
    router.route('/phones/:id')
        .delete(phonesController.deletePhoneByIdJWT)
        .get(phonesController.getPhoneJWT)
        .put(phonesController.putPhoneByIdJWT)
    router.route('/phoneshits')
        .get(phonesController.getPhoneHits)

    router.route('/summessages')
        .get(phonesController.getSumPhoneMessageJWT)


} else {
    router.route('/phones')
        .post(phonesController.postCreatePhone)
        .get(phonesController.getPhones)
        .delete(phonesController.deletePhone)
        .put(phonesController.putPhone)
    router.route('/phones/:id')
        .get(phonesController.getPhone)
        .put(phonesController.putPhoneById)
        .delete(phonesController.deletePhoneById)
    router.route('/phoneshits')
        .get(phonesController.getPhoneHits)

}

export default router