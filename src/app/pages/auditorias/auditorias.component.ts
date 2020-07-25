import { Component, OnInit } from '@angular/core';
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { SucursalesService } from 'src/app/servicios/sucursales.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { Sucursal } from '../compras/compra';
import { producto, contadoresDocumentos } from '../ventas/venta';
import { auditoria, auditoriasProductos } from './auditorias';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { element } from 'protractor';
import { AuditoriasService } from 'src/app/servicios/auditorias.service';
import Swal from 'sweetalert2';
import { AuditoriaProductoService } from 'src/app/servicios/auditoria-producto.service';
import { TransaccionesService } from 'src/app/servicios/transacciones.service';
import { transaccion } from '../transacciones/transacciones';
import { inventario, invFaltanteSucursal } from '../consolidado/consolidado';
import { user } from '../user/user';
import { AuthenService } from 'src/app/servicios/authen.service';

@Component({
  selector: 'app-auditorias',
  templateUrl: './auditorias.component.html',
  styleUrls: ['./auditorias.component.scss']
})
export class AuditoriasComponent implements OnInit {

  sucursal:string
  now: Date = new Date();
  productoEntregado:string
  parametrizaciones: parametrizacionsuc[]=[]
  locales: Sucursal[]=[]
  productosActivos: producto[]=[]
  productos: producto[]=[]
  nombreSucursal:string
  auditoria:auditoriasProductos
  auditoriaProductosBase:auditoriasProductos[]=[]
  auditoriaProductosleida:auditoriasProductos[]=[]
  auditoriaProductosleida2:auditoriasProductos[]=[]
  newAuditoria: auditoria
  contadores:contadoresDocumentos[]=[]
  nameSucursal:string=""
  auditoriasBase: auditoria[]=[]
  auditoriasIniciadas: auditoria[]=[]
  auditoriasAcabadas: auditoria[]=[]
  transacciones: transaccion[]=[]
  idAuditorialeida:auditoria
  numProductos:number
  btnRe: boolean=false
  valordefault=0
  invetarioProd:inventario
  invetarioP:inventario[]=[]
  invetarioFaltante1: invFaltanteSucursal
  invetarioFaltante:invFaltanteSucursal[]=[]
  lectura:boolean=false
  correo:string
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

  sucursalesDefault: string[] = [
    "Ver Auditorias",
    "Nueva Auditoria"
  ];

