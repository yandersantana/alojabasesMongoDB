
import { Component, OnInit, Pipe, PipeTransform ,ViewChild} from '@angular/core';
import { DxFormModule, DxDataGridComponent } from 'devextreme-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, from } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import {  OrdenDeCompra } from '../compras/compra';
import { DxDataGridModule } from "devextreme-angular";
import pdfMake from 'pdfmake/build/pdfmake';

import { AlertsService } from 'angular-alert-module';
import {  ProductoDetalleVenta ,ProductoDetalleCompra } from '../producto/producto';
import { FacturaProveedor, PagoProveedor,DetallePagoProveedor }  from '../orden-compra/ordencompra';
import { Proveedor }  from '../compras/compra';
import {formatDate} from '@angular/common';
//import {Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
import { DxPopupModule, DxButtonModule, DxTemplateModule } from 'devextreme-angular';
import Swal from 'sweetalert2';
import { DxSelectBoxModule, DxListModule ,DxListComponent} from 'devextreme-angular';
import { DatePipe } from '@angular/common';
import { element } from 'protractor';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { OrdenesCompraService } from 'src/app/servicios/ordenes-compra.service';
import { ProveedoresService } from 'src/app/servicios/proveedores.service';
import { FacturasProveedorService } from 'src/app/servicios/facturas-proveedor.service';
import { DetallePagoService } from 'src/app/servicios/detalle-pago.service';
import { contadoresDocumentos, orden_compra, producto } from '../ventas/venta';
import { PagoProveedorService } from 'src/app/servicios/pago-proveedor.service';
import { ProductoService } from 'src/app/servicios/producto.service';


//import { ConsoleReporter } from 'jasmine';


@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {
  ordenesCompra: OrdenDeCompra[] = []
  ordenes:OrdenDeCompra[] = []
  ordenes2:OrdenDeCompra[] = []
  ordenes3:OrdenDeCompra[] = []
  ordenDeCompra2 : OrdenDeCompra;
  ordenDeCompra3 : OrdenDeCompra;
  facturaProveedor: FacturaProveedor;
  pago_proveedor: PagoProveedor;
  facturaProveedor2: FacturaProveedor[] = []
  facturaProveedorBus: FacturaProveedor[] = []
  facturaProveedorBus2: FacturaProveedor[] = []
  factProvPagos: FacturaProveedor[] = []
  popupVisible = false;
  popupVisible2 = false;
  productosComprados: ProductoDetalleCompra[] = []
  detallePago: DetallePagoProveedor[] = []
  detallePago2: DetallePagoProveedor[] = []
  productosComprados2: ProductoDetalleCompra[] = []
  productosComprados3: ProductoDetalleCompra[] = []
  productosComprados4: ProductoDetalleCompra[] = []
  ordenesCompraPendientes: OrdenDeCompra[] = []
  ordenesCompraRechazadas: OrdenDeCompra[] = []
  ordenesCompraAprobadas: OrdenDeCompra[] = []
  now2: Date = new Date();
  now3: Date = new Date();
  tipoDocumentos: string[] = [
    "Factura",
    "Cotización",
    "Nota de Venta"
];
numeroFactura:string
subtotal:number=0
  subtotal1:number=0
  subtDesc:number=0
  subtMenosDesc:number=0
  subtotalFactura1:number=0
  subtotalFactura2:number=0
  subtotalIva:number=0
  subtotalGeneral2:number=0
  subtCostosGenerales:number=0
  subtOtrsoDesc:number=0
  totalsuma:number=0
  totalOrden:number=0
  estadoOrden:string=""
  totalsuma2:number=0
  contConf:number=0
//Datos del pago a proveedor
n_cheque:string
fecha_transaccion:Date= new Date()
fecha_factura: Date= new Date()
nombre_banco: string
n_cuenta:number
fecha_pago: Date= new Date()
valor:number=0
beneficiario: string



employees: ProductoDetalleCompra;
proveedores:Proveedor[] = []
dato:number

mensaje2:string
datoNFact:string
datoFecha:string
datoTotal:number
datoNsolicitud:number
nordenCompra:number=0
facturaNp:number=0
facturaNp2:number=0
//now = Date.now();
textoDes:string
pipe = new DatePipe('en-US');
mySimpleFormat 
textoArea:string
newButtonEnabled2:boolean = true
NordenFact:number=0
menu1: string[] = [
  "Factura Proveedor",
  "Facturas Ingresadas",
  "Control / Facturas",
  "Pagos Proveedor"
];
numOrden:number=0
selectionChangedBySelectbox: boolean;
prefix: string;
num_documento:number=0
//tasks: DataSource;
//factura datos
proveedor:string=""
sucursal:string=""
usuario:string=""
total:number=0
ordencompraleida:OrdenDeCompra
productosCompradosLeidos:ProductoDetalleCompra[]=[]
contadores:contadoresDocumentos[]=[]
selectedRows: string[];
selectAllModeVlaue: string = "page";
selectionModeValue: string = "all";
productosActivos:producto[]=[]
banderaProductos:boolean=false
@ViewChild('list', { static: false }) comprasForm: DxListComponent;
@ViewChild('datag2') dataGrid2: DxDataGridComponent;
@ViewChild('grid') dataGrid3: DxDataGridComponent;
//@ViewChild('comprasForm', { static: false }) comprasForm: DxFormComponent;
  constructor( public contadoresService:ContadoresDocumentosService,public productoService:ProductoService,public pagoFacturaService:PagoProveedorService, public detallePagoService:DetallePagoService, public facturasProveedorService: FacturasProveedorService, public ordenesService:OrdenesCompraService, public proveedoresService:ProveedoresService, public ordenesCompraService:OrdenesCompraService) {

    this.facturaProveedor = new FacturaProveedor()
    this.pago_proveedor= new PagoProveedor()
   }

  ngOnInit() {
   /*  this.getfacturasProveedor()
    this.getFacturasProveedor()
    this.getPagosProveedor() */
    //this.traerPagosFacturasProveedor()
    this.traerProveedores()
    this.traerFacturasProveedor()
    this.traerContadoresDocumentos()
    this.traerOrdenesCompra()
    this.traerProductos()
    this.traerPagosFacturasProveedor()
  }

  

  traerProveedores(){
    this.proveedoresService.getProveedor().subscribe(res => {
      this.proveedores = res as Proveedor[];
   })
  }

  traerProductos(){
    this.productoService.getProducto().subscribe(res => {
      this.productosActivos = res as producto[];
      
   })
  }

  async traerContadoresDocumentos(){
    await this.contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
      this.facturaNp=this.contadores[0].contFacturaProveedor_Ndocumento+1
      this.facturaNp2=this.contadores[0].pagoProveedor_Ndocumento+1
      //this.asignarIDdocumentos()
   })
  }

  traerOrdenesCompra(){
    this.ordenesService.getOrden().subscribe(res => {
      this.ordenesCompra = res as OrdenDeCompra[];
      this.obtenerOrdenes()
   })
  }

  traerPagosFacturasProveedor(){
    this.detallePagoService.getDetallePagos().subscribe(res => {
      this.detallePago2 = res as DetallePagoProveedor[];

   })
  }

  traerFacturasProveedor(){
    this.facturasProveedorService.getFacturasProveedor().subscribe(res => {
      this.facturaProveedor2 = res as FacturaProveedor[];
   })
  }


  /* getProveedores(){
    this.db.collection('/proveedores').valueChanges().subscribe((data:Proveedor[]) => {
      if(data != null)
        this.proveedores = data

    })
  } */

 /*  getDetalleFacturas(){
    this.db.collection('/pagosFacturasProveedor').valueChanges().subscribe((data:DetallePagoProveedor[]) => {
      if(data != null)
        this.detallePago2 = data

    })
  } */


