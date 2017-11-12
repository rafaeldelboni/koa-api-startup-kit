const nodemailer = require('nodemailer')
const config = require('./config')
const template = require('../template')

const transport = nodemailer.createTransport(config)

async function send ({ to, subject, layout, data }) {
  return transport.sendMail({
    from: `${process.env.APP_NAME} <${config.auth.user}>`,
    to,
    subject,
    html: template(layout, data)
  })
}

module.exports = {
  transport,
  send
}
