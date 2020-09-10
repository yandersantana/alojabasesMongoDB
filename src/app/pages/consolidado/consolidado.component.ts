import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertsService } from 'angular-alert-module';
import { producto, productosPendientesEntrega } from '../ventas/venta';
import { transaccion } from '../transacciones/transacciones';
import { element } from 'protractor';
import { inventario, invFaltanteSucursal } from './consolidado';
import { TransaccionesService } from 'src/app/servicios/transacciones.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { ProductosPendientesService } from 'src/app/servicios/productos-pendientes.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { BodegaService } from 'src/app/servicios/bodega.service';
import { bodega } from '../producto/producto';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-consolidado',
  templateUrl: './consolidado.component.html',
  styleUrls: ['./consolidado.component.scss']
})
export class ConsolidadoComponent implements OnInit {


  menu1: string[] = [
    "Inventario General",
    "Inventario Valorizado"
  ];


  popupVisible:boolean=false
  productos:producto[]=[]
  arregloUbicaciones1:string[]=[]
  arregloUbicaciones2:string[]=[]
  arregloUbicaciones3:string[]=[]
  transacciones:transaccion[]=[]
  invetarioP:inventario[]=[]
  invetarioFaltante1: invFaltanteSucursal
  invetarioFaltante:invFaltanteSucursal[]=[]
  invetarioProd:inventario
  productosPendientes:productosPendientesEntrega[]=[]
  productosPendientesNoEN:productosPendientesEntrega[]=[]
  bodegas:bodega[]=[]
  bodegasMatriz:string=""
  bodegasSucursal1:string=""
  bodegasSucursal2:string=""

  ubicacion1:string=""
  ubicacion2:string=""
  ubicacion3:string=""
  nameProducto: string=""
  
  

  constructor(public bodegasService:BodegaService, public transaccionesService: TransaccionesService,public productosPendientesService:ProductosPendientesService, public productoService:ProductoService) { 
  
  }

  ngOnInit() {
   //this.traerProductos()
   this.traerTransacciones()
   this.traerProductosPendientes()
   this.traerBodegas()
  }

  traerTransacciones(){
    this.transaccionesService.getTransaccion().subscribe(res => {
      this.transacciones = res as transaccion[];
      this.traerProductos()
      
   })
  }

  traerProductos(){
    this.productoService.getProductosActivos().subscribe(res => {
      this.productos = res as producto[];
      this.cargarDatos()
      //alert("jhjhj "+ this.productos.length)
   })
  }

  traerBodegas(){
    this.bodegasService.getBodegas().subscribe(res => {
      this.bodegas = res as bodega[];
      this.separarBodegas()
   })
  }

  separarBodegas(){
    this.bodegas.forEach(element=>{
      switch (element.sucursal) {
        case "matriz":
          this.bodegasMatriz= element.nombre + " , "+this.bodegasMatriz
          break;
        case "sucursal1":
          this.bodegasSucursal1= element.nombre + " , "+this.bodegasSucursal1
          break;
        case "sucursal2":
          this.bodegasSucursal2= element.nombre + " ,  "+this.bodegasSucursal2
          break;
      
        default:
          break;
      }
    })
  }
  

  traerProductosPendientes(){
    this.productosPendientesService.getProductoPendiente().subscribe(res => {
      this.productosPendientes = res as productosPendientesEntrega[];
      this.separarEntregas()
   })
  }

  actualizarUbicaciones(){
    this.popupVisible=false
    console.log("fff "+this.arregloUbicaciones1)
    console.log("fff "+this.arregloUbicaciones2)
    console.log("fff "+this.arregloUbicaciones3)
    this.productos.forEach(element=>{
      if(element.PRODUCTO == this.nameProducto){
        element.ubicacionSuc1= this.arregloUbicaciones1
        element.ubicacionSuc2= this.arregloUbicaciones2
        element.ubicacionSuc3= this.arregloUbicaciones3
        this.productoService.updateProductoUbicaciones(element).subscribe( res => {
          Swal.fire({
            title: 'Correcto',
            text: 'Su proceso se realizó con éxito',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            window.location.reload()
          })
        }, err => {alert("error")})
      }
    })
    
  }

 


  separarEntregas(){
    this.productosPendientes.forEach(element=>{
      if(element.estado == "PENDIENTE"){
          this.productosPendientesNoEN.push(element)
      }else{
      }
    })
  }

  nuevaUbicacion1(){
    this.arregloUbicaciones1.push(this.ubicacion1)
  }

  nuevaUbicacion2(){
    this.arregloUbicaciones2.push(this.ubicacion2)
  }

  nuevaUbicacion3(){
    this.arregloUbicaciones3.push(this.ubicacion3)
  }

