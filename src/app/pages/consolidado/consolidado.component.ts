import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertsService } from 'angular-alert-module';
import { producto, productosPendientesEntrega } from '../ventas/venta';
import { transaccion } from '../transacciones/transacciones';
import { element } from 'protractor';
import { inventario, invFaltanteSucursal } from './consolidado';

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



  productos:producto[]=[]
  transacciones:transaccion[]=[]
  invetarioP:inventario[]=[]
  invetarioFaltante1: invFaltanteSucursal
  invetarioFaltante:invFaltanteSucursal[]=[]
  invetarioProd:inventario
  productosPendientes:productosPendientesEntrega[]=[]
  productosPendientesNoEN:productosPendientesEntrega[]=[]
  

  constructor(private db: AngularFirestore, public  afAuth:  AngularFireAuth,private alerts: AlertsService) { 
  
  }

  ngOnInit() {
    this.getProductos()
    this.getTransacciones()
   // this.getProductosPendientes()
  }

  async getProductos() {
    //REVISAR OPTIMIZACION
    await this.db.collection('productos').snapshotChanges().subscribe((productos) => {
      productos.forEach((nt: any) => {
        this.productos.push(nt.payload.doc.data());
      })
    });;
  }

  async getTransacciones(){
    await this.db.collection('transacciones').snapshotChanges().subscribe((ordenes) => {
      new Promise<any>((resolve, reject) => {
        ordenes.forEach((nt: any) => {
          this.transacciones.push(nt.payload.doc.data());
         
        })
      })
      console.log("kjkj"+this.transacciones.length)
      this.cargarDatos()
    });;
  }

  async getProductosPendientes() {
    await this.db.collection('productosPendientesEntrega').snapshotChanges().subscribe((productos) => {
      new Promise<any>((resolve, reject) => {
        productos.forEach((nt: any) => {
          this.productosPendientes.push(nt.payload.doc.data());
        })
      }) 
      this.separarEntregas()
    });;
  }


  separarEntregas(){
    this.productosPendientes.forEach(element=>{
      if(element.estado == "PENDIENTE"){
          this.productosPendientesNoEN.push(element)
      }else{
      }
    })
  }


  comenzarConsolidado(){
    this.getProductos()
    this.getTransacciones()
  }


  cargarDatos(){
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
        if(element2.PRODUCTO==element.producto && element.sucursal=="Milagro"){
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
        
        }else if(element2.PRODUCTO==element.producto && element.sucursal=="Naranjito"){
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
        }else if(element2.PRODUCTO==element.producto && element.sucursal=="El Triunfo"){
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

  actualizarInventario(){
    var m2s1=0
    var m2s2=0
    var m2s3=0
    this.invetarioP.forEach(element=>{
      m2s1=parseInt(element.cantidadM2.toFixed(0))
      m2s2=parseInt(element.cantidadM2b2.toFixed(0))
      m2s3=parseInt(element.cantidadM2b3.toFixed(0))
      this.db.collection('/productos').doc( element.producto.PRODUCTO).update({"sucursal1" :m2s1,"sucursal2":m2s2 , "sucursal3":m2s3})
    })
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
        this.invetarioFaltante1.sucursal= "Milagro"
        this.invetarioFaltante.push(this.invetarioFaltante1)
      }
       if(element.cantidadM2b2 <0){
        this.invetarioFaltante1 = new invFaltanteSucursal
        this.invetarioFaltante1.producto=element.producto
        this.invetarioFaltante1.cantidadCajas= element.cantidadCajas2
        this.invetarioFaltante1.cantidadPiezas= element.cantidadPiezas2
        this.invetarioFaltante1.cantidadM2= element.cantidadCajas2
        this.invetarioFaltante1.totalb1= element.totalb2
        this.invetarioFaltante1.sucursal= "Naranjito"
        this.invetarioFaltante.push(this.invetarioFaltante1)
      }
       if(element.cantidadM2b3 <0){
        this.invetarioFaltante1 = new invFaltanteSucursal
        this.invetarioFaltante1.producto=element.producto
        this.invetarioFaltante1.cantidadCajas= element.cantidadCajas3
        this.invetarioFaltante1.cantidadPiezas= element.cantidadPiezas3
        this.invetarioFaltante1.cantidadM2= element.cantidadCajas3
        this.invetarioFaltante1.totalb1= element.totalb3
        this.invetarioFaltante1.sucursal= "El Triunfo"
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
      element.cantidadM2=parseInt(element.cantidadM2.toFixed(0))

      element.cantidadCajas2=Math.trunc( element.cantidadM2b2 / element.producto.M2);
      element.cantidadPiezas2=parseInt(((element.cantidadM2b2 * element.producto.P_CAJA / element.producto.M2) - (element.cantidadCajas2 * element.producto.P_CAJA)).toFixed(0));
      element.cantidadM2b2=parseInt(element.cantidadM2b2.toFixed(0))

      element.cantidadCajas3=Math.trunc( element.cantidadM2b3 / element.producto.M2);
      element.cantidadPiezas3=parseInt(((element.cantidadM2b3 * element.producto.P_CAJA / element.producto.M2) - (element.cantidadCajas3 * element.producto.P_CAJA)).toFixed(0));
      element.cantidadM2b3=parseInt(element.cantidadM2b3.toFixed(0))
    })
  }




   onExporting (e) {
    e.component.beginUpdate();
    e.component.columnOption("cantidadM2", "visible", true);
    e.component.columnOption("cantidadM2b2", "visible", true);
    e.component.columnOption("producto.CLASIFICA", "visible", true);
    e.component.columnOption("producto.precio", "visible", true);
   
  };
 
  onExported (e) {
    e.component.columnOption("cantidadM2", "visible", false);
    e.component.columnOption("cantidadM2b2", "visible", false);
    e.component.columnOption("producto.CLASIFICA", "visible", false);
    e.component.columnOption("producto.precio", "visible", false);
    e.component.endUpdate();
  }

  onExporting2 (e) {
    e.component.beginUpdate();
    e.component.columnOption("producto.CLASIFICA", "visible", true);
    e.component.columnOption("producto.precio", "visible", true);
   
  };
  onExported2 (e) {
    e.component.columnOption("producto.CLASIFICA", "visible", false);
    e.component.columnOption("producto.precio", "visible", false);
    e.component.endUpdate();
  }

  


}
