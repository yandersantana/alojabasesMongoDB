
const { Router } = require('express');
const router = Router();
const Contadores = require('../models/contadoresIncrementables')

router.post('/newContadores', async (req, res) => {
    console.log("entre a crearrr")
    const newCont = new Contadores({ 
        facturaMatriz_Ndocumento:req.body.factura_Ndocumento, 
        facturaSucursal1_Ndocumento:req.body.factura_Ndocumento, 
        facturaSucursal2_Ndocumento:req.body.factura_Ndocumento,  
        proformas_Ndocumento:req.body.proformas_Ndocumento, 
        notasVenta_Ndocumento:req.body.notasVenta_Ndocumento,
        ordenesCompra_Ndocumento:req.body.ordenesCompra_Ndocumento,
        notasVenta_Ndocumento:req.body.notasVenta_Ndocumento,
        transacciones_Ndocumento: req.body.transacciones_Ndocumento});
    await newCont.save();
    res.json({status: 'Contador creado'});
});


router.get('/getContadores/:id', async (req, res) => {
    const { id } = req.params;
    const cliente = await Contadores.findById(id);
    res.json(cliente); 
})

router.get('/getContadores', async (req, res) => {
    const contadores = await Contadores.find();
    res.send(contadores)      
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newContador = { 
        facturaMatriz_Ndocumento:req.body.factura_Ndocumento, 
        facturaSucursal1_Ndocumento:req.body.factura_Ndocumento, 
        facturaSucursal2_Ndocumento:req.body.factura_Ndocumento, 
        proformas_Ndocumento:req.body.proformas_Ndocumento, 
        notasVenta_Ndocumento:req.body.notasVenta_Ndocumento,
        ordenesCompra_Ndocumento:req.body.ordenesCompra_Ndocumento,
        ordenesCompraAprobadas_Ndocumento:req.body.ordenesCompraAprobadas_Ndocumento,
        transacciones_Ndocumento: req.body.transacciones_Ndocumento};
        
    await Contadores.findByIdAndUpdate(id, {$set: newContador}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdFacturaMatriz/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {facturaMatriz_Ndocumento:req.body.facturaMatriz_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdFacturaSuc1/:id', async (req, res,next) => {
    const { id } = req.params;
    console.log("xx "+JSON.stringify(req.body))
    await Contadores.findByIdAndUpdate(id, {$set: {facturaSucursal1_Ndocumento:req.body.facturaSucursal1_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdFacturaSuc2/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {facturaSucursal2_Ndocumento:req.body.facturaSucursal2_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdNotasVenta/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {notasVenta_Ndocumento:req.body.notasVenta_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdProformas/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {proformas_Ndocumento:req.body.proformas_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdOrdenes/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {ordenesCompra_Ndocumento:req.body.ordenesCompra_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdOrdenesAprobadas/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {ordenesCompraAprobadas_Ndocumento:req.body.ordenesCompraAprobadas_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})



router.put('/updateIdTransacciones/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {transacciones_Ndocumento:req.body.transacciones_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await Contadores.findByIdAndRemove(req.params.id);
    res.json({status: 'Contadores Eliminado'});
})


module.exports = router;