/*   async getfacturasProveedor() {
    //REVISAR OPTIMIZACION
    await this.db.collection('/contadorFactProveedor').doc('matriz').snapshotChanges().subscribe((contador) => {
      console.log(contador.payload.data())
      this.facturaNp = contador.payload.data()['n_documento']+1;  
      console.log("conttttt"+ this.facturaNp)  
    });;
  } */

 /*  async getPagosProveedor() {
    //REVISAR OPTIMIZACION
    await this.db.collection('/pagoProveedor').doc('matriz').snapshotChanges().subscribe((contador) => {
      console.log(contador.payload.data())
      this.facturaNp2 = contador.payload.data()['n_documento']+1;  
      console.log("conttttt"+ this.facturaNp)  
    });;
  }
 */
  /* async getOrdenCompra() {
    
    await this.db.collection('ordenesDeCompra').snapshotChanges().subscribe((ordenes) => {
    
        ordenes.forEach((nt: any) => {
          this.ordenesCompra.push(nt.payload.doc.data());    
        })
     
      console.log("kjkj"+ordenes.length)
      this.obtenerOrdenes()
      //this.tasks=this.ordenesCompra
      
    });;
   
  } */

  /* async getProductosComprados() {
    
    await this.db.collection('productosComprados').snapshotChanges().subscribe((productoC) => {
      
      productoC.forEach((nt: any) => {
        this.productosComprados.push(nt.payload.doc.data());
       
      })
      console.log("kjkj"+productoC.length)
    });;

  } */


 /*  async getFacturasProveedor() {
    
    await this.db.collection('facturasProveedor').snapshotChanges().subscribe((productoC) => {
      
      productoC.forEach((nt: any) => {
        this.facturaProveedor2.push(nt.payload.doc.data());
       
      })
     
    });;

  } */

  limpiarArreglo(){
    var cont=0
    this.productosComprados3.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.productosComprados3.forEach(element=>{
        this.productosComprados3.splice(0)    
      })
    }
  }


  
  limpiarArreglo6(){
    var cont=0
    this.facturaProveedorBus2.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.facturaProveedorBus2.forEach(element=>{
        this.facturaProveedorBus2.splice(0)    
      })
    }
  }

  llenarFacturasPendientes(){
    this.limpiarArreglo6()
    this.facturaProveedor2.forEach(element=>{
      if(element.estado2=="rechazada"){
          this.facturaProveedorBus2.push(element)
      }
    })
  }

  onInitialized(e){  
    e.component.selectAll();  
  }
  

  validarSolicitud(){
    this.limpiarArreglo()
  let numero =this.datoNsolicitud
    let solicitud=0
    this.facturaProveedor2.forEach(element=>{
      if(this.datoNsolicitud==element.nSolicitud){
          this.banderaProductos=true
      }
    })
    this.ordenesCompra.forEach(element=>{
      if(element.n_orden == numero){
        this.ordencompraleida=element
        this.productosCompradosLeidos= element.productosComprados
        //alert(this.productosCompradosLeidos.length)
        //alert("enre "+element.documento)
        this.facturaProveedor.documento_solicitud= element.documento
          solicitud=element.documento
          if(element.tipo=="Entregado"){
            this.datoTotal = element.total
            this.datoNFact= element.factPro
            this.facturaProveedor.estado3="Ingresada"
            //alert("coloco "+element.documento)
            
            setTimeout(() => {
              this.dataGrid3.instance.selectAll()
            }, 2000);
            
          }
      }
    })

  /*   this.productosComprados.forEach(element=>{
        if(element.solicitud_n == solicitud){
          this.productosComprados3.push(element)
        }
    }) */



    var flag:boolean=true
    this.ordenesCompraAprobadas.forEach(element=>{
      if(this.datoNsolicitud == element.n_orden){
        //alert("si encontre")
        this.newButtonEnabled2=false
        this.productosComprados3=element.productosComprados
        console.log("es correcto")
        flag=false
      }
    })
   //this.mostrarError()
  }

  mostrarError(){
    if(this.productosComprados3.length==0){
      Swal.fire(
        'Error!',
        'Orden no encontrada',
        'error'
      )
      this.newButtonEnabled2=true

    }
    
  }
  
  asignarValor(){
    this.totalsuma2=0
    console.log("Entre a asignar Valores de suma "+this.totalsuma2)
  }


  llenarTabla(){
    
    var cont2=0
    this.facturaProveedorBus.forEach(element=>{
      cont2++
    })
    console.log("mostrando antes"+this.productosComprados2.length)
    if(cont2>=0){
      this.facturaProveedorBus.forEach(element=>{
        this.facturaProveedorBus.splice(0)
        
      })
      
      console.log("mostrando"+this.facturaProveedorBus.length)
    }
    this.asignarValor()
    
    this.facturaProveedor2.forEach(element=>{
      if(this.NordenFact==element.nSolicitud){
          this.facturaProveedorBus.push(element)
          this.num_documento=element.documento_solicitud
      }
    })
    
    this.facturaProveedorBus.forEach(element=>{
        this.totalsuma2=element.total+this.totalsuma2
    })

    this.ordenesCompraAprobadas.forEach(element=>{
      if(this.NordenFact == element.n_orden){
            this.totalOrden=element.total-element.costeUnitaTransport-element.otrosCostosGen
      }
    })


    this.totalsuma=this.totalOrden-this.totalsuma2
    var s = document.getElementById("divestado");
    if(this.totalsuma>0){
      this.estadoOrden= "Incompleto"
     
      s.style.color= "red"
      s.style.fontSize= "2em"
     // document.getElementById('error-message').innerHTML = "<div class='error'>Comppleto</div>";
    }else{
      this.estadoOrden= "Completo"
      s.style.color= "green"
      s.style.fontSize= "2em"
      //document.getElementById('error-message').innerHTML = "<div class'titleOrdenCompra'><p>Saldo Pendiente</p></div>";
    }


    let numero =this.NordenFact
    let solicitud=0
    
    this.ordenesCompra.forEach(element=>{
      if(element.n_orden == numero){
          solicitud=element.documento 
          this.proveedor= element.proveedor.nombre_proveedor
          this.sucursal= element.sucursal.nombre
          this.usuario=element.usuario
          this.total=element.total   
          this.productosComprados3=element.productosComprados    
      }
    })

   /*  this.productosComprados.forEach(element=>{
      if(element.solicitud_n == solicitud){
        this.productosComprados3.push(element)
      }
    }) */

  }

 
         
        
         
        


  obtenerOrdenes(){
    console.log("entre a buscar")
    this.ordenesCompra.forEach(element=>{
      if(element.estado=="Pendiente"){
        this.ordenesCompraPendientes.push(element)
      }else if(element.estado=="Rechazado"){
        this.ordenesCompraRechazadas.push(element)
      }
      console.log("orden "+element.documento)
    })
    this.obtenerOrdenesAprobadas()
  }

  obtenerOrdenesAprobadas(){
    console.log("entre a buscar 4444423232")
    this.ordenesCompra.forEach(element=>{
      if(element.estado=="Aprobado" && element.n_orden>=0){
        this.ordenesCompraAprobadas.push(element)
       // alert("entre aqui")
      }
      console.log("orden "+element.n_orden)
    })
   
    
  //this.comprasForm.dataSource= this.tasks


  }


  ordenesEnProceso(){
    this.ordenesCompra.forEach(element=>{
      if(element.documento==this.dato){
        this.ordenesCompraPendientes.push(element)
      }
     
    })

    /* this.ordenesCompra.forEach(element=>{
      if(element.documento==this.dato && element.estado=="Rechazado"){
        this.ordenesCompraRechazadas.push(element)
      }
      console.log("orden "+element.documento)
    }) */
  }


  mostrarmensaje = (e) =>{
    //console.log("entre aquiooooo")
    //console.log("el texto es "+this.textoArea)
    this.popupVisible2 = true;
    //this.rechazarOrden(e)
  }

  getLinkedLocations(e: any){  
    let n 
    n = e.row.data
    console.log(n);  
    e.event.preventDefault(); 
    //this.mostrarmensaje()
      
    
  }

  getCourseFile = (e) => {  
    //this.cargarOrdenCompra(e.row.data)  
  }

  getCourseFile2 = (e) => {  
    //this.cargarOrdenCompra(e.row.data)  
  }

  getCourseFile3 = (e) => {  
    this.rechazarFactP(e.row.data)  
  }

  getCourseFile4 = (e) => {  
    this.eliminarPago(e.row.data)  
  }

  
  getCourseFile5 = (e) => {  
    this.rechazarEliminacion(e.row.data) 
  }

  rechazarEliminacion(e:any){
    var contadoEn=0
    Swal.fire({
      title: 'Rechazar Eliminación',
      text: "Se rechazará la eliminación de pago #"+e.idF,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.facturasProveedorService.updateEstado2(e,"aceptada").subscribe( res => {}, err => {alert("error")})
        //this.db.collection('/facturasProveedor').doc( e.id+"").update({"estado2" :"aceptada"})
        Swal.fire({
          title: 'Correcto',
          text: 'Se realizó con éxito',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
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

  eliminarPago(e:any){
    var contadoEn=0
    Swal.fire({
      title: 'Eliminar Factura asociada',
      text: "Se eliminará definitivamente el pago #"+e.idF,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.facturasProveedorService.deleteFacturasProveedor(e).subscribe( res => {}, err => {alert("error")})
        //this.db.collection('/facturasProveedor').doc( e.id+"").delete()
         if( this.facturaProveedorBus.length-1 <=0){
          this.ordenesCompraService.updateEstadoOrden(e,"PENDIENTE").subscribe( res => {
            
          }, err => {alert("error")})
          //this.db.collection('/ordenesDeCompra').doc(this.num_documento+"").update({"estadoOrden" :"PENDIENTE"})
        } 
       
          
        
        Swal.fire({
          title: 'Correcto',
          text: 'Se eliminó con éxito',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
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



  rechazarFactP(e:any){ 
    var data2=""
    data2=e.idF+""
    console.log("data2 "+data2)
      Swal.fire({
        title: 'Eliminar Factura asociada',
        text: "Desea eliminar el la factura #"+e.idF,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
         // this.db.collection('/facturasProveedor').doc(data2).update({"estado2" :"rechazada"})
         this.facturasProveedorService.updateEstado2(e ,"rechazada").subscribe( res => {}, err => {alert("error")})
        
          Swal.fire({
            title: 'Correcto',
            text: 'Un administrador aprobará su eliminación de pago',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            window.location.reload()
            //this.asignarValores()
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



  aceptarOrden = (e) => {  
    this.actualizarOrdenPos(e.row.data)
   
    //this.cargarOrdenCompra(e.row.data)  
  }

  rechazarOrden = (e) => {  
    this.actualizarOrdenRec(e.row.data) 
    //this.popupVisible2 = true;
    //console.log("ddddd "+e.documento + " texto"+this,this.textoArea)
  }

  actualizarOrdenPos(e){
    Swal.fire({
      title: 'Aprobar orden',
      text: "Desea aprobar la solicitud #"+e.documento,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        console.log("entre a actualizar" +e.documento + e.estado)
        var est:string="Aprobado"
        var num:string
        num=e.documento+""
        //this.db.collection('/ordenesDeCompra').doc(num).update({"estado" :"Aprobado", "secuencia": "En Proceso"})
       // this.db.collection('/ordenesDeCompra').doc(num).update({"estado" :"Aprobado", "n_orden":this.nordenCompra})
       // this.db.collection('/ordenCompraAprobadasGlobal').doc("matriz").update({"n_documento" :this.nordenCompra})
       



        let timerInterval
      Swal.fire({
        title: 'Guardando !',
        html: 'Procesando',
        timer: 1000,
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
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
                Swal.fire({
                    title: 'Orden creada',
                    text: 'Se ha creado su orden con éxito con éxito',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                  }).then((result) => {
                    window.location.reload()
                  })
        }
      })
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su orden.',
          'error'
        )
      }
    })
  }


  

  cerrarPopup(){
      this.popupVisible2=false
  }

  mostrarEliminar(){
    console.log("entre aqui")
    if(this.dataGrid2.instance.columnOption("bt2").visible == false){
      this.dataGrid2.instance.columnOption("bt2", "visible", true);
    }else{
      this.dataGrid2.instance.columnOption("bt2", "visible", false);
    }
    
  }

  actualizarOrdenRec(e){
    //console.log("mostrando"+e.documento+ " mensaje"+ this.textoArea)


    /* Swal.fire({
      title: 'Input something',
      input: 'textarea',
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar'
    }).then(function(result) {
      console.log("mostrando"+e.documento+ " mensaje"+ result.value)
      if (result.value) {
        Swal.fire(result.value)
      }
    }) */


    //console.log("mostrando"+e.documento+ " mensaje"+ )


    Swal.fire({
      title: 'Solicitud #'+e.documento,
      text: "Motivo de rechazo",
      icon: 'warning',
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        var num:string
        num=e.documento+""
         //this.db.collection('/ordenesDeCompra').doc(num).update({"estado" :"Rechazado", "msjAdmin":result.value})  
         let timerInterval
         Swal.fire({
           title: 'Guardando !',
           html: 'Procesando',
           timer: 1000,
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
         }).then((result) => {
           if (result.dismiss === Swal.DismissReason.timer) {
                   Swal.fire({
                       title: 'Orden rechazada',
                       text: 'Se envió su información',
                       icon: 'success',
                       confirmButtonText: 'Ok'
                     }).then((result) => {
                       window.location.reload()
                     })
           }
         })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'error'
        )
      }
    })
   
   
  }

  obtenerDatos(){
   

    var variab:boolean=true
    console.log("El dto es"+this.datoNsolicitud)
    this.ordenesCompra.forEach(element=>{
      if(element.n_orden==this.datoNsolicitud){
        //this.ordenesCompraPendientes.push(element)
        this.ordenDeCompra3 = element;
        this.popupVisible = true;
        variab=false
      }
     
    })

    if(variab){
      Swal.fire(
        'Error',
        'No se encontraron detalles!',
        'error'
      )
    }
  }

    onExporting (e) {
      e.component.beginUpdate();
      e.component.columnOption("total", "visible", true);
      e.component.columnOption("fecha_vencimiento", "visible", true);
      e.component.columnOption("valor", "visible", true);
      e.component.columnOption("no_conformidad", "visible", true);
      e.component.columnOption("observaciones", "visible", true);
    };
    onExported (e) {
      e.component.columnOption("total", "visible", false);
      e.component.columnOption("fecha_vencimiento", "visible", false);
      e.component.columnOption("valor", "visible", false);
      e.component.columnOption("no_conformidad", "visible", false);
      e.component.columnOption("observaciones", "visible", false);
      e.component.endUpdate();
    }
  

  mapearArreglo(){
    console.log("sdsdsdsdsdsd"+this.selectedRows)
    for (let index = 0; index < this.selectedRows.length; index++) {
    console.log("producto "[index]+" es "+ this.selectedRows[index])
    }
  }

anadirDetallePago = (e) => {
  //this.newButtonEnabled = true
  this.detallePago.push(new DetallePagoProveedor())

}

  selectionChangedHandler() {
    if(!this.selectionChangedBySelectbox) {
        this.prefix=null;
    }
    this.selectionChangedBySelectbox=false;
}


  llenarCombosOrdenesCompra(){
    var cont=0
    this.ordenes.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.ordenes.forEach(element=>{
        this.ordenes.splice(0)    
      })
    }
    //alert("hay "+this.ordenesCompra.length)
    this.ordenesCompraAprobadas.forEach(element=>{
      console.log("sdsdsd "+JSON.stringify(element))
      if(element.proveedor.nombre_proveedor == this.pago_proveedor.beneficiario){
        console.log("encontre la orden #"+element.n_orden)
        this.ordenes2.push(element)
      }
    })
    this.ordenes2.forEach(element2=>{
      this.facturaProveedor2.forEach(element=>{
        if(element.nSolicitud == element2.n_orden && element.estado=="PENDIENTE"){
          this.ordenes.push(element2)
        }
      })
    })
    var matriz = {};
 /* this.ordenes.forEach(function(registro) { 
      var pais = registro["n_orden"];
      matriz[pais] = matriz[pais] ? (matriz[pais] + 1) : 1;
    });
    matriz = Object.keys(matriz).map(function(pais) {
      return { orden: pais};
   });
   console.log(matriz); */
   let sinRepetidos = this.ordenes.filter((valorActual, indiceActual, arreglo) => {
    //Podríamos omitir el return y hacerlo en una línea, pero se vería menos legible
    return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo) === JSON.stringify(valorActual)) === indiceActual
  });

  sinRepetidos.forEach(element=>{
    console.log("estoy adentro "+element.n_orden)
    this.ordenes3.push(element)
  })
  if(this.ordenes3.length<=0){
    Swal.fire(
      'Error!',
      'No hay pagos pendientes para este proveedor',
      'error'
    )
  }

  // console.log("yo tengo +++"+JSON.stringify(sinRepetidos)) 
  }




  obtenerFactP(e,i:number){
    console.log("aquuuuuui traje "+e.value)
    var cont=0
    this.factProvPagos.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.factProvPagos.forEach(element=>{
        this.factProvPagos.splice(0)    
      })
    }

    this.detallePago[i].orden_compra= e.value
    this.facturaProveedor2.forEach(element=>{
      if(element.nSolicitud == e.value && element.estado=="PENDIENTE"){
        console.log("hay "+element.nFactura)
        this.factProvPagos.push(element)
      }
    })
  }

  obtenerDatosFactP(e, i:number){
    var cont22=0
    this.detallePago[i].fact_proveedor= e.value
    this.factProvPagos.forEach(element=>{
      cont22++
      if(element.nFactura== e.value){
        this.detallePago[i].fecha_vencimiento = element.fechaExpiracion
        this.detallePago[i].valor = element.total
        this.detallePago[i].total = element.total
        this.detallePago[i].id_factura = element.idF
      }
    })
    this.calcularTotalPagos()
  }

  carcularTotalPago(e, i:number){
    var totalpago:number=0
    totalpago=  this.detallePago[i].valor- this.detallePago[i].no_conformidad
    this.detallePago[i].total = totalpago
    this.calcularTotalPagos()
  }

  calcularTotalPagos(){
    var suma=0
    this.detallePago.forEach(element=>{
        suma= element.total+suma
    })
    
    this.valor=suma
    this.pago_proveedor.valor = suma
  }


  guardarFacturaProveedor(){
    
    var cont=0
    this.facturaProveedorBus.forEach(element=>{
      cont++
    })
    console.log("mostrando antes"+this.productosComprados2.length)
    if(cont>=0){
      this.facturaProveedorBus.forEach(element=>{
        this.facturaProveedorBus.splice(0)
        this.totalsuma2=0
      })
      
      console.log("mostrando"+this.facturaProveedorBus.length)
    }

    //var totalsuma2=0
    let saldoFaltante=0
    this.facturaProveedor.fecha= this.now2.toLocaleDateString()
    this.facturaProveedor.fechaExpiracion= this.now3.toLocaleDateString()
    this.facturaProveedor.nSolicitud= this.datoNsolicitud
    this.facturaProveedor.nFactura= this.datoNFact
    this.facturaProveedor.total= this.datoTotal
    this.facturaProveedor.productos= this.selectedRows
    this.facturaProveedor.idF=this.facturaNp

    //desde aqui comienza
    this.facturaProveedor2.forEach(element=>{
      if(this.datoNsolicitud==element.nSolicitud){
          this.facturaProveedorBus.push(element)
      }
    })
    this.asignarValor()
    this.facturaProveedorBus.forEach(element=>{
        this.totalsuma2=element.total+this.totalsuma2   //300
    })

    this.ordenesCompraAprobadas.forEach(element=>{
      if(this.datoNsolicitud == element.n_orden){
            this.totalOrden=element.total  - element.costeUnitaTransport-element.otrosCostosGen
            this.facturaProveedor.proveedor=element.proveedor.nombre_proveedor   //365
      }
    })
    console.log("El totalsuma2 es"+this.totalsuma2)
    console.log("El total de esta orden es"+this.totalOrden)
    
    this.totalsuma=this.totalOrden-this.totalsuma2
    console.log("El total suma "+this.totalsuma)
    saldoFaltante=this.totalsuma -this.facturaProveedor.total
    console.log("El saldo faltante ees "+saldoFaltante)
    // aqui termina
    if(this.selectedRows != undefined){
      if(this.facturaProveedor.total > this.totalsuma){
        Swal.fire(
          'Error!',
          'El saldo ingresado es superior al saldo',
          'error'
        )
      }else if(this.facturaProveedor.total <= this.totalsuma){
        new Promise<any>((resolve, reject) => { 
          this.mostrarMsnsaConf()
            let datoNFact:string
            datoNFact=this.facturaNp+""
           //alert("ddd "+this.facturaProveedor.documento_solicitud)
           this.facturasProveedorService.newFacturaProveedor(this.facturaProveedor).subscribe( res => {
            this.contadores[0].contFacturaProveedor_Ndocumento=this.facturaNp
            console.log("ddd "+JSON.stringify(this.contadores[0]))
            this.contadoresService.updateContadoresIDFacturasProveedor(this.contadores[0]).subscribe( res => {this.actualizarProductosBodega()}, err => {alert("error")})
           }, err => {alert("error")})
           // this.db.collection('/facturasProveedor').doc(datoNFact).set({...Object.assign({},this.facturaProveedor )}).then(res => { }) ;
          /*   this.db
                .collection("/contadorFactProveedor")
                .doc("matriz").set({ n_documento:this.facturaNp })
                .then(res => {this.confirmar() }); */
            
           // this.getfacturasProveedor()
         });
      }

    }else{
      Swal.fire(
        'Error!',
        'No ha seleccionado productos',
        'error'
      )

    }
    
  }
  

  actualizarProductosBodega(){
    var cant=0
    var cont=1
    if(this.banderaProductos){
      this.confirmar()
    }else{
      if(this.ordencompraleida.tipo == "Entregado"){
        this.confirmar()
      }else{
        this.productosActivos.forEach(element=>{
          this.productosCompradosLeidos.forEach(element2 => {
            if(element.PRODUCTO==element2.nombreComercial.PRODUCTO){
              cant=element.bodegaProveedor+element2.cantidad
              element.bodegaProveedor=cant
              this.productoService.updateProductoBodegaProveedor(element).subscribe(
                res => {
                  
                 this.contadorValidaciones(cont++)
                },
                err => {
                  Swal.fire({
                    title: err.error,
                    text: 'Revise e intente nuevamente',
                    icon: 'error'
                  })
                })
            }
            
          })
        });
      }
      
    }

    
  }

  contadorValidaciones(i:number){
    //alert("entre con "+i)
    if(this.productosCompradosLeidos.length==i){
       this.confirmar()
    }else{
      console.log("no he entrado "+i)
    }

  }

  mostrarMsnsaConf(){
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

  confirmar(){
    this.contConf++
    console.log("el con esta e "+this.contConf)
      if(this.contConf==2){
       
      }
      Swal.close()
      Swal.fire(
        'Ok!',
        'Factura registrada con éxito',
        'success'
      ).then(function(result) {
        window.location.reload()
      });
  }
  setProveedor(e){
    var cont=0
    this.detallePago.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.detallePago.forEach(element=>{
        this.detallePago.splice(0)    
      })
    }
    this.detallePago.push(new DetallePagoProveedor)
    this.pago_proveedor.beneficiario= e.component._changedValue
    console.log("el nombre es "+this.pago_proveedor.beneficiario)  
    this.llenarCombosOrdenesCompra()
  }

  deleteFila(i:number){
    this.detallePago.splice(i,1);
  }


  guardarPagoProveedor(){
    var cont45=0
    this.pago_proveedor.fecha_factura=this.fecha_factura.toLocaleDateString()
    this.pago_proveedor.fecha_pago=this.fecha_pago.toLocaleDateString()
    this.pago_proveedor.fecha_transaccion= this.fecha_transaccion.toLocaleDateString()
    this.pago_proveedor.n_cheque=this.n_cheque
    this.pago_proveedor.n_cuenta= this.n_cuenta
    this.pago_proveedor.nombre_banco= this.nombre_banco
    this.pago_proveedor.valor= this.valor

    if( this.pago_proveedor.n_cheque!=undefined &&  this.pago_proveedor.n_cuenta!=undefined  && this.pago_proveedor.nombre_banco!=undefined && 
    this.pago_proveedor.valor!=0){
      console.log("cheque "+this.pago_proveedor.n_cheque)
      console.log("cuenta "+this.pago_proveedor.n_cuenta)
      console.log("banco "+this.pago_proveedor.nombre_banco)
      console.log("valor "+this.pago_proveedor.valor)
      console.log("si entre")
      new Promise<any>((resolve, reject) => {
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
        var num5=this.facturaNp2+""
        this.pagoFacturaService.newPagoProveedor(this.pago_proveedor).subscribe( res => {
          this.contadores[0].pagoProveedor_Ndocumento=this.facturaNp2
          this.contadoresService.updateContadoresIDPagosproveedor(this.contadores[0]).subscribe( res => {}, err => {alert("error")})
         }, err => {alert("error")})
        //this.db.collection('/pagoProveedor').doc(num5).set({...Object.assign({},this.pago_proveedor )}) ;
       /*  this.db
              .collection("/pagoProveedor")
              .doc("matriz").set({ n_documento:this.facturaNp2 })
              .then(res => { }); */
              this.actualizarFacturas()
        this.detallePago.forEach(element => {
                element.beneficiario = this.pago_proveedor.beneficiario
                element.nombre_banco= this.pago_proveedor.nombre_banco
                element.n_cheque = this.pago_proveedor.n_cheque
                element.idPago= this.facturaNp2
                this.detallePagoService.newDetallePago(element).subscribe( res => {cont45++,this.mensajeConfi(cont45)}, err => {alert("error")})
                /* this.db.collection("/pagosFacturasProveedor").add({ ...element })
                .then(res => { cont45++,this.mensajeConfi(cont45)}, err => alert(err)); */
              });       
       
        //this.getPagosProveedor()
      });
      

    }else{
      Swal.fire({
        title: 'Error',
        text: 'Error al guardar revise nuevamente',
        icon: 'error',
      })
    }    
  }

  mensajeConfi(i:number){
    
    if(i==this.detallePago.length){
      Swal.close()
      Swal.fire({
        title: 'Correcto',
        text: 'Se ha guardado su pago',
        icon: 'success',
        confirmButtonText: 'Ok'
      }).then((result) => {
        window.location.reload()
      })
    }else{
      console.log("todavia no entre")
    }
  }

  actualizarFacturas(){
    var dato=""
    this.detallePago.forEach(element=>{
      dato=element.id_factura+""

      this.facturasProveedorService.updateEstado(dato,"Cancelado").subscribe( res => {}, err => {alert("error")})
      //this.pagoFacturaService.newPagoProveedor(this.pago_proveedor).subscribe( res => {}, err => {alert("error")})
     // this.db.collection('/facturasProveedor').doc(dato).update({"estado" :"Cancelado"})
      //this.db.collection('/pagoProveedor').doc(num5).set({...Object.assign({},this.pago_proveedor )}) ;
      
    })
  }

  opcionMenu(e){
    var x = document.getElementById("op1");
    var y = document.getElementById("op2");
    var z = document.getElementById("op3");
    var z1 = document.getElementById("op4");

    switch (e.value) {
      case "Factura Proveedor":
        x.style.display = "block";
        y.style.display="none";
        z.style.display="none";
        z1.style.display="none";
       break;

      case "Control / Facturas":
       
        x.style.display = "none";
        y.style.display="block";
        z.style.display="none";
        z1.style.display="none";
        break;
     
      case "Pagos Proveedor":
        
        x.style.display = "none";
        y.style.display="none";
        z.style.display="block";
        z1.style.display="none";
        break;

        case "Facturas Ingresadas":
          this.llenarFacturasPendientes()
        x.style.display = "none";
        y.style.display="none";
        z.style.display="none";
        z1.style.display="block";
        break;
      default:    
    }     
    }


  cargarValoresFactura(){
   

    let products=0
    this.productosComprados2.forEach(element=>{
        products=element.total+products
    })

    let subtotal2=0
    this.subtotalFactura1=this.ordenDeCompra2.subtotal/1.12
    //this.subtotalFactura2=products/1.12
   // console.log("subt "+this.subtotalFactura2)
    console.log("total "+this.ordenDeCompra2.total)
    //console.log("subt "+this.subtotalFactura2)
    this.subtotal = this.ordenDeCompra2.total +this.ordenDeCompra2.costeUnitaTransport+this.ordenDeCompra2.otrosCostosGen
    this.subtotal1 =this.subtotal
    this.subtMenosDesc=this.ordenDeCompra2.subtotalDetalles-this.ordenDeCompra2.subtDetalles2
    //this.subtDesc= 
    subtotal2= ((this.ordenDeCompra2.otrosDescuentosGen/100)*this.ordenDeCompra2.subtotalDetalles)
    this.subtotalGeneral2= this.ordenDeCompra2.subtotalDetalles-subtotal2
    
    this.subtCostosGenerales=this.ordenDeCompra2.otrosCostosGen/1.12
    this.subtotalIva=(this.subtCostosGenerales+this.subtotalGeneral2)*0.12
    this.subtOtrsoDesc=subtotal2
     
    //desde aqui comienza los totales
    this.subtotal1 =this.subtotal/1.12

  }

  setearNFactura(){
    let nf=this.numOrden
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


}


@Pipe({ name: 'stringifyEmplyees' })
export class StringifyEmployeesPipe implements PipeTransform {
    transform(employees: ProductoDetalleCompra[]) {
        return employees.map(employee =>  employee.nombreComercial.PRODUCTO ).join(" , ");
       
    }
}

























