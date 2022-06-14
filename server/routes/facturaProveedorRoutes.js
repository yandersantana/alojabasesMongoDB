const { Router } = require('express');
const router = Router();
const FacturaProveedor = require('../models/facturaProveedor')

router.get('/getFacturasProveedor', async (req, res) => {
    const facturas = await FacturaProveedor.find();
    res.send(facturas)      
})

router.post("/getFacturasPorDocumento/:documento", async (req, res, next) => {
  const { documento } = req.params;
  const documentos = await FacturaProveedor.find({nSolicitud: documento});
  res.json(documentos);
});

router.post("/getFacturasPendientesPorProveedor/:proveedor", async (req, res, next) => {
  const { proveedor } = req.params;
  const documentos = await FacturaProveedor.find({proveedor: proveedor,estado :{ $in: ['PENDIENTE', 'PARCIAL','CUBIERTA PARCIAL'] }});
  res.json(documentos);
});

router.post("/getFacturasPorRango", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  const cuentas = await FacturaProveedor.find({
    createdAt: {
      $gte: start,
      $lt: end,
    }
  });
  res.json(cuentas);
});


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const facturas = {
        idF: req.body.idF,
        fecha: req.body.fecha,
        fechaExpiracion: req.body.fechaExpiracion,
        nFactura: req.body.nFactura,
        nSolicitud: req.body.nSolicitud,
        total: req.body.total,
        proveedor:req.body.proveedor,
        productos:req.body.productos,
        estado:req.body.estado,
        estado2:req.body.estado2,
        estado3:req.body.estado3,
        documento_solicitud:req.body.documento_solicitud
    };
    await FacturaProveedor.findByIdAndUpdate(id, {$set: facturas}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.put('/updateEstado2/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    await FacturaProveedor.findByIdAndUpdate(id, {$set: {estado2:estado}}, {new: true});
    res.json({status: 'factura Updated'});  
})

router.post("/getFacturaPorNumero", async (req, res, next) => {
  const transacciones = await FacturaProveedor.find({ nFactura: req.body.NumDocumento});
  res.json(transacciones);
});

router.put('/updateEstado3/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    await FacturaProveedor.findByIdAndUpdate(id, {$set: {estado3:estado}}, {new: true});
    res.json({status: 'factura Updated'});  
})

router.put('/updateEstado/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;

    await FacturaProveedor.findOneAndUpdate({idF:id}, {$set: {estado:estado}}, {new: true});
    res.json({status: 'factura Updated'});  
})

router.put('/updateEstadoFactura/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;

    await FacturaProveedor.findByIdAndUpdate(id, {$set: {estado:estado}}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.put('/updateEstadoMasivo/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;

    await FacturaProveedor.findByIdAndUpdate(id, {$set: {estado:estado}}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.put('/updateValoresDescuentos/:id', async (req, res,next) => {
    const { id } = req.params;

    await FacturaProveedor.findByIdAndUpdate(id, {$set: {total:req.body.total, valorDescuento:req.body.valorDescuento}}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.put('/updateEstadoFacturaProveedor/:id/:estado/:valorAbonado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    const { valorAbonado } = req.params;

    await FacturaProveedor.findByIdAndUpdate(id, {$set: {estado:estado,valorPagado:valorAbonado}}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.put('/updateEstadoPorId/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    await FacturaProveedor.findByIdAndUpdate(id, {$set: {estado:estado}}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.put('/updateEstadoPorId2/:id/:estado/:valor', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    const { valor } = req.params;
    await FacturaProveedor.findByIdAndUpdate(id, {$set: {estado:estado, valorAbonado:valor}}, {new: true});
    res.json({status: 'factura Updated'});  
})

router.delete('/delete/:id', async (req, res,next) => {
    await FacturaProveedor.findByIdAndRemove(req.params.id);
    res.json({status: 'Factura Eliminada'});
})

router.post('/newFacturaProveedor', async (req, res) => {
    const Newfacturas = new FacturaProveedor({
    idF: req.body.idF,
    fecha: req.body.fecha,
    fechaExpiracion: req.body.fechaExpiracion,
    nFactura: req.body.nFactura,
    nSolicitud: req.body.nSolicitud,
    total: req.body.total,
    valorAbonado: req.body.valorAbonado,
    valorPagado: req.body.valorPagado,
    proveedor:req.body.proveedor,
    productos:req.body.productos,
    estado:req.body.estado,
    estado2:req.body.estado2,
    estado3:req.body.estado3,
    documento_solicitud:req.body.documento_solicitud,
    valorDescuento: req.body.valorDescuento
    });
    await Newfacturas.save();
    res.json({status: 'Factura CREADA'});
});


module.exports = router;