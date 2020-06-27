const { Router } = require('express');
const router = Router();
const Producto = require('../models/producto')

router.get('/getProductos', async (req, res) => {
    const productos = await Producto.find();
    res.send(productos)      
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const productos = {
        CAL: req.body.CAL,
        CASA: req.body.CASA,
        CLASIFICA: req.body.CLASIFICA,
        ESTADO: req.body.ESTADO,
        M2: req.body.M2,
        P_CAJA: req.body.P_CAJA,
        PRODUCTO: req.body.PRODUCTO,
        REFERENCIA: req.body.REFERENCIA,
        UNIDAD: req.body.UNIDAD,
        APLICACION: req.body.APLICACION,
        cantidad: req.body.cantidad,
        precio: req.body.precio,
        porcentaje_ganancia: req.body.porcentaje_ganancia,
        nombre_comercial: req.body.nombre_comercial,
        sucursal1: req.body.sucursal1,
        sucursal2: req.body.sucursal2,
        sucursal3: req.body.sucursal3,
        suc1Pendiente: req.body.suc1Pendiente,
        suc2Pendiente: req.body.suc2Pendiente,
        suc3Pendiente: req.body.suc3Pendiente,
        bodegaProveedor: req.body.bodegaProveedor
    };
    await Producto.findByIdAndUpdate(id, {$set: productos}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.put('/updateAplicacion/:id/:aplicacion', async (req, res,next) => {
    const { id } = req.params;
    const { aplicacion } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {APLICACION:aplicacion}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.put('/updateBodega/:id', async (req, res,next) => {
    const { id } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {bodegaProveedor:req.body.bodegaProveedor}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})



router.put('/updateProductoSuc1Dir/:id/:cantidad/:precio', async (req, res,next) => {
    const { id } = req.params;
    const { precio } = req.params;
    const { cantidad } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {sucursal1:cantidad, precio:precio}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateProductoSuc2Dir/:id/:cantidad/:precio', async (req, res,next) => {
    const { id } = req.params;
    const { precio } = req.params;
    const { cantidad } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {sucursal2:cantidad, precio:precio}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateProductoSuc3Dir/:id/:cantidad/:precio', async (req, res,next) => {
    const { id } = req.params;
    const { precio } = req.params;
    const { cantidad } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {sucursal3:cantidad, precio:precio}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.put('/updateProductoPenSuc1/:id/:num', async (req, res,next) => {
    const { id } = req.params;
    const { num } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {suc1Pendiente:num}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateProductoPenSuc2/:id/:num', async (req, res,next) => {
    const { id } = req.params;
    const { num } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {suc2Pendiente:num}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateProductoPenSuc3/:id/:num', async (req, res,next) => {
    const { id } = req.params;
    const { num } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {suc3Pendiente:num}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateProductoSuc1/:id', async (req, res,next) => {
    const { id } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {sucursal1:req.body.sucursal1}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateProductoSuc2/:id', async (req, res,next) => {
    const { id } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {sucursal2:req.body.sucursal2}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateProductoSuc3/:id', async (req, res,next) => {
    const { id } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {sucursal3:req.body.sucursal3}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await Producto.findByIdAndRemove(req.params.id);
    res.json({status: 'Product Deleted'});
})

router.post('/newProducto', async (req, res) => {
    const nuevoProducto = new Producto({
        CAL: req.body.CAL,
        CASA: req.body.CASA,
        CLASIFICA: req.body.CLASIFICA,
        ESTADO: req.body.ESTADO,
        M2: req.body.M2,
        P_CAJA: req.body.P_CAJA,
        PRODUCTO: req.body.PRODUCTO,
        REFERENCIA: req.body.REFERENCIA,
        APLICACION: req.body.APLICACION,
        UNIDAD: req.body.UNIDAD,
        cantidad: req.body.cantidad,
        precio: req.body.precio,
        porcentaje_ganancia: req.body.porcentaje_ganancia,
        nombre_comercial: req.body.nombre_comercial,
        sucursal1: req.body.sucursal1,
        sucursal2: req.body.sucursal2,
        sucursal3: req.body.sucursal3,
        suc1Pendiente: req.body.suc1Pendiente,
        suc2Pendiente: req.body.suc2Pendiente,
        suc3Pendiente: req.body.suc3Pendiente,
        bodegaProveedor: req.body.bodegaProveedor
    });
    await nuevoProducto.save();
    res.json({status: 'Se ha creado un nuevo producto'});  

});




module.exports = router;