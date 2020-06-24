const { Router } = require('express');
const router = Router();
const DocumentoGenerado = require('../models/documentoGeneradoEntrega')

router.get('/getDocumentosGenerado', async (req, res) => {
    const devoluciones = await DocumentoGenerado.find();
    res.send(devoluciones)      
})

router.put('/updateEstado/:id/:estado', async (req, res,next) => {
    const { id } = req.params;
    const { estado } = req.params;
    await DocumentoGenerado.findByIdAndUpdate(id, {$set: {estado:estado}}, {new: true});
    res.json({status: 'factura Updated'});  
})

router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const documentoGenerado = {
        idDocumento: req.body.idDocumento,
        tipoDocumento: req.body.tipoDocumento,
        Ndocumento: req.body.Ndocumento,
        arreEntregas: req.body.arreEntregas,
        fecha: req.body.fecha,
        fechaEntrega: req.body.fechaEntrega,
        observaciones:req.body.observaciones,
        estado:req.body.estado
    };
    await DocumentoGenerado.findByIdAndUpdate(id, {$set: documentoGenerado}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await DocumentoGenerado.findByIdAndRemove(req.params.id);
    res.json({status: 'Factura Eliminada'});
})

router.post('/newDocumentoGenerado', async (req, res) => {
   const newDocumento = new DocumentoGenerado({
    idDocumento: req.body.idDocumento,
    tipoDocumento: req.body.tipoDocumento,
    Ndocumento: req.body.Ndocumento,
    arreEntregas: req.body.arreEntregas,
    fecha: req.body.fecha,
    fechaEntrega: req.body.fechaEntrega,
    observaciones:req.body.observaciones,
    estado:req.body.estado
    });
    await newDocumento.save();
    res.json({status: 'Factura CREADA'});
});


module.exports = router;