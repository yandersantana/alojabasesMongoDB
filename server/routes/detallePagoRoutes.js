const { Router } = require('express');
const router = Router();
const DetallePago = require('../models/detallePagoProveedor')

router.get('/getDetallePago', async (req, res) => {
    const facturas = await DetallePago.find();
    res.send(facturas)      
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const facturas = {
        idPago: req.body.idPago,
        n_cheque: req.body.n_cheque,
        nombre_banco: req.body.nombre_banco,
        fact_proveedor: req.body.fact_proveedor,
        beneficiario: req.body.beneficiario,
        orden_compra: req.body.orden_compra,
        fecha_vencimiento:req.body.fecha_vencimiento,
        valor:req.body.valor,
        no_conformidad:req.body.no_conformidad,
        total:req.body.total,
        id_factura:req.body.id_factura,
        observaciones:req.body.observaciones
    };
    await DetallePago.findByIdAndUpdate(id, {$set: facturas}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await DetallePago.findByIdAndRemove(req.params.id);
    res.json({status: 'Factura Eliminada'});
})

router.post('/newDetallePago', async (req, res) => {
   const Newdetallepago = new DetallePago({
        idPago: req.body.idPago,
        n_cheque: req.body.n_cheque,
        nombre_banco: req.body.nombre_banco,
        fact_proveedor: req.body.fact_proveedor,
        beneficiario: req.body.beneficiario,
        orden_compra: req.body.orden_compra,
        fecha_vencimiento:req.body.fecha_vencimiento,
        valor:req.body.valor,
        no_conformidad:req.body.no_conformidad,
        total:req.body.total,
        id_factura:req.body.id_factura,
        observaciones:req.body.observaciones
    });
    await Newdetallepago.save();
    res.json({status: 'Factura CREADA'});
});


module.exports = router;