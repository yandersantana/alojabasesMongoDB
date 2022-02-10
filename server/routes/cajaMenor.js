const { Router } = require('express');
const router = Router();
const CajaMenor = require('../models/cajaMenor')

router.post('/newCajaMenor', async (req, res) => {
    const newCajaMenor = new CajaMenor({ 
        idDocumento:req.body.idDocumento,
        fecha:req.body.fecha,
        usuario:req.body.usuario,
        sucursal:req.body.sucursal,
        estado:req.body.estado,
        totalIngresos:req.body.totalIngresos,
        totalSalidas:req.body.totalSalidas,
        totalRC:req.body.totalRC,
        total:req.body.total,
        resultado:req.body.resultado,
        estadoCaja:req.body.estadoCaja
    });
    await newCajaMenor.save();
    res.json({status: 'Cuenta creada'});
});


router.get('/getCajasMenor', async (req, res) => {
    const comprobante = await CajaMenor.find();
    res.send(comprobante)      
});


router.post('/getCajaMenorPorIdConsecutivo', async (req, res, next) => {
  const documentos = await CajaMenor.find({
    idDocumento: req.body.idDocumento
  });
  res.json(documentos);
});


router.post('/getCajaMenorPorFecha', async (req, res, next) => {
  const documentos = await CajaMenor.find({ fecha: req.body.fecha});
  res.json(documentos);
});


router.post('/getCajasMenorPorId', async (req, res, next) => {
  const documentos = await CajaMenor.find({
    _id: req.body._id
  });
  res.json(documentos);
});


router.post('/getCajasMenorPorIdConsecutivo', async (req, res, next) => {
  const documentos = await CajaMenor.find({
    idDocumento: req.body.idDocumento
  });
  res.json(documentos);
});


router.post("/getCajaMenorPorRango", async (req, res, next) => {
  var start = req.body.fechaAnterior;
  var end = req.body.fechaActual;
  const cajasMenor = await CajaMenor.find({
    createdAt: {
      $gte: start,
      $lt: end,
    },
  });
  res.json(cajasMenor);
});


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newCajaMenor ={ 
                  estado:req.body.estado,
                  totalIngresos:req.body.totalIngresos,
                  totalSalidas:req.body.totalSalidas,
                  totalRC:req.body.totalRC,
                  total:req.body.total,
                  resultado:req.body.resultado,
                  estadoCaja:req.body.estadoCaja};
    await CajaMenor.findByIdAndUpdate(id, {$set: newCajaMenor}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await CajaMenor.findByIdAndRemove(req.params.id);
    res.json({status: 'Comprobante Eliminado'});
})

router.put("/updateEstado/:id/:estado", async (req, res, next) => {
  const { id } = req.params;
  const { estado } = req.params;
  await CajaMenor.findByIdAndUpdate( id,{ $set: { estado: estado } },{ new: true } );
  res.json({ status: "caja Updated" });
});



module.exports = router;

