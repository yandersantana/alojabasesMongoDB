const { Router } = require('express');
const router = Router();
const ProductosPendientes = require('../models/productosPendientes')

router.get('/getProductosPendientes', async (req, res) => {
    const productosPen = await ProductosPendientes.find();
    res.send(productosPen)      
})

router.get('/getProductosPend/:documento', async (req, res) => {
    const { documento } = req.params;
    const productospen = await ProductosPendientes.find({"solicitud_n":documento});
    res.json(productospen); 
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const productosComprados = {
        fecha: req.body.fecha,
        cliente: req.body.cliente,
        celular: req.body.celular,
        producto: req.body.producto,
        documento: req.body.documento,
        sucursal: req.body.sucursal,
        cajas: req.body.cajas,
        piezas: req.body.piezas,
        cantM2: req.body.cantM2,
        cajasPen: req.body.cajasPen,
        piezasPen: req.body.piezasPen,
        cantM2Pen: req.body.cantM2Pen,
        cajasEntregadas: req.body.cajasEntregadas,
        piezasEntregadas: req.body.piezasEntregadas,
        m2Entregados: req.body.m2Entregados,
        valor_unitario: req.body.valor_unitario,
        total: req.body.total,
        usuario: req.body.usuario,
        fechaEntrega: req.body.fechaEntrega,
        estado: req.body.estado,
        tipo_documento: req.body.tipo_documento
    };
    await ProductosPendientes.findByIdAndUpdate(id, {$set: productosComprados}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await ProductosComprados.findByIdAndRemove(req.params.id);
    res.json({status: 'Product Deleted'});
})

router.post('/newProductoPendiente', async (req, res) => {
    const newPendiente = new ProductosPendientes({
        fecha: req.body.fecha,
        cliente: req.body.cliente,
        celular: req.body.celular,
        producto: req.body.producto,
        documento: req.body.documento,
        sucursal: req.body.sucursal,
        cajas: req.body.cajas,
        piezas: req.body.piezas,
        cantM2: req.body.cantM2,
        cajasPen: req.body.cajasPen,
        piezasPen: req.body.piezasPen,
        cantM2Pen: req.body.cantM2Pen,
        cajasEntregadas: req.body.cajasEntregadas,
        piezasEntregadas: req.body.piezasEntregadas,
        m2Entregados: req.body.m2Entregados,
        valor_unitario: req.body.valor_unitario,
        total: req.body.total,
        usuario: req.body.usuario,
        fechaEntrega: req.body.fechaEntrega,
        estado: req.body.estado,
        tipo_documento: req.body.tipo_documento
    });
    await newPendiente.save();
    res.json({status: 'Se ha creado un nuevo producto'});  

});


module.exports = router;