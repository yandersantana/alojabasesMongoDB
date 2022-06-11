const { Router } = require('express');
const router = Router();
const ProductosEntregados = require('../models/productosEntregados')

router.get('/getProductosEntregados', async (req, res) => {
    const productosEntregados = await ProductosEntregados.find();
    res.send(productosEntregados)      
})

router.post('/getProductosEntregadosPorOrden', async (req, res, next) => {
  const documentos = await ProductosEntregados.find({ numeroOrden: req.body.numeroOrden});
  res.json(documentos);
});

router.put('/updateEstadoIngreso/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    await ProductosEntregados.findByIdAndUpdate(id, {$set: {estadoIngreso:estado}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateEstado/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    await ProductosEntregados.findByIdAndUpdate(id, {$set: {estado:estado}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const productosEntregados = {
        id_documento: req.body.id_documento,
        productoPorEntregar: req.body.productoPorEntregar,
        cajas: req.body.cajas,
        piezas: req.body.piezas,
        m2: req.body.m2,
        fecha: req.body.fecha,
        identrega: req.body.identrega,
        estado: req.body.estado,
        notas: req.body.notas
    };
    await ProductosEntregados.findByIdAndUpdate(id, {$set: productosEntregados}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await ProductosEntregados.findByIdAndRemove(req.params.id);
    res.json({status: 'Product Deleted'});
})

router.post('/newProductoEntregado', async (req, res) => {
    const newProductosIngresados = new ProductosEntregados({
        id_documento: req.body.id_documento,
        productoPorEntregar: req.body.productoPorEntregar,
        cajas: req.body.cajas,
        piezas: req.body.piezas,
        m2: req.body.m2,
        fecha: req.body.fecha,
        identrega: req.body.identrega,
        estado: req.body.estado,
        notas: req.body.notas
    });
    await newProductosIngresados.save();
    res.json({status: 'Se ha creado un nuevo producto'});  

});


module.exports = router;