const mongoose = require('mongoose');

const courSchema = new mongoose.Schema({
  prof: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prof',  
    required: true
  },
  matiere: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Matiere',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  Deb: {
    type: Date,
    required: true
  },
  Fin: {
    type: Date,
    required: true
  },
  CM: {
    type: Number,
  },
  TD: {
    type: Number,
  },
  TP: {
    type: Number,
  },
  total: { type: Number, default: 0 }
});


module.exports = mongoose.model('Cours', courSchema)
