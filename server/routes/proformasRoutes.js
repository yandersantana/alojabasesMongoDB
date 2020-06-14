const { Router } = require('express');
const router = Router();
const Proformas = require('../models/proformas')

router.get('/getProformas', async (req, res) => {
    const proformas = await Proformas.find();
    res.send(proformas)      
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const proformas = {
        documento_n: req.body.documento_n,
        sucursal: req.body.sucursal,
        fecha: req.body.fecha,
        fecha2: req.body.fecha2,
        total: req.body.total,
        username: req.body.username,
        cliente:req.body.cliente,
        tipo_venta:req.body.tipo_venta,
        observaciones:req.body.observaciones,
        coste_transporte:req.body.coste_transporte,
        tipoDocumento:req.body.tipoDocumento,
        cotizacion:req.body.cotizacion,
        subtotalF1:req.body.subtotalF1,
        subtotalF2:req.body.subtotalF2,
        totalIva:req.body.totalIva,
        totalDescuentos:req.body.totalDescuentos,
        estado:req.body.estado
    };
    await Proformas.findByIdAndUpdate(id, {$set: proformas}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await Proformas.findByIdAndRemove(req.params.id);
    res.json({status: 'Factura Eliminada'});
})

router.post('/newProforma', async (req, res) => {
   const NewProforma = new Proformas({
        documento_n: req.body.documento_n,
        sucursal: req.body.sucursal,
        fecha: req.body.fecha,
        fecha2: req.body.fecha2,
        total: req.body.total,
        username: req.body.username,
        cliente:req.body.cliente,
        tipo_venta:req.body.tipo_venta,
        observaciones:req.body.observaciones,
        coste_transporte:req.body.coste_transporte,
        dni_comprador:req.body.dni_comprador,
        totalDescuento:req.body.totalDescuento,
        tipoDocumento:req.body.tipoDocumento,
        cotizacion:req.body.cotizacion,
        subtotalF1:req.body.subtotalF1,
        subtotalF2:req.body.subtotalF2,
        totalIva:req.body.totalIva,
        totalDescuentos:req.body.totalDescuentos,
        estado:req.body.estado
    });
    await NewProforma.save();
    res.json({status: 'Factura CREADA'});
});


module.exports = router;