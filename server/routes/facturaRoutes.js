const { Router } = require("express");
const router = Router();
const Factura = require("../models/factura");

router.get("/getFacturas", async (req, res) => {
  const facturas = await Factura.find();
  res.send(facturas);
});

router.post("/getFacturasMensuales", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  const transacciones = await Factura.find({
    createdAt: {
      $gte: start,
      $lt: end,
    },
  });
  res.json(transacciones);
});

router.post("/getFacturasPorDocumento/:documento", async (req, res, next) => {
  const { documento } = req.params;
  console.log(req.params)
  console.log(documento)
  const documentos = await Factura.find({
    documento_n: documento,
  });
  
  res.json(documentos);
});


router.post("/getFacturasPorDocumentoVenta/:documento", async (req, res, next) => {
  const { documento } = req.params;
  console.log(req.params)
  console.log(documento)
  const documentos = await Factura.find({
    documento_n: documento,
  });
  
  res.json(documentos);
});

router.post("/getFacturasPorRango", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  const ordenes = await Factura.find({
    createdAt: {
      $gte: start,
      $lt: end,
    },
  });
  res.json(ordenes);
});

router.put("/update2/:id/:observaciones", async (req, res, next) => {
  const { id } = req.params;
  const { observaciones } = req.params;
  await Factura.findByIdAndUpdate(
    id,
    { $set: { observaciones: observaciones } },
    { new: true }
  );
  res.json({ status: "factura Updated" });
});

router.put("/updateEstado/:id/:estado", async (req, res, next) => {
  const { id } = req.params;
  const { estado } = req.params;
  console.log("llegue hasta aquu");
  await Factura.findByIdAndUpdate(
    id,
    { $set: { estado: estado } },
    { new: true }
  );
  res.json({ status: "factura Updated" });
});

router.put(
  "/updateEstadoMensaje/:id/:estado/:mensaje",
  async (req, res, next) => {
    const { id } = req.params;
    const { estado } = req.params;
    const { mensaje } = req.params;
    await Factura.findByIdAndUpdate(
      id,
      { $set: { estado: estado, mensaje: mensaje } },
      { new: true }
    );
    res.json({ status: "factura Updated" });
  }
);

router.put("/updateEstadoOb/:id/:estado", async (req, res, next) => {
  const { id } = req.params;
  const { estado } = req.params;
  //const { observaciones } = req.params;
  console.log("22 " + req.body.observaciones);
  await Factura.findByIdAndUpdate(
    id,
    { $set: { estado: estado, observaciones: req.body.observaciones } },
    { new: true }
  );
  res.json({ status: "factura Updated" });
});

router.put("/actualizarNota/:id/:nota", async (req, res, next) => {
  const { id } = req.params;
  const { nota } = req.params;
  await Factura.findByIdAndUpdate(id, { $set: { nota: nota } }, { new: true });
  res.json({ status: "factura Updated" });
});

router.put("/update/:id", async (req, res, next) => {
  const { id } = req.params;
  const facturas = {
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
    totalDescuentos: req.body.totalDescuentos,
    estado: req.body.estado,
    mensaje: req.body.mensaje,
    nota: req.body.nota,
    rucFactura: req.body.rucFactura,
    productosVendidos: req.body.productosVendidos,
  };
  console.log("llegue hasta aquu");
  await Factura.findByIdAndUpdate(id, { $set: facturas }, { new: true });
  res.json({ status: "factura Updated" });
});

router.delete("/delete/:id", async (req, res, next) => {
  await Factura.findByIdAndRemove(req.params.id);
  res.json({ status: "Factura Eliminada" });
});

router.post("/newFactura", async (req, res) => {
  // const { nombre, representante, direccion,email_empresarial,email_administrador,contrasena,numUsuarios } = req.body;
  const Newfacturas = new Factura({
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
    rucFactura: req.body.rucFactura,
    mensaje: req.body.mensaje,
    productosVendidos: req.body.productosVendidos,
  });
  console.log("llegue hasta aqui");
  await Newfacturas.save();
  res.json({ status: "Factura CREADA" });
});

module.exports = router;
