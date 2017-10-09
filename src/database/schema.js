import Joi from 'joi'

const config = { abortEarly: false }

export default function (bookshelf) {
  var Model = bookshelf.Model

  bookshelf.Model = Model.extend({
    constructor: function () {
      Model.prototype.constructor.apply(this, arguments)

      this.on('creating', this.validateCreate, this)
      this.on('updating', this.validateUpdate, this)
    },

    validate (schema, model) {
      let input = model && Object.keys(model).length > 0 ? model : this.changed

      var result = Joi.validate(input, schema, config)
      if (result.error) throw result.error

      this.set(result.value)
    },

    validateCreate: function () {
      var schema = this.schema.create.options({
        noDefaults: true
      })
      this.validate(schema)
    },

    validateUpdate (model, attrs) {
      var schema = this.schema.update
      this.validate(schema, attrs)
    }
  })
}