  eliminar1(id: number){
    console.log("es el ID "+id)
    this.arregloUbicaciones1.splice(id,1)
  }

  eliminar2(id: number){
    this.arregloUbicaciones2.splice(id,1)
  }

  eliminar3(id: number){
    this.arregloUbicaciones3.splice(id,1)
  }

  modificar1(id: number,  event: any){
    this.arregloUbicaciones1[id]= event.target.textContent;
  }

  modificar2(id: number,  event: any){
    this.arregloUbicaciones2[id]= event.target.textContent;
  }

  modificar3(id: number,  event: any){
    this.arregloUbicaciones3[id]= event.target.textContent;
  }


  comenzarConsolidado(){
    this.traerProductos()
    this.traerTransacciones()
  }


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
            case "ajuste-faltante": 
              contCajas=Number(contCajas)-Number(element.cajas)
              contPiezas=Number(contPiezas)-Number(element.piezas)
              break;
            case "baja":
              contCajas=Number(contCajas)-Number(element.cajas)
              contPiezas=Number(contPiezas)-Number(element.piezas)
             break;
            case "venta-fact":
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
            case "ajuste-faltante": 
              contCajas2=Number(contCajas2)-Number(element.cajas)
              contPiezas2=Number(contPiezas2)-Number(element.piezas)
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
            case "ajuste-faltante": 
              contCajas3=Number(contCajas3)-Number(element.cajas)
              contPiezas3=Number(contPiezas3)-Number(element.piezas)
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
      //this.invetarioProd.bodega= "S1 ("+this.bodegasMatriz+" ) S2 ("+this.bodegasSucursal1+") S3("+this.bodegasSucursal2+")"
      this.invetarioProd.bodega= "S1 ("+element2.ubicacionSuc1+" ) S2 ("+element2.ubicacionSuc2+") S3("+element2.ubicacionSuc3+")"
      
