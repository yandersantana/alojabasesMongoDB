const { Router } = require('express');
const router = Router();
const ComprobantePagoProveedores = require('../models/comprobantePagoProveedor')

router.post('/newComprobantePago', async (req, res) => {
    const newReciboCaja = new ComprobantePagoProveedores({ 
        idDocumento:req.body.idDocumento,
        fechaComprobante:req.body.fechaComprobante,
        giradoA:req.body.giradoA,
        referencia:req.body.referencia,
        usuario:req.body.usuario,
        sucursal:req.body.sucursal,
        nombreProveedor:req.body.nombreProveedor,
        estadoComprobante:req.body.estadoComprobante,
        transaccionesFacturas:req.body.transaccionesFacturas,
        transaccionesCheques:req.body.transaccionesCheques
    });
    await newReciboCaja.save();
    res.json({status: 'Cuenta creada'});
});


router.get('/getComprobantesPago', async (req, res) => {
    const comprobante = await ComprobantePagoProveedores.find();
    res.send(comprobante)      
});


router.post('/getComprobantePorId', async (req, res, next) => {
  const documentos = await ComprobantePagoProveedores.find({
    _id: req.body._id
  });
  res.json(documentos);
});


router.put('/updateEstado/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    await ComprobantePagoProveedores.findByIdAndUpdate( id,{ $set: { estadoComprobante: estado } },{ new: true });
    res.json({status: 'ComprobantePago Updated'});  
})





router.post('/getComprobantePorIdConsecutivo', async (req, res, next) => {
  const documentos = await ComprobantePagoProveedores.find({
    idDocumento: req.body.idDocumento
  });
  res.json(documentos);
});


router.post("/getComprobantesPorRango", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  const comprobantes = await ComprobantePagoProveedores.find({
    createdAt: {
      $gte: start,
      $lt: end,
    },
  });
  res.json(comprobantes);
});





router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newComprobante ={ 
                  idDocumento:req.body.idDocumento,
                  fecha:req.body.fecha,
                  documento:req.body.documento,
                  centroCosto:req.body.centroCosto,
                  usuario:req.body.usuario,
                  sucursal:req.body.sucursal,
                  beneficiario:req.body.beneficiario,
                  proveedor:req.body.proveedor,
                  ruc:req.body.ruc,
                  telefono:req.body.telefono,
                  total:req.body.total,
                  observaciones:req.body.observaciones,
                  estadoComprobante:req.body.estadoComprobante,
                  operacionesComercialesList:req.body.operacionesComercialesList};
    await ComprobantePago.findByIdAndUpdate(id, {$set: newComprobante}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await ComprobantePago.findByIdAndRemove(req.params.id);
    res.json({status: 'Comprobante Eliminado'});
})


module.exports = router;

