const nodemailer = require('nodemailer')

const {
  EMAIL_SMTP_HOST: smtpHost,
  EMAIL_SMTP_PORT: smtpPort,
  EMAIL_SMTP_SSL: smtpSecure,
  EMAIL_SMTP_USER: smtpUser,
  EMAIL_SMTP_PASS: smtpPass,
  TEST_EMAIL_SMTP_HOST: testSmtpHost,
  TEST_EMAIL_SMTP_PORT: testSmtpPort,
  TEST_EMAIL_SMTP_USER: testSmtpUser,
  TEST_EMAIL_SMTP_PASS: testSmtpPass
} = process.env

const mailConfig =
  process.env.NODE_ENV === 'production'
    ? {
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    }
    : {
      host: testSmtpHost,
      port: testSmtpPort,
      auth: {
        user: testSmtpUser,
        pass: testSmtpPass
      }
    }

module.exports = nodemailer.createTransport(mailConfig)
