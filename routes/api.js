import performance from "./performance.js"
import status from "./status.js"
import online from "./online.js"
import stats from "./stats.js"

export default async function(fastify, opts){
    fastify.get('/', async (req, reply) =>{
        return {
            message: "Jasper the entirely public JavaScript API for osu!Horizon",
            version: "2.0.0",
            route : "v2"
        }
    })

    fastify.get('/performance', performance)
    fastify.get('/status', status)
    fastify.get('/online', online)
    fastify.get('/stats', stats)
}