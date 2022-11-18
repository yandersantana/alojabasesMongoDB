const mongoose = require("mongoose");

//const URI ="mongodb+srv://yanderst:Estud1ante@alojabases-8gbum.mongodb.net/alojabases?retryWrites=true&w=majority"; // ---base yander
//const URI ="mongodb+srv://yander:1234asdf@cluster0.brhib.mongodb.net/AlojabasesNueva"; // nueva-------------
//const URI ="mongodb+srv://yander:AB1234cd@cluster0.vxbcw.mongodb.net/ALOJABASESAGOSTO"; // nuevaAGOSTO-------------
//const URI ="mongodb+srv://yander:YanderGrace096@alojabases.ynyl6.mongodb.net/AlojaBaseDiciembre"; // Diciembre-------------


//const URI ="mongodb+srv://yander:yander1234@cluster0.dbmpy.mongodb.net/alojabasesOctubre"; // nuevaOCTUBRE-------------
const URI ="mongodb+srv://yander:YanderGrace096@cluster0.axwc1.mongodb.net/alojabasesJunio"; // JUNIOOOOO-------------



mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => console.log("DB is connected"))
  .catch((err) => console.error(err));

//module.exports = mongoose;
