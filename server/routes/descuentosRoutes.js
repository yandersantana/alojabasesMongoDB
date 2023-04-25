const { Router } = require("express");
const router = Router();
const Descuentos = require("../models/descuento");

router.post("/newCodigo", async (req, res) => {
  const newCodigo = new Descuentos({
    codigo: req.body.codigo,
    estado: req.body.estado,
    generadoPor: req.body.generadoPor
  });
  await newCodigo.save();
  res.json({ status: "Cuenta creada" });
});

module.exports = router;




