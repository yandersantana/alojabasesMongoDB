const { Router } = require("express");
const router = Router();
const TransaccionFinanciera = require("../models/transaccionFinanciera");

router.get("/getTransacciones", async (req, res) => {
  const transacciones = await TransaccionFinanciera.find();
  res.send(transacciones);
});

router.post("/getTransaccionesPorRango", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  const transacciones = await TransaccionFinanciera.find({
    createdAt: {
      $gte: start,
      $lt: end,
    },
  });
  res.json(transacciones);
});


router.delete("/delete/:id", async (req, res, next) => {
  await TransaccionFinanciera.findByIdAndRemove(req.params.id);
  res.json({ status: "Transaccion Eliminada" });
});

router.post("/newTransaccion", async (req, res) => {
  const newTransaccion = new TransaccionFinanciera({
    fecha: req.body.fecha,
    sucursal: req.body.sucursal,
    cliente: req.body.cliente,
    rCajaId: req.body.rCajaId,
    documentoVenta: req.body.documentoVenta,
    numDocumento: req.body.numDocumento,
    valor: req.body.valor,
    tipoPago: req.body.tipoPago,
    cuenta: req.body.cuenta,
    subCuenta: req.body.subCuenta,
    soporte: req.body.soporte,
    dias: req.body.dias,
    vencimiento: req.body.vencimiento,
    notas: req.body.notas,
    tipoCuenta: req.body.tipoCuenta
  });
  await newTransaccion.save();
  res.json({ status: "Sucursal creado" });
});

module.exports = router;
