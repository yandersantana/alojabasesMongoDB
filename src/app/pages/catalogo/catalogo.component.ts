import { Component, OnInit, ViewChild } from '@angular/core';
import { catalogo, opcionesCatalogo, productosCombo, ProductoCombo, comboProducto } from './catalogo';
import Swal from 'sweetalert2';
import { producto } from '../ventas/venta';
import { DxGalleryComponent } from 'devextreme-angular';
import { CatalogoService } from '../../servicios/catalogo.service';
import { ProductoService } from '../../servicios/producto.service';
import { OpcionesCatalogoService } from '../../servicios/opciones-catalogo.service';
import { UploadService } from 'src/app/servicios/upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ControlPreciosService } from 'src/app/servicios/control-precios.service';
import { precios } from '../control-precios/controlPrecios';
import { Observable } from 'rxjs';
import { BulkUploadService } from 'src/app/servicios/bulk-upload.service';
import { user } from '../user/user';
import { AuthenService } from 'src/app/servicios/authen.service';
import { AuthService } from 'src/app/shared/services';
import DataSource from 'devextreme/data/data_source';
import { CombosService } from 'src/app/servicios/combos.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {
  uploadedFiles: Array<File>;
  titulo:string="ksjdksjd"
  base64textString:String="";
  popupvisible:boolean=false
  popupvisible2:boolean=false
  popupVi:boolean=false
  productosCatalogo:catalogo[]=[]
  productosCatalogoActivos:catalogo[]=[]
  productosCatalogoElim:catalogo[]=[]
  productosCatalogoUso:catalogo[]=[]
  catalogo:catalogo
  catalogoLeido:catalogo
  imagenes:string[]
  imagenesData:string[]
  slideshowDelay=2000
  producto:string
  imagenPrincipal:string
  bloquearBoton = false;
  mostrarBloqueo = false;
  menu1: string[] = [
    "Catálogo",
    "Combos de Productos",
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
  formData: FormData 
  opcionesCatalogo: opcionesCatalogo[]=[]
  nuevoProductoCombo:productosCombo
  productosCombo:productosCombo[]=[]
  arrayClasif: string[]
  arrayUnid: string[]
  arrayNombreComercial: string[]
  contadorArchivos:number=0
  varM2:boolean=true
  varPC:boolean=true
  nuevoProducto:producto
  productoElim:producto
  catalogo3:catalogo
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
    porcentaje_ganancia:0,
    VIGENCIA:"",
    FEC_PRODUCCION:"",
    CANT_MINIMA:0,
    IMAGEN:[],
    IMAGEN_PRINCIPAL:"",
    estado2:"Activo",
    precio:0,
    notas:""
  }

  catalogo4 = {
    PRODUCTO:"",
    NOMBRE_PRODUCTO:"",
    CLASIFICA:"COMBO",
    REFERENCIA:"Sin Referencia",
    UNIDAD:"",
    DIM:"0",
    nombre_comercial:"",
    P_CAJA:1,
    M2:1,
    CAL:"",
    CASA:"",
    TIPO:"",
    ORIGEN:"",
    ESTADO:"",
    APLICACION:"",
    porcentaje_ganancia:0,
    VIGENCIA:"",
    FEC_PRODUCCION:"",
    CANT_MINIMA:0,
    IMAGEN:[],
    IMAGEN_PRINCIPAL:"",
    estado2:"Activo",
    precio:0,
    notas:""
  }
 
  tempUrl:string=""
  aplicaciones:precios[]=[]

  //para el upload
  nombreClase: string
  idClase: string = ""

  contadorImagenes=0
  selectedFiles: FileList;
  progressInfos = [];
  message = '';
  productosActivos:producto[]=[]
  fileInfos: Observable<any>;
  precioVentaCombo:number=0
  comboProductos: comboProducto
  combosDeProductos : ProductoCombo[]=[]
  correo:string
  usuarioLogueado:user
  mostrarLoading = false;
  mensajeLoading = "";
  productos22: DataSource;
  tiposComprobantes: string[] = [
    'Nuevo Combo',
    'Lista de Combos',
  ];
  tipoComprobante = ""
  seccionNuevoCombo = true
  seccionListaCombos = false
  popupVisibleProductos = false;
  popupVisibleEdicion = false;
  nombreCombo = ""
  productosComboLeidos:  productosCombo[] = []
  comboProductoLeido : ProductoCombo

  @ViewChild("gallery", { static: false }) galleryItem: DxGalleryComponent;
  
  constructor(public catalogoService: CatalogoService ,
    public authService2: AuthService,
    public authService: AuthenService,
    public authenService:AuthenService, 
    private uploadService: BulkUploadService,
    public aplicacionesService:ControlPreciosService, 
    public serviceUpload:UploadService, 
    public opcionesService:OpcionesCatalogoService, 
    public _combosService : CombosService, 
    public productoService: ProductoService) { 
      this.catalogo2.ESTADO="ACTIVO"
      this.catalogo2.ORIGEN = "Nacional"
      this.catalogo2.TIPO= "Original"
      this.nuevoProducto= new producto()
      this.comboProductos= new comboProducto()
      this.nuevoProductoCombo = new productosCombo()
      this.productosCombo.push(this.nuevoProductoCombo)
      this.mensajeLoading = "Cargando..."
      this.tipoComprobante = this.tiposComprobantes[0];

  }

  ngOnInit() {
    this.traerProductosCatalogo()
    this.traerProductosCatalogoActivos()
    this.traerOpcionesCatalogo()
    this.traerAplicaciones()
    this.cargarUsuarioLogueado()
  }

  opcionRadioTipos(e){
    this.tipoComprobante = e.value;
    switch (e.value) {
      case "Nuevo Combo":
        this.seccionNuevoCombo = true;
        this.seccionListaCombos = false;
        break;
      case "Lista de Combos":
        this.seccionNuevoCombo = false;
        this.seccionListaCombos = true;
        if(this.combosDeProductos.length == 0)
          this.traerCombosProductos();
        break;
      default:    
    }      
  }

  cargarUsuarioLogueado() {
    const promesaUser = new Promise((res, err) => {
      if (localStorage.getItem("maily") != '') {
        this.correo = localStorage.getItem("maily");
      }
      this.authenService.getUserLogueado(this.correo)
        .subscribe(
          res => {
            this.usuarioLogueado = res as user;
            if(this.usuarioLogueado[0].rol!="Administrador"){
              var z = document.getElementById("admin1");
              z.style.display = "none";
            }

            if(this.usuarioLogueado[0].status == "Inactivo")
              this.authService2.logOut();
           
          },
          err => {
          }
        )
    });
  }

  mostrarPopupCodigo(){
     Swal.fire({
      title: 'Código de Seguridad',
      allowOutsideClick: false,
      showCancelButton: false,
      inputAttributes: {
        autocapitalize: 'off'
      },
      confirmButtonText: 'Ingresar',
      input: 'password',
    }).then((result) => {
      if(this.usuarioLogueado[0].codigo == result.value){
        this.mostrarBloqueo = false;
        setTimeout(function(){
          var y = document.getElementById("administracion");
          y.style.display="block";
        }, 1000);
       
      }else{
        Swal.fire({
          title: 'Error',
          text: 'El código ingresado no es el correcto',
          icon: 'error',
          confirmButtonText: 'Ok'
        }).then((result) => {
          this.mostrarPopupCodigo();
        })
      }
    })
  }



  traerProductosCatalogo(){
    this.mostrarLoading = true;
    this.catalogoService.getCatalogo().subscribe(res => {
        this.productosCatalogo = res as catalogo[];
        this.separarProductos()
    })
  }

  traerProductosCatalogoActivos(){
    this.catalogoService.getCatalogoActivos().subscribe(res => {
        this.productosCatalogoActivos = res as catalogo[];
    })
  }

  traerProductos(){
    this.productoService.getProductosActivos().subscribe(res => {
      this.productosActivos = res as producto[]; 
      this.administrarPrecios();
    })
  }

  traerCombosProductos(){
    this.mensajeLoading = "Cargando.."
    this.mostrarLoading = true;
    this._combosService.getComboProductos().subscribe(res => {
      this.combosDeProductos = res as ProductoCombo[]; 
      this.mostrarLoading = false;
    })
  }

  traerAplicaciones(){
    this.aplicacionesService.getPrecio().subscribe(res => {
      this.aplicaciones = res as precios[];
   })
  }

  traerOpcionesCatalogo(){
    this.opcionesService.getOpciones().subscribe(res => {
      this.opcionesCatalogo = res as opcionesCatalogo[];
      this.llenarCombos()
   })
  }


  obtenerDatosDeProductoParaUnDetalle(e,i:number){
    this.productosActivos.forEach(element=>{
      if(element.PRODUCTO == this.productosCombo[i].nombreProducto){
        this.productosCombo[i].producto = element
        this.productosCombo[i].costo = Number(element.precio.toFixed(2))
        this.productosCombo[i].precioMin = Number(((element.precio*(element.porcentaje_ganancia/100))+element.precio).toFixed(2))
      }
    })
    this.buscarCoincidencia(i)
  }



  guardarComboProductos(){
    this.mensajeLoading = "Guardando ..."
    this.mostrarLoading = true;
    var flag = true;
    this.bloquearBoton = true;
    this.productosCombo.forEach(element=>{
      if(element.precioCombo == 0 || element.producto == null)
        flag = false;
    });


    if(flag == true){
      if(this.productosCombo.length <= 1){
        this.mostrarLoading = false;
        this.mostrarMensajeGenerico(2,"El combo debe tener 2 o más productos");
      }else
        this.guardarCombo()
      
    } 
    else{
      this.bloquearBoton = false;
      this.mostrarLoading = false;
      this.mostrarMensajeGenerico(2,"Hay campos vacios en los registros");
    }
  }

  guardarCombo(){
    this.catalogo4.PRODUCTO = "COMBO - "+ this.catalogo4.NOMBRE_PRODUCTO
    this.catalogo4.NOMBRE_PRODUCTO = this.catalogo4.PRODUCTO
    this.catalogo4.precio = this.comboProductos.precioVenta
    this.catalogo4.UNIDAD = "Unidad"
    this.catalogo4.ESTADO = "ACTIVO"
    this.catalogo4.nombre_comercial = "COMBO"
    this.productoService.newProducto(this.catalogo4).subscribe(
      res => { this.guardarProductoCombo()},
      err => { this.mostrarMensajeGenerico(2,"Error al guardar el combo") })
  }

  updateCombo(){
    this.catalogo4.precio = this.precioVentaCombo
    this.catalogo4.PRODUCTO = this.comboProductoLeido.PRODUCTO
    this.productoService.updatePrecioProducto(this.catalogo4).subscribe(
      res => { this.updateProductoCombo()},
      err => { this.mostrarMensajeGenerico(2,"Error al actualizar el combo") })
      
  }

  guardarProductoCombo(){
    var productoCombo = new ProductoCombo();
    productoCombo.PRODUCTO = this.catalogo4.PRODUCTO
    productoCombo.CLASIFICA = this.catalogo4.CLASIFICA
    productoCombo.estado = this.catalogo4.ESTADO
    productoCombo.cantidadProductos = this.productosCombo.length
    productoCombo.productosCombo = this.productosCombo
    productoCombo.precio = this.catalogo4.precio
    productoCombo.estado = "ACTIVO"
    this._combosService.newCombo(productoCombo).subscribe(
      res => { 
          this.mostrarLoading = false;
          Swal.fire({
            title: 'Correcto',
            text: 'Se registró correctamente el nuevo combo',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            window.location.reload()
          })
        },
      err => { this.mostrarMensajeGenerico(2,"Error al guardar el combo") })
  }


  updateProductoCombo(){
    var productoCombo = new ProductoCombo();
    productoCombo._id = this.comboProductoLeido._id
    productoCombo.PRODUCTO = this.comboProductoLeido.PRODUCTO
    productoCombo.CLASIFICA = this.comboProductoLeido.CLASIFICA
    productoCombo.cantidadProductos = this.productosComboLeidos.length
    productoCombo.productosCombo = this.productosComboLeidos
    productoCombo.precio = this.precioVentaCombo
    productoCombo.estado = "ACTIVO"
    this._combosService.updateCombo(productoCombo).subscribe(
      res => { 
        this.popupVisibleEdicion = false;
          this.mostrarLoading = false;
          Swal.fire({
            title: 'Correcto',
            text: 'Se registró correctamente el nuevo combo',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            window.location.reload()
          })
        },
      err => { this.mostrarMensajeGenerico(2,"Error al guardar el combo") })
  }


  editarCombo = (e) => {  
    this.mostrarPopupEdicion(e.row.data)  
  }

  eliminarCombo = (e) => {  
    this.mostrarEliminacion(e.row.data)  
  }

  verProductos = (e) => {  
    this.mostrarPopupProductos(e.row.data)  
  }

  mostrarPopupProductos(e : ProductoCombo){
    this.nombreCombo = e.PRODUCTO
    this.productosComboLeidos = e.productosCombo
    this.popupVisibleProductos = true;
  }

  mostrarEliminacion(e : ProductoCombo){
    Swal.fire({
      title: "Eliminar Combo",
      text: "Está seguro que desea eliminar el siguiente producto: "+ e.PRODUCTO,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.mensajeLoading = "Eliminando Combo..."
        this.mostrarLoading = true;
        this._combosService.deleteCombos(e).subscribe(
          res => { 
            var producto = this.productosActivos.find(element => element.PRODUCTO == e.PRODUCTO)
            this.productoService.deleteProducto(producto).subscribe(
            res => { 
              this.mostrarLoading = false;
              this.mostrarMensajeGenerico(1,"Se ha eliminado correctamente su combo")
              this.traerCombosProductos() },
            err => { 
              this.mostrarLoading = false;
              this.mostrarMensajeGenerico(2,"Error al eliminar el combo") })  },
          err => {
            this.mostrarLoading = false; 
            this.mostrarMensajeGenerico(2,"Error al eliminar el combo") })
       
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado!', 'error' )
      }
    })
  }

  mostrarPopupEdicion(e : ProductoCombo){
    this.comboProductoLeido = e
    this.nombreCombo = e.PRODUCTO
    this.productosComboLeidos = e.productosCombo
    this.precioVentaCombo = e.precio
    this.popupVisibleEdicion = true;

  }



  mostrarMensajeGenerico(tipo:number , texto:string){
    if(tipo == 1){
      Swal.fire({
        title: "Correcto",
        text: texto,
        icon: 'success'
      })
    }else{
      Swal.fire({
        title: "Error",
        text: texto,
        icon: 'error'
      })
    }
  }


  buscarCoincidencia(i:number){
    var cont=0
    this.productosCombo.forEach(element=>{
      if(element.nombreProducto == this.productosCombo[i].nombreProducto )
        cont++
    })
    if(cont>1){
      Swal.fire({
        title: 'Error',
        text: 'El producto ya esta asociado',
        icon: 'error'
      })
      this.productosCombo.splice(i,1);
    }

  }

  calcularIncremento(e,i:number){
    
    this.productosCombo[i].calculo = Math.round(((this.productosCombo[i].precioCombo/this.productosCombo[i].costo)*100)-100)
    this.productosCombo[i].precioVenta = this.productosCombo[i].precioCombo * this.productosCombo[i].cantidad
    if(this.productosCombo[i].precioCombo < this.productosCombo[i].costo){
      Swal.fire({
        title: 'Error',
        text: 'El precio no puede ser menor al costo',
        icon: 'error'
      })
      this.productosCombo[i].precioCombo=0
      this.productosCombo[i].calculo=0
      this.productosCombo[i].precioVenta=0
    }
    this.calcularTotalCombo()
  }

  calcularTotalCombo(){
    this.comboProductos.precioVenta=0
    this.productosCombo.forEach(element=>{
      this.comboProductos.precioVenta = element.precioVenta +this.comboProductos.precioVenta
    })
    this.precioVentaCombo= this.comboProductos.precioVenta
  }
  
  anadirProducto(e){
    this.productosCombo.push(new productosCombo())
  }

  anadirProducto2(e){
    this.productosComboLeidos.push(new productosCombo())
  }

  deleteProductoCombo(i:number){
    this.productosCombo.splice(i,1);
    this.calcularTotalCombo()
  }

  deleteProductoCombo2(i:number){
    this.productosComboLeidos.splice(i,1);
    this.calcularTotalCombo2()
  }

  calcularIncremento2(e,i:number){
    this.productosComboLeidos[i].calculo = Math.round(((this.productosComboLeidos[i].precioCombo/this.productosComboLeidos[i].costo)*100)-100)
    this.productosComboLeidos[i].precioVenta = this.productosComboLeidos[i].precioCombo * this.productosComboLeidos[i].cantidad
    if(this.productosComboLeidos[i].precioCombo < this.productosComboLeidos[i].costo){
      Swal.fire({
        title: 'Error',
        text: 'El precio no puede ser menor al costo',
        icon: 'error'
      })
      this.productosComboLeidos[i].precioCombo=0
      this.productosComboLeidos[i].calculo=0
      this.productosComboLeidos[i].precioVenta=0
    }
    this.calcularTotalCombo2()
  }

  calcularTotalCombo2(){
    this.comboProductoLeido.precio=0
    this.productosComboLeidos.forEach(element=>{
      this.comboProductoLeido.precio = element.precioVenta +this.comboProductoLeido.precio
    })
    this.precioVentaCombo= this.comboProductoLeido.precio
    console.log(this.precioVentaCombo)
  }

  //----------------------archivos upload ------------------------

  selectFiles(event) {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
    var x = document.getElementById("nombreIM");
        x.style.display = "block";
  }

  selectFiles2(event) {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
    var x = document.getElementById("nombreIM2");
        x.style.display = "block";
  }

  uploadFiles() {
    this.catalogo2.PRODUCTO= this.catalogo2.CLASIFICA+" - "+this.catalogo2.NOMBRE_PRODUCTO +" - "+this.catalogo2.DIM
    if(this.catalogo2.PRODUCTO!="" && this.catalogo2.CLASIFICA!="" && this.catalogo2.precio !=0 && this.catalogo2.porcentaje_ganancia!=0 &&this.catalogo2.DIM!="" &&this.catalogo2.REFERENCIA!="" ){
      
      if(this.selectedFiles==undefined){
        this.newProducto()
      }else{
        var x = document.getElementById("nombreIM");
        x.style.display = "none";
        this.message = '';
        this.contadorArchivos=this.selectedFiles.length
        for (let i = 0; i < this.selectedFiles.length; i++) {
          this.upload4(i, this.selectedFiles[i]);
        }
      }
     
      
    }else{
      Swal.fire({
        title: 'Error',
        text: 'Hay campos obligatorios vacios ',
        icon: 'error'
      })
    } 
  }

  uploadFiles2() {
    this.catalogo2.PRODUCTO= this.catalogo2.CLASIFICA+" - "+this.catalogo2.NOMBRE_PRODUCTO +" - "+this.catalogo2.DIM
    if(this.catalogo2.PRODUCTO!="" && this.catalogo2.CLASIFICA!="" && this.catalogo2.porcentaje_ganancia!=0 &&this.catalogo2.DIM!="" &&this.catalogo2.REFERENCIA!="" ){
      var x = document.getElementById("nombreIM");
      x.style.display = "none";
      this.message = '';
      this.contadorArchivos=this.selectedFiles.length
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload5(i, this.selectedFiles[i]);
      }
    }else{
      Swal.fire({
        title: 'Error',
        text: 'Hay campos obligatorios vacios ',
        icon: 'error'
      })
    } 
  }

  registrarProductos(){
    var cont=0
    this.productosCatalogo.forEach(element=>{
      this.nuevoProducto.PRODUCTO= element.PRODUCTO
      this.nuevoProducto.CAL= element.CAL
      this.nuevoProducto.CASA= element.CASA
      this.nuevoProducto.CLASIFICA= element.CLASIFICA
      this.nuevoProducto.ESTADO= element.ESTADO
      this.nuevoProducto.M2= element.M2
      this.nuevoProducto.P_CAJA= element.P_CAJA
      this.nuevoProducto.REFERENCIA= element.REFERENCIA
      this.nuevoProducto.UNIDAD= element.UNIDAD
      this.nuevoProducto.nombre_comercial= element.NOMBRE_COMERCIAL
      this.nuevoProducto.APLICACION= element.APLICACION
      this.nuevoProducto.porcentaje_ganancia= element.porcentaje_ganancia
      this.nuevoProducto.precio= element.precio
      this.nuevoProducto.suc1Pendiente= 0
      this.nuevoProducto.suc2Pendiente= 0
      this.nuevoProducto.suc3Pendiente= 0
      this.nuevoProducto.sucursal1= 0
      this.nuevoProducto.sucursal2= 0
      this.nuevoProducto.sucursal3= 0
      this.nuevoProducto.bodegaProveedor=0
      this.nuevoProducto.ubicacionSuc1=[]
      this.nuevoProducto.ubicacionSuc2=[]
      this.nuevoProducto.ubicacionSuc3=[]
      
      new Promise<any>((resolve, reject) => {
        this.productoService.newProducto(this.nuevoProducto).subscribe(
          res => {cont++},
          err => {
            Swal.fire({
              title: err.error,
              text: 'Revise e intente nuevamente',
              icon: 'error'
            })
          })
      }) 
    })

  }

  upload5(idx, file) {
    
    this.progressInfos[idx] = { value: 0, fileName: file.name };
  
    this.uploadService.upload(file).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.fileInfos = this.uploadService.getFiles();
          this.catalogo2.IMAGEN.push(event.body)
          this.contadorImagenes++
          this.validarContador2(this.contadorImagenes)
         //this.fileInfos = pathy;
        }
      },
      err => {
        this.progressInfos[idx].value = 0;
        this.message = 'Could not upload the file:' + file.name;
      });
  }

  validarContador2(cont:number){
    if(cont == this.contadorArchivos)
      this.continuarGuardando()
  }

  upload4(idx, file) {
    
    this.progressInfos[idx] = { value: 0, fileName: file.name };
  
    this.uploadService.upload(file).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.fileInfos = this.uploadService.getFiles();
          this.catalogo2.IMAGEN.push(event.body)
          this.contadorImagenes++
          this.validarContador(this.contadorImagenes)
         //this.fileInfos = pathy;
        }
      },
      err => {
        this.progressInfos[idx].value = 0;
        this.message = 'Could not upload the file:' + file.name;
      });
  }


  validarContador(cont:number){
    if(cont == this.contadorArchivos)
      this.newProducto()

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

  deleteImagen(i:number){
    this.catalogo2.IMAGEN.splice(i,1)
  }


  separarProductos(){
    //1827
    console.log(this.productosCatalogo.length)
    this.productosCatalogo.forEach(element=>{
      if(element.estado2!="Eliminado")
        this.productosCatalogoUso.push(element)
      else
        this.productosCatalogoElim.push(element)
    })
    this.traerProductos()
  }

  administrarPrecios(){
    this.productosCatalogoUso.forEach(element=>{
      this.productosActivos.forEach(element2=>{
        if(element.PRODUCTO == element2.PRODUCTO){
          element.precio = element2.precio
        }
      })
    })


    this.productos22 = new DataSource({  
      store: this.productosActivos,  
      sort: [{ field: "PRODUCTO", asc: true }],    
    });

    this.mostrarLoading = false;
  }


  llenarCombos(){
    this.opcionesCatalogo.forEach(element=>{
         this.arrayUnid= element.arrayUnidades
         this.arrayClasif= element.arrayClasificación
         this.arrayNombreComercial = element.arrayNombreComercial
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

  mostrar2(i:number){
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
  }

  asignarNombreComercial(e){
    this.catalogo2.NOMBRE_COMERCIAL= e.value   
 }

  asignarTipo(e){
    this.catalogo2.TIPO= e.value
  }

  asignarEstado(e){
    this.catalogo2.ESTADO= e.value
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
    this.nuevoProducto.APLICACION= this.catalogo2.APLICACION
    this.nuevoProducto.porcentaje_ganancia= this.catalogo2.porcentaje_ganancia
    this.nuevoProducto.precio= this.catalogo2.precio
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
      this.productoService.newProducto(this.nuevoProducto).subscribe(
        res => {
          this.mostrarMensaje()
        },
        err => {
          Swal.fire({
            title: err.error,
            text: 'Revise e intente nuevamente',
            icon: 'error'
          })
        })
    }) 
  }

  newProducto(){
    this.catalogo2.IMAGEN_PRINCIPAL= this.catalogo2.IMAGEN[0]
    this.catalogo2.PRODUCTO= this.catalogo2.CLASIFICA+" - "+this.catalogo2.NOMBRE_PRODUCTO +" - "+this.catalogo2.DIM
    this.comparardatos()
    this.comparardatos2()
    this.comparardatos3()
    if(this.catalogo2.PRODUCTO!="" && this.catalogo2.CLASIFICA!="" && this.catalogo2.porcentaje_ganancia!=0 &&this.catalogo2.DIM!="" &&this.catalogo2.REFERENCIA!="" ){
      //this.catalogo2.IMAGEN[0]=+this.base64textString
      new Promise<any>((resolve, reject) => {
        this.mensajeGuardando()
        var contador=0
        this.productosCatalogo.forEach(element=>{
          if(element.PRODUCTO == this.catalogo2.PRODUCTO){
            contador++
          }
        })
        if(contador==0){

          if(this.catalogo2.M2 ==0){
            this.catalogo2.M2=1
          }
          if(this.catalogo2.P_CAJA ==0){
            this.catalogo2.P_CAJA=1
          }
          this.catalogoService.newCatalogo(this.catalogo2).subscribe(
            res => { this.crearNuevoProducto() },
            err => {
              Swal.fire({
                title: err.error,
                text: 'Revise e intente nuevamente',
                icon: 'error'
              })
            })
        }else{
          
          Swal.fire({
            title:"Error",
            text: 'El producto ya existe',
            icon: 'error'
          })
        }
        
        
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
      text: 'Se ha producido un error al guardar',
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
      this.opcionesService.updateOpciones(this.opcionesCatalogo[0]).subscribe(
        res => {
          console.log(res);
        },
        err => { console.log(err); this.mensajeError() }
      )
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
      this.opcionesService.updateOpciones(this.opcionesCatalogo[0]).subscribe(
        res => {
          console.log(res);
        },
        err => { console.log(err); this.mensajeError() }
      )
       
    }
  }

  comparardatos3(){
    var cont=0
    this.arrayNombreComercial.forEach(element=>{
      if(element == this.catalogo2.NOMBRE_COMERCIAL){
        cont++
      }else{
        
      }
    })

    if(cont==0){
      this.arrayNombreComercial.push(this.catalogo2.NOMBRE_COMERCIAL)
      this.opcionesService.updateOpciones(this.opcionesCatalogo[0]).subscribe(
        res => {
          console.log(res);
        },
        err => { console.log(err); this.mensajeError() }
      )
       
    }
  }


  upload(){
    this.formData = new FormData();
    this.formData.append("uploads[]", this.uploadedFiles[0], this.uploadedFiles[0].name);
    var options = { content: this.formData };
    this.serviceUpload.uploadFile(this.formData).subscribe( (res) => {this.tempUrl = res.url }, err => {alert("errrrrorrr")})
  }

  uploadNew(){
    this.serviceUpload.uploadFile(this.uploadedFiles).subscribe((res) => {}, err => {} )
  }

  fileChange(element) {
    this.uploadedFiles = element.target.files
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
      //this.db.collection("/productos").doc(this.catalogo2.PRODUCTO).update({"ESTADO":this.catalogo2.ESTADO}).then(res => { }, err => reject(err));
    }) 
  }

  cambiarEstado(){
    new Promise<any>((resolve, reject) => {
      this.productoService.updateProductoEstado(this.catalogo2.PRODUCTO, "INACTIVO").subscribe(res => {this.mostrarMensajeEliminación()
        },
        err => { console.log(err); this.mensajeError() }
      )
      //this.db.collection("/productos").doc(this.catalogo2.PRODUCTO).update({"ESTADO":"INACTIVO"}).then(res => {this.mostrarMensajeEliminación()}, err => reject(err));
    }) 
  }

  cambiarEstado2(producto:string){
    new Promise<any>((resolve, reject) => {
      this.productoService.updateProductoEstado(producto, "ACTIVO").subscribe(res => {this.mostrarMensajeRestauración()
      },
      err => { console.log(err); this.mensajeError() }
    )}) 
  }


  updateProducto(){
    if(this.selectedFiles!=undefined){
      this.uploadFiles2()
    } else{
      this.continuarGuardando()
    }
  }

  continuarGuardando(){
    var idProducto=""
    this.productosActivos.forEach(element=>{
      if(element.PRODUCTO == this.catalogo2.PRODUCTO){
        idProducto = element._id
      }
    })
    if(this.catalogo2.PRODUCTO!="" && this.catalogo2.CLASIFICA!=""  && this.catalogo2.porcentaje_ganancia!=0 &&this.catalogo2.DIM!="" &&this.catalogo2.REFERENCIA!="" ){
      new Promise<any>((resolve, reject) => {
        this.mensajeGuardando()
        if(this.catalogo2.M2 ==0){
          this.catalogo2.M2=1
        }
        if(this.catalogo2.P_CAJA ==0){
          this.catalogo2.P_CAJA=1
        }

        if(this.catalogo2.IMAGEN.length >0){
        this.catalogo2.IMAGEN_PRINCIPAL= this.catalogo2.IMAGEN[0]
        }
        
        if(this.catalogo2.APLICACION ==null || this.catalogo2.APLICACION==""){
          this.catalogo2.APLICACION="Default"
        }

        this.catalogoService.updateCatalogo(this.catalogo2).subscribe(
          res => {
            var nuevoProducto = new producto()
            nuevoProducto._id = idProducto
            nuevoProducto.PRODUCTO = this.catalogo2.PRODUCTO
            nuevoProducto.REFERENCIA = this.catalogo2.REFERENCIA
            nuevoProducto.nombre_comercial = this.catalogo2.NOMBRE_COMERCIAL
            nuevoProducto.APLICACION = this.catalogo2.APLICACION
            nuevoProducto.M2 = this.catalogo2.M2
            nuevoProducto.P_CAJA = this.catalogo2.P_CAJA
            nuevoProducto.porcentaje_ganancia = this.catalogo2.porcentaje_ganancia
            nuevoProducto.precio = this.catalogo2.precio
            nuevoProducto.ESTADO = this.catalogo2.ESTADO

            this.productoService.updateNuevoProductoCatalogo(nuevoProducto).subscribe(
              res => { this.mostrarMensaje()},
              err => { console.log(err); this.mensajeError() }
            )
          },
          err => { console.log(err); this.mensajeError() }
        )  })
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
      this.catalogoService.updateCatalogoEliminacion(this.catalogo2,"Eliminado").subscribe(res => {this.cambiarEstado()},
        err => { console.log(err); this.mensajeError() }
      )
      //this.db.collection("/catalogo").doc(this.catalogo2.PRODUCTO).update({"estado2":"Eliminado"}).then(res => { this.cambiarEstado()}, err => reject(err));
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
    //this.db.collection("/catalogo").doc(1+"").set({ ...this.catalogo });
  }


  onExporting (e) {
    e.component.beginUpdate();
    e.component.columnOption("UNIDAD", "visible", true);
    e.component.columnOption("CAL", "visible", true);
    e.component.columnOption("CASA", "visible", true);
    e.component.columnOption("TIPO", "visible", true);
    e.component.columnOption("ORIGEN", "visible", true);
    e.component.columnOption("ESTADO", "visible", true);
    e.component.columnOption("REFERENCIA", "visible", true);
    e.component.columnOption("APLICACION", "visible", true);
    e.component.columnOption("precio", "visible", true);
    e.component.columnOption("porcentaje_ganancia", "visible", true);
    e.component.columnOption("VIGENCIA", "visible", true);
    e.component.columnOption("FEC_PRODUCCION", "visible", true);
    e.component.columnOption("CANT_MINIMA", "visible", true);
    e.component.columnOption("notas", "visible", true);
   
  };
  onExported (e) {
    e.component.columnOption("UNIDAD", "visible", false);
    e.component.columnOption("CAL", "visible", false);
    e.component.columnOption("CASA", "visible", false);
    e.component.columnOption("TIPO", "visible", false);
    e.component.columnOption("ORIGEN", "visible", false);
    e.component.columnOption("ESTADO", "visible", false);
    e.component.columnOption("REFERENCIA", "visible", true);
    e.component.columnOption("APLICACION", "visible", false);
    e.component.columnOption("VIGENCIA", "visible", false);
    e.component.columnOption("precio", "visible", false);
    e.component.columnOption("porcentaje_ganancia", "visible", false);
    e.component.columnOption("FEC_PRODUCCION", "visible", false);
    e.component.columnOption("CANT_MINIMA", "visible", false);
    e.component.columnOption("notas", "visible", false);
    e.component.endUpdate();
  }

  opcionMenu(e){
    var x = document.getElementById("catalogo");
    var y = document.getElementById("administracion");
    var z = document.getElementById("combos");
    switch (e.value) {
      case "Catálogo":
        x.style.display = "block";
        y.style.display="none";
        z.style.display="none";
       break;
      case "Administrar Productos":
        this.mostrarPopupCodigo();
        this.mostrarBloqueo = true;
        x.style.display = "none";
        y.style.display="block";
        z.style.display="none";
        break;
      case "Combos de Productos":
        x.style.display = "none";
        y.style.display="none";
        z.style.display="block";
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
    this.productosCatalogoElim.forEach(element=>{
      if(element.PRODUCTO == producto){
        this.catalogo3 = element
      }
    })
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
          this.catalogoService.updateCatalogoEliminacion(this.catalogo3,"Activo").subscribe(res => {this.cambiarEstado2(producto)},
          err => { console.log(err); this.mensajeError() }
        )
         // this.db.collection("/catalogo").doc(producto).update({"estado2":"Activo"}).then(res => { this.cambiarEstado2(producto)}, err => reject(err));
        })
        
      }
    })
  }


  eliminarProducto(producto:string){
    this.productosCatalogoElim.forEach(element=>{
      if(element.PRODUCTO == producto){
        this.catalogo3 = element
      }
    })

    this.productosActivos.forEach(element=>{
      if(element.PRODUCTO == producto){
        this.productoElim = element
      }
    })
    Swal.fire({
      title: 'Alerta',
      text: "Está seguro que desea eliminar el producto",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText:"No",
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.value) {
        new Promise<any>((resolve, reject) => {
          this.mensajeGuardando()
          this.catalogoService.deleteCatalogo(this.catalogo3).subscribe(res => {
            this.productoService.deleteProducto(this.productoElim).subscribe(res => {
              Swal.fire({
                title: 'Correcto',
                text: 'Se eliminó su producto con éxito',
                icon: 'success',
                confirmButtonText: 'Ok'
              }).then((result) => {
                window.location.reload()
              })
            },
            err => { console.log(err); this.mensajeError() })
          },
          err => { console.log(err); this.mensajeError() }
        )
         // this.db.collection("/catalogo").doc(producto).update({"estado2":"Activo"}).then(res => { this.cambiarEstado2(producto)}, err => reject(err));
        })
        
      }
    })
  }
  

  mostrarPopup(producto:string){
    this.titulo=producto
    this.productosCatalogo.forEach(element=>{
      if(element.PRODUCTO == producto){
        this.catalogoLeido= element
        this.imagenes=element.IMAGEN
      }
    })
    this.popupvisible= true

  }


  mostrarPopup2(producto:string){
    this.titulo=producto
    this.productosCatalogo.forEach(element=>{
      if(element.PRODUCTO == producto){
        this.catalogoLeido= element
        this.imagenes=element.IMAGEN
      }
    })
    this.popupvisible2= true
  }
}


//1189