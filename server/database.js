const mongoose = require('mongoose');

//const URI = 'mongodb+srv://yanderst:Estud1ante@alojabases-8gbum.mongodb.net/alojabases?retryWrites=true&w=majority';
//const URI= 'mongodb://104.248.14.190/alojabases'    //base mia
const URI= 'mongodb://104.131.82.174/alojabases'   //base de Juan
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(db => console.log('DB is connected'))
    .catch(err => console.error(err));



//module.exports = mongoose;