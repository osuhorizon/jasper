async function log(req){
    const time = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' }).replaceAll(".", "-");
    console.log(`${time} | ${req.headers['x-forwarded-for']} | ${req.originalUrl}`);
}

module.exports = log;