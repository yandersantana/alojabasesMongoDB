const { Router } = require('express');
const router = Router();
const SubCuenta = require('../models/subCuentas')

router.post('/newSubCuenta', async (req, res) => {
    console.log(req)
    const newSubCuenta = new SubCuenta({ 
      nombre:req.body.nombre,
      id_cuenta:req.body.idCuenta,
      mcaCajaMenor:req.body.mcaCajaMenor
    });
    await newSubCuenta.save();
    res.json({status: 'Cuenta creada'});
});


router.get('/getSubCuentas', async (req, res) => {
    const subCuenta = await SubCuenta.find();
    res.send(subCuenta)      
})


router.post("/getSubCuentasPorId/:cuenta", async (req, res, next) => {
  const { cuenta } = req.params;
  const cuentas = await SubCuenta.find({
     id_cuenta: cuenta,
  });
  res.json(cuentas);
});


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newSubCuenta ={ 
            nombre:req.body.nombre,
            id_cuenta:req.body.id_cuenta,
            mcaCajaMenor:req.body.mcaCajaMenor};
    await SubCuenta.findByIdAndUpdate(id, {$set: newSubCuenta}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await SubCuenta.findByIdAndRemove(req.params.id);
    res.json({status: 'Cliente Eliminado'});
})


module.exports = router;

