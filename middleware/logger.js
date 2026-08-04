const fs = require('fs')
const path = require('path')

const logger = (req, res, next) => {
    const log = `${new Date().toISOString()} | ${req.method} | ${req.url}\n`
    console.log(log.trim())

    const logDir = path.join(__dirname, '..', 'logs')
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)

    fs.appendFileSync(path.join(logDir, 'reqLog.txt'), log)
    next()
}

module.exports = logger