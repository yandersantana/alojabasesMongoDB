
const { Router } = require('express');
const router = Router();
const ProductosCombos = require('../models/comboProductos');

router.post('/newComboProductos', async (req, res) => {
    const newComboProductos = new ProductosCombos({ 
      producto:req.body.producto, 
      nombreProducto:req.body.nombreProducto, 
      cantidad:req.body.cantidad,
      precioMin:req.body.precioMin,
      costo: req.body.costo,
      precioCombo:req.body.precioCombo,
      precioVenta:req.body.precioVenta,
      calculo:req.body.calculo
    });
    await newComboProductos.save();
    res.json({status: 'Cliente creado'});
});





module.exports = router;

