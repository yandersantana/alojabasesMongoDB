import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { catalogo, opcionesCatalogo } from './catalogo';
import { element } from 'protractor';
import { on, trigger, off } from "devextreme/events";
import Swal from 'sweetalert2';
import { producto } from '../ventas/venta';
import { DxGanttComponent, DxGalleryComponent } from 'devextreme-angular';
import { ENGINE_METHOD_STORE } from 'constants';
import { R3TargetBinder } from '@angular/compiler';
import { NumericRule } from 'devextreme/ui/validation_engine';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {
  titulo:string="ksjdksjd"
  base64textString:String="";
  popupvisible:boolean=false
  popupvisible2:boolean=false
  popupVi:boolean=false
  productosCatalogo:catalogo[]=[]
  productosCatalogoElim:catalogo[]=[]
  productosCatalogoUso:catalogo[]=[]
  catalogo:catalogo
  catalogoLeido:catalogo
  imagenes:string[]
  imagenesData:string[]
  slideshowDelay=2000
  producto:string
  imagenPrincipal:string
  menu1: string[] = [
    "Catálogo",
  "Administrar Productos"
  ];

  menuOrigen: string[] = [
    "Nacional",
  "Importado"
  ];

  menuTipo: string[] = [
    "Original",
  "Alterno"
  ];

  menuEstado: string[] = [
  "ACTIVO",
  "INACTIVO"
  ];

  opcionesCatalogo: opcionesCatalogo[]=[]
  arrayClasif: string[]
  arrayUnid: string[]

  varM2:boolean=true
  varPC:boolean=true
  nuevoProducto:producto
  catalogo2 = {
    PRODUCTO:"",
    NOMBRE_PRODUCTO:"",
    CLASIFICA:"",
    REFERENCIA:"Sin Referencia",
    UNIDAD:"",
    DIM:"0",
    NOMBRE_COMERCIAL:"",
    P_CAJA:0,
    M2:0,
    CAL:"",
    CASA:"",
    TIPO:"",
    ORIGEN:"",
    ESTADO:"",
    APLICACION:"",
    VIGENCIA:"",
    FEC_PRODUCCION:"",
    CANT_MINIMA:0,
    IMAGEN:[],
    IMAGEN_PRINCIPAL:""

  }
  elementRef

  @ViewChild("gallery", { static: false }) galleryItem: DxGalleryComponent;
  /* @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;  
  
  private ctx: CanvasRenderingContext2D; */
  constructor(private db: AngularFirestore, public  afAuth:  AngularFireAuth,elementRef: ElementRef) { 
    this.catalogo2.ESTADO="ACTIVO"
    this.catalogo2.ORIGEN = "Nacional"
    this.catalogo2.TIPO= "Original"
    this.nuevoProducto= new producto()
//this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  ngOnInit() {
    this.getOpcionesCatalogo()
    this.db.collection('/catalogo').valueChanges().subscribe((data:catalogo[]) => {
      new Promise<any>((resolve, reject) => {
        this.productosCatalogo = data
      })
      this.separarProductos()
    })

    //this.verGaleria()
  }


  async getOpcionesCatalogo(){
    await this.db.collection('/opcionesCatalogo').snapshotChanges().subscribe((opciones) => {
      new Promise<any>((resolve, reject) => {
        opciones.forEach((nt: any) => {
          this.opcionesCatalogo.push(nt.payload.doc.data());
        })
      })
      this.llenarCombos()
    });;
  }

  buscarUnidad(e){
    console.log("entr aqui ")
    if(this.catalogo2.UNIDAD == "Metros"){
      console.log("sii")
      this.varM2=false
      this.varPC=false
    }else if(this.catalogo2.UNIDAD == "Juego"){
      this.varPC=false
    }else{
      this.varM2=true
      this.varPC=true
    }
  }


  separarProductos(){
    this.productosCatalogo.forEach(element=>{
      if(element.estado2!="Eliminado"){
        this.productosCatalogoUso.push(element)
      }else{
        this.productosCatalogoElim.push(element)
      }
    })
  }


  llenarCombos(){
    this.opcionesCatalogo.forEach(element=>{
      console.log(JSON.stringify(element))
         this.arrayUnid= element.arrayUnidades
         this.arrayClasif= element.arrayClasificación
         console.log("sdsdsd "+this.arrayClasif )
    })
  }

  mostrar(i:number){
    var x = document.getElementById("new");
    var y = document.getElementById("edit");
    var z = document.getElementById("delete");
    switch (i) {
      case 1:
        x.style.display = "block";
        y.style.display="none";
        z.style.display="none";
       break;
      case 2:
        x.style.display = "none";
        y.style.display="block";
        z.style.display="none";
        break;
      case 3:
        x.style.display = "none";
        y.style.display="none";
        z.style.display="block";
        break;
      default:    
    }      
  }

  asignarOrigen(e){
     this.catalogo2.ORIGEN= e.value
     console.log("asigne "+this.catalogo2.ORIGEN)
  }

  asignarTipo(e){
    this.catalogo2.TIPO= e.value
    console.log("asigne "+this.catalogo2.TIPO)
  }

  asignarEstado(e){
    this.catalogo2.ESTADO= e.value
    console.log("asigne "+this.catalogo2.ESTADO)
  }

  crearNuevoProducto(){
    this.nuevoProducto.PRODUCTO= this.catalogo2.PRODUCTO
    this.nuevoProducto.CAL= this.catalogo2.CAL
    this.nuevoProducto.CASA= this.catalogo2.CASA
    this.nuevoProducto.CLASIFICA= this.catalogo2.CLASIFICA
    this.nuevoProducto.ESTADO= this.catalogo2.ESTADO
    this.nuevoProducto.M2= this.catalogo2.M2
    this.nuevoProducto.P_CAJA= this.catalogo2.P_CAJA
    this.nuevoProducto.REFERENCIA= this.catalogo2.REFERENCIA
    this.nuevoProducto.UNIDAD= this.catalogo2.UNIDAD
    this.nuevoProducto.nombre_comercial= this.catalogo2.NOMBRE_COMERCIAL
    this.nuevoProducto.porcentaje_ganancia= 30
    this.nuevoProducto.precio= 0
    this.nuevoProducto.suc1Pendiente= 0
    this.nuevoProducto.suc2Pendiente= 0
    this.nuevoProducto.suc3Pendiente= 0
    this.nuevoProducto.sucursal1= 0
    this.nuevoProducto.sucursal2= 0
    this.nuevoProducto.sucursal3= 0
    this.nuevoProducto.bodegaProveedor=0

    if(this.nuevoProducto.M2 ==0){
      this.nuevoProducto.M2=1
    }
    if(this.nuevoProducto.P_CAJA ==0){
      this.nuevoProducto.P_CAJA=1
    }

    new Promise<any>((resolve, reject) => {
      this.db.collection("/productos").doc(this.catalogo2.PRODUCTO).set({ ...this.nuevoProducto }).then(res => {this.mostrarMensaje() }, err => reject(err));
    }) 
  }

  newProducto(){
    this.catalogo2.IMAGEN_PRINCIPAL= this.catalogo2.IMAGEN[0]
    this.catalogo2.PRODUCTO= this.catalogo2.CLASIFICA+" - "+this.catalogo2.NOMBRE_PRODUCTO +" - "+this.catalogo2.DIM
    this.comparardatos()
    this.comparardatos2()
    console.log("los datos soon "+JSON.stringify(this.catalogo2))
    if(this.catalogo2.PRODUCTO!="" && this.catalogo2.CLASIFICA!="" &&this.catalogo2.DIM!="" &&this.catalogo2.REFERENCIA!="" ){
      //this.catalogo2.IMAGEN[0]=+this.base64textString
      new Promise<any>((resolve, reject) => {
        this.mensajeGuardando()
        this.db.collection("/catalogo").doc(this.catalogo2.PRODUCTO).set({ ...this.catalogo2 }).then(res => { this.crearNuevoProducto()}, err =>{reject(err) , this.mensajeError()} );
      }) 

    }else{
      Swal.fire({
        title: 'Error',
        text: 'Hay campos obligatorios vacios',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }  
  }


  mensajeError(){
    Swal.fire({
      title: 'Error',
      text: 'Se ha producido un error al guardar, la imagen supera el limite de tamaño',
      icon: 'error',
      confirmButtonText: 'Ok'
    })
  }

  comparardatos(){
    var cont=0
    this.arrayUnid.forEach(element=>{
      if(element == this.catalogo2.UNIDAD){
        cont++
      }else{
        
      }
    })

    if(cont==0){
      this.arrayUnid.push(this.catalogo2.UNIDAD)
        this.db.collection("/opcionesCatalogo").doc("clasificacion").update({"arrayUnidades":this.arrayUnid})
    }
  }

  comparardatos2(){
    var cont=0
    this.arrayClasif.forEach(element=>{
      if(element == this.catalogo2.CLASIFICA){
        cont++
      }else{
        
      }
    })

    if(cont==0){
      this.arrayClasif.push(this.catalogo2.CLASIFICA)
        this.db.collection("/opcionesCatalogo").doc("clasificacion").update({"arrayClasificación":this.arrayClasif})
    }
  }

  
  mostrarMensaje(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se ha guardado su producto con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }

  mostrarMensajeEliminación(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se ha eliminado su producto con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }

  mostrarMensajeRestauración(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se ha restaurado su producto con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }


  mensajeGuardando(){
    Swal.close()
    let timerInterval
    Swal.fire({
      title: 'Guardando',
      html: 'Procesando',
      timerProgressBar: true,
      onBeforeOpen: () => {
        Swal.showLoading()
        timerInterval = setInterval(() => {
          const content = Swal.getContent()
          if (content) {
            const b = content.querySelector('b')
            
          }
        }, 100)
      },
      onClose: () => {
        clearInterval(timerInterval)
      }
    })
  }



  handleFileSelect(evt){
    var files = evt.target.files;
    var file = files[0];
  
  if (files && file) {
    if(files[0].size > 1048576){
      alert("El archivo excede el tamaño permitido");
      //this.value = "";
     };
      var reader = new FileReader();

      reader.onload =this._handleReaderLoaded.bind(this);

      reader.readAsBinaryString(file);
  }
  }

_handleReaderLoaded(readerEvt) {
  var imagen1=""
   var binaryString = readerEvt.target.result;
          this.base64textString= btoa(binaryString);
          imagen1="data:image/png;base64,"+this.base64textString
          this.catalogo2.IMAGEN.push(imagen1)
          console.log(btoa(binaryString));
  }

  actualizarEstado(){
    new Promise<any>((resolve, reject) => {
      this.db.collection("/productos").doc(this.catalogo2.PRODUCTO).update({"ESTADO":this.catalogo2.ESTADO}).then(res => { }, err => reject(err));
    }) 
  }

  cambiarEstado(){
    new Promise<any>((resolve, reject) => {
      this.db.collection("/productos").doc(this.catalogo2.PRODUCTO).update({"ESTADO":"INACTIVO"}).then(res => {this.mostrarMensajeEliminación()}, err => reject(err));
    }) 
  }

  cambiarEstado2(producto:string){
    new Promise<any>((resolve, reject) => {
      this.db.collection("/productos").doc(producto).update({"ESTADO":"ACTIVO"}).then(res => {this.mostrarMensajeRestauración()}, err => reject(err));
    }) 
  }


  updateProducto(){
    if(this.catalogo2.PRODUCTO!="" && this.catalogo2.CLASIFICA!="" &&this.catalogo2.DIM!="" &&this.catalogo2.REFERENCIA!="" ){
      new Promise<any>((resolve, reject) => {
        this.mensajeGuardando()
        this.actualizarEstado()
        this.db.collection("/catalogo").doc(this.catalogo2.PRODUCTO).update({ ...this.catalogo2 }).then(res => { this.mostrarMensaje()}, err => reject(err));
      })
    }else{
      Swal.fire({
        title: 'Error',
        text: 'Hay campos obligatorios vacios',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }
    
  }

  deleteProducto(){
    new Promise<any>((resolve, reject) => {
      this.mensajeGuardando()
      this.db.collection("/catalogo").doc(this.catalogo2.PRODUCTO).update({"estado2":"Eliminado"}).then(res => { this.cambiarEstado()}, err => reject(err));
    })
  }

  ingresarDatos(){
    this.catalogo=new catalogo()
    this.catalogo.PRODUCTO ="Accesorios - Accesorio Metalico Dorado - 0"
    this.catalogo.CLASIFICA = "Accesorios"
    this.catalogo.REFERENCIA = "Accesorio Metalico Dorado - 0"
    this.catalogo.UNIDAD = "Unidad"
    this.catalogo.DIM = "0"
    this.catalogo.NOMBRE_COMERCIAL = "Baño Metalicos"
    this.catalogo.P_CAJA = 1
    this.catalogo.M2 = 1
    this.catalogo.CAL = ""
    this.catalogo.CASA = ""
    this.catalogo.TIPO = "Original"
    this.catalogo.ORIGEN = "Nacional"
    this.catalogo.ESTADO = "INACTIVO"
    this.db.collection("/catalogo").doc(1+"").set({ ...this.catalogo });
  }


  onExporting (e) {
    e.component.beginUpdate();
    e.component.columnOption("UNIDAD", "visible", true);
    e.component.columnOption("CAL", "visible", true);
    e.component.columnOption("CASA", "visible", true);
    e.component.columnOption("TIPO", "visible", true);
    e.component.columnOption("ORIGEN", "visible", true);
    e.component.columnOption("ESTADO", "visible", true);
   
  };
  onExported (e) {
    e.component.columnOption("UNIDAD", "visible", false);
    e.component.columnOption("CAL", "visible", false);
    e.component.columnOption("CASA", "visible", false);
    e.component.columnOption("TIPO", "visible", false);
    e.component.columnOption("ORIGEN", "visible", false);
    e.component.columnOption("ESTADO", "visible", false);
    e.component.endUpdate();
  }

  opcionMenu(e){
    var x = document.getElementById("catalogo");
    var y = document.getElementById("administracion");
    switch (e.value) {
      case "Catálogo":
        x.style.display = "block";
        y.style.display="none";
       break;
      case "Administrar Productos":
        console.log("entre aqui")
        x.style.display = "none";
        y.style.display="block";
        break;
      default:    
    }     
  }

  buscarProducto(e){
    this.productosCatalogo.forEach(element=>{
      if(element.PRODUCTO == this.producto){
        this.catalogo2= element
        this.catalogo2.PRODUCTO = element.PRODUCTO
        this.catalogo2.CLASIFICA = element.CLASIFICA
        this.catalogo2.ORIGEN= element.ORIGEN
        this.catalogo2.ESTADO= element.ESTADO
        this.catalogo2.TIPO= element.TIPO

        if(this.catalogo2.UNIDAD == "Metros"){
          this.varM2=false
          this.varPC=false
        }else if(this.catalogo2.UNIDAD == "Juego"){
          this.varPC=false
        }else{
          this.varM2=true
          this.varPC=true
        }    
      }
    })
  }

  transformar(e){
    console.log("dddd")
   // this._currentScale = this._currentScale ? this._currentScale * args.deltaScale : args.scale;  
                            //  var currentscale = this._currentScale; 
  }

  verGaleria(imagenes:string[]){
    console.log("viendo galerIA")
    this.popupvisible=false
    this.popupVi=true
     this.imagenesData=imagenes
     this.imagenPrincipal= this.imagenesData[0]
  }

  enviar(num:number){
    console.log("acabo de recibir "+ num)
    this.imagenPrincipal= this.imagenesData[num]
  }

  restaurar(producto:string){
    Swal.fire({
      title: 'Alerta',
      text: "Está seguro que desea restaurar el producto",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText:"No",
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.value) {
        new Promise<any>((resolve, reject) => {
          this.mensajeGuardando()
          this.db.collection("/catalogo").doc(producto).update({"estado2":"Activo"}).then(res => { this.cambiarEstado2(producto)}, err => reject(err));
        })
      }
    })
   
  }
  

  mostrarPopup(producto:string){
    this.titulo=producto
console.log("eneee")
console.log("sss "+producto)
    this.productosCatalogo.forEach(element=>{
      if(element.PRODUCTO == producto){
        this.catalogoLeido= element
        this.imagenes=element.IMAGEN
      }
    })
   /*  this.imagenes = [
      "https://archivosproductos.000webhostapp.com/ceramica2.png",
      "https://archivosproductos.000webhostapp.com/ceramica1.jpg"]; */
     // this.imagenes=images

    this.popupvisible= true
   /*  var var1 
    var inputElement = <HTMLInputElement>document.getElementById('greet');
    inputElement.on('dxpinch', function(args) {  
      this._currentScale = this._currentScale ? this._currentScale * args.deltaScale : args.scale;  
     
  }) */
  }


  mostrarPopup2(producto:string){
    this.titulo=producto
    console.log("eneee")
    console.log("sss "+producto)
    this.productosCatalogo.forEach(element=>{
      if(element.PRODUCTO == producto){
        this.catalogoLeido= element
        this.imagenes=element.IMAGEN
      }
    })
    this.popupvisible2= true
  }
/* 
  ingresar(){
    this.db.collection('/catalogo').doc("Porcelanatos- 600 - Ref - 60x60").set({"CALIDAD" :" ","CASA":" ",
"CLASIFICA":"Porcelanatos","DIM":"60x60","ESTADO":"ACTIVO","M2":1.44,"PRODUCTO":"Porcelanatos- 600 - Ref - 60x60",
"P_CAJA":4,"REFERENCIA":"600 - Ref","UNIDAD":"m2","cantidad":150,"nombre_comercial":"Porcelanatos","porcentaje_ganancia":15,"precio":15.2})

this.db.collection('/catalogo').doc("Porcelanatos- 5000 Beige - 50x50").set({"CALIDAD" :" ","CASA":" ",
"CLASIFICA":"Porcelanatos","DIM":"50x50","ESTADO":"ACTIVO","M2":1.75,"PRODUCTO":"Porcelanatos- 5000 Beige - 50x50",
"P_CAJA":7,"REFERENCIA":"5000 Beige","UNIDAD":"m2","cantidad":150,"nombre_comercial":"Porcelanatos","porcentaje_ganancia":10,"precio":8.7})

this.db.collection('/catalogo').doc("Ceramicas- Castaño duela - 43x43").set({"CALIDAD" :" ","CASA":" ",
"CLASIFICA":"Ceramicas","DIM":"43x43","ESTADO":"ACTIVO","M2":1.5,"PRODUCTO":"Ceramicas- Castaño duela - 43x43",
"P_CAJA":8,"REFERENCIA":"Castaño duela","UNIDAD":"m2","cantidad":200,"nombre_comercial":"Ceramica Piso","porcentaje_ganancia":25,"precio":6.5})

this.db.collection('/catalogo').doc("Ceramicas- Cassiani beige - 42.5x42.5").set({"CALIDAD" :" ","CASA":" ",
"CLASIFICA":"Ceramicas","DIM":"42.5x42.5","ESTADO":"ACTIVO","M2":1,"PRODUCTO":"TCeramicas- Cassiani beige - 42.5x42.5",
"P_CAJA":11,"REFERENCIA":"Cassiani beige","UNIDAD":"m2","cantidad":50,"nombre_comercial":"Ceramica Piso","porcentaje_ganancia":20,"precio":6.2})
  }
 */
}
