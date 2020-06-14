const { Router } = require('express');
const router = Router();
const User = require('../models/user')
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => res.send('Holly Molly'))


router.post('/register', async (req, res) => {
	if(req.body.password){}
    const { email, password, name, lastname, status } = req.body;
    const newUser = new User({ email, password, name, lastname , status});
    console.log(newUser);
    await newUser.save();
    /*const token = await jwt.sign({_id: newUser._id}, 'secretkey');
    res.status(200).json({token});  esto guarda el id de un nuevo usuario si fuera el caso de que
    el usuario haga su registro y quiere mantener la sesion iniciada*/
    res.send("Registrado");

});


router.post('/signInGoogle', async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).send('Correo no existe');
   // if (user.password !== password) return res.status(401).send('Wrong Password');
    const token = jwt.sign({ _id: user.token }, 'secretkey');

    return res.status(200).json({ token });
});


router.get('/dashboard', verifyToken, (req, res) => {//para rutas privadas
    
           
});

async function verifyToken(req, res, next) {
	try {
		if (!req.headers.authorization) {//revisa si en cada petición existe una cabecera autorizacion
			return res.status(401).send('Unauhtorized Request');
		}
		let token = req.headers.authorization.split(' ')[1];
		if (token === 'null') {// si existe revisa que el token no este vacio
			return res.status(401).send('Unauhtorized Request');
		}

		const payload = await jwt.verify(token, 'secretkey');
		if (!payload) { //si no esta vacio extrae los datos del token
			return res.status(401).send('Unauhtorized Request');
		}
		req.userId = payload._id;
		next();
	} catch(e) {
		return res.status(401).send('Unauhtorized Request');
	}
}

router.get('/getUsers', async (req, res) => {
    const grupos = await User.find();
    res.send(grupos)      
})

router.get('/getUsers2', async (req, res) => {
    const grupos = await User.find({"empresa":"Webbi"});
    res.send(grupos)      
})

router.get('/getUsers/:id', async (req, res) => {
    const { id } = req.params;
	const grupos = await User.findById(id);
	res.json(grupos);   
})


router.get('/getUsers1/:correo', async (req, res) => {
    const { correo } = req.params;
    const grupos = await User.find({"email":correo});
   // console.log("sss "+grupos)
    res.json(grupos); 
})



router.post('/newUser', async (req, res) => {
    const { email, password, name, rol,grupo,sucursal,numUsuarios,username, status } = req.body;
    const emailExiste = await User.findOne({ email });
    console.log("Mail exiw"+emailExiste);
    if (emailExiste){
        return  res.status(401).send('Correo ya está asociado a otra cuenta');
    } 
    else{
        const { email, password, name, rol,sucursal,numUsuarios,username,imageProfile, status } = req.body;
        const newUser = new User({ email, password, name, rol,sucursal,numUsuarios,username,imageProfile, status});
        
        console.log(newUser);
        await newUser.save();
        res.json({status: 'user creado'});
    }

});

router.post('/signIn', async (req, res) => {
    console.log("llegie aquiii")
    const { email, password } = req.body;
    console.log("dd "+email + password)
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send('La cuenta no existe');
    if (user.password !== password) return res.status(401).send('Contraseña Incorrecta');
    const token = jwt.sign({ _id: user._id }, 'secretkey');
    return res.status(200).json({ token });
});


//actualizar un solo usuario

router.put('/updateUser/:id', async (req, res,next) => {
  
    const { id } = req.params;
    const user = {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        username: req.body.username,
        grupo: req.body.grupo,
        empresa: req.body.empresa,
        status:req.body.status,
        imageProfile: req.body.imageProfile,
    };
    await User.findByIdAndUpdate(id, {$set: user}, {new: true});
    res.json({status: 'Perfil Actualizado'});  
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    /* const { email, password, name, rol,grupo,empresa,numUsuarios } = req.body;
    const newUser = new User({ email, password, name, rol ,grupo,empresa,numUsuarios}); */
    const usuario = {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        username: req.body.username,
        grupo: req.body.grupo,
        empresa: req.body.empresa,
        status:req.body.status
        //numUsuarios: req.body.numUsuarios,
    };
    console.log(usuario)
    await User.findByIdAndUpdate(id, {$set: usuario}, {new: true});
    res.json({status: 'User Updated'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await User.findByIdAndRemove(req.params.id);
    res.json({status: 'USER Deleted'});
})




module.exports = router;