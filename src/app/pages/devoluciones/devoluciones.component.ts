import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertsService } from 'angular-alert-module';
import { devolucion, productosDevueltos } from './devoluciones';
import pdfMake from 'pdfmake/build/pdfmake';
import { venta, factura, producto } from '../ventas/venta';
import { element } from 'protractor';
import { ProductoDetalleVenta } from '../producto/producto';
import Swal from 'sweetalert2';
import { CloneVisitor } from '@angular/compiler/src/i18n/i18n_ast';
import { Observable } from 'rxjs';
import { transaccion } from '../transacciones/transacciones';
import { ThrowStmt } from '@angular/compiler';
import { OrdenDeCompra } from '../compras/compra';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';

@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.scss']
})
export class DevolucionesComponent implements OnInit {
  idDocumento:number
cliente:string
usuario:string="q@q.com"
observaciones:string=""
sucursal:string
fecha:Date= new Date()
fecha_transaccion:string
contap2:number=0
id_devolucion:number
facturas:factura[]=[]
productosFactura:producto[]=[]
devoluciones:devolucion[]=[]
devolucionesPendientes:devolucion[]=[]
devolucionesAprobadas:devolucion[]=[]
devolucionesRechazadas:devolucion[]=[]
devolucioLeida:devolucion
productos:producto[]=[]
facturaTraida:factura
notas_venta: factura[]=[]
menuDocumento: string[] = [
  "Factura",
  "Nota de Venta"
];

menuMotivo: string[] = [
  "Caducidad",
  "Cambio",
  "Daño",
  "Defectos fábrica",
  "Otros"
];
menu1: string[] = [
  "Devoluciones",
  "Aprobaciones",
  "Devoluciones Aprobadas"
];

sucursalesDefault: string[] = [
  "Milagro",
  "Naranjito",
  "El Triunfo"
];

variablesucursal:string="Milagro"
total:number=0
devolucion:devolucion
varProducto:string
numeroFactura:string
number_transaccion:number =0
transaccion:transaccion
productosDevueltos:productosDevueltos[]=[]
productosDevueltosBase:productosDevueltos[]=[]
productosDevueltosCarga:productosDevueltos[]=[]
ordenesCompra: OrdenDeCompra[] = []
productosVendidos:venta[]=[]
  productosVendidos2:venta[]=[]
  parametrizaciones:parametrizacionsuc[]=[]
parametrizacionSucu:parametrizacionsuc

  constructor(private db: AngularFirestore, public  afAuth:  AngularFireAuth,private alerts: AlertsService) { 
    this.devolucion = new devolucion
    this.productosDevueltos.push(new productosDevueltos)
  }

  ngOnInit() {
    this.getIDDevolciones()
    this.getFacturas()
    this.getnotasVenta()
    this.getProductosVendidos()
    this.getProductos()
    this.getDevoluciones()
    this.getProductosDevueltos()
    this.getIDTransacciones()
    this.getOrdenCompra()
    this.getParametrizaciones()
  }

  getParametrizaciones(){
    this.db.collection('/parametrizacionSucursales').valueChanges().subscribe((data:parametrizacionsuc[]) => {
      if(data != null)
        this.parametrizaciones = data

    })
  }

  async getIDDevolciones() {
    //REVISAR OPTIMIZACION
    await this.db.collection('/devoluciones_ID').doc('matriz').snapshotChanges().subscribe((contador) => {
      console.log(contador.payload.data())
      this.id_devolucion = contador.payload.data()['documento_n']+1;  
    });;
  }

  async getOrdenCompra() {
    await this.db.collection('ordenesDeCompra').snapshotChanges().subscribe((ordenes) => {
      new Promise<any>((resolve, reject) => {
        ordenes.forEach((nt: any) => {
          this.ordenesCompra.push(nt.payload.doc.data());
        })
      }) 
    });;
  }

  async getFacturas() {
    await this.db.collection('facturas').snapshotChanges().subscribe((facturas) => {
        facturas.forEach((nt: any) => {
          this.facturas.push(nt.payload.doc.data());    
        })
    });;
  }

