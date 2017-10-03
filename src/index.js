const dotenv = require('dotenv')
dotenv.config()

const app = require('./app')
app.listen(process.env.APP_PORT)

console.info(`Server On :${process.env.APP_PORT}`)
