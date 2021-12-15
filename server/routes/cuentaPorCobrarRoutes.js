const { Router } = require("express");
const router = Router();
const CuentaPorCobrar = require("../models/cuentaPorCobrar");

router.get("/getCuentasPorCobrar", async (req, res) => {
  const cuentas = await CuentaPorCobrar.find();
  res.send(cuentas);
});

router.post("/getCuentasPorRango", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  const cuentas = await CuentaPorCobrar.find({
    createdAt: {
      $gte: start,
      $lt: end,
    },
  });
  res.json(cuentas);
});

router.delete("/delete/:id", async (req, res, next) => {
  await CuentaPorCobrar.findByIdAndRemove(req.params.id);
  res.json({ status: "Transaccion Eliminada" });
});

router.delete("/deleteDoc/:id", async (req, res, next) => {
  await CuentaPorCobrar.findOneAndDelete( { rCajaId: req.params.id } );
  res.json({ status: "Transaccion Eliminada" });
});

router.post("/newCuentaPorCobrar", async (req, res) => {
  const newCuenta = new CuentaPorCobrar({
    fecha: req.body.fecha,
    sucursal: req.body.sucursal,
    cliente: req.body.cliente,
    rucCliente: req.body.rucCliente,
    rCajaId: req.body.rCajaId,
    documentoVenta: req.body.documentoVenta,
    numDocumento: req.body.numDocumento,
    valor: req.body.valor,
    tipoPago: req.body.tipoPago,
    cuenta: req.body.cuenta,
    notas: req.body.notas
  });
  await newCuenta.save();
  res.json({ status: "Sucursal creado" });
});

module.exports = router;
