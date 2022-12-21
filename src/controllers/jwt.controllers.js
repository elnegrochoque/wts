import fs from "fs"
import { JWTFlag, OwnJWT } from "../config.js";
import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import user from "../models/users.models.js";
const authJWT = {};

export const permissionJWTVerify = async (token, permission) => {
    let flagPermission = { "flag": false, "user": null }
    try {
        if (JWTFlag.JWTFlag === false && OwnJWT.Flag === true) {
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
        } else {
            const publicKey = fs.readFileSync('./src/' + JWTFlag.jwtKeyFileName)
            jwt.verify(token, publicKey, { algorithms: 'RS256' }, async (error, authData) => {
                if (error) {
                    console.log(error)
                } else {
                    var decoded = jwt_decode(token);
                    const permissions = decoded.permissions.slice(11, -3)
                    const arrayPermissions = permissions.split("\"},{\"value\":\"")
                    for (let i = 0; i < arrayPermissions.length; i++) {
                        if (arrayPermissions[i] == permission) {
                            flagPermission = true
                            break
                        }
                    }
                }
            })
        }

        return flagPermission
    } catch (error) {
        console.log(error)

    }
}
authJWT.signJWT = async (req, res) => {
    try {
        const userName = req.body.user
        const password = req.body.password
        const userFind = await user.findOne({ user: userName, password: password })
        if (userFind !== null) {
            console.log("hola")
            jwt.sign({ user: userFind }, OwnJWT.jwtkey, { expiresIn: OwnJWT.expires }, (err, token) => {
                res.json({ token })
            })
        } else {
            res.sendStatus(403)
        }
    } catch (error) {
        console.log(error)
    }
}



export default authJWT;