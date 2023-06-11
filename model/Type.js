const mongoose = require('mongoose');

const TypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  taux: {
    type: Number,
    required: true
  },
});


const Type = mongoose.model('Type', TypeSchema, 'Types');
module.exports = Type;
