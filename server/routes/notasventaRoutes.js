const { Router } = require("express");
const router = Router();
const NotasVenta = require("../models/notasVenta");

router.get("/getNotasVenta", async (req, res) => {
  const notasVenta = await NotasVenta.find();
  res.send(notasVenta);
});

router.post("/getNotasVentaMensuales", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  const transacciones = await NotasVenta.find({
    createdAt: {
      $gte: start,
      $lt: end,
    },
  });
  res.json(transacciones);
});

router.post("/getNotasVentaPorRango", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  const notas = await NotasVenta.find({
    createdAt: {
      $gte: start,
      $lt: end,
    },
  });
  res.json(notas);
});

router.post("/getNotasVentaPorDocumento/:documento", async (req, res, next) => {
  const { documento } = req.params;
  const documentos = await NotasVenta.find({
    documento_n: documento,
  });
  res.json(documentos);
});

router.put("/updateObservaciones/:id/:observaciones",async (req, res, next) => {
    const { id } = req.params;
    const { observaciones } = req.params;
    await NotasVenta.findByIdAndUpdate(
      id,
      { $set: { observaciones: observaciones } },
      { new: true }
    );
    res.json({ status: "factura Updated" });
  }
);

router.put("/updateEstado/:id/:estado", async (req, res, next) => {
  const { id } = req.params;
  const { estado } = req.params;
  await NotasVenta.findByIdAndUpdate(
    id,
    { $set: { estado: estado } },
    { new: true }
  );
  res.json({ status: "factura Updated" });
});

router.put(
  "/updateEstadoAnulacion/:id/:estado/:mensaje",
  async (req, res, next) => {
    const { id } = req.params;
    const { estado } = req.params;
    const { mensaje } = req.params;
    await NotasVenta.findByIdAndUpdate(
      id,
      { $set: { estado: estado, mensaje: mensaje } },
      { new: true }
    );
    res.json({ status: "factura Updated" });
  }
);

router.put("/updateEstadoObs/:id/:estado", async (req, res, next) => {
  const { id } = req.params;
  const { estado } = req.params;
  await NotasVenta.findByIdAndUpdate(
    id,
    { $set: { estado: estado, observaciones: req.body.observaciones } },
    { new: true }
  );
  res.json({ status: "factura Updated" });
});

router.put("/update/:id", async (req, res, next) => {
  const { id } = req.params;
  const notasv = {
    documento_n: req.body.documento_n,
    sucursal: req.body.sucursal,
    fecha: req.body.fecha,
    fecha2: req.body.fecha2,
    total: req.body.total,
    username: req.body.username,
    cliente: req.body.cliente,
    tipo_venta: req.body.tipo_venta,
    observaciones: req.body.observaciones,
    coste_transporte: req.body.coste_transporte,
    tipoDocumento: req.body.tipoDocumento,
    cotizacion: req.body.cotizacion,
    subtotalF1: req.body.subtotalF1,
    subtotalF2: req.body.subtotalF2,
    totalIva: req.body.totalIva,
    maestro: req.body.maestro,
    nota: req.body.nota,
    totalDescuentos: req.body.totalDescuentos,
    estado: req.body.estado,
    mensaje: req.body.mensaje,
    productosVendidos: req.body.productosVendidos,
  };
  console.log("llegue hasta aquu");
  await NotasVenta.findByIdAndUpdate(id, { $set: notasv }, { new: true });
  res.json({ status: "factura Updated" });
});

router.put("/actualizarNota/:id/:nota", async (req, res, next) => {
  const { id } = req.params;
  const { nota } = req.params;
  await NotasVenta.findByIdAndUpdate(
    id,
    { $set: { nota: nota } },
    { new: true }
  );
  res.json({ status: "factura Updated" });
});

router.delete("/delete/:id", async (req, res, next) => {
  await NotasVenta.findByIdAndRemove(req.params.id);
  res.json({ status: "Factura Eliminada" });
});

router.post("/newNotaVenta", async (req, res) => {
  const NewNota = new NotasVenta({
    documento_n: req.body.documento_n,
    sucursal: req.body.sucursal,
    fecha: req.body.fecha,
    fecha2: req.body.fecha2,
    total: req.body.total,
    username: req.body.username,
    cliente: req.body.cliente,
    tipo_venta: req.body.tipo_venta,
    observaciones: req.body.observaciones,
    coste_transporte: req.body.coste_transporte,
    dni_comprador: req.body.dni_comprador,
    totalDescuento: req.body.totalDescuento,
    tipoDocumento: req.body.tipoDocumento,
    cotizacion: req.body.cotizacion,
    subtotalF1: req.body.subtotalF1,
    subtotalF2: req.body.subtotalF2,
    totalIva: req.body.totalIva,
    maestro: req.body.maestro,
    nota: req.body.nota,
    totalDescuentos: req.body.totalDescuentos,
    estado: req.body.estado,
    mensaje: req.body.mensaje,
    productosVendidos: req.body.productosVendidos,
  });
  await NewNota.save();
  res.json({ status: "Factura CREADA" });
});

module.exports = router;
