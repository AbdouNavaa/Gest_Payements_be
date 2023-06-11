const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/db')
    .then(() => console.log('Connected to Mongodb...'))
    .catch(err => console.log('Could not Connect to Mongodb...', err));

// mongoose.connect('mongodb+srv://Abdou:DEPSw0bc3j1H6FzX@cluster0.4bw8rye.mongodb.net/?retryWrites=true&w=majority')
// .then(() => console.log('Connected to Mongodb...'))
// .catch(err => console.log('Could not Connect to Mongodb...', err));