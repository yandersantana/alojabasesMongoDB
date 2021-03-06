const { Router } = require('express');
const router = Router();
const Transacciones = require('../models/transacciones')

router.get('/getTransacciones', async (req, res) => {
    const transacciones = await Transacciones.find();
    res.send(transacciones)      
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const sucursales = {
        idTransaccion: req.body.idTransaccion,
        fecha_transaccion: req.body.fecha_transaccion,
        fecha_mov: req.body.fecha_mov,
        sucursal: req.body.sucursal,
        bodega: req.body.bodega,
        tipo_transaccion: req.body.tipo_transaccion,
        costo_unitario:req.body.costo_unitario,
        totalsuma: req.body.totalsuma,
        documento: req.body.documento,
        rucSucursal: req.body.rucSucursal,
        producto: req.body.producto,
        cajas: req.body.cajas,
        piezas: req.body.piezas,
        usu_autorizado: req.body.usu_autorizado,
        usuario: req.body.usuario,
        observaciones: req.body.observaciones,
        factPro: req.body.factPro,
        valor: req.body.valor,
        cliente: req.body.cliente,
        proveedor: req.body.proveedor,
        maestro: req.body.maestro,
        orden_compra: req.body.orden_compra,
        cantM2: req.body.cantM2,
        movimiento: req.body.movimiento
    };
    await Transacciones.findByIdAndUpdate(id, {$set: sucursales}, {new: true});
    res.json({status: 'Sucursal Actualizada'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await Transacciones.findByIdAndRemove(req.params.id);
    res.json({status: 'Sucursal Eliminada'});
})


router.post('/newTransaccion', async (req, res) => {
    console.log("avance"+req.body)
    //const { index_name, index_description, index_type,index_length } = req.body;
    const newTransaccion= new Transacciones({ 
        idTransaccion: req.body.idTransaccion,
        fecha_transaccion: req.body.fecha_transaccion,
        fecha_mov: req.body.fecha_mov,
        sucursal: req.body.sucursal,
        bodega: req.body.bodega,
        tipo_transaccion: req.body.tipo_transaccion,
        totalsuma: req.body.totalsuma,
        documento: req.body.documento,
        rucSucursal: req.body.rucSucursal,
        producto: req.body.producto,
        cajas: req.body.cajas,
        piezas: req.body.piezas,
        costo_unitario:req.body.costo_unitario,
        usu_autorizado: req.body.usu_autorizado,
        usuario: req.body.usuario,
        observaciones: req.body.observaciones,
        factPro: req.body.factPro,
        valor: req.body.valor,
        cliente: req.body.cliente,
        proveedor: req.body.proveedor,
        maestro: req.body.maestro,
        orden_compra: req.body.orden_compra,
        cantM2: req.body.cantM2,
        movimiento: req.body.movimiento
        });
    await newTransaccion.save();
    res.json({status: 'Sucursal creado'});
});


module.exports = router;