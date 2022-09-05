import { request } from "../helper/database.js"
export default async function(req, reply){
    const users = await request(`SELECT id, username FROM users_stats WHERE id > 999 AND current_status != "Offline"`)
    return { users }
}