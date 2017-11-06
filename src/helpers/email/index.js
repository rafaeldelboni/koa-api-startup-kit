const nodemailer = require('nodemailer')
const config = require('./config')

const transport = nodemailer.createTransport(config)

async function send ({ to, subject, template, data }) {
  return transport.sendMail({
    from: `${process.env.APP_NAME} <${config.auth.user}>`,
    to,
    subject,
    html: template // TODO: add template parser to mix data on templates
  })
}

module.exports = {
  transport,
  send
}
