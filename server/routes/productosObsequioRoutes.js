const { Router } = require('express');
const router = Router();
const ProductosObsequio = require('../models/productosObsequio')

router.get('/getProductosObsequio', async (req, res) => {
    const productosObs = await ProductosObsequio.find();
    res.send(productosObs)      
})
router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const productosObsequio = {
        cantidad: req.body.cantidad,
        cantidadpiezas: req.body.cantidadpiezas,
        cantidadM2: req.body.cantidadM2,
        producto: req.body.producto,
        idfactura: req.body.idfactura,
        proveedor: req.body.proveedor,
        fecha: req.body.fecha
    };
    await ProductosObsequio.findByIdAndUpdate(id, {$set: productosObsequio}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await ProductosObsequio.findByIdAndRemove(req.params.id);
    res.json({status: 'Product Deleted'});
})

router.post('/newProductoObsequio', async (req, res) => {
    const newProductoObsequio = new ProductosObsequio({
        cantidad: req.body.cantidad,
        cantidadpiezas: req.body.cantidadpiezas,
        cantidadM2: req.body.cantidadM2,
        producto: req.body.producto,
        idfactura: req.body.idfactura,
        proveedor: req.body.proveedor,
        fecha: req.body.fecha
    });
    await newProductoObsequio.save();
    res.json({status: 'Se ha creado un nuevo producto'});  

});


module.exports = router;