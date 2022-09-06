import ranks from "./ranks.js"
export default async function(){
    ranks()

    setInterval(async function(){
        ranks()
    }, 1000 * 60 * 60)
}