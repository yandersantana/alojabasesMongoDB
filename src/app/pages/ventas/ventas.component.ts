import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { compra } from '../compras/compra';
import { DxFormComponent } from 'devextreme-angular';
import { transaccion } from '../transacciones/transacciones';
import { ConsolidadoComponent } from '../consolidado/consolidado.component';
import { factura, cliente, venta, producto, cotizacion, productosPendientesEntrega, sucursal, contadoresDocumentos } from './venta';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import dxAutocomplete from 'devextreme/ui/autocomplete';
import { dxFormGroupItem } from 'devextreme/ui/form';
import { inventario, productoTransaccion } from '../consolidado/consolidado';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { catalogo, comboProducto, ProductoCombo, productosCombo } from '../catalogo/catalogo';
import { ProductoService } from '../../servicios/producto.service';
import { SucursalesService } from 'src/app/servicios/sucursales.service';
import { CatalogoService } from 'src/app/servicios/catalogo.service';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { FacturasService } from 'src/app/servicios/facturas.service';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { ProductosVendidosService } from 'src/app/servicios/productos-vendidos.service';
import { TransaccionesService } from 'src/app/servicios/transacciones.service';
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { ProformasService } from 'src/app/servicios/proformas.service';
import { AuthenService } from 'src/app/servicios/authen.service';
import { user } from '../user/user';
import { ProductosPendientesService } from 'src/app/servicios/productos-pendientes.service';
import { NotasVentasService } from 'src/app/servicios/notas-ventas.service';
import { ControlPreciosService } from 'src/app/servicios/control-precios.service';
import { precios, preciosEspeciales } from '../control-precios/controlPrecios';
import { PrecioEspecialService } from 'src/app/servicios/precio-especial.service';
import DataSource from 'devextreme/data/data_source';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserService } from 'src/app/servicios/user.service';
import { DatosConfiguracionService } from 'src/app/servicios/datosConfiguracion.service';
import { OperacionComercial, ReciboCaja } from '../reciboCaja/recibo-caja';
import { ReciboCajaService } from 'src/app/servicios/reciboCaja.service';
import { TransaccionesFinancieras } from '../transaccionesFinancieras/transaccionesFinancieras';
import { TransaccionesFinancierasService } from 'src/app/servicios/transaccionesFinancieras.service';
import { CuentaPorCobrar } from '../cuentasPorCobrar/cuentasPorCobrar';
import { CuentasPorCobrarService } from 'src/app/servicios/cuentasPorCobrar.service';
import { Router } from '@angular/router';
import { CajaMenor } from '../cajaMenor/caja-menor';
import { CajaMenorService } from 'src/app/servicios/cajaMenor.service';
import { AuthService } from 'src/app/shared/services';
import { CombosService } from 'src/app/servicios/combos.service';
import { ApiVeronicaService } from 'src/app/servicios/api_veronica.service';
import { CampoAdicionalModel, ComprobanteDetalle, ConsecutivoDto, FacturaModel, ImpuestoModel, PagosModel, ReceptorModel, ResponseVeronicaDto, ResultadoDto, ServicioWebVeronica } from '../api-veronica/api-veronica';
import { ServicioWebVeronicaService } from 'src/app/servicios/servicioWebVeronica.service';
import { ControlMercaderiaService } from 'src/app/servicios/control-mercaderia.service';
import { controlUnidades } from '../control-unidades/control-unidades';
import { element } from 'protractor';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
  providers: [DatePipe]
})


export class VentasComponent implements OnInit {
  isAdmin = false;
  sectionSearch = false;
  isContado = true;
  isSaldo = false;
  isOtros = false;
  formaPago = "Pendiente de Pago";
  listaOperaciones : OperacionComercial[]=[]
  recibosEncontrados : ReciboCaja[]=[]
  facturasEctdas : factura[]=[]
  newRecibo = new ReciboCaja();
  clienteAnterior = new cliente();
  rucAnterior = ""

  formasPago: string[] = [
    'Cancelado',
    'Abonos',
    'Otros medios Pago',
  ];

  mostrarLoading = false;
  mensajeLoading = "Cargando";

  valor1 = 0;
  valor2 = 200;
  arrayCantidades: number [] = []
  textoConsecutivo = "S0001 - "

  //procesos para inventario
  proTransaccion: productoTransaccion = new productoTransaccion();


  contadorVenta =0;
  transacciones2:transaccion[]=[]
  invetarioP:inventario[]=[]
  invetarioProd:inventario
  productoPendienteE: productosPendientesEntrega
  productoPendienteEntregas: productosPendientesEntrega[]=[]
  telefonoCliente="";
  nombre:string;
  factura : factura;
  cotizacion: cotizacion;
  now: Date = new Date();
  now3: Date = new Date();
  mySimpleFormat4:  string
  maxDate:Date = new Date();
  minDate:Date = new Date();
  fechaMaxima:Date = new Date();
  productos: producto[] = []
  productosActivos: producto[] = []
  productos2: producto[] = []
  clientes:cliente[] = []
  clientesGenerales:cliente[] = []
  clientes2:cliente[] = []
  clientesMaestros:cliente[] = []
  facturas:factura[] = []
  proformas:factura[] = []
  id_transacciones:transaccion[] = []
  transacciones:transaccion[] = []
  productosVendidos2= []
  sePuedeCalcular:Boolean
  compras: compra[] = []
  transaccion:transaccion
  productosVendidos: venta[] = []
  newButtonEnabled: boolean = true
  botonCotizacion: boolean = true
  botonNotaVenta: boolean = true
  botonFactura: boolean = false
  costoTr: boolean = false
  medida: string = "m2"
  cantidadcal: number=0
  cantidadPiezas: number
  visibleCalculadora: boolean = false
  valorEnM2:number=0
  pdf:PdfMakeWrapper = new PdfMakeWrapper()
  sucursales:sucursal[]
  nCotizacionFact:string

  productosSolicitados:number
  flag:boolean
  dateToday: number = Date.now();
  datePipe:DatePipe
  mensaje:string
  numeroFactura:string
  totalcomprador=0
  cliente3: cliente
  cont=0
  numeroFactura2:number
  contadorBusqueda=0
  //datos factura
  subtotal1=0;
  Sdescuento=0;
  sIva0=0;
  sIva12=0;
  subtotal2=0;
  iva=0;
  tDocumento: string
  textoTipoDocumento: string        //se especifica si es proforma o nota de venta
  textoTipoDocumento2: string         //para detalle de nombre comercial 
  Ncotizacion: number
  contadoProductos=0

  
  foo:string
  number_transaccion:number=0
  variab:number
  imagenPrincipal:string
  popupVi:boolean=false
  imagenesData:string[]
  titulo:string=""
  catalogoLeido:catalogo
  username:string
  nombreUsuario : string

  @ViewChild('ventasForm', { static: false }) ventasForm: DxFormComponent;
  @ViewChild("data2", { static: false }) dataGrid: dxAutocomplete;
  @ViewChild('espacio') dataContainer: dxFormGroupItem;
  @ViewChild(ConsolidadoComponent) hijo: ConsolidadoComponent;

  pipe = new DatePipe('en-US');
  sucursalUsuario = "";

  now2 = Date.now();
  //now3 = Date.now();
  tipoDocumentos: string[] = [
    "Factura",
    "Cotización",
    "Nota de Venta"
  ];


  sucursalesDefault: string[] = [
    "matriz",
    "sucursal1",
    "sucursal2"
  ];

  tipoConversiones: string[] = [
    "De cajas a m2",
    "De m2 a cajas"
  ];

  imagenLogotipo ="";

  contadorFirebase:contadoresDocumentos[]=[]
  popupvisible:boolean=false
  productosCatalogo:catalogo[]=[]
  calp:number=0
  selectAct:boolean=false
  imagenes:string[]
  correo:string=""
  calmetros:number=0
  caltotal:number=0
  numeroID:number=0
  precios:precios[]=[]
  maestroConstructor:string
  contR=this.numeroID
  disponibilidadProducto:string=""
  disponibilidadProductoS1:string=""
  disponibilidadProductoS2:string=""
  flagDisProdMatriz = false
  flagDisProdSuc1 = false
  flagDisProdSuc2 = false
  parametrizaciones:parametrizacionsuc[]=[]
  usuarios: user[] = []
  parametrizacionSucu:parametrizacionsuc
  contadores:contadoresDocumentos[]
  mySimpleFormat = this.pipe.transform(this.now2, 'MM/dd/yyyy');
  fechaMaxima2 = new Date(this.now3.setDate(this.now.getDate() + 7));
  mySimpleFormat2 = this.pipe.transform(this.fechaMaxima2, 'MMM / d / y');
  usuarioLogueado:user
  preciosEspeciales:preciosEspeciales[]=[]
  productos22: DataSource;
  RucSucursal:string="";

  popupVisibleCombos = false;
  nombreCombo = "";
  productosComboLeidos: productosCombo[] = []
  cantidadProductos = 0


  facturaVeronica : FacturaModel
  consecutivoVeronica : ConsecutivoDto
  secuencialFactura : string
  listaParametrizaciones : controlUnidades[]=[]


  constructor(private db: AngularFirestore,
    public preciosEspecialesService : PrecioEspecialService,
    public notasVentService : NotasVentasService, 
    public productosPendientesService : ProductosPendientesService, 
    public authenService : AuthenService, 
    public proformasService : ProformasService, 
    public transaccionesService: TransaccionesService, 
    public productosVenService:ProductosVendidosService,
    public parametrizacionService:ParametrizacionesService, 
    public contadoresService: ContadoresDocumentosService, 
    public facturasService:FacturasService,
    public preciosService:ControlPreciosService, 
    public clienteService: ClienteService, 
    public catalogoService: CatalogoService, public productoService:ProductoService,
    public sucursalesService: SucursalesService, 
    public userService: UserService,
    public _configuracionService : DatosConfiguracionService,
    public _reciboCajaService : ReciboCajaService,
    public authService: AuthService,
    public _cuentaPorCobrar : CuentasPorCobrarService,
    public _transaccionFinancieraService : TransaccionesFinancierasService,
    public _cajaMenorService : CajaMenorService,
    public _comboService : CombosService,
    public _apiVeronicaService : ApiVeronicaService,
    public _logApiVeronicaService : ServicioWebVeronicaService,
    public cdRef : ChangeDetectorRef,
    public _controlMercaderiaService : ControlMercaderiaService,
    public router: Router) {
      this.factura = new factura()
      this.cotizacion = new cotizacion()
      this.factura.fecha = this.now
      this.maxDate = new Date(this.maxDate.setDate(this.maxDate.getDate() - 2));
      this.minDate = this.now
      this.productosVendidos.push(new venta)
      this.factura.coste_transporte= 0
      this.factura.fecha2= this.now.toLocaleString()
      this.factura.tipoDocumento = "Factura"
      this.facturaVeronica = new FacturaModel()
  }

  ngOnInit() {
    this.cargarUsuarioLogueado()
    this.traerProductos()
    this.traerSucursales()
    this.traerContadoresDocumentos()
    this.traerClientes()
    this.traerFacturas()
    this.traerParametrizaciones()
    this.traerProductosCatalogo()
    this.traerPrecios()
    this.traerPreciosEspeciales()
    this.traerUsuarios()
    this.traerDatosConfiguracion();
    this.traerParametrizacionesMercaderia();

    this.factura.tipo_venta="Normal"
    this.factura.tipo_cliente="C"
    this.tDocumento= "Factura"
    this.factura.observaciones= " "
    this.nCotizacionFact= " "

    console.log(this.factura.fecha.toLocaleDateString('en-GB', {month: '2-digit',day: '2-digit',year: 'numeric'}))

  }

  
  traerDatosConfiguracion() {
    this._configuracionService.getDatosConfiguracion().subscribe((res) => {
      this.imagenLogotipo = res[0].urlImage;
    });
  }


  traerParametrizacionesMercaderia(){
    this._controlMercaderiaService.getParametrizaciones().subscribe(res => {
      this.listaParametrizaciones = res as controlUnidades[];
    })
  }


  cargarUsuarioLogueado() {
    new Promise((res, err) => {
      if (localStorage.getItem("maily") != '')
        this.correo = localStorage.getItem("maily");

      this.authenService.getUserLogueado(this.correo)
        .subscribe(
          res => {
            this.usuarioLogueado = res as user;
            this.factura.username = this.usuarioLogueado[0].username
            this.username = this.factura.username
            this.nombreUsuario = this.usuarioLogueado[0].name
            this.factura.nombreUsuario = this.usuarioLogueado[0].name
            this.sucursalUsuario = this.usuarioLogueado[0].sucursal
            this.factura.sucursal = this.usuarioLogueado[0].sucursal
            if(this.usuarioLogueado[0].status == "Inactivo")
              this.authService.logOut();
            this.buscarDatosSucursal()
            this.validarRol()},
          err => {})
    });
  }


  mostrarPopupCodigo(){
     Swal.fire({
      title: 'Vendedor',
      allowOutsideClick: false,
      showCancelButton: false,
      allowEscapeKey : false,
      inputAttributes: {
        autocapitalize: 'off'
      },
      confirmButtonText: 'Ingresar',
      input: 'password',
    }).then((result) => {
      var usuarioClave = this.usuarios.find(el => el.codigoFacturacion == result.value);
      console.log(usuarioClave)
      if(usuarioClave != null){
        this.factura.nombreVendedor = usuarioClave.name
        switch (this.factura.tipoDocumento) {
          case "Factura":
            var existe = this.clientesGenerales.find(x=> x.ruc == this.factura.cliente.ruc);
            if(existe != undefined){
              if(existe.estado == "Inactivo"){
                this.botonFactura = false;
                this.mostrarMensajeGenerico(2,"Ya existe en base un usuario con el mismo RUC inactivo, ingrese otro RUC para poder continuar")
              }
              else
                this.validarEstadoCajaFactura();
            } else 
              this.validarEstadoCajaFactura();

            break;
          case "Nota de Venta":
            var existe = this.clientesGenerales.find(x=> x.ruc == this.factura.cliente.ruc);
            if(existe != undefined){
              if(existe.estado == "Inactivo"){
                this.botonNotaVenta = false;
                this.mostrarMensajeGenerico(2,"Ya existe en base un usuario con el mismo RUC inactivo, ingrese otro RUC para poder continuar")
              }
              else
                this.validarEstadoCajaNotaVenta();
            } else 
              this.validarEstadoCajaNotaVenta();
            break;
          case "Cotización":
            break;
          default:
            break;
        }
      }else{
        Swal.fire({
          title: 'Error',
          text: 'El código ingresado no corresponde a ningun usuario',
          icon: 'error',
          confirmButtonText: 'Ok'
        }).then((result) => {
          this.mostrarPopupCodigo();
        })
      }
    })
  }


  traerUsuarios(){
    this.userService.getUsers().subscribe(res => {
      this.usuarios= res as user[];
    },err => {})
  }

  validarRol(){
    if(this.usuarioLogueado[0].rol == "Administrador")
      this.isAdmin = true;
  }
  

  traerSucursales(){
    this.sucursalesService.getSucursales().subscribe(res => {
      this.sucursales = res as sucursal[];
   })
  }

  traerProductos(){
    this.mostrarLoading = true;
    this.productoService.getProductosActivos().subscribe(res => {
      this.productosActivos = res as producto[];
      this.llenarPR()
      this.llenarComboProductos()
   })
  }

  traerProductosCatalogo(){
    this.catalogoService.getCatalogo().subscribe(res => {
      this.productosCatalogo = res as catalogo[];
   })
  }

  traerClientes(){
    this.clienteService.getCliente().subscribe(res => {
      this.clientesGenerales = res as cliente[];
      this.separarClientes()
   })
  }

  traerProformas(){
    this.proformasService.getProformas().subscribe(res => {
      this.proformas = res as factura[];
   })
  }

  traerFacturas(){
    this.facturasService.getFacturas().subscribe(res => {
      this.facturas = res as factura[];
   })
  }

  traerPrecios(){
    this.preciosService.getPrecio().subscribe(res => {
      this.precios = res as precios[];
   })
  }

  traerPreciosEspeciales(){
    this.preciosEspecialesService.getPrecio().subscribe(res => {
      this.preciosEspeciales = res as preciosEspeciales[];
   })
  }

  traerParametrizaciones(){
    this.parametrizacionService.getParametrizacion().subscribe(res => {
      this.parametrizaciones = res as parametrizacionsuc[];
      this.buscarDatosSucursal()
   })
  }

  traerProductosVendidos(){
    this.productosVenService.getProductoVendido().subscribe(res => {
      this.productosVendidos2 = res as venta[];
   })
  }

