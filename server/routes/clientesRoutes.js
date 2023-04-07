
const { Router } = require('express');
const router = Router();
const Cliente = require('../models/clientes');
const { runInNewContext } = require('vm');

router.post('/newCliente', async (req, res) => {
    const newCliente = new Cliente({ 
        cliente_nombre:req.body.cliente_nombre, 
        t_cliente:req.body.t_cliente, 
        ruc:req.body.ruc,
        direccion:req.body.direccion,
        celular: req.body.celular,
        tventa:req.body.tventa,
        telefono:req.body.telefono,
        correo:req.body.correo,
        nombreContacto:req.body.nombreContacto,
        direccionContacto:req.body.direccionContacto,
        ciudad:req.body.ciudad,
        celularContacto:req.body.celularContacto,
        fechaNacimiento:req.body.fechaNacimiento,
        notas:req.body.notas,
        regimen:req.body.regimen,
        forma_pago:req.body.forma_pago,
        dias_credito:req.body.dias_credito,
        cupo_maximo:req.body.cupo_maximo,
        tipoCliente:req.body.tipoCliente,
        estado:req.body.estado
    });
    await newCliente.save();
    res.json({status: 'Cliente creado'});
});


router.get('/getCliente/:id', async (req, res) => {
    const { id } = req.params;
    const cliente = await Cliente.findById(id);
    res.json(cliente); 
})

router.get('/getClientesActivos', async (req, res) => {
    const clientes = await Cliente.find({estado:{ $in: [ "Activo", null]}});
    //const clientes = await Cliente.find({estado:{ $ne: [ "Inactivo"]}});
    res.send(clientes)      
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
        tventa:req.body.tventa,
        telefono:req.body.telefono,
        correo:req.body.correo,
        nombreContacto:req.body.nombreContacto,
        direccionContacto:req.body.direccionContacto,
        ciudad:req.body.ciudad,
        celularContacto:req.body.celularContacto,
        fechaNacimiento:req.body.fechaNacimiento,
        notas:req.body.notas,
        regimen:req.body.regimen,
        forma_pago:req.body.forma_pago,
        dias_credito:req.body.dias_credito,
        cupo_maximo:req.body.cupo_maximo,
        tipoCliente:req.body.tipoCliente,
        estado:req.body.estado};
    await Cliente.findByIdAndUpdate(id, {$set: newCliente}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})

router.put('/updateClienteDataContacto/:id', async (req, res,next) => {
    const { id } = req.params;
    const newCliente ={ 
        direccion:req.body.direccion,
        celular: req.body.celular,
        correo:req.body.correo};
    await Cliente.findByIdAndUpdate(id, {$set: newCliente}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})




router.delete('/delete/:id', async (req, res,next) => {
    await Cliente.findByIdAndRemove(req.params.id);
    res.json({status: 'Cliente Eliminado'});
})


module.exports = router;

