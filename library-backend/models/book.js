import mongoose from 'mongoose'

import uniqueValidator from 'mongoose-unique-validator'

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  published: {
    type: Number,
  },
    genres: [
    { type: String}
  ]
})

schema.plugin(uniqueValidator)

export default mongoose.model('Book', schema)