import Router from "express";
import phonesController from "../controllers/phones.controllers.js";

import { JWTFlag } from "../config.js";
const router = Router();


if (JWTFlag.JWTFlag === true) {
    router.route('/phones')
        .post(phonesController.postCreatePhoneJWT)
    router.route('/getphones')
        .post(phonesController.getPhonesJWT)
    router.route('/phonehits')
        .post(phonesController.getPhoneHitsJWT)
    router.route('/phone')
        .post(phonesController.postUpdatePhoneJWT)
    router.route('/delphone')
        .post(phonesController.deletePhoneJWT)
} else {
    router.route('/phones')
        .post(phonesController.postCreatePhone)
    router.route('/getphones')
        .post(phonesController.getPhones)
    router.route('/phonehits')
        .post(phonesController.getPhoneHits)
    router.route('/phone')
        .post(phonesController.postUpdatePhone)
    router.route('/delphone')
        .post(phonesController.deletePhone)
}

export default router