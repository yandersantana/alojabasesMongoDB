const { Router } = require("express");
const router = Router();
const TransaccionRevisionProducto = require("../models/transaccionRevisionesProducto");

router.get("/getTransacciones", async (req, res) => {
  const transacciones = await TransaccionRevisionProducto.find();
  res.send(transacciones);
});


router.post("/getTransaccionesPorRango", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  var sucursal = req.body.sucursal;
  var transacciones = [];
  if(sucursal == ""){
     transacciones = await TransaccionRevisionProducto.find({
      fecha: {
        $gte: start,
        $lt: end,
      },
    });
  }else{
     transacciones = await TransaccionRevisionProducto.find({
      fecha: {
        $gte: start,
        $lt: end,
      },
      sucursal:sucursal
    });
  }
  
  res.json(transacciones);
});


router.post("/newTransaccion", async (req, res) => {
  const newTransaccion = new TransaccionRevisionProducto({
    fecha: req.body.fecha,
    idReferenciaRevision: req.body.idReferenciaRevision,
    producto: req.body.producto,
    estado: req.body.estado,
    detalle: req.body.detalle,
    novedades: req.body.novedades,
    cajas_sistema: req.body.cajas_sistema,
    piezas_sistema: req.body.piezas_sistema,
    m2_sistema: req.body.m2_sistema,
    cajas_conteo: req.body.cajas_conteo,
    piezas_conteo: req.body.piezas_conteo,
    m2_conteo: req.body.m2_conteo,
    cajas_diferencia: req.body.cajas_diferencia,
    piezas_diferencia: req.body.piezas_diferencia,
    m2_diferencia: req.body.m2_diferencia,
    resultado: req.body.resultado,
    sucursal : req.body.sucursal,
    responsable : req.body.responsable,
    nombreClasificacion : req.body.nombreClasificacion
  });
  await newTransaccion.save();
  res.json({ status: "Transaccion creada" });
});

module.exports = router;

