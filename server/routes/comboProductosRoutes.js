
const { Router } = require('express');
const router = Router();
const ProductosCombos = require('../models/comboProductos');

router.post('/newComboProducto', async (req, res) => {
    const newComboProductos = new ProductosCombos({ 
      PRODUCTO:req.body.PRODUCTO, 
      CLASIFICA:req.body.CLASIFICA, 
      precio:req.body.precio,
      estado:req.body.estado,
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



module.exports = router;

