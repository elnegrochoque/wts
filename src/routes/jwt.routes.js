import Router from "express";

import { JWTFlag, OwnJWT } from "../config.js";
import authJWT from "../controllers/jwt.controllers.js";
const router = Router();


if (OwnJWT.Flag === true && JWTFlag.JWTFlag === false) {
    router.route('/token')
        .post(authJWT.signJWT)
} 
export default router