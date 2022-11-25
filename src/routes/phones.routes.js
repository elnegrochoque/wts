import Router from "express";
import phonesController from "../controllers/phones.controllers.js";

import { JWTFlag } from "../config.js";
const router = Router();


if (JWTFlag.JWTFlag === true) {
    router.route('/phones')
        .post(phonesController.postCreatePhoneJWT)
        .get(phonesController.getPhonesJWT)
        .delete(phonesController.deletePhoneJWT)
        .put(phonesController.putPhoneJWT)
    router.route('/phones/:id')
        .get(phonesController.getPhoneJWT)
        .put(phonesController.putPhoneByIdJWT)
    router.route('/phoneshits')
        .get(phonesController.getPhoneHitsJWT)



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