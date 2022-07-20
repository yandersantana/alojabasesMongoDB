const { Router } = require("express");
const router = Router();
const CuentaPorPagar = require("../models/cuentaPorPagar");

router.get("/getCuentasPorPagar", async (req, res) => {
  const cuentas = await CuentaPorPagar.find();
  res.send(cuentas);
});

router.get("/getCuentasPorPagarActivas", async (req, res) => {
  const cuentas = await CuentaPorPagar.find({estado:"Activa"});
  res.send(cuentas);
});

router.get("/getCuentasPorPagarPendientes", async (req, res) => {
  const cuentas = await CuentaPorPagar.find({estado:"Cancelada"});
  res.send(cuentas);
});

router.post("/getCuentasPorRango", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  const cuentas = await CuentaPorPagar.find({
    createdAt: {
      $gte: start,
      $lt: end,
    }
  });
  res.json(cuentas);
});

router.post("/getCuentasPorRUC/:documento", async (req, res, next) => {
  const { documento } = req.params;
  const documentos = await CuentaPorPagar.find({rucBeneficiario: documento, estado:"Activa"});
  res.json(documentos);
});

router.post("/getCuentasPorNombre/:nombre", async (req, res, next) => {
  const { nombre } = req.params;
  const documentos = await CuentaPorPagar.find({beneficiario: nombre, estado:"Activa"});
  res.json(documentos);
});

router.put("/updateEstado/:id/:estado", async (req, res, next) => {
  const { id } = req.params;
  const { estado } = req.params;
  await CuentaPorPagar.findByIdAndUpdate(id,{ $set: { estado: estado } },{ new: true });
  res.json({ status: "Cuenta Updated" });
});

router.delete("/delete/:id", async (req, res, next) => {
  await CuentaPorPagar.findByIdAndRemove(req.params.id);
  res.json({ status: "Cuenta Eliminada" });
});

router.delete("/deleteDoc/:id", async (req, res, next) => {
  await CuentaPorPagar.findOneAndDelete( { rCajaId: req.params.id } );
  res.json({ status: "Cuenta Eliminada" });
});

router.post("/newCuentaPorPagar", async (req, res) => {
  const newCuenta = new CuentaPorPagar({
    fecha: req.body.fecha,
    sucursal: req.body.sucursal,
    beneficiario: req.body.beneficiario,
    rucBeneficiario: req.body.rucBeneficiario,
    comprobanteId: req.body.comprobanteId,
    numDocumento: req.body.numDocumento,
    valor: req.body.valor,
    estado: req.body.estado,
    notas: req.body.notas
  });
  await newCuenta.save();
  res.json({ status: "Cuenta creada" });
});

module.exports = router;




