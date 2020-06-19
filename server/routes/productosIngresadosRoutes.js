const { Router } = require('express');
const router = Router();
const ProductosIngresados = require('../models/productosIngresados')

router.get('/getProductosIngresados', async (req, res) => {
    const productosObs = await ProductosIngresados.find();
    res.send(productosObs)      
})



router.put('/updateEstadoIngreso/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    await ProductosIngresados.findByIdAndUpdate(id, {$set: {estadoIngreso:estado}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const productosIngresados = {
        nombreComercial: req.body.nombreComercial,
        cantidadEntregada: req.body.cantidadEntregada,
        cantidadEntregadapiezas: req.body.cantidadEntregadapiezas,
        metros2: req.body.metros2,
        cantidadSolicitada: req.body.cantidadSolicitada,
        cantidadSolicitadacajas: req.body.cantidadSolicitadacajas,
        cantidadSolicitadapiezas: req.body.cantidadSolicitadapiezas,
        observaciones: req.body.observaciones,
        estado: req.body.estado,
        cantidadDevuelta: req.body.cantidadDevuelta,
        cantidadDevueltapiezas: req.body.cantidadDevueltapiezas,
        causaDevolucion: req.body.causaDevolucion,
        numeroOrden: req.body.numeroOrden,
        numeroRemision: req.body.numeroRemision,
        fecha: req.body.fecha,
        precio: req.body.precio,
        valorunitario: req.body.valorunitario,
        valortotal: req.body.valortotal,
        estadoIngreso: req.body.estadoIngreso,
        descuentoGeneral: req.body.descuentoGeneral,
        solicitud_compra: req.body.solicitud_compra,
        descuentoProducto: req.body.descuentoProducto
    };
    await ProductosIngresados.findByIdAndUpdate(id, {$set: productosIngresados}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await ProductosIngresados.findByIdAndRemove(req.params.id);
    res.json({status: 'Product Deleted'});
})

router.post('/newProductoIngresado', async (req, res) => {
    const newProductosIngresados = new ProductosIngresados({
        nombreComercial: req.body.nombreComercial,
        cantidadEntregada: req.body.cantidadEntregada,
        cantidadEntregadapiezas: req.body.cantidadEntregadapiezas,
        metros2: req.body.metros2,
        cantidadSolicitada: req.body.cantidadSolicitada,
        cantidadSolicitadacajas: req.body.cantidadSolicitadacajas,
        cantidadSolicitadapiezas: req.body.cantidadSolicitadapiezas,
        observaciones: req.body.observaciones,
        estado: req.body.estado,
        cantidadDevuelta: req.body.cantidadDevuelta,
        cantidadDevueltapiezas: req.body.cantidadDevueltapiezas,
        causaDevolucion: req.body.causaDevolucion,
        numeroOrden: req.body.numeroOrden,
        numeroRemision: req.body.numeroRemision,
        fecha: req.body.fecha,
        precio: req.body.precio,
        valorunitario: req.body.valorunitario,
        valortotal: req.body.valortotal,
        estadoIngreso: req.body.estadoIngreso,
        descuentoGeneral: req.body.descuentoGeneral,
        solicitud_compra: req.body.solicitud_compra,
        descuentoProducto: req.body.descuentoProducto
    });
    await newProductosIngresados.save();
    res.json({status: 'Se ha creado un nuevo producto'});  

});


module.exports = router;