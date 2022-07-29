
const { Router } = require('express');
const router = Router();
const ProductosCombos = require('../models/comboProductos');

router.post('/newComboProducto', async (req, res) => {
    const newComboProductos = new ProductosCombos({ 
      PRODUCTO:req.body.PRODUCTO, 
      CLASIFICA:req.body.CLASIFICA, 
      precio:req.body.precio,
      estado:"ACTIVO",
      cantidadProductos : req.body.cantidadProductos,
      productosCombo: req.body.productosCombo
    });
    await newComboProductos.save();
    res.json({status: 'Combo creado'});
});


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newComboProductos = {
          PRODUCTO:req.body.PRODUCTO, 
          CLASIFICA:req.body.CLASIFICA, 
          precio:req.body.precio,
          estado:req.body.estado,
          cantidadProductos : req.body.cantidadProductos,
          productosCombo: req.body.productosCombo
    };
    await ProductosCombos.findByIdAndUpdate(id, {$set: newComboProductos}, {new: true});
    res.json({status: 'factura Updated'});  
})


router.get('/getComboProductos', async (req, res) => {
    const combos = await ProductosCombos.find();
    res.send(combos)      
})

router.post('/getComboPorNombre', async (req, res, next) => {
    const documentos = await ProductosCombos.find({ PRODUCTO: req.body.PRODUCTO});
    res.json(documentos);
});

router.post('/getComboPorNombreProducto', async (req, res, next) => {
    const documentos = await ProductosCombos.find({ "productosCombo.nombreProducto": req.body.PRODUCTO});
    res.json(documentos);
});

router.delete('/delete/:id', async (req, res,next) => {
    await ProductosCombos.findByIdAndRemove(req.params.id);
    res.json({status: 'Combo Eliminado'});
})





module.exports = router;

