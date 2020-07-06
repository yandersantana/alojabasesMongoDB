
const { Router } = require('express');
const router = Router();
//const upload = require('./upload');
const multipart = require('connect-multiparty');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const express = require('express'),
  path = require('path'),
  multer = require('multer');
  
  var fs = require('fs');
  var busboy = require('connect-busboy');
  //...
 
  router.use(busboy());
const multipartMiddleware = multipart({
    uploadDir: './server/uploads'
});
 
var upload = multer({ dest: './server/uploads/' })
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
 

router.post('/uploadNew', function(req, res) {
    var fstream;
    req.pipe(req.busboy);
    console.log("ssss"+req.busboy)
    
});

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './server/uploads');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


 router.post('/uploadFile', multipartMiddleware, (req, res, next) => {
     console.log("llegue aqui ")
     console.log(req.files.upload)
   var file=req.files.upload
   console.log("files tt "+file)
    

    //console.log(file.length);
    console.log(file[0].path);
    res.json({
        'message': 'File uploaded succesfully.',
        //'url':'http://ofistoreserver.herokuapp.com/'+pathy.path,
        'url':'http://localhost:3000/'+pathy.path,
        //'url':'https://www.w3schools.com/css/default.asp',

        'size': parseInt(pathy.size/1024)
        
    });
    res.status(500).json(error);
});  

router.post('/uploadNew5', upload.single('uploadedFiles'), function(req, res, next){
    console.log("file"+req.file+req.files);
    res.send('Successfully uploaded!');
  });



  router.post('/uploadBulkFile', multipartMiddleware, (req, res) => {
    var file = req.files
   /*  console.log(file)
    for (var i = 0; i < file.length; i++) {//para cuando sean varios documentos
      var pathy = file[i]
      console.log(pathy)
    } */
    //console.log(pathy)
    var ruta="http://104.248.14.190:3000/"+file.file.path
    res.json(ruta);
  
  });
  
  router.get('/files', async (req, res) => {
  
    for (var i = 0; i < fileBulk.length; i++) {//para cuando sean varios documentos
      var pathy = fileBulk[i]
    }
    res.json(pathy);
  
  });


  var fileupload = require("express-fileupload");
  router.use(fileupload());
  router.post("/upload23", function(req, res)
{
    var file;

    if(!req.files)
    {
        res.send("File was not found");
        return;
    }

    file = req.files.FormFieldName;  // here is the field name of the form
    console.log("ssss"+file)
    res.send("File Uploaded");


});



router.post('/upload3', (req, res) => {
    // 10 is the limit I've defined for number of uploaded files at once
    // 'multiple_images' is the name of our file input field
    console.log("33333333")
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).array('multiple_images', 10);

    upload(req, res, function(err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        // The same as when uploading single images

        let result = "You have uploaded these images: <hr />";
        const files = req.files;
        let index, len;

        // Loop through all the uploaded images and display them on frontend
        for (index = 0, len = files.length; index < len; ++index) {
            result += `<img src="${files[index].path}" width="300" style="margin-right: 20px;">`;
        }
        result += '<hr/><a href="./">Upload more images</a>';
        res.send(result);
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
  
/* 
router.get('/', function(req, res) {
    let ruta= req.body.ruta
    res.sendFile(uploads + ruta);
  })

router.get('/getDocumentos', async (req, res) => {
    const documentos = await Documentos.find();
    res.send(documentos)      
})

router.post('/DocumentosByClass/', async (req, res) => {

  const documentos = await Documentos.find({"clase":req.body.clasedoc_name,"empresa":req.body.clasedoc_empresa});
  console.log(documentos)
  res.json(documentos); 
})

router.get('/getDocumentos3/:clase', async (req, res) => {
    const { clase } = req.params;
    const clases = await Documentos.find({"clase":clase});
    res.json(clases); 
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
        empresa: req.body.empresa,
        newdoc_indices: req.body.newdoc_indices,
        versionesUrl:req.body.versionesUrl});
    console.log("ttt "+newDoc);
    await newDoc.save();
    //res.send("empresa registrado");
    res.json({status: 'Documento CREADo'});
}); */


module.exports = router;