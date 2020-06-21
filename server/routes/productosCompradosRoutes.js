const { Router } = require('express');
const router = Router();
const ProductosComprados = require('../models/productoDetalleCompra')

router.get('/getProductosComprados', async (req, res) => {
    const productosComprados = await ProductosComprados.find();
    res.send(productosComprados)      
})

router.get('/getProductosCom/:documento', async (req, res) => {
    console.log("entre aqui ")
    const { documento } = req.params;
    const productosComprados = await ProductosComprados.find({"solicitud_n":documento});
    res.json(productosComprados); 
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const productosComprados = {
        seleccionado: req.body.seleccionado,
        iva: req.body.iva,
        nombreComercial: req.body.nombreComercial,
        equivalencia: req.body.equivalencia,
        iva: req.body.iva,
        rotacion: req.body.rotacion,
        disponible: req.body.disponible,
        precio_cos: req.body.precio_cos,
        cantidad: req.body.cantidad,
        precio_compra: req.body.precio_compra,
        desct: req.body.desct,
        total: req.body.total,
        orden_compra: req.body.orden_compra,
        solicitud_n: req.body.solicitud_n,
        subtotal: req.body.subtotal,
        subtIva: req.body.subtIva,
        subtDet: req.body.subtDet,
        equivalencia: req.body.equivalencia,
        descGeneral: req.body.descGeneral,
        descProducto: req.body.descProducto,
        estado_remision: req.body.estado_remision
    };
    await ProductosComprados.findByIdAndUpdate(id, {$set: productosComprados}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await ProductosComprados.findByIdAndRemove(req.params.id);
    res.json({status: 'Product Deleted'});
})

router.post('/newProductoComprado', async (req, res) => {
    const nuevaCompra = new ProductosComprados({
        seleccionado: req.body.seleccionado,
        iva: req.body.iva,
        nombreComercial: req.body.nombreComercial,
        equivalencia: req.body.equivalencia,
        iva: req.body.iva,
        rotacion: req.body.rotacion,
        disponible: req.body.disponible,
        precio_cos: req.body.precio_cos,
        cantidad: req.body.cantidad,
        precio_compra: req.body.precio_compra,
        desct: req.body.desct,
        total: req.body.total,
        orden_compra: req.body.orden_compra,
        solicitud_n: req.body.solicitud_n,
        subtotal: req.body.subtotal,
        subtIva: req.body.subtIva,
        subtDet: req.body.subtDet,
        equivalencia: req.body.equivalencia,
        descGeneral: req.body.descGeneral,
        descProducto: req.body.descProducto,
        estado_remision: req.body.estado_remision
    });
    await nuevaCompra.save();
    res.json({status: 'Se ha creado un nuevo producto'});  

});

module.exports = router;