const { Router } = require('express');
const router = Router();
const DatosConfiguracion = require('../models/datosConfiguracion')

router.get('/getConfiguracion', async (req, res) => {
    const datos = await DatosConfiguracion.find();
    res.send(datos)      
})

module.exports = router;