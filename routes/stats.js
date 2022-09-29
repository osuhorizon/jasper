import { request } from "../helper/database.js"
export default async function(req, reply){
    const registered = (await request(`SELECT COUNT(*) count FROM users WHERE id > 999 AND privileges & 3`))[0].count
    const active = (await request(`SELECT COUNT(*) count FROM users WHERE privileges & 3 AND latest_activity > ${Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30}`))[0].count
    const online = (await request(`SELECT COUNT(*) count FROM users_stats WHERE id > 999 AND current_status != "Offline"`))[0].count

    return {
        registered,
        active,
        online
    }
}