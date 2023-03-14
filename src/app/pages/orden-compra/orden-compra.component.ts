import { Component, OnInit, Pipe, PipeTransform ,ViewChild} from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { OrdenDeCompra } from '../compras/compra';
import pdfMake from 'pdfmake/build/pdfmake';
import { ProductoDetalleCompra } from '../producto/producto';
import { FacturaProveedor, PagoProveedor,DetallePagoProveedor }  from './ordencompra';
import { Proveedor }  from '../compras/compra';
import Swal from 'sweetalert2';
import { DxListComponent} from 'devextreme-angular';
import { DatePipe } from '@angular/common';
import { objDate, transaccion } from '../transacciones/transacciones';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { TransaccionesService } from 'src/app/servicios/transacciones.service';
import { ProductosCompradosService } from 'src/app/servicios/productos-comprados.service';
import { OrdenesCompraService } from 'src/app/servicios/ordenes-compra.service';
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { CatalogoService } from 'src/app/servicios/catalogo.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { SucursalesService } from 'src/app/servicios/sucursales.service';
import { producto, contadoresDocumentos } from '../ventas/venta';
import { ProveedoresService } from 'src/app/servicios/proveedores.service';
import { AuthenService } from 'src/app/servicios/authen.service';
import { user } from '../user/user';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from 'src/app/shared/services';
import { FacturasProveedorService } from 'src/app/servicios/facturas-proveedor.service';
import { DatosConfiguracionService } from 'src/app/servicios/datosConfiguracion.service';

@Component({
  selector: 'app-orden-compra',
  templateUrl: './orden-compra.component.html',
  styleUrls: ['./orden-compra.component.scss']
})

export class OrdenCompraComponent implements OnInit {
  ordenesCompra: OrdenDeCompra[] = []
  ordenesCompraGenerales : OrdenDeCompra[] = []
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
  ordenesCompraDirectas: OrdenDeCompra[] = []
  ordenesCompraDirectas2: OrdenDeCompra[] = []
  ordenesCompraDirectasEl: OrdenDeCompra[] = []
  ordenesCompraDirectasRec: OrdenDeCompra[] = []
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
  mostrarLoading:boolean=true;
  mensajeLoading = "Cargando..."
  nombreDocumento = "Ordenes_Compra"

  imagenLogotipo = ""

  //Datos del pago a proveedor
  n_cheque:string
  fecha_transaccion:Date= new Date()
  fecha_factura: Date= new Date()
  nombre_banco: string
  n_cuenta:number
  fecha_pago: Date= new Date()
  valor:number=0
  beneficiario: string

  obj:objDate
  employees: ProductoDetalleCompra;
  proveedores:Proveedor[] = []
  parametrizaciones:parametrizacionsuc[]=[]
  parametrizacionSucu:parametrizacionsuc
  dato:number
  usuariologueado:string
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
  contadores:contadoresDocumentos[]
  mySimpleFormat 
  textoArea:string
  newButtonEnabled2:boolean = true
  NordenFact:number=0
  menu1: string[] = [
    "Consulta Mensual",
    "Consulta Global"
  ];

  nowdesde: Date = new Date();
  nowhasta: Date = new Date();

  tiposMenu: string[] = [
    'Solicitudes',
    'Rechazadas',
    'Aprobadas'
  ];

  tipoMenu = ""
  mostrarNroOrden = false;
  mostrarMotivoRechazo = false;
  mostrarTotal = true
  mostrarTipo = true
  mostrarOp1 = true
  mostrarFecha = false
  mostrarEstado = false
  mostrarNot = false

  numOrden:number=0
  selectionChangedBySelectbox: boolean;
  prefix: string;
  transaccion:transaccion
  opadmin:boolean=false
  number_transaccion:number=0
  productos:producto[]=[]
  correo:string
  usuarioLogueado:user
  selectedRows: string[];
  transacciones:transaccion[]=[]
  selectAllModeVlaue: string = "page";
  selectionModeValue: string = "all";
  contadorFirebase:contadoresDocumentos[]=[]
  @ViewChild('list', { static: false }) comprasForm: DxListComponent;
  @ViewChild('datag2') dataGrid2: DxDataGridComponent;

