process.env.APP_NAME = 'your-super-app-name'

const mockReadFileSync = jest.fn(() => '<p><b>{{appName}}</b>{{user.name}}</p>')
const mockReaddirSync = jest.fn(() => ['file-one.hbs', 'file-two.hbs'])

jest.mock('fs', () => {
  return {
    readFileSync: mockReadFileSync,
    readdirSync: mockReaddirSync
  }
})

const template = require('../../src/helpers/template')

describe('unit', () => {
  describe('helpers', () => {
    describe('layouts', () => {
      describe('render', () => {
        it('should render html', async function () {
          const html = template('file-two', {
            user: {
              name: 'test'
            }
          })
          expect(html).toMatchSnapshot()
        })
        it('should not render html', async function () {
          expect.assertions(1)
          try {
            template('file-that-not-exists', {
              user: {
                name: 'test'
              }
            })
          } catch (error) {
            expect(error.message).toEqual(
              'Template file-that-not-exists not found'
            )
          }
        })
      })
    })
  })
})
