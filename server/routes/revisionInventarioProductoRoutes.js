const { Router } = require('express');
const router = Router();
const RevisionInventarioProducto = require('../models/revisionInventarioProducto')

router.post('/newRevisionInventarioProducto', async (req, res) => {
    const newRevision = new RevisionInventarioProducto({ 
      idReferenciaRevision:req.body.idReferenciaRevision, 
      producto:req.body.producto, 
      fecha:req.body.fecha,
      estado:req.body.estado,
      detalle:req.body.detalle,
      novedades:req.body.novedades,
      cajas:req.body.cajas,
      piezas:req.body.piezas,
      m2_conteo:req.body.m2_conteo,
      cajas_sistema:req.body.cajas_sistema,
      piezas_sistema:req.body.piezas_sistema,
      m2_sistema:req.body.m2_sistema,
      cajas_diferencia:req.body.cajas_diferencia,
      piezas_diferencia:req.body.piezas_diferencia,
      m2_diferencia:req.body.m2_diferencia,
      resultado:req.body.resultado
    });
    await newRevision.save();
    res.json({status: 'Revision creada'});
});


router.get('/getRevisionesProductos', async (req, res) => {
    const revisiones = await RevisionInventarioProducto.find();
    res.send(revisiones)      
})


router.post('/getRevisionesProductosPorId/:id', async (req, res) => {
     const { id } = req.params;
    const revisiones = await RevisionInventarioProducto.find({ idReferenciaRevision: id });
    res.send(revisiones)      
})


router.delete('/delete/:id', async (req, res,next) => {
    await RevisionInventarioProducto.findByIdAndRemove(req.params.id);
    res.json({status: 'Revision Eliminado'});
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newCombo ={ 
            estado:req.body.estado,
            detalle:req.body.detalle,
            novedades:req.body.novedades,
            cajas:req.body.cajas,
            piezas:req.body.piezas,
            m2_conteo:req.body.m2_conteo,
            cajas_sistema:req.body.cajas_sistema,
            piezas_sistema:req.body.piezas_sistema,
            m2_sistema:req.body.m2_sistema,
            cajas_diferencia:req.body.cajas_diferencia,
            piezas_diferencia:req.body.piezas_diferencia,
            m2_diferencia:req.body.m2_diferencia,
            resultado:req.body.resultado
        };
    await RevisionInventarioProducto.findByIdAndUpdate(id, {$set: newCombo}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})





module.exports = router;

