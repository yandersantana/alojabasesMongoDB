const mongoose = require("mongoose");

//const URI ="mongodb+srv://yanderst:Estud1ante@alojabases-8gbum.mongodb.net/alojabases?retryWrites=true&w=majority"; // ---base yander
//const URI ="mongodb+srv://yander:1234asdf@cluster0.brhib.mongodb.net/AlojabasesNueva"; // nueva-------------
//const URI ="mongodb+srv://yander:AB1234cd@cluster0.vxbcw.mongodb.net/ALOJABASESAGOSTO"; // nuevaAGOSTO-------------
//const URI ="mongodb+srv://yander:YanderGrace096@alojabases.ynyl6.mongodb.net/AlojaBaseDiciembre"; // Diciembre-------------
//const URI ="mongodb+srv://yander:yander1234@cluster0.dbmpy.mongodb.net/alojabasesOctubre"; // nuevaOCTUBRE-------------
const URI ="mongodb+srv://yander:YanderGrace096@cluster0.axwc1.mongodb.net/alojabasesJunio"; // JUNIOOOOO-------------




//const URI ="mongodb+srv://yanderst:Estud1ante@alojabases-8gbum.mongodb.net/AlojabasesOficial?retryWrites=true&w=majority"; // ---base pruebas yander
//const URI ="mongodb+srv://yander:AB1234cd@cluster0.srcdl.mongodb.net/alojabases?retryWrites=true&w=majority"; // ---base juan
////////////////const URI= 'mongodb://104.248.14.190/alojabases'    //base mia
//const URI= 'mongodb://104.131.82.174/alojabases'   //base de Juan
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => console.log("DB is connected"))
  .catch((err) => console.error(err));

//module.exports = mongoose;
