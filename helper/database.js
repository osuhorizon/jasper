import Logger from "cutesy.js"
import mysql from "mysql-await"
import red from "async-redis"
import { db } from "../config.js"

let redis;
let con;

export async function connect(){
    redis = red.createClient({
        port: 6379,
        host: "localhost"
    })

    con = mysql.createConnection({
        host: db.host,
        user: db.user,
        password: db.password,
        database: db.database
    })

    await con.connect()
}

export async function request(query){
    new Logger().addTimestamp("hh:mm:ss").changeTag("Database").yellow().send(query)
    return await con.awaitQuery(query)
}

export async function get(key){
    return await redis.get(key)
}

export async function zrange(key, start, end, scores){
    if(scores) return await redis.zrange(key, start, end, "WITHSCORES")
    return await redis.zrange(key, start, end)
}