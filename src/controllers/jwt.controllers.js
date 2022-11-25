export const permissionJWTVerify = async (token, permission) => {
    let flagPermission = false
    try {
        const publicKey = fs.readFileSync('./src/'+JWTFlag.jwtKeyFileName)
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
        return flagPermission
    } catch (error) {
        console.log(error)

    }
}
