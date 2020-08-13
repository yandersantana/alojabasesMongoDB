import { Component, OnInit, ViewChild } from '@angular/core';
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { SucursalesService } from 'src/app/servicios/sucursales.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { parametrizacionsuc } from '../../parametrizacion/parametrizacion';
import { Sucursal } from '../../compras/compra';
import { producto, contadoresDocumentos } from '../../ventas/venta';
import { auditoria, auditoriasProductos } from '.././auditorias';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { element } from 'protractor';
import { AuditoriasService } from 'src/app/servicios/auditorias.service';
import Swal from 'sweetalert2';
import { AuditoriaProductoService } from 'src/app/servicios/auditoria-producto.service';
import { TransaccionesService } from 'src/app/servicios/transacciones.service';
import { transaccion } from '../../transacciones/transacciones';
import { inventario, invFaltanteSucursal } from '../../consolidado/consolidado';
import { user } from '../../user/user';
import { AuthenService } from 'src/app/servicios/authen.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DxDataGridComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aud-tabla',
  templateUrl: './aud-tabla.component.html',
  styleUrls: ['./aud-tabla.component.scss']
})
export class AudTablaComponent implements OnInit {

  sucursal:string
  now: Date = new Date();
  productoEntregado:string
  parametrizaciones: parametrizacionsuc[]=[]
  locales: Sucursal[]=[]
  productosActivos: producto[]=[]
  productos: producto[]=[]
  nombreSucursal:string
  number_transaccion:number=0
  auditoria:auditoriasProductos
  auditoriaProductosBase:auditoriasProductos[]=[]
  auditoriaProductosleida:auditoriasProductos[]=[]
  auditoriaProductosleida2:auditoriasProductos[]=[]
  newAuditoria: auditoria
  editAuditoria: auditoriasProductos
  contadores:contadoresDocumentos[]=[]
  nameSucursal:string=""
  auditoriasBase: auditoria[]=[]
  auditoriasIniciadas: auditoria[]=[]
  auditoriaEditable: auditoria
  auditoriasAcabadas: auditoria[]=[]
  transacciones: transaccion[]=[]
  transaccion:transaccion
  idAuditorialeida:auditoria
  numProductos:number
  btnRe: boolean=false
  valordefault=0
  invetarioProd:inventario
  invetarioP:inventario[]=[]
  invetarioFaltante1: invFaltanteSucursal
  invetarioFaltante:invFaltanteSucursal[]=[]
  contadorFirebase:contadoresDocumentos[]=[]
  productos22: DataSource;
  lectura:boolean=false
  correo:string
  pass:string
  usuarioLogueado:user
  seleccionado:boolean=false
  menuValoracion: string[] = [
    "Ok",
    "Roto",
    "Sin vigencia",
    "Desmantelado",
    "No funcional",
    "Obsoleto",
    "Rayado",
    "Manchado"
  ];

  menu: string[] = [
    
    "Nueva Auditoria",
    "Ver Auditorias",
    "Novedades registradas"
  ];

  @ViewChild('datag2') dataGrid2: DxDataGridComponent;

  constructor(private db: AngularFirestore,private router:Router, public  afAuth:  AngularFireAuth,public transaccionesService:TransaccionesService,public authenService:AuthenService, public auditoriaProductoService: AuditoriaProductoService, public auditoriasService:AuditoriasService, public contadoresService:ContadoresDocumentosService, public parametrizacionService: ParametrizacionesService, public sucursalesService: SucursalesService , public productoService:ProductoService) { 
    this.auditoria = new auditoriasProductos()
    this.auditoria.valoracion= "Ok"
    this.newAuditoria = new auditoria()
    this.editAuditoria= new auditoriasProductos()
    this.newAuditoria.contrasena=""
    
  }

  ngOnInit() {
    this.traerParametrizaciones()
    this.traerSucursales()
    this.traerProductos()
    this.traerContadoresDocumentos()
    this.traerAuditorias()
    this.traerAuditoriasProductos()
    this.traerTransacciones()
    this.cargarUsuarioLogueado()
    this.getIDDocumentos()
    /* var x = document.getElementById("newAudGlobal");
    var y = document.getElementById("tabla3");
    x.style.display= "block"
    y.style.display= "none" */
   
  }

  traerParametrizaciones(){
    this.parametrizacionService.getParametrizacion().subscribe(res => {
      this.parametrizaciones = res as parametrizacionsuc[];
   })
  }

  traerSucursales(){
    this.sucursalesService.getSucursales().subscribe(res => {
      this.locales = res as Sucursal[];
   })
  }

  traerAuditorias(){
    this.auditoriasService.getAuditorias().subscribe(res => {
      this.auditoriasBase = res as auditoria[];
      this.separarAuditorias()
   })
  }

  traerAuditoriasProductos(){
    this.auditoriaProductoService.getAuditoriasProductos().subscribe(res => {
      this.auditoriaProductosBase = res as auditoriasProductos[];
      
   })
  }

