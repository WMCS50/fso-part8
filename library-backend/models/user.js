import mongoose from 'mongoose'

import uniqueValidator from 'mongoose-unique-validator'

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  favoriteGenre: {
      type: String,
      required: true,
      minlength: 3
    },
})

schema.plugin(uniqueValidator)

export default mongoose.model('User', schema)