  constructor(private db: AngularFirestore,
    public authService: AuthService, public transaccionesService: TransaccionesService,public authenService:AuthenService, public productosCompradosService: ProductosCompradosService, public ordenesService: OrdenesCompraService,public proveedoresService:ProveedoresService, public parametrizacionService:ParametrizacionesService, public contadoresService: ContadoresDocumentosService, public catalogoService: CatalogoService, public productoService:ProductoService,
    public _configuracionService: DatosConfiguracionService,
    public _facturasProveedorService : FacturasProveedorService,
    public sucursalesService: SucursalesService) {
    
      this.facturaProveedor = new FacturaProveedor()
      this.pago_proveedor= new PagoProveedor()
      this.usuariologueado=sessionStorage.getItem('user')
      this.obj = new objDate()
      this.tipoMenu = this.tiposMenu[0]
   }

  ngOnInit() {
    this.traerDatosConfiguracion()
    this.setearFechaMensual()
    this.cargarUsuarioLogueado()
    this.traerContadoresDocumentos()
    this.traerParametrizaciones()
    this.traerProductos()
    this.traerProductosComprados()
    this.traerOrdenesCompraMensuales()
    //this.getIDDocumentos()
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
            if( this.usuarioLogueado[0].rol == "Administrador")
              this.opadmin=true

            if(this.usuarioLogueado[0].status == "Inactivo")
              this.authService.logOut();


          },
          err => {
          }
        )
    });
  }



  traerProductos(){
    this.productoService.getProducto().subscribe(res => {
      this.productos = res as producto[];
   })
  }

  traerDatosConfiguracion() {
    this._configuracionService.getDatosConfiguracion().subscribe((res) => {
      this.imagenLogotipo = res[0].urlImage;
    });
  }

  traerRegistrosPorRango(){
    this.ordenesCompraGenerales = [];
    this.limpiarArreglos();
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this.ordenesService.getOrdenesCompraPorRango(this.obj).subscribe(res => {
      this.ordenesCompra = res as OrdenDeCompra[];
      this.obtenerOrdenes()
    })
  }

  traerParametrizaciones(){
    this.parametrizacionService.getParametrizacion().subscribe(res => {
      this.parametrizaciones = res as parametrizacionsuc[];
   })
  }

  opcionRadioTipos(e){
    this.tipoMenu = e.value;
    switch (e.value) {
      case "Solicitudes":
        this.nombreDocumento = "Solicitud_Ordenes"
        this.mostrarNroOrden = false
        this.mostrarMotivoRechazo = false
        this.mostrarTotal = true
        this.mostrarTipo = true
        this.mostrarOp1 = true
        this.mostrarFecha = false
        this.mostrarEstado = false
        this.mostrarNot = false
        this.ordenesCompraGenerales = this.ordenesCompraPendientes;
        break;
      case "Rechazadas":
        this.nombreDocumento = "Ordenes_Rechazadas"
        this.mostrarNroOrden = false
        this.mostrarMotivoRechazo = true
        this.mostrarTotal = false
        this.mostrarTipo = false
        this.mostrarOp1 = false
        this.mostrarFecha = false
        this.mostrarEstado = false
        this.mostrarNot = false
        this.ordenesCompraGenerales = this.ordenesCompraRechazadas;
        break;
      case "Aprobadas":
        this.nombreDocumento = "Ordenes_Aprobadas"
        this.mostrarNroOrden = true
        this.mostrarMotivoRechazo = false
        this.mostrarTotal = true
        this.mostrarTipo = false
        this.mostrarOp1 = false
        this.mostrarFecha = true
        this.mostrarEstado = true
        this.mostrarNot = true
        this.ordenesCompraGenerales = this.ordenesCompraAprobadas;
        break;
      default:    
    }       
  }

  traerOrdenesCompra(){
    this.ordenesCompra=[]
    this.ordenesCompraPendientes=[]
    this.ordenesCompraRechazadas=[]
    this.ordenesCompraAprobadas=[]
    this.ordenesCompraDirectas=[]
    this.mostrarLoading=true;
    this.ordenesService.getOrden().subscribe(res => {
      this.ordenesCompra = res as OrdenDeCompra[];
      this.obtenerOrdenes()
   })
  }

  traerOrdenesCompraMensuales(){
    this.limpiarArreglos();
    this.mostrarLoading=true;
    this.ordenesService.getOrdenesMensuales(this.obj).subscribe(res => {
      this.ordenesCompra = res as OrdenDeCompra[];
      this.obtenerOrdenes()
    })
  }


  limpiarArreglos(){
    this.ordenesCompra=[]
    this.ordenesCompraPendientes=[]
    this.ordenesCompraRechazadas=[]
    this.ordenesCompraAprobadas=[]
    this.ordenesCompraDirectas=[]
  }

  setearFechaMensual(){
    var fechaHoy = new Date();
    var fechaAnterior = new Date();
    fechaHoy.setDate(fechaHoy.getDate() + 1);
    fechaAnterior.setDate(fechaHoy.getDate() - 30);
    this.obj = new objDate();
    this.obj.fechaActual = fechaHoy;
    this.obj.fechaAnterior = fechaAnterior;
  }

  

  traerProductosComprados(){
    this.productosCompradosService.getProductoComprados().subscribe(res => {
      this.productosComprados = res as ProductoDetalleCompra[];
    })
  }

  traerTransacciones(){
    this.transaccionesService.getTransaccion().subscribe(res => {
      this.transacciones = res as transaccion[];
   })
  }

  async traerContadoresDocumentos(){
    await this.contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
      this.asignarIDdocumentos()
   })
  }

  asignarIDdocumentos(){
    this.nordenCompra =this.contadores[0].ordenesCompraAprobadas_Ndocumento+1
  }

   //contadores usando firebase para actualizacion automatica
   async getIDDocumentos() {
    //REVISAR OPTIMIZACION
    await this.db.collection('consectivosBaseMongoDB').valueChanges().subscribe((data:contadoresDocumentos[]) => {
      new Promise<any>((resolve, reject) => {
        if(data != null){
          this.contadorFirebase = data
        } 
      })
      this.asignarIDdocumentos2()
    });;
  }

  asignarIDdocumentos2(){
    this.number_transaccion =this.contadorFirebase[0].transacciones_Ndocumento+1
  }


  validarSolicitud(){
    this.productosComprados3 = []
    let numero =this.datoNsolicitud
    let solicitud=0
    
    this.ordenesCompra.forEach(element=>{
      if(element.n_orden == numero)
          solicitud=element.documento
    })

    this.productosComprados.forEach(element=>{
        if(element.solicitud_n == solicitud)
          this.productosComprados3.push(element)
    })

    var flag:boolean=true
    this.ordenesCompraAprobadas.forEach(element=>{
      if(this.datoNsolicitud == element.n_orden){
        this.newButtonEnabled2=false
        flag=false
      }
    })
    if(flag){
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
  }


  llenarTabla(){
    this.facturaProveedorBus = []
    this.asignarValor()
    
    this.facturaProveedor2.forEach(element=>{
      if(this.NordenFact==element.nSolicitud)
          this.facturaProveedorBus.push(element)
    })
    
    this.facturaProveedorBus.forEach(element=>{
        this.totalsuma2=element.total+this.totalsuma2
    })

    this.ordenesCompraAprobadas.forEach(element=>{
      if(this.NordenFact == element.n_orden)
            this.totalOrden=element.total
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

  }

 
         
        
         
        


  obtenerOrdenes(){
    this.ordenesCompra.forEach(element=>{
      if(element.estado=="Pendiente")
        this.ordenesCompraPendientes.push(element)
      else if(element.estado=="Rechazado")
        this.ordenesCompraRechazadas.push(element)
    })
    this.obtenerOrdenesAprobadas()
  }

  obtenerOrdenesAprobadas(){
    this.ordenesCompra.forEach(element=>{
      if(element.estado=="Aprobado" && element.n_orden>=0){
        this.ordenesCompraAprobadas.push(element)
        if(element.tipo == "Entregado"){
          this.ordenesCompraDirectas.push(element)
        }
      }
    })

    this.obtenerOrdenesDirRech()
  }

  obtenerOrdenesDirRech(){
    this.ordenesCompraDirectas.forEach(element=>{
      if(element.estadoIngreso == "Eliminada")
        this.ordenesCompraDirectasRec.push(element)
      else if(element.estadoIngreso == "Anulada")
        this.ordenesCompraDirectasEl.push(element)
      else
        this.ordenesCompraDirectas2.push(element)
    })

    switch (this.tipoMenu) {
      case "Solicitudes":
        this.ordenesCompraGenerales = this.ordenesCompraPendientes;
        break;
      case "Rechazadas":
        this.ordenesCompraGenerales = this.ordenesCompraRechazadas;
        break;
      case "Aprobadas":
        this.ordenesCompraGenerales = this.ordenesCompraAprobadas;
        break;
      default:
        break;
    }

    this.mostrarLoading = false;
  }

  errorMensaje(){
    Swal.fire({
      title: "Error al guardar",
      text: 'Revise e intente nuevamente',
      icon: 'error'
    })
  }

  eliminarTransacciones(e){
    this.actualizarProductos2(e)
   }

   actualizarProductos2(e:any){
    this.productosComprados2 = []
    var orden_n=e.documento
    this.productosComprados.forEach(element=>{
      if(element.solicitud_n == orden_n)
        this.productosComprados2.push(element)
    })
     var sumaProductos =0
     var num1:number=0
     var num2:number=0

      var contIng:number=0
      var entre:boolean=true     
        this.productosComprados2.forEach(element=>{
          this.productos.forEach(elemento1=>{
            if(elemento1.PRODUCTO == element.nombreComercial.PRODUCTO){
             switch (e.sucursal.nombre) {
              case "matriz":
                num1=element.cantidad
                num2=elemento1.sucursal1
                sumaProductos =Number(num2) - Number(num1)
                break;
              case "sucursal1":
                num1=element.cantidad
                num2=elemento1.sucursal2
                sumaProductos =Number(num2) - Number(num1)
                break;
              case "sucursal2":
                num1=element.cantidad
                num2=elemento1.sucursal3
                sumaProductos =Number(num2) - Number(num1)
                  break;
              default:
            }
            }
         })
         if(entre){
           new Promise<any>((resolve, reject) => {
            switch (e.sucursal.nombre) {
              case "matriz":
                element.nombreComercial.sucursal1=sumaProductos
                this.productoService.updateProductoSucursal1(element.nombreComercial).subscribe( res => {console.log(res + "entre por si");}, err => {this.errorMensaje()})
                break;
              case "sucursal1":
                element.nombreComercial.sucursal2=sumaProductos
                this.productoService.updateProductoSucursal2(element.nombreComercial).subscribe( res => {console.log(res + "entre por si");}, err => {this.errorMensaje()})
                break;
              case "sucursal2":
                element.nombreComercial.sucursal3=sumaProductos
                this.productoService.updateProductoSucursal3(element.nombreComercial).subscribe( res => {console.log(res + "entre por si");}, err => {this.errorMensaje()})
                  break;
              default:
            }
           })
         }
        })     
    }



  ordenesEnProceso(){
    this.ordenesCompra.forEach(element=>{
      if(element.documento==this.dato){
        this.ordenesCompraPendientes.push(element)
      }
     
    })
  }


  mostrarmensaje = (e) =>{
    this.popupVisible2 = true;
  }

  getLinkedLocations(e: any){  
    let n 
    n = e.row.data
    e.event.preventDefault(); 
  }

  getCourseFile = (e) => {  
    this.cargarOrdenCompra(e.row.data)  
  }

  getCourseFile2 = (e) => {  
    this.cargarOrdenCompra(e.row.data)  
  }

  getCourseFile3 = (e) => {  
    this.rechazarFactP(e.row.data)  
  }

  getCourseFile5 = (e) => {  
    this.eliminarOrden(e.row.data)  
  }

  getCourseFile6 = (e) => {  
    this.rechzarAnulacion(e.row.data)  
  }

  rechzarAnulacion(e:any){
    var data2=""
    data2=e._id

      Swal.fire({
        title: 'Rechazar Anulacion',
        text: "Desea rechazar la anulacion #"+e.n_orden,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          new Promise<any>((resolve, reject) => {
          
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

  eliminarOrden(e:any){
    var data2=""
    data2=e.documento+""
    Swal.fire({
      title: 'Eliminar orden',
      text: "Se eliminará la orden #"+e.n_orden,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {

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
    data2=e.documento+""

      Swal.fire({
        title: 'Anular orden',
        text: "Desea eliminar la orden #"+e.n_orden,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {

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
  }

  rechazarOrden = (e) => {  
    this.actualizarOrdenRec(e.row.data) 
  }

  confirmarM(e,ord:number){
    this.contadores[0].ordenesCompraAprobadas_Ndocumento=ord
    this.contadoresService.updateContadoresIDOrdenesAprobadas(this.contadores[0]).subscribe( res => {}, err => {this.errorMensaje()})
    if(e.tipo == "Entregado"){
      this.actualizarProductos(e , ord)
    }else{
      this.cerrarAlert()
    }
  }




  mostrarNotas= (e) => {  
    this.popupOrdenes(e.row.data)  
  }

  popupOrdenes(e){
    Swal.fire({
      title: "Notas",
      icon: 'warning',
      input: 'textarea',
      inputValue: e.nota,
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        e.nota=result.value
        this.ordenesService.actualizarNota(e,result.value).subscribe( res => {
          Swal.fire({
            title: 'Correcto',
            text: 'Su proceso se realizó con éxito',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            window.location.reload()
          })}, err => {alert("error")})
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }


  cerrarAlert(){
    Swal.close()
    Swal.fire({
      title: 'Orden creada',
      text: 'Se ha creado su orden con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
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
        var est:string="Aprobado"
        var num:string
        var tim=0
        num=e._id

        new Promise<any>((resolve, reject) => {
          if(e.tipo == "Entregado"){
            var facturaProveedor = new FacturaProveedor();
            facturaProveedor.total = e.total;
            facturaProveedor.valorPagado = e.total;
            facturaProveedor.valorAbonado = e.total;
            facturaProveedor.nSolicitud = this.nordenCompra;
            facturaProveedor.fecha = new Date();
            facturaProveedor.fechaExpiracion = e.fecha;
            facturaProveedor.nFactura = e.factPro;
            facturaProveedor.idF = this.contadores[0].contFacturaProveedor_Ndocumento+1;
            facturaProveedor.proveedor = e.proveedor.nombre_proveedor;
            facturaProveedor.estado = "PAGADA";
            facturaProveedor.estado2 = "Aceptada";
            facturaProveedor.estado3 = "Ingresada";
            facturaProveedor.documento_solicitud = e.documento;
            this._facturasProveedorService.newFacturaProveedor(facturaProveedor).subscribe( res => {
              this.contadores[0].contFacturaProveedor_Ndocumento = facturaProveedor.idF
              this.contadoresService.updateContadoresIDFacturasProveedor(this.contadores[0]).subscribe( 
                res => {}, 
                err => {alert("error")})
            }, err => {alert("error")})


            this.ordenesService.updateOrdenEstadoAprobado(num, "Aprobado", this.nordenCompra, this.usuariologueado,"COMPLETO").subscribe( res => {this.confirmarM(e ,this.nordenCompra )}, err => {this.errorMensaje()})
          }else{
            this.ordenesService.updateOrdenEstadoAprobado(num, "Aprobado", this.nordenCompra, this.usuariologueado,"PENDIENTE").subscribe( res => {this.confirmarM(e ,this.nordenCompra )}, err => {this.errorMensaje()})
        }

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
    if(this.dataGrid2.instance.columnOption("bt2").visible == false)
      this.dataGrid2.instance.columnOption("bt2", "visible", true);
    else
      this.dataGrid2.instance.columnOption("bt2", "visible", false);
  }

  actualizarOrdenRec(e){
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
        num=e._id+""
        this.ordenesService.updateOrdenEstadoRechazo(num, "Rechazado", result.value, "PENDIENTE").subscribe( res => {Swal.fire({
          title: 'Correcto',
          text: 'Se restableció a la lista de ordenes de compra',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
        })}, err => {this.errorMensaje()})
         //this.db.collection('/ordenesDeCompra').doc(num).update({"estado" :"Rechazado", "msjAdmin":result.value,"estadoOrden":"PENDIENTE"})  
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
    this.ordenesCompra.forEach(element=>{
      if(element.n_orden==this.datoNsolicitud){
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

    onExporting2 (e) {
      e.component.beginUpdate();
      e.component.columnOption("usuario", "visible", true);
      e.component.columnOption("msjGeneral", "visible", true);
      e.component.columnOption("nota", "visible", true);
    };
    onExported2 (e) {
      e.component.columnOption("usuario", "visible", false);
      e.component.columnOption("msjGeneral", "visible", false);
      e.component.columnOption("nota", "visible", false);
      e.component.endUpdate();
    }
  

  mapearArreglo(){
    for (let index = 0; index < this.selectedRows.length; index++) {
    console.log("producto "[index]+" es "+ this.selectedRows[index])
    }
  }

anadirDetallePago = (e) => {
  this.detallePago.push(new DetallePagoProveedor())

}

  selectionChangedHandler() {
    if(!this.selectionChangedBySelectbox) {
        this.prefix=null;
    }

    this.selectionChangedBySelectbox=false;
}


  llenarCombosOrdenesCompra(){
    this.ordenes = []
    this.ordenesCompra.forEach(element=>{
      if(element.proveedor.nombre_proveedor == this.pago_proveedor.beneficiario)
        this.ordenes2.push(element)
    })
    this.ordenes2.forEach(element2=>{
      this.facturaProveedor2.forEach(element=>{
        if(element.nSolicitud == element2.n_orden && element.estado=="Pendiente"){
          this.ordenes.push(element2)
        }
      })
    })

   let sinRepetidos = this.ordenes.filter((valorActual, indiceActual, arreglo) => {
    //Podríamos omitir el return y hacerlo en una línea, pero se vería menos legible
    return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo) === JSON.stringify(valorActual)) === indiceActual
  });

  sinRepetidos.forEach(element=>{
    this.ordenes3.push(element)
  })
  if(this.ordenes3.length<=0){
    Swal.fire(
      'Error!',
      'No hay pagos pendientes para este proveedor',
      'error'
    )
  }
  }




  obtenerFactP(e,i:number){
    this.factProvPagos = []
    this.detallePago[i].orden_compra= e.value
    this.facturaProveedor2.forEach(element=>{
      if(element.nSolicitud == e.value && element.estado=="Pendiente")
        this.factProvPagos.push(element)
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


  setProveedor(e){
    this.detallePago = []
    this.detallePago.push(new DetallePagoProveedor)
    this.pago_proveedor.beneficiario= e.component._changedValue
    this.llenarCombosOrdenesCompra()
  }

  deleteFila(i:number){
    this.detallePago.splice(i,1);
  }


  actualizarFacturas(){
    var dato=""
    this.detallePago.forEach(element=>{
      dato=element.id_factura+""
    })
  }

  opcionMenu(e){
    switch (e.value) {
      case  "Consulta Mensual":
        this.traerOrdenesCompraMensuales();
      
       break;
      case "Consulta Global":
        this.traerOrdenesCompra();
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

  actu(e: any){
    this.productosComprados2 = []
    var orden_n=e.documento
    this.productosComprados.forEach(element=>{
      if(element.solicitud_n == orden_n){
        this.productosComprados2.push(element)
      }
    })
  }

  cargarOrdenCompra(e: any){
    this.productosComprados2 = []
    this.textoDes= "SOLICITUD / COMPRA 001-000"
    var orden_n=e.documento
    var docuOrden=e.n_orden
    this.ordenesCompra.forEach(element=>{
      if(element.documento==orden_n && element.n_orden==docuOrden){
         this.ordenDeCompra2 = element
         this.numOrden= element.documento
         if(element.n_orden>0){
          this.numOrden= element.n_orden
          this.textoDes= "ORDEN / COMPRA 001-000"
         }
        this.cargarValoresFactura()
      }     
    })
    
    this.parametrizaciones.forEach(element=>{
      if(element.sucursal == this.ordenDeCompra2.sucursal.nombre){
        this.parametrizacionSucu= element
      }
    })

    this.productosCompradosService.getProductoCompradosDocumento(orden_n).subscribe(res => {
      this.productosComprados2= this.ordenDeCompra2.productosComprados
      this.crearPDF(this.textoDes)
    })
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
      default:
  }
}


  mostrarMensajeDescargando(){
    let timerInterval
      Swal.fire({
        title: 'Descargando Documento...',
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
      })
  }



  crearPDF(texto:string){
    this.mostrarMensajeDescargando();
    const documentDefinition = this.getDocumentDefinition();
    if(texto== "ORDEN / COMPRA 001-000")
      pdfMake.createPdf(documentDefinition).download('Orden/Compra '+this.numOrden, function() { 
        Swal.close(),
        Swal.fire({
          title: 'Descarga completa',
          text: 'Se descargó su documento con éxito',
          icon: 'success',
        })
      });

    else
      pdfMake.createPdf(documentDefinition).download('Solicitud/Compra '+this.numOrden, function() { 
        Swal.close(),
        Swal.fire({
          title: 'Descarga completa',
          text: 'Se descargó su documento con éxito',
          icon: 'success',
        })
      });  
  }


  getDocumentDefinition() {
    this.setearNFactura()
    sessionStorage.setItem('resume', JSON.stringify("jj"));
    return {
      pageSize: 'A4',
      content: [
        {
          columns:[
                    {
                      image: this.imagenLogotipo,
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
                text: "Fecha de impresión: "+this.ordenDeCompra2.fecha, fontSize:10
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
                width:300,
                text: this.textoDes,
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
            ],
            [
              
            ]
          ]
        },
       
        
        this.getProductosVendidos(this.productosComprados2),
        {
          text: " ",
        },
       
        {
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


  getProductosVendidos(productos: ProductoDetalleCompra[]) {
    return {
      table: {
        widths: ["10%","6%","52%","10%","9%","13%"],
        alignment:'center',
        body: [
          
          [{
            text: 'Cantidad',
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
          ],
          
          ...productos.map(ed =>{
            return [ { text: ed.cantidad, alignment: 'center' },{text:ed.nombreComercial.UNIDAD,fontSize:8,alignment:"center"},ed.nombreComercial.PRODUCTO, {text:ed.precio_compra.toFixed(2), alignment:"center"}, {text:ed.desct, alignment:"center"}, {text:ed.total.toFixed(2), alignment:"right",style:"totales2"}];
            
          }),
        ]
      }
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
            text: ' '+this.ordenDeCompra2.costeUnitaTransport,
            alignment: 'center'
          },
          ],
          
        ]
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




  generarSolicitudDeCompra(e) {
    new Promise<any>((resolve, reject) => {
      this.productosComprados.forEach(element => {
        element.orden_compra = this.ordenDeCompra2.documento
      });
    });
  }


    actualizarProductos(e:any , ord:number){
      var contVal=0
      this.productosComprados2 = []   

      this.ordenesService.getOrdenbyID(e._id)
        .subscribe(
          res => {
         this.ordenDeCompra2 = res as OrdenDeCompra
         this.productosComprados2= this.ordenDeCompra2.productosComprados
         var sumaProductos =0
         var num1:number=0
         var num2:number=0
          var entre:boolean=true    
              this.productosComprados2.forEach(element=>{
                this.productos.forEach(elemento1=>{
                  if(elemento1.PRODUCTO == element.nombreComercial.PRODUCTO){
                  switch (e.sucursal.nombre) {
                    case "matriz":
                      num1=element.cantidad
                      num2=elemento1.sucursal1
                      sumaProductos =Number(num1) + Number(num2)
                      
                      break;
                    case "sucursal1":
                      num1=element.cantidad
                      num2=elemento1.sucursal2
                      sumaProductos =Number(num1) + Number(num2)
                      
                      break;
                    case "sucursal2":
                      num1=element.cantidad
                      num2=elemento1.sucursal3
                      sumaProductos =Number(num1) + Number(num2)
                     
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
                      this.productoService.updateProductoSucursal1ComD(element.nombreComercial,sumaProductos,element.nombreComercial.precio).subscribe( res => {console.log(res + "entre por si");}, err => {this.errorMensaje()})
                      break;
                    case "sucursal1":
                      this.productoService.updateProductoSucursal2ComD(element.nombreComercial,sumaProductos,element.nombreComercial.precio).subscribe( res => {console.log(res + "entre por si");}, err => {this.errorMensaje()})
                      break;
                    case "sucursal2":
                    this.productoService.updateProductoSucursal3ComD(element.nombreComercial,sumaProductos,element.nombreComercial.precio).subscribe( res => {console.log(res + "entre por si");}, err => {this.errorMensaje()})
                        break;
                    default:
                  }
                this.transaccion = new transaccion()
                this.transaccion.fecha_mov=new Date().toLocaleString()
                this.transaccion.fecha_transaccion=new Date()
                this.transaccion.sucursal=e.sucursal.nombre
                this.transaccion.valor=element.precio_compra
                this.transaccion.totalsuma=element.total-(element.total*(element.descGeneral/100))
                this.transaccion.bodega="bodega1"
                this.transaccion.orden_compra=ord
                this.transaccion.documento=e.documento
                this.transaccion.costo_unitario=element.nombreComercial.precio
                sum2=element.precio_compra-(element.precio_compra*(element.descProducto/100))
                this.transaccion.valor=sum2-(sum2*(element.descGeneral/100))
                this.transaccion.cantM2=element.cantidad
                this.transaccion.producto=element.nombreComercial.PRODUCTO
                this.transaccion.cajas=Math.trunc(element.cantidad / element.nombreComercial.M2);
                this.transaccion.piezas=(Math.trunc(element.cantidad *element.nombreComercial.P_CAJA / element.nombreComercial.M2) - (Math.trunc(element.cantidad / element.nombreComercial.M2) * element.nombreComercial.P_CAJA));
                this.transaccion.observaciones=e.observaciones
                this.transaccion.movimiento=1
                this.transaccion.tipo_transaccion="compra-dir"
                this.transaccion.usu_autorizado=this.usuarioLogueado[0].username
                this.transaccion.usuario=this.usuarioLogueado[0].username
                this.transaccion.factPro=""
                this.transaccion.idTransaccion=this.number_transaccion++
                this.transaccion.proveedor= e.proveedor.nombre_proveedor
                
                this.transaccionesService.newTransaccion(this.transaccion).subscribe(
                  res => {
                    this.contadores[0].transacciones_Ndocumento = this.number_transaccion++
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
                  },err => {
                  })
                                
                })
              }
              })   

          },
          err => {
          }
        )  
      }


      contadorValidaciones(i:number){
        if(this.productosComprados2.length==i){
          Swal.close()
          Swal.fire({
            title: 'Productos actualizados',
            text: 'Se ha guardado con éxito',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            window.location.reload()
          })
        }
      }
}


@Pipe({ name: 'stringifyEmplyees' })
export class StringifyEmployeesPipe implements PipeTransform {
    transform(employees: ProductoDetalleCompra[]) {
        return employees.map(employee =>  employee.nombreComercial.PRODUCTO ).join(", ");
       
    }
}

//2057