const { Router } = require('express');
const router = Router();
const Factura = require('../models/factura')

router.get('/getFacturas', async (req, res) => {
    const facturas = await Factura.find();
    res.send(facturas)      
})


router.put('/update2/:id/:observaciones', async (req, res,next) => {
    console.log("siiiiiiiiiiii")
    const { id } = req.params;
    const { observaciones } = req.params;
    console.log("llegue hasta qui")
    await Factura.findByIdAndUpdate(id, {$set: {observaciones:observaciones}}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const facturas = {
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
    await Factura.findByIdAndUpdate(id, {$set: facturas}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await Factura.findByIdAndRemove(req.params.id);
    res.json({status: 'Factura Eliminada'});
})

router.post('/newFactura', async (req, res) => {
   // const { nombre, representante, direccion,email_empresarial,email_administrador,contrasena,numUsuarios } = req.body;
   const Newfacturas = new Factura({
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
    console.log("llegue hasta aqui")
    await Newfacturas.save();
    res.json({status: 'Factura CREADA'});
});


module.exports = router;