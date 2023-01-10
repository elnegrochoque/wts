
import { OwnJWT } from "../config.js";
import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
const authJWT = {};

export const permissionJWTVerify = async (token) => {
    let flagPermission = { "flag": false, "user": null }
    try {
        if (OwnJWT.Flag === true) {
            jwt.verify(token, OwnJWT.jwtkey, async (error, authData) => {
                try {
                    const decoded = jwt_decode(token);
                    if (error) {
                        console.log(error)
                    } else {
                        flagPermission = { "flag": true, "user": decoded }
                    }
                } catch (error) {
                    console.log(error)
                }

            })
        } 

        return flagPermission
    } catch (error) {
        console.log(error)

    }
}


export default authJWT;