import { Component, OnInit } from '@angular/core';
import { precios, preciosEspeciales, preciosGrupoDefinido } from './controlPrecios';
import { ControlPreciosService } from 'src/app/servicios/control-precios.service';
import Swal from 'sweetalert2';
import { element } from 'protractor';
import { PrecioEspecialService } from 'src/app/servicios/precio-especial.service';
import { catalogo } from '../catalogo/catalogo';
import { ProductoService } from 'src/app/servicios/producto.service';
import { CatalogoService } from 'src/app/servicios/catalogo.service';
import { producto } from '../ventas/venta';
import { Producto } from '../producto/producto';

@Component({
  selector: 'app-control-precios',
  templateUrl: './control-precios.component.html',
  styleUrls: ['./control-precios.component.scss']
})
export class ControlPreciosComponent implements OnInit {
  preciosGrupo:precios[]=[]
  precioLeido:precios
  precioLeido2:precios
  nuevoPrecio:precios
  nuevoPrecioAsig:precios
  precioespecial: preciosEspeciales
  precioEspecial2:preciosEspeciales[]=[]
  precioSocio:number=0
  precioDistribuidor:number=0
  preciosGrupoDefinido:preciosGrupoDefinido[]=[]
  preciosGrupoDefinido2:preciosGrupoDefinido
  productosCatalogo:catalogo[]=[]
  edit1:boolean=true
  edit2:boolean=true
  productos:producto[]=[]
  nombreGrupo:string=""
  nombrePro2:string=""
  nombrePro:producto
  constructor(public controlPreciosService:ControlPreciosService, public catalagoService:CatalogoService, public productosService:ProductoService, public preciosEspecialesService:PrecioEspecialService) { 
    this.precioespecial = new preciosEspeciales()
   // alert(JSON.stringify(this.precioespecial))
    this.nuevoPrecio= new precios()
    this.precioLeido2= new precios()
    this.nuevoPrecioAsig= new precios()
    this.precioespecial.precioSocio=0
    /* this.precioEspecial.precioSocio=0
    this.precioEspecial.precioDistribuidor=0 */
  }

  ngOnInit() {
    this.traerPrecios()
    this.traerProductos()
    this.traerPreciosEspeciales()
    this.traerProductosCatalogo()
   
    //this.registrarPrecio()
  }

  traerPrecios(){
    this.controlPreciosService.getPrecio().subscribe(res => {
      this.preciosGrupo = res as precios[];
   })
  }

  traerProductosCatalogo(){
    this.catalagoService.getCatalogo().subscribe(res => {
      this.productosCatalogo = res as catalogo[];
   })
  }

  traerProductos(){
    this.productosService.getProducto().subscribe(res => {
      this.productos = res as producto[];
      console.log("ssdd "+this.productos.length)
      
   })
  }

  traerPreciosEspeciales(){
    this.preciosEspecialesService.getPrecio().subscribe(res => {
      this.precioEspecial2 = res as preciosEspeciales[];
      console.log("sss"+this.precioEspecial2)
      this.precioespecial = this.precioEspecial2[0]
   })
  }



  editar(i:number){
    if(i==1){
      this.edit1=false
    }else{
      this.edit2=false
    }
    
  }

  guardar(){
    //alert(this.precioSocio)
    //this.precioespecial= new preciosEspeciales()
    
    if(this.precioespecial.precioDistribuidor!=0 && this.precioespecial.precioSocio!=0){
      this.preciosEspecialesService.updatePrecio(this.precioespecial).subscribe(res => {
        Swal.fire({
          title: "Correcto",
          text: 'Se guardó con éxito',
          icon: 'success'
        }).then((result) => {
          window.location.reload()
        })
      },
      err => {
        Swal.fire({
          title: "Error",
          text: 'Revise e intente nuevamente',
          icon: 'error'
        })
       })
    }else{
      Swal.fire({
        title: "Error",
        text: 'No puede haber cantidades en 0',
        icon: 'error'
      })
    }
  }

  limpiarArreglo(){
    var cont=0
    this.preciosGrupoDefinido.forEach(element=>{
      cont++
    })
   
    if(cont>=0){
      this.preciosGrupoDefinido.forEach(element=>{
        this.preciosGrupoDefinido.splice(0)
      })
    }
  }

