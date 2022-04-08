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









router.post("/getTransaccionesPorTipoDocumentoYRecibo", async (req, res, next) => {
  const transacciones = await TransaccionFinanciera.find({ numDocumento: req.body.NumDocumento ,rCajaId:req.body.rCajaId, tipoTransaccion : req.body.tipoTransaccion});
  res.json(transacciones);
});

router.post("/getTransaccionesPrestamos", async (req, res, next) => {
  const transacciones = await TransaccionFinanciera.find({ numDocumento: req.body.NumDocumento ,referenciaPrestamo : req.body.rCajaId});
  res.json(transacciones);
});

router.post("/getTransaccionesPorTipoDocumentoYRecibo2", async (req, res, next) => {
  const transacciones = await TransaccionFinanciera.find({ numDocumento: req.body.NumDocumento , tipoTransaccion : req.body.tipoTransaccion});
  res.json(transacciones);
});

router.delete("/delete/:id", async (req, res, next) => {
  await TransaccionesFacturas.findByIdAndRemove(req.params.id);
  res.json({ status: "Transaccion Eliminada" });
});

router.put("/updateEstado/:id/:estado", async (req, res, next) => {
  const { id } = req.params;
  const { estado } = req.params;
  await TransaccionFinanciera.findByIdAndUpdate( id,{ $set: { isContabilizada: estado } },{ new: true } );
  res.json({ status: "Transaccion Updated" });
});

router.put("/updateContabilizada/:id/:estado", async (req, res, next) => {
  const { id } = req.params;
  const { estado } = req.params;
  await TransaccionFinanciera.findByIdAndUpdate( id,{ $set: { isContabilizada: estado } },{ new: true } );
  res.json({ status: "Transaccion Updated" });
});


module.exports = router;