  async traerContadores(){
    await this.contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
   })
  }


  traerContadoresDocumentos(){
    this.contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
      this.numeroID = this.contadores[0].contProductosPendientes_Ndocumento+1
      this.asignarIDdocumentos();
   })
  }



  traerConsecutivoVeronica(ruc : string){
    this._apiVeronicaService.obtenerSecuencia(ruc).subscribe(
      res => {  this.consecutivoVeronica = res as ConsecutivoDto
                this.secuencialFactura = this.consecutivoVeronica.result[0].establecimiento.puntosEmision[0].secuencialFactura
        },
      err => { this.mostrarMensajeGenerico(2,"No se ha podido establecer conexión con el SRI")});
  }



  asignarIDdocumentos(){
    switch (this.factura.tipoDocumento) {
      case "Factura":
        switch (this.factura.sucursal) {
          case "matriz":
            this.factura.documento_n =this.contadores[0].facturaMatriz_Ndocumento+1
            this.numeroFactura2=this.contadores[0].facturaMatriz_Ndocumento+1
            console.log(this.factura.documento_n)
            break;
          case "sucursal1":
            this.factura.documento_n =this.contadores[0].facturaSucursal1_Ndocumento+1
            this.numeroFactura2=this.contadores[0].facturaSucursal1_Ndocumento+1
            break;
          case "sucursal2":
            this.factura.documento_n =this.contadores[0].facturaSucursal2_Ndocumento+1
            this.numeroFactura2=this.contadores[0].facturaSucursal2_Ndocumento+1
            break;
          default:
            break;
        }
        break;
      case "Nota de Venta":
        this.factura.documento_n = this.contadores[0].notasVenta_Ndocumento+1 
        break;
      case "Cotización":
        this.factura.documento_n = this.contadores[0].proformas_Ndocumento+1 
        break;
      default:
        break;
    }
        
    this.number_transaccion = this.contadores[0].transacciones_Ndocumento 
  }


  separarClientes(){
    this.clientes = this.clientesGenerales.filter(x=> x.estado != "Inactivo");
    this.clientesMaestros = this.clientes.filter(x=> x.tventa == "Maestro");
  }


  asignarIDFactura(tipoFac:string){
    switch (tipoFac) {
      case "Factura":
        switch (this.factura.sucursal) {
          case "matriz":
            this.factura.documento_n =this.contadores[0].facturaMatriz_Ndocumento+1
            this.numeroFactura2=this.contadores[0].facturaMatriz_Ndocumento+1
            console.log(this.factura.documento_n)
            break;
          case "sucursal1":
            this.factura.documento_n =this.contadores[0].facturaSucursal1_Ndocumento+1
            this.numeroFactura2=this.contadores[0].facturaSucursal1_Ndocumento+1
            break;
          case "sucursal2":
            this.factura.documento_n =this.contadores[0].facturaSucursal2_Ndocumento+1
            this.numeroFactura2=this.contadores[0].facturaSucursal2_Ndocumento+1
            break;
          default:
            break;
        } 
        break;
      case "Nota de Venta":
        this.factura.documento_n = this.contadores[0].notasVenta_Ndocumento+1 
        break;
      case "Cotización":
        this.factura.documento_n = this.contadores[0].proformas_Ndocumento+1 
        break;
      default:
        break;
    }
  }

  anadirProducto = (e) => {
    this.newButtonEnabled = true
    this.contadoProductos=0
    this.productosVendidos.forEach(element=>{
      this.contadoProductos++
    })
    
    if(this.contadoProductos<=11){
      this.productosVendidos.push(new venta())
    }else{
      Swal.fire(
        'Alerta',
        'Ya no se pueden ingresar mas items',
        'warning'
      )
    }
    if(this.contadoProductos>=5 && this.contadoProductos<=10){
      this.dataContainer.cssClass="altura1"
    }else if(this.contadoProductos>=11 && this.contadoProductos<=15){
      this.dataContainer.cssClass="altura2"
    }else if(this.contadoProductos>=16 && this.contadoProductos<=20){
      this.dataContainer.cssClass="altura3"
    }else if(this.contadoProductos>=21 && this.contadoProductos<=25){
      this.dataContainer.cssClass="altura4"
    }else if(this.contadoProductos>=26){
      this.dataContainer.cssClass="altura5"
    }

    
  }

  verCalculadora(e) {
    this.visibleCalculadora = true
    if(this.productosVendidos[this.productosVendidos.length - 1].producto != undefined){
      this.sePuedeCalcular=true
    }
    else{
      this.sePuedeCalcular = true;
    }
  }

  opcionMenu(e){
    var x = document.getElementById("op1");
    var y = document.getElementById("op2");

    switch (e.value) {
      case "De cajas a m2":
        x.style.display = "block";
        y.style.display="none";
       break;

      case "De m2 a cajas":
        x.style.display = "none";
        y.style.display="block";
        break;
      default:    
    }     
    }


stringIsNumber(s) {
    var x = +s; // made cast obvious for demonstration
    return x.toString() === s;
}

  ct:string = ""
  selected:number
  //VA A COGER SIEMPRE EL ULTIMO

obtenerTipoDocumento(e){
  if(e.value == "Factura"){
    this.botonFactura= false
    this.botonNotaVenta= true
    this.botonCotizacion= true
    this.asignarIDFactura(e.value);
    this.tDocumento= e.value
    this.factura.tipoDocumento= e.value
    
  }else if(e.value == "Nota de Venta"){
    this.botonFactura= true
    this.botonNotaVenta= false
    this.botonCotizacion= true
    this.selectAct=true
    this.asignarIDFactura(e.value);
    this.tDocumento= e.value
    this.factura.tipoDocumento= e.value
  }else if(e.value == "Cotización"){
    this.botonFactura= true
    this.botonNotaVenta= true
    this.botonCotizacion= false
    this.asignarIDFactura(e.value);
    this.tDocumento= e.value
    this.factura.tipoDocumento= e.value
    this.productosVendidos.forEach(element=>{
      element.tipoDocumentoVenta=e.value
    })
  }
}


mostrarPopup(e,i:number){
  if(this.productosVendidos[i].producto.CLASIFICA == "COMBO"){
    this.nombreCombo = this.productosVendidos[i].producto.PRODUCTO
    var combo = new ProductoCombo();
    combo.PRODUCTO = this.productosVendidos[i].producto.PRODUCTO;
    this.mensajeLoading = "Cargando Productos.."
    this.mostrarLoading = true;
    this._comboService.getComboPorNombre(combo).subscribe(res => {
      var listado = res as ProductoCombo[];
      this.productosComboLeidos = listado[0].productosCombo 
      this.mostrarLoading = false;
    })
     this.popupVisibleCombos = true;

  }else{
    this.productosCatalogo.forEach(element=>{
      if(element.PRODUCTO== this.productosVendidos[i].producto.PRODUCTO){
        this.imagenes= element.IMAGEN
        this.titulo=element.PRODUCTO
        this.catalogoLeido = element
        this.catalogoLeido.precio = this.productosVendidos[i].producto.precio
        this.catalogoLeido.ubicacion1 = this.productosVendidos[i].producto.ubicacionSuc1
        this.catalogoLeido.ubicacion2 = this.productosVendidos[i].producto.ubicacionSuc2
        this.catalogoLeido.ubicacion3 = this.productosVendidos[i].producto.ubicacionSuc3
         this.disponibilidadProducto = "MATRIZ: "+
                                      this.productosVendidos[i].cantM2_1_Original.toFixed(2)+"M /-/ "+
                                      this.productosVendidos[i].cantCajas_1_Original.toFixed(0)+"C /-/ "+
                                      this.productosVendidos[i].cantPiezas_1_Original.toFixed(0)+"P"
        this.disponibilidadProductoS1 = "SUC1: "+
                                      this.productosVendidos[i].cantM2_2_Original.toFixed(2)+"M /-/ "+
                                      this.productosVendidos[i].cantCajas_2_Original.toFixed(0)+"C /-/ "+
                                      this.productosVendidos[i].cantPiezas_2_Original.toFixed(0)+"P"
        this.disponibilidadProductoS2 = "SUC2: "+
                                      this.productosVendidos[i].cantM2_3_Original.toFixed(2)+"M /-/ "+
                                      this.productosVendidos[i].cantCajas_3_Original.toFixed(0)+"C /-/ "+
                                      this.productosVendidos[i].cantPiezas_3_Original.toFixed(0)+"P"
        
        this.flagDisProdMatriz =  this.productosVendidos[i].cantM2_1_Original < 0 ? true : false;
        this.flagDisProdSuc1 =  this.productosVendidos[i].cantM2_2_Original < 0 ? true : false;
        this.flagDisProdSuc2 =  this.productosVendidos[i].cantM2_3_Original < 0 ? true : false;
      }
    })
    this.popupvisible=true 
  }
  
}

setSelectedProducto(i:number){
  this.selected=i 
}

  calcularMetros(e) {
    this.caltotal=parseFloat(((this.calmetros*this.cantidadcal)+(((this.valorEnM2)*this.calmetros)/this.calp)).toFixed(2))
  }

  calcularMetros2(e) {
    this.cantidadcal=Math.trunc((this.caltotal+0.01) / this.calmetros);
    this.valorEnM2=Math.trunc((this.caltotal+0.01) * this.calp / this.calmetros) - (this.cantidadcal * this.calp);  
  }

  obtenerDatosCalculadora(e){
    this.productos2.forEach(element=>{
      if(element.PRODUCTO == e.value){
        this.calp=element.P_CAJA
        this.calmetros=element.M2
      }
    })
    this.calcularMetros(e)
  }


  obtenerDatosCalculadora2(e){
    this.productos2.forEach(element=>{
      if(element.PRODUCTO == e.value){
        this.calp=element.P_CAJA
        this.calmetros=element.M2
      }
    })
    this.calcularMetros2(e)
  }

   obtenerDatosDeProductoParaUnDetalle(e, i:number) {
    //this.productosVendidos[i].precio_venta = 0;
    this.productosVendidos[i].total = 0;
    this.newButtonEnabled = false
    var cont=0
    this.productosVendidos.forEach(element=>{
      if(element.producto.PRODUCTO == e.value)
        cont++
    })

    if(cont==0){
      this.productos.forEach(element => {
        if (element.PRODUCTO == e.value) {
          if(element.CLASIFICA == "COMBO")
            this.buscarCombo(e.value, i)
          else
            this.traerTransaccionesPorProducto(element,i);

          switch (this.factura.sucursal) {
            case "matriz":
              this.productosVendidos[i].disponible = element.sucursal1
              this.productosVendidos[i].producto = element
              break;
            case "sucursal1":
              this.productosVendidos[i].disponible = element.sucursal2
              this.productosVendidos[i].producto = element
              break;
            case "sucursal2":
              this.productosVendidos[i].disponible = element.sucursal3
              this.productosVendidos[i].producto = element
              break;
            default:
          }
          if(this.productosVendidos[i].disponible < 0 || this.productosVendidos[i].disponible == null ){
            this.productosVendidos[i].disponible=0
          }
          this.productosVendidos[i].precio_min = parseFloat((element.precio * element.porcentaje_ganancia / 100 + element.precio).toFixed(2))
          this.productosVendidos[i].equivalencia="0C 0P"
          this.productosVendidos[i].tipoDocumentoVenta= this.tDocumento
        }
      })
    }else{
      Swal.fire(
        'Alerta',
        'Ya tiene detallado este producto',
        'warning'
      )
      this.deleteProductoVendido(i)
    } 
    this.calcularEquivalencia(e,i);
  }


  getClientNames(){
    let names = []
    this.clientes.forEach(element => {
      names.push(element.cliente_nombre)    
    });
    return names
  }


  buscarCombo(nombreCombo, num){
    var combo = new ProductoCombo();
    combo.PRODUCTO = nombreCombo;
    this._comboService.getComboPorNombre(combo).subscribe(res => {
      var listado = res as ProductoCombo[];
      this.buscarProductosCombo(listado[0].productosCombo, num);
    })
  }

  buscarProductosCombo(listado : productosCombo[], num : number){   
    this.mostrarLoading = true;
    this.cantidadProductos = 0; 
    listado.forEach(element => {
      this.productos.forEach(element2 => {
        if(element.nombreProducto == element2.PRODUCTO)
          this.traerTransaccionesPorProductoCombo2(element2, num , listado.length, element)
      });
    });
  }

  getClientRUC(){
    let clientesruc = []
    this.clientes.forEach(element => {
      clientesruc.push(element.ruc)    
    });
    return clientesruc
  }


  deleteProductoVendido(i){
    this.newButtonEnabled = false
    if(this.productosVendidos.length > 1){
    this.productosVendidos.splice(i,1);
    this.calcularTotalFactura()
    }
    else{
      alert("Las facturas deben tener al menos un producto")
    }
  }


  calcularTransporte(){
    this.costoTr=true
    this.calcularTotalFactura();
  }

  ngAfterViewChecked(){
    this.cdRef.detectChanges();
  }

  setClienteData(e){
    this.clientes.forEach(element => {
        if(element.cliente_nombre == e.component._changedValue){
          //if(this.factura.cliente == undefined){
            this.factura.cliente = element
            this.factura.cliente.cliente_nombre= element.cliente_nombre
            this.factura.cliente.direccion = element.direccion
            this.factura.cliente.celular = element.celular
            this.factura.tipo_venta= element.tventa
            this.factura.cliente.nombreContacto=element.nombreContacto
          //}
          /* else{
            if(this.factura.cliente.tventa == element.tventa){
              this.factura.cliente = element
              this.factura.cliente.cliente_nombre= element.cliente_nombre
              this.factura.cliente.direccion = element.direccion
              this.factura.cliente.celular = element.celular
              this.factura.tipo_venta= element.tventa
              this.factura.cliente.nombreContacto=element.nombreContacto
              
            }
            else {
              Swal.fire({
                title: 'Error tipo Cliente',
                text: "El nuevo cliente ingresado tiene un tipo diferente al inicial. Desea Cambiar de cliente?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No'
              }).then((result) => {
                if (result.value) {
                  this.productosVendidos = []
                  this.productosVendidos.push(new venta)
                  this.factura.cliente = element
                  this.factura.cliente.cliente_nombre= element.cliente_nombre
                  this.factura.cliente.direccion = element.direccion
                  this.factura.cliente.celular = element.celular
                  this.factura.tipo_venta= element.tventa
                  this.factura.cliente.nombreContacto=element.nombreContacto    
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  console.log("entre false")
                  this.factura.cliente = this.factura.cliente
                  this.mensaje = this.factura.cliente.cliente_nombre
                }             
              })
            }
          } */
        
      }
    }); 
    this.rucAnterior = this.factura.cliente.ruc
    this.calcularTipoCliente(); 
  }


  asignarMaestro(e){
    this.factura.maestro = e.value
  }

  buscarClienteExistente(e){
    console.log(e.value)
  }

  asignarUsuario(e){
    this.factura.username = e.value
  }
      
      
  asignarsucursalD(e){
    this.factura.sucursal= e.value
    if(this.productosVendidos.length >= 1 && this.productosVendidos[0].producto.PRODUCTO!=undefined){
      Swal.fire({
        title: 'Cambiar de sucursal',
        text: 'Desea cambiar de sucursal, se eliminará los productos detallados',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.limpiarArreglo()
          this.asignarIDdocumentos()
          this.buscarDatosSucursal()
          this.productosVendidos.push(new venta())
        }
      
      })
    }else{
      this.asignarIDdocumentos()
      this.buscarDatosSucursal()
    }        
  }

  limpiarArreglo(){
    var cont=0
    this.productosVendidos.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.productosVendidos.forEach(element=>{
        this.productosVendidos.splice(0)
        
      })
    }
  }

  eliminarData(e){
    this.factura.cliente = null
    this.mensaje=null

    /* Swal.fire({
        title: 'Borrar Datos Cliente',
        text: "Está seguro que desea eliminar los datos del cliente?. Si elimina los datos se eliminaran los productos listados",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.factura.cliente = null
          this.mensaje=null
          this.factura.tipo_venta = "Normal"
          this.productosVendidos = [];
          this.productosVendidos.push(new venta());
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          console.log("nada")
        }
      }) */
  }
      
  buscarCliente(e){
    this.clientes.forEach(element => {
        if( this.factura.cliente.ruc == element.ruc){
          this.factura.cliente = element
        this.factura.cliente.cliente_nombre = element.cliente_nombre
        this.factura.cliente.direccion = element.direccion
        this.factura.cliente.celular = element.celular
        this.mensaje=element.cliente_nombre
      }
    });
    this.calcularTipoCliente();  
  }
      
      
  guardarDatosCliente(){
    this.factura.cliente.t_cliente= this.factura.tipo_cliente
    this.factura.cliente.tventa= this.factura.tipo_venta
  }

  mostrarDivUbicaciones(){
    var x = document.getElementById("bodegUbi");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }
      

  calcularTipoCliente(){

    this.factura.cliente.cliente_nombre =  this.factura.cliente.cliente_nombre
    this.factura.cliente.direccion =  this.factura.cliente.direccion
    this.factura.cliente.celular = this.factura.cliente.celular
    let contador=0
    this.facturas.forEach(element => {
      if(element.dni_comprador == this.factura.cliente.ruc){
        this.totalcomprador=this.totalcomprador + element.total
        contador++;
      }
    });
    if(this.totalcomprador>=0 && this.totalcomprador<=100 ){
      this.factura.tipo_cliente="C"+contador
    }
    else if(this.totalcomprador>=101 && this.totalcomprador<=500){
      this.factura.tipo_cliente="B"+contador
    }
    else if(this.totalcomprador>=501 && this.totalcomprador<=1000){
      this.factura.tipo_cliente="A"+contador
    }
    else if(this.totalcomprador>=1001 && this.totalcomprador<=3000){
      this.factura.tipo_cliente="AA"+contador
    }
    else if(this.totalcomprador>=3000){
      this.factura.tipo_cliente="AAA"+contador
    }
    else {
      this.factura.tipo_cliente="C"
    }
  }

  carcularTotalProducto(e, i:number) {
    this.calcularTotalRow(i)
    this.calcularTotalFactura()
  }

  

  diferenciaEntreDiasEnDias(a, b)
    {
      var fFecha1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      var fFecha2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    var dif = fFecha2 - fFecha1;
    var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
    return dias;
    }

  mostrarDiv(){
    this.sectionSearch = !this.sectionSearch;
    if(this.proformas.length == 0)
      this.traerProformas()
    if(this.productosVendidos2.length == 0)
      this.traerProductosVendidos()
  }


  calcularDescuento(e,i:number){
    let calculo= ((this.productosVendidos[i].descuento/100) * this.productosVendidos[i].subtotal);
    this.factura.totalDescuento = this.factura.totalDescuento+calculo;
    let calculoTotal=0
    let calculoConDescuento=0
    calculoTotal= this.productosVendidos[i].precio_min *this.productosVendidos[i].cantidad
    calculoConDescuento=  this.productosVendidos[i].total -( this.productosVendidos[i].total*(this.productosVendidos[i].descuento/100))
    if(calculoTotal > calculoConDescuento){
      this.productosVendidos[i].descuento= 0
      Swal.fire(
        'Alerta',
        'Se paso el limite de descuento',
        'error'
      )
      this.productosVendidos[i].descuento= 0
      
    }else{
      this.calcularTotalRow(i)
    this.calcularTotalFactura()
    }


    
  }

  calcularDisponibilidadProducto(e, i:number) {
    this.calcularPrecioMinino(e,i)
    var cant=0
    this.productosSolicitados=this.productosVendidos[i].disponible-this.productosVendidos[i].cantidad
    this.calcularTotalFactura()
    if(this.productosVendidos[i].producto.CLASIFICA != "OTR"){
      if(this.productosVendidos[i].cantidad > this.productosVendidos[i].disponible ){
        cant= this.productosVendidos[i].cantidad - this.productosVendidos[i].disponible
        this.showModal(e,i)
        this.calcularEquivalencia(e, i)
        this.calcularTotalFactura()
        this.productosVendidos[i].entregar = false
        this.productosVendidos[i].pedir = true
        
      }else
        this.productosVendidos[i].entregar= true
    } 
  }

  calcularPrecioMinino(e, i:number){
    
    switch (this.factura.tipo_venta) {
      case "Normal":
        this.productosVendidos[i].producto
        this.precios.forEach(element=>{
          if(element.aplicacion == this.productosVendidos[i].producto.APLICACION){
            if(this.productosVendidos[i].cantidad >0 && this.productosVendidos[i].cantidad <=element.cant1){
              this.productosVendidos[i].precio_min = parseFloat((this.productosVendidos[i].producto.precio * element.percent1 / 100 + this.productosVendidos[i].producto.precio).toFixed(2))
              
            }
            if(this.productosVendidos[i].cantidad >element.cant1 && this.productosVendidos[i].cantidad <=element.cant2){
              this.productosVendidos[i].precio_min = parseFloat((this.productosVendidos[i].producto.precio * element.percent2 / 100 + this.productosVendidos[i].producto.precio).toFixed(2))
            
            }

            if(this.productosVendidos[i].cantidad >element.cant2){
              this.productosVendidos[i].precio_min = parseFloat((this.productosVendidos[i].producto.precio * element.percent3 / 100 + this.productosVendidos[i].producto.precio).toFixed(2))
            }
          }
        })
        console.log(this.productosVendidos[i].precio_min)
        
        break;
      case "Distribuidor":
        this.productosVendidos[i].precio_min = parseFloat((this.productosVendidos[i].producto.precio * this.preciosEspeciales[0].precioDistribuidor / 100 + this.productosVendidos[i].producto.precio).toFixed(2))
        
        break;
      case "Socio":
        this.productosVendidos[i].precio_min = parseFloat((this.productosVendidos[i].producto.precio * this.preciosEspeciales[0].precioSocio / 100 + this.productosVendidos[i].producto.precio).toFixed(2))
        
        break;
    
      default:
        break;
    }
    
  }

