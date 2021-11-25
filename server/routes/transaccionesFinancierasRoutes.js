const { Router } = require("express");
const router = Router();
const TransaccionFinanciera = require("../models/transaccionFinanciera");

router.get("/getTransacciones", async (req, res) => {
  const transacciones = await TransaccionFinanciera.find();
  res.send(transacciones);
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
    notas: req.body.notas
  });
  await newTransaccion.save();
  res.json({ status: "Sucursal creado" });
});

module.exports = router;