  async getProductos() {
    //REVISAR OPTIMIZACION
    await this.db.collection('productos').snapshotChanges().subscribe((productos) => {
      this.productos = []
      productos.forEach((nt: any) => {
        this.productos.push(nt.payload.doc.data());
      })
    });;
  }

  async getDevoluciones() {
    //REVISAR OPTIMIZACION
    await this.db.collection('devoluciones').snapshotChanges().subscribe((devoluciones) => {
      new Promise<any>((resolve, reject) => {
        devoluciones.forEach((nt: any) => {
          this.devoluciones.push(nt.payload.doc.data());
        })
      }).then(res => {}, err => alert(err));  
     
    });;
  }

  async getnotasVenta() {
    await this.db.collection('notas_venta').snapshotChanges().subscribe((notas) => {
        notas.forEach((nt: any) => {
          this.notas_venta.push(nt.payload.doc.data());    
        })
    });;
  }

  async getProductosVendidos() {    
    await this.db.collection('productosVendidos').snapshotChanges().subscribe((productosVendidos) => {   
      productosVendidos.forEach((nt: any) => {
        this.productosVendidos.push(nt.payload.doc.data());
      })
    });;
  }

  async getProductosDevueltos() {    
    await this.db.collection('productosDevueltos').snapshotChanges().subscribe((productos) => {   
      productos.forEach((nt: any) => {
        this.productosDevueltosBase.push(nt.payload.doc.data());
      })
    });;
  }

  async getIDTransacciones() {
    await this.db.collection('transacciones_ID').doc('matriz').snapshotChanges().subscribe((transacciones) => {
      console.log(transacciones.payload.data())
      this.number_transaccion = transacciones.payload.data()['documento_n'];    
    });;
  }


  obtenerDocumento(e){
    var bandera=true
    this.devolucion.tipo_documento=e.value
    console.log("menu es "+e.value)
    if(e.value=="Factura"){
      this.facturas.forEach(element=>{
        if(element.documento_n == this.idDocumento){
          this.facturaTraida=element
          this.cliente=element.cliente.cliente_nombre
          this.fecha_transaccion=element.fecha2
          this.sucursal=element.sucursal
          bandera=false
          this.obtenerDetalleProductosFact()
        }
      })
      if(bandera){
        alert("no encontre")
        this.cliente=""
        this.fecha_transaccion=""
        this.sucursal=""
      }
    }else if(e.value=="Nota de Venta"){
      this.notas_venta.forEach(element=>{
        if(element.documento_n == this.idDocumento){
          this.facturaTraida=element
          this.cliente=element.cliente.cliente_nombre
          this.fecha_transaccion=element.fecha2
          this.sucursal=element.sucursal
          bandera=false
          this.obtenerDetalleProductosNot()
        }
      })
      if(bandera){
        alert("no encontre")
        this.cliente=""
        this.fecha_transaccion=""
        this.sucursal=""
      }
      }
      
  }

  obtenerDetalleProductosFact(){
    this.limpiarArreglo()
    this.productosVendidos.forEach(element=>{
      if(element.factura_id==this.idDocumento  && element.tipoDocumentoVenta=="Factura"){
       this.productosVendidos2.push(element)
       console.log("el producto "+JSON.stringify(element))
      }
    })
  }

  cargarDevoluciones(){
    this.devoluciones.forEach(element=>{
      if(element.estado == "Pendiente"){
        this.devolucionesPendientes.push(element)
      }else if(element.estado == "Aprobado"){
        this.devolucionesAprobadas.push(element)
      }else if(element.estado == "Rechazado"){
        this.devolucionesRechazadas.push(element)
      }
    })
  }

  obtenerDetalleProductosNot(){
    this.limpiarArreglo()
    this.productosVendidos.forEach(element=>{
      if(element.factura_id==this.idDocumento  && element.tipoDocumentoVenta=="Nota de Venta"){
       this.productosVendidos2.push(element)
       console.log("el producto "+JSON.stringify(element))
      }
    })
  }

 