calcularTotalFactura(){
  this.factura.total = 0
  this.factura.subtotalF1 =0
  this.factura.subtotalF2 =0
  this.factura.totalIva =0

  this.productosVendidos.forEach(element => {
    if(element.seleccionado)
    this.factura.total = element.subtotal + this.factura.total
    this.factura.subtotalF1= element.subtP1+this.factura.subtotalF1
    this.factura.subtotalF2= element.subtP2+this.factura.subtotalF2
    this.factura.totalIva= element.subtIva+this.factura.totalIva
  });
  this.factura.total=parseFloat((this.factura.total+ this.factura.coste_transporte).toFixed(2)) 

}

calcularTotalFacturaconTransporte(){
  this.cont++;
  this.factura.total=this.factura.total+ this.factura.coste_transporte
}

llenarPR(){
  this.productosActivos.forEach(element=>{
    if(element.UNIDAD == "Metros"){
      this.productos2.push(element)
    }
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
  this.mostrarLoading = false;
}


buscarCotizacion(){
  this.mensajeLoading = "Buscando Proforma..."
  this.mostrarLoading = true;
  var proforma = new factura();
  proforma.documento_n = this.Ncotizacion
  this.proformasService.getProformaPorId(proforma).subscribe(res => {
      var proform = res as factura[];
      if(proform.length != 0){
        this.factura.cliente = proform[0].cliente
        this.factura.cliente.celular= proform[0].cliente.celular
        this.factura.cliente.cliente_nombre= proform[0].cliente.cliente_nombre
        this.mensaje= proform[0].cliente.cliente_nombre
        this.factura.cliente.direccion= proform[0].cliente.direccion
        this.factura.cliente.ruc= proform[0].cliente.ruc
        this.factura.tipo_cliente= proform[0].cliente.t_cliente
        this.factura.tipo_venta= proform[0].cliente.tventa
        this.factura.cliente.t_cliente= proform[0].cliente.t_cliente
        this.factura.cliente.tventa= proform[0].cliente.tventa
        this.factura.total= proform[0].total
        this.factura.totalDescuento= proform[0].totalDescuento
        this.factura.coste_transporte= proform[0].coste_transporte
        this.factura.observaciones= proform[0].observaciones
        this.factura.cotizacion= proform[0].documento_n
        this.productosVendidos=  proform[0].productosVendidos  
        this.nCotizacionFact ="Referecia Cotización: #"+ proform[0].documento_n
        if(this.productosVendidos.length>=5 && this.productosVendidos.length<=10){
          this.dataContainer.cssClass="altura1"
        }else if(this.productosVendidos.length>=11 && this.productosVendidos.length<=15){
          this.dataContainer.cssClass="altura2"
        }else if(this.productosVendidos.length>=16 && this.productosVendidos.length<=20){
          this.dataContainer.cssClass="altura3"
        }

        this.mostrarLoading = false;
        this.buscarCantidadesPRODUCTOS()
        this.newButtonEnabled = false
        this.costoTr=true
      }else{
        this.mostrarLoading = false;
        this.mostrarMensajeGenerico(2,"No se encontro ningun registro con el número ingresado")
      }
      
   })

}



buscarCantidadesPRODUCTOS(){
  var contP=0
  this.productosVendidos.forEach(element=>{
    this.productos.forEach(element2=>{
      if(element.producto.PRODUCTO == element2.PRODUCTO){
        switch (this.factura.sucursal) {
          case "matriz":
            element.disponible=element2.sucursal1
            if(element.disponible<0){
              element.disponible=0
            }
            element.precio_min =parseFloat((element2.precio * element2.porcentaje_ganancia / 100 + element2.precio).toFixed(2))
            
            break;
          case "sucursal1":
            element.disponible=element2.sucursal2
            if(element.disponible<0){
              element.disponible=0
            }
            element.precio_min =parseFloat((element2.precio * element2.porcentaje_ganancia / 100 + element2.precio).toFixed(2))
            //this.carcularTotalProducto(null,contP);
            break;
          case "sucursal2":
            element.disponible=element2.sucursal3
            if(element.disponible<0){
              element.disponible=0
            }
            element.precio_min =parseFloat((element2.precio * element2.porcentaje_ganancia / 100 + element2.precio).toFixed(2))
            break;
          default:
        }
      }
      
    })
  })
  this.compararCantidad2()
}

async compararCantidad2(){
  var cont=0
  await this.productosVendidos.forEach(element=>{
    cont++
    
    if(element.disponible<element.cantidad){
      Swal.fire({
        title: 'Cantidad no disponible',
        text: "Desea hacer un pedido del producto "+element.producto.PRODUCTO,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          Swal.fire(
            'Producto solicitado!',
            'Tu producto ha sido añadido con éxito',
            'success'
            
          )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelado!',
            'Se ha cancelado su orden.',
            'error'
          )
          this.deleteProductoVendido(cont-2)
        }
      })
    }
    this.carcularTotalProducto(null,cont);
  })
}

compararCantidad(nombre:string,i:number,o:number){
  this.productos.forEach(element=>{
    if(nombre==element.PRODUCTO){
      this.productosVendidos[o-1].disponible=element.cantidad
        if(i>element.cantidad){
        
          Swal.fire({
            title: 'Cantidad no disponible',
            text: "Desea hacer un pedido del producto "+element.PRODUCTO,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.value) {
              Swal.fire(
                'Producto solicitado!',
                'Tu producto ha sido añadido con éxito',
                'success'
              )

            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                'Cancelado!',
                'Se ha cancelado su orden.',
                'error'
              )
              this.deleteProductoVendido(0)
            }
          })

        }
    }
  })
}



actualizarProductos(){
 var resta =0
 new Promise<any>((resolve, reject) => {
  this.productosVendidos.forEach(element=>{
    switch (this.factura.sucursal) {
      case "matriz":
        resta =0
        resta =element.producto.sucursal1-element.cantidad
        element.producto.sucursal1=resta
        this.productoService.updateProductoSucursal1(element.producto).subscribe( res => {console.log(res + "entre por si");}, err => {})
        break;
      case "sucursal1":
        resta =0
        resta =element.producto.sucursal2-element.cantidad
        element.producto.sucursal2=resta
        this.productoService.updateProductoSucursal2(element.producto).subscribe( res => {console.log(res + "entre por si");}, err => {})
        break;
      case "sucursal2":
        resta =0
        resta =element.producto.sucursal3-element.cantidad
        element.producto.sucursal3=resta
        this.productoService.updateProductoSucursal3(element.producto).subscribe( res => {console.log(res + "entre por si");}, err => {})
        break;
      default:
    }
})
 })
 
}

validarentrada(i:number){
  if(this.productosVendidos.length==i){
    this.crearPDF()
      
  }else{
    console.log("no he entrado productos acru"+i)
  }

}



cambiarEstadoSeleccionado(e){
  this.calcularTotalFactura()
}

opcionRadio(e){
  this.formaPago = e.value;
}

