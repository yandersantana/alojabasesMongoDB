
const { Router } = require('express');
const router = Router();
const Catalogo = require('../models/catalogo')

router.post('/newCatalogo', async (req, res) => {
    console.log("entre aqui ")
    const newPCatalogo = new Catalogo({ PRODUCTO:req.body.PRODUCTO,
        NOMBRE_PRODUCTO:req.body.NOMBRE_PRODUCTO, 
        CLASIFICA:req.body.CLASIFICA, 
        REFERENCIA:req.body.REFERENCIA,
        UNIDAD:req.body.UNIDAD,
        DIM: req.body.DIM,
        NOMBRE_COMERCIAL:req.body.NOMBRE_COMERCIAL,
        P_CAJA:req.body.P_CAJA,
        M2:req.body.M2,
        CAL:req.body.CAL,
        CASA:req.body.CASA,
        TIPO:req.body.TIPO,
        ORIGEN:req.body.ORIGEN,
        porcentaje_ganancia:req.body.porcentaje_ganancia,
        APLICACION:req.body.APLICACION,
        VIGENCIA:req.body.VIGENCIA,
        FEC_PRODUCCION:req.body.FEC_PRODUCCION,
        CANT_MINIMA:req.body.CANT_MINIMA,
        ESTADO:req.body.ESTADO,
        IMAGEN:req.body.IMAGEN,
        IMAGEN_PRINCIPAL:req.body.IMAGEN_PRINCIPAL,
        estado2:req.body.estado2});
    await newPCatalogo.save();
    res.json({status: 'Catalogo creado'});
});


router.get('/getCatalogo/:id', async (req, res) => {
    const { id } = req.params;
    const catalogo = await Catalogo.findById(id);
    res.json(catalogo); 
})

router.get('/getCatalogos', async (req, res) => {
    const catalogo = await Catalogo.find();
    res.json(catalogo); 
})

router.put('/update/:id', async (req, res,next) => {
    console.log("entrando")
    const { id } = req.params;
    const newPCatalogo ={ PRODUCTO:req.body.PRODUCTO,
        NOMBRE_PRODUCTO:req.body.NOMBRE_PRODUCTO, 
        CLASIFICA:req.body.CLASIFICA, 
        REFERENCIA:req.body.REFERENCIA,
        UNIDAD:req.body.UNIDAD,
        DIM: req.body.DIM,
        NOMBRE_COMERCIAL:req.body.NOMBRE_COMERCIAL,
        P_CAJA:req.body.P_CAJA,
        M2:req.body.M2,
        CAL:req.body.CAL,
        CASA:req.body.CASA,
        TIPO:req.body.TIPO,
        ORIGEN:req.body.ORIGEN,
        porcentaje_ganancia:req.body.porcentaje_ganancia,
        APLICACION:req.body.APLICACION,
        VIGENCIA:req.body.VIGENCIA,
        FEC_PRODUCCION:req.body.FEC_PRODUCCION,
        CANT_MINIMA:req.body.CANT_MINIMA,
        ESTADO:req.body.ESTADO,
        IMAGEN:req.body.IMAGEN,
        IMAGEN_PRINCIPAL:req.body.IMAGEN_PRINCIPAL,
        estado2:req.body.estado2};
    await Catalogo.findByIdAndUpdate(id, {$set: newPCatalogo}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateAplicacion/:producto/:aplicacion', async (req, res,next) => {
    const { producto } = req.params;
    const { aplicacion } = req.params;
    console.log("si lo hice"+aplicacion)
    await Catalogo.findOneAndUpdate({"PRODUCTO":producto}, {$set: {APLICACION:aplicacion}}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.delete('/delete/:id', async (req, res,next) => {
    await Catalogo.findByIdAndRemove(req.params.id);
    res.json({status: 'Catálogo Eliminado'});
})


module.exports = router;

