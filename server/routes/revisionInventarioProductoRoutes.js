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
      piezas:req.body.piezas});
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





router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newCombo ={ 
        usuario:req.body.usuario, 
        nombreCombo:req.body.nombreCombo, 
        cantidadProductos:req.body.cantidadProductos, 
        arrayProductos:req.body.arrayProductos,
        precioVenta:req.body.precioVenta};
    await Combos.findByIdAndUpdate(id, {$set: newCombo}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await Combos.findByIdAndRemove(req.params.id);
    res.json({status: 'Cliente Eliminado'});
})


module.exports = router;

