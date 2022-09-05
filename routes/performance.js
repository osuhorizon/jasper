import { request } from "../helper/database.js"
export default async function(req, reply){
    if(!req.query.id) return reply.code(400).send({
        message: "Missing required parameter",
        required: "id",
        optional: "mode, rx",
        query: req.query
    });

    req.query.mode = req.query.m ? req.query.m : req.query.mode
    const mode = req.query.mode && req.query.mode < 4 ? req.query.mode : 0
    const rx = req.query.rx && req.query.rx < 4 ? req.query.rx : 0
    const limit = req.query.limit && req.query.limit < 32 ? req.query.limit : 7

    const result = await request(`SELECT global from ranks WHERE user = ${req.query.id} AND mode = ${mode} AND rx = ${rx}`)
    if(result.length < 1) return reply.code(404).send({
        message: "No data found",
        query: req.query
    })

    const ranks = []

    const ranking = result.global.split(",")
    for(var i = 0; i < limit; i++){
        ranks.push(ranking[i])
    }

    return {
        ranks
    }
}