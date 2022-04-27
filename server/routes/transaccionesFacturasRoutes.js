const { Router } = require("express");
const router = Router();
const TransaccionesFacturas = require("../models/transaccionFactura");

router.get("/getTransacciones", async (req, res) => {
  const transacciones = await TransaccionesFacturas.find();
  res.send(transacciones);
});


router.post("/getTransaccionesPorRango", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  var sucursal = req.body.sucursal;
  var transacciones = [];
  if(sucursal == ""){
     transacciones = await TransaccionesFacturas.find({
      createdAt: {
        $gte: start,
        $lt: end,
      },
    });
  }else{
     transacciones = await TransaccionesFacturas.find({
      createdAt: {
        $gte: start,
        $lt: end,
      },
      sucursal:sucursal
    });
  }
  
  res.json(transacciones);
});

router.post("/getTransaccionesPorTipoDocumento", async (req, res, next) => {
  const transacciones = await TransaccionesFacturas.find({ idComprobante: req.body.NumDocumento , proveedor : req.body.tipoTransaccion});
  res.json(transacciones);
});

router.post("/newTransaccion", async (req, res) => {
  const newTransaccion = new TransaccionesFacturas({
    fecha: req.body.fecha,
    idFactura: req.body.idFactura,
    idComprobante: req.body.idComprobante,
    numFactura: req.body.numFactura,
    fechaFactura: req.body.fechaFactura,
    valorFactura: req.body.valorFactura,
    valorCancelado: req.body.valorCancelado,
    valorAbonado: req.body.valorAbonado,
    valorSaldos: req.body.valorSaldos,
    numCheque: req.body.numCheque,
    banco: req.body.banco,
    cuenta: req.body.cuenta,
    fechaPago: req.body.fechaPago,
    proveedor: req.body.proveedor,
    usuario: req.body.usuario,
    estado: req.body.estado,
    observaciones : req.body.observaciones
  });
  await newTransaccion.save();
  res.json({ status: "Transaccion creada" });
});


router.post("/getTransaccionesPorFactura", async (req, res, next) => {
  const transacciones = await TransaccionesFacturas.find({ numFactura: req.body.NumDocumento});
  res.json(transacciones);
});


router.post("/getTransaccionesPorIdComprobante", async (req, res, next) => {
  const transacciones = await TransaccionesFacturas.find({ idComprobante: req.body.NumDocumento});
  res.json(transacciones);
});

router.put('/updateEstadoFactura/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    await TransaccionesFacturas.findByIdAndUpdate(id, {$set: {estado : estado}}, {new: true});
    res.json({status: 'factura Updated'});  
})







module.exports = router;
