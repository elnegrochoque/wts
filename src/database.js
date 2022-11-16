import mongoose from "mongoose";
import { mongoConf } from "./config";

const url = mongoConf.url

try {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, dbName: mongoConf.dbName })
} catch (error) {
    console.log(error)

}
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('BD conectada')
})