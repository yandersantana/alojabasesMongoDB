const { Router } = require('express');
const router = Router();
const OrdenCompra = require('../models/ordenCompra')

router.get('/getOrdenesCompra', async (req, res) => {
    const ordenes = await OrdenCompra.find();
    res.send(ordenes)      
})

router.get('/getOrdenesCompraID/:id', async (req, res) => {
    const { id } = req.params;
	const orden = await OrdenCompra.findById(id);
    res.json(orden); 
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const ordenes = {
        fecha: req.body.fecha,
        usuario: req.body.usuario,
        usuarioAth: req.body.usuarioAth,
        fechaEntrega: req.body.fechaEntrega,
        contacto: req.body.contacto,
        documento: req.body.documento,
        proveedor:req.body.proveedor,
        sucursal:req.body.sucursal,
        lugarentrega:req.body.lugarentrega,
        condpago:req.body.condpago,
        costeUnitaTransport:req.body.costeUnitaTransport,
        otrosCostosGen:req.body.otrosCostosGen,
        otrosDescuentosGen:req.body.otrosDescuentosGen,
        observaciones:req.body.observaciones,
        total:req.body.total,
        productoDetalle:req.body.productoDetalle,
        estado:req.body.estado,
        subtotal:req.body.subtotal,
        secuencia:req.body.secuencia,
        n_orden:req.body.n_orden,
        fechaAP:req.body.fechaAP,
        msjAdmin:req.body.msjAdmin,
        msjGeneral:req.body.msjGeneral,
        subtotalIva:req.body.subtotalIva,
        subtotalDetalles:req.body.subtotalDetalles,
        subtDetalles2:req.body.subtDetalles2,
        TotalIva:req.body.TotalIva,
        tipo:req.body.tipo,
        factPro:req.body.factPro,
        estadoOrden:req.body.estadoOrden,
        estadoIngreso:req.body.estadoIngreso,
        productosComprados:req.body.productosComprados
    };
    await OrdenCompra.findByIdAndUpdate(id, {$set: ordenes}, {new: true});
    res.json({status: 'factura Updated'});  
})

router.put('/updateEstadoRechazo/:id/:estado/:mensaje/:estado2', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    const { mensaje } = req.params;
    const { estado2 } = req.params;
    await OrdenCompra.findByIdAndUpdate(id, {$set: {estado:estado , msjAdmin:mensaje , estadoOrden:estado2}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateEstadoRechazo2/:id/:estado/:mensaje/:estado2', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    const { mensaje } = req.params;
    const { estado2 } = req.params;
    await OrdenCompra.findByIdAndUpdate(id, {$set: {estado:estado , msjGeneral:mensaje , estadoOrden:estado2}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateEstadoAprobado/:id/:estado/:orden/:usuario/:estado2', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    const { orden } = req.params;
    const { usuario } = req.params;
    const { estado2 } = req.params;
    await OrdenCompra.findByIdAndUpdate(id, {$set: {estado:estado , n_orden:orden ,usuarioAth:usuario, estadoOrden:estado2}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateEstadoOrden/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    await OrdenCompra.findByIdAndUpdate(id, {$set: { estadoOrden:estado}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateEstadoOrdenes2/:id/:estado', async (req, res,next) => {
    console.log("sssssssssss" +JSON.stringify(req.body))
    const { id } = req.params;
    const { estado } = req.params;
    //console.log("aqui esta "+orden + " y "+estado)
    //await OrdenCompra.findByIdAndUpdate(id, {$set: { estadoOrden:estado}}, {new: true});
    await OrdenCompra.findByIdAndUpdate(id, {$set: { estadoOrden:estado}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateEstadoOrden/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    await OrdenCompra.findByIdAndUpdate(id, {$set: { estadoOrden:estado}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateEstadosOrdenes/:id/:estado/:estado2', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    const { estado2 } = req.params;
    await OrdenCompra.findByIdAndUpdate(id, {$set: { estado:estado,estadoOrden:estado2}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await OrdenCompra.findByIdAndRemove(req.params.id);
    res.json({status: 'Factura Eliminada'});
})

router.post('/newOrdenes', async (req, res) => {
   const NewOrden = new OrdenCompra({
    fecha: req.body.fecha,
    usuario: req.body.usuario,
    usuarioAth: req.body.usuarioAth,
    fechaEntrega: req.body.fechaEntrega,
    contacto: req.body.contacto,
    documento: req.body.documento,
    proveedor:req.body.proveedor,
    sucursal:req.body.sucursal,
    lugarentrega:req.body.lugarentrega,
    condpago:req.body.condpago,
    costeUnitaTransport:req.body.costeUnitaTransport,
    otrosCostosGen:req.body.otrosCostosGen,
    otrosDescuentosGen:req.body.otrosDescuentosGen,
    observaciones:req.body.observaciones,
    total:req.body.total,
    productoDetalle:req.body.productoDetalle,
    estado:req.body.estado,
    subtotal:req.body.subtotal,
    secuencia:req.body.secuencia,
    n_orden:req.body.n_orden,
    fechaAP:req.body.fechaAP,
    msjAdmin:req.body.msjAdmin,
    msjGeneral:req.body.msjGeneral,
    subtotalIva:req.body.subtotalIva,
    subtotalDetalles:req.body.subtotalDetalles,
    subtDetalles2:req.body.subtDetalles2,
    TotalIva:req.body.TotalIva,
    tipo:req.body.tipo,
    factPro:req.body.factPro,
    estadoOrden:req.body.estadoOrden,
    estadoIngreso:req.body.estadoIngreso,
    productosComprados:req.body.productosComprados
    });
    await NewOrden.save();
    res.json({status: 'Orden CREADA'});
});


module.exports = router;