  traerProductosDefinido(e){
    this.limpiarArreglo()
    var x = document.getElementById("new");
    var y = document.getElementById("edit");
    var z = document.getElementById("read");
    var z2 = document.getElementById("tabla");
    x.style.display = "none";
    y.style.display = "none";
    z.style.display = "none";
    z2.style.display = "block";

    this.nombreGrupo=e.aplicacion
     this.productos.forEach(element=>{
      
      if(element.APLICACION == e.aplicacion){  
        this.preciosGrupoDefinido2= new preciosGrupoDefinido
        this.preciosGrupoDefinido2.producto = element
        this.preciosGrupoDefinido2.aplicacion = e.aplicacion
        this.preciosGrupoDefinido2.precio = element.precio
        this.preciosGrupoDefinido2.cant1 = e.cant1
        this.preciosGrupoDefinido2.pventa1 = parseFloat((element.precio* e.percent1 / 100 + element.precio).toFixed(2))
        this.preciosGrupoDefinido2.percent1 = e.percent1

        //2
        this.preciosGrupoDefinido2.cant2 = e.cant2
        this.preciosGrupoDefinido2.pventa2 = parseFloat((element.precio* e.percent2 / 100 + element.precio).toFixed(2))
        this.preciosGrupoDefinido2.percent2 = e.percent2

        //3
        this.preciosGrupoDefinido2.cant3 = e.cant3
        this.preciosGrupoDefinido2.pventa3 = parseFloat((element.precio* e.percent3 / 100 + element.precio).toFixed(2))
        this.preciosGrupoDefinido2.percent3 = e.percent3
        this.preciosGrupoDefinido.push(this.preciosGrupoDefinido2)
      }
    }) 
  }


  registrar(){
    var cont=0
    this.preciosGrupo.forEach(element=>{
      if(element.aplicacion == this.nuevoPrecio.aplicacion){
        cont++
      }
    })
    if(cont==0){
      this.nuevoPrecio.cant3 =this.nuevoPrecio.cant2
      if(this.nuevoPrecio.aplicacion != "" && this.nuevoPrecio.cant1!=0 && this.nuevoPrecio.cant2!=0 && this.nuevoPrecio.cant3!=0
        && this.nuevoPrecio.percent1!=0 && this.nuevoPrecio.percent2!=0 && this.nuevoPrecio.percent3!=0){
          
          this.controlPreciosService.newPrecio(this.nuevoPrecio).subscribe(res => {
            console.log(res + "entre por si");this.mensajeCorrecto()},
          err => {
            Swal.fire({
              title: "Error",
              text: 'Revise e intente nuevamente',
              icon: 'error'
            })
           })
      }else{
        Swal.fire({
          title: "Error",
          text: 'Hay campos vacíos',
          icon: 'error'
        })
      }
     
    }else{
      Swal.fire({
        title: "Error",
        text: 'El nombre del grupo de precios ya existe',
        icon: 'error'
      })
    }

  }


  registrar2(){
    var cont=0
    this.preciosGrupo.forEach(element=>{
      if(element.aplicacion == this.nuevoPrecioAsig.aplicacion){
        cont++
      }
    })
    if(cont==0){
      this.nuevoPrecioAsig.cant3 =this.nuevoPrecioAsig.cant2
      if(this.nuevoPrecioAsig.aplicacion != "" && this.nuevoPrecioAsig.cant1!=0 && this.nuevoPrecioAsig.cant2!=0 && this.nuevoPrecioAsig.cant3!=0
        && this.nuevoPrecioAsig.percent1!=0 && this.nuevoPrecioAsig.percent2!=0 && this.nuevoPrecioAsig.percent3!=0){
          
          this.controlPreciosService.newPrecio(this.nuevoPrecioAsig).subscribe(res => {
            console.log(res + "entre por si");
            this.actualizarProductos(this.nombrePro,this.nuevoPrecioAsig.aplicacion )},
          err => {
            Swal.fire({
              title: "Error",
              text: 'Revise e intente nuevamente',
              icon: 'error'
            })
           })
      }else{
        Swal.fire({
          title: "Error",
          text: 'Hay campos vacíos',
          icon: 'error'
        })
      }
     
    }else{
      Swal.fire({
        title: "Error",
        text: 'El nombre del grupo de precios ya existe',
        icon: 'error'
      })
    }

  }

  actualizarProductos(producto:producto, aplicacion:string){
    alert("sss"+JSON.stringify(producto))
    this.catalagoService.updateCatalogoAplicacion(producto.PRODUCTO,aplicacion).subscribe(res => {
      this.productosService.updateProductoAplicacion(producto._id,aplicacion).subscribe(res => {
        console.log(res);this.mensajeCorrecto()},
      err => {
        Swal.fire({
          title: "Error",
          text: 'Revise e intente nuevamente',
          icon: 'error'
        })
       })
    },
    err => {
      Swal.fire({
        title: "Error",
        text: 'Revise e intente nuevamente',
        icon: 'error'
      })
     })
  }

