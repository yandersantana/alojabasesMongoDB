const { Router } = require('express');
const router = Router();
const FacturaProveedor = require('../models/facturaProveedor')

router.get('/getFacturasProveedor', async (req, res) => {
    const facturas = await FacturaProveedor.find();
    res.send(facturas)      
})

router.post("/getFacturasPorDocumento/:documento", async (req, res, next) => {
  const { documento } = req.params;
  var tipoEstado="Por Ingresar"
  console.log(req.params)
  console.log(documento)
  const documentos = await FacturaProveedor.find({
    nSolicitud: documento
  });
  
  res.json(documentos);
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



router.delete('/delete/:id', async (req, res,next) => {
    await FacturaProveedor.findByIdAndRemove(req.params.id);
    res.json({status: 'Factura Eliminada'});
})

router.post('/newFacturaProveedor', async (req, res) => {
   // const { nombre, representante, direccion,email_empresarial,email_administrador,contrasena,numUsuarios } = req.body;
   const Newfacturas = new FacturaProveedor({
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
    });
    await Newfacturas.save();
    res.json({status: 'Factura CREADA'});
});


module.exports = router;