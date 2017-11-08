const fs = require('fs')
const handlebars = require('handlebars')

const { APP_NAME } = process.env

handlebars.registerHelper('appName', opts => {
  return APP_NAME
})

function read (filename) {
  return fs.readFileSync(filename, { encoding: 'utf8' })
}

module.exports = function (directory) {
  const result = new Map()
  const fileList = fs.readdirSync(directory)

  fileList.map(file => {
    result.set(
      file.replace('.hbs', ''),
      handlebars.compile(read(`${directory}/${file}`))
    )
  })

  return result
}