cambiarestado(e,i:number){
    if(e.value == true){
      this.productosVendidos[i].entregar=true
    }else{
      this.productosVendidos[i].entregar=false
    }
}

  calcularEquivalencia(e, i:number) {
    this.productos.forEach(element => {
      if(element.PRODUCTO == this.productosVendidos[i].producto.PRODUCTO){
        let cajas = Math.trunc((this.productosVendidos[i].cantidad+0.01) / element.M2);
        let piezas = Math.trunc((this.productosVendidos[i].cantidad+0.01) * element.P_CAJA / element.M2) - (cajas * element.P_CAJA);
        if(this.productosVendidos[i].producto.CLASIFICA == "Ceramicas" || this.productosVendidos[i].producto.CLASIFICA == "Porcelanatos" || this.productosVendidos[i].producto.CLASIFICA == "Porcelanato"){
          if(this.productosVendidos[i].producto.CLASIFICA == "Porcelanato")
            this.productosVendidos[i].producto.CLASIFICA = "Porcelanatos"

          var confProd = this.listaParametrizaciones.find(x=> x.nombreGrupo == this.productosVendidos[i].producto.CLASIFICA)
          if(confProd != null){
            if(cajas >= confProd.cajasLimite && piezas >= confProd.piezasRestantes)
              piezas = piezas - confProd.piezasRestantes
          }
          this.productosVendidos[i].equivalencia = cajas + "C " + piezas + "P"
        }
        else
          this.productosVendidos[i].equivalencia = cajas + "C " + piezas + "P"
      }
    })

  }

  calcularTotalRow(i:number) {
    this.productosVendidos[i].total = parseFloat((this.productosVendidos[i].cantidad * this.productosVendidos[i].precio_venta).toFixed(2))
    this.productosVendidos[i].subtotal=  this.productosVendidos[i].total -( this.productosVendidos[i].total*(this.productosVendidos[i].descuento/100))  

    if(this.productosVendidos[i].iva){
        this.productosVendidos[i].subtP2=this.productosVendidos[i].subtotal/1.12
        this.productosVendidos[i].subtP1=this.productosVendidos[i].total/1.12
        this.productosVendidos[i].subtIva=this.productosVendidos[i].subtotal-(this.productosVendidos[i].subtotal/1.12)
    }else{
      this.productosVendidos[i].subtP2=this.productosVendidos[i].subtotal
      this.productosVendidos[i].subtP1=this.productosVendidos[i].total
      this.productosVendidos[i].subtIva=0
    }
  }

  cerrar(){
    Swal.close()
  }


  enviar(num:number){
    this.imagenPrincipal= this.imagenesData[num]
  }

  verGaleria(imagenes:string[]){
    this.popupvisible=false
    this.popupVi=true
     this.imagenesData=imagenes
     this.imagenPrincipal= this.imagenesData[0]
  }

  mostrarMensaje(){
    let timerInterval
      Swal.fire({
        title: 'Guardando Documento!',
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
            title: this.tDocumento+' guardada',
            text: 'Su '+this.tDocumento+' fue guardada con éxito',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            window.location.reload()
          })
        }
      })
  }

  mostrarMensaje2(){
    let timerInterval
      Swal.fire({
        title: 'Guardando Documento!',
        html: 'Procesando',
        timer:3000,
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
            title: this.tDocumento+' guardada',
            text: 'Su '+this.tDocumento+' fue guardada con éxito',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            window.location.reload()
          })
        }
      })
  }


  showModal(e,i:number){
   
    Swal.fire({
      title: 'Cantidad no disponible',
      text: "Desea hacer un pedido del producto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Producto solicitado!',
          'Tu producto ha sido añadido con éxito',
          'success'
          
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su orden.',
          'error'
        )
        this.deleteProductoVendido(i)
      }
    })
    
  }


  crearPDF(){
    if(this.factura.cliente.celular==undefined || this.factura.cliente.celular==null )
      this.factura.cliente.celular="xxxxxxxxxx"

    if(this.tDocumento == "Factura"){
      this.textoTipoDocumento2= "ed.producto.PRODUCTO"
      const documentDefinition = this.getDocumentDefinition();
      var generacion = new Promise<any>((resolve, reject) => {
        pdfMake.createPdf(documentDefinition).download('Factura '+this.variab, function(response) { Swal.close(),
          Swal.fire({
            title: 'Factura guardada',
            text: 'Su factura fue guardada con éxito',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            resolve("listo");
          });
        });
      })

      generacion.then((data) => {
        if(this.formaPago == "Otros medios Pago" || this.formaPago == "Abonos")
          this.router.navigate(['/recibo-caja'], { queryParams: { id: this.factura.documento_n , tipo: 1 } });
        else
          window.location.reload();
      })


    }else if(this.tDocumento == "Nota de Venta"){
      this.textoTipoDocumento= "NOTA DE VENTA 001"
      this.textoTipoDocumento2= "ed.producto.PRODUCTO"
      const documentDefinition = this.getDocumentDefinitionNotaVenta();
      var generacion = new Promise<any>((resolve, reject) => {
        pdfMake.createPdf(documentDefinition).download('Nota/Venta '+this.variab, function(response) { Swal.close(),
          Swal.fire({
            title: 'Nota de Venta guardada',
            text: 'Su nota de Venta fue guardada con éxito',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            resolve("listo");
          });
        });
      })

      generacion.then((data) => {
        if(this.formaPago == "Otros medios Pago" || this.formaPago == "Abonos")
          this.router.navigate(['/recibo-caja'], { queryParams: { id: this.factura.documento_n , tipo: 2 } });
        else
          window.location.reload();
      })
      
    }else if(this.tDocumento == "Cotización"){
      this.textoTipoDocumento= "PROFORMA 001-001-000"
      this.textoTipoDocumento2= "ed.producto.PRODUCTO"
      const documentDefinition = this.getDocumentDefinitionCotizacion();
      pdfMake.createPdf(documentDefinition).download('Proforma '+this.factura.documento_n, function() {  });
      this.mostrarMensaje2()
    }
  }

  setearNFactura(){
    let nf=this.factura.documento_n
    this.variab= this.factura.documento_n
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


  calcularValoresFactura(){
    this.subtotal1=(((this.factura.total+this.factura.coste_transporte)-this.factura.coste_transporte)/1.12)+this.factura.coste_transporte
    this.Sdescuento=this.factura.subtotalF1-this.factura.subtotalF2
    this.subtotal2=this.subtotal1-this.Sdescuento
    this.sIva0= this.factura.coste_transporte;
    this.sIva12=this.subtotal2-this.sIva0
    this.iva= this.sIva12*0.12
  }

     

    getDocumentDefinition() {
      this.calcularValoresFactura()
      sessionStorage.setItem('resume', JSON.stringify("jj"));
      let tipoDocumento="Factura";
      return {
        pageSize: 'A4',
        
        content: [
          {
            columns: [ 
              [
                {
                  columns: [
                    {
                      image:this.imagenLogotipo,
                      width: 100,
                      margin: [0, 0, 0, 0],
                    },
                    {
                      width:290,
                      columns: [          
                                  [
                                    { text: this.parametrizacionSucu.razon_social.toUpperCase(), fontSize:9, alignment: "center", bold: true},
                                    { text: "RUC: "+this.parametrizacionSucu.ruc, fontSize:9, bold: true, alignment: "center"},
                                    { text: "Venta de materiales para acabados de construcción, porcelanatos, cerámicas ", fontSize:6, alignment: "center", margin: [10, 0, 0, 0]},
                                    { text: "Dirección: "+this.parametrizacionSucu.direccion + "      Teléfonos: "+this.parametrizacionSucu.telefonos, fontSize:6, alignment: "center", margin: [10, 0, 0, 0]},       
                                  ],
                      ]
                    },
                    { text: this.textoConsecutivo + " - 0" + this.factura.documento_n, fontSize:12, alignment: "right", bold: true, width:100, margin: [0, 12, 0, 0]},
                  ]
                },
                {
                  style: 'tableExample',
                  table: {
                    type: 'none',
                    widths: [255,105,110],
                    body: [
                            [
                              {
                                type: 'none',
                                stack: [
                                        {
                                          type: 'none',
                                          bold: true,
                                          fontSize:7,
                                          ul: [
                                            'Cliente    : '+this.factura.cliente.cliente_nombre,
                                            'Dirección  : '+this.factura.cliente.direccion,  
                                            'Teléfono   : '+this.factura.cliente.celular,  
                                          ]
                                        }
                                ]
                              },
                              {
                                stack: [
                                        {
                                          type: 'none',
                                          bold: true,
                                          fontSize:7,
                                          ul: [
                                            'RUC      : '+ this.factura.cliente.ruc,
                                            'Sucursal : '+ this.factura.sucursal, 
                                            'Usuario : ' + this.nombreUsuario, 
                                          ]
                                        }
                                ]
                              },
                              {
                                stack: [
                                      {
                                        type: 'none',
                                        bold: true,
                                        fontSize:7,
                                        ul: [
                                          'Fecha Factura  :  '+this.factura.fecha.toLocaleDateString(),
                                          'Vendedor  :  '+this.factura.nombreVendedor,
                                          'RUC/Suc  :  '+this.RucSucursal,
                                        ]
                                      }
                                ]
                              },
                            ]
                    ]
                  },
                },
              ],
            ]
          },
          this.getProductosVendidos(this.productosVendidos),
          {
            style: 'tableExample',
            relativePosition: {
              x: 0,
              y: 177,
            },
            fontSize:8,
            table: {
              type: 'none',
              widths: [325],
              heights:22,
              body: [
                [
                  {
                    stack: [
                      {
                        type: 'none',
                        bold: true,
                        fontSize:6,
                        ul: [
                          {text: "**** DOCUMENTO SIN VALIDEZ TRIBUTARIA **** ", fontSize:10 },
                          {text: "TIPO DE PAGO: "+this.formaPago.toUpperCase(),fontSize:12 },
                          {text: "Nota: Después de salida la mercadería no se aceptan devoluciones",fontSize:9 },
                          "Observaciones :  "+this.factura.observaciones,  
                        ]
                      }
                    ]
                  },
                 
                 
                ]
              ],
            },
            layout: 'noBorders'
            },
            {
              style: 'tableExampleResultados',
              relativePosition: {
                x: 325,
                y: 153,
              },
              fontSize:8,
              table: {
                widths: [75,85],
                body: [
                  [ { text: 'SUBTOTAL', bold: true ,style: "detalleTotales"},{text: this.factura.subtotalF1.toFixed(2), style:"totales" }],
                  [ { text: 'DESCUENTO', bold: true ,style: "detalleTotales"},{text:this.Sdescuento.toFixed(2), style:"totales" } ],
                  [ { text: 'IVA 12%', bold: true ,style: "detalleTotales"},{text: this.factura.totalIva.toFixed(2), style:"totales" } ],
                  [ { text: 'IVA 0%', bold: true ,style: "detalleTotales"},{text:this.sIva0.toFixed(2), style:"totales" } ],
                  [ { text: 'TOTAL US$', bold: true ,style: "detalleTotales"},{text:this.factura.total.toFixed(2), style:"totales" } ]
                ]
              },
            },



            //---------------- COPIA 2 DE FACTURA----------------
            {
              columns: [ 
                [
                  {
                    relativePosition: {
                      x: 0,
                      y: 255,
                    }, 
                    columns: [
                      {
                        image:this.imagenLogotipo,
                        width: 100,
                        margin: [0, 0, 0, 0],
                      },
                      {
                        width:290,
                        columns: [          
                                    [
                                      { text: this.parametrizacionSucu.razon_social.toUpperCase(), fontSize:9, alignment: "center", bold: true},
                                      { text: "RUC: "+this.parametrizacionSucu.ruc, fontSize:9, bold: true, alignment: "center"},
                                      { text: "Venta de materiales para acabados de construcción, porcelanatos, cerámicas ", fontSize:6, alignment: "center", margin: [10, 0, 0, 0]},
                                      { text: "Dirección: "+this.parametrizacionSucu.direccion + "      Teléfonos: "+this.parametrizacionSucu.telefonos, fontSize:6, alignment: "center", margin: [10, 0, 0, 0]},       
                                    ],
                        ]
                      },
                      { text: this.textoConsecutivo + " - 0" + this.factura.documento_n, fontSize:12, alignment: "right", bold: true, width:100, margin: [0, 12, 0, 0]},
                    ]
                  },
                  {
                    style: 'tableExample',
                    relativePosition: {
                      x: 0,
                      y: 290,
                    },
                    table: {
                      type: 'none',
                      widths: [255,105,110],
                      body: [
                              [
                                {
                                  type: 'none',
                                  stack: [
                                    {
                                      type: 'none',
                                      bold: true,
                                      fontSize:7,
                                      ul: [
                                        'Cliente    : '+this.factura.cliente.cliente_nombre,
                                        'Dirección  : '+this.factura.cliente.direccion,  
                                        'Teléfono   : '+this.factura.cliente.celular,  
                                      ]
                                    }
                                  ]
                                },
                                {
                                  stack: [
                                    {
                                      type: 'none',
                                      bold: true,
                                      fontSize:7,
                                      ul: [
                                        'RUC      : '+ this.factura.cliente.ruc,
                                        'Sucursal : '+ this.factura.sucursal, 
                                        'Usuario :  '+ this.nombreUsuario, 
                                      ]
                                    }
                                  ]
                                },
                                {
                                  stack: [
                                    {
                                      type: 'none',
                                      bold: true,
                                      fontSize:7,
                                      ul: [
                                        'Fecha Factura  :  '+this.factura.fecha.toLocaleDateString(),
                                        'Vendedor  :  '+this.factura.nombreVendedor,
                                        'RUC/Suc  :  '+this.RucSucursal,
                                      ]
                                    }
                                  ]
                                },
                              ]
                      ]
                    },
                  }, 
                ],
              ]
            },
           
            
            this.getProductosVendidoscopia(this.productosVendidos),
            {
              style: 'tableExample',
              relativePosition: {
                x: 0,
                y: 520,
              },
              fontSize:8,
              table: {
                type: 'none',
                widths: [325],
                heights:22,
                body: [
                  [
                    {
                      stack: [
                        {
                          type: 'none',
                          bold: true,
                          fontSize:6,
                          ul: [
                            {text: "**** DOCUMENTO SIN VALIDEZ TRIBUTARIA **** ", fontSize:10 },
                            {text: "TIPO DE PAGO: "+this.formaPago.toUpperCase(),fontSize:12 },
                            {text: "Nota: Después de salida la mercadería no se aceptan devoluciones",fontSize:9 },
                            "Observaciones :  "+this.factura.observaciones,  
                          ]
                        }
                      ]
                    },
                  ]
                ],
              },
              layout: 'noBorders'
            },
            {
              style: 'tableExampleResultados',
              relativePosition: {
                x: 325,
                y: 491,
              },
              fontSize:8,
              table: {
                widths: [75,85],
                body: [
                  [ { text: 'SUBTOTAL', bold: true ,style: "detalleTotales"},{text: this.factura.subtotalF1.toFixed(2), style:"totales" }],
                  [ { text: 'DESCUENTO', bold: true ,style: "detalleTotales"},{text:this.Sdescuento.toFixed(2), style:"totales" } ],
                  [ { text: 'IVA 12%', bold: true ,style: "detalleTotales"},{text: this.factura.totalIva.toFixed(2), style:"totales" } ],
                  [ { text: 'IVA 0%', bold: true ,style: "detalleTotales"},{text:this.sIva0.toFixed(2), style:"totales" } ],
                  [ { text: 'TOTAL US$', bold: true ,style: "detalleTotales"},{text:this.factura.total.toFixed(2), style:"totales" } ]
                ]
              },
            },
          
        ],
        footer: function (currentPage, pageCount) {
          return {
            table: {
              body: [
                
                [{text: ''}],
              ]
            },
            layout: 'noBorders'
          };
        }
        , pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
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
            tableExampleResultados: {
              margin: [0, 5, 0, 15],
              alignment: "right"
            },
            bordeTabla:{
              border:1
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
              margin: [0, 0, 5, 0],
              alignment: "right",
            },
            totales2: {
              margin: [0, 0, 5, 0],
              alignment: "right",
            },
            detalleTotales: {
              margin: [15, 0, 0, 0],
              alignment: "left",
            }
          }
      };
    } 






    getDocumentDefinitionCotizacion() {
      this.setearNFactura()
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
          }, 
          {
            columns: [
              [
                { text: this.parametrizacionSucu.razon_social, },
                { text: "RUC: "+this.parametrizacionSucu.ruc, },
                { text: "Fecha de impresión: "+this.factura.fecha, fontSize:10 },
                { text: "Venta de materiales para acabados de construcción, porcelanatos, cerámicas ", fontSize:9 },
                { text: "Dirección: "+this.parametrizacionSucu.direccion, },
                { text: "Teléfonos: "+this.parametrizacionSucu.telefonos, },
                {
                columns: [{
                            width:300,
                            text: " "+this.textoTipoDocumento,
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
                              text: "Fecha de Autorización 29 de Abril 2019 ",
                            },
                            {
                              width:215,
                              text: "Usuario: "+ this.nombreUsuario,
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
                            ''+this.factura.cliente.nombreContacto,
                            ''+this.factura.cliente.direccion,
                            ''+this.factura.cliente.celular,
                            ''+this.mySimpleFormat2,
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
         
          
          this.getProductosVendidosCotizacion(this.productosVendidos),
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
            columns: [{

              type: 'none',
              style: 'tableExample',
                      table: {
                        widths: [250],
                        heights:70,
                        body: [
                          [
                            {text: 'Observaciones:  ' +this.factura.observaciones+ " / "+this.nCotizacionFact},
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


    getDocumentDefinitionNotaVenta() {

      this.calcularValoresFactura()
      return {
        pageSize: 'A4',
        content: [
          {
            columns: [ 
              [
                {
                  columns: [
                    {
                      image:this.imagenLogotipo,
                      width: 100,
                      margin: [0, 0, 0, 0],
                    },
                    {
                      width:290,
                      columns: [          
                                  [
                                    { text: "NOTA DE ENTREGA", fontSize:12, alignment: "center", bold: true},
                                    { text: "Venta de materiales para acabados de construcción, porcelanatos, cerámicas ", fontSize:6, alignment: "center", margin: [10, 0, 0, 0]},
                                    { text: "Dirección: "+this.parametrizacionSucu.direccion + "      Teléfonos: "+this.parametrizacionSucu.telefonos, fontSize:6, alignment: "center", margin: [10, 0, 0, 0]},       
                                  ],
                      ]
                    },
                    { 
                      width:100,
                      columns: [          
                                  [
                                    { text: "** CONSECUTIVO **", fontSize:9, alignment: "right", bold: true},
                                    { text: this.textoConsecutivo + " - 0" + this.factura.documento_n, fontSize:12, alignment: "right", bold: true, margin: [0, 4, 0, 0]},
                                  ],
                      ]
                    },
                    //{ text: this.textoConsecutivo + " - 0" + this.factura.documento_n, fontSize:12, alignment: "right", bold: true, width:100, margin: [0, 12, 0, 0]},
                  ]
                },
                {
                  //Desde aqui comienza los datos del cliente
                  style: 'tableExample',
                  /* relativePosition: {
                    x: 20,
                    y: 65,
                  }, */
                  table: {
                    type: 'none',
                    widths: [255,105,110],
                    body: [
                      [
                        {
                          type: 'none',
                          stack: [
                            {
                              type: 'none',
                              bold: true,
                              fontSize:7,
                              ul: [
                                'Cliente    : '+this.factura.cliente.cliente_nombre,
                                'Dirección  : '+this.factura.cliente.direccion,  
                                'Teléfono   : '+this.factura.cliente.celular,  
                              ]
                            }
                          ]
                        },
                        {
                          stack: [
                            {
                              type: 'none',
                              bold: true,
                              fontSize:7,
                              ul: [
                                'RUC      : '+ this.factura.cliente.ruc,
                                'Sucursal : '+ this.factura.sucursal, 
                                'Usuario : ' + this.nombreUsuario, 
                              ]
                            }
                          ]
                        },
                        {
                          stack: [
                            {
                              type: 'none',
                              bold: true,
                              fontSize:7,
                              ul: [
                                'Fecha N/Venta  :  '+this.factura.fecha.toLocaleDateString(),
                                'Vendedor  :  '+this.factura.nombreVendedor,
                                'RUC/Suc  :  '+this.RucSucursal,
                              ]
                            }
                          ]
                        },
                      ]
                    ]
                },
                },
              
              ],
            ]
          },
         
          
          this.getProductosVendidos(this.productosVendidos),
          {
            //Desde aqui comienza los datos del cliente
            style: 'tableExample',
            relativePosition: {
              x: 0,
              y: 177,
            },
            fontSize:8,
            table: {
              type: 'none',
              widths: [325],
              heights:22,
              body: [
                      [
                        {
                          stack: [
                            {
                              type: 'none',
                              bold: true,
                              fontSize:6,
                              ul: [
                                {text: "TIPO DE PAGO: "+this.formaPago.toUpperCase(),fontSize:12 },
                                {text: "Nota: Después de salida la mercadería no se aceptan devoluciones",fontSize:9 },
                                "Observaciones :  "+this.factura.observaciones,  
                              ]
                            }
                          ]
                        },
                      ]
              ],
            },
            layout: 'noBorders'
          },
          {
            style: 'tableExampleResultados',
            relativePosition: {
              x: 325,
              y: 153,
            },
            fontSize:8,
            table: {
              widths: [75,85],
              body: [
                [ { text: 'SUBTOTAL', bold: true ,style: "detalleTotales"},{text: this.factura.subtotalF1.toFixed(2), style:"totales" }],
                [ { text: 'DESCUENTO', bold: true ,style: "detalleTotales"},{text:this.Sdescuento.toFixed(2), style:"totales" } ],
                [ { text: 'IVA 12%', bold: true ,style: "detalleTotales"},{text: this.factura.totalIva.toFixed(2), style:"totales" } ],
                [ { text: 'IVA 0%', bold: true ,style: "detalleTotales"},{text:this.sIva0.toFixed(2), style:"totales" } ],
                [ { text: 'TOTAL US$', bold: true ,style: "detalleTotales"},{text:this.factura.total.toFixed(2), style:"totales" } ]
              ]
            },
          },




          //---------------- COPIA 2 DE FACTURA----------------
          {
            columns: [ 
              [
                {
                  relativePosition: {
                    x: 0,
                    y: 255,
                  }, 
                  columns: [
                    {
                      image:this.imagenLogotipo,
                      width: 100,
                      margin: [0, 0, 0, 0],
                    },
                    {
                      width:290,
                      columns: [          
                                  [
                                    { text: "NOTA DE ENTREGA", fontSize:12, alignment: "center", bold: true},
                                    { text: "Venta de materiales para acabados de construcción, porcelanatos, cerámicas ", fontSize:6, alignment: "center", margin: [10, 0, 0, 0]},
                                    { text: "Dirección: "+this.parametrizacionSucu.direccion + "      Teléfonos: "+this.parametrizacionSucu.telefonos, fontSize:6, alignment: "center", margin: [10, 0, 0, 0]},       
                                  ],
                      ]
                    },
                    { 
                      width:100,
                      columns: [          
                                  [
                                    { text: "** CONSECUTIVO **", fontSize:9, alignment: "right", bold: true},
                                    { text: this.textoConsecutivo + " - 0" + this.factura.documento_n, fontSize:12, alignment: "right", bold: true, margin: [0, 4, 0, 0]},
                                  ],
                      ]
                    },
                  ]
                },
                {
                //Desde aqui comienza los datos del cliente
                style: 'tableExample',
                relativePosition: {
                  x: 0,
                  y: 290,
                },
                table: {
                  type: 'none',
                  widths: [255,105,110],
                  body: [
                    [
                      {
                        type: 'none',
                        stack: [
                          {
                            type: 'none',
                            bold: true,
                            fontSize:7,
                            ul: [
                              'Cliente    : '+this.factura.cliente.cliente_nombre,
                              'Dirección  : '+this.factura.cliente.direccion,  
                              'Teléfono   : '+this.factura.cliente.celular,  
                            ]
                          }
                        ]
                      },
                      {
                        stack: [
                          {
                            type: 'none',
                            bold: true,
                            fontSize:7,
                            ul: [
                              'RUC      : '+ this.factura.cliente.ruc,
                              'Sucursal : '+ this.factura.sucursal, 
                              'Usuario : ' + this.nombreUsuario, 
                            ]
                          }
                        ]
                      },
                      {
                        stack: [
                          {
                            type: 'none',
                            bold: true,
                            fontSize:7,
                            ul: [
                              'Fecha N/Venta  :  '+this.factura.fecha.toLocaleDateString(),
                              'Vendedor  :  '+this.factura.nombreVendedor,
                              'RUC/Suc  :  '+this.RucSucursal,
                            ]
                          }
                        ]
                      },
                    ]
                  ]
              },
                }, 
              ],
            ]
          },
           
            
            this.getProductosVendidoscopia(this.productosVendidos),
            {
              //Desde aqui comienza los datos del cliente
              style: 'tableExample',
              relativePosition: {
                x: 0,
                y: 520,
              },
              fontSize:8,
              table: {
                type: 'none',
                widths: [325],
                heights:22,
                body: [
                  [
                    {
                      stack: [
                        {
                          type: 'none',
                          bold: true,
                          fontSize:6,
                          ul: [
                            {text: "TIPO DE PAGO: "+this.formaPago.toUpperCase(),fontSize:12 },
                            {text: "Nota: Después de salida la mercadería no se aceptan devoluciones",fontSize:9 },
                            "Observaciones :  "+this.factura.observaciones,  
                          ]
                        }
                      ]
                    },                
                  ]
                ],
              },
              layout: 'noBorders'
              
              },
              {
                style: 'tableExampleResultados',
                relativePosition: {
                  x: 325,
                  y: 491,
                },
                fontSize:8,
                table: {
                  widths: [75,85],
                  body: [
                    [ { text: 'SUBTOTAL', bold: true ,style: "detalleTotales"},{text: this.factura.subtotalF1.toFixed(2), style:"totales" }],
                    [ { text: 'DESCUENTO', bold: true ,style: "detalleTotales"},{text:this.Sdescuento.toFixed(2), style:"totales" } ],
                    [ { text: 'IVA 12%', bold: true ,style: "detalleTotales"},{text: this.factura.totalIva.toFixed(2), style:"totales" } ],
                    [ { text: 'IVA 0%', bold: true ,style: "detalleTotales"},{text:this.sIva0.toFixed(2), style:"totales" } ],
                    [ { text: 'TOTAL US$', bold: true ,style: "detalleTotales"},{text:this.factura.total.toFixed(2), style:"totales" } ]
                  ]
                },
              },
          
        ],
        footer: function (currentPage, pageCount) {
          return {
            table: {
              body: [
                
                [{text: ''}],
              ]
            },
            layout: 'noBorders'
          };
        }
        , pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
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
            tableExampleResultados: {
              margin: [0, 5, 0, 15],
              alignment: "right"
            },
            bordeTabla:{
              border:1
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
              margin: [0, 0, 5, 0],
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


    getProductosPenientesEntrega(productos: productosPendientesEntrega[]) {
      return {
        table: {
          widths: ["10%","10%","80%"],
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
            }
            ],
            
            ...productos.map(ed =>{
              return [ { text: ed.cantM2, alignment: 'center' },{text:ed.producto.UNIDAD,fontSize:8,alignment:"center"},ed.producto.PRODUCTO]; 
            }),
            /* [
              { text: " -- ", alignment: 'center' }, "Servicios de Transporte", { text: " -- ", alignment: 'center' }, { text: " -- ", alignment: 'center' }, {text:this.factura.coste_transporte.toFixed(2), alignment:"right",style:"totales2"} 
            ] */
            
          ]
        }
      };
    }


    getProductosVendidos(productos: venta[]) {
      let productos2:venta[]=[]
      productos.forEach(element=>{
        if(element.pedir==true)
            element.tipoDocumentoVenta="P"
        else
          element.tipoDocumentoVenta="E"
        
        productos2.push(element)
      })
      return {
        relativePosition: {
          x: 0,
          y: 0,
        },
        table: {
          headerRows: 1,
          widths: ["8%","6%","55%","6%","10%","10%"],
          alignment:'center',
          body: [
            
            [{
              text: 'CANT',
              style: 'tableHeader2',
              alignment: 'center'
            },
            {
              text: 'UNID',
              style: 'tableHeader2',
              alignment: 'center'
            },
            {
              text: 'DESCRIPCION',
              style: 'tableHeader2',
              alignment: 'center'
            },
             {
              text: 'EST',
              style: 'tableHeader2', 
              alignment: 'center'
            },
            {
              text: 'P.UNIT',
              style: 'tableHeader2', 
              alignment: 'center'
            },
            {
              text: 'TOTAL',
              style: 'tableHeader2', 
              alignment: 'center'
            },
            ],
            
            ...productos2.map(ed =>{
              return [ { text: ed.cantidad, alignment: 'center',fontSize:8 },
              {text:ed.producto.UNIDAD,fontSize:8,alignment:"center"},
              {text:ed.producto.PRODUCTO,fontSize:8}, 
              {text:ed.entregar ? "ENT":"PTE",fontSize:8, alignment:"center"}, 
              {text:ed.precio_venta.toFixed(2),fontSize:8, alignment:"center"}, 
              {text:ed.total.toFixed(2), alignment:"right",fontSize:8}];
            }),
          ]
        },
        layout: 'headerLineOnly',
      };
    }


    getProductosVendidoscopia(productos: venta[]) {
      let productos2:venta[]=[]
      productos.forEach(element=>{
        if(element.pedir==true){
            element.tipoDocumentoVenta="P"
        }else{
          element.tipoDocumentoVenta="E"
        }
        productos2.push(element)
      })
      return {
        relativePosition: {
          x: 0,
          y: 320,
        },
        table: {
          headerRows: 1,
          widths: ["7%","7%","6%","51%","6%","9%","9%"],
          alignment:'center',
          body: [
            
            [{
              text: 'CANT',
              style: 'tableHeader2',
              alignment: 'center'
            },
            {
              text: 'C/Pcs',
              style: 'tableHeader2',
              alignment: 'center'
            },
            {
              text: 'UNID',
              style: 'tableHeader2',
              alignment: 'center'
            },
            {
              text: 'DESCRIPCION',
              style: 'tableHeader2',
              alignment: 'center'
            },
            {
              text: 'EST',
              style: 'tableHeader2', 
              alignment: 'center'
            },
            {
              text: 'P.UNIT',
              style: 'tableHeader2', 
              alignment: 'center'
            },
            {
              text: 'TOTAL',
              style: 'tableHeader2', 
              alignment: 'center'
            },
            ],
            
            ...productos2.map(ed =>{
              return [ { text: ed.cantidad, alignment: 'center',fontSize:8 },
              {text:ed.equivalencia, alignment:"center",fontSize:8},
              {text:ed.producto.UNIDAD,fontSize:8,alignment:"center"},
              {text:ed.producto.PRODUCTO,fontSize:8}, 
              {text:ed.entregar ? "ENT":"PTE",fontSize:8, alignment:"center"},
              {text:ed.precio_venta.toFixed(2),fontSize:8, alignment:"center"}, 
              {text:ed.total.toFixed(2), alignment:"right",fontSize:8}];
              
            }),
          ]
        },
        layout: 'headerLineOnly',
      };
    }


    getProductosVendidosCajasPiezas(productos: venta[]) {
      return {
        table: {
          widths: ["50%","20%"],
          alignment:'center',
          body: [
            [
            {
              text: 'Producto',
              style: 'tableHeader2'
              , alignment: 'center'
            },
            
            {
              text: 'Cantidad',
              style: 'tableHeader', 
              alignment: 'center'
            }
            ],
            
            ...productos.map(ed =>{
              return [ ed.producto.PRODUCTO,{text:ed.equivalencia, alignment:"center"}];
              
            }),
          ]
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
            

            ],
            
            ...productos.map(ed =>{
              return [ { text: ed.cantidad, alignment: 'center' },{text:ed.producto.UNIDAD,fontSize:8,alignment:"center"},ed.producto.nombre_comercial, {text:ed.precio_venta.toFixed(2), alignment:"center"}, {text:ed.descuento, alignment:"center"}, {text:ed.total.toFixed(2), alignment:"right",style:"totales2"}];
              
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
              text: ' '+this.factura.coste_transporte,
             
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

    validarExistencias(element:venta){
     
      var resta=0
      var sumad=0
      
      if(element.cantidad>element.disponible && element.producto.CLASIFICA != "OTR" ){
        resta=element.cantidad-element.disponible
        this.productoPendienteE = new productosPendientesEntrega
        this.productoPendienteE.cantM2=resta
        
        this.cantidadcal=Math.trunc((this.caltotal+0.01) / this.calmetros);
        this.valorEnM2=Math.trunc((this.caltotal+0.01) * this.calp / this.calmetros) - (this.cantidadcal * this.calp);
        this.productoPendienteE.cajas=Math.trunc((resta+0.01) / element.producto.M2)
        this.productoPendienteE.piezas=Math.trunc((resta+0.01)* element.producto.P_CAJA / element.producto.M2) - ( this.productoPendienteE.cajas * element.producto.P_CAJA);
        this.productoPendienteE.cajasPen= this.productoPendienteE.cajas
        this.productoPendienteE.piezasPen= this.productoPendienteE.piezas
        this.productoPendienteE.cantM2Pen= this.productoPendienteE.cantM2
        this.productoPendienteE.celular=this.factura.cliente.celular
        this.productoPendienteE.cliente=this.factura.cliente.cliente_nombre
        this.productoPendienteE.documento=this.factura.documento_n
        this.productoPendienteE.tipo_documento=this.tDocumento
        this.productoPendienteE.estado="PENDIENTE"
        this.productoPendienteE.fecha= this.factura.fecha.toLocaleString()
        this.productoPendienteE.fechaEntrega=" "
        this.productoPendienteE.id_Pedido=this.numeroID++
        this.productoPendienteE.producto=element.producto
        this.productoPendienteE.sucursal=this.factura.sucursal
        this.productoPendienteE.usuario=this.usuarioLogueado[0].username
        this.productoPendienteE.valor_unitario=element.precio_venta
        this.productoPendienteE.total=resta*element.precio_venta
        this.productoPendienteEntregas.push(this.productoPendienteE)
       
        new Promise<any>((resolve, reject) => {
          switch (this.factura.sucursal) {
            case "matriz":
              sumad=resta+element.producto.suc1Pendiente
              this.productoService.updateProductoPendienteSucursal1(element.producto,sumad ).subscribe( res => {console.log(res + "entre por si");}, err => {})
              break;
            case "sucursal1":
              sumad=resta+element.producto.suc2Pendiente
              this.productoService.updateProductoPendienteSucursal2(element.producto,sumad).subscribe( res => {console.log(res + "entre por si");}, err => {})
              break;
            case "sucursal2":
              sumad=resta+element.producto.suc3Pendiente
              this.productoService.updateProductoPendienteSucursal3(element.producto,sumad).subscribe( res => {console.log(res + "entre por si");}, err => {})
                break;
            default:
          }

          this.productosPendientesService.newProductoPendiente(this.productoPendienteE).subscribe( res => {
            this.contadores[0].contProductosPendientes_Ndocumento=this.numeroID
            this.contadoresService.updateContadoresIDProductosPendientes(this.contadores[0]).subscribe( res => {
              this.db.collection("/consectivosBaseMongoDB").doc("base").update({ contProductosPendientes_Ndocumento:this.contadores[0].contProductosPendientes_Ndocumento})
              .then(res => { }, err => (this.mostrarMensajeGenerico(2,"Error al guardar")));
            },err => {this.mostrarMensajeGenerico(2,"Error al guardar")})
          },err => {this.mostrarMensajeGenerico(2,"Error al guardar")})
        
        })

      }
    }
    

    buscarDatosSucursal(){
      this.parametrizaciones.forEach(element=>{
        if(element.sucursal == this.factura.sucursal){
          this.parametrizacionSucu = element
          console.log(this.parametrizacionSucu)
          this.factura.rucFactura = element.ruc
          this.RucSucursal = element.ruc
          this.textoConsecutivo = element.cabeceraData
          this.traerConsecutivoVeronica(this.RucSucursal)
        }
      })
    }

    crearCliente(){
      if(this.factura.cliente._id) {
        console.log("No actualizo")
        /* this.clienteService.updateClienteDataContacto(this.factura.cliente).subscribe(
          res => {},
          err => {this.mostrarMensajeGenerico(2,"Revise e intente nuevamente")}) */
      } else {
        this.clienteService.newCliente(this.factura.cliente).subscribe(
          res => {},
          err => {this.mostrarMensajeGenerico(2,"Recise e intente nuevamente")})
      }
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
  
  async guardarFactura(){
    this.contadorVenta++
    this.factura.username= this.username
    this.factura.fecha= this.now
    this.factura.fecha2= new Date().toLocaleString()
    this.factura.productosVendidos=this.productosVendidos
    this.facturasService.newFactura(this.factura).subscribe(
      res => {this.validarFormaPago();this.registrarFacturaSRI();this.actualizarFacturero();},
      err => {this.mostrarMensajeGenerico(2,"Error al guardar")});


    
  }
   

  registrarFacturaSRI(){
    this.mensajeLoading = "Enviando Factura SRI"
    this.mostrarLoading = true;
    //--------------INICIO LLENADO DE OBJETO SRI VERONICA--------------------
    this.facturaVeronica.fechaEmision = this.factura.fecha.toLocaleDateString('en-GB', {month: '2-digit',day: '2-digit',year: 'numeric'})
    this.facturaVeronica.ruc = this.parametrizacionSucu.ruc
    this.facturaVeronica.secuencial = this.secuencialFactura
    //this.facturaVeronica.estab = this.factura.sucursal == "matriz" ? "002":"001"
    this.facturaVeronica.estab = this.parametrizacionSucu.nroEstablecimiento

    //******DATOS DEL RECEPTOR********** */
    this.facturaVeronica.receptor = new ReceptorModel()
    this.facturaVeronica.receptor.tipoIdentificacion = this.factura.cliente.ruc.length == 13 ? "04" : "05"
    this.facturaVeronica.receptor.razonSocial = this.factura.cliente.cliente_nombre
    this.facturaVeronica.receptor.identificacion = this.factura.cliente.ruc
    this.facturaVeronica.receptor.direccion = this.factura.cliente.direccion

    //*********DETALLE FACTURA********** */
    this.factura.productosVendidos.forEach(element => {
      var detalle = new ComprobanteDetalle()
        detalle.codigoPrincipal = "000000"
        detalle.codigoAuxiliar = "000000"
        detalle.descripcion = element.producto.PRODUCTO
        detalle.cantidad = element.cantidad
        detalle.precioUnitario = element.precio_venta/1.12
        detalle.descuento = 0
      var impuesto = new ImpuestoModel();
        impuesto.tarifa = 12
        impuesto.baseImponible = Number(element.subtP1.toFixed(2))
        impuesto.valor = impuesto.baseImponible * 0.12
        detalle.impuesto.push(impuesto)
      this.facturaVeronica.detalles.push(detalle);
    });
    

    //*************FORMA DE PAGO*********** */
    var pago = new PagosModel();
    pago.total = Number(this.factura.total.toFixed(2))
    this.facturaVeronica.pagos.push(pago);


    //************CAMPOS ADICIONALES*********** */
    var campoAdicional = new CampoAdicionalModel();
    campoAdicional.nombre = "email"
    campoAdicional.value = this.factura.cliente.correo //cambiar*********
    this.facturaVeronica.campoAdicional.push(campoAdicional)
    var campoAdicional2 = new CampoAdicionalModel();
    campoAdicional2.nombre = "NFactura"
    campoAdicional2.value = this.factura.documento_n.toString() //cambiar*********
    this.facturaVeronica.campoAdicional.push(campoAdicional2)

    //****************LOG SERVICIO WEB VERONICA**********/
    var logApiVeronica = new ServicioWebVeronica()
    logApiVeronica.objetoRequest = JSON.stringify(this.facturaVeronica)
    logApiVeronica.nroDocumento = this.factura.documento_n.toString()
    logApiVeronica.fecha = this.factura.fecha
    logApiVeronica.sucursal = this.factura.sucursal

    console.log(logApiVeronica)

    this._apiVeronicaService.newFactura(this.facturaVeronica).subscribe(
      res => {  var resultado = res as ResponseVeronicaDto;
                logApiVeronica.objetoResponse = JSON.stringify(res)
                logApiVeronica.claveAcceso = resultado.result.claveAccesoConsultada
                logApiVeronica.resultado = "OK"
                this._logApiVeronicaService.newLog(logApiVeronica).subscribe(
                  res =>{   this.mostrarLoading = false;
                            Swal.fire({
                              title: 'Correcto',
                              text: 'Factura registrada con éxito',
                              icon: 'success',
                              confirmButtonText: 'Ok'
                            }).then((result) => {
                              if(this.formaPago == "Otros medios Pago" || this.formaPago == "Abonos")
                                this.router.navigate(['/recibo-caja'], { queryParams: { id: this.factura.documento_n , tipo: 1 } });
                              else
                                window.location.reload();
                            })
                        },
                  err => {  });
            },
      err => {  
              
                logApiVeronica.objetoResponse = JSON.stringify(err);
                logApiVeronica.claveAcceso = null;
                logApiVeronica.resultado = "NOK"
                this._logApiVeronicaService.newLog(logApiVeronica).subscribe(
                  res =>{   this.mostrarLoading = false;
                            Swal.fire({
                              title: 'Error',
                              text: 'Error al establecer coneccion con el SRI',
                              icon: 'error',
                              confirmButtonText: 'Ok'
                            }).then((result) => {
                              if(this.formaPago == "Otros medios Pago" || this.formaPago == "Abonos")
                                this.router.navigate(['/recibo-caja'], { queryParams: { id: this.factura.documento_n , tipo: 1 } });
                              else
                                window.location.reload();
                            })
                        },
                  err => {  });              
              });
  }
  



    guardarNotaVenta(){
      this.factura.username= this.username
      this.factura.fecha= this.now
      this.factura.fecha2= new Date().toLocaleString()
      this.factura.productosVendidos=this.productosVendidos
      this.notasVentService.newNotaVenta(this.factura).subscribe(
        res => {this.actualizarFactureroNotasVenta();this.validarFormaPago()},
        err => {this.mostrarMensajeGenerico(2,"Error al guardar")})
    }


    guardarCotización(){
      this.factura.username= this.username
      this.factura.fecha= this.now
      this.factura.fecha2= new Date().toLocaleString()
      this.factura.productosVendidos=this.productosVendidos
      this.proformasService.newProforma(this.factura).subscribe(
        res => {this.actualizarFactureroProformas()},
        err => {this.mostrarMensajeGenerico(2,"Error al guardar")})
    }

    actualizarFacturero(){
      
      switch (this.factura.sucursal) {
        case "matriz":
          this.contadores[0].facturaMatriz_Ndocumento = this.factura.documento_n
          console.log(this.factura.documento_n)
          this.contadoresService.updateContadoresIDFacturaMatriz(this.contadores[0]).subscribe(res => {
          },err => {this.mostrarMensajeGenerico(2,"Error al guardar")})
          
          break;
        case "sucursal1":
          this.contadores[0].facturaSucursal1_Ndocumento = this.factura.documento_n
           this.contadoresService.updateContadoresIDFacturaSuc1(this.contadores[0]).subscribe(res => {
          },err => {this.mostrarMensajeGenerico(2,"Error al guardar")})
          break;
        case "sucursal2":
          this.contadores[0].facturaSucursal2_Ndocumento = this.factura.documento_n
       
          this.contadoresService.updateContadoresIDFacturaSuc2(this.contadores[0]).subscribe(res => {
          },err => {this.mostrarMensajeGenerico(2,"Error al guardar")})
          break;
        default:
          break;
      }
      
    }

    actualizarFactureroNotasVenta(){
      this.contadores[0].notasVenta_Ndocumento = this.factura.documento_n
      this.contadoresService.updateContadoresIDNotasVenta(this.contadores[0]).subscribe(
        res => { },
        err => {this.mostrarMensajeGenerico(2,"Revise e intente nuevamente")})
    }

    actualizarFactureroProformas(){
      this.contadores[0].proformas_Ndocumento = this.factura.documento_n
      this.contadoresService.updateContadoresIDProformas(this.contadores[0]).subscribe(
        res => { },
        err => { this.mostrarMensajeGenerico(2,"Revise e intente nuevamente") })
    }

  registrarFactura(){
    this.botonFactura = true;
    this.mostrarPopupCodigo();
  }

  registrarNotaVenta(){
    this.botonNotaVenta = true;
    this.mostrarPopupCodigo();
  }

  validarEstadoCajaFactura(){
    /* if(this.factura.cliente.ruc != this.rucAnterior){
      this.botonFactura = false;
      this.mostrarMensajeGenerico(2,"Error no se puede generar la factura con un ruc diferente al inicial")
    }else{ */
      this.factura.fecha.setHours(0,0,0,0);
      this._cajaMenorService.getCajaMenorPorFecha(this.factura).subscribe(
        res => {
        var listaCaja = res as CajaMenor[];
          if(listaCaja.length != 0 ){
            var caja = listaCaja.find(element=>element.sucursal == this.factura.sucursal) ;
            if(caja != undefined){
              if(caja.sucursal == this.factura.sucursal && caja.estado == "Cerrada" ){
                this.botonFactura = false
                Swal.fire( "Atención","No puede generar registros para la fecha establecida, la caja menor se encuentra cerrada",'error')
              }
              else
                this.obtenerIdFactura()
            }else 
              this.obtenerIdFactura()
          }else
            this.obtenerIdFactura()
        },
        (err) => {});
    //}
  }

  validarEstadoCajaNotaVenta(){
     /* if(this.factura.cliente.ruc != this.rucAnterior){
      this.botonNotaVenta = false;
      this.mostrarMensajeGenerico(2,"Error no se puede generar la nota venta con un ruc diferente al inicial")
    }else{ */
      this.factura.fecha.setHours(0,0,0,0);
      this._cajaMenorService.getCajaMenorPorFecha(this.factura).subscribe(
        res => {
        var listaCaja = res as CajaMenor[];
          if(listaCaja.length != 0 ){
            var caja = listaCaja.find(element=>element.sucursal == this.factura.sucursal) ;
            if(caja != undefined){
              if(caja.sucursal == this.factura.sucursal && caja.estado == "Cerrada" ){
                this.botonNotaVenta = false;
                Swal.fire( "Atención","No puede generar registros para la fecha establecida, la caja menor se encuentra cerrada",'error')
              }
              else
                this.obtenerIdNotasVenta()
            }else 
              this.obtenerIdNotasVenta()
          }else
            this.obtenerIdNotasVenta()
        },
        (err) => {});
    //}

    
  }

  obtenerIdFactura(){
    this.mostrarLoading = true;
    var IdNum = new Promise<any>((resolve, reject) => {
      try {
        this.facturasService.getFacturasPorIdConsecutivo(this.factura).subscribe(res => {
         this.facturasEctdas = res as factura[];
          if(this.facturasEctdas.length == 0){
            resolve("listo");
          }else{
            this.factura.documento_n =  this.factura.documento_n + 1
            this.obtenerIdFactura();
          }
           
          },(err) => {});
      } catch (error) {
      } 
    })

    IdNum.then((data) => {
      this.validarFechaFactura();
    })
  }

  
    
 



  validarFechaFactura(){
    var fechaActual = new Date();
    if(fechaActual.toLocaleDateString() != this.now.toLocaleDateString()){
      this.mostrarLoading = false;
      Swal.fire({
        title: 'Alerta',
        text: "La fecha es distinta a la de hoy",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.generarFactura();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          console.log("hare algo")
        }
      })
    }
    else
      this.generarFactura();
  }

  validarNotaVenta(){
    var fechaActual = new Date();
    if(fechaActual.toLocaleDateString() != this.now.toLocaleDateString()){
      this.mostrarLoading = false;
      Swal.fire({
        title: 'Alerta',
        text: "La fecha es distinta a la de hoy",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.generarNotaDeVenta();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          console.log("hare algo")
        }
      })
    }
    else
      this.generarNotaDeVenta();
  }


  generarFactura() {
    this.mostrarLoading = false;
    this.telefonoCliente= this.factura.cliente.celular
    this.factura.cliente.cliente_nombre= this.mensaje
   
    if(this.factura.cliente!=undefined){
      if(this.factura.cliente.cliente_nombre!=undefined){
        this.buscarDatosSucursal()
        this.mostrarMensaje()
        var contVal=0
        var contpro=0
        var bandera:boolean=true
        this.productosVendidos.forEach(element => {
          contpro++     
          if(element.total==0)
            bandera=false

        });
        if(contpro>=1 &&bandera && this.factura.documento_n!=undefined){
          this.factura.dni_comprador= this.factura.cliente.ruc
          this.factura.cliente.cliente_nombre= this.mensaje
          
          this.factura.sucursal= this.factura.sucursal
          this.guardarDatosCliente()
          this.setearNFactura()
          this.factura.dni_comprador= this.factura.cliente.ruc
          if(this.ventasForm.instance.validate().isValid){
            this.factura.cliente= this.factura.cliente
            if(this.factura.cliente.nombreContacto == "" || this.factura.cliente.nombreContacto == undefined)
              this.factura.cliente.nombreContacto=this.factura.cliente.cliente_nombre
            
            new Promise<any>((resolve, reject) => { 
              this.crearCliente()
              this.guardarFactura()
              this.productosVendidos.forEach(element => {
                this.validarExistencias(element)
                element.factura_id = this.factura.documento_n
                this.transaccion = new transaccion()
                this.transaccion.fecha_mov=new Date().toLocaleString()
                this.transaccion.fecha_transaccion=this.factura.fecha
                this.transaccion.sucursal=this.factura.sucursal
                this.transaccion.totalsuma=element.subtotal
                this.transaccion.bodega="12"
                this.transaccion.valor=element.precio_venta-(element.precio_venta*(element.descuento/100))
                this.transaccion.cantM2=element.cantidad
                this.transaccion.costo_unitario=element.producto.precio
                this.transaccion.documento=this.factura.documento_n+""
                this.transaccion.rucSucursal = this.factura.rucFactura
                this.transaccion.factPro=this.factura.documento_n+""
                this.transaccion.maestro=this.factura.maestro
                this.transaccion.producto=element.producto.PRODUCTO
                this.transaccion.cajas=Math.trunc((element.cantidad+0.01) / element.producto.M2);
                this.transaccion.piezas=(Math.trunc((element.cantidad+0.01) *element.producto.P_CAJA / element.producto.M2) - (Math.trunc((element.cantidad+0.01) / element.producto.M2) * element.producto.P_CAJA));
                this.transaccion.observaciones=this.factura.observaciones
                this.transaccion.tipo_transaccion="venta-fact"
                this.transaccion.movimiento=-1
                this.transaccion.usu_autorizado=this.factura.username
                this.transaccion.usuario=this.factura.username
                this.transaccion.idTransaccion=this.number_transaccion++
                this.transaccion.cliente=this.factura.cliente.cliente_nombre  
                this.transaccion.nombreUsuario = this.factura.nombreUsuario  
                this.transaccion.nombreVendedor = this.factura.nombreVendedor  
                this.transaccion.mcaEntregado = element.entregar == true ? "SI":"NO"

                if(element.producto.CLASIFICA == "COMBO"){
                  this.generarTransaccionesComboProductos(element.producto.PRODUCTO)

                  if(this.transaccion.valor == element.producto.precio){
                    this.transaccion.valor = 0
                    this.transaccion.totalsuma = 0
                  }
                  else{
                    this.transaccion.valor = this.transaccion.valor - element.producto.precio
                    this.transaccion.totalsuma = this.transaccion.valor * this.transaccion.cantM2
                  }

                }


                this.transaccionesService.newTransaccion(this.transaccion).subscribe(
                  res => {
                    this.contadores[0].transacciones_Ndocumento = this.number_transaccion
                    this.contadoresService.updateContadoresIDTransacciones(this.contadores[0]).subscribe(
                      res => {contVal++,this.contadorValidaciones(contVal)},
                      err => { this.mostrarMensajeGenerico(2,"Revise e intente nuevamente") })
                  },
                  err => { this.mostrarMensajeGenerico(2,"Revise e intente nuevamente") })
              });
              
            });
          }else{ this.mostrarMensajeGenerico(2,"Error al crear el documento"),this.botonFactura = false }
        }else{ this.mostrarMensajeGenerico(2,"Error no hay productos en la lista"),this.botonFactura = false}  
      }else{ this.mostrarMensajeGenerico(2,"Error hay campos vacios, revise e intente nuevamente"),this.botonFactura = false }
    }else{ this.mostrarMensajeGenerico(2,"Error hay campos vacios, revise e intente nuevamente"),this.botonFactura = false }
  }

  contadorValidaciones(i:number){
    if(this.productosVendidos.length==i){
      this.actualizarProductos()
      this.crearPDF()
    }else{}
  }


  generarTransaccionesComboProductos(nombreCombo : string){
    var combo = new ProductoCombo();
    combo.PRODUCTO = nombreCombo;
    this._comboService.getComboPorNombre(combo).subscribe(res => {
      var listado = res as ProductoCombo[];
      if(listado.length > 0)
        this.agregarTransacciones(listado[0].productosCombo,nombreCombo)
    })
  }

  agregarTransacciones(productos : productosCombo[], nombreCombo: string){
    var contVal = 0;
    productos.forEach(element => {
      var proV = this.productosVendidos.find(el => el.producto.PRODUCTO == nombreCombo)
      this.transaccion = new transaccion()
      this.transaccion.fecha_mov = new Date().toLocaleString()
      this.transaccion.fecha_transaccion = this.factura.fecha
      this.transaccion.sucursal = this.factura.sucursal
      this.transaccion.totalsuma = element.precioCombo * proV.cantidad
      this.transaccion.bodega = "12"
      this.transaccion.valor = element.precioCombo
      this.transaccion.cantM2 = proV.cantidad * element.cantidad
      this.transaccion.costo_unitario = element.precioMin
      this.transaccion.documento = this.factura.documento_n.toString()
      this.transaccion.rucSucursal = this.factura.rucFactura
      this.transaccion.factPro = this.factura.documento_n.toString()
      this.transaccion.maestro = this.factura.maestro
      this.transaccion.producto = element.producto.PRODUCTO
      this.transaccion.cajas = proV.cantidad * element.cantidad
      this.transaccion.piezas = 0;
      this.transaccion.observaciones = this.factura.observaciones
      this.transaccion.tipo_transaccion = this.factura.tipoDocumento == "Factura" ? "venta-fact" : "venta-not"
      this.transaccion.movimiento = -1
      this.transaccion.usu_autorizado = this.factura.username
      this.transaccion.usuario = this.factura.username
      this.transaccion.idTransaccion = this.number_transaccion++
      this.transaccion.cliente = this.factura.cliente.cliente_nombre  
      this.transaccion.nombreUsuario = this.factura.nombreUsuario  
      this.transaccion.nombreVendedor = this.factura.nombreVendedor
      this.transaccion.mcaEntregado = proV.entregar == true ? "SI":"NO"

      this.transaccionesService.newTransaccion(this.transaccion).subscribe(
        res => { contVal++, this.contadorGenerico(contVal, productos.length)},
        err => { this.mostrarMensajeGenerico(2,"Revise e intente nuevamente") })
    });
  }

  contadorGenerico(cont1 : number, cont2: number){
    if(cont1 == cont2)  
      return true;
  }

  generarCotizacion(e) {
    this.factura.cliente.cliente_nombre= this.mensaje
    if(this.factura.cliente!=undefined){
      if(this.factura.cliente.cliente_nombre!=undefined){
        this.buscarDatosSucursal()
        var contpro=0
        var bandera:boolean=true
        this.productosVendidos.forEach(element => {
          contpro++     
          if(element.total==0){ 
            bandera=false
          }
        });
        if(contpro>=1 &&bandera){
          this.factura.dni_comprador= this.factura.cliente.ruc
          this.factura.cliente.cliente_nombre= this.mensaje
          this.factura.productosVendidos=this.productosVendidos
          this.guardarDatosCliente()
          this.factura.dni_comprador= this.factura.cliente.ruc
          if(this.ventasForm.instance.validate().isValid){
            this.factura.cliente= this.factura.cliente
            new Promise<any>((resolve, reject) => {
              this.crearCliente()
              this.guardarCotización()
              this.productosVendidos.forEach(element => {
                element.factura_id = this.factura.documento_n
                this.productosVenService.newProductoVendido(element).subscribe(
                  res => {},
                  err => {this.mostrarMensajeGenerico(2,"Revise e intente nuevamente")})
              });

            });
            this.crearPDF();
          }else{ this.mostrarMensajeGenerico(2,"Error al crear el documento")}
        }else{ this.mostrarMensajeGenerico(2,"Error no hay productos en la lista") }  
      }else{ this.mostrarMensajeGenerico(2,"Error hay campos vacios, revise e intente nuevamente") } 
    }else{ this.mostrarMensajeGenerico(2,"Error hay campos vacios, revise e intente nuevamente") }  
  }


  obtenerIdNotasVenta(){
    this.mostrarLoading = true;
    var IdNum = new Promise<any>((resolve, reject) => {
      try {
        this.notasVentService.getNotasVentaPorIdConsecutivo(this.factura).subscribe(res => {
         this.facturasEctdas = res as factura[];
          if(this.facturasEctdas.length == 0){
            resolve("listo");
          }else{
            this.factura.documento_n =  this.factura.documento_n + 1
            this.obtenerIdNotasVenta();
          }
           
          },(err) => {});
      } catch (error) {
      } 
    })

    IdNum.then((data) => {
      this.validarNotaVenta();
      //this.generarNotaDeVenta();
    })
  }



  generarNotaDeVenta() {
    this.mostrarLoading = false;
    this.factura.cliente.cliente_nombre= this.mensaje
    if(this.factura.cliente!=undefined){
      if(this.factura.cliente.cliente_nombre != undefined){
        this.buscarDatosSucursal()
        this.mostrarMensaje()
        var contVal=0
        var contpro=0
        var bandera:boolean=true
        this.productosVendidos.forEach(element => {
          contpro++     
          if(element.total==0){ 
            bandera=false
          }
        });
        if(contpro>=1 &&bandera){
          this.factura.dni_comprador= this.factura.cliente.ruc
          this.factura.cliente.cliente_nombre= this.mensaje
          this.guardarDatosCliente()
          this.factura.dni_comprador= this.factura.cliente.ruc
          if(this.ventasForm.instance.validate().isValid){
            this.factura.cliente= this.factura.cliente
            new Promise<any>((resolve, reject) => {
              this.setearNFactura()
              this.crearCliente()
              this.guardarNotaVenta()
              this.productosVendidos.forEach(element => {
                this.validarExistencias(element)
                element.factura_id = this.factura.documento_n
                this.transaccion = new transaccion()
                this.transaccion.fecha_mov=new Date().toLocaleString()
                this.transaccion.fecha_transaccion=this.factura.fecha
                this.transaccion.sucursal=this.factura.sucursal
                this.transaccion.totalsuma=element.subtotal
                this.transaccion.bodega="12"
                this.transaccion.valor=element.precio_venta
                this.transaccion.costo_unitario=element.producto.precio
                this.transaccion.documento=this.factura.documento_n+""
                this.transaccion.factPro=this.factura.documento_n+""
                this.transaccion.producto=element.producto.PRODUCTO
                this.transaccion.rucSucursal = this.factura.rucFactura
                this.transaccion.maestro=this.factura.maestro
                this.transaccion.valor=element.precio_venta-(element.precio_venta*(element.descuento/100))
                this.transaccion.cantM2=element.cantidad
                this.transaccion.cajas=Math.trunc((element.cantidad+0.01) / element.producto.M2)
                this.transaccion.piezas=(Math.trunc((element.cantidad+0.01) *element.producto.P_CAJA / element.producto.M2) - (Math.trunc((element.cantidad+0.01) / element.producto.M2) * element.producto.P_CAJA));
                this.transaccion.observaciones = this.factura.observaciones
                this.transaccion.tipo_transaccion = "venta-not"
                this.transaccion.movimiento = -1
                this.transaccion.usu_autorizado = this.factura.username
                this.transaccion.usuario = this.factura.username
                this.transaccion.idTransaccion = this.number_transaccion++
                this.transaccion.cliente = this.factura.cliente.cliente_nombre
                this.transaccion.nombreUsuario = this.factura.nombreUsuario  
                this.transaccion.nombreVendedor = this.factura.nombreVendedor
                this.transaccion.mcaEntregado = element.entregar == true ? "SI":"NO"

                if(element.producto.CLASIFICA == "COMBO"){
                  this.generarTransaccionesComboProductos(element.producto.PRODUCTO)

                  if(this.transaccion.valor == element.producto.precio){
                    this.transaccion.valor = 0
                    this.transaccion.totalsuma = 0
                  }
                  else{
                    this.transaccion.valor = this.transaccion.valor - element.producto.precio
                    this.transaccion.totalsuma = this.transaccion.valor * this.transaccion.cantM2
                  }

                }
                
                this.transaccionesService.newTransaccion(this.transaccion).subscribe(
                  res => {
                    this.contadores[0].transacciones_Ndocumento = this.number_transaccion
                    this.contadoresService.updateContadoresIDTransacciones(this.contadores[0]).subscribe(
                      res => {
                        this.db.collection("/consectivosBaseMongoDB").doc("base").update({ transacciones_Ndocumento:this.number_transaccion })
                        .then(res => { contVal++,this.contadorValidaciones(contVal) }, err => (err));
                      },
                      err => {this.mostrarMensajeGenerico(2,"Revise e intente nuevamente");})
                  },
                  err => {this.mostrarMensajeGenerico(2,"Revise e intente nuevamente");})
              });
          
            });

          }else{ this.mostrarMensajeGenerico(2,"Error al crear el documento");this.botonNotaVenta = false;}
        }else{ this.mostrarMensajeGenerico(2,"Error no hay productos en la lista");this.botonNotaVenta = false;}   
      }else{ this.mostrarMensajeGenerico(2,"Error hay campos vacios, revise e intente nuevamente");this.botonNotaVenta = false;}  
    }else{ this.mostrarMensajeGenerico(2,"Error hay campos vacios, revise e intente nuevamente");this.botonNotaVenta = false;}
  }

  
  actualizarInventario(){
    var m2s1=0
    var m2s2=0
    var m2s3=0
    this.invetarioP.forEach(element=>{
      m2s1=parseInt(element.cantidadM2.toFixed(0))
      m2s2=parseInt(element.cantidadM2b2.toFixed(0))
      m2s3=parseInt(element.cantidadM2b3.toFixed(0))
    })
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
   this.cambiarValores()
   this.actualizarInventario()
   }

  cambiarValores(){
    this.invetarioP.forEach(element=>{
      element.cantidadCajas=Math.trunc( element.cantidadM2 / element.producto.M2);
      element.cantidadPiezas=Math.trunc(element.cantidadM2 * element.producto.P_CAJA / element.producto.M2) - (element.cantidadCajas * element.producto.P_CAJA);

      element.cantidadCajas2=Math.trunc( element.cantidadM2b2 / element.producto.M2);
      element.cantidadPiezas2=Math.trunc(element.cantidadM2b2 * element.producto.P_CAJA / element.producto.M2) - (element.cantidadCajas2 * element.producto.P_CAJA);

      element.cantidadCajas3=Math.trunc( element.cantidadM2b3 / element.producto.M2);
      element.cantidadPiezas3=Math.trunc(element.cantidadM2b3 * element.producto.P_CAJA / element.producto.M2) - (element.cantidadCajas3 * element.producto.P_CAJA);
    })
  }


  validarFormaPago(){
    this.newRecibo.idDocumento = this.contadores[0].reciboCaja_Ndocumento + 1;
    this.obtenerIdRecibo();
  }

  generarCuentaPorCobrar(idRecibo){
    var cliente = this.factura.cliente.cliente_nombre
    if(this.formaPago == "Pendiente de Pago"){
      var cuentaPorCobrar = new CuentaPorCobrar();
      cuentaPorCobrar.fecha = new Date();
      cuentaPorCobrar.sucursal = this.factura.sucursal;
      
      var ultimo = cliente.slice(-1);
      if(ultimo == " ")
        cliente = cliente.substring(0, cliente.length-1);
      cuentaPorCobrar.cliente = cliente;
      cuentaPorCobrar.rucCliente = this.factura.cliente.ruc;
      cuentaPorCobrar.rCajaId = "RC"+idRecibo;
      cuentaPorCobrar.documentoVenta = this.factura.documento_n.toString();
      cuentaPorCobrar.numDocumento = "";
      cuentaPorCobrar.valor = this.factura.total;
      cuentaPorCobrar.valorFactura = this.factura.total;
      cuentaPorCobrar.tipo_doc = this.factura.tipoDocumento;
      cuentaPorCobrar.fecha_deuda = this.factura.fecha;
      cuentaPorCobrar.notas = "Generado desde el módulo de facturación";
      this._cuentaPorCobrar.newCuentaPorCobrar(cuentaPorCobrar).subscribe((res) => {},(err) => {});
    }
    
  } 

  generarTransaccionCuentaPorCobrar(idRecibo){
    if(this.formaPago == "Pendiente de Pago"){
      var transaccion = new TransaccionesFinancieras();
      transaccion.fecha = new Date();
      transaccion.sucursal = this.factura.sucursal;
      transaccion.cliente = this.factura.cliente.cliente_nombre;
      transaccion.rCajaId = "RC"+idRecibo;
      transaccion.tipoTransaccion = "factura-saldo";
      transaccion.id_documento = 0;
      transaccion.isContabilizada = true;
      transaccion.documentoVenta = this.factura.documento_n.toString();
      transaccion.cedula = this.factura.cliente.ruc;
      transaccion.valor = this.factura.total;
      transaccion.cuenta = "2.0 SALDOS";
      transaccion.subCuenta = "2.0.0 Cuentas x Cobrar";
      transaccion.tipoCuenta = "Reales y Transitorias";

      try {
        this._transaccionFinancieraService.newTransaccionFinanciera(transaccion).subscribe((res) => {},(err) => {});
      } catch (error) {
        this.mostrarMensajeGenerico(2,"Error al guardar la transaccion"); 
      }   
    }
     
  }

  obtenerIdRecibo(){
    var idRecibo = 0;
    var IdNum = new Promise<any>((resolve, reject) => {
      try {
        this._reciboCajaService.getReciboCajaPorIdConsecutivo(this.newRecibo).subscribe(
          res => {
            this.recibosEncontrados = res as ReciboCaja[];
            if(this.recibosEncontrados.length == 0){
              idRecibo = this.newRecibo.idDocumento;
              resolve("listo");
            }else{
              this.newRecibo.idDocumento = this.newRecibo.idDocumento+1
              this.obtenerIdRecibo();
            }
          },(err) => {});
      } catch (error) {} 
    })

    IdNum.then((data) => {this.generarReciboCaja(idRecibo);})
  }


    generarReciboCaja(idRecibo){
      var recibo = new ReciboCaja();
      recibo.idDocumento = idRecibo;
      recibo.fecha = this.factura.fecha;
      recibo.docVenta = this.tDocumento;
      recibo.cliente = this.factura.cliente.nombreContacto;
      recibo.ruc = this.factura.cliente.ruc;
      recibo.sucursal = this.factura.sucursal;
      recibo.numDocumento = this.factura.documento_n.toString(); 
      recibo.banco = "";
      recibo.valorFactura = this.factura.total;
      recibo.valorRecargo = 0;
     
      recibo.observaciones = "Generado desde el modulo de facturación"
      recibo.estadoRecibo = "Activo";
      if(this.formaPago == "Cancelado"){
        recibo.tipoPago = "Contado";
        recibo.valorPagoEfectivo = this.factura.total;
        recibo.valorSaldos = 0;
      }else{
        recibo.tipoPago = "Pendiente de Pago";
        recibo.valorPagoEfectivo = 0;
        recibo.valorSaldos = this.factura.total;
      }

      this.listaOperaciones.push(this.generarOperacionPrincipal());
      if(this.formaPago == "Pendiente de Pago")
        this.listaOperaciones.push(this.generarOperacionSaldo());

      recibo.operacionesComercialesList = this.listaOperaciones;
      try {
        this._reciboCajaService.newReciboCaja(recibo).subscribe((res) => {
          this.generarTransaccionesFinancieras(recibo);
          this.actualizarContador(recibo);
        },(err) => {});
      } catch (error) {
        this.mostrarMensajeGenerico(2,"Error al guardar la transaccion"); 
      } 
    }

    actualizarContador(recibo){
      this.contadores[0].reciboCaja_Ndocumento = recibo.idDocumento
      this.contadoresService.updateContadoresIDRegistroCaja(this.contadores[0]).subscribe( res => {},err => {})
    }

    generarOperacionSaldo(){
      var operacionCC = new OperacionComercial();
      operacionCC.valor = this.factura.total;
      operacionCC.tipoCuenta = "Reales y Transitorias"
      operacionCC.nombreCuenta = "2.0 SALDOS"
      operacionCC.idCuenta = "6195b036f75a418e9c2eba06"
      operacionCC.nombreSubcuenta = "2.0.0 Cuentas x Cobrar"; 
      operacionCC.idSubCuenta = "61c50005270abc667ec3f8f7";
      return operacionCC;
    }

    generarOperacionPrincipal(){
      var operacionCC = new OperacionComercial();
      operacionCC.valor = this.factura.total;

      operacionCC.tipoCuenta = "Ingresos"
      operacionCC.nombreCuenta = "1.3 INGRESOS"
      operacionCC.idCuenta = "61bcef301a0afd3ac9084cce"
      
      if(this.tDocumento == "Factura"){
        operacionCC.nombreSubcuenta = "1.3.0 Facturacion"; 
        operacionCC.idSubCuenta = "61bcef4e1a0afd3ac9084ccf";
      }
      else if(this.tDocumento == "Nota de Venta"){
        operacionCC.nombreSubcuenta = "1.3.1 Nota_Venta"; 
        operacionCC.idSubCuenta = "61bcef301a0afd3ac9084cce";
      }
      return operacionCC;
    }

    generarTransaccionesFinancieras(recibo){
      this.generarCuentaPorCobrar(recibo.idDocumento)
      recibo.operacionesComercialesList.forEach(element=>{
        var transaccion = new TransaccionesFinancieras();
        transaccion.fecha = this.factura.fecha;
        transaccion.sucursal = recibo.sucursal;
        transaccion.cliente = recibo.cliente;
        transaccion.isContabilizada = true;
        transaccion.rCajaId = "RC"+recibo.idDocumento.toString();
        transaccion.tipoTransaccion = "recibo-caja";
        transaccion.id_documento = recibo.idDocumento;
        transaccion.documentoVenta = recibo.docVenta;
        transaccion.cedula = this.factura.cliente.ruc;
        transaccion.numDocumento = recibo.numDocumento;
        transaccion.valor = element.valor;
        transaccion.tipoPago = "";
        transaccion.soporte = "";
        transaccion.dias = 0;
        transaccion.cuenta = element.nombreCuenta;
        transaccion.subCuenta = element.nombreSubcuenta;
        transaccion.notas = recibo.observaciones;
        transaccion.tipoCuenta = element.tipoCuenta;

        try {
          this._transaccionFinancieraService.newTransaccionFinanciera(transaccion).subscribe((res) => {},(err) => {});
        } catch (error) {
          this.mostrarMensajeGenerico(2,"Error al guardar la transaccion"); 
        }    
      });
      return true;
    }




  traerTransaccionesPorProducto(nombreProducto: producto,numero : number) {
    this.invetarioP = [];
    this.mostrarLoading = true;
    this.proTransaccion.nombre = nombreProducto.PRODUCTO;
    this.transaccionesService.getTransaccionesPorProducto(this.proTransaccion)
      .subscribe((res) => {
        this.transacciones = res as transaccion[];
        this.cargarDatosProductoUnitario(nombreProducto,numero);
      });
  }


  cargarDatosProductoUnitario(nombreProducto : producto , numero : number) {
    var contCajas = 0;
    var contCajas2 = 0;
    var contCajas3 = 0;
    var contPiezas = 0;
    var contPiezas2 = 0;
    var contPiezas3 = 0;

    this.transacciones.forEach((element) => {
      if ( nombreProducto.PRODUCTO == element.producto && element.sucursal == "matriz") {
        switch (element.tipo_transaccion) {
          case "devolucion":
            contCajas = Number(element.cajas) + contCajas;
            contPiezas = Number(element.piezas) + contPiezas;
            break;
          case "compra-dir":
            contCajas = Number(contCajas) + Number(element.cajas);
            contPiezas = Number(contPiezas) + Number(element.piezas);
            break;
          case "compra":
            contCajas = Number(contCajas) + Number(element.cajas);
            contPiezas = Number(contPiezas) + Number(element.piezas);
            break;
          case "compra_obs":
            contCajas = Number(contCajas) + Number(element.cajas);
            contPiezas = Number(contPiezas) + Number(element.piezas);
            break;
          case "ajuste-faltante":
            contCajas = Number(contCajas) - Number(element.cajas);
            contPiezas = Number(contPiezas) - Number(element.piezas);
            break;
          case "baja":
            contCajas = Number(contCajas) - Number(element.cajas);
            contPiezas = Number(contPiezas) - Number(element.piezas);
            break;
          case "venta-fact":
            contCajas = Number(contCajas) - Number(element.cajas);
            contPiezas = Number(contPiezas) - Number(element.piezas);
            break;
          case "venta-not":
            contCajas = Number(contCajas) - Number(element.cajas);
            contPiezas = Number(contPiezas) - Number(element.piezas);
            break;
          case "traslado1":
            contCajas = Number(contCajas) - Number(element.cajas);
            contPiezas = Number(contPiezas) - Number(element.piezas);
            break;
          case "traslado2":
            contCajas = Number(contCajas) + Number(element.cajas);
            contPiezas = Number(contPiezas) + Number(element.piezas);
            break;
          case "ajuste-sobrante":
            contCajas = Number(contCajas) + Number(element.cajas);
            contPiezas = Number(contPiezas) + Number(element.piezas);

            break;
          default:
        }
      } else if ( nombreProducto.PRODUCTO == element.producto && element.sucursal == "sucursal1") {
        switch (element.tipo_transaccion) {
          case "devolucion":
            contCajas2 = Number(element.cajas) + contCajas2;
            contPiezas2 = Number(element.piezas) + contPiezas2;
            break;
          case "compra-dir":
            contCajas2 = Number(contCajas2) + Number(element.cajas);
            contPiezas2 = Number(contPiezas2) + Number(element.piezas);
            break;
          case "compra":
            contCajas2 = Number(contCajas2) + Number(element.cajas);
            contPiezas2 = Number(contPiezas2) + Number(element.piezas);
            break;
          case "compra_obs":
            contCajas2 = Number(contCajas2) + Number(element.cajas);
            contPiezas2 = Number(contPiezas2) + Number(element.piezas);
            break;
          case "ajuste-faltante":
            contCajas2 = Number(contCajas2) - Number(element.cajas);
            contPiezas2 = Number(contPiezas2) - Number(element.piezas);
            break;
          case "baja":
            contCajas2 = Number(contCajas2) - Number(element.cajas);
            contPiezas2 = Number(contPiezas2) - Number(element.piezas);
            break;
          case "venta-fact":
            contCajas2 = Number(contCajas2) - Number(element.cajas);
            contPiezas2 = Number(contPiezas2) - Number(element.piezas);
            break;
          case "venta-not":
            contCajas2 = Number(contCajas2) - Number(element.cajas);
            contPiezas2 = Number(contPiezas2) - Number(element.piezas);
            break;
          case "traslado1":
            contCajas2 = Number(contCajas2) - Number(element.cajas);
            contPiezas2 = Number(contPiezas2) - Number(element.piezas);
            break;
          case "traslado2":
            contCajas2 = Number(contCajas2) + Number(element.cajas);
            contPiezas2 = Number(contPiezas2) + Number(element.piezas);
            break;
          case "ajuste-sobrante":
            contCajas2 = Number(contCajas2) + Number(element.cajas);
            contPiezas2 = Number(contPiezas2) + Number(element.piezas);
            break;
          default:
        }
      } else if ( nombreProducto.PRODUCTO == element.producto && element.sucursal == "sucursal2") {
        switch (element.tipo_transaccion) {
          case "devolucion":
            contCajas3 = Number(element.cajas) + contCajas3;
            contPiezas3 = Number(element.piezas) + contPiezas3;
            break;
          case "compra-dir":
            contCajas3 = Number(contCajas3) + Number(element.cajas);
            contPiezas3 = Number(contPiezas3) + Number(element.piezas);
            break;
          case "compra":
            contCajas3 = Number(contCajas3) + Number(element.cajas);
            contPiezas3 = Number(contPiezas3) + Number(element.piezas);
            break;
          case "compra_obs":
            contCajas3 = Number(contCajas3) + Number(element.cajas);
            contPiezas3 = Number(contPiezas3) + Number(element.piezas);
            break;
          case "ajuste-faltante":
            contCajas3 = Number(contCajas3) - Number(element.cajas);
            contPiezas3 = Number(contPiezas3) - Number(element.piezas);
            break;
          case "baja":
            contCajas3 = Number(contCajas3) - Number(element.cajas);
            contPiezas3 = Number(contPiezas3) - Number(element.piezas);
            break;
          case "venta-fact":
            contCajas3 = Number(contCajas3) - Number(element.cajas);
            contPiezas3 = Number(contPiezas3) - Number(element.piezas);
            break;
          case "venta-not":
            contCajas3 = Number(contCajas3) - Number(element.cajas);
            contPiezas3 = Number(contPiezas3) - Number(element.piezas);
            break;
          case "traslado1":
            contCajas3 = Number(contCajas3) - Number(element.cajas);
            contPiezas3 = Number(contPiezas3) - Number(element.piezas);
            break;
          case "traslado2":
            contCajas3 = Number(contCajas3) + Number(element.cajas);
            contPiezas3 = Number(contPiezas3) + Number(element.piezas);
            break;
          case "ajuste-sobrante":
            contCajas3 = Number(contCajas3) + Number(element.cajas);
            contPiezas3 = Number(contPiezas3) + Number(element.piezas);
            break;

          default:
        }
      }
    });
    var cantidadRestante = 0;
    this.invetarioProd = new inventario();
    this.invetarioProd.producto = nombreProducto;
    this.invetarioProd.cantidadCajas = contCajas;
    this.invetarioProd.cantidadCajas2 = contCajas2;
    this.invetarioProd.cantidadCajas3 = contCajas3;

    this.invetarioProd.cantidadPiezas = contPiezas;
    this.invetarioProd.cantidadPiezas2 = contPiezas2;
    this.invetarioProd.cantidadPiezas3 = contPiezas3;
    this.invetarioP.push(this.invetarioProd);


    contCajas = 0;
    contPiezas = 0;
    contCajas2 = 0;
    contPiezas2 = 0;
    contCajas3 = 0;
    contPiezas3 = 0;
    
    this.transformarM2_1(numero);
  }



  transformarM2_1(numero: number) {
    this.invetarioP.forEach((element) => {
      element.cantidadM2 = parseFloat( (element.producto.M2 * element.cantidadCajas +(element.cantidadPiezas * element.producto.M2) / element.producto.P_CAJA ).toFixed(2));
      element.cantidadM2b2 = parseFloat(
        (
          element.producto.M2 * element.cantidadCajas2 +
          (element.cantidadPiezas2 * element.producto.M2) / element.producto.P_CAJA
        ).toFixed(2)
      );
      element.cantidadM2b3 = parseFloat(
        (
          element.producto.M2 * element.cantidadCajas3 +
          (element.cantidadPiezas3 * element.producto.M2) / element.producto.P_CAJA
        ).toFixed(2)
      );
      element.totalb1 = parseFloat( (element.cantidadM2 * element.producto.precio).toFixed(2) );
      element.totalb2 = parseFloat((element.cantidadM2b2 * element.producto.precio).toFixed(2));
      element.totalb3 = parseFloat( (element.cantidadM2b3 * element.producto.precio).toFixed(2));
    });
    this.cambiarValores2(numero);
  }


  cambiarValores2(numero : number) {
    this.invetarioP.forEach((element) => {
      element.cantidadCajas = Math.trunc( element.cantidadM2 / element.producto.M2);
      element.cantidadPiezas = parseInt(
        (
          (element.cantidadM2 * element.producto.P_CAJA) / element.producto.M2 -
          element.cantidadCajas * element.producto.P_CAJA
        ).toFixed(0)
      );
      element.cantidadM2 = parseFloat(element.cantidadM2.toFixed(2));

      element.cantidadCajas2 = Math.trunc( element.cantidadM2b2 / element.producto.M2);
      element.cantidadPiezas2 = parseInt(
        (
          (element.cantidadM2b2 * element.producto.P_CAJA) /
            element.producto.M2 -
          element.cantidadCajas2 * element.producto.P_CAJA
        ).toFixed(0)
      );
      element.cantidadM2b2 = parseFloat(element.cantidadM2b2.toFixed(2));

      element.cantidadCajas3 = Math.trunc( element.cantidadM2b3 / element.producto.M2);
      element.cantidadPiezas3 = parseInt(
        (
          (element.cantidadM2b3 * element.producto.P_CAJA) /
            element.producto.M2 -
          element.cantidadCajas3 * element.producto.P_CAJA
        ).toFixed(0)
      );
      element.cantidadM2b3 = parseFloat(element.cantidadM2b3.toFixed(2));
    });

    switch (this.factura.sucursal) {
      case "matriz":
        this.productosVendidos[numero].disponible = this.invetarioP[0].cantidadM2;
        break;
      case "sucursal1":
        this.productosVendidos[numero].disponible = this.invetarioP[0].cantidadM2b2;
        break;
      case "sucursal2":
        this.productosVendidos[numero].disponible = this.invetarioP[0].cantidadM2b3;
        break;
      default:
    }

    this.productosVendidos[numero].cantM2_1 = this.invetarioP[0].cantidadM2;
    this.productosVendidos[numero].cantCajas_1 = this.invetarioP[0].cantidadCajas;
    this.productosVendidos[numero].cantPiezas_1 = this.invetarioP[0].cantidadPiezas;
    this.productosVendidos[numero].cantM2_2 = this.invetarioP[0].cantidadM2b2;
    this.productosVendidos[numero].cantCajas_2 = this.invetarioP[0].cantidadCajas2;
    this.productosVendidos[numero].cantPiezas_2 = this.invetarioP[0].cantidadPiezas2;
    this.productosVendidos[numero].cantM2_3 = this.invetarioP[0].cantidadM2b3;
    this.productosVendidos[numero].cantCajas_3 = this.invetarioP[0].cantidadCajas3;
    this.productosVendidos[numero].cantPiezas_3 = this.invetarioP[0].cantidadPiezas3;
    this.productosVendidos[numero].cantM2_1_Original = this.productosVendidos[numero].cantM2_1
    this.productosVendidos[numero].cantM2_2_Original = this.productosVendidos[numero].cantM2_2
    this.productosVendidos[numero].cantM2_3_Original = this.productosVendidos[numero].cantM2_3
    this.productosVendidos[numero].cantCajas_1_Original = this.productosVendidos[numero].cantCajas_1
    this.productosVendidos[numero].cantCajas_2_Original = this.productosVendidos[numero].cantCajas_2
    this.productosVendidos[numero].cantCajas_3_Original = this.productosVendidos[numero].cantCajas_3
    this.productosVendidos[numero].cantPiezas_1_Original = this.productosVendidos[numero].cantPiezas_1
    this.productosVendidos[numero].cantPiezas_2_Original = this.productosVendidos[numero].cantPiezas_2
    this.productosVendidos[numero].cantPiezas_3_Original = this.productosVendidos[numero].cantPiezas_3

    if(this.productosVendidos[numero].cantM2_1 < 0){
      this.productosVendidos[numero].cantM2_1 = 0
      this.productosVendidos[numero].cantCajas_1 = 0
      this.productosVendidos[numero].cantPiezas_1 = 0
    } 
    if(this.productosVendidos[numero].cantM2_2 < 0)
      this.productosVendidos[numero].cantM2_2 = 0
    if(this.productosVendidos[numero].cantM2_3 < 0)
      this.productosVendidos[numero].cantM2_3 = 0

    if(this.productosVendidos[numero].disponible < 0)
      this.productosVendidos[numero].disponible = 0

    
    this.mostrarLoading = false;
  }












  //**************PROCESOS PARA CONSULTA DE DATOS ************/
  traerTransaccionesPorProductoCombo2(nombreProducto: producto, num : number, cantidadP: number, productoCombo: productosCombo) {
    this.cantidadProductos++;
    this.invetarioP = [];
    this.transacciones = [];
    this.productosVendidos[num].disponible = 100;
    this.proTransaccion.nombre = nombreProducto.PRODUCTO;
    var p1 = new Promise((resolve, reject) => {
        this.transaccionesService.getTransaccionesPorProducto(this.proTransaccion).toPromise()
            .then( res => { 
              this.transacciones = res as transaccion[];
              var contCajas = 0;
              var contCajas2 = 0;
              var contCajas3 = 0;
              var contPiezas = 0;
              var contPiezas2 = 0;
              var contPiezas3 = 0;

              this.transacciones.forEach((element) => {
                if ( nombreProducto.PRODUCTO == element.producto && element.sucursal == "matriz") {
                  switch (element.tipo_transaccion) {
                    case "devolucion":
                      contCajas = Number(element.cajas) + contCajas;
                      contPiezas = Number(element.piezas) + contPiezas;
                      break;
                    case "compra-dir":
                      contCajas = Number(contCajas) + Number(element.cajas);
                      contPiezas = Number(contPiezas) + Number(element.piezas);
                      break;
                    case "compra":
                      contCajas = Number(contCajas) + Number(element.cajas);
                      contPiezas = Number(contPiezas) + Number(element.piezas);
                      break;
                    case "compra_obs":
                      contCajas = Number(contCajas) + Number(element.cajas);
                      contPiezas = Number(contPiezas) + Number(element.piezas);
                      break;
                    case "ajuste-faltante":
                      contCajas = Number(contCajas) - Number(element.cajas);
                      contPiezas = Number(contPiezas) - Number(element.piezas);
                      break;
                    case "baja":
                      contCajas = Number(contCajas) - Number(element.cajas);
                      contPiezas = Number(contPiezas) - Number(element.piezas);
                      break;
                    case "venta-fact":
                      contCajas = Number(contCajas) - Number(element.cajas);
                      contPiezas = Number(contPiezas) - Number(element.piezas);
                      break;
                    case "venta-not":
                      contCajas = Number(contCajas) - Number(element.cajas);
                      contPiezas = Number(contPiezas) - Number(element.piezas);
                      break;
                    case "traslado1":
                      contCajas = Number(contCajas) - Number(element.cajas);
                      contPiezas = Number(contPiezas) - Number(element.piezas);
                      break;
                    case "traslado2":
                      contCajas = Number(contCajas) + Number(element.cajas);
                      contPiezas = Number(contPiezas) + Number(element.piezas);
                      break;
                    case "ajuste-sobrante":
                      contCajas = Number(contCajas) + Number(element.cajas);
                      contPiezas = Number(contPiezas) + Number(element.piezas);

                      break;
                    default:
                  }
                } else if ( nombreProducto.PRODUCTO == element.producto && element.sucursal == "sucursal1") {
                  switch (element.tipo_transaccion) {
                    case "devolucion":
                      contCajas2 = Number(element.cajas) + contCajas2;
                      contPiezas2 = Number(element.piezas) + contPiezas2;
                      break;
                    case "compra-dir":
                      contCajas2 = Number(contCajas2) + Number(element.cajas);
                      contPiezas2 = Number(contPiezas2) + Number(element.piezas);
                      break;
                    case "compra":
                      contCajas2 = Number(contCajas2) + Number(element.cajas);
                      contPiezas2 = Number(contPiezas2) + Number(element.piezas);
                      break;
                    case "compra_obs":
                      contCajas2 = Number(contCajas2) + Number(element.cajas);
                      contPiezas2 = Number(contPiezas2) + Number(element.piezas);
                      break;
                    case "ajuste-faltante":
                      contCajas2 = Number(contCajas2) - Number(element.cajas);
                      contPiezas2 = Number(contPiezas2) - Number(element.piezas);
                      break;
                    case "baja":
                      contCajas2 = Number(contCajas2) - Number(element.cajas);
                      contPiezas2 = Number(contPiezas2) - Number(element.piezas);
                      break;
                    case "venta-fact":
                      contCajas2 = Number(contCajas2) - Number(element.cajas);
                      contPiezas2 = Number(contPiezas2) - Number(element.piezas);
                      break;
                    case "venta-not":
                      contCajas2 = Number(contCajas2) - Number(element.cajas);
                      contPiezas2 = Number(contPiezas2) - Number(element.piezas);
                      break;
                    case "traslado1":
                      contCajas2 = Number(contCajas2) - Number(element.cajas);
                      contPiezas2 = Number(contPiezas2) - Number(element.piezas);
                      break;
                    case "traslado2":
                      contCajas2 = Number(contCajas2) + Number(element.cajas);
                      contPiezas2 = Number(contPiezas2) + Number(element.piezas);
                      break;
                    case "ajuste-sobrante":
                      contCajas2 = Number(contCajas2) + Number(element.cajas);
                      contPiezas2 = Number(contPiezas2) + Number(element.piezas);
                      break;
                    default:
                  }
                } else if ( nombreProducto.PRODUCTO == element.producto && element.sucursal == "sucursal2") {
                  switch (element.tipo_transaccion) {
                    case "devolucion":
                      contCajas3 = Number(element.cajas) + contCajas3;
                      contPiezas3 = Number(element.piezas) + contPiezas3;
                      break;
                    case "compra-dir":
                      contCajas3 = Number(contCajas3) + Number(element.cajas);
                      contPiezas3 = Number(contPiezas3) + Number(element.piezas);
                      break;
                    case "compra":
                      contCajas3 = Number(contCajas3) + Number(element.cajas);
                      contPiezas3 = Number(contPiezas3) + Number(element.piezas);
                      break;
                    case "compra_obs":
                      contCajas3 = Number(contCajas3) + Number(element.cajas);
                      contPiezas3 = Number(contPiezas3) + Number(element.piezas);
                      break;
                    case "ajuste-faltante":
                      contCajas3 = Number(contCajas3) - Number(element.cajas);
                      contPiezas3 = Number(contPiezas3) - Number(element.piezas);
                      break;
                    case "baja":
                      contCajas3 = Number(contCajas3) - Number(element.cajas);
                      contPiezas3 = Number(contPiezas3) - Number(element.piezas);
                      break;
                    case "venta-fact":
                      contCajas3 = Number(contCajas3) - Number(element.cajas);
                      contPiezas3 = Number(contPiezas3) - Number(element.piezas);
                      break;
                    case "venta-not":
                      contCajas3 = Number(contCajas3) - Number(element.cajas);
                      contPiezas3 = Number(contPiezas3) - Number(element.piezas);
                      break;
                    case "traslado1":
                      contCajas3 = Number(contCajas3) - Number(element.cajas);
                      contPiezas3 = Number(contPiezas3) - Number(element.piezas);
                      break;
                    case "traslado2":
                      contCajas3 = Number(contCajas3) + Number(element.cajas);
                      contPiezas3 = Number(contPiezas3) + Number(element.piezas);
                      break;
                    case "ajuste-sobrante":
                      contCajas3 = Number(contCajas3) + Number(element.cajas);
                      contPiezas3 = Number(contPiezas3) + Number(element.piezas);
                      break;

                    default:
                  }
                }
              });

              this.invetarioP = [];
              this.invetarioProd = new inventario();
              this.invetarioProd.producto = nombreProducto;
              this.invetarioProd.cantidadCajas = contCajas;
              this.invetarioProd.cantidadCajas2 = contCajas2;
              this.invetarioProd.cantidadCajas3 = contCajas3;

              this.invetarioProd.cantidadPiezas = contPiezas;
              this.invetarioProd.cantidadPiezas2 = contPiezas2;
              this.invetarioProd.cantidadPiezas3 = contPiezas3;
              this.invetarioP.push(this.invetarioProd);


              contCajas = 0;
              contPiezas = 0;
              contCajas2 = 0;
              contPiezas2 = 0;
              contCajas3 = 0;
              contPiezas3 = 0;


              //seccion2

              this.invetarioP.forEach((element) => {
                element.cantidadM2 = parseFloat( (element.producto.M2 * element.cantidadCajas +(element.cantidadPiezas * element.producto.M2) / element.producto.P_CAJA ).toFixed(2));
                element.cantidadM2b2 = parseFloat(
                  (
                    element.producto.M2 * element.cantidadCajas2 +
                    (element.cantidadPiezas2 * element.producto.M2) / element.producto.P_CAJA
                  ).toFixed(2)
                );
                element.cantidadM2b3 = parseFloat(
                  (
                    element.producto.M2 * element.cantidadCajas3 +
                    (element.cantidadPiezas3 * element.producto.M2) / element.producto.P_CAJA
                  ).toFixed(2)
                );
                element.totalb1 = parseFloat( (element.cantidadM2 * element.producto.precio).toFixed(2) );
                element.totalb2 = parseFloat((element.cantidadM2b2 * element.producto.precio).toFixed(2));
                element.totalb3 = parseFloat( (element.cantidadM2b3 * element.producto.precio).toFixed(2));
              });

              //seccion3
              this.invetarioP.forEach((element) => {
                element.cantidadCajas = Math.trunc( element.cantidadM2 / element.producto.M2);
                element.cantidadPiezas = parseInt(
                  ((element.cantidadM2 * element.producto.P_CAJA) / element.producto.M2 - element.cantidadCajas * element.producto.P_CAJA).toFixed(0)
                );
                element.cantidadM2 = parseFloat(element.cantidadM2.toFixed(2));

                element.cantidadCajas2 = Math.trunc( element.cantidadM2b2 / element.producto.M2);
                element.cantidadPiezas2 = parseInt(
                  ((element.cantidadM2b2 * element.producto.P_CAJA) / element.producto.M2 - element.cantidadCajas2 * element.producto.P_CAJA).toFixed(0)
                );
                element.cantidadM2b2 = parseFloat(element.cantidadM2b2.toFixed(2));

                element.cantidadCajas3 = Math.trunc( element.cantidadM2b3 / element.producto.M2);
                element.cantidadPiezas3 = parseInt(
                  ((element.cantidadM2b3 * element.producto.P_CAJA) / element.producto.M2 - element.cantidadCajas3 * element.producto.P_CAJA).toFixed(0)
                );
                element.cantidadM2b3 = parseFloat(element.cantidadM2b3.toFixed(2));
              });

              var disponible = 0;
              switch (this.factura.sucursal) {
                case "matriz":
                  disponible = this.invetarioP[0].cantidadM2;
                  break;
                case "sucursal1":
                  disponible = this.invetarioP[0].cantidadM2b2;
                  break;
                case "sucursal2":
                  disponible = this.invetarioP[0].cantidadM2b3;
                  break;
                default:
              }

              if(disponible < 0)
                disponible = 0

              this.valor2 = Math.trunc(Number(disponible) / productoCombo.cantidad) 

              if(this.valor2 < this.productosVendidos[num].disponible)
                this.productosVendidos[num].disponible = this.valor2

              if(cantidadP == this.cantidadProductos)
                this.mostrarLoading = false;
              resolve(disponible)})
            .catch((err) => { resolve(false)});
    });

    Promise.all([p1]).then(values => {});
  }


 
}