  actualizar(){
    this.precioLeido2.cant3 =this.precioLeido2.cant2
    this.controlPreciosService.updatePrecio(this.precioLeido2).subscribe(res => {
      console.log(res + "entre por si");this.mensajeActualizacion()},
    err => {
      Swal.fire({
        title: "Error",
        text: 'Revise e intente nuevamente',
        icon: 'error'
      })
     })
  }


  mostrarUpdateUser = (e) => {  
    this.mostrarPopup(e.row.data)
    
  }

  nuevoRango= (e) => {  
    this.confirmarNuevo(e.row.data)  
  }

  confirmarNuevo(e){
    Swal.fire({
      title: 'Modificar Producto',
      text: "Desea asignar un nuevo rango para "+e.producto.PRODUCTO,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.nombrePro= e.producto
        this.nombrePro2= e.producto.PRODUCTO
        this.nuevoPrecioAsig = e
        var x = document.getElementById("new");
        var y = document.getElementById("edit");
        var z = document.getElementById("tabla");
        var z2 = document.getElementById("newRango");
        x.style.display = "none";
        y.style.display = "none";
        z.style.display = "none";
        z2.style.display = "block";
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }


  listarPro = (e) => {  
    this.traerProductosDefinido(e.row.data)
  }

   mostrarPopup(e:any){
    this.precioLeido2=e
    var x = document.getElementById("new");
    var y = document.getElementById("edit");
    var z = document.getElementById("read");
    var z2 = document.getElementById("read");
    x.style.display = "none";
    y.style.display = "block";
    z.style.display = "none";
    z2.style.display = "none";

  }

  errorRango(){
    Swal.fire({
      title: "Error",
      text: 'El numero de rango no puede ser menor al anterior',
      icon: 'error'
    })
  }

  controlarRango(){
    if(this.nuevoPrecio.cant1 >=this.nuevoPrecio.cant2){
     this.errorRango()
    }
  }

  controlarRango2(){
    if(this.precioLeido2.cant1 >=this.precioLeido2.cant2){
     this.errorRango()
    }
  }

  controlarRango3(){
    if(this.nuevoPrecioAsig.cant1 >=this.nuevoPrecioAsig.cant2){
     this.errorRango()
    }
  }
  
  deletePrecio= (e) => {  
    this.delete(e.row.data)
  }

  delete(e:any){
    Swal.fire({
      title: 'Advertencia',
      text: "Desea eliminar el grupo "+e.aplicacion,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.value) {
        this.deleteP(e)
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  deleteP(e:any) {
    this.precioLeido2=e
    //this.mensajeGuardando()
    this.controlPreciosService.deletePrecio(this.precioLeido2).subscribe(
      res => {
        console.log(); this.mensajeEliminado()
      },
      err => { console.log(err); this.mensajeError() }
    )
  }

  mensajeError(){
    Swal.fire({
      title: 'Error',
      text: 'Se produció un error al guardar',
      icon: 'error',
      confirmButtonText: 'Ok'
    })
  }

  mensajeEliminado(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se eliminó con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }

  

  mensajeCorrecto(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se guardó su grupo de precios',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }

  mensajeActualizacion(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se actualizó su grupo de precios',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }

  
registrarPrecio(){
  this.precioLeido= new precios
  this.precioLeido.aplicacion="Baldosa"
  this.precioLeido.cant1=10
  this.precioLeido.cant2=30
  this.precioLeido.cant3=60
  this.precioLeido.percent1=30
  this.precioLeido.percent2=20
  this.precioLeido.percent3=18
  this.controlPreciosService.newPrecio(this.precioLeido).subscribe(res => {
    console.log(res + "entre por si");alert("correcto");},
  err => {
    Swal.fire({
      title: "Error",
      text: 'Revise e intente nuevamente',
      icon: 'error'
    })
   })
}

mostrar(i: number) {
  var x = document.getElementById("read");
  var y = document.getElementById("new");
  var z = document.getElementById("edit");
  var z2 = document.getElementById("admin2");
  var z3 = document.getElementById("tabla");
  var z4 = document.getElementById("newRango");
  

  switch (i) {
    case 1:
      x.style.display = "block";
      y.style.display = "none";
      z.style.display = "none";
      z2.style.display = "none";
      z3.style.display = "none";
      z4.style.display = "none";
      break;

    case 2:
      x.style.display = "none";
      y.style.display = "block";
      z.style.display = "none";
      z2.style.display = "none";
      z3.style.display = "none";
      z4.style.display = "none";
      break;

    case 3:
        x.style.display = "none";
        y.style.display = "none";
        z.style.display = "none";
        z3.style.display = "none";
        z2.style.display = "block";
        z4.style.display = "none";
        break;
      

   
    default:
  }
}


}
