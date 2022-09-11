import { request } from "../helper/database.js"
export default async function(req, reply){
    if(!req.query.id) return reply.code(400).send({
        message: "Missing required parameter", 
        required: "id",
        query: req.query
    })

    let status = await request(`SELECT current_status FROM users_stats WHERE id = ${req.query.id}`)

    if(status.length < 1) return reply.code(400).send({
        message: "User not found", 
        query: req.query
    })

    if(status[0].current_status.startsWith("on")) status[0].current_status = "Idle " + status[0].current_status
    else if(status[0].current_status == "") status[0].current_status = "Idle"
    return { status: status[0].current_status }
}