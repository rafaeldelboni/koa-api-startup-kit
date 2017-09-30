const dotenv = require('dotenv')
const app = require('./app')

dotenv.config()

app.listen(process.env.APP_PORT)
console.info(`Server On :${process.env.APP_PORT}`)
