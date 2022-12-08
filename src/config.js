export const mongoConf = {
    url: "mongodb://elnegrochoque:elnegrochoque_11@cluster0-shard-00-00.yy3fo.mongodb.net:27017,cluster0-shard-00-01.yy3fo.mongodb.net:27017,cluster0-shard-00-02.yy3fo.mongodb.net:27017/test?replicaSet=atlas-zjhyyk-shard-0&ssl=true&authSource=admin",
    dbName: "apiwhatsapp"
}
export const whatsappToken = {
    token: "prueba1234",
    messageToken:"EAAOTTeeRA1IBAP3ef65R8T1CzIhnBZBZBK3ys7o17Wis8flDxmCCYBZBc5VPmBiwtHkKXH0ajC1Vu8nsy1PYZCHRqeWtWvgVPY6kK5HRgoWrtmllvN6UDwefy7ZBTrdLr9IZCUMRBNiOCatedqp9rHZAx5U0tUD9V0kECBdrZApOzw2QZCyXSKSzk",
    bussinesAccountId:"104140005848532"
}

export const PORT = {
    PORT: 4000
}
export const JWTFlag = {
    JWTFlag: false,
    permissionNameView: "whatsapp.view",
    permissionNameEdit: "whatsapp.edit",
    jwtKeyFileName: "jwt-key"
}
export const OwnJWT = {
    Flag: true,
    user: "admin",
    password: "admin",
    jwtkey: "jwt-key",
    expires: "1h"
}
