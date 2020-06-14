
const { Router } = require('express');
const router = Router();
const Cliente = require('../models/clientes')

router.post('/newCliente', async (req, res) => {
    const newCliente = new Cliente({ 
        cliente_nombre:req.body.cliente_nombre, 
        t_cliente:req.body.t_cliente, 
        ruc:req.body.ruc,
        direccion:req.body.direccion,
        celular: req.body.celular,
        tventa:req.body.tventa});
    await newCliente.save();
    res.json({status: 'Cliente creado'});
});


router.get('/getCliente/:id', async (req, res) => {
    const { id } = req.params;
    const cliente = await Cliente.findById(id);
    res.json(cliente); 
})

router.get('/getClientes', async (req, res) => {
    const clientes = await Cliente.find();
    res.send(clientes)      
})

router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newCliente ={ 
        cliente_nombre:req.body.cliente_nombre, 
        t_cliente:req.body.t_cliente, 
        ruc:req.body.ruc,
        direccion:req.body.direccion,
        celular: req.body.celular,
        tventa:req.body.tventa};
    await Cliente.findByIdAndUpdate(id, {$set: newCliente}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await Cliente.findByIdAndRemove(req.params.id);
    res.json({status: 'Cliente Eliminado'});
})


module.exports = router;

