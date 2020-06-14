const mongoose = require('mongoose');

const URI = 'mongodb+srv://yanderst:Estud1ante@alojabases-8gbum.mongodb.net/alojabases?retryWrites=true&w=majority';

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(db => console.log('DB is connected'))
    .catch(err => console.error(err));



//module.exports = mongoose;