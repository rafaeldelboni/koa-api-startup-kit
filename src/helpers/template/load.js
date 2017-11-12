const { readFileSync, readdirSync } = require('fs')
const handlebars = require('handlebars')

const { APP_NAME, APP_FRONTEND_URL } = process.env

handlebars.registerHelper('appName', opts => {
  return APP_NAME
})

handlebars.registerHelper('appUrl', opts => {
  return APP_FRONTEND_URL
})

function read (filename) {
  return readFileSync(filename, { encoding: 'utf8' })
}

module.exports = function (directory) {
  const result = new Map()
  const fileList = readdirSync(directory)

  fileList.map(file => {
    result.set(
      file.replace('.hbs', ''),
      handlebars.compile(read(`${directory}/${file}`))
    )
  })

  return result
}
