const mongoose = require('mongoose')

const matiereSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  coef: {
    type: Number,
    required: true
  },
  taux: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Type',
    required: true
  },
  // user_id: {
  //   type: String,
  //   required: true
  // },
})

module.exports = mongoose.model('Matiere', matiereSchema)
