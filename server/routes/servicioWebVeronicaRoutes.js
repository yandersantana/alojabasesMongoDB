const { Router } = require('express');
const router = Router();
const ServicioWebVeronica = require('../models/servicioWebVeronica')


router.post('/newLog', async (req, res) => {
    const newLog = new ServicioWebVeronica({
        objetoRequest: req.body.objetoRequest,
        objetoResponse: req.body.objetoResponse,
        nroDocumento: req.body.nroDocumento,
        claveAcceso: req.body.claveAcceso,
        sucursal: req.body.sucursal,
        resultado: req.body.resultado,
        fecha: req.body.fecha});
    await newLog.save();
    res.json({status: 'Factura CREADA'});
});


module.exports = router;