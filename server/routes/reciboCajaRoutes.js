const { Router } = require('express');
const { connectableObservableDescriptor } = require('rxjs/internal/observable/ConnectableObservable');
const router = Router();
const ReciboCaja = require('../models/reciboCaja')

router.post('/newReciboCaja', async (req, res) => {
    const newReciboCaja = new ReciboCaja({ 
        idDocumento:req.body.idDocumento,
        fecha:req.body.fecha,
        docVenta:req.body.docVenta,
        cliente:req.body.cliente,
        ruc:req.body.ruc,
        sucursal:req.body.sucursal,
        tipoPago:req.body.tipoPago,
        numDocumento:req.body.numDocumento,
        banco:req.body.banco,
        valorFactura:req.body.valorFactura,
        valorRecargo:req.body.valorRecargo,
        valorPagoEfectivo:req.body.valorPagoEfectivo,
        valorOtros:req.body.valorOtros,
        valorSaldos:req.body.valorSaldos,
        observaciones:req.body.observaciones,
        operacionesComercialesList:req.body.operacionesComercialesList
    });
    await newReciboCaja.save();
    res.json({status: 'Cuenta creada'});
});


router.get('/getRecibosCaja', async (req, res) => {
    const recibo = await ReciboCaja.find();
    res.send(recibo)      
});



router.post('/getReciboCajaPorId', async (req, res, next) => {
  const documentos = await ReciboCaja.find({
    idDocumento: req.body.idDocumento
  });
  res.json(documentos);
});


router.post("/getReciboCajaPorRango", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  const recibos = await ReciboCaja.find({
    createdAt: {
      $gte: start,
      $lt: end,
    },
  });
  res.json(recibos);
});


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newReciboCaja ={ 
            idDocumento:req.body.idDocumento,
            fecha:req.body.fecha,
            docVenta:req.body.docVenta,
            cliente:req.body.cliente,
            ruc:req.body.ruc,
            sucursal:req.body.sucursal,
            tipoPago:req.body.tipoPago,
            numDocumento:req.body.numDocumento,
            banco:req.body.banco,
            valorFactura:req.body.valorFactura,
            valorRecargo:req.body.valorRecargo,
            valorPagoEfectivo:req.body.valorPagoEfectivo,
            valorOtros:req.body.valorOtros,
            valorSaldos:req.body.valorSaldos,
            observaciones:req.body.observaciones,
            operacionesComercialesList:req.body.operacionesComercialesList};
    await ReciboCaja.findByIdAndUpdate(id, {$set: newReciboCaja}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await ReciboCaja.findByIdAndRemove(req.params.id);
    res.json({status: 'Cliente Eliminado'});
})


module.exports = router;

