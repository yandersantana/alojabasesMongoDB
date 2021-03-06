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

router.get('/getProductosPendientesEntrega/', async (req, res) => {
    const productospen = await ProductosPendientes.find({"estado":"PENDIENTE"});
    res.json(productospen); 
})

router.put('/actualizarNota/:id/:nota', async (req, res,next) => {
    const { id } = req.params;
    const { nota } = req.params;
    console.log("netre "+nota + "s "+id)
    await ProductosPendientes.findByIdAndUpdate(id, {$set: {notas:nota}}, {new: true});
    res.json({status: 'factura Updated'});  
})




router.put('/updateEstado/:id', async (req, res,next) => {
    const { id } = req.params;
    await ProductosPendientes.findByIdAndUpdate(id, {$set: {estado:req.body.estado , mensaje:req.body.mensaje}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const productosComprados = {
        id_Pedido: req.body.id_Pedido,
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
        mensaje:req.body.mensaje,
        notas:req.body.notas,
        usuario: req.body.usuario,
        fechaEntrega: req.body.fechaEntrega,
        estado: req.body.estado,
        tipo_documento: req.body.tipo_documento
    };
    await ProductosPendientes.findByIdAndUpdate(id, {$set: productosComprados}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await ProductosPendientes.findByIdAndRemove(req.params.id);
    res.json({status: 'Product Deleted'});
})

router.post('/newProductoPendiente', async (req, res) => {
    const newPendiente = new ProductosPendientes({
        id_Pedido: req.body.id_Pedido,
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
        mensaje:req.body.mensaje,
        usuario: req.body.usuario,
        notas:req.body.notas,
        fechaEntrega: req.body.fechaEntrega,
        estado: req.body.estado,
        tipo_documento: req.body.tipo_documento
    });
    await newPendiente.save();
    res.json({status: 'Se ha creado un nuevo producto'});  

});


module.exports = router;