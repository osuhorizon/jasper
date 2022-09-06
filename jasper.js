import Logger from "cutesy.js"
import { fastify as f } from "fastify"
import { connect } from "./helper/database.js"
import api from "./routes/api.js"
import cron from "./cron/cron.js"
import { port } from "./config.js"

const fastify = f({trustProxy: true })
const logger = new Logger().addTimestamp("hh:mm:ss").green()
.send("Starting Jasper v2")

await connect()
cron()

fastify.addHook('onResponse', async (req, reply) => {
    logger.send(`${req.ips[req.ips.length - 1]} -> ${req.url} (${reply.statusCode}) - ${reply.getResponseTime().toFixed(2)}ms`)
})

fastify.register(api, { prefix: '/api/v2' })

// app.get(base + "scores/recent", async (req, res) => {

//   const { mods, rank } = require('./helper/osu.js')

//   if(!req.query.id) return res.json({code: 400, message: "Missing required parameter", required: "id", optional: "mode, rx, limit, completed", mode: "0-3", rx: "0-3", limit: "1-50", completed: "0-3"});
//   req.query.mode = req.query.m ? req.query.m : req.query.mode
//   const mode = req.query.mode && req.query.mode < 4 ? req.query.mode : 0
//   const rx = req.query.rx && req.query.rx < 3 ? req.query.rx : 0
//   const limit = req.query.limit && req.query.limit < 51 ? req.query.limit : 50
//   const completed = req.query.completed && req.query.completed < 4 ? req.query.completed : 0

//   const relax = ['', '_relax', '_ap']
//   const modes = ["std", "taiko", "ctb", "mania"]

//   const scores = await request(`SELECT s.id, s.beatmap_md5, s.score, s.max_combo, s.full_combo, s.mods, s.300_count, s.100_count, s.50_count, 
//   s.gekis_count, s.katus_count, s.misses_count, s.time, s.play_mode, s.accuracy, s.pp, s.completed, b.beatmap_id, b.beatmapset_id, b.beatmap_md5, 
//   b.difficulty_std, b.difficulty_taiko, b.difficulty_ctb, b.difficulty_mania, b.song_name, b.ar, b.od, b.max_combo bmax_combo, b.hit_length, b.ranked, 
//   b.ranked_status_freezed, b.latest_update FROM scores${relax[rx]} s JOIN beatmaps b ON s.beatmap_md5 = b.beatmap_md5 
//   WHERE s.userid = ${req.query.id} AND s.play_mode = ${mode} AND s.completed >= ${completed} ORDER BY s.id DESC LIMIT ${limit}`)

//   const data = [];

//   for(var i = 0; i < scores.length; i++){
//     score = scores[i]

//     const mod = await mods(score.mods)
//     const ranks = await rank(mode, mod, score.accuracy, score[`300_count`], score[`100_count`], score[`50_count`],
//     score.gekis_count, score.katus_count, score.misses_count)

//     const difficulties = {
//       std: score.difficulty_std.toFixed(2),
//       taiko: score.difficulty_taiko.toFixed(2),
//       ctb: score.difficulty_ctb.toFixed(2),
//       mania: score.difficulty_mania.toFixed(2)
//     }

//     const beatmap = {
//       beatmap_id: score.beatmap_id,
//       beatmapset_id: score.beatmapset_id,
//       beatmap_md5: score.beatmap_md5,
//       song_name: score.song_name,
//       ar: score.ar,
//       od: score.od,
//       difficulty: score[`difficulty_${modes[mode]}`].toFixed(2),
//       difficulties : difficulties,
//       max_combo: score.max_combo,
//       hit_length: score.hit_length,
//       ranked: score.ranked,
//       ranked_status_frozen: score.ranked_status_freezed,
//       latest_update: score.latest_update
//     }

//     data.push({
//       id: score.id,
//       beatmap_md5: score.beatmap_md5,
//       score: score.score,
//       max_combo: score.max_combo,
//       full_combo: score.full_combo,
//       mods: {
//         mods: score.mods,
//         name: mod.string,
//       },
//       "count_300": score["300_count"],
//       "count_100": score["100_count"],
//       "count_50": score["50_count"],
//       count_geki: score.gekis_count,
//       count_katu: score.katus_count,
//       count_miss: score.misses_count,
//       time: score.time,
//       play_mode: score.play_mode,
//       accuracy: score.accuracy.toFixed(2),
//       pp: score.pp.toFixed(2),
//       rank: ranks,
//       completed: score.completed,
//       beatmap: beatmap
//     })
//   }

//   res.json({code: 200, scores: data});
// })

await fastify.listen({ port })
logger.send(`Jasper listening at http://localhost:${port}`)