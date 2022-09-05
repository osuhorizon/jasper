import Logger from "cutesy.js"
import mysql from "mysql-await"
import red from "async-redis"
import { db } from "../config.js"

const con = mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
})

const redis = red.createClient({
    port: 6379,
    host: "localhost"
})

export async function connect(){
    await con.connect()
}

export async function request(query){
    new Logger().addTimestamp("hh:mm:ss").changeTag("Database").yellow()
    .send(`Database: ${query}`)

    return await con.awaitQuery(query)
}