import { request, zrange } from "../helper/database.js"
import countries from "../helper/countries.js"

export default async function(){
    const mods = ["", "_relax", "_auto"]
    
    for(let mod in mods) {
        const modes = mod == 0 ?
        ['std', "taiko", "ctb", "mania"] : mod == 1 ?
        ['std', "taiko", "ctb"] :
        ['std', "taiko"]
    
        for(let mode in modes){
            const userboard = await zrange(`ripple:leaderboard${mods[mod]}:${modes[mode]}`, 0, -1, false)
            const scoreboard = await zrange(`ripple:leaderboard${mods[mod]}:${modes[mode]}`, 0, -1, true)
    
            const time = Math.round(Date.now() / 1000)

            async function check(u){
                let list = {
                    insert: false,
                    newCol: false,
                    user: undefined
                }
                const check = await request(`SELECT * FROM ranks WHERE user = ${u} AND mode = ${mode} AND relax = ${mod}`)
        
                if(check.length < 1){
                    list.insert = true
                    return list
                }

                if(check[0].country == 0){
                    list.insert = true
                }
        
                list.newCol = !(parseInt(check[0].time) * 60 * 60 * 24 > time)
                list.user = check[0]
        
                return list
            }

        
            for(var i = 0; i < userboard.length; i++){
                const user = userboard[i]
        
                const pp = Math.floor(scoreboard[(i * 2) + 1])

                const c = await check(user)

                if(c.insert){
                    await request(`INSERT INTO ranks (user, global, country, pp, mode, relax, time) VALUES (${user}, "${i+1}", "0", "${pp}", ${mode}, ${mod}, ${time})`)
                    continue;
                }

                const [ globals, pps ] = [c.user.global.split(","), c.user.pp.split(",")]


                if(!c.newCol){
                    globals.pop()
                    pps.pop()
                }

                globals.push(i+1)
                pps.push(pp)

                await request(`UPDATE ranks SET global = "${globals.join(",")}", pp = "${pps.join(",")}" WHERE user = ${user} AND mode = ${mode} AND relax = ${mod}`)
            }
    
            for(var c = 0; c < countries.length; c++){
                const country = countries[c]
                const users = await zrange(`ripple:leaderboard${mods[mod]}:${modes[mode]}:${country.code.toLowerCase()}`, 0, -1, false)
                if(users.length == 0) continue;
                
                for(var i = 0; i < users.length; i++) {
                    const ch = await check(users[i])
                    const cont = ch.user.country.split(",")

                    if(!ch.newCol || ch.insert){
                        cont.pop()
                    }

                    cont.push(i + 1)
                    await request(`UPDATE ranks SET country = "${cont.join(",")}" WHERE user = ${users[i]} AND mode = ${mode} AND relax = ${mod}`)
                }
            }
        }
    }
}