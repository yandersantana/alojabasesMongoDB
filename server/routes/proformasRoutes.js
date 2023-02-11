const { Router } = require('express');
const router = Router();
const Proformas = require('../models/proformas')

router.get('/getProformas', async (req, res) => {
    const proformas = await Proformas.find();
    res.send(proformas)      
})

router.post('/getProformasMensuales', async (req, res,next) => {
    var start = req.body.fechaAnterior;
    var end = req.body.fechaActual;
    const transacciones = await Proformas.find({
        createdAt: {
            $gte: start,
            $lt: end
        }
    })
    res.json(transacciones)      
})

router.post("/getProformasPorRango", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  const notas = await Proformas.find({
    createdAt: {
      $gte: start,
      $lt: end,
    },
  });
  res.json(notas);
});


router.post('/getProformaPorId', async (req, res, next) => {
  const documentos = await Proformas.find({
    documento_n: req.body.documento_n
  });
  res.json(documentos);
});


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const proformas = {
        documento_n: req.body.documento_n,
        sucursal: req.body.sucursal,
        fecha: req.body.fecha,
        fecha2: req.body.fecha2,
        total: req.body.total,
        username: req.body.username,
        cliente:req.body.cliente,
        tipo_venta:req.body.tipo_venta,
        observaciones:req.body.observaciones,
        coste_transporte:req.body.coste_transporte,
        tipoDocumento:req.body.tipoDocumento,
        cotizacion:req.body.cotizacion,
        subtotalF1:req.body.subtotalF1,
        subtotalF2:req.body.subtotalF2,
        totalIva:req.body.totalIva,
        nota:req.body.nota,
        productosVendidos:req.body.productosVendidos,
        totalDescuentos:req.body.totalDescuentos,
        estado:req.body.estado
    };
    await Proformas.findByIdAndUpdate(id, {$set: proformas}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await Proformas.findByIdAndRemove(req.params.id);
    res.json({status: 'Factura Eliminada'});
})


router.put('/actualizarNota/:id/:nota', async (req, res,next) => {
    const { id } = req.params;
    const { nota } = req.params;
    await Proformas.findByIdAndUpdate(id, {$set: {nota:nota}}, {new: true});
    res.json({status: 'factura Updated'});  
})



router.post('/newProforma', async (req, res) => {
   const NewProforma = new Proformas({
        documento_n: req.body.documento_n,
        sucursal: req.body.sucursal,
        fecha: req.body.fecha,
        fecha2: req.body.fecha2,
        total: req.body.total,
        username: req.body.username,
        cliente:req.body.cliente,
        tipo_venta:req.body.tipo_venta,
        observaciones:req.body.observaciones,
        coste_transporte:req.body.coste_transporte,
        dni_comprador:req.body.dni_comprador,
        totalDescuento:req.body.totalDescuento,
        tipoDocumento:req.body.tipoDocumento,
        cotizacion:req.body.cotizacion,
        subtotalF1:req.body.subtotalF1,
        subtotalF2:req.body.subtotalF2,
        totalIva:req.body.totalIva,
        nota:req.body.nota,
        productosVendidos:req.body.productosVendidos,
        totalDescuentos:req.body.totalDescuentos,
        estado:req.body.estado
    });
    await NewProforma.save();
    res.json({status: 'Factura CREADA'});
});


module.exports = router;