      this.invetarioProd.ultimoPrecioCompra= element2.ultimoPrecioCompra
      this.invetarioProd.ultimaFechaCompra= element2.ultimaFechaCompra
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
    //this.transformarM2()
  }

  mensajeActualizando(){
    let timerInterval
          Swal.fire({
          title: 'Actualizando !',
          html: 'Procesando',
          timerProgressBar: true,
          onBeforeOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
              const content = Swal.getContent()
              if (content) {
              }
            }, 100)
          },
          onClose: () => {
            clearInterval(timerInterval)
          }
        })
  }


  mensajeActualizar(){
    Swal.fire({
      title: 'Alerta',
      text: "Está seguro de realizar la actualización, este proceso actualizará los productos existentes ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.actualizarInventario()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  

  actualizarInventario(){
    var m2s1=0
    var m2s2=0
    var m2s3=0
    var contVal=0
    this.mensajeActualizando()
    this.invetarioP.forEach(element=>{
      m2s1=parseFloat(element.cantidadM2.toFixed(2))
      m2s2=parseFloat(element.cantidadM2b2.toFixed(2))
      m2s3=parseFloat(element.cantidadM2b3.toFixed(2))
      element.producto.sucursal1=m2s1
      element.producto.sucursal2=m2s2
      element.producto.sucursal3=m2s3
      if(element.producto.ultimoPrecioCompra!=undefined){ 
        element.producto.precio = element.producto.ultimoPrecioCompra  
      }
      this.productoService.updateProductosSucursales(element.producto,m2s1,m2s2,m2s3).subscribe( res => {contVal++,this.contadorValidaciones2(contVal)}, err => {alert("error")})
     // this.db.collection('/productos').doc( element.producto.PRODUCTO).update({"sucursal1" :m2s1,"sucursal2":m2s2 , "sucursal3":m2s3})
    })
    //alert(this.invetarioP.length)
  }


  contadorValidaciones2(i:number){

    if(this.invetarioP.length==i){
      Swal.close()
      Swal.fire({
        title: 'Correcto',
        text: 'Se ha realizado con exito su actualizacion',
        icon: 'success',
        confirmButtonText: 'Ok'
      }).then((result) => {
        window.location.reload()
      })
    }else{
      console.log("no he entrado "+i)
    }
  }

  opcionMenu(e){
    var x = document.getElementById("user");
    var y = document.getElementById("admin");
    
    switch (e.value) {
      case "Inventario General":
        x.style.display = "block";
        y.style.display="none";
      
       break;
  
      case "Inventario Valorizado":
      
        x.style.display = "none";
        y.style.display="block";
        
        break;
     
     
      default:    
    }     
    }


  


  transformarM2(){
    this.invetarioP.forEach(element=>{
      element.cantidadM2= parseFloat(((element.producto.M2*element.cantidadCajas)+((element.cantidadPiezas*element.producto.M2)/element.producto.P_CAJA)).toFixed(2))
      element.cantidadM2b2= parseFloat(((element.producto.M2*element.cantidadCajas2)+((element.cantidadPiezas2*element.producto.M2)/element.producto.P_CAJA)).toFixed(2))
      element.cantidadM2b3= parseFloat(((element.producto.M2*element.cantidadCajas3)+((element.cantidadPiezas3*element.producto.M2)/element.producto.P_CAJA)).toFixed(2))
      element.totalb1=parseFloat((element.cantidadM2*element.producto.precio).toFixed(2))
      element.totalb2=parseFloat((element.cantidadM2b2*element.producto.precio).toFixed(2))
      element.totalb3=parseFloat((element.cantidadM2b3*element.producto.precio).toFixed(2))
    //alert("sss "+ element.cantidadM2b3)
    })
    this.sumarProductosRestados()
     this.cambiarValores()
   
   this.controlarInventario()
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
   // this.actualizarInventario()
   }

  cambiarValores(){
    this.invetarioP.forEach(element=>{
      element.cantidadCajas=Math.trunc( element.cantidadM2 / element.producto.M2);
      element.cantidadPiezas=parseInt(((element.cantidadM2 * element.producto.P_CAJA / element.producto.M2) - (element.cantidadCajas * element.producto.P_CAJA)).toFixed(0))
      element.cantidadM2=parseFloat(element.cantidadM2.toFixed(2))

      element.cantidadCajas2=Math.trunc( element.cantidadM2b2 / element.producto.M2);
      element.cantidadPiezas2=parseInt(((element.cantidadM2b2 * element.producto.P_CAJA / element.producto.M2) - (element.cantidadCajas2 * element.producto.P_CAJA)).toFixed(0));
      element.cantidadM2b2=parseFloat(element.cantidadM2b2.toFixed(2))

      element.cantidadCajas3=Math.trunc( element.cantidadM2b3 / element.producto.M2);
      element.cantidadPiezas3=parseInt(((element.cantidadM2b3 * element.producto.P_CAJA / element.producto.M2) - (element.cantidadCajas3 * element.producto.P_CAJA)).toFixed(0));
      element.cantidadM2b3=parseFloat(element.cantidadM2b3.toFixed(2))
    })
  }




   onExporting (e) {
    e.component.beginUpdate();
    e.component.columnOption("cantidadM2", "visible", true);
    e.component.columnOption("cantidadM2b2", "visible", true);
    e.component.columnOption("producto.CLASIFICA", "visible", true);
    e.component.columnOption("producto.precio", "visible", true);
    e.component.columnOption("bodega", "visible", true);
    e.component.columnOption("ultimoPrecioCompra", "visible", true);
    e.component.columnOption("ultimaFechaCompra", "visible", true);
   
  };
 
  onExported (e) {
    e.component.columnOption("cantidadM2", "visible", false);
    e.component.columnOption("cantidadM2b2", "visible", false);
    e.component.columnOption("producto.CLASIFICA", "visible", false);
    e.component.columnOption("producto.precio", "visible", false);
    e.component.columnOption("bodega", "visible", false);
    e.component.columnOption("ultimoPrecioCompra", "visible", false);
    e.component.columnOption("ultimaFechaCompra", "visible", false);
    e.component.endUpdate();
  }

  onExporting2 (e) {
    e.component.beginUpdate();
    e.component.columnOption("producto.CLASIFICA", "visible", true);
    e.component.columnOption("producto.precio", "visible", true);
    e.component.columnOption("bodega", "visible", true);
    e.component.columnOption("ultimoPrecioCompra", "visible", true);
    e.component.columnOption("ultimaFechaCompra", "visible", true);
   
  };
  onExported2 (e) {
    e.component.columnOption("producto.CLASIFICA", "visible", false);
    e.component.columnOption("producto.precio", "visible", false);
    e.component.columnOption("bodega", "visible", false);
    e.component.columnOption("ultimoPrecioCompra", "visible", false);
    e.component.columnOption("ultimaFechaCompra", "visible", false);
    e.component.endUpdate();
  }

  mostrarUbicacion = (e) => {  
    this.mostrarPopup(e.row.data)
  }

   mostrarPopup(e:any){
     this.nameProducto = e.producto.PRODUCTO
     this.productos.forEach(element=>{
       if(element.PRODUCTO == e.producto.PRODUCTO){
         this.arregloUbicaciones1=element.ubicacionSuc1
         this.arregloUbicaciones2=element.ubicacionSuc2
         this.arregloUbicaciones3=element.ubicacionSuc3
       }
     })
    this.popupVisible=true
  }

  


}
