import Router from "express";
import phonesController from "../controllers/phones.controllers.js";

import { JWTFlag } from "../config.js";
const router = Router();


if (JWTFlag.JWTFlag === true) {
    router.route('/phones')
        .post(phonesController.postCreatePhoneJWT)
        .get(phonesController.getPhonesJWT)
        .delete(phonesController.deletePhoneJWT)
        .put(phonesController.postUpdatePhoneJWT)
    router.route('/phones/:id')
        .get(phonesController.getPhoneJWT)
    router.route('/phones/hits')
        .get(phonesController.getPhoneHitsJWT)



} else {
    router.route('/phones')
        .post(phonesController.postCreatePhone)
        .get(phonesController.getPhones)
        .delete(phonesController.deletePhone)
        .put(phonesController.postUpdatePhone)
    router.route('/phones/:id')
        .get(phonesController.getPhone)
    router.route('/phones/hits')
        .get(phonesController.getPhoneHits)
        
}

export default router