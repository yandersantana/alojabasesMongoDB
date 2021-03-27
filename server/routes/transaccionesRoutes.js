const { Router } = require('express');
const router = Router();
const Transacciones = require('../models/transacciones')

router.post('/getTransaccionesPorRango', async (req, res,next) => {
    /*var start = new Date("2021-03-11T00:25:22.745+00:00");
    var end = new Date("2021-03-27T00:25:22.745+00:00");
    console.log("date1",start)
    console.log("date2",end)*/

    /*var start = new Date();
    start.setHours(0,0,0,0);

    var end = new Date();
    end.setHours(23,59,59,999);
    console.log("date1",start)
    console.log("date2",end)*/
//var start = new Date("2021-03-13T00:50:45.788Z");
    //var end = new Date("2021-03-28T00:50:45.788Z")
    console.log("llegue aqui",req)
    var start = req.body.fechaAnterior;
    var end = req.body.fechaActual;
    console.log("date1",start)
    console.log("date2",end)
    const transacciones = await Transacciones.find({
        createdAt: {
            $gte: start,
            $lt: end
        }
    })
    console.log("transacciones",transacciones)

    res.json(transacciones)      
})


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