const { Router } = require("express");
const router = Router();
const TransaccionesCheques = require("../models/transaccionCheques");

router.get("/getTransacciones", async (req, res) => {
  const transacciones = await TransaccionesCheques.find();
  res.send(transacciones);
});


router.post("/getTransaccionesPorRango", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  var sucursal = req.body.sucursal;
  var transacciones = [];
  if(sucursal == ""){
     transacciones = await TransaccionesCheques.find({
      fechaPagoDate: {
        $gte: start,
        $lt: end,
      },
    });
  }else{
     transacciones = await TransaccionesCheques.find({
      fechaPagoDate: {
        $gte: start,
        $lt: end,
      },
      sucursal:sucursal
    });
  }
  
  res.json(transacciones);
});

router.post("/getTransaccionesPorRangoEstadoCubierto", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  var sucursal = req.body.sucursal;
  var transacciones = [];
  if(sucursal == ""){
     transacciones = await TransaccionesCheques.find({
      fechaPagoDate: {
        $gte: start,
        $lt: end,
      },
      estado:"Cubierto"
    });
  }else{
     transacciones = await TransaccionesCheques.find({
      fechaPagoDate: {
        $gte: start,
        $lt: end,
      },
      estado:"Cubierto",
      sucursal:sucursal
    });
  }
  
  res.json(transacciones);
});

router.post("/getTransaccionesPorTipoDocumento", async (req, res, next) => {
  const transacciones = await TransaccionesCheques.find({ idComprobante: req.body.NumDocumento , proveedor : req.body.tipoTransaccion});
  res.json(transacciones);
});

router.post("/getTransaccionesPorIdPago", async (req, res, next) => {
  const transacciones = await TransaccionesCheques.find({ idPago: req.body.NumDocumento});
  res.json(transacciones);
});

router.post("/getTransaccionesPorNumCheque", async (req, res, next) => {
  const transacciones = await TransaccionesCheques.find({ numCheque: req.body.NumDocumento});
  res.json(transacciones);
});

router.post("/getTransaccionesPorIdComprobante", async (req, res, next) => {
  const transacciones = await TransaccionesCheques.find({ idComprobante: req.body.NumDocumento});
  res.json(transacciones);
});


router.delete("/delete/:id", async (req, res, next) => {
  await TransaccionesCheques.findByIdAndRemove(req.params.id);
  res.json({ status: "Transaccion Eliminada" });
});

router.post("/newTransaccion", async (req, res) => {
  const newTransaccion = new TransaccionesCheques({
    id: req.body.id,
    fecha: req.body.fecha,
    idComprobante: req.body.idComprobante,
    idPago: req.body.idPago,
    numCheque: req.body.numCheque,
    banco: req.body.banco,
    cuenta: req.body.cuenta,
    fechaPago: req.body.fechaPago,
    fechaPagoDate: req.body.fechaPagoDate,
    valor: req.body.valor,
    facturas: req.body.facturas,
    proveedor: req.body.proveedor,
    usuario: req.body.usuario,
    estado: req.body.estado,
    observaciones : req.body.observaciones
  });
  await newTransaccion.save();
  res.json({ status: "Transaccion creada" });
});

router.put('/updateFechaPago/:id', async (req, res,next) => {
    const { id } = req.params;
    await TransaccionesCheques.findByIdAndUpdate(id, {$set: {fechaPago : req.body.fechaPago, fechaPagoDate : req.body.fechaPagoDate}}, {new: true});
    res.json({status: 'factura Updated'});  
})

router.put('/updateEstadoPago/:id', async (req, res,next) => {
    const { id } = req.params;
    await TransaccionesCheques.findByIdAndUpdate(id, {$set: {estado : req.body.estado}}, {new: true});
    res.json({status: 'factura Updated'});  
})



module.exports = router;