  traerContadoresDocumentos(){
    this.contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
      this.newAuditoria.idAuditoria = this.contadores[0].auditorias_Ndocumento+1
      //this.number_transaccion= this.contadores[0].transacciones_Ndocumento
   })
  }

  async getIDDocumentos() {
    //REVISAR OPTIMIZACION
    await this.db.collection('consectivosBaseMongoDB').valueChanges().subscribe((data:contadoresDocumentos[]) => {
      new Promise<any>((resolve, reject) => {
        if(data != null){
          this.contadorFirebase = data
        } 
      })
      this.asignarIDdocumentos2()
    })
    
  }
  asignarIDdocumentos2(){
    this.number_transaccion = this.contadorFirebase[0].transacciones_Ndocumento
  }

  traerProductos(){
    this.productoService.getProducto().subscribe(res => {
      this.productosActivos = res as producto[];
      this.llenarComboProductos()
   })
  }

  traerTransacciones(){
    this.transaccionesService.getTransaccion().subscribe(res => {
      this.transacciones = res as transaccion[];
      this.traerProductos2()
      
   })
  }

  traerProductos2(){
    this.productoService.getProductosActivos().subscribe(res => {
      this.productos = res as producto[];
      this.cargarDatos()
      //alert("jhjhj "+ this.productos.length)
   })
  }

  llenarComboProductos(){
    this.productosActivos.forEach(element=>{
      if(element.ESTADO == "ACTIVO"){
        this.productos.push(element)
      }
    })

    this.productos22 = new DataSource({  
      store: this.productos,  
      sort: [{ field: "PRODUCTO", asc: true }],    
    });
  }

 

  obtenerDetallesproducto(e){
    this.productosActivos.forEach(element=>{
      if(element.PRODUCTO == this.productoEntregado){
        this.auditoria.producto = element
        this.auditoria.nombreproducto = element.PRODUCTO
        if(element.CLASIFICA != "Ceramicas" && element.CLASIFICA != "Porcelanatos"){
          this.lectura=true
        }else{
          this.lectura=false
        }
        this.compararProducto()
        //this.obtenerUbicacion()
      }
    })

  }

 /*  obtenerUbicacion(){
    console.log("ssss "+this.auditoria.sucursal.nombre)
    switch (this.auditoria.sucursal.nombre) {
      case "Matriz":
          this.auditoria.ubicacion = this.auditoria.producto.ubicacionSuc1
        break;
      case "sucursal1":
          this.auditoria.ubicacion = this.auditoria.producto.ubicacionSuc2
        break;
      case "sucursal2":
          this.auditoria.ubicacion = this.auditoria.producto.ubicacionSuc3
        break;
    
      default:
        break;
    }
  } */

  compararProducto(){
    //alert("si")
    if(this.auditoriaProductosleida.length == 0){
      this.buscarInformacion()
    }else{
      this.auditoriaProductosleida.forEach(element=>{
        if(element.producto.PRODUCTO == this.auditoria.producto.PRODUCTO){
          Swal.fire({
            title: 'Error',
            text: "Este producto ya ha sido auditado, Desea editar el producto?",
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.value) {
                this.editAuditoria = element
                this.editAuditoria.idAud = element.idAud
                this.productoEntregado= element.nombreproducto
                this.nombreSucursal= element.sucursal.nombre
                var x = document.getElementById("editAud");
                  var y = document.getElementById("newAud");
                  var z = document.getElementById("tabla3");
                  x.style.display = "block";
                  y.style.display = "none";
                  z.style.display = "none";
             
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                'Cancelado!',
                'Se ha cancelado su proceso.',
                'error'
              )
              this.productoEntregado=""
              this.btnRe=true
            }
          })
          
        }else{
          this.btnRe=false
          this.buscarInformacion()
        }
      })
    }
    
  }

  onExporting2 (e) {
    e.component.beginUpdate();
    e.component.columnOption("observaciones", "visible", true);
    e.component.columnOption("auditor", "visible", true);
    e.component.columnOption("auditado", "visible", true);
    e.component.columnOption("sucursal.nombre", "visible", true);
    
  };
  onExported2 (e) {
    e.component.columnOption("observaciones", "visible", false);
    e.component.columnOption("auditor", "visible", false);
    e.component.columnOption("auditado", "visible", false);
    e.component.columnOption("sucursal.nombre", "visible", false);
    e.component.endUpdate();
  }

  opcionMenu(e){
    var x = document.getElementById("newAudGlobal");
    var y = document.getElementById("tabla3");
    var z = document.getElementById("tabla2");
    var z0 = document.getElementById("tabla4");
    var z1 = document.getElementById("newAud");
    var z2 = document.getElementById("editAud");
    var z3 = document.getElementById("tablaAuditoria");
    var z4 = document.getElementById("novedades");

    

    switch (e.value) {
      case  "Nueva Auditoria":
        x.style.display = "block";
        y.style.display="none";
        z.style.display="none";
        z1.style.display="none";
        z0.style.display="none";
        z2.style.display="none";
        z3.style.display="none";
        z4.style.display="none";
       
       break;
      case "Ver Auditorias":
        this.router.navigate(['/auditorias/tabla']);
        break;
      case "Novedades registradas":
        this.router.navigate(['/auditorias/novedades']);
        
        break;
      default:    
    }     
  }

  buscarInformacion(){
    this.invetarioP.forEach(element=>{
      if(element.producto.PRODUCTO == this.auditoria.producto.PRODUCTO){
        switch (this.auditoria.sucursal.nombre) {
          case "matriz":
            this.auditoria.cajas_sistema= element.cantidadCajas
            this.auditoria.piezas_sistema= element.cantidadPiezas
            
            this.calcularTotalM2Base()
            break;
          case "sucursal1":
            this.auditoria.cajas_sistema= element.cantidadCajas2
            this.auditoria.piezas_sistema= element.cantidadPiezas2
            
            this.calcularTotalM2Base()
            break;
          case "sucursal2":
            this.auditoria.cajas_sistema= element.cantidadCajas3
            this.auditoria.piezas_sistema= element.cantidadPiezas3
            
            this.calcularTotalM2Base()
            break;
          default:
            break;
        }
        
      }
    })
  }

  buscarInformacionEdit(){
    this.invetarioP.forEach(element=>{
      if(element.producto.PRODUCTO == this.auditoria.producto.PRODUCTO){
        switch (this.auditoria.sucursal.nombre) {
          case "matriz":
            this.auditoria.cajas_sistema= element.cantidadCajas
            this.auditoria.piezas_sistema= element.cantidadPiezas
            
            this.calcularTotalM2Base()
            break;
          case "sucursal1":
            this.auditoria.cajas_sistema= element.cantidadCajas2
            this.auditoria.piezas_sistema= element.cantidadPiezas2
            
            this.calcularTotalM2Base()
            break;
          case "sucursal2":
            this.auditoria.cajas_sistema= element.cantidadCajas3
            this.auditoria.piezas_sistema= element.cantidadPiezas3
            
            this.calcularTotalM2Base()
            break;
          default:
            break;
        }
        
      }
    })
  }

  

  regresar(){
    var x = document.getElementById("tablaAuditoria");
    var y = document.getElementById("newAudGlobal");
      x.style.display = "none";
      y.style.display = "block";
  }

  regresar2(){
    var x = document.getElementById("tabla4");
    var z = document.getElementById("tabla2");
    var y = document.getElementById("tabla3");
      x.style.display = "none";
      z.style.display = "none";
      y.style.display = "block";
  }

  verLista(id:number){
    var cont=0
    this.auditoriaProductosleida.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.auditoriaProductosleida.forEach(element=>{
        this.auditoriaProductosleida.splice(0)    
      })
    }
    this.auditoriaProductosBase.forEach(element=>{
      if(element.idPrincipal == id){
        this.auditoriaProductosleida.push(element)
      }
    })
    var x = document.getElementById("tablaAuditoria");
    var y = document.getElementById("newAudGlobal");
    var z = document.getElementById("tabla3");
      x.style.display = "block";
      y.style.display = "none";
      z.style.display = "none";
  }

  verLista2(e){
    var x = document.getElementById("tabla2");
    var y = document.getElementById("tabla3");
      x.style.display = "block";
      y.style.display = "none";
    var cont=0
    this.auditoriaProductosleida.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.auditoriaProductosleida.forEach(element=>{
        this.auditoriaProductosleida.splice(0)    
      })
    }
    this.auditoriaProductosBase.forEach(element=>{
      if(element.idPrincipal == e.idAuditoria){
        this.auditoriaProductosleida.push(element)
      }
    })
    
  }

  verLista3(e){
    
    var cont=0
    this.auditoriaProductosleida2.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.auditoriaProductosleida2.forEach(element=>{
        this.auditoriaProductosleida2.splice(0)    
      })
    }
    this.auditoriaProductosBase.forEach(element=>{
      if(element.idPrincipal == e.idAuditoria ){
        //alert("elll "+element.valoracion)
        if(element.valoracion!="Ok"){
          this.auditoriaProductosleida2.push(element)
        }
        
      }
    })

    if(this.auditoriaProductosleida2.length==0){

    }
    var x = document.getElementById("tabla4");
    var y = document.getElementById("tabla3");
      x.style.display = "block";
      y.style.display = "none";
    this.dataGrid2.instance.refresh()
   
  }

  llenarLista(id:number){
    var cont=0
    this.auditoriaProductosleida.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.auditoriaProductosleida.forEach(element=>{
        this.auditoriaProductosleida.splice(0)    
      })
    }
    this.auditoriaProductosBase.forEach(element=>{
      if(element.idPrincipal == id){
        this.auditoriaProductosleida.push(element)
      }
    })
  }

  onExporting (e) {
    e.component.beginUpdate();
    e.component.columnOption("condicion", "visible", true);
    e.component.columnOption("auditor", "visible", true);
    e.component.columnOption("auditado", "visible", true);
    e.component.columnOption("impacto", "visible", true);
    e.component.columnOption("sucursal.nombre", "visible", true);
    e.component.columnOption("observaciones", "visible", true);
   
  };
 
  onExported (e) {
    e.component.columnOption("condicion", "visible", false);
    e.component.columnOption("impacto", "visible", false);
    e.component.columnOption("auditor", "visible", false);
    e.component.columnOption("auditado", "visible", false);
    e.component.columnOption("sucursal.nombre", "visible", false);
    e.component.columnOption("observaciones", "visible", false);

    e.component.endUpdate();
  }

  cambiarEstadoSeleccionado(e){
    
  }

  getCourseFile = (e) => {
    this.verLista2(e.row.data)  
  }

  getCourseFile2 = (e) => {
    this.verLista3(e.row.data)  
  }

  getCourseFile3 = (e) => {
    this.eliminarAuditoria(e.row.data)  
  }

  eliminarAuditoria(e){
    Swal.fire({
      title: 'Eliminar Auditoría',
      text: "Esta seguro que desea eliminar la auditoria #"+e.idAud,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.mostrarMensaje()
        this.auditoriaProductoService.deleteAuditoria(e).subscribe( res => { 
          this.actualizarProductoEliminado(e)
        }, err => {alert("error")})
        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  actualizarProductoEliminado(e){
    var sumaProductos=0
    this.productos.forEach(element=>{
      if(element.PRODUCTO == e.producto.PRODUCTO){
        switch (e.sucursal.nombre) {
          case "matriz":
            sumaProductos= element.sucursal1- e.m2diferencia
            this.productoService.updateProductoSucursal1ComD(element,sumaProductos,element.precio).subscribe( res => {this.eliminarTransaccion(e)}, err => {alert("error")})
            break;
          case "sucursal1":
            sumaProductos= element.sucursal2- e.m2diferencia
            this.productoService.updateProductoSucursal2ComD(element,sumaProductos,element.precio).subscribe( res => {this.eliminarTransaccion(e)}, err => {alert("error")})
            break;
          case "sucursal2":
            sumaProductos= element.sucursal3- e.m2diferencia
          this.productoService.updateProductoSucursal3ComD(element,sumaProductos,element.precio).subscribe( res => {this.eliminarTransaccion(e)}, err => {alert("error")})
              break;
          default:
        }

      }
    })
  }

  eliminarTransaccion(e){
    alert("ddd "+e.idPrincipal)
    alert("ddd "+e.producto.PRODUCTO)
    this.transacciones.forEach(element=>{
      if(element.documento == e.idPrincipal &&  element.producto == e.producto.PRODUCTO){
        if(element.tipo_transaccion=="ajuste-faltante" || element.tipo_transaccion=="ajuste-sobrante"){
          this.transaccionesService.deleteTransaccion(element).subscribe( res => {this.mensajeOK()}, err => {alert("error")})
        }
      }
    })
  }

  seguirAuditoria(i:number){
    this.pass = localStorage.getItem("contrasena");
    if (this.pass == this.auditoriasIniciadas[i].contrasena ) {
      var x = document.getElementById("newAud");
      var y = document.getElementById("newAudGlobal");
      var z = document.getElementById("tabla3");
      x.style.display = "block";
      y.style.display = "none";
      z.style.display = "none";
      this.auditoria.sucursal = this.auditoriasIniciadas[i].sucursal
      this.auditoria.idPrincipal = this.auditoriasIniciadas[i].idAuditoria
      this.auditoria.auditado = this.auditoriasIniciadas[i].auditado
      this.nombreSucursal =  this.auditoriasIniciadas[i].sucursal.nombre
      this.auditoria.idAud = this.auditoriasIniciadas[i].idAuditoria +" - "+ Number(this.auditoriasIniciadas[i].cantidad_productos+1)
      this.idAuditorialeida = this.auditoriasIniciadas[i]
      this.auditoria.auditor = this.usuarioLogueado[0].name
      this.numProductos = Number(this.auditoriasIniciadas[i].cantidad_productos+1)
      this.llenarLista(this.auditoriasIniciadas[i].idAuditoria)
    }else{
      Swal.fire(
        'Error',
        'Usted no se encuentra realizando esta auditoria, debe primero ingresar el código',
        'error'
      )
    }
         
  }

  mensajeOK(){
    Swal.close()
    Swal.fire({
      title: 'Correcto',
      text: 'Se eliminó con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }

  separarAuditorias(){
   
    this.auditoriasBase.forEach(element=>{
      if(element.estado == "Iniciada"){
        this.auditoriasIniciadas.push(element)
      }else{
        this.auditoriasAcabadas.push(element)
      }
    })
    
  }

  obtenerSucursal(e){
    this.locales.forEach(element=>{
      if(element.nombre == e.value){
        this.newAuditoria.sucursal = element
        this.nameSucursal= element.nombre       
      }
    })
  }

  validarSucursal(e){
    var cont=0
    this.auditoriasIniciadas.forEach(element=>{
      if(element.sucursal.nombre == e.value){
        cont++
      }
    })
    if(cont==0){
      this.obtenerSucursal(e)
    }else{
      this.nameSucursal = " "
      this.newAuditoria.sucursal = undefined
      Swal.fire({
        title: 'Error',
        text: 'Hay un proceso iniciado, finalice primero para poder continuar',
        icon: 'error'
      })
    }
  }

  mostrar(i:number){

  }

  guardarAuditoria(){

    if( this.newAuditoria.contrasena!=undefined && this.newAuditoria.sucursal != undefined && this.newAuditoria.auditado!= " "){
      
       this.mostrarMensaje()
      new Promise<any>((resolve, reject) => {
        this.auditoriasService.newAuditoria(this.newAuditoria).subscribe( res => {
          this.contadores[0].auditorias_Ndocumento=this.newAuditoria.idAuditoria
          this.contadoresService.updateContadoresIDAuditorias(this.contadores[0]).subscribe( res => {this.mensajeCorrecto()}, err => {alert("error")})
        }, err => {alert("error")})
      }) 
    }else{
      Swal.fire({
        title: 'Error al guardar',
        text: 'Hay campos vacios',
        icon: 'error'
      })
    }
  }

  guardarAuditoriaProducto(){
    this.auditoria.fecha= new Date().toLocaleDateString()
   
   if( this.auditoria.m2fisico!=0 && this.auditoria.valoracion!= undefined){
    this.actualizarUbicacion()
      this.mostrarMensaje()
     new Promise<any>((resolve, reject) => {
        this.auditoriaProductoService.newAuditoriaProducto(this.auditoria).subscribe( res => {
          this.auditoriasService.updateAuditoriaProductos(this.idAuditorialeida ,this.numProductos).subscribe( res => {this.mensajeCorrecto()}, err => {alert("error")})
        }, err => {alert("error")})
  
  
     }) 
   }else{
     Swal.fire({
       title: 'Error al guardar',
       text: 'Hay campos vacios',
       icon: 'error'
     })
   }
 }

 guardarEditAuditoriaProducto(){
  this.editAuditoria.fecha= new Date().toLocaleDateString()
 if( this.editAuditoria.m2fisico!=0 && this.editAuditoria.valoracion!= undefined){
    this.mostrarMensaje()
   new Promise<any>((resolve, reject) => {
      this.auditoriaProductoService.updateAuditoriaProducto(this.editAuditoria).subscribe( res => {this.mensajeUpdate()}, err => {alert("error")})
   }) 
 }else{
   Swal.fire({
     title: 'Error al guardar',
     text: 'Hay campos vacios',
     icon: 'error'
   })
 }
}

  finalizarAuditoria(i:number){
    this.auditoriasIniciadas[i].estado = "Finalizada"
    Swal.fire({
      title: 'Finalizar auditoria',
      text: "Desea finalizar el proceso de auditoria #"+this.auditoriasIniciadas[i].idAuditoria,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        new Promise<any>((resolve, reject) => {
          var fecha2=new Date()
          this.auditoriasService.updateAuditoriaEstado(this.auditoriasIniciadas[i],fecha2,"Finalizada").subscribe( res => {this.mensajeCorrecto2()}, err => {alert("error")})
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  eliminarAuditoriaProducto(id:number){
    
    Swal.fire({
      title: 'Eliminar Auditoria',
      text: "Desea eliminar la auditoria del producto "+this.auditoriaProductosBase[id].nombreproducto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.auditoriaProductosBase.forEach(element=>{
          if(element.idAud ==this.auditoriaProductosleida[id].idAud ){
            this.auditoriaProductoService.deleteAuditoria(this.auditoriaProductosleida[id]).subscribe( res => {this.auditoriaProductosleida.splice(id,1)}, err => {alert("error")})
          }
        })
        
  
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    })
  }

  realizarActualizaciones(){
    this.mostrarMensaje()
    var contVal=0
    this.auditoriaProductosleida.forEach(element=>{
      if(element.condicion != "OK"){
          this.transaccion = new transaccion()
          this.transaccion.fecha_mov= new Date().toLocaleDateString()
          this.transaccion.fecha_transaccion=new Date()
          this.transaccion.sucursal=element.sucursal.nombre
          this.transaccion.totalsuma=element.impacto
          this.transaccion.bodega="12"
          
          this.transaccion.cantM2=0
          this.transaccion.costo_unitario=element.producto.precio
          this.transaccion.documento=element.idPrincipal+""
          this.transaccion.factPro=""
          this.transaccion.maestro=""
          this.transaccion.producto=element.producto.PRODUCTO
          if(element.cajas_diferencia <0 || element.piezas_diferencia<0){
            this.transaccion.cajas=element.cajas_diferencia*(-1)
            this.transaccion.piezas=element.piezas_diferencia*(-1)
            this.transaccion.valor=element.impacto*(-1)
            this.transaccion.totalsuma=element.impacto*(-1)
          }else{
            this.transaccion.cajas=element.cajas_diferencia
            this.transaccion.piezas=element.piezas_diferencia
            this.transaccion.valor=element.impacto
            this.transaccion.totalsuma=element.impacto
          }
          
          this.transaccion.usu_autorizado=this.usuarioLogueado[0].username
          this.transaccion.usuario=this.usuarioLogueado[0].username
          this.transaccion.idTransaccion=this.number_transaccion++
          this.transaccion.cliente=""
          switch (element.condicion) {
            case "SOBRANTE":
              this.transaccion.tipo_transaccion="ajuste-sobrante"
              this.transaccion.movimiento=1
              break;
            case "FALTANTE":
              this.transaccion.tipo_transaccion="ajuste-faltante"
              this.transaccion.movimiento=-1
              break;
          
            default:
              break;
          }

          this.transaccionesService.newTransaccion(this.transaccion).subscribe(
            res => {
              this.contadores[0].transacciones_Ndocumento = this.number_transaccion
              this.contadoresService.updateContadoresIDTransacciones(this.contadores[0]).subscribe(
                res => {
                  this.db.collection("/consectivosBaseMongoDB").doc("base").update({ transacciones_Ndocumento:this.number_transaccion })
                  .then(res => { contVal++,this.contadorValidaciones(contVal) }, err => (err));
                },
                err => {
                  Swal.fire({
                    title: "Error al guardar",
                    text: 'Revise e intente nuevamente',
                    icon: 'error'
                  })
                })
            },
            err => {
              Swal.fire({
                title: err.error,
                text: 'Revise e intente nuevamente',
                icon: 'error'
              })
            })
          }else{
            contVal++,this.contadorValidaciones(contVal)
          }
    })
  
  }

  contadorValidaciones(i:number){
    if(this.auditoriaProductosleida.length==i){
      this.actualizarProductos()
     //alert("termine")
    }else{
      console.log("no he entrado "+i)
    }
  }

  editarAuditoriaProducto(id:string){
    //alert("entre editar"+id)
    this.auditoriaProductosBase.forEach(element=>{
      if(element.idAud ==id ){
        this.editAuditoria = element
        this.editAuditoria.idAud = element.idAud
        this.productoEntregado= element.nombreproducto
        this.nombreSucursal= element.sucursal.nombre
        var x = document.getElementById("editAud");
          var y = document.getElementById("tablaAuditoria");
          x.style.display = "block";
          y.style.display = "none";
      }
    })
  }


  actualizarProductos(){
    var contVal=0
    this.auditoriaProductosleida.forEach(element=>{
        switch (element.sucursal.nombre) {
          case "matriz":
            element.producto.sucursal1=element.m2fisico-element.producto.suc1Pendiente
            this.productoService.updateProductoSucursal1(element.producto).subscribe( res => {contVal++,this.contadorValidaciones2(contVal)}, err => {})
            break;
          case "sucursal1":
            element.producto.sucursal2=element.m2fisico-element.producto.suc2Pendiente
            this.productoService.updateProductoSucursal2(element.producto).subscribe( res => {contVal++,this.contadorValidaciones2(contVal)}, err => {})
            break;
          case "sucursal2":
            element.producto.sucursal3=element.m2fisico-element.producto.suc3Pendiente
            this.productoService.updateProductoSucursal3(element.producto).subscribe( res => {contVal++,this.contadorValidaciones2(contVal)}, err => {})
            break;
          default:
        }
    })
  }

  contadorValidaciones2(i:number){
    this.auditoriasIniciadas.forEach(element=>{
      if(element.idAuditoria == this.auditoriaProductosleida[0].idPrincipal){ 
        this.auditoriaEditable=element
      }
    })

    if(this.auditoriaProductosleida.length==i){
      var fecha2= new Date()
      this.auditoriasService.updateAuditoriaEstado(this.auditoriaEditable,fecha2,"Finalizada").subscribe( res => {
         Swal.fire({
          title: 'Correcto',
          text: 'Se ha realizado su auditoria',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
        })
      }, err => {alert("error")})
    
    }else{
      console.log("no he entrado "+i)
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
            this.validarRol()
          },
          err => {
          }
        )
    });
  }

  validarRol(){
    if(this.usuarioLogueado[0].rol == "Administrador"){
      //var z = document.getElementById("admin");
      //z.style.display = "block";
    }
  }

  calcularTotalM2Base(){
    this.auditoria.m2base=parseFloat(((this.auditoria.producto.M2*this.auditoria.cajas_sistema)+((this.auditoria.piezas_sistema*this.auditoria.producto.M2)/this.auditoria.producto.P_CAJA)).toFixed(2))
    console.log("fff "+this.auditoria.m2base)
  }

  calcularTotalM2(){
    this.auditoria.m2fisico=parseFloat(((this.auditoria.producto.M2*this.auditoria.cajas_fisico)+((this.auditoria.piezas_fisico*this.auditoria.producto.M2)/this.auditoria.producto.P_CAJA)).toFixed(2))
    console.log("fff "+this.auditoria.m2fisico)
    this.calculardiferencia()
  }

  calcularTotalM2Dano(){
    this.auditoria.m2daño=parseFloat(((this.auditoria.producto.M2*this.auditoria.cajas_danadas)+((this.auditoria.piezas_danadas*this.auditoria.producto.M2)/this.auditoria.producto.P_CAJA)).toFixed(2))
    console.log("fff "+this.auditoria.m2daño)
    this.auditoria.impactoDanado = parseFloat((this.auditoria.m2daño * this.auditoria.producto.precio).toFixed(2))
  }

  calcularTotalM2Edit(){
    this.editAuditoria.m2fisico=parseFloat(((this.editAuditoria.producto.M2*this.editAuditoria.cajas_fisico)+((this.editAuditoria.piezas_fisico*this.editAuditoria.producto.M2)/this.editAuditoria.producto.P_CAJA)).toFixed(2))
    console.log("fff "+this.editAuditoria.m2fisico)
    this.calculardiferencia2()
  }

  calcularTotalM2DanoEdit(){
    this.editAuditoria.m2daño=parseFloat(((this.editAuditoria.producto.M2*this.editAuditoria.cajas_danadas)+((this.editAuditoria.piezas_danadas*this.editAuditoria.producto.M2)/this.editAuditoria.producto.P_CAJA)).toFixed(2))
    console.log("fff "+this.editAuditoria.m2daño)
    this.editAuditoria.impactoDanado = parseFloat((this.editAuditoria.m2daño * this.editAuditoria.producto.precio).toFixed(2))
  }

  calculardiferencia(){
    if(this.auditoria.producto.CLASIFICA != "Ceramicas" && this.auditoria.producto.CLASIFICA != "Porcelanatos" ){
       this.auditoria.m2diferencia=this.auditoria.m2fisico-this.auditoria.m2base
    }else{
      if(this.auditoria.m2fisico<this.auditoria.m2base){
        
        this.auditoria.m2diferencia=this.auditoria.m2fisico-this.auditoria.m2base-0.04
      }else{
        //alert("entre2")
        this.auditoria.m2diferencia=this.auditoria.m2fisico-this.auditoria.m2base+0.03
      }
      
    }
    
    console.log("la diferencia es "+this.auditoria.m2diferencia)
    this.auditoria.cajas_diferencia=Math.trunc(this.auditoria.m2diferencia /  this.auditoria.producto.M2);
    console.log("cajas diferencia "+this.auditoria.cajas_diferencia)
    
    this.auditoria.piezas_diferencia=Math.trunc(this.auditoria.m2diferencia * this.auditoria.producto.P_CAJA /this.auditoria.producto.M2) - (this.auditoria.cajas_diferencia * this.auditoria.producto.P_CAJA);
    console.log("piezas diferencia "+this.auditoria.piezas_diferencia)

    this.auditoria.impacto = parseFloat((this.auditoria.m2diferencia * this.auditoria.producto.precio).toFixed(2))
    if(this.auditoria.cajas_diferencia==0 && this.auditoria.piezas_diferencia==0){
      this.auditoria.condicion= "OK"
      this.auditoria.impacto=0
    }else if (this.auditoria.m2diferencia<0){
      this.auditoria.condicion = "FALTANTE"
    }else if(this.auditoria.m2diferencia >0){
      this.auditoria.condicion = "SOBRANTE"
    } 
  }

  calculardiferencia2(){
    //alert("sssss "+JSON.stringify(this.editAuditoria))
    if(this.editAuditoria.producto.CLASIFICA != "Ceramicas" && this.editAuditoria.producto.CLASIFICA != "Porcelanatos" ){
      this.editAuditoria.m2diferencia=this.editAuditoria.m2fisico-this.editAuditoria.m2base
    }else{
      if(this.editAuditoria.m2fisico<this.editAuditoria.m2base){
        this.editAuditoria.m2diferencia=this.editAuditoria.m2fisico-this.editAuditoria.m2base-0.04
      }else{
        this.editAuditoria.m2diferencia=this.editAuditoria.m2fisico-this.editAuditoria.m2base+0.03
      }
    }
    
    console.log("la diferencia es "+this.editAuditoria.m2diferencia)
    this.editAuditoria.cajas_diferencia=Math.trunc(this.editAuditoria.m2diferencia /  this.editAuditoria.producto.M2);
    console.log("SSS "+this.editAuditoria.producto.M2)
    console.log("cajas diferencia "+this.editAuditoria.cajas_diferencia)
    
    this.editAuditoria.piezas_diferencia=Math.trunc(this.editAuditoria.m2diferencia * this.editAuditoria.producto.P_CAJA /this.editAuditoria.producto.M2) - (this.editAuditoria.cajas_diferencia * this.editAuditoria.producto.P_CAJA);
    console.log("piezas diferencia "+this.editAuditoria.piezas_diferencia)

    this.editAuditoria.impacto = parseFloat((this.editAuditoria.m2diferencia * this.editAuditoria.producto.precio).toFixed(2))
    console.log("sss "+this.editAuditoria.impacto)

    if(this.editAuditoria.m2diferencia >0){
      this.editAuditoria.condicion = "SOBRANTE"
    }else if (this.editAuditoria.m2diferencia<0){
      this.editAuditoria.condicion = "FALTANTE"
    }else{
      this.editAuditoria.condicion= "OK"
    }
  }




  actualizarUbicacion(){
    //alert("entre")
     var cont=0
        switch (this.auditoria.sucursal.nombre) {
          case "matriz":
             for (let index = 0; index < this.auditoria.producto.ubicacionSuc1.length; index++) {
              const element2 = this.auditoria.producto.ubicacionSuc1[index];
               if(element2 == this.auditoria.ubicacion){
                cont++
              }  
            }
            
            if(cont==0){
              this.auditoria.producto.ubicacionSuc1.push(this.auditoria.ubicacion)
              this.productoService.updateProductoUbicaciones(this.auditoria.producto).subscribe( res => {}, err => {alert("error")})
            } 
            break;
           case "sucursal1":
            for (let index = 0; index < this.auditoria.producto.ubicacionSuc2.length; index++) {
              const element2 = this.auditoria.producto.ubicacionSuc2[index];
              if(element2 == this.auditoria.ubicacion){
                cont++
              } 
            }
            if(cont==0){
              this.auditoria.producto.ubicacionSuc2.push(this.auditoria.ubicacion)
              this.productoService.updateProductoUbicaciones(this.auditoria.producto).subscribe( res => {}, err => {alert("error")})
            }
            
            break;
          case "sucursal2":
            for (let index = 0; index < this.auditoria.producto.ubicacionSuc3.length; index++) {
              const element2 = this.auditoria.producto.ubicacionSuc3[index];
              if(element2 == this.auditoria.ubicacion){
                cont++
              } 
            }
            if(cont==0){
              this.auditoria.producto.ubicacionSuc3.push(this.auditoria.ubicacion)
              this.productoService.updateProductoUbicaciones(this.auditoria.producto).subscribe( res => {}, err => {alert("error")})
            }
              break; 
          default:
            break;
        } 
  }



  continuarAuditoria(i:number){
    Swal.fire({
      title: 'Código',
      showCancelButton: true,
      inputAttributes: {
        autocapitalize: 'off'
      },
      confirmButtonText: 'Ingresar',
      cancelButtonText: 'Cancelar',
      input: 'text',
    }).then((result) => {
      if (result.value) {
        if(result.value == this.auditoriasIniciadas[i].contrasena){
          var x = document.getElementById("newAud");
          var y = document.getElementById("newAudGlobal");
          var z = document.getElementById("tabla3");
          x.style.display = "block";
          y.style.display = "none";
          z.style.display = "none";
          localStorage.setItem('contrasena',  result.value);
          this.auditoria.sucursal = this.auditoriasIniciadas[i].sucursal
          this.auditoria.idPrincipal = this.auditoriasIniciadas[i].idAuditoria
          this.auditoria.auditado = this.auditoriasIniciadas[i].auditado
          this.nombreSucursal =  this.auditoriasIniciadas[i].sucursal.nombre
          this.auditoria.idAud = this.auditoriasIniciadas[i].idAuditoria +" - "+ Number(this.auditoriasIniciadas[i].cantidad_productos+1)
          this.idAuditorialeida = this.auditoriasIniciadas[i]
          this.auditoria.auditor = this.usuarioLogueado[0].name
          this.numProductos = Number(this.auditoriasIniciadas[i].cantidad_productos+1)
          this.llenarLista(this.auditoriasIniciadas[i].idAuditoria)
        }else{
          Swal.fire(
            'Error',
            'Código incorrecto',
            'error'
          )
        }
       
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })




      
  }

  mostrarMensaje(){
    let timerInterval
      Swal.fire({
        title: 'Guardando !',
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

  mensajeCorrecto(){
    Swal.close()
    Swal.fire({
      title: 'Auditoria Registrada',
      text: 'Se ha guardado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }

  mensajeUpdate(){
    Swal.close()
    Swal.fire({
      title: 'Auditoria Actualizada',
      text: 'Se ha guardado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }

  mensajeCorrecto2(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se ha realizado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }



  //desde aqui comienza seccion de consolidado

  cargarDatos(){
    // alert("entre con "+this.transacciones.length)
     console.log("entre")
     var contCajas=0
     var contCajas2=0
     var contCajas3=0
     var contPiezas=0
     var contPiezas2=0
     var contPiezas3=0
     for (let index = 0; index < this.productos.length; index++) {
       const element2 = this.productos[index];
       console.log( this.productos[index].PRODUCTO)
 
       this.transacciones.forEach(element=>{
         if(element2.PRODUCTO==element.producto && element.sucursal=="matriz"){
           switch (element.tipo_transaccion) {
             case "devolucion":
               contCajas=Number(element.cajas)+contCajas
               contPiezas=Number(element.piezas)+contPiezas
               break;
              case "compra-dir":
               contCajas=Number(contCajas)+Number(element.cajas)
               contPiezas=Number(contPiezas)+Number(element.piezas)
               break;
             case "compra":
               contCajas=Number(contCajas)+Number(element.cajas)
               contPiezas=Number(contPiezas)+Number(element.piezas)
               break;
             case "compra_obs": 
               contCajas=Number(contCajas)+Number(element.cajas)
               contPiezas=Number(contPiezas)+Number(element.piezas)
               break;
             case "baja":
               contCajas=Number(contCajas)-Number(element.cajas)
               contPiezas=Number(contPiezas)-Number(element.piezas)
              break;
              case "venta-fact":
                console.log("enteteeeeee")
               contCajas=Number(contCajas)-Number(element.cajas)
               contPiezas=Number(contPiezas)-Number(element.piezas)
              break;
              case "venta-not":
               contCajas=Number(contCajas)-Number(element.cajas)
               contPiezas=Number(contPiezas)-Number(element.piezas)
              break;
              case "ajuste-faltante": 
              contCajas=Number(contCajas)-Number(element.cajas)
              contPiezas=Number(contPiezas)-Number(element.piezas)
              break;
              case "traslado1":
               contCajas=Number(contCajas)-Number(element.cajas)
               contPiezas=Number(contPiezas)-Number(element.piezas)
              break;
              case "traslado2":
               contCajas=Number(contCajas)+Number(element.cajas)
               contPiezas=Number(contPiezas)+Number(element.piezas)
              break;
              case "ajuste-sobrante":
              contCajas=Number(contCajas)+Number(element.cajas)
              contPiezas=Number(contPiezas)+Number(element.piezas)
             break;
             default:    
             console.log("el 22"+element2.PRODUCTO + " tiene"+element.cajas)
           }   
         
         }else if(element2.PRODUCTO==element.producto && element.sucursal=="sucursal1"){
           switch (element.tipo_transaccion) {
             case "devolucion":
               contCajas2=Number(element.cajas)+contCajas2
               contPiezas2=Number(element.piezas)+contPiezas2
               break;
              case "compra-dir":
               contCajas2=Number(contCajas2)+Number(element.cajas)
               contPiezas2=Number(contPiezas2)+Number(element.piezas)
               break;
             case "compra":
               contCajas2=Number(contCajas2)+Number(element.cajas)
               contPiezas2=Number(contPiezas2)+Number(element.piezas)
               break;
             case "compra_obs": 
               contCajas2=Number(contCajas2)+Number(element.cajas)
               contPiezas2=Number(contPiezas2)+Number(element.piezas)
               break;
             case "baja":
               contCajas2=Number(contCajas2)-Number(element.cajas)
               contPiezas2=Number(contPiezas2)-Number(element.piezas)
              break;
              case "venta-fact":
               contCajas2=Number(contCajas2)-Number(element.cajas)
               contPiezas2=Number(contPiezas2)-Number(element.piezas)
              break;
              case "venta-not":
               contCajas2=Number(contCajas2)-Number(element.cajas)
               contPiezas2=Number(contPiezas2)-Number(element.piezas)
              break;
              case "ajuste-faltante": 
              contCajas2=Number(contCajas2)-Number(element.cajas)
              contPiezas2=Number(contPiezas2)-Number(element.piezas)
              break;
              case "traslado1":
               contCajas2=Number(contCajas2)-Number(element.cajas)
               contPiezas2=Number(contPiezas2)-Number(element.piezas)
              break;
              case "traslado2":
               contCajas2=Number(contCajas2)+Number(element.cajas)
               contPiezas2=Number(contPiezas2)+Number(element.piezas)
              break;
              case "ajuste-sobrante":
              contCajas2=Number(contCajas2)+Number(element.cajas)
              contPiezas2=Number(contPiezas2)+Number(element.piezas)
             break;
             default:    
           } 
           console.log("el "+element2.PRODUCTO + " tiene"+element.cajas)
           console.log("el 22"+element2.PRODUCTO + " tiene"+contCajas2)  
         }else if(element2.PRODUCTO==element.producto && element.sucursal=="sucursal2"){
           switch (element.tipo_transaccion) {
             case "devolucion":
               contCajas3=Number(element.cajas)+contCajas3
               contPiezas3=Number(element.piezas)+contPiezas3
               break;
              case "compra-dir":
               contCajas3=Number(contCajas3)+Number(element.cajas)
               contPiezas3=Number(contPiezas3)+Number(element.piezas)
               break;
             case "compra":
               contCajas3=Number(contCajas3)+Number(element.cajas)
               contPiezas3=Number(contPiezas3)+Number(element.piezas)
               break;
             case "compra_obs": 
               contCajas3=Number(contCajas3)+Number(element.cajas)
               contPiezas3=Number(contPiezas3)+Number(element.piezas)
               break;
             case "baja":
               contCajas3=Number(contCajas3)-Number(element.cajas)
               contPiezas3=Number(contPiezas3)-Number(element.piezas)
              break;
              case "ajuste-faltante": 
              contCajas3=Number(contCajas3)-Number(element.cajas)
              contPiezas3=Number(contPiezas3)-Number(element.piezas)
              break;
              case "venta-fact":
               contCajas3=Number(contCajas3)-Number(element.cajas)
               contPiezas3=Number(contPiezas3)-Number(element.piezas)
              break;
              case "venta-not":
               contCajas3=Number(contCajas3)-Number(element.cajas)
               contPiezas3=Number(contPiezas3)-Number(element.piezas)
              break;
              case "traslado1":
               contCajas3=Number(contCajas3)-Number(element.cajas)
               contPiezas3=Number(contPiezas3)-Number(element.piezas)
              break;
              case "traslado2":
               contCajas3=Number(contCajas3)+Number(element.cajas)
               contPiezas3=Number(contPiezas3)+Number(element.piezas)
              break;
              case "ajuste-sobrante":
              contCajas3=Number(contCajas3)+Number(element.cajas)
              contPiezas3=Number(contPiezas3)+Number(element.piezas)
             break;
             
             default:    
           } 
          /*  console.log("el "+element2.PRODUCTO + " tiene"+element.cajas)
           console.log("el 22"+element2.PRODUCTO + " tiene"+contCajas2)   */
         }
         
       })
       var cantidadRestante=0
       this.invetarioProd=new inventario
       this.invetarioProd.producto=element2
       this.invetarioProd.cantidadCajas=contCajas
       this.invetarioProd.cantidadCajas2=contCajas2
       this.invetarioProd.cantidadCajas3=contCajas3
 
       this.invetarioProd.cantidadPiezas=contPiezas
       this.invetarioProd.cantidadPiezas2=contPiezas2
       this.invetarioProd.cantidadPiezas3=contPiezas3
       this.invetarioP.push(this.invetarioProd)
 
      console.log("el producto "+element2.PRODUCTO+" tiene "+contCajas +" cajas")
       contCajas=0
       contPiezas=0
       contCajas2=0
       contPiezas2=0
       contCajas3=0
       contPiezas3=0
     }  
     this.transformarM2()
     //this.sumarProductosRestados()
   }

   transformarM2(){
    this.invetarioP.forEach(element=>{
      element.cantidadM2= parseFloat(((element.producto.M2*element.cantidadCajas)+((element.cantidadPiezas*element.producto.M2)/element.producto.P_CAJA)).toFixed(2))
      element.cantidadM2b2= parseFloat(((element.producto.M2*element.cantidadCajas2)+((element.cantidadPiezas2*element.producto.M2)/element.producto.P_CAJA)).toFixed(2))
      element.cantidadM2b3= parseFloat(((element.producto.M2*element.cantidadCajas3)+((element.cantidadPiezas3*element.producto.M2)/element.producto.P_CAJA)).toFixed(2))
      element.totalb1=parseFloat((element.cantidadM2*element.producto.precio).toFixed(2))
      element.totalb2=parseFloat((element.cantidadM2b2*element.producto.precio).toFixed(2))
      element.totalb3=parseFloat((element.cantidadM2b3*element.producto.precio).toFixed(2))
    })
    this.sumarProductosRestados()
    this.cambiarValores()
    this.controlarInventario()
   }

   sumarProductosRestados(){
    for (let index = 0; index < this.productos.length; index++) {
      const element = this.productos[index];
      this.invetarioP.forEach(element2=>{
          if(element.PRODUCTO == element2.producto.PRODUCTO){
            element2.cantidadM2=element2.cantidadM2+element.suc1Pendiente
            element2.cantidadM2b2=element2.cantidadM2b2+element.suc2Pendiente
            element2.cantidadM2b3=element2.cantidadM2b3+element.suc3Pendiente
            
          }
      })
    }
  }

   controlarInventario(){
     this.invetarioP.forEach(element=>{
      if(element.cantidadM2 <0){
        this.invetarioFaltante1 = new invFaltanteSucursal
        this.invetarioFaltante1.producto=element.producto
        this.invetarioFaltante1.cantidadCajas= element.cantidadCajas
        this.invetarioFaltante1.cantidadPiezas= element.cantidadPiezas
        this.invetarioFaltante1.cantidadM2= element.cantidadCajas
        this.invetarioFaltante1.totalb1= element.totalb1
        this.invetarioFaltante1.sucursal= "Matriz"
        this.invetarioFaltante.push(this.invetarioFaltante1)
      }
       if(element.cantidadM2b2 <0){
        this.invetarioFaltante1 = new invFaltanteSucursal
        this.invetarioFaltante1.producto=element.producto
        this.invetarioFaltante1.cantidadCajas= element.cantidadCajas2
        this.invetarioFaltante1.cantidadPiezas= element.cantidadPiezas2
        this.invetarioFaltante1.cantidadM2= element.cantidadCajas2
        this.invetarioFaltante1.totalb1= element.totalb2
        this.invetarioFaltante1.sucursal= "Sucursal 1"
        this.invetarioFaltante.push(this.invetarioFaltante1)
      }
       if(element.cantidadM2b3 <0){
        this.invetarioFaltante1 = new invFaltanteSucursal
        this.invetarioFaltante1.producto=element.producto
        this.invetarioFaltante1.cantidadCajas= element.cantidadCajas3
        this.invetarioFaltante1.cantidadPiezas= element.cantidadPiezas3
        this.invetarioFaltante1.cantidadM2= element.cantidadCajas3
        this.invetarioFaltante1.totalb1= element.totalb3
        this.invetarioFaltante1.sucursal= "Sucursal 2"
        this.invetarioFaltante.push(this.invetarioFaltante1)
      }
     })
    this.ajustarSaldos()
   }

   ajustarSaldos(){
    this.invetarioP.forEach(element=>{
      if(element.cantidadM2 <= 0){
        element.cantidadCajas=0
        element.cantidadPiezas=0
        element.cantidadM2=0
        element.totalb1=0
      }
      if(element.cantidadM2b2 <= 0){
        element.cantidadCajas2=0
        element.cantidadPiezas2=0
        element.cantidadM2b2=0
        element.totalb2=0
      }
      if(element.cantidadM2b3 <= 0){
        element.cantidadCajas3=0
        element.cantidadPiezas3=0
        element.cantidadM2b3=0
        element.totalb3=0
      }
    })
   }

  cambiarValores(){
    this.invetarioP.forEach(element=>{
      element.cantidadCajas=Math.trunc( element.cantidadM2 / element.producto.M2);
      element.cantidadPiezas=parseInt(((element.cantidadM2 * element.producto.P_CAJA / element.producto.M2) - (element.cantidadCajas * element.producto.P_CAJA)).toFixed(0))
      element.cantidadM2=parseInt(element.cantidadM2.toFixed(0))

      element.cantidadCajas2=Math.trunc( element.cantidadM2b2 / element.producto.M2);
      element.cantidadPiezas2=parseInt(((element.cantidadM2b2 * element.producto.P_CAJA / element.producto.M2) - (element.cantidadCajas2 * element.producto.P_CAJA)).toFixed(0));
      element.cantidadM2b2=parseInt(element.cantidadM2b2.toFixed(0))

      element.cantidadCajas3=Math.trunc( element.cantidadM2b3 / element.producto.M2);
      element.cantidadPiezas3=parseInt(((element.cantidadM2b3 * element.producto.P_CAJA / element.producto.M2) - (element.cantidadCajas3 * element.producto.P_CAJA)).toFixed(0));
      element.cantidadM2b3=parseInt(element.cantidadM2b3.toFixed(0))
    })
  }


}
