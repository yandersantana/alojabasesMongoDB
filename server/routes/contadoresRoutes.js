
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
        contRemisiones_Ndocumento:req.body.contRemisiones_Ndocumento,
        pagoProveedor_Ndocumento:req.body.pagoProveedor_Ndocumento,
        contProductosPendientes_Ndocumento:req.bosy.contProductosPendientes_Ndocumento,
        contTraslados_Ndocumento:req.body.contTraslados_Ndocumento,
        auditorias_Ndocumento:req.body.auditorias_Ndocumento,
        
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
        pagoProveedor_Ndocumento:req.body.pagoProveedor_Ndocumento,
        contRemisiones_Ndocumento:req.body.contRemisiones_Ndocumento,
        contTraslados_Ndocumento:req.body.contTraslados_Ndocumento,
        contProductosPendientes_Ndocumento:req.bosy.contProductosPendientes_Ndocumento,
        contDocumentoEntrega_Ndocumento:req.body.contDocumentoEntrega_Ndocumento,
        auditorias_Ndocumento:req.body.auditorias_Ndocumento,
        contProductosEntregadosSucursal_Ndocumento:req.body.contProductosEntregadosSucursal_Ndocumento,
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

router.put('/updateIdAuditoria/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {auditorias_Ndocumento:req.body.auditorias_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdNotasVenta/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {notasVenta_Ndocumento:req.body.notasVenta_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdDevoluciones/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {contDevoluciones_Ndocumento:req.body.contDevoluciones_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdDocumentoEntrega/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {contDocumentoEntrega_Ndocumento:req.body.contDocumentoEntrega_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdProductosEntregados/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {contProductosEntregadosSucursal_Ndocumento:req.body.contProductosEntregadosSucursal_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdProductosPendientes/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {contProductosPendientes_Ndocumento:req.body.contProductosPendientes_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdBajas/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {contBajas_Ndocumento:req.body.contBajas_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdTraslados/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {contTraslados_Ndocumento:req.body.contTraslados_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdRemisiones/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {contRemisiones_Ndocumento:req.body.contRemisiones_Ndocumento}}, {new: true});
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

router.put('/updateIdDocumentoGenerado/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {ordenesCompraAprobadas_Ndocumento:req.body.ordenesCompraAprobadas_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdOrdenesAprobadas/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {ordenesCompraAprobadas_Ndocumento:req.body.ordenesCompraAprobadas_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdPagosProveedor/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {pagoProveedor_Ndocumento:req.body.pagoProveedor_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.put('/updateIDFacturasProveedor/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {contFacturaProveedor_Ndocumento:req.body.contFacturaProveedor_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIDPagoProveedor/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {contFacturaProveedor_Ndocumento:req.body.contFacturaProveedor_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIDRegistroCaja/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {reciboCaja_Ndocumento:req.body.reciboCaja_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIDComprobantePago/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {comprobantePago_Ndocumento:req.body.comprobantePago_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIDComprobantePagoProveedor/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {comprobantePagoProveedor_Ndocumento:req.body.comprobantePagoProveedor_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIDCajaMenor/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {cajaMenor_Ndocumento:req.body.cajaMenor_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdTransacciones/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {transacciones_Ndocumento:req.body.transacciones_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateIdPagoCheque/:id', async (req, res,next) => {
    const { id } = req.params;
    await Contadores.findByIdAndUpdate(id, {$set: {pagoCheque_Ndocumento:req.body.pagoCheque_Ndocumento}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await Contadores.findByIdAndRemove(req.params.id);
    res.json({status: 'Contadores Eliminado'});
})


module.exports = router;

