const { Router } = require('express');
const router = Router();
const Parametrizaciones = require('../models/parametrizacionesGenerales')

router.get('/:nombre', async (req, res) => {
    const parametrizacion = await Parametrizaciones.findOne({ name: req.params.nombre });
    res.send(parametrizacion)      
})

router.patch('/:nombre', async (req, res) => {
    await Parametrizaciones.findOneAndUpdate({ name: req.params.nombre }, {value: req.body.value});
    res.json({status: 'Parametrizacion actualizada'});
});


module.exports = router;