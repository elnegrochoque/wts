import Router from "express";
import contactController from "../controllers/contact.controllers.js";
import { OwnJWT } from "../config.js";
const router = Router();
if (OwnJWT.Flag === true) {
    router.route('/contacts')
        .get(contactController.getContactsJWT)
        .post(contactController.postCreateContactJWT)
    router.route('/contacts/:id')
        .put(contactController.putContactByIdJWT)
        .delete(contactController.deleteContactByIdJWT)
        .get(contactController.getContactByIdJWT)

}
else {
    router.route('/contacts')
        .get(contactController.getContactsAll)
        .post(contactController.postCreateContact)
    router.route('/contacts/:id')
        .put(contactController.putContactById)
        .delete(contactController.deleteContactById)
}

export default router