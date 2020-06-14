const { Router } = require('express');
const router = Router();
const ProductosVendidos = require('../models/productosVendidos')

router.get('/getProductosvendidos', async (req, res) => {
    const productosVendidos = await ProductosVendidos.find();
    res.send(productosVendidos)      
})



router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const productosVendidos = {
        cantidad: req.body.cantidad,
        disponible: req.body.disponible,
        entregar: req.body.entregar,
        equivalencia: req.body.equivalencia,
        iva: req.body.iva,
        producto: req.body.producto,
        pedir: req.body.pedir,
        seleccionado: req.body.seleccionado,
        precio_min: req.body.precio_min,
        precio_venta: req.body.precio_venta,
        total: req.body.total,
        tipo_documento_emitido: req.body.tipo_documento_emitido,
        factura_id: req.body.factura_id,
        descuento: req.body.descuento,
        tipoDocumentoVenta: req.body.tipoDocumentoVenta,
        subtP2: req.body.subtP2,
        subtP1: req.body.subtP1,
        subtIva: req.body.subtIva,
        sucursal: req.body.sucursal
    };
    await ProductosVendidos.findByIdAndUpdate(id, {$set: productosVendidos}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await ProductosVendidos.findByIdAndRemove(req.params.id);
    res.json({status: 'Product Deleted'});
})

router.post('/newProductoVendido', async (req, res) => {
    const nuevaVenta = new ProductosVendidos({
        cantidad: req.body.cantidad,
        disponible: req.body.disponible,
        entregar: req.body.entregar,
        equivalencia: req.body.equivalencia,
        iva: req.body.iva,
        producto: req.body.producto,
        pedir: req.body.pedir,
        seleccionado: req.body.seleccionado,
        precio_min: req.body.precio_min,
        precio_venta: req.body.precio_venta,
        total: req.body.total,
        tipo_documento_emitido: req.body.tipo_documento_emitido,
        factura_id: req.body.factura_id,
        descuento: req.body.descuento,
        tipoDocumentoVenta: req.body.tipoDocumentoVenta,
        subtP2: req.body.subtP2,
        subtP1: req.body.subtP1,
        subtIva: req.body.subtIva,
        sucursal: req.body.sucursal
    });
    await nuevaVenta.save();
    res.json({status: 'Se ha creado un nuevo producto'});  

});




module.exports = router;