  constructor(public transaccionesService:TransaccionesService,public authenService:AuthenService, public auditoriaProductoService: AuditoriaProductoService, public auditoriasService:AuditoriasService, public contadoresService:ContadoresDocumentosService, public parametrizacionService: ParametrizacionesService, public sucursalesService: SucursalesService , public productoService:ProductoService) { 
    this.auditoria = new auditoriasProductos()
    this.newAuditoria = new auditoria()
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
      this.separarAuditoriasProductos()
   })
  }

  traerContadoresDocumentos(){
    this.contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
      this.newAuditoria.idAuditoria = this.contadores[0].auditorias_Ndocumento+1
   })
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
  }

  separarAuditoriasProductos(){
    this.auditoriaProductosBase.forEach(element=>{
      
    })
  }

  obtenerDetallesproducto(e){
    this.productosActivos.forEach(element=>{
      if(element.PRODUCTO == this.productoEntregado){
        this.auditoria.producto = element
        this.auditoria.nombreproducto = element.PRODUCTO
        if(element.CLASIFICA != "Ceramicas" && element.CLASIFICA != "Porcelanatos"){
          this.lectura=true
        }
        this.compararProducto()
      }
    })

  }

  compararProducto(){
    //alert("si")
    if(this.auditoriaProductosleida.length == 0){
      this.buscarInformacion()
    }else{
      this.auditoriaProductosleida.forEach(element=>{
        if(element.producto.PRODUCTO == this.auditoria.producto.PRODUCTO){
          Swal.fire({
            title: 'Error',
            text: 'Este producto ya ha sido auditado',
            icon: 'error'
          })
          this.productoEntregado=""
          this.btnRe=true
        }else{
          this.btnRe=false
          this.buscarInformacion()
        }
      })
    }
    
  }

  opcionMenu(e){
    var x = document.getElementById("newAudGlobal");
    var y = document.getElementById("tabla3");
    var z = document.getElementById("tabla2");
    var z0 = document.getElementById("tabla4");
    var z1 = document.getElementById("newAud");

    switch (e.value) {
      case  "Nueva Auditoria":
        x.style.display = "block";
        y.style.display="none";
        z.style.display="none";
        z1.style.display="none";
        z0.style.display="none";
       
       break;
      case "Ver Auditorias":
        x.style.display = "none";
        y.style.display="block";
        z.style.display="none";
        z1.style.display="none";
        z0.style.display="none";
       
       
        break;
      default:    
    }     
  }

  buscarInformacion(){
    //alert("ya")
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
      x.style.display = "block";
      y.style.display = "none";
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
    var x = document.getElementById("tabla4");
    var y = document.getElementById("tabla3");
      x.style.display = "block";
      y.style.display = "none";
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
      if(element.idPrincipal == e.idAuditoria){
        this.auditoriaProductosleida2.push(element)
      }
    })
   
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
    e.component.columnOption("impacto", "visible", true);
    e.component.columnOption("observaciones", "visible", true);
   
  };
 
  onExported (e) {
    e.component.columnOption("condicion", "visible", false);
    e.component.columnOption("impacto", "visible", false);
    e.component.columnOption("auditor", "visible", false);
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
    
     console.log("datos "+JSON.stringify(this.newAuditoria))
    if( this.newAuditoria.contrasena!=undefined && this.newAuditoria.sucursal != undefined){
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
    console.log("datos5555 "+JSON.stringify(this.auditoria))
   if( this.auditoria.m2fisico!=0 && this.auditoria.valoracion!= undefined){
      this.mostrarMensaje()
     new Promise<any>((resolve, reject) => {
       this.auditoriaProductoService.newAuditoriaProducto(this.auditoria).subscribe( res => {
         //this.contadores[0].auditorias_Ndocumento=this.newAuditoria.idAuditoria
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
          this.auditoriasService.updateAuditoriaEstado(this.auditoriasIniciadas[i],"Finalizada").subscribe( res => {this.mensajeCorrecto2()}, err => {alert("error")})
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
          if(element.idAud ==this.auditoriaProductosBase[id].idAud ){
            this.auditoriaProductoService.deleteAuditoria(this.auditoriaProductosBase[id]).subscribe( res => {this.auditoriaProductosBase.splice(id,1)}, err => {alert("error")})
          }
        })
        
  
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    })
  }

  editarAuditoriaProducto(id:number){
    alert("entre editar")

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

  calculardiferencia(){
    if(this.auditoria.producto.CLASIFICA != "Ceramicas" && this.auditoria.producto.CLASIFICA != "Porcelanatos" ){
      var m2diferencia=this.auditoria.m2fisico-this.auditoria.m2base
    }else{
      var m2diferencia=this.auditoria.m2fisico-this.auditoria.m2base-0.02
    }
    
    console.log("la diferencia es "+m2diferencia)
    this.auditoria.cajas_diferencia=Math.trunc(m2diferencia /  this.auditoria.producto.M2);
    console.log("cajas diferencia "+this.auditoria.cajas_diferencia)
    
    this.auditoria.piezas_diferencia=Math.trunc(m2diferencia * this.auditoria.producto.P_CAJA /this.auditoria.producto.M2) - (this.auditoria.cajas_diferencia * this.auditoria.producto.P_CAJA);
    console.log("piezas diferencia "+this.auditoria.piezas_diferencia)

    this.auditoria.impacto = parseFloat((m2diferencia * this.auditoria.producto.precio).toFixed(2))
    console.log("sss "+this.auditoria.impacto)

    if(m2diferencia >0){
      this.auditoria.condicion = "SOBRANTE"
    }else if (m2diferencia<0){
      this.auditoria.condicion = "FALTANTE"
    }else{
      this.auditoria.condicion= "OK"
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
          //var z = document.getElementById("aprobaciones");
          x.style.display = "block";
          y.style.display = "none";

          this.auditoria.sucursal = this.auditoriasIniciadas[i].sucursal
          this.auditoria.idPrincipal = this.auditoriasIniciadas[i].idAuditoria
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
              case "traslado1":
               contCajas=Number(contCajas)-Number(element.cajas)
               contPiezas=Number(contPiezas)-Number(element.piezas)
              break;
              case "traslado2":
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
              case "traslado1":
               contCajas2=Number(contCajas2)-Number(element.cajas)
               contPiezas2=Number(contPiezas2)-Number(element.piezas)
              break;
              case "traslado2":
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
