import performance from "./performance.js"

export default async function(fastify, opts){
    fastify.get('/', async (req, reply) =>{
        return {
            message: "Jasper the entirely public JavaScript API for osu!Horizon",
            version: "1.0.0",
            route : "v2"
        }
    })

    fastify.get('/performance', performance)
}