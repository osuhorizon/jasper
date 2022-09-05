async function log(req){
    const time = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' }).replaceAll(".", "-");
    console.log(`${time} | ${req.headers['x-forwarded-for']} | ${req.originalUrl}`);
}

import Logger from "cutesy.js";


export default new Logger().addTimestamp("hh:mm:ss").green()