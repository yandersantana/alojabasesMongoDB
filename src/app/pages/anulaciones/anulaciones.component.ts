import { Component, OnInit } from '@angular/core';
import { anulaciones } from './anulaciones';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { OrdenDeCompra } from '../compras/compra';
import pdfMake from 'pdfmake/build/pdfmake';
import { FacturaProveedor } from '../orden-compra/ordencompra';
import { ProductoDetalleCompra } from '../producto/producto';
import Swal from 'sweetalert2';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { factura, venta, producto, contadoresDocumentos } from '../ventas/venta';
import { objDate, tipoBusquedaTransaccion, transaccion } from '../transacciones/transacciones';
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { OrdenesCompraService } from 'src/app/servicios/ordenes-compra.service';
import { TransaccionesService } from 'src/app/servicios/transacciones.service';
import { FacturasService } from 'src/app/servicios/facturas.service';
import { ProformasService } from 'src/app/servicios/proformas.service';
import { NotasVentasService } from 'src/app/servicios/notas-ventas.service';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { FacturasProveedorService } from 'src/app/servicios/facturas-proveedor.service';
import { DatosConfiguracionService } from 'src/app/servicios/datosConfiguracion.service';
import { AuthenService } from 'src/app/servicios/authen.service';
import { user } from '../user/user';
import { dataDocumento, ReciboCaja } from '../reciboCaja/recibo-caja';
import { CuentasPorCobrarService } from 'src/app/servicios/cuentasPorCobrar.service';
import { CuentaPorCobrar } from '../cuentasPorCobrar/cuentasPorCobrar';
import { TransaccionesFinancierasService } from 'src/app/servicios/transaccionesFinancieras.service';
import { TransaccionesFinancieras } from '../transaccionesFinancieras/transaccionesFinancieras';
import { CajaMenorService } from 'src/app/servicios/cajaMenor.service';
import { CajaMenor } from '../cajaMenor/caja-menor';
import { ReciboCajaService } from 'src/app/servicios/reciboCaja.service';

@Component({
  selector: 'app-anulaciones',
  templateUrl: './anulaciones.component.html',
  styleUrls: ['./anulaciones.component.scss']
})
export class AnulacionesComponent implements OnInit {
  num_orden:number=0
  motivo:string
  anulacion:anulaciones
  mensajeLoading = "Cargando..."
  mostrarMotivo = false;
  mostrarAnulacion1 = true;
  mostrarAnulacion2 = false;
  mostrarOrdenesCompraGenerales = true;
  mostrarOrdenesCompraDirectas = false;
  mostrarFacturas = false;
  mostrarNotasVenta = false;

  estadoD:string
  nsolicitudOrden:number
  nAnulacion:number=0
  ordenesCompra:OrdenDeCompra[]=[]
  ordenesCompraGenerales:OrdenDeCompra[]=[]
  ordenesCompraPendientes:OrdenDeCompra[]=[]
  ordenesCompraPendientesAnulacion:OrdenDeCompra[]=[]
  ordenesCompraAnuladas:OrdenDeCompra[]=[]

  ordenesCompraGeneralesDirectas:OrdenDeCompra[]=[]
  ordenesCompraDirectasPendientes:OrdenDeCompra[]=[]
  ordenesCompraDirectasPendientesAnulacion:OrdenDeCompra[]=[]
  ordenesCompraDirectasAnuladas:OrdenDeCompra[]=[]
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  ordenDeCompra2 : OrdenDeCompra;
  ordenDeCompra3 : OrdenDeCompra;
  facturaProveedor: FacturaProveedor;
  factProvPagos: FacturaProveedor[] = []
  popupVisible = false;
  popupVisible2 = false;
  productosComprados: ProductoDetalleCompra[] = []
  numOrden:number=0
  productosComprados2: ProductoDetalleCompra[] = []
  productosComprados3: ProductoDetalleCompra[] = []
  productosComprados4: ProductoDetalleCompra[] = []
  facturasProveedor: FacturaProveedor[]=[]
  parametrizaciones:parametrizacionsuc[]=[]
  parametrizacionSucu:parametrizacionsuc
  menu1: string[] = [
    "Ordenes de Compra",
    "Ordenes de Compra Directas",
    "Facturas",
    "Notas de Venta"
  ];

  tiposOrdenesCompra: string[] = [
    'Vigentes',
    'Pendiente Anulacion',
    'Anuladas',
  ];

  tiposOrdenesCompraDirectas: string[] = [
    'Vigentes',
    'Pendiente Anulacion',
    'Anuladas',
  ];

  tiposFacturas: string[] = [
    'Vigentes',
    'Pendiente Anulacion',
    'Anuladas',
  ];

  tiposNotasVenta: string[] = [
    'Vigentes',
    'Pendiente Anulacion',
    'Anuladas',
  ];


  tipoOrdenCompra = "Vigentes"
  tipoOrdenCompraDirecta = "Vigentes"
  tipoFactura = "Vigentes"
  tipoNotaVenta = "Vigentes"

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
  mostrarLoading: boolean = false
  facturas:factura[]=[]
  facturasGenerales:factura[]=[]
  facturasAP:factura[]=[]
  facturasPEN:factura[]=[]
  facturasELI:factura[]=[]
  notasVentaGenerales:factura[]=[]
  notasVenta:factura[]=[]
  notasVentaAP:factura[]=[]
  notasVentaPEN:factura[]=[]
  notasVentaELI:factura[]=[]
  cotizaciones:factura[]=[]
  productos:producto[]=[]
  factura:factura
  productosVendidos:venta[]=[]
  productosVendidos2:venta[]=[]
  tDocumento:string
  Sdescuento:number=0
  subtotal2:number=0
  sIva0:number=0
  sIva12:number=0
  iva:number=0
  transacciones: transaccion[]=[]
  contadores:contadoresDocumentos[]=[]
  obj: objDate;
  fechaAnteriorDesde: Date = new Date();
  busquedaTransaccion: tipoBusquedaTransaccion;

  expensesCollection3: AngularFirestoreCollection<transaccion>;
  usuarioLogueado : user;
  mostrarBloqueo = true;

  imagenLogotipo = ""
  constructor(public parametrizacionService:ParametrizacionesService,
    public _configuracionService : DatosConfiguracionService,
    public facturasProveedorService:FacturasProveedorService,  
    public contadoresService:ContadoresDocumentosService, 
    public notasventaService:NotasVentasService, 
    public facturasService:FacturasService, 
    public proformasService:ProformasService,
    public ordenesService:OrdenesCompraService,
    public authenService : AuthenService,
    public transaccionesService:TransaccionesService, 
    public productoService:ProductoService,
    public _cuentaPorCobrarService : CuentasPorCobrarService,
    public _transaccionesFinancierasService : TransaccionesFinancierasService,
    public _reciboCajaService : ReciboCajaService,
    public _cajaMenorService : CajaMenorService) 
    {
      this.anulacion= new anulaciones()
  }

  ngOnInit() {
    this.cargarUsuarioLogueado();
    this.traerParametrizaciones()
    this.traerProductos()
    this.traerFacturasProveedor()
    this.traerDatosConfiguracion();
  }

