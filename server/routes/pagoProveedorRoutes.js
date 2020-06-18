const { Router } = require('express');
const router = Router();
const PagoProveedor = require('../models/pagoProveedor')

router.get('/getPagosProveedor', async (req, res) => {
    const pagos = await PagoProveedor.find();
    res.send(pagos)      
})

router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const notasv = {
        n_cheque: req.body.n_cheque,
        fecha_transaccion: req.body.fecha_transaccion,
        fecha_factura: req.body.fecha_factura,
        nombre_banco: req.body.nombre_banco,
        n_cuenta: req.body.n_cuenta,
        valor: req.body.valor,
        beneficiario:req.body.beneficiario};
    console.log("llegue hasta aquu")
    await PagoProveedor.findByIdAndUpdate(id, {$set: notasv}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await PagoProveedor.findByIdAndRemove(req.params.id);
    res.json({status: 'Factura Eliminada'});
})

router.post('/newPagoProveedor', async (req, res) => {
   const newPago = new PagoProveedor({
    n_cheque: req.body.n_cheque,
    fecha_transaccion: req.body.fecha_transaccion,
    fecha_factura: req.body.fecha_factura,
    nombre_banco: req.body.nombre_banco,
    n_cuenta: req.body.n_cuenta,
    valor: req.body.valor,
    beneficiario:req.body.beneficiario
    });
    await newPago.save();
    res.json({status: 'Factura CREADA'});
});


module.exports = router;