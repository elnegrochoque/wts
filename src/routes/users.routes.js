import Router from "express";
import userControllers from "../controllers/users.controllers.js";

import { JWTFlag, OwnJWT } from "../config.js";
const router = Router();

if (JWTFlag.JWTFlag === true || OwnJWT.Flag === true) {
    router.route('/users')
        .post(userControllers.postCreateUser)
        .get(userControllers.getUsersAll)

    router.route('/users/:id')
        .put(userControllers.putUser)
        .delete(userControllers.deleteUserById)
}

export default router