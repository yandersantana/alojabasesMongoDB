const { Router } = require('express');
const router = Router();
const NotasVenta = require('../models/notasVenta')

router.get('/getNotasVenta', async (req, res) => {
    const notasVenta = await NotasVenta.find();
    res.send(notasVenta)      
})

router.put('/updateObservaciones/:id/:observaciones', async (req, res,next) => {
    const { id } = req.params;
    const { observaciones } = req.params;
    await NotasVenta.findByIdAndUpdate(id, {$set: {observaciones:observaciones}}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const notasv = {
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
        estado:req.body.estado,
        productosVendidos:req.body.productosVendidos
    };
    console.log("llegue hasta aquu")
    await NotasVenta.findByIdAndUpdate(id, {$set: notasv}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await NotasVenta.findByIdAndRemove(req.params.id);
    res.json({status: 'Factura Eliminada'});
})

router.post('/newNotaVenta', async (req, res) => {
   const NewNota = new NotasVenta({
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
        estado:req.body.estado,
        productosVendidos:req.body.productosVendidos
    });
    await NewNota.save();
    res.json({status: 'Factura CREADA'});
});


module.exports = router;