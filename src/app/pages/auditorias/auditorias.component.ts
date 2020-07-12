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

@Component({
  selector: 'app-auditorias',
  templateUrl: './auditorias.component.html',
  styleUrls: ['./auditorias.component.scss']
})
export class AuditoriasComponent implements OnInit {

  sucursal:string
  parametrizaciones: parametrizacionsuc[]=[]
  locales: Sucursal[]=[]
  productosActivos: producto[]=[]
  productos: producto[]=[]
  nombreSucursal:string
  auditoria:auditoriasProductos
  auditoriaProductosBase:auditoriasProductos[]=[]
  newAuditoria: auditoria
  contadores:contadoresDocumentos[]=[]
  nameSucursal:string=""
  auditoriasBase: auditoria[]=[]
  auditoriasIniciadas: auditoria[]=[]
  auditoriasAcabadas: auditoria[]=[]
  idAuditorialeida:auditoria
  numProductos:number
  valordefault=0
  seleccionado:boolean=false
  menuValoracion: string[] = [
    "Roto",
    "Sin vigencia",
    "Desmantelado",
    "No funcional",
    "Obsoleto",
    "Rayado",
    "Manchado"
  ];

  constructor(public auditoriaProductoService: AuditoriaProductoService, public auditoriasService:AuditoriasService, public contadoresService:ContadoresDocumentosService, public parametrizacionService: ParametrizacionesService, public sucursalesService: SucursalesService , public productoService:ProductoService) { 
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

  }

  cambiarEstadoSeleccionado(e){
    
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
    console.log("datos "+JSON.stringify(this.newAuditoria))
   if( this.auditoria.cajas_fisico!=0 && this.auditoria.piezas_fisico != 0){
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
   /*  Swal.fire({
      title: 'Ingrese el código /contraseña',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Ingresar',
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        return fetch(`//api.github.com/users/${login}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(response.statusText)
            }
            return response.json()
          })
          .catch(error => {
            Swal.showValidationMessage(
              `Request failed: ${error}`
            )
          })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: `${result.value.login}'s avatar`,
          imageUrl: result.value.avatar_url
        })
      }
    }) */


    


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
          this.nombreSucursal =  this.auditoriasIniciadas[i].sucursal.nombre
          this.auditoria.idAud = this.auditoriasIniciadas[i].idAuditoria +" - "+ Number(this.auditoriasIniciadas[i].cantidad_productos+1)
          this.idAuditorialeida = this.auditoriasIniciadas[i]
          this.numProductos = Number(this.auditoriasIniciadas[i].cantidad_productos+1)
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


}
