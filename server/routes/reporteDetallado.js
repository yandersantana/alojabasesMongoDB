
const { Router } = require('express');
const router = Router();
const ReporteDetallado = require('../models/reporteDetallado');
const { runInNewContext } = require('vm');

router.post('/newReporteDet', async (req, res) => {
    const newReporteDet = new ReporteDetallado({ 
        fecha:req.body.fecha, 
        notas:req.body.notas
    });
    await newReporteDet.save();
    res.json({status: 'ReporteDetallado creado'});
});


router.get('/getReporte/:id', async (req, res) => {
    const { id } = req.params;
    const newReporteDet = await ReporteDetallado.findById(id);
    res.json(newReporteDet); 
})

router.get('/getReportes', async (req, res) => {
    const reportesDet = await ReporteDetallado.find();
    res.send(reportesDet)      
})

router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newReporte ={ 
        fecha:req.body.fecha, 
        notas:req.body.notas};
    await ReporteDetallado.findByIdAndUpdate(id, {$set: newReporte}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await ReporteDetallado.findByIdAndRemove(req.params.id);
    res.json({status: 'ReporteDetallado Eliminado'});
})


module.exports = router;

