
const { Router } = require('express');
const router = Router();
//const upload = require('./upload');
const multipart = require('connect-multiparty');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const Documentos = require('../models/documento');
const express = require('express'),
  path = require('path'),
  cors = require('cors'),
  multer = require('multer');

var express = require('express'); //Express Web Server 
var busboy = require('connect-busboy'); //middleware for form/file upload 
var path = require('path');  //used for file path 
var fs = require('fs-extra');  //File System - for file manipulation 

var app = express(); 
app.use(busboy()); 
app.use(express.static(path.join(__dirname, 'uploads'))); 
/*router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));*/

/* const multipartMiddleware = multipart({
    uploadDir: './uploads'
}); */

var upload = multer({ dest: './uploads' });

router.post('/api/upload', multipartMiddleware, (req, res) => {
    var file=req.files
    console.log("files "+JSON.stringify(file))
    for (var i = 0; i < file .length; i++) {//para cuando sean varios documentos
        var pathy = file[i]
        console.log("ddd "+pathy.path)
      }
    //console.log(file.uploads.path)
        res.json({
            'message': 'File uploaded succesfully.',
            'url':'http://localhost:3000/'
        });
   
    /* res.json({
        'message': 'File uploaded succesfully.'
    }); */

    
});

router.post('/uploadFile', upload.single('avatar'),  function(req, res) {
  console.log(req.files); // JSON Object
});
 

router.post('/uploadNew',function (req, res, next) { 

     var fstream; 
     req.pipe(req.busboy); 
     req.busboy.on('file', function (fieldname, file, filename) { 
      console.log("Uploading: " + filename); 

      //Path where image will be uploaded 
      fstream = fs.createWriteStream(__dirname + '/img/' + filename); 
      file.pipe(fstream); 
      fstream.on('close', function() {  
       console.log("Upload Finished of " + filename);    
       res.redirect('back');   //where to go next 
      }); 
     }); 
}); 


//app.use(multer({ dest: '/tmp/'}).single('file'))

// File upload settings  
const PATH = './uploads';

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

let upload = multer({
  storage: storage
});

 router.post('/uploadFile', multipartMiddleware, (req, res, next) => {
  // console.log("sss "+bodyParser.text([req]))
   var file=req.files.uploads
   console.log("files "+JSON.stringify(file))
    for (var i = 0; i < file .length; i++) {//para cuando sean varios documentos
        var pathy = file[i]
      }
   

      var sizeKb = 1024;
      var sizeMb = sizeKb * sizeKb;
      var sizeGb = sizeMb * sizeKb;
      var tamaño=pathy.size.length
      console.log("el tamaño es"+tamaño)

    console.log(file.length);
    console.log(file[0].path);
    res.json({
        'message': 'File uploaded succesfully.',
        'url':'http://161.35.224.215/'+pathy.path,
        'size': parseInt(pathy.size/1024)
        
    });
});  


// POST File
/* router.post('/uploadFile', upload.single(fieldname), function (req, res) {
    if (!req.file) {
      console.log("No file is available!");
      return res.send({
        success: false
      });
  
    } else {
      console.log('File is available!');
      return res.send({
        success: true
      })
    }
});
 */


/* 
router.post('/uploadFile', function (req, res) {
    console.log(req.file.name);
    console.log(req.file.path);
    console.log(req.file.type);
    var file = __dirname + "/" + req.file.name;
 
    fs.readFile( req.file.path, function (err, data) {
       fs.writeFile(file, data, function (err) {
          if( err ){
             console.log( err );
             }else{
                response = {
                   message:'File uploaded successfully',
                   filename:req.file.name
                };
             }
          console.log( response );
          res.end( JSON.stringify( response ) );
       });
    });
 }) */
  

router.get('/', function(req, res) {
    let ruta= req.body.ruta
    res.sendFile(uploads + ruta);
  })

router.get('/getDocumentos', async (req, res) => {
    const documentos = await Documentos.find();
    res.send(documentos)      
})

router.get('/getDocumentos3/:clase', async (req, res) => {
    const { clase } = req.params;
    const clases = await Documentos.find({"clase":clase});
    res.json(clases); 
})

router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const newDoc = {
        clasedoc_name: req.body.clasedoc_name,
        clasedoc_description: req.body.clasedoc_description,
        clasedoc_empresa: req.body.clasedoc_empresa,
        clasedoc_tamanoMax: req.body.clasedoc_tamanoMax,
        clasedoc_cantidadMax: req.body.clasedoc_cantidadMax,
        clasedoc_cantidadDoc: req.body.clasedoc_cantidadDoc,
        clasedoc_indicesNum: req.body.clasedoc_indicesNum,
        clasedoc_estado: req.body.clasedoc_estado,
        newdoc_indices: req.body.newdoc_indices
    };
    await Documentos.findByIdAndUpdate(id, {$set: newDoc}, {new: true});
    res.json({status: 'Documentos Updated'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await Documentos.findByIdAndRemove(req.params.id);
    res.json({status: 'Documentos Deleted'});
})


router.post('/newDocument', async (req, res) => {
    const newDoc = new Documentos({ 
        clase: req.body.clase,
        nombreDocumento: req.body.nombreDocumento,
        version: req.body.version,
        urlDocumento: req.body.urlDocumento,
        creadoPor: req.body.creadoPor,
        fechaCreacion: req.body.fechaCreacion,
        tamanoArchivo: req.body.tamanoArchivo,
        newdoc_indices: req.body.newdoc_indices});
    console.log("ttt "+newDoc);
    await newDoc.save();
    res.json({status: 'Documento CREADo'});
});


module.exports = router;