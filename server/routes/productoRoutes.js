const { Router } = require('express');
const router = Router();
const Producto = require('../models/producto')

router.get('/getProductos', async (req, res) => {
    const productos = await Producto.find();
    res.send(productos)      
})

router.get('/getProductosActivos', async (req, res) => {
    const productos = await Producto.find({"ESTADO":"ACTIVO"});
    res.send(productos)      
})

router.get('/getProductobyID/:id', async (req, res) => {
    const { id } = req.params;
    const productos = await Producto.findById(id);
    res.send(productos); 
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
        ubicacionSuc1: req.body.ubicacionSuc1,
        ubicacionSuc2: req.body.ubicacionSuc2,
        ubicacionSuc3: req.body.ubicacionSuc3,
        notas: req.body.notas,
        precio1: req.body.precio1,
        precio2: req.body.precio2,
        precio3: req.body.precio3,
        bodegaProveedor: req.body.bodegaProveedor,
        ultimoPrecioCompra: req.body.ultimoPrecioCompra,
        ultimaFechaCompra:req.body.ultimaFechaCompra
    };
    await Producto.findByIdAndUpdate(id, {$set: productos}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updatePCatalogo/:producto/:referencia/:nombre/:aplicacion/:m2/:pcaja/:ganancia/:precio/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { producto } = req.params;
    const { referencia } = req.params;
    const { nombre } = req.params;
    const { aplicacion } = req.params;
    const { m2 } = req.params;
    const { pcaja } = req.params;
    const { ganancia } = req.params;
    const { precio } = req.params;
    const { estado } = req.params;
    await Producto.findOneAndUpdate({"PRODUCTO":producto}, {$set: {REFERENCIA:referencia,nombre_comercial:nombre,APLICACION:aplicacion,M2:m2,P_CAJA:pcaja,porcentaje_ganancia:ganancia,precio:precio,ESTADO:estado}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.put('/updateAplicacion/:id/:aplicacion', async (req, res,next) => {
    const { id } = req.params;
    const { aplicacion } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {APLICACION:aplicacion}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.put('/updateEstado/:producto/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { producto } = req.params;
    const { estado } = req.params;
    await Producto.findOneAndUpdate({"PRODUCTO":producto}, {$set: {ESTADO:estado}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})



router.put('/updateBodega/:id', async (req, res,next) => {
    const { id } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {bodegaProveedor:req.body.bodegaProveedor}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})



router.put('/updateProductoSuc1Dir/:id/:cantidad/:precio', async (req, res,next) => {
    const { id } = req.params;
    const { cantidad } = req.params;
    const { precio } = req.params;
    console.log(cantidad+ "ddd "+ precio)
    await Producto.findByIdAndUpdate(id, {$set: {sucursal1:cantidad, precio:req.body.ultimoPrecioCompra , precio1:req.body.precio1, precio2:req.body.precio2, precio3:req.body.precio3, ultimoPrecioCompra:req.body.ultimoPrecioCompra , ultimaFechaCompra:req.body.ultimaFechaCompra}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateProductoSuc2Dir/:id/:cantidad/:precio', async (req, res,next) => {
    const { id } = req.params;
    const { precio } = req.params;
    const { cantidad } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {sucursal2:cantidad,  precio:req.body.ultimoPrecioCompra, precio1:req.body.precio1, precio2:req.body.precio2, precio3:req.body.precio3, ultimoPrecioCompra:req.body.ultimoPrecioCompra , ultimaFechaCompra:req.body.ultimaFechaCompra}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateProductoSuc3Dir/:id/:cantidad/:precio', async (req, res,next) => {
    const { id } = req.params;
    const { precio } = req.params;
    const { cantidad } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {sucursal3:cantidad,  precio:req.body.ultimoPrecioCompra, precio1:req.body.precio1,precio2:req.body.precio2,precio3:req.body.precio3, ultimoPrecioCompra:req.body.ultimoPrecioCompra , ultimaFechaCompra:req.body.ultimaFechaCompra}}, {new: true});
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


router.put('/updateProductosSucursales/:id/:suc1/:suc2/:suc3', async (req, res,next) => {
    const { id } = req.params;
    const { suc1 } = req.params;
    const { suc2 } = req.params;
    const { suc3 } = req.params;
    console.log("sd "+req.body.PRODUCTO + " suc1 "+suc1+ " suc2 "+suc2+ " suc3 "+suc3)
    await Producto.findByIdAndUpdate(id, {$set: {sucursal1:suc1,sucursal2:suc2,sucursal3:suc3,precio:req.body.precio}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.post('/updateProductosSucursalesNuevo', async (req, res,next) => {
    console.log(req.body)
    var id = req.body.producto._id;
    var precioNuevo = req.body.producto.precio;
    var suc1 = req.body.suc1;
    var  suc2 = req.body.suc2;
    var  suc3 = req.body.suc3;
    console.log("sd "+id + " suc1 "+suc1+ " suc2 "+suc2+ " suc3 "+suc3)
    await Producto.findByIdAndUpdate(id, {$set: {sucursal1:suc1,sucursal2:suc2,sucursal3:suc3,precio:precioNuevo}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.put('/updateProductoSuc1/:id', async (req, res,next) => {
    const { id } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {sucursal1:req.body.sucursal1}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateProductoSuc2/:id', async (req, res,next) => {
    const { id } = req.params;
    console.log("sss "+req.body.PRODUCTO+" y "+req.body.sucursal2)
    await Producto.findByIdAndUpdate(id, {$set: {sucursal2:req.body.sucursal2}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateProductoSuc3/:id', async (req, res,next) => {
    const { id } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {sucursal3:req.body.sucursal3}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})




router.put('/updateProductoSuc1conBodega/:id', async (req, res,next) => {
    const { id } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {sucursal1:req.body.sucursal1,bodegaProveedor:req.body.bodegaProveedor}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateProductoSuc2conBodega/:id', async (req, res,next) => {
    const { id } = req.params;
    //console.log("sss "+req.body.PRODUCTO+" y "+req.body.sucursal2)
    await Producto.findByIdAndUpdate(id, {$set: {sucursal2:req.body.sucursal2,bodegaProveedor:req.body.bodegaProveedor}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateProductoSuc3conBodega/:id', async (req, res,next) => {
    const { id } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {sucursal3:req.body.sucursal3,bodegaProveedor:req.body.bodegaProveedor}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})




router.put('/updateProductoSuc1Bodega/:id', async (req, res,next) => {
    const { id } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {sucursal1:req.body.sucursal1,bodegaProveedor:req.body.bodegaProveedor}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateProductoSuc2Bodega/:id', async (req, res,next) => {
    const { id } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {sucursal2:req.body.sucursal2,bodegaProveedor:req.body.bodegaProveedor}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateProductoSuc3Bodega/:id', async (req, res,next) => {
    const { id } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {sucursal3:req.body.sucursal3,bodegaProveedor:req.body.bodegaProveedor}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateProductoUbicaciones/:id', async (req, res,next) => {
    const { id } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {ubicacionSuc1:req.body.ubicacionSuc1,ubicacionSuc2:req.body.ubicacionSuc2,ubicacionSuc3:req.body.ubicacionSuc3}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateProductoNotas/:id', async (req, res,next) => {
    const { id } = req.params;
    await Producto.findByIdAndUpdate(id, {$set: {notas:req.body.notas}}, {new: true});
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
        ubicacionSuc1: req.body.ubicacionSuc1,
        ubicacionSuc2: req.body.ubicacionSuc2,
        ubicacionSuc3: req.body.ubicacionSuc3,
        notas: req.body.notas,
        precio1: req.body.precio1,
        precio2: req.body.precio2,
        precio3: req.body.precio3,
        bodegaProveedor: req.body.bodegaProveedor,
        ultimoPrecioCompra: req.body.ultimoPrecioCompra,
        ultimaFechaCompra:req.body.ultimaFechaCompra
    });
    await nuevoProducto.save();
    res.json({status: 'Se ha creado un nuevo producto'});  

});




module.exports = router;