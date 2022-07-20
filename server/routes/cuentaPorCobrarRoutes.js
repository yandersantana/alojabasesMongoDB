const { Router } = require("express");
const router = Router();
const CuentaPorCobrar = require("../models/cuentaPorCobrar");

router.get("/getCuentasPorCobrar", async (req, res) => {
  const cuentas = await CuentaPorCobrar.find();
  res.send(cuentas);
});

router.get("/getCuentasPorCobrarActivas", async (req, res) => {
  const cuentas = await CuentaPorCobrar.find({estado:"Activa"});
  res.send(cuentas);
});

router.get("/getCuentasPorCobrarPendientes", async (req, res) => {
  const cuentas = await CuentaPorCobrar.find({estado:"Cancelada"});
  res.send(cuentas);
});

router.post("/getCuentasPorRango", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  const cuentas = await CuentaPorCobrar.find({
    createdAt: {
      $gte: start,
      $lt: end,
    }
  });
  res.json(cuentas);
});

router.post("/getCuentasPorRUC/:documento", async (req, res, next) => {
  const { documento } = req.params;
  const documentos = await CuentaPorCobrar.find({rucCliente: documento, estado:"Activa"});
  res.json(documentos);
});

router.post("/getCuentasPorRUCCancelada/:documento", async (req, res, next) => {
  const { documento } = req.params;
  const documentos = await CuentaPorCobrar.find({rucCliente: documento, estado:"Cancelada"});
  res.json(documentos);
});

router.post("/getCuentasPorNombre/:nombre", async (req, res, next) => {
  const { nombre } = req.params;
  const documentos = await CuentaPorCobrar.find({cliente: nombre, estado:"Activa"});
  res.json(documentos);
});

router.put("/updateEstado/:id/:estado", async (req, res, next) => {
  const { id } = req.params;
  const { estado } = req.params;
  await CuentaPorCobrar.findByIdAndUpdate(id,{ $set: { estado: estado } },{ new: true });
  res.json({ status: "Cuenta Updated" });
});

router.delete("/delete/:id", async (req, res, next) => {
  await CuentaPorCobrar.findByIdAndRemove(req.params.id);
  res.json({ status: "Cuenta Eliminada" });
});

router.delete("/deleteDoc/:id", async (req, res, next) => {
  await CuentaPorCobrar.findOneAndDelete( { rCajaId: req.params.id } );
  res.json({ status: "Cuenta Eliminada" });
});

router.post("/newCuentaPorCobrar", async (req, res) => {
  const newCuenta = new CuentaPorCobrar({
    fecha: req.body.fecha,
    fecha_deuda : req.body.fecha_deuda,
    sucursal: req.body.sucursal,
    cliente: req.body.cliente,
    rucCliente: req.body.rucCliente,
    rCajaId: req.body.rCajaId,
    documentoVenta: req.body.documentoVenta,
    numDocumento: req.body.numDocumento,
    valor: req.body.valor,
    tipo_doc: req.body.tipo_doc,
    valorFactura: req.body.valorFactura,
    tipoPago: req.body.tipoPago,
    cuenta: req.body.cuenta,
    estado: req.body.estado,
    notas: req.body.notas
  });
  await newCuenta.save();
  res.json({ status: "Cuenta creado" });
});

module.exports = router;
