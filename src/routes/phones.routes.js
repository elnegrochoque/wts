import Router from "express";
import phonesController from "../controllers/phones.controllers.js";

const router = Router();

router.route('/phones')
    .post(phonesController.postCreatePhone)
    .get(phonesController.getPhones)
router.route('/phone')
    .get(phonesController.getPhoneHits)
    .post(phonesController.postUpdatePhone)

export default router