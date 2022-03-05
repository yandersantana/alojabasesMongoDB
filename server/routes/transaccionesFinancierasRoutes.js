const { Router } = require("express");
const router = Router();
const TransaccionFinanciera = require("../models/transaccionFinanciera");

router.get("/getTransacciones", async (req, res) => {
  const transacciones = await TransaccionFinanciera.find();
  res.send(transacciones);
});

/* router.post("/getTransaccionesPorRango", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  var sucursal = req.body.sucursal;
  const transacciones = await TransaccionFinanciera.find({
    createdAt: {
      $gte: start,
      $lt: end,
    },
    sucursal:sucursal
  });
  res.json(transacciones);
});
 */

router.post("/getTransaccionesPorRango", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  var sucursal = req.body.sucursal;
  var transacciones = [];
  if(sucursal == ""){
     transacciones = await TransaccionFinanciera.find({
      fecha: {
        $gte: start,
        $lt: end,
      },
    });
  }else{
     transacciones = await TransaccionFinanciera.find({
      fecha: {
        $gte: start,
        $lt: end,
      },
      sucursal:sucursal
    });
  }
  
  res.json(transacciones);
});

router.post("/getTransaccionesPorTipoDocumento", async (req, res, next) => {
  const transacciones = await TransaccionFinanciera.find({ id_documento: req.body.NumDocumento , tipoTransaccion : req.body.tipoTransaccion});
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
  await TransaccionFinanciera.findByIdAndRemove(req.params.id);
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
    cedula: req.body.cedula,
    tipoCuenta: req.body.tipoCuenta,
    id_documento : req.body.id_documento,
    tipoTransaccion : req.body.tipoTransaccion,
    isContabilizada : req.body.isContabilizada,
    referenciaPrestamo : req.body.referenciaPrestamo,
    beneficiario : req.body.beneficiario,
    proveedor : req.body.proveedor,
    centroCosto : req.body.centroCosto
  });
  await newTransaccion.save();
  res.json({ status: "Sucursal creado" });
});

module.exports = router;