  limpiarArreglo(){
    var cont=0
    this.productosVendidos2.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.productosVendidos2.forEach(element=>{
        this.productosVendidos2.splice(0)    
      })
    }
  }

  obtenerDetallesDoc(e,i:number){
    //alert("eee "+e.value)
    var canti=0
    this.productosVendidos2.forEach(element=>{
      if(element.producto.PRODUCTO== e.value){
        canti=0
     /*    this.productosDevueltos[i].producto=element.producto
        this.productosDevueltos[i].producto.PRODUCTO=element.producto.PRODUCTO
        this.varProducto=element.producto.PRODUCTO */
        this.productosDevueltos[i].producto=element.producto
        this.productosDevueltos[i].cantFactCajas=Math.trunc(element.cantidad / element.producto.M2);
        this.productosDevueltos[i].cantFactPiezas=Math.trunc(element.cantidad * element.producto.P_CAJA / element.producto.M2) - (this.productosDevueltos[i].cantFactCajas * element.producto.P_CAJA);
        //this.valorEnM2=Math.trunc(this.caltotal * this.calp / this.calmetros) - (this.cantidadcal * this.calp);
        //this.productosDevueltos[i].valorunitario=element.precio_venta-(element.precio_venta*(element.descuento/100))
      //this.productosDevueltos[i].valorunitario=(((element.producto.P_CAJA*this.productosDevueltos[i].cantFactCajas)+this.productosDevueltos[i].cantFactPiezas)/element.total)
      this.productosDevueltos[i].valorunitariopiezas=((element.total/((element.producto.P_CAJA*this.productosDevueltos[i].cantFactCajas)+this.productosDevueltos[i].cantFactPiezas)))-(((element.total/((element.producto.P_CAJA*this.productosDevueltos[i].cantFactCajas)+this.productosDevueltos[i].cantFactPiezas)))*(element.descuento/100))  
      this.productosDevueltos[i].valorunitario=(((element.producto.P_CAJA*this.productosDevueltos[i].cantFactCajas)+this.productosDevueltos[i].cantFactPiezas)/element.cantidad)*this.productosDevueltos[i].valorunitariopiezas
      }
    })
  }

  deleteProducto(e,i:number){
    if(this.productosDevueltos.length > 1){
    this.productosDevueltos.splice(i,1);
    }
    else{
      Swal.fire(
        'Alerta',
        'Debe tener al menos un producto',
        'warning'
      )
    }
    this.calcularTotal()
  }

  transformarM2(e,i:number){
    console.log("rr2444 "+this.productosDevueltos[i].producto)
    this.productosVendidos2.forEach(element=>{
      if(this.productosDevueltos[i].producto.PRODUCTO== element.producto.PRODUCTO){
        this.productosDevueltos[i].cantDevueltam2=parseInt(((element.producto.M2*this.productosDevueltos[i].cantDevueltaCajas)+((this.productosDevueltos[i].cantDevueltaPiezas*element.producto.M2)/element.producto.P_CAJA)).toFixed(0))
        this.productosDevueltos[i].cantDevueltam2Flo=parseFloat(((element.producto.M2*this.productosDevueltos[i].cantDevueltaCajas)+((this.productosDevueltos[i].cantDevueltaPiezas*element.producto.M2)/element.producto.P_CAJA)).toFixed(2))
      
        console.log(this.productosDevueltos[i].cantDevueltam2)
        console.log(this.productosDevueltos[i].cantDevueltam2Flo)
        var cal1=0
        var cal2=0
        cal1=this.productosDevueltos[i].cantDevueltaCajas*element.producto.P_CAJA+this.productosDevueltos[i].cantDevueltaPiezas
        cal2=this.productosDevueltos[i].cantFactCajas*element.producto.P_CAJA+this.productosDevueltos[i].cantFactPiezas
        if(cal1> cal2){
          alert("la cantidad es mayor")
          this.productosDevueltos[i].cantDevueltaCajas=0
          this.productosDevueltos[i].cantDevueltaPiezas=0
        }
      }
      
    })
    this.calcularValores2(e,i)
  }

  calcularValores(e,i:number){
    this.productosVendidos2.forEach(element=>{
      if(this.productosDevueltos[i].producto.PRODUCTO== element.producto.PRODUCTO){
        var cal1=0
        cal1=(element.precio_venta* this.productosDevueltos[i].cantDevueltam2Flo)
          this.productosDevueltos[i].total=cal1-(cal1*(element.descuento/100))
          console.log("el total es "+ cal1)
          console.log("el total es "+  this.productosDevueltos[i].total)
      }
    })
    this.calcularTotal()
  }


  calcularValores2(e,i:number){
    this.productosVendidos2.forEach(element=>{
      if(this.productosDevueltos[i].producto.PRODUCTO== element.producto.PRODUCTO){
        var cal1=0
        cal1=this.productosDevueltos[i].cantDevueltaCajas*element.producto.P_CAJA+this.productosDevueltos[i].cantDevueltaPiezas

          this.productosDevueltos[i].total=cal1*this.productosDevueltos[i].valorunitariopiezas
          console.log("el total es "+ cal1)
          console.log("el total es "+  this.productosDevueltos[i].total)
      }
    })
    this.calcularTotal()
  }

  calcularTotal(){
    this.total=0
    this.productosDevueltos.forEach(element=>{
      this.total=parseFloat((element.total+this.total).toFixed(2))
      //this.total=element.total+this.total
    })
    
  }

  guardarDevolucion(){
    this.devolucion.cliente=this.cliente
    this.devolucion.fecha=this.fecha.toLocaleDateString()
    this.devolucion.fecha_transaccion=this.fecha_transaccion
    this.devolucion.observaciones=this.observaciones
    this.devolucion.sucursal=this.sucursal
    this.devolucion.usuario=this.usuario
    this.devolucion.id_devolucion=this.id_devolucion
    this.devolucion.totalDevolucion=this.total
    this.devolucion.num_documento=this.idDocumento
    var contV=0
    var text=""
    text=this.facturaTraida.observaciones+ "/ Documento Devolucion "+this.idDocumento
    console.log("sdsdsdsd "+text)
    if(this.devolucion.cliente!=undefined && this.devolucion.fecha!=undefined && this.devolucion.fecha_transaccion!=undefined){
      this.mostrarMensaje()
      new Promise<any>((resolve, reject) => {
        this.db.collection('/devoluciones').doc(this.id_devolucion+"").set({...Object.assign({},this.devolucion )}) ;
        this.db.collection('/devoluciones_ID').doc("matriz").update({"documento_n" :this.id_devolucion});
        if(this.devolucion.tipo_documento=="Factura"){
          this.db.collection('/facturas').doc(this.idDocumento+"").update({"observaciones" :text});
        }else if(this.devolucion.tipo_documento=="Nota de Venta"){
          this.db.collection('/notas_venta').doc(this.idDocumento+"").update({"observaciones" :text});
        }
       
        this.productosDevueltos.forEach(element => {
          element.devolucion_id=this.id_devolucion
          this.db.collection("/productosDevueltos").add({ ...Object.assign({}, element)})
          .then(resolve => {contV++,this.contadorValidaciones3(contV)}, err => reject(err));
            
          })
        //this.actualizarProductos()
        
      })
    }else{
      alert("hay campos vacios")
    }  
  }


  asignarsucursalD(e){
    this.variablesucursal= e.value
    console.log("Pertenece a "+ this.variablesucursal)
  }

  getCourseFile = (e) => {  
    this.cargarDatosDevolucion(e.row.data)  
  }

  getCourseFile2 = (e) => {  
    this.aceptarDevolucion(e.row.data)  
  }
  getCourseFile3 = (e) => {  
    this.rechazarDevolucion(e.row.data)  
  }

  rechazarDevolucion(e:any){
    Swal.fire({
      title: 'Rechazar Devolución',
      text: "Desea rechazar la devolución #"+e.id_devolucion,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        new Promise<any>((resolve, reject) => {
        this.db.collection('/devoluciones').doc(e.id_devolucion+"").update({"estado":"Rechazado"}).then(res => {  Swal.fire({
          title: 'Correcto',
          text: 'Se guardó con éxito',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
        })}, err => alert(err));  
       
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

  /*
Swal.fire({
          title: 'Correcto',
          text: 'Se aprobó con éxito',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
        })
  */

  aceptarDevolucion(e:any){
    Swal.fire({
      title: 'Aceptar Devolución',
      text: "Desea aceptar la devolución #"+e.id_devolucion,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        new Promise<any>((resolve, reject) => {
          this.mostrarMensaje()
        this.db.collection('/devoluciones').doc(e.id_devolucion+"").update({"estado":"Aprobado"}).then(res => {  }, err => alert(err));  
       this.realizarTransacciones(e)
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


  realizarTransacciones(e:any){
    var contVal=0
    this.devoluciones.forEach(element=>{
      if(element.id_devolucion == e.id_devolucion){
        this.devolucioLeida=element
      }
    })

     this.productosDevueltosBase.forEach(element=>{
       if(e.id_devolucion == element.devolucion_id){
           this.productosDevueltosCarga.push(element)
       }
     })
     new Promise<any>((resolve, reject) => {
     this.productosDevueltosCarga.forEach(element=>{
        this.transaccion = new transaccion()
        this.transaccion.fecha_mov=this.devolucioLeida.fecha
        this.transaccion.fecha_transaccion=new Date().toLocaleString()
        this.transaccion.sucursal=this.devolucioLeida.sucursal
        this.transaccion.bodega="bodega2"
        this.transaccion.documento=this.devolucioLeida.id_devolucion+""
        this.transaccion.producto=element.producto.PRODUCTO
        this.transaccion.cajas=element.cantDevueltaCajas
        this.transaccion.piezas=element.cantDevueltaPiezas
        this.transaccion.observaciones=element.justificacion
        this.transaccion.tipo_transaccion="devolucion"
        this.transaccion.movimiento=1
        this.transaccion.valor=element.valorunitario
        this.transaccion.cantM2=element.cantDevueltam2
        this.transaccion.totalsuma=element.total
        this.transaccion.usu_autorizado="q@q.com"
        this.transaccion.usuario="q@q.com"
        this.transaccion.factPro=this.devolucioLeida.num_documento+""
        this.transaccion.idTransaccion=this.number_transaccion++
        this.db.collection("/transacciones")
        .add({ ...this.transaccion })
        .then(res => {contVal++,this.contadorValidaciones(contVal) }, err => reject(err));
        this.db.collection("/transacciones_ID").doc("matriz").set({ documento_n:this.number_transaccion })
          .then(res => { }, err => reject(err));
         
    })
  })
  }

  contadorValidaciones(i:number){
    if(this.productosDevueltosCarga.length==i){
      console.log("guarde")
      this.actualizarProductos()
    }else{
      console.log("no he entrado "+i)
    }
  }

  contadorValidaciones2(i:number){
    if(this.productosDevueltosCarga.length==i){
        console.log("recien termine")
        Swal.close()
        Swal.fire({
          title: 'Devolucion Aprobada',
          text: 'Se ha guardado con éxito',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
        })
    }else{
      console.log("no he entrado actualizar"+i)
    }
  }

  contadorValidaciones3(i:number){
    if(this.productosDevueltos.length==i){
        console.log("recien termine")
        Swal.close()
        Swal.fire({
          title: 'Devolucion Registrada',
          text: 'Se ha guardado con éxito',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
        })
    }else{
      console.log("no he entrado actualizar"+i)
    }
  }

  cargarDatosDevolucion(e: any){
    // alert("voy a buscar la remision "+e.id_remision)
    var cont=0
    this.productosDevueltosCarga.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.productosDevueltosCarga.forEach(element=>{
        this.productosDevueltosCarga.splice(0)   
      })
    }

     this.productosDevueltosBase.forEach(element=>{
       if(e.id_devolucion == element.devolucion_id){
           //console.log(element.nombreComercial)
           this.productosDevueltosCarga.push(element)
       }
     })
     this.devoluciones.forEach(element=>{
         if(element.id_devolucion == e.id_devolucion){
           this.devolucioLeida=element
         }
     })

    this.productosDevueltosCarga.forEach(element=>{
      console.log("datos "+JSON.stringify(element))
    })
    this.parametrizaciones.forEach(element=>{
      if(element.sucursal == this.variablesucursal){
        this.parametrizacionSucu= element
      }
    })

     this.crearPDF()
 }

 opcionMenu(e){
  this.contap2++
  if(this.contap2<=1){
    this.cargarDevoluciones()
  }
  var x = document.getElementById("devolucion");
  var y = document.getElementById("admin");
  var z = document.getElementById("aprobaciones");
  switch (e.value) {
    case "Devoluciones":
      x.style.display = "block";
      y.style.display="none";
      z.style.display="none";
     break;

    case "Aprobaciones":
      
      x.style.display = "none";
      y.style.display="block";
      z.style.display="none";
      break;
   
    case "Devoluciones Aprobadas":
      //this.cargarDevoluciones()
      x.style.display = "none";
      y.style.display="none";
      z.style.display="block";
      break;
    default:    
  }     
  }


  crearPDF(){
    console.log("entre  a creaar PDF")
    const documentDefinition = this.getDocumentDefinition();
    pdfMake.createPdf(documentDefinition).download('Devolucion '+this.devolucioLeida.id_devolucion, function() {  });

  }


  setearNFactura(){
    let nf=this.devolucioLeida.id_devolucion
    let num=('' + nf).length
    console.log("el numero es"+num)
    switch (num) {
      case 1:
          this.numeroFactura="00000"+nf
          break;
      case 2:
          this.numeroFactura="0000"+nf
          break;
      case 3:
          this.numeroFactura="000"+nf
          break; 
      case 4:
          this.numeroFactura="00"+nf
          break; 
      case 5:
          this.numeroFactura="0"+nf
          break;
      case 6:
          //this.numeroFactura= nf
          break;    
      default:
    }
  } 


  getDocumentDefinition() {
    this.setearNFactura()
    sessionStorage.setItem('Devolucion', JSON.stringify("jj"));
    //let tipoDocumento="Factura";
    return {
      pageSize: 'A4',
      pageOrientation: 'portrait', 
      content: [
        {
          columns: [{
          text:"hola",
          width: 100,
          margin: [0, 20, 0, 10],
          },
          {
            width:410,
            margin: [0, 20, 0, 10],
            text:" ",
            alignment:"right"
          },
          ]
          
          //alignment: 'center'
        }, 
       
        {
          columns: [
            
            [
              {
              
              text: this.parametrizacionSucu.razon_social,
            },
            {
              text: "RUC: "+this.parametrizacionSucu.ruc,
            },
            
            {
              text: "Venta de materiales para acabados de construcción, porcelanatos, cerámicas ", fontSize:9
            },
            {
              text: "Dirección: "+this.parametrizacionSucu.direccion,
            },
            {
              text: "Teléfonos: "+this.parametrizacionSucu.telefonos,
            },
            {
              text: "Auto SRI "+this.parametrizacionSucu.sri,
            },{
              columns: [{
              width:260,
              text: "DEVOLUCIÓN  001 - 000",
              bold: true,
              fontSize: 20,
            },
            {
              width:260,
              text: "NO "+this.numeroFactura,
              color: 'red',
              bold: true,
              fontSize: 20,
              alignment:"right"
            },
            ]
            },
            {
            //Desde aqui comienza los datos del cliente
            style: 'tableExample',
            table: {
              widths: [100,140,100,140],
              body: [
                [
                  {
                    stack: [
                      {
                        type: 'none',
                        bold: true,
                        fontSize:9,
                        ul: [
                          'Numero Doc.',
                          'Tipo',
                          'Cliente',
                          'Sucursal',

                          
                           
                        ]
                      }
                    ]
                  },
                  {
                    stack: [
                      {
                        type: 'none',
                        fontSize:9,
                        ul: [
                          ''+this.devolucioLeida.num_documento,
                          ''+this.devolucioLeida.tipo_documento,
                          ''+this.devolucioLeida.cliente,
                          ''+this.devolucioLeida.sucursal,
                       
                        ]
                      }
                    ]
                  },
                  {
                    stack: [
                      {
                        type: 'none',
                        bold: true,
                        fontSize:9,
                        ul: [

                          'Fecha',
                          'Fecha/transaccion',
                          'Usuario',
                          
                           
                        ]
                      }
                    ]
                  },
                  [{
                    stack: [
                      {
                        type: 'none',
                        fontSize:9,
                        ul: [
                          ''+this.devolucioLeida.fecha,
                          ''+this.devolucioLeida.fecha_transaccion,
                          ''+this.devolucioLeida.usuario,
                        ]
                      }
                    ]
                  },
                  ],
                 
                ]
              ]
            }
            },
           
            ],
            [
              
            ]
          ]
        },
       
        this.getProductosIngresados2(this.productosDevueltosCarga),
        {text:" "}, {text:" "},
        {
          text:"Observaciones:   "+this.devolucioLeida.observaciones,fontSize:9
        },

        {text:" "},
        {
          
          columns: [{
          width:450,
          text: "Total:",
          bold: true,
          fontSize: 15,
          alignment:"right",
        },
        {
          width:60,
          text: +this.devolucioLeida.totalDevolucion,
          bold: true,
          fontSize: 15,
          alignment:"right"
        },
        ]
        },
        {text:" "}, {text:" "},{text:" "},
          {
          columns: [{
           text:"Firma conformidad entrega",
          width: 250,
          fontSize:10,
          alignment:"right",
          margin: [55, 20, 40, 10],
          },
          {
            width:250,
            margin: [40, 20, 20, 10],
            fontSize:10,
            text:"Firma conformidad recibo ",
            alignment:"left"
          },
          ]
          
          //alignment: 'center'
        }, 
      ],
      footer: function (currentPage, pageCount) {
        return {
          table: {
            body: [
              
              [{text: '  ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL ', alignment: 'center', style:"textFot"}],
            ]
          },
          layout: 'noBorders'
        };
      }, pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
        return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
     },
      
      images: {
        mySuperImage: 'data:image/jpeg;base64,...content...'
      },
      info: {
        title: "Factura" + '_RESUME',
        author: "this.resume.name",
        subject: 'RESUME',
        keywords: 'RESUME, ONLINE RESUME',
      },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 20, 0, 10],
            decoration: 'underline'
          },
          textoPro:{
            bold: true,
            margin: [0, -12, 0, -5]
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          },
          tableExample2: {
            margin: [-13, 5, 10, 15]
          },
          tableExample3: {
            margin: [-13, -10, 10, 15]
          },
          tableExample4: {
            margin: [10, -5, 0, 15]
          },
          texto6: {
            fontSize: 14,
            bold: true,
            alignment: "center"
          },
          name: {
            fontSize: 16,
            bold: true
          },
          jobTitle: {
            fontSize: 14,
            bold: true,
            italics: true
          },
          textFot: {   
            alignment: 'center',
            italics: true,
            color: "#bebebe",
            fontSize:18,
          },
          tableHeader: {
            bold: true,
          },
          tableHeader2: {
            bold: true,
            fontSize:10,
          },
          
          fondoFooter: {
            fontSize: 8,
            alignment: "center"
          },
          totales: {
            margin: [0, 0, 15, 0],
            alignment: "right",
          },
          totales2: {
            margin: [0, 0, 5, 0],
            alignment: "right",
          },
          detalleTotales: {
            margin: [15, 0, 0, 0]
          }
        }
    };
  }
  
  getProductosIngresados2(productos: productosDevueltos[]) {
    return {
     /*  [{text: 'Header with Colspan = 2', style: 'tableHeader', colSpan: 2, alignment: 'center'}, {}, {text: 'Header 3', style: 'tableHeader', alignment: 'center'}], */
      table: {
        widths: ["40%","9%","9%","7%","15%","20%"],
        alignment:'center',
        fontSize:9,
        headerRows: 2,
        body: [
          
          [{
            text: 'Producto',
            style: 'tableHeader2',
            rowSpan:2,
            fontSize:8,
            alignment: 'center'
          },
          {
            text: 'Cantidad Devuelta',
            style: 'tableHeader2', 
            colSpan:2,
            fontSize:8,
            alignment: 'center'
          },
          {
            
          },
          {
            text: 'Total',
            style: 'tableHeader2', 
            rowSpan:2,
            fontSize:8,
            alignment: 'center'
          },
          {
            text: 'Motivo',
            style: 'tableHeader2', 
            rowSpan:2,
            fontSize:8,
            alignment: 'center'
          },
          {
            text: 'Justificación',
            rowSpan:2,
            style: 'tableHeader2',
            fontSize:8,
            alignment: 'center'
          },
          ],
          [
            {},
          {
            text: 'Cajas',
            style: 'tableHeader2', 
            fontSize:8,
            alignment: 'center'
          },
          {
            text: 'Piezas',
            style: 'tableHeader2',
            fontSize:8, 
            alignment: 'center'
          },
          {
            
          },
          {
            
          },
          {
          
          },
          ],
          
          ...productos.map(ed =>{
            return [ {text:ed.producto.PRODUCTO, fontSize:9}, { text: ed.cantDevueltaCajas, alignment: 'center', fontSize:9 }, { text: ed.cantDevueltaPiezas, alignment: 'center', fontSize:9 },
           {text:ed.total.toFixed(2), alignment:"center", fontSize:9},{text:ed.motivo, alignment:"center", fontSize:9},
            {text:ed.justificacion, alignment:"center", fontSize:9}];
            
          }),
         
          
        ]
      }
   
    };
  }


  actualizarProductos(){  
    console.log("entre a actualizar")
     var sumaProductos =0
     var num1:number=0
     var num2:number=0
     var num3:number=0
     var cont2ing=0
      var contIng:number=0
      var entre:boolean=true     
      new Promise<any>((resolve, reject) => {
        this.productosDevueltosCarga.forEach(element=>{
          this.productos.forEach(elemento1=>{
            if(elemento1.PRODUCTO == element.producto.PRODUCTO){
              switch (this.devolucioLeida.sucursal) {
                case "Milagro":
                  num1=parseInt(element.cantDevueltam2.toFixed(0))
                  num2=elemento1.sucursal1
                  sumaProductos = Number(num2)+Number(num1)
                  break;
                case "Naranjito":
                  num1=parseInt(element.cantDevueltam2.toFixed(0))
                  num2=elemento1.sucursal2
                  sumaProductos =Number(num2)+Number(num1)
                  break;
                case "El Triunfo":
                  num1=parseInt(element.cantDevueltam2.toFixed(0))
                  num2=elemento1.sucursal3
                  sumaProductos =Number(num2)+Number(num1)
                    break;
                default:
              }
            }
         })
         if(entre){       
          switch (this.devolucioLeida.sucursal) {
            case "Milagro":
              this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal1" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err)); 
              break;
            case "Naranjito":
              this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal2" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));
              break;
            case "El Triunfo":
              this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal3" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));
               console.log("aaaaccctttuuuallice")
              break;
            default: 
          
          //his.db.collection('/productos').doc(element.producto.PRODUCTO).update({"cantidad" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));   
         }
         }
        })
      })
       
    }

  anadirProducto(e){
    this.productosDevueltos.push(new productosDevueltos)
  }
}