  cargarUsuarioLogueado() {
    var correo = ""
    new Promise((res, err) => {
      if (localStorage.getItem("maily") != '') 
        correo = localStorage.getItem("maily");
      
      this.authenService.getUserLogueado(correo)
        .subscribe(
          res => { this.usuarioLogueado = res as user; this.mostrarPopupCodigo()},
          err => {}
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


  traerDatosConfiguracion() {
    this._configuracionService.getDatosConfiguracion().subscribe((res) => {
      this.imagenLogotipo = res[0].urlImage;
    });
  }


  traerParametrizaciones(){
    this.parametrizacionService.getParametrizacion().subscribe(res => {
      this.parametrizaciones = res as parametrizacionsuc[];
   })
  }

  traerProductos(){
    this.productoService.getProducto().subscribe(res => {
      this.productos = res as producto[];
   })
  }

  traerOrdenesCompra(){
    this.mostrarLoading = true;
    this.ordenesService.getOrden().subscribe(res => {
      this.ordenesCompra = res as OrdenDeCompra[];
      this.obtenerOrdenesPendientes()
   })
  }

  traerTransacciones(){
    this.transaccionesService.getTransaccion().subscribe(res => {
      this.transacciones = res as transaccion[];
   })
  }

  traerFacturas(){
    this.mostrarLoading = true;
    this.facturasService.getFacturas().subscribe(res => {
      this.facturas = res as factura[];
      this.dividirFacturas()
   })
  }

  traerProformas(){
    this.proformasService.getProformas().subscribe(res => {
      this.cotizaciones = res as factura[];
   })
  }

  traerNotasVenta(){
    this.mostrarLoading = true;
    this.notasventaService.getNotasVentas().subscribe(res => {
      this.notasVenta = res as factura[];
      this.dividirNotasVenta()
   })
  }

  traerContadoresDocumentos(){
    this.contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
      this.asignarIDdocumentos()
   })
  }

  traerFacturasProveedor(){
    this.facturasProveedorService.getFacturasProveedor().subscribe(res => {
      this.facturasProveedor = res as FacturaProveedor[];
   })
  }

  asignarIDdocumentos(){

  }



  traerTransaccionesPorRango(numero) {
    this.mostrarLoading = true;
    this.limpiarArreglos()
    this.fechaAnteriorDesde = this.nowdesde
    var fechaHoy = this.nowdesde
    fechaHoy.setDate(this.nowdesde.getDate());
    var fechaHasta = new Date()
    fechaHasta.setDate(this.nowhasta.getDate()+1);
    this.obj = new objDate();
    this.obj.fechaActual = fechaHasta;
    this.obj.fechaAnterior = fechaHoy;
    switch (numero) {
      case 1:
        this.ordenesService.getOrdenesCompraPorRango(this.obj).subscribe(
          (res) => {
            this.ordenesCompra = res as OrdenDeCompra[];
            this.obtenerOrdenesPendientes()
          },
          () => {}
        );
        break;
      case 2:
        this.facturasService.getFacturasPorRango(this.obj).subscribe(
          (res) => {
            this.facturas = res as factura[];
            this.dividirFacturas()
          },
          () => {}
        );
        break;
      case 3:
        this.notasventaService.getNotasVentaPorRango(this.obj).subscribe(
          (res) => {
           this.notasVenta = res as factura[];
            this.dividirNotasVenta()
          },
          () => {}
        );
        break;
    
      default:
        break;
    }
    
  }


   opcionRadioTipos(e){
    this.ordenesCompraGenerales = [];
    switch (e.value) {
      case "Vigentes":
        this.mostrarMotivo = false;
        this.mostrarAnulacion1 = true;
        this.mostrarAnulacion2 = false;
        this.ordenesCompraGenerales = this.ordenesCompraPendientes;
        break;
      case "Pendiente Anulacion":
        this.mostrarMotivo = true;
        this.mostrarAnulacion1 = false;
        this.mostrarAnulacion2 = true;
        this.ordenesCompraGenerales = this.ordenesCompraPendientesAnulacion;
        break;
      case "Anuladas":
        this.mostrarMotivo = true;
        this.mostrarAnulacion1 = false;
        this.mostrarAnulacion2 = false;
        this.ordenesCompraGenerales = this.ordenesCompraAnuladas;
        break;
      default:    
    }      
  }

  opcionRadioTiposDirectas(e){
    this.ordenesCompraGeneralesDirectas = [];
    switch (e.value) {
      case "Vigentes":
        this.mostrarMotivo = false;
        this.mostrarAnulacion1 = true;
        this.mostrarAnulacion2 = false;
        this.ordenesCompraGeneralesDirectas = this.ordenesCompraDirectasPendientes;
        break;
      case "Pendiente Anulacion":
        this.mostrarMotivo = true;
        this.mostrarAnulacion1 = false;
        this.mostrarAnulacion2 = true;
        this.ordenesCompraGeneralesDirectas = this.ordenesCompraDirectasPendientesAnulacion;
        break;
      case "Anuladas":
        this.mostrarMotivo = true;
        this.mostrarAnulacion1 = false;
        this.mostrarAnulacion2 = false;
        this.ordenesCompraGeneralesDirectas = this.ordenesCompraDirectasAnuladas;
        break;
      default:    
    }      
  }


  opcionRadioTiposFacturas(e){
    this.facturasGenerales = [];
    switch (e.value) {
      case "Vigentes":
        this.mostrarMotivo = false;
        this.mostrarAnulacion1 = true;
        this.mostrarAnulacion2 = false;
        this.facturasGenerales = this.facturasAP;
        break;
      case "Pendiente Anulacion":
        this.mostrarMotivo = true;
        this.mostrarAnulacion1 = false;
        this.mostrarAnulacion2 = true;
        this.facturasGenerales = this.facturasPEN;
        break;
      case "Anuladas":
        this.mostrarMotivo = true;
        this.mostrarAnulacion1 = false;
        this.mostrarAnulacion2 = false;
        this.facturasGenerales = this.facturasELI;
        break;
      default:    
    }      
  }


  opcionRadioTiposNotaVenta(e){
    this.notasVentaGenerales = [];
    switch (e.value) {
      case "Vigentes":
        this.mostrarMotivo = false;
        this.mostrarAnulacion1 = true;
        this.mostrarAnulacion2 = false;
        this.notasVentaGenerales = this.notasVentaAP;
        break;
      case "Pendiente Anulacion":
        this.mostrarMotivo = true;
        this.mostrarAnulacion1 = false;
        this.mostrarAnulacion2 = true;
        this.notasVentaGenerales = this.notasVentaPEN;
        break;
      case "Anuladas":
        this.mostrarMotivo = true;
        this.mostrarAnulacion1 = false;
        this.mostrarAnulacion2 = false;
        this.notasVentaGenerales = this.notasVentaELI;
        break;
      default:    
    }      
  }


  traerFacturasPorRango() {
    this.mostrarLoading = true;
    this.fechaAnteriorDesde = this.nowdesde
    var fechaHoy = this.nowdesde
    fechaHoy.setDate(this.nowdesde.getDate());
    var fechaHasta = new Date()
    fechaHasta.setDate(this.nowhasta.getDate()+1);
    this.obj = new objDate();
    this.obj.fechaActual = fechaHasta;
    this.obj.fechaAnterior = fechaHoy;
    this.ordenesService.getOrdenesCompraPorRango(this.obj).subscribe(
      (res) => {
        this.ordenesCompra = res as OrdenDeCompra[];
        this.obtenerOrdenesPendientes()
      },
      () => {}
    );
  }


  buscarOrden(){
    this.ordenesCompra.forEach(element=>{
      if(this.num_orden == element.n_orden){
        element.estadoOrden=="PENDIENTE"
        this.estadoOrden=element.estadoOrden
        this.nsolicitudOrden=element.documento
      }
    })
    if(this.estadoOrden == "PENDIENTE"){
      this.estadoD= "OK"
    }else{
      this.estadoD= "ORDEN EN PROCESO"
    }
  }

  obtenerOrdenesPendientes(){
    this.ordenesCompra.forEach(element=>{
      if(element.estadoOrden=="PENDIENTE" && element.tipo!="Entregado")
        this.ordenesCompraPendientes.push(element)
      else if(element.estadoOrden=="Pendiente-Anulacion" && element.tipo!="Entregado")
        this.ordenesCompraPendientesAnulacion.push(element)
      else if(element.estadoOrden=="ANULADO" && element.tipo!="Entregado")
        this.ordenesCompraAnuladas.push(element)
      

      if(element.tipo=="Entregado" && element.estadoOrden=="COMPLETO")
        this.ordenesCompraDirectasPendientes.push(element)
      else if(element.estadoOrden=="Pendiente-Anulacion" && element.tipo=="Entregado")
        this.ordenesCompraDirectasPendientesAnulacion.push(element)
      else if(element.estadoOrden=="ANULADO" && element.tipo=="Entregado")
        this.ordenesCompraDirectasAnuladas.push(element)
    })

    this.ordenesCompraGenerales = this.ordenesCompraPendientes
    this.ordenesCompraGeneralesDirectas = this.ordenesCompraDirectasPendientes
    this.mostrarLoading = false
  }

  limpiarArreglos(){
    this.ordenesCompra = []
    this.ordenesCompraPendientes = []
    this.ordenesCompraPendientesAnulacion = []
    this.ordenesCompraAnuladas = []
    this.ordenesCompraDirectasPendientes = []
    this.ordenesCompraDirectasPendientesAnulacion = []
    this.ordenesCompraDirectasAnuladas = []
    this.ordenesCompraDirectasPendientesAnulacion = []
    this.facturasELI = []
    this.facturasPEN = []
    this.facturasAP = []
    this.notasVentaELI = []
    this.notasVentaPEN = []
    this.notasVentaAP = []
    this.facturas = []
    this.notasVenta = []
  }



  eliminarTransacciones5(e){
    this.transacciones.forEach(element=>{
      if(element.documento== e.documento && element.orden_compra == e.n_orden ){
        this.transaccionesService.deleteTransaccion(element).subscribe( res => {console.log(res + "termine1");}, err => {alert("error")})
      }
    })
  }
 
    actualizarProductos3(e){
     this.eliminarTransacciones5(e)
     var cont=0
     var contVal=0
  
      var sumaProductos =0
      var num1:number=0
      var num2:number=0
      var numBod:number=0
      var bodega:number=0
      var cont3ing=0
       var contIng:number=0
       var entre:boolean=true   
         this.productosComprados2.forEach(element=>{
           this.productos.forEach(elemento1=>{
             if(elemento1.PRODUCTO == element.nombreComercial.PRODUCTO){
              switch (e.sucursal.nombre) {
               case "matriz":
                 num1=element.cantidad
                 num2=elemento1.sucursal1
                 numBod=elemento1.bodegaProveedor
                 sumaProductos =Number(num2) - Number(num1)
                 bodega =Number(numBod) - Number(num1)
                 break;
               case "sucursal1":
                 num1=element.cantidad
                 num2=elemento1.sucursal2
                 numBod=elemento1.bodegaProveedor
                 sumaProductos =Number(num2) - Number(num1)
                 bodega =Number(numBod) - Number(num1)
                 break;
               case "sucursal2":
                 num1=element.cantidad
                 num2=elemento1.sucursal3
                 numBod=elemento1.bodegaProveedor
                 sumaProductos =Number(num2) - Number(num1)
                 bodega =Number(numBod) - Number(num1)
                   break;
               default:
             }
            }
          })
          if(entre){
           var sum2=0
            new Promise<any>((resolve, reject) => {
             switch (e.sucursal.nombre) {
               case "matriz":
                 element.nombreComercial.sucursal1=sumaProductos
                 element.nombreComercial.bodegaProveedor=0
                 this.productoService.updateProductoSucursal1(element.nombreComercial).subscribe( res => {cont3ing++, this.contadorValidaciones3(cont3ing)}, err => {alert("error")})
                 break;
               case "sucursal1":
                 element.nombreComercial.sucursal2=sumaProductos
                 element.nombreComercial.bodegaProveedor=0
                 this.productoService.updateProductoSucursal2(element.nombreComercial).subscribe( res => {cont3ing++, this.contadorValidaciones3(cont3ing)}, err => {alert("error")})
                 break;
               case "sucursal2":
                 element.nombreComercial.sucursal3=sumaProductos
                 element.nombreComercial.bodegaProveedor=0
                 this.productoService.updateProductoSucursal3(element.nombreComercial).subscribe( res => {cont3ing++, this.contadorValidaciones3(cont3ing)
                }, err => {alert("error")})
                break;
               default:
             }
            })
          }
         })     
     }

     contadorValidaciones3(i:number){
      if(this.productosComprados2.length==i){
          Swal.close()
          Swal.fire({
            title: 'Orden Anulada',
            text: 'Se ha guardado con éxito',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            window.location.reload()
          })
      }
    }


  anularOrden = (e) => {  
    this.verFacturas(e.row.data)
  }

  rechazarAnulFact= (e) => {  
    this.rechazarFactAnu(e.row.data) 
  }

  rechazarAnulNOT= (e) => {  
    this.rechazarNotAnu(e.row.data) 
  }

  eliminarFactura= (e) => {  
    this.validarTransaccionesFactura(e.row.data) 
  }

  eliminarNotaVenta= (e) => {  
    this.validarTransaccionesNotaVenta(e.row.data) 
  }

  anularOrden2 = (e) => {  
    this.actualizarOrdenRec2(e.row.data) 
  }

  anularOrdenDirecta = (e) => {  
    this.actualizarOrdenDirecta(e.row.data) 
  }

  anularFactura= (e) => {  
    //this.validarEliminacionFactura(e.row.data) 
    this.actualizarFact(e.row.data) 
  }

  anularNotaVenta= (e) => { 
    //this.validarEliminacionNotaVenta(e.row.data) 
    this.actualizarNotV(e.row.data) 
  }

  getCourseFile = (e) => {
    this.cargarOrdenCompra(e.row.data)  
  }

  getCourseFile4 = (e) => {  
    this.cargarFactura(e.row.data)  
  }
  getCourseFile2 = (e) => {  
    this.cargarNotaVenta(e.row.data)  
  }
  getCourseFile3 = (e) => {  
    this.cargarCotización(e.row.data)  
  }


  dividirFacturas(){
    this.facturas.forEach(element=>{
      if(element.estado == "ANULADA"){
        this.facturasELI.push(element)
      }else if(element.estado == "PENDIENTE"){
        this.facturasPEN.push(element)
      }else if(element.estado == "CONTABILIZADA"){
        this.facturasAP.push(element)
      }
    })
    this.facturasGenerales = this.facturasAP;
    this.mostrarLoading = false
  }

  dividirNotasVenta(){
    this.notasVenta.forEach(element=>{
      if(element.estado == "ANULADA"){
        this.notasVentaELI.push(element)
      }else if(element.estado == "PENDIENTE"){
        this.notasVentaPEN.push(element)
      }else if(element.estado == "CONTABILIZADA"){
        this.notasVentaAP.push(element)
      }
    })
    this.notasVentaGenerales = this.notasVentaAP
    this.mostrarLoading= false
  }


  
  cargarFactura(e){
    this.limpiarArregloPFact()
    this.facturas.forEach(element=>{
      if(e.documento_n == element.documento_n){
       this.factura= element
       this.productosVendidos2=element.productosVendidos
      }
    })
    
  

    this.parametrizaciones.forEach(element=>{
       if(element.sucursal == this.factura.sucursal){
         this.parametrizacionSucu= element
       }
     })
    this.tDocumento="Factura"
    this.crearPDF2(e)
   // this.mostrarDatos()
   }
 
   //cargar Nota de Venta
   cargarNotaVenta(e){
    this.limpiarArregloPFact()
     this.notasVenta.forEach(element=>{
       if(e.documento_n == element.documento_n){
        this.factura= element
        this.productosVendidos2=element.productosVendidos
       
       }
     })
     
 
     this.parametrizaciones.forEach(element=>{
      if(element.sucursal == this.factura.sucursal){
        this.parametrizacionSucu= element
        console.log("asigne "+JSON.stringify(this.parametrizacionSucu))
      }
    })
     this.tDocumento="NOTA DE VENTA 001"
     this.crearPDF2(e)
     //this.mostrarDatos()
   }
 
 
   //cargar Cotizacion
   cargarCotización(e){
     this.cotizaciones.forEach(element=>{
       if(e.documento_n == element.documento_n){
        this.factura= element
       }
     })
     this.limpiarArregloPFact()
     this.productosVendidos.forEach(element=>{
       if(element.factura_id== e.documento_n && element.tipoDocumentoVenta=="Cotización"){
        this.productosVendidos2.push(element)
       }
     })
     this.tDocumento="PROFORMA 000 001"
     this.crearPDF2(e)
     //this.mostrarDatos()
   }

   crearPDF2(e){
    var tipoDoc:boolean=false
      if(this.tDocumento == "Factura"){
          const documentDefinition = this.getDocumentDefinition2();
          pdfMake.createPdf(documentDefinition).download('Factura '+e.documento_n, function(response) { });
      }else if(this.tDocumento == "NOTA DE VENTA 001"){
        const documentDefinition = this.getDocumentDefinitionNotaVenta();
        pdfMake.createPdf(documentDefinition).download('Nota de Venta '+e.documento_n, function(response) { });
    }else if(this.tDocumento == "PROFORMA 000 001"){
      const documentDefinition = this.getDocumentDefinitionCotizacion();
      pdfMake.createPdf(documentDefinition).download('Proforma '+e.documento_n, function(response) { });
  }
  }

  limpiarArregloPFact(){
    var cont=0
    this.productosVendidos2.forEach(element=>{
      cont++
    })
    console.log("mostrando antes"+this.productosVendidos2.length)
    if(cont>=0){
      this.productosVendidos2.forEach(element=>{
        this.productosVendidos2.splice(0)
      })
    }
  }

  onExporting (e) {
    e.component.beginUpdate();
    e.component.columnOption("cliente.ruc", "visible", true);
    e.component.columnOption("cotizacion", "visible", true);
    e.component.columnOption("tipo_venta", "visible", true);
    e.component.columnOption("tipo_cliente", "visible", true);
    e.component.columnOption("coste_transportea", "visible", true);
    e.component.columnOption("observaciones", "visible", true); 
  };
  onExported (e) {
    e.component.columnOption("cliente.ruc", "visible", false);
    e.component.columnOption("cotizacion", "visible", false);
    e.component.columnOption("tipo_venta", "visible", false);
    e.component.columnOption("tipo_cliente", "visible", false);
    e.component.columnOption("coste_transportea", "visible", false);
    e.component.columnOption("observaciones", "visible", false);
    e.component.endUpdate();
  }

  calcularValoresFactura(){
   this.subtotal1=(((this.factura.total+this.factura.coste_transporte)-this.factura.coste_transporte)/1.12)+this.factura.coste_transporte
   this.Sdescuento=this.factura.subtotalF1-this.factura.subtotalF2
   this.subtotal2=this.subtotal1-this.Sdescuento
   this.sIva0= this.factura.coste_transporte;
   this.sIva12=this.subtotal2-this.sIva0
   this.iva= this.sIva12*0.12
  }

  setearNFactura2(){
    let nf=this.factura.documento_n
    let num=('' + nf).length
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
          break;    
      default:
    }
   }




   getDocumentDefinition2() {
    this.setearNFactura2()
    this.calcularValoresFactura()
    sessionStorage.setItem('resume', JSON.stringify("jj"));
    let tipoDocumento="Factura";
    return {
      pageSize: 'A4',
      content: [
        {
          columns: [{
          image:this.imagenLogotipo,
          width: 100,
          margin: [0, 20, 0, 10],
          },
          {
            width:410,
            margin: [0, 20, 0, 10],
            text: "Fecha:   "+this.factura.fecha2,
            alignment:"right"
          },
          ]
          
          //alignment: 'center'
        }, {

     
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
           /*  {
              text: "Fecha de impresión: "+this.factura.fecha, fontSize:10
            }, */
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
              width:300,
              text: "FACTURA 001-001-000 ",
              bold: true,
              fontSize: 20,
            },
            {
              width:215,
              text: "NO "+this.numeroFactura,
              color: 'red',
              bold: true,
              fontSize: 20,
              alignment:"right"
            },
            ]
            },
            {
              columns: [{
              width:300,
              text: "Fecha de Autorización "+this.parametrizacionSucu.fecha,
            },
            {
              width:215,
              text: "Vendedor: "+this.factura.username,
              alignment:"right"
            },
            ]
            
            },{
            //Desde aqui comienza los datos del cliente
            style: 'tableExample',
            table: {
              widths: [100,395],
              body: [
                [
                  {
                    stack: [
                      {
                        type: 'none',
                        bold: true,
                        ul: [
                          'Cliente',
                          'Contacto',
                          "Dirección",
                          "Teléfonos"
                        ]
                      }
                    ]
                  },
                  [{
                    stack: [
                      {
                        type: 'none',
                        ul: [
                          ''+this.factura.cliente.cliente_nombre,
                          ''+this.factura.cliente.direccion,
                          ''+this.factura.cliente.direccion,
                          ''+this.factura.cliente.celular,
                        ]
                      }
                    ]
                  },
                  ],
                 
                ]
              ]
            }
            },

            //aqui termina
            
            
            
            ],
            [
              
            ]
          ]
        },
       
        
        this.getProductosVendidos(this.productosVendidos2),
        {
          //espacio en blanco despues de detalle de productos
          text: " ",
        },
        {
          text:"Otros valores",
          style: 'texto6'
        },
        this.getOtrosValores(),
  
  
        {
          //absolutePosition: {x: 40, y: 600},
          columns: [{

            type: 'none',
            ul: [
                  {
                    style: 'tableExample2',
                    table: {
                      widths: [250],
                      heights:70,
                      body: [
                        [
                          {text: 'Observaciones: '+this.factura.observaciones+ " / "},
                        ]
                      ]
                    },

                  },{
                    style: 'tableExample3',
                  
                    table: {
                      widths: ["*"],
                      heights:40,
                      body: [
                        [
                          {
                            stack: [
                              {
                                type: 'none',
                                
                                fontSize: 8,
                                ul: [
                                  'Nota: despues de 30 dias no se aceptan reclamos ni devoluciones',
                                  ' ',
                                  ' ',
                                  ' ',
                                  {text:'Firma de recibo a conformidad' , alignment:'center'}
                                ]
                              }
                            ]
                          }
                        ]
                      ]
                    },

                  }
            ]
            
            
        },
        {
          //Desde aqui comienza los datos del cliente
          style: 'tableExample',
         
          table: {
            widths: [125,100],
            body: [
              [ { text: 'Subtotal', bold: true ,style: "detalleTotales"}, {text: this.factura.subtotalF1.toFixed(2), style:"totales" }],
              [ { text: 'Otros descuentos', bold: true ,style: "detalleTotales"}, {text:this.Sdescuento.toFixed(2), style:"totales" } ],
              [ { text: 'Subtotal', bold: true, style: "detalleTotales" }, {text: this.factura.subtotalF2.toFixed(2), style:"totales" } ],
              [ { text: 'Tarifa 0', bold: true , style: "detalleTotales" }, {text:this.sIva0.toFixed(2), style:"totales" } ],
              [ { text: 'Tarifa 12', bold: true ,style: "detalleTotales"}, {text: this.factura.subtotalF2.toFixed(2) , style:"totales" }],
              [ { text: '12% IVA', bold: true ,style: "detalleTotales"}, {text: this.factura.totalIva.toFixed(2), style:"totales" } ],
              [ { text: 'Total', bold: true, style: "detalleTotales" }, {text:this.factura.total.toFixed(2), style:"totales" } ]
            ]
          }
          },
        ]
        },
        this.getDatosFooter(),
       
        
      ],
      footer: function (currentPage, pageCount) {
        return {
          table: {
            body: [
              
              [{text: 'ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL ', alignment: 'center', style:"textFot"}],
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



  getDocumentDefinitionNotaVenta() {

    this.setearNFactura2()
    this.calcularValoresFactura()
    sessionStorage.setItem('resume', JSON.stringify("jj"));
    let tipoDocumento="Factura";
    return {
      pageSize: 'A4',
      content: [
        {
          columns: [{
          image:this.imagenLogotipo,
          width: 100,
          margin: [0, 20, 0, 10],
          },
          {
            width:410,
            margin: [0, 20, 0, 10],
            text: "Fecha:   "+this.factura.fecha2,
            alignment:"right"
          },
          ]
          
          //alignment: 'center'
        }, {
    
        },
        
        {
          columns: [
            
            [
            /* {
              text: "Fecha de impresión: "+this.factura.fecha, fontSize:10
            }, */
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
              columns: [{
              width:300,
              text: " "+this.tDocumento,
              bold: true,
              fontSize: 20,
            },
            {
              width:215,
              text: "NO "+this.numeroFactura,
              color: 'red',
              bold: true,
              fontSize: 20,
              alignment:"right"
            },
            ]
            },
            {
              columns: [{
              width:300,
              text: "Fecha de Autorización "+this.parametrizacionSucu.fecha,
            },
            {
              width:215,
              text: "Vendedor: "+this.factura.username,
              alignment:"right"
            },
            ]
            
            },{
            //Desde aqui comienza los datos del cliente
            style: 'tableExample',
            table: {
              widths: [100,395],
              body: [
                [
                  {
                    stack: [
                      {
                        type: 'none',
                        bold: true,
                        ul: [
                          'Cliente',
                          'Contacto',
                          "Dirección",
                          "Teléfonos"
                        ]
                      }
                    ]
                  },
                  [{
                    stack: [
                      {
                        type: 'none',
                        ul: [
                          ''+this.factura.cliente.cliente_nombre,
                          ''+this.factura.cliente.direccion,
                          ''+this.factura.cliente.direccion,
                          ''+this.factura.cliente.celular,
                        ]
                      }
                    ]
                  },
                  ],
                 
                ]
              ]
            }
            },

            //aqui termina
            
            
            
            ],
            [
              
            ]
          ]
        },
       
        
        this.getProductosVendidos(this.productosVendidos2),
        {
          //espacio en blanco despues de detalle de productos
          text: " ",
        },
        {
          text:"Otros valores",
          style: 'texto6'
        },
        this.getOtrosValores(),
  
        {
          //absolutePosition: {x: 40, y: 600},
          columns: [{

            type: 'none',
            style: 'tableExample',
                    table: {
                      widths: [250],
                      heights:70,
                      body: [
                        [
                          {text: 'Observaciones:  ' +this.factura.observaciones+ " / "
                        },
                        ]
                      ]
                    },    
        },
        {
          //Desde aqui comienza los datos del cliente
          style: 'tableExample4',
         
          table: {
            widths: [125,100],
            body: [
              [ { text: 'Valor', bold: true ,style: "detalleTotales"}, {text:this.subtotal1.toFixed(2), style:"totales" }],
              [ { text: 'Otros descuentos', bold: true ,style: "detalleTotales"}, {text:this.Sdescuento.toFixed(2), style:"totales" } ],
              [ { text: 'Subtotal', bold: true, style: "detalleTotales" }, {text:this.subtotal2.toFixed(2), style:"totales" } ],
              [ { text: 'Total', bold: true, style: "detalleTotales" }, {text:this.factura.total.toFixed(2), style:"totales" } ]
            ]
          }
          },
        ]
        },
        this.getDatosFooter(),
       
        
      ],
      footer: function (currentPage, pageCount) {
        return {
          table: {
            body: [
              
              [{text: 'ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL ', alignment: 'center', style:"textFot"}],
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
          texto6: {
            fontSize: 14,
            bold: true,
            alignment: "center"
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
            margin: [10, 5, 0, 15]
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
  getDatosFooter() {
    return {
      table: {
        widths: ["*"],         
        alignment:'center',
        body: [
          
          [{
            text: 'Matriz Principal: Milagro, Avenida Juan Montalvo entre seminario y Olmedo 13 ',
            style: 'fondoFooter',
            alignment: 'center',
            border: [false, true, false, false]
          },    
          ], [{
            text: 'Celular 0997945089, 0986951573, Sucursal Triunfo: Avenida 8 de abril, via Bucay',
            style: 'fondoFooter',
            alignment: 'center',
            border: [false, false, false, false]
          },    
          ], [{
            text: 'Telefono 04-2011018, correo juanforerod@gmail.com',
            style: 'fondoFooter',
            alignment: 'center',
            border: [false, false, false, true]
          },    
          ],    
        ],
      },	
      fillColor: "#eeeeee",    
    };
  }


  getOtrosValores() {
    return {
      table: {
        widths: ["80%","20%"],
        alignment:'center',
        body: [
          
          [{
            text: 'Descripción',
            style: 'tableHeader2',
            alignment: 'center'
          },
          {
            text: 'Total',
            style: 'tableHeader2',
            alignment: 'center'
          },
          ],
          [{
            text: "Transporte",
            alignment: 'center'
          },
          {
            text: ' '+this.factura.coste_transporte,
           
            alignment: 'center'
          },
          ],
          
        ]
      }
    };
  }


  getProductosVendidos(productos: venta[]){
    let productos2:venta[]=[]
    productos.forEach(element=>{
      if(element.entregar==true)
          element.tipoDocumentoVenta="E"
      else
        element.tipoDocumentoVenta="P"
      
      productos2.push(element)
    })
    return {
      table: {
        widths: ["8%","6%","50%","9%","10%","13%","4%"],
        alignment:'center',
        body: [
          
          [{
            text: 'Cant.',
            style: 'tableHeader2',
            alignment: 'center'
          },
          {
            text: 'Unid.',
            style: 'tableHeader2',
            alignment: 'center'
          },
          {
            text: 'Producto',
            style: 'tableHeader2',
            alignment: 'center'
          },
          {
            text: 'V/Unid',
            style: 'tableHeader2'
            , alignment: 'center'
          },
          {
            text: 'Dscto(%)',
            style: 'tableHeader2'
            , alignment: 'center'
          },
          {
            text: 'Total',
            style: 'tableHeader2'
            , alignment: 'center'
          },
          
          {
            text: 'Est',
            style: 'tableHeader', 
            alignment: 'center'
          }
          ],
          
          ...productos2.map(ed =>{
            return [ { text: ed.cantidad, alignment: 'center' },{text:ed.producto.UNIDAD,fontSize:8,alignment:"center"},ed.producto.PRODUCTO, {text:ed.precio_venta.toFixed(2), alignment:"center"}, {text:ed.descuento, alignment:"center"}, {text:ed.total.toFixed(2), alignment:"right",style:"totales2"},
            {text:ed.tipoDocumentoVenta, alignment:"center",style:"totales2"}];
            
          }),
        ]
      }
    };
  }



   getDocumentDefinitionCotizacion() {
    this.setearNFactura2()
    this.calcularValoresFactura()
    sessionStorage.setItem('resume', JSON.stringify("jj"));
    let tipoDocumento="Factura";
    return {
      pageSize: 'A4',
      content: [
        {
          columns: [{
          image:this.imagenLogotipo,
          width: 100,
          margin: [0, 20, 0, 10],
          },
          {
            width:410,
            margin: [0, 20, 0, 10],
            text: "Fecha:   "+this.factura.fecha2,
            alignment:"right"
          },
          ]
          
          //alignment: 'center'
        }, {
    
        },
        
        {
          columns: [
            
            [
            /* {
              text: "Fecha de impresión: "+this.factura.fecha, fontSize:10
            }, */
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
              columns: [{
              width:300,
              text: " "+this.tDocumento,
              bold: true,
              fontSize: 20,
            },
            {
              width:215,
              text: "NO "+this.numeroFactura,
              color: 'red',
              bold: true,
              fontSize: 20,
              alignment:"right"
            },
            ]
            },
            {
              columns: [{
              width:300,
              text: "Fecha de Autorización "+this.parametrizacionSucu.fecha,
            },
            {
              width:215,
              text: "Vendedor: "+this.factura.username,
              alignment:"right"
            },
            ]
            
            },{
            //Desde aqui comienza los datos del cliente
            style: 'tableExample',
            table: {
              widths: [100,395],
              body: [
                [
                  {
                    stack: [
                      {
                        type: 'none',
                        bold: true,
                        ul: [
                          'Cliente',
                          'Contacto',
                          "Dirección",
                          "Teléfonos",
                          "Fecha/Cad"
                        ]
                      }
                    ]
                  },
                  [{
                    stack: [
                      {
                        type: 'none',
                        ul: [
                          ''+this.factura.cliente.cliente_nombre,
                          ''+this.factura.cliente.direccion,
                          ''+this.factura.cliente.direccion,
                          ''+this.factura.cliente.celular,
                          ''+this.factura.fecha2,
                        ]
                      }
                    ]
                  },
                  ],
                 
                ]
              ]
            }
            },

            //aqui termina
            
            
            
            ],
            [
              
            ]
          ]
        },
       
        
        this.getProductosVendidosCotizacion(this.productosVendidos2),
        {
          //espacio en blanco despues de detalle de productos
          text: " ",
        },
        {
          text:"Otros valores",
          style: 'texto6'
        },
        this.getOtrosValores(),
  
        {
          //absolutePosition: {x: 40, y: 600},
          columns: [{

            type: 'none',
            style: 'tableExample',
                    table: {
                      widths: [250],
                      heights:70,
                      body: [
                        [
                          {text: 'Observaciones:  ' +this.factura.observaciones+ " / "},
                        ]
                      ]
                    },    
        },
        {
          //Desde aqui comienza los datos del cliente
          style: 'tableExample4',
         
          table: {
            widths: [125,100],
            body: [
              [ { text: 'Valor', bold: true ,style: "detalleTotales"}, {text:this.subtotal1.toFixed(2), style:"totales" }],
              [ { text: 'Otros descuentos', bold: true ,style: "detalleTotales"}, {text:this.Sdescuento.toFixed(2), style:"totales" } ],
              [ { text: 'Subtotal', bold: true, style: "detalleTotales" }, {text:this.subtotal2.toFixed(2), style:"totales" } ],
              [ { text: 'Total', bold: true, style: "detalleTotales" }, {text:this.factura.total.toFixed(2), style:"totales" } ]
            ]
          }
          },
        ]
        },
        this.getDatosFooter(),
       
        
      ],
      footer: function (currentPage, pageCount) {
        return {
          table: {
            body: [
              
              [{text: 'ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL ', alignment: 'center', style:"textFot"}],
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
          texto6: {
            fontSize: 14,
            bold: true,
            alignment: "center"
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
            margin: [10, 5, 0, 15]
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


  getProductosVendidosCotizacion(productos: venta[]) {
    return {
      table: {
        widths: ["8%","6%","54%","10%","9%","13%"],
        alignment:'center',
        body: [
          
          [{
            text: 'Cant.',
            style: 'tableHeader2',
            alignment: 'center'
          },
          {
            text: 'Unid.',
            style: 'tableHeader2',
            alignment: 'center'
          },
          {
            text: 'Producto',
            style: 'tableHeader2',
            alignment: 'center'
          },
          {
            text: 'V/Unid',
            style: 'tableHeader2'
            , alignment: 'center'
          },
          {
            text: 'Dscto(%)',
            style: 'tableHeader2'
            , alignment: 'center'
          },
          {
            text: 'Total',
            style: 'tableHeader2'
            , alignment: 'center'
          },
          
          /* {
            text: 'Est',
            style: 'tableHeader'
          }, */
          ],
          
          ...productos.map(ed =>{
            return [ { text: ed.cantidad, alignment: 'center' },{text:ed.producto.UNIDAD,fontSize:8,alignment:"center"},ed.producto.nombre_comercial, {text:ed.precio_venta.toFixed(2), alignment:"center"}, {text:ed.descuento, alignment:"center"}, {text:ed.total.toFixed(2), alignment:"right",style:"totales2"}];
            
          }),
          /* [
            { text: " -- ", alignment: 'center' }, "Servicios de Transporte", { text: " -- ", alignment: 'center' }, { text: " -- ", alignment: 'center' }, {text:this.factura.coste_transporte.toFixed(2), alignment:"right",style:"totales2"} 
          ] */
          
        ]
      }
    };
  }

  validarEliminacionNotaVenta(e){
    var reciboCaja = new ReciboCaja();
    reciboCaja.numDocumento = e.documento_n
    reciboCaja.docVenta = "Nota de Venta"
    reciboCaja.sucursal = e.sucursal
    this.mostrarLoading = true;
    this._reciboCajaService.getReciboCajaPorNumeroDocumento(reciboCaja).subscribe((res) => {
      this.mostrarLoading = false;
      var recibos = res as ReciboCaja[];
      if(recibos?.length == 0)
        this.actualizarNotV(e);
      else
        this.mostrarMensajeGenerico(2,"Hay Recibos de Caja vinculados a esta Nota de Venta, primero eliminelos y vuelva a intentar nuevamente")
    }); 
  }

  actualizarNotV(e){
    Swal.fire({
      title: 'Nota de venta #'+e.documento_n,
      text: "Motivo de anulación",
      icon: 'warning',
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'No'
    }).then((result) => {
        if (result.value) {
        //this.db.collection('/notas_venta').doc(e.documento_n+"").update({"estado":"PENDIENTE"}).then(res => {  }, err => alert(err));  
        this.notasventaService.updateNotasVentaEstadoAnulación(e,"PENDIENTE",result.value).subscribe(
          res => {
            console.log(res + "entre por si");this.coorecto()
          },err => {alert("error")})
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  coorecto(){
    Swal.fire({
      title: 'Correcto',
      text: 'Un administrador aprobará su solicitud',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }


  validarEliminacionFactura(e){
    var reciboCaja = new ReciboCaja();
    reciboCaja.numDocumento = e.documento_n
    reciboCaja.docVenta = "Factura"
    reciboCaja.sucursal = e.sucursal
    this.mostrarLoading = true;
    this._reciboCajaService.getReciboCajaPorNumeroDocumento(reciboCaja).subscribe((res) => {
      this.mostrarLoading = false;
      var recibos = res as ReciboCaja[];
      if(recibos?.length == 0)
        this.actualizarFact(e);
      else
        this.mostrarMensajeGenerico(2,"Hay Recibos de Caja vinculados a esta Factura, primero eliminelos y vuelva a intentar nuevamente")
    }); 
  }

  actualizarFact(e){
    Swal.fire({
      title: 'Factura #'+e.documento_n,
      text: "Motivo de anulación",
      icon: 'warning',
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'No'
    }).then((result) => {
        if (result.value) {
        this.facturasService.updateFacturasEstadoAnulacion(e,"PENDIENTE",result.value).subscribe(
          res => { this.coorecto()},
          err => {alert("error")})
       
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  rechazarFactAnu(e){
    Swal.fire({
      title: 'Rechazar Anulación',
      text: "Anular rechazo de factura #"+e.documento_n,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) { 
        this.facturasService.updateFacturasEstado(e,"CONTABILIZADA").subscribe(
          res => {
            this.coorecto()
          },err => {alert("error")})
       
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  rechazarNotAnu(e){
    Swal.fire({
      title: 'Rechazar Anulación',
      text: "Anular rechazo de factura #"+e.documento_n,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) { 
        this.notasventaService.updateNotasVentaEstado(e,"CONTABILIZADA").subscribe(
          res => {
            console.log(res + "entre por si");this.coorecto()
          },err => {alert("error")})
       
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }


  mensajeConf(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se realizó su proceso con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }


  validarTransaccionesFactura(e){
    this.busquedaTransaccion = new tipoBusquedaTransaccion()
    this.busquedaTransaccion.NumDocumento = e.documento_n+""
    this.busquedaTransaccion.tipoTransaccion = "venta-fact"
    this.transaccionesService.getTransaccionesPorTipoDocumento(this.busquedaTransaccion).subscribe(res => {
      this.transacciones = res as transaccion[];
      if(this.transacciones.length == 0){
          Swal.fire({
            title: 'Error',
            text: "No se encontraron transacciones para esta orden",
            icon: 'error'
          })
      }else{
        this.eliminarFact(e)
      }
    })
  }


  validarTransaccionesNotaVenta(e){
    this.busquedaTransaccion = new tipoBusquedaTransaccion()
    this.busquedaTransaccion.NumDocumento = e.documento_n+""
    this.busquedaTransaccion.tipoTransaccion = "venta-not"
    this.transaccionesService.getTransaccionesPorTipoDocumento(this.busquedaTransaccion).subscribe(res => {
      this.transacciones = res as transaccion[];
      if(this.transacciones.length == 0){
          Swal.fire({
            title: 'Error',
            text: "No se encontraron transacciones para esta orden",
            icon: 'error'
          })
      }else{
        this.eliminarNot(e)
      }
    })
  }
  
  eliminarFact(fact: factura){
    Swal.fire({
      title: 'Eliminar Factura',
      text: "Eliminar factura #"+fact.documento_n,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.mostrarMensaje()
        var fecha = new Date(fact.fecha)
        fecha.setHours(0,0,0,0);
        fact.fecha = fecha
        this._cajaMenorService.getCajaMenorPorFecha(fact).subscribe(
          res => {
          var listaCaja = res as CajaMenor[];
            if(listaCaja.length != 0 ){
              var caja = listaCaja.find(element=>element.sucursal == fact.sucursal) ;
              if(caja != undefined){
                if(caja.sucursal == fact.sucursal && caja.estado == "Cerrada" ){
                  Swal.close();
                  Swal.fire( "Atención","No puede anular el documento la caja menor se encuentra cerrada",'error')
                }
                else
                  this.seguirEliminando(fact)
              }else 
                this.seguirEliminando(fact)
            }else
              this.seguirEliminando(fact)
          },
          (err) => {});
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado!', 'Se ha cancelado su proceso.','error')
      }
    })
  }


 
  seguirEliminando(fact : factura){
    var obs= fact.observaciones + ".. Documento Anulado"  
    fact.observaciones= obs
    this.facturasService.updateFacturasEstado2(fact,"ANULADA").subscribe(
      res => { this.anularCuentasPorCobrar(fact)},
      err => { alert("error")})
  }

  anularCuentasPorCobrar(fact : factura){
    this.eliminarTransacciones();
    var docData = new dataDocumento();
    docData.rucCliente = fact.dni_comprador;
    this._cuentaPorCobrarService.getCuentasXCobrarPorRUC(docData).subscribe(res => {
      var cuentas = res as CuentaPorCobrar[];
      var listado = cuentas?.filter(x=> x.documentoVenta == fact.documento_n.toString())
      if(listado.length == 0){
        this.eliminarTransaccionesFinancieras(fact)
      }else{
        listado.forEach(element=>{
          this._cuentaPorCobrarService.updateEstadoCuenta(element,"Anulado").subscribe(
          res => { 
            this.eliminarTransaccionesFinancieras(fact)},
          err => { 
            this.mostrarLoading = false; 
            this.mostrarMensajeGenerico(2,"Error al actualizar estado")})
        })   
      }
    });
  }


  eliminarTransaccionesFinancieras(fact:factura){
    this.busquedaTransaccion = new tipoBusquedaTransaccion()
    this.busquedaTransaccion.NumDocumento = fact.documento_n.toString();
    this.busquedaTransaccion.tipoTransaccion = "recibo-caja"
    this._transaccionesFinancierasService.obtenerTransaccionesPorDocumentoYRecibo2(this.busquedaTransaccion).subscribe(res => {
      var cuentas = res as TransaccionesFinancieras[];
      var listado = cuentas?.filter(x=> x.cliente == fact.cliente.cliente_nombre)
      console.log(listado)
      if(listado.length == 0){
        this.mostrarLoading = false;
        this.mostrarMensajeGenerico(1,"Su proceso se realizó correctamente")
      }else{
        var cont = 0;
        listado.forEach(element=>{
          this._transaccionesFinancierasService.deleteTransaccionFinanciera(element).subscribe(
          res => { 
            cont++;
            if(cont == listado.length){
              this.mostrarLoading = false; 
              this.mostrarMensajeGenerico(1,"Su proceso se realizó correctamente")
            }
            },
          err => { 
            this.mostrarLoading = false; 
            this.mostrarMensajeGenerico(2,"Error al actualizar estado")})
        })   
      }
    });
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

  eliminarNot(e){
     Swal.fire({
      title: 'Eliminar Nota Venta',
      text: "Eliminar nota de venta #"+e.documento_n,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) { 
    
        this.mostrarMensaje()
        //this.db.collection('/notas_venta').doc(e.documento_n+"").update({"estado":"ELIMINADA"}).then(res => { this.actualizarProductos2(e)}, err => alert(err));  
        var obs= e.observaciones + "... Documento Anulado" 
        e.observaciones= obs
        this.notasventaService.updateNotasVentaEstado2(e,"ANULADA").subscribe(
          res => {
            console.log(res + "entre por si");this.actualizarProductos2(e)
          },err => {alert("error")})
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  
  eliminarTransacciones(){
    this.transacciones.forEach(element=>{
      //if(element.documento== num+"" && element.tipo_transaccion=="venta-fact"){
        this.transaccionesService.deleteTransaccion(element).subscribe( res => {console.log(res + "termine1");}, err => {alert("error")})
      //}
    })
   }

  eliminarTransacciones2(num:number){
    this.transacciones.forEach(element=>{
      if(element.documento== num+"" && element.tipo_transaccion=="venta-not"){
        this.transaccionesService.deleteTransaccion(element).subscribe( res => {console.log(res + "termine1");}, err => {alert("error")})
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

  actualizarProductos(e){  
    //his.eliminarTransacciones(e.documento_n)
    var sumaProductos =0
    var num1:number=0
    var num2:number=0
    var num3:number=0
    var cont2ing=0
    var contIng:number=0
    var entre:boolean=true     
    this.facturas.forEach(element=>{
      if(e.documento_n== element.documento_n)
        this.productosVendidos2=element.productosVendidos
    })

      new Promise<any>((resolve, reject) => {
        this.productosVendidos2.forEach(element=>{
          this.productos.forEach(elemento1=>{
            if(elemento1.PRODUCTO == element.producto.PRODUCTO){
             // contIng=0
             switch (e.sucursal) {
              case "matriz":
                num1=parseInt(element.cantidad.toFixed(0))
                num2=elemento1.sucursal1
                sumaProductos = Number(num2)+Number(num1)
                console.log("entre por aqui a sumar "+ sumaProductos + "de "+element.producto.PRODUCTO)
                break;
              case "sucursal1":
                num1=parseInt(element.cantidad.toFixed(0))
                num2=elemento1.sucursal2
                sumaProductos =Number(num2)+Number(num1)
                break;
              case "sucursal2":
                num1=parseInt(element.cantidad.toFixed(0))
                num2=elemento1.sucursal3
                sumaProductos =Number(num2)+Number(num1)
                  break;
              default:
            }
            }
         })
         if(entre){
          switch (e.sucursal) {
            case "matriz":
              //this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal1" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err)); 
              element.producto.sucursal1=sumaProductos
              this.productoService.updateProductoSucursal1(element.producto).subscribe( res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => {alert("error")})
              break;
            case "sucursal1":
              //this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal2" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));
              element.producto.sucursal2=sumaProductos
              this.productoService.updateProductoSucursal2(element.producto).subscribe( res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => {alert("error")})
              break;
            case "sucursal2":
              //this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal3" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));
              element.producto.sucursal3=sumaProductos
              this.productoService.updateProductoSucursal3(element.producto).subscribe( res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => {alert("error")})
              break;
            default: 
          
          //his.db.collection('/productos').doc(element.producto.PRODUCTO).update({"cantidad" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));   
         }
        }
        })
      })
       
    }

    actualizarProductos2(e){  
      this.eliminarTransacciones2(e.documento_n)
      console.log("entre a actualizar")
       var sumaProductos =0
       var num1:number=0
       var num2:number=0
       var num3:number=0
       var cont2ing=0
        var contIng:number=0
        var entre:boolean=true     
        this.notasVenta.forEach(element=>{
          if(e._id == element._id){
              this.productosVendidos2 = element.productosVendidos
          }
        })

        new Promise<any>((resolve, reject) => {
          this.productosVendidos2.forEach(element=>{
            this.productos.forEach(elemento1=>{
              if(elemento1.PRODUCTO == element.producto.PRODUCTO){
               switch (e.sucursal) {
                case "matriz":
                  num1=parseInt(element.cantidad.toFixed(0))
                  num2=elemento1.sucursal1
                  sumaProductos = Number(num2)+Number(num1)
                  console.log("entre por aqui a sumar "+ sumaProductos + "de "+element.producto.PRODUCTO)
                  break;
                case "sucursal1":
                  num1=parseInt(element.cantidad.toFixed(0))
                  num2=elemento1.sucursal2
                  sumaProductos =Number(num2)+Number(num1)
                  break;
                case "sucursal2":
                  num1=parseInt(element.cantidad.toFixed(0))
                  num2=elemento1.sucursal3
                  sumaProductos =Number(num2)+Number(num1)
                    break;
                default:
              }
              }
           })
           if(entre){
            switch (e.sucursal) {
              case "matriz":
                //this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal1" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err)); 
                element.producto.sucursal1=sumaProductos
              this.productoService.updateProductoSucursal1(element.producto).subscribe( res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => {alert("error")})
                break;
              case "sucursal1":
                //this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal2" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));
                element.producto.sucursal2=sumaProductos
              this.productoService.updateProductoSucursal2(element.producto).subscribe( res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => {alert("error")})
                break;
              case "sucursal2":
                //this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal3" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));
                element.producto.sucursal3=sumaProductos
              this.productoService.updateProductoSucursal3(element.producto).subscribe( res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => {alert("error")})
                break;
              default: 
            }
          }
          })
        })
         
      }

    contadorValidaciones2(i:number){
      if(this.productosVendidos2.length==i){
          console.log("recien termine")
          Swal.close()
          Swal.fire({
            title: 'Factura Eliminada',
            text: 'Se ha guardado con éxito',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            window.location.reload()
          })
      }
    }
   

  actualizarOrdenRec2(e){
    Swal.fire({
      title: 'Anular Orden',
      text: "Se anulará la orden #"+e.n_orden,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        if(e.tipo == "Entregado"){
          this.compararCantidades(e)
        }else{
            this.ordenesService.updateEstadosOrdenes(e._id,"Aprobado","ANULADO").subscribe( res => {Swal.fire({
              title: 'Correcto',
              text: 'Se anuló con éxito',
              icon: 'success',
              confirmButtonText: 'Ok'
            }).then((result) => {
              window.location.reload()
            })}, err => {alert("error")}) 
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


  actualizarOrdenDirecta(e){
    Swal.fire({
      title: 'Anular Orden',
      text: "Se anulará la orden directa #"+e.n_orden,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        if(e.tipo == "Entregado"){
          this.compararCantidades(e)
        }else{
            this.ordenesService.updateEstadosOrdenes(e._id,"Aprobado","ANULADO").subscribe( res => {Swal.fire({
              title: 'Correcto',
              text: 'Se anuló con éxito',
              icon: 'success',
              confirmButtonText: 'Ok'
            }).then((result) => {
              window.location.reload()
            })}, err => {alert("error")}) 
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



  compararCantidades(e:any){
    this.busquedaTransaccion = new tipoBusquedaTransaccion()
    this.busquedaTransaccion.NumDocumento = e.documento+""
    this.busquedaTransaccion.tipoTransaccion = "compra-dir"
    this.transaccionesService.getTransaccionesPorTipoDocumento(this.busquedaTransaccion).subscribe(res => {
          this.transacciones = res as transaccion[];

          if(this.transacciones.length == 0){
             Swal.fire({
                title: 'Error',
                text: "No se encontraron transacciones para esta orden",
                icon: 'error'
             })
          }else{
           this.continuarAnulacionCompraDirecta(e)
          }
    })
  }

  continuarAnulacionCompraDirecta(e:any){
     var cont=0
     var contVal=0
      
      this.ordenesCompraDirectasPendientesAnulacion.forEach(element=>{
        if(e.documento== element.documento){
          this.productosComprados2=element.productosComprados
        }
      })
    
    var suma=0
    var contIn=0
    this.productosComprados2.forEach(element=>{
      this.productos.forEach(element2=>{
        if(element.nombreComercial.PRODUCTO == element2.PRODUCTO){
          suma=element.cantidad
          switch (e.sucursal.nombre) {
            case "matriz":
              if(suma>element2.sucursal1){
                contIn++
              }
              break;
            case "sucursal1":
              if(suma>element2.sucursal2){
                contIn++
              }
              break;
            case "sucursal2":
              if(suma>element2.sucursal3){
                contIn++
              }
                break;
            default:
          }
         
        }
      })
    })

    //if(contIn==0){
      this.mostrarMensaje()
      this.ordenesService.updateEstadosOrdenes(e._id,"Aprobado","ANULADO").subscribe( res => {this.actualizarProductos3(e)}, err => {alert("error")})
   /*  }else{
      Swal.fire({
        title: 'Error',
        text: "No hay inventario suficiente para realizar la anulación",
        icon: 'error'
      })
    } */
  }

  verFacturas(e){
    var contador=0
    this.facturasProveedor.forEach(element=>{
      if(element.nSolicitud == e.n_orden){
        contador++
      }
    })

    if(contador == 0){
      this.actualizarOrdenRec(e)
    }else{
      Swal.fire({
        title: 'Error',
        text: "La orden de compra tiene facturas asociadas",
        icon: 'error'
      })
    }
  }


  actualizarOrdenRec(e){
    Swal.fire({
      title: 'Orden #'+e.n_orden,
      text: "Motivo de anulación",
      icon: 'warning',
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        var num:string
        num=e.documento+""
        new Promise<any>((resolve, reject) => {
         this.ordenesService.updateOrdenEstadoRechazo2(e._id,"Aprobado",result.value,"Pendiente-Anulacion").subscribe( res => {this.confirmarM()}, err => {alert("error")})
        })
        

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

  confirmarM(){
    Swal.close()
    Swal.fire({
      title: 'Orden rechazada',
      text: 'Se envió su información',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
   
  }


  opcionMenu(e){
    switch (e.value) {
      case "Ordenes de Compra":
        this.mostrarOrdenesCompraGenerales = true;
        this.mostrarOrdenesCompraDirectas = false;
        this.mostrarFacturas = false;
        this.mostrarNotasVenta = false;
        break;

      case "Ordenes de Compra Directas":
        this.mostrarOrdenesCompraGenerales = false;
        this.mostrarOrdenesCompraDirectas = true;
        this.mostrarFacturas = false;
        this.mostrarNotasVenta = false;
        break;

      case "Facturas":
        this.mostrarOrdenesCompraGenerales = false;
        this.mostrarOrdenesCompraDirectas = false;
        this.mostrarFacturas = true;
        this.mostrarNotasVenta = false;
        break;

      case "Notas de Venta":
        this.mostrarOrdenesCompraGenerales = false;
        this.mostrarOrdenesCompraDirectas = false;
        this.mostrarFacturas = false;
        this.mostrarNotasVenta = true;
        break;
      default:    
    }       
  }


  cargarOrdenCompra(e: any){
    this.productosComprados2 = [];
    var orden_n=e.documento
    this.ordenesCompra.forEach(element=>{
      if(element.documento==orden_n){
         this.ordenDeCompra2 = element
         this.productosComprados2=element.productosComprados
         this.numOrden= element.documento
         if(element.n_orden>0)
          this.numOrden= element.n_orden
      }     
    })


    this.parametrizaciones.forEach(element=>{
      if(element.sucursal == this.ordenDeCompra2.sucursal.nombre){
        this.parametrizacionSucu= element
      }
    })
    this.cargarValoresFactura()
    this.crearPDF()

  }


  setearNFactura(){
    let nf=this.numOrden
    let num=('' + nf).length
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

crearPDF(){
  const documentDefinition = this.getDocumentDefinition();
  pdfMake.createPdf(documentDefinition).download('Orden/Compra '+this.numOrden, function() {  });
}

getDocumentDefinition() {
  this.setearNFactura()
  sessionStorage.setItem('resume', JSON.stringify("jj"));
  return {
    pageSize: 'A4',
    content: [
      {
         columns: [{
          image:this.imagenLogotipo,
          width: 100,
          margin: [0, 20, 0, 10],
          },
        {
          
          width:410,
          margin: [0, 20, 0, 10],
          text: "Fecha:   "+this.ordenDeCompra2.fecha,
          alignment:"right"
        },
        ]
      }, {

   
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
/*           {
            text: "Fecha de impresión: "+this.ordenDeCompra2.fecha, fontSize:10
          }, */
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
            width:300,
            text: "ORDEN / COMPRA 001-000",
            bold: true,
            fontSize: 20,
          },
          {
            width:215,
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
            widths: [130,365],
            body: [
              [
                {
                  stack: [
                    {
                      type: 'none',
                      bold: true,
                      ul: [
                        'Sucursal',
                        'Contacto',
                        "Fecha de entrega",
                        "Lugar de entrega",
                        "Usuario"
                      ]
                    }
                  ]
                },
                [{
                  stack: [
                    {
                      type: 'none',
                      ul: [
                        ''+this.ordenDeCompra2.sucursal.nombre,
                        ''+this.ordenDeCompra2.sucursal.contacto,
                        ''+this.ordenDeCompra2.fechaEntrega,
                        ''+this.ordenDeCompra2.lugarentrega,
                        ''+this.ordenDeCompra2.usuario,
                      ]
                    }
                  ]
                },
                ],
               
              ]
            ]
          }
          },

          //aqui termina{}
          {
            text:"Datos del Proveedor",alignment:"center",style:"textoPro"
          },
          {
            //Desde aqui comienza los datos del cliente
            style: 'tableExample',
            table: {
              widths: [130,365],
              body: [
                [
                  {
                    stack: [
                      {
                        type: 'none',
                        bold: true,
                        ul: [
                          'Proveedor',
                          'Contacto',
                          "Dirección",
                          "Teléfonos",
                          "Condición/Pago"
                        ],
                      },
                      
                    ]
                  },
                  [{
                    stack: [
                      {
                        type: 'none',
                        ul: [
                          ''+this.ordenDeCompra2.proveedor.nombre_proveedor,
                          ''+this.ordenDeCompra2.proveedor.contacto,
                          ''+this.ordenDeCompra2.proveedor.direccion,
                          ''+this.ordenDeCompra2.proveedor.celular,
                          ''+this.ordenDeCompra2.condpago,
                        ]
                      },
                    ]
                  },
                  ],
                 
                ]
              ]
            }
            },

            //aqui termina
          
          
          ],
          [
            
          ]
        ]
      },
     
      
      this.getProductosVendidos2(this.productosComprados2),
      {
        //espacio en blanco despues de detalle de productos
        text: " ",
      },
     
      {
        //absolutePosition: {x: 40, y: 600},
        columns: [{

          type: 'none',
          ul: [
                {
                  style: 'tableExample2',
                  table: {
                    widths: [250],
                    heights:105,
                    body: [
                      [
                        {text: 'Observaciones: '+this.ordenDeCompra2.observaciones},
                      ]
                    ]
                  },

                },{
                  style: 'tableExample3',
                
                  table: {
                    widths: ["*"],
                    heights:70,
                    body: [
                      [
                        {
                          stack: [
                            {
                              type: 'none',
                              
                              fontSize: 8,
                              ul: [
                                
                                ' ',
                                ' ',
                                ' ',
                                ' ',
                                ' ',
                                {text:'Firma de recibo a conformidad' , alignment:'center'}
                              ]
                            }
                          ]
                        }
                      ]
                    ]
                  },

                },
          ]
          
          
      },
      {
       
        style: 'tableExample',
       
        table: {
          widths: [125,100],
          body: [
            [ { text: 'Subtotal', bold: true ,style: "detalleTotales"}, {text:this.ordenDeCompra2.subtDetalles2.toFixed(2), style:"totales" }],
            [ { text: 'Descuento', bold: true ,style: "detalleTotales"}, {text:this.subtMenosDesc.toFixed(2), style:"totales" }],
            [ { text: 'Subt.Desc', bold: true ,style: "detalleTotales"}, {text:this.ordenDeCompra2.subtotalDetalles.toFixed(2), style:"totales" }],
            [ { text: 'Otros desc.(%)', bold: true , style: "detalleTotales" }, {text:this.ordenDeCompra2.otrosDescuentosGen +" %", style:"totales" } ],              
            [ { text: 'Otros Descuentos', bold: true ,style: "detalleTotales"}, {text:this.subtOtrsoDesc.toFixed(2) , style:"totales" }],
            [ { text: 'Subtotal 2', bold: true ,style: "detalleTotales"}, {text:this.subtotalGeneral2.toFixed(2), style:"totales" }],             
            [ { text: 'Costos Seguro', bold: true, style: "detalleTotales" }, {text:this.subtCostosGenerales.toFixed(2), style:"totales" } ],
            [ { text: 'Iva', bold: true ,style: "detalleTotales"}, {text:this.ordenDeCompra2.TotalIva.toFixed(2), style:"totales" } ],
            [ { text: 'Cost/Unit/Trans.', bold: true ,style: "detalleTotales"}, {text:this.ordenDeCompra2.costeUnitaTransport.toFixed(2), style:"totales" } ],
            [ { text: 'Total', bold: true, style: "detalleTotales" }, {text:this.ordenDeCompra2.total.toFixed(2), style:"totales" } ]
          ]
        }
        },
      ]
      },
      this.getDatosFooter2(),
     
      
    ],
    footer: function (currentPage, pageCount) {
      return {
        table: {
          body: [
            
            [{text: 'ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL ', alignment: 'center', style:"textFot"}],
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



getProductosVendidos2(productos: ProductoDetalleCompra[]) {
  return {
    table: {
      widths: ["10%","56%","10%","11%","13%"],
      alignment:'center',
      body: [
        
        [{
          text: 'Cantidad',
          style: 'tableHeader2',
          alignment: 'center'
        },
        {
          text: 'Producto',
          style: 'tableHeader2',
          alignment: 'center'
        },
        {
          text: 'V/Unid',
          style: 'tableHeader2'
          , alignment: 'center'
        },
        {
          text: 'Dscto(%)',
          style: 'tableHeader2'
          , alignment: 'center'
        },
        {
          text: 'Total',
          style: 'tableHeader2'
          , alignment: 'center'
        },
        
        /* {
          text: 'Est',
          style: 'tableHeader'
        }, */
        ],
        
        ...productos.map(ed =>{
          return [ { text: ed.cantidad, alignment: 'center' },ed.nombreComercial.PRODUCTO, {text:ed.precio_compra.toFixed(2), alignment:"center"}, {text:ed.desct, alignment:"center"}, {text:ed.total.toFixed(2), alignment:"right",style:"totales2"}];
          
        }),
        /* [
          { text: " -- ", alignment: 'center' }, "Servicios de Transporte", { text: " -- ", alignment: 'center' }, { text: " -- ", alignment: 'center' }, {text:this.factura.coste_transporte.toFixed(2), alignment:"right",style:"totales2"} 
        ] */
        
      ]
    }
  };
}


getOtrosValores2() {
  return {
    table: {
      widths: ["80%","20%"],
      alignment:'center',
      body: [
        
        [{
          text: 'Descripción',
          style: 'tableHeader2',
          alignment: 'center'
        },
        {
          text: 'Total',
          style: 'tableHeader2',
          alignment: 'center'
        },
        ],
        [{
          text: "Transporte",
          alignment: 'center'
        },
        {
          text: ' '+this.ordenDeCompra2.costeUnitaTransport,
         
          alignment: 'center'
        },
        ],
        
      ]
    }
  };
}



getDatosFooter2() {
  return {
    table: {
      widths: ["*"],         
      alignment:'center',
      body: [
        
        [{
          text: 'Matriz Principal: Milagro, Avenida Juan Montalvo entre seminario y Olmedo 13 ',
          style: 'fondoFooter',
          alignment: 'center',
          border: [false, true, false, false]
        },    
        ], [{
          text: 'Celular 0997945089, 0986951573, Sucursal Triunfo: Avenida 8 de abril, via Bucay',
          style: 'fondoFooter',
          alignment: 'center',
          border: [false, false, false, false]
        },    
        ], [{
          text: 'Telefono 04-2011018, correo juanforerod@gmail.com',
          style: 'fondoFooter',
          alignment: 'center',
          border: [false, false, false, true]
        },    
        ],    
      ],
    },	
    fillColor: "#eeeeee",    
  };
}


}
