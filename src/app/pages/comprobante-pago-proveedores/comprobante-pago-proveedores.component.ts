import { Component, OnInit } from '@angular/core';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { CuentasService } from 'src/app/servicios/cuentas.service';
import { SubCuentasService } from 'src/app/servicios/subCuentas.service';
import Swal from 'sweetalert2';
import { CentroCosto, Cuenta, CuentaBancaria, SubCuenta } from '../administracion-cuentas/administracion-cuenta';
import { objDate, tipoBusquedaTransaccion } from '../transacciones/transacciones';
import { contadoresDocumentos } from '../ventas/venta';
import pdfMake from "pdfmake/build/pdfmake";
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { DatosConfiguracionService } from 'src/app/servicios/datosConfiguracion.service';
import { OperacionComercial } from '../reciboCaja/recibo-caja';
import { AuthenService } from 'src/app/servicios/authen.service';
import { user } from '../user/user';
import { ProveedoresService } from 'src/app/servicios/proveedores.service';
import { OrdenDeCompra, Proveedor } from '../compras/compra';
import { CentroCostoService } from 'src/app/servicios/centro-costo.service';
import { ComprobantePago } from '../comprobante-pago/comprobante-pago';
import { ComprobantePagoProveedor, TransaccionChequesGirado, TransaccionesFacturas } from './comprobante-pago-proveedores';
import { FacturasProveedorService } from 'src/app/servicios/facturas-proveedor.service';
import { FacturaProveedor } from '../orden-compra/ordencompra';
import { ComprobantePagoProveedoresService } from 'src/app/servicios/comprobantePagoProveedores.service';
import { TransaccionesFacturasService } from 'src/app/servicios/transaccionesFacturas.service';
import { TransaccionesChequesService } from 'src/app/servicios/transaccionesCheques.service';
import { CuentaBancariaService } from 'src/app/servicios/cuentaBancaria.service';
import { OrdenesCompraService } from 'src/app/servicios/ordenes-compra.service';



@Component({
  selector: 'app-comprobante-pago-proveedores',
  templateUrl: './comprobante-pago-proveedores.component.html',
  styleUrls: ['./comprobante-pago-proveedores.component.scss']
})
export class ComprobantePagoProveedoresComponent implements OnInit {
  listadoFacturasPagar: TransaccionesFacturas [] = []
  listadoPagos: TransaccionChequesGirado [] = []

  mostrarNewCP: boolean = true;
  mostrarListaCP: boolean = false;
  mostrarTransaccionesFacturas: boolean = false;
  mostrarTransaccionesCheques: boolean = false;
  mostrarPagoDirecto: boolean = false;
  mostrarGestionCheque: boolean = false;
  comprobantePago : ComprobantePagoProveedor
  busquedaTransaccion : tipoBusquedaTransaccion
  comprobantePagoDescarga : ComprobantePagoProveedor
  listadoComprobantes: ComprobantePagoProveedor [] = []
  listadoTransaccionesFactura: TransaccionesFacturas [] = []
  listadoTransaccionesCheque: TransaccionChequesGirado [] = []
  listaTransaccionesEncontradas: TransaccionesFacturas [] = []
  listaTransaccionesEncontradasAEliminar: TransaccionesFacturas [] = []
  listaTransaccionesChequesEncontradasAEliminar: TransaccionChequesGirado [] = []
  listadoComprobantesActivos: ComprobantePagoProveedor [] = []
  listadoComprobantesAnulados: ComprobantePagoProveedor [] = []
  listadoComprobantesPendientes: ComprobantePagoProveedor [] = []
  proveedores: Proveedor [] = []


  listaFacturas: FacturaProveedor [] = []
  listaCuentasGlobal: Cuenta [] = []
  listaSubCuentas: SubCuenta [] = []
  listaSubCuentas2: SubCuenta [] = []
  listaSubCuentas3: SubCuenta [] = []
  listaCuentasBancarias: CuentaBancaria [] = []
  
  isReadOnly: boolean = false;
  contadores:contadoresDocumentos[]
  comprobantesEncontrados:ComprobantePago[]

  listadoOperaciones: OperacionComercial [] = []
  operacionComercial: OperacionComercial
  valorTotalFacturas = 0;
  valorTotalCheques = 0;
  mostrarDelete : boolean = true;
  mostrarAprobacion : boolean = false;


  mostrarLoading : boolean = false;
  mensajeLoading = "Cargando"

  parametrizaciones: parametrizacionsuc[] = [];
  detallesCostos: CentroCosto[] = [];
  parametrizacionSucu: parametrizacionsuc;
  obj: objDate;
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  menu: string[] = [
    "Nuevo Comprobante",
    "Pago Directo Facturas",
    "Comprobantes de Pago Generados",
    "Transacciones Facturas",
    "Transacciones Cheques",
    "Gestión de Cheques"
  ];

  arraySucursales: string[] = [
    "matriz",
    "sucursal1",
    "sucursal2"
  ];

  estados: string[] = [
      'Activos',
      'Pendientes',
      'Anulados',
  ];

  imagenLogotipo ="";
  textLoading = "";


  constructor(
    public _cuentasService : CuentasService,
    public _subCuentasService : SubCuentasService,
    public _transaccionFacturaService : TransaccionesFacturasService,
    public _transaccionChequesService : TransaccionesChequesService,
    public _contadoresService: ContadoresDocumentosService,
    public _comprobantePagoProveedoresService: ComprobantePagoProveedoresService,
    public _transaccionesFacturaService: TransaccionesFacturasService,
    public _parametrizacionService: ParametrizacionesService,
    public _configuracionService: DatosConfiguracionService,
    public _proveedoresService: ProveedoresService,
    public _centroCostoService: CentroCostoService,
    public _ordenCompraService: OrdenesCompraService,
    public _facturaProveedorService: FacturasProveedorService,
    public _authenService:AuthenService,
    public _cuentaBancariaService: CuentaBancariaService
    ) {
   }

  ngOnInit() {
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.listadoFacturasPagar.push(new TransaccionesFacturas());
    this.listadoPagos.push(new TransaccionChequesGirado());
    this.comprobantePago = new ComprobantePagoProveedor();
    this.cargarUsuarioLogueado();

    this.traerContadoresDocumentos();
    this.traerParametrizaciones();
    this.traerDatosConfiguracion();
    this.traerProveedores();
    this.traerCuentasBancarias();
  }


  async traerContadoresDocumentos(){
    await this._contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
      this.comprobantePago.idDocumento = this.contadores[0].comprobantePagoProveedor_Ndocumento + 1;
      this.listadoPagos[0].idPago = this.contadores[0].pagoCheque_Ndocumento + 1;
   })
  }


  traerCuentasBancarias(){
    this.mostrarLoading = true;
    this._cuentaBancariaService.getCuentas().subscribe(res => {
      this.listaCuentasBancarias = res as CuentaBancaria[];
      this.mostrarLoading = false;
   })
  }


  traerProveedores(){
    this.mostrarLoading = true;
    this._proveedoresService.getProveedor().subscribe(res => {
      this.proveedores = res as Proveedor[];
      this.mostrarLoading = false;
   })
  }

  traerFacturasPorProveedor(e){
    this.mostrarLoading = true;
    this.mensajeLoading = "Buscando Facturas"
    var factura = new FacturaProveedor();
    factura.proveedor = this.comprobantePago.nombreProveedor;
    this._facturaProveedorService.getFacturasPendientesPorProveedor(factura).subscribe(res => {
      this.listaFacturas = res as FacturaProveedor[];
      this.mostrarLoading = false;
    }) 
  }

  traerDetalleCostos(){
    this._centroCostoService.getCentrosCostos().subscribe(res => {
      this.detallesCostos = res as CentroCosto[];
   })
  }


  traerComprobantesPago(){
    this.listadoComprobantes = [];
    this.mostrarLoading = true;
    this._comprobantePagoProveedoresService.getComprobantes().subscribe(res => {
      this.listadoComprobantes = res as ComprobantePagoProveedor[];
      this.separarComprobantes();
    })  
  }

  separarComprobantes(){
    this.listadoComprobantes.forEach(element=> {
      if(element.estadoComprobante == "Activo")
        this.listadoComprobantesActivos.push(element);
      else if(element.estadoComprobante == "Pendiente")
        this.listadoComprobantesPendientes.push(element);
      else if(element.estadoComprobante == "Anulado")
        this.listadoComprobantesAnulados.push(element);
    })
    this.listadoComprobantes = this.listadoComprobantesActivos;
    this.mostrarLoading = false;
  }


  traerTransaccionesFactura(){
    this.listadoTransaccionesFactura = [];
    this.mostrarLoading = true;
    this._transaccionesFacturaService.getTransacciones().subscribe(res => {
      this.listadoTransaccionesFactura = res as TransaccionesFacturas[];
      this.mostrarLoading = false;
    })  
  }

  limpiarArrays(){
    this.listadoComprobantes = [];
    this.listadoComprobantesActivos = [];
    this.listadoComprobantesAnulados = [];
    this.listadoComprobantesPendientes = [];
  }


  traerTransaccionesCheques(){
    this.listadoTransaccionesCheque = [];
    this.mostrarLoading = true;
    this._transaccionChequesService.getTransacciones().subscribe(res => {
      this.listadoTransaccionesCheque = res as TransaccionChequesGirado[];
      this.mostrarLoading = false;
    })  
  }

  async traerTransaccionesPorFactura(e,i){ 
    var factura = await this.listaFacturas.find(element=> element._id == e.value)
    var fact = await this.listadoFacturasPagar.find(element=> element.numFactura?.toString() == factura.nFactura)
    if(fact != null){
      this.mostrarMensajeGenerico(2,"La factura se encuentra en lista")
    }
    else{
      this.listadoFacturasPagar[i].estado = factura.estado;
      this.busquedaTransaccion = new tipoBusquedaTransaccion()
      this.busquedaTransaccion.NumDocumento = factura.nFactura;
      this._transaccionFacturaService.obtenerTransaccionesPorFactura(this.busquedaTransaccion).subscribe(res => {
        this.listaTransaccionesEncontradas = res as TransaccionesFacturas[];
        this.obtenerAbonos(e,i);
        this.obtenerOrdenCompraRelacionada(e,i);
      }) 
    }    

     
  }

  async obtenerOrdenCompraRelacionada(e,i){ 
    var factura = await this.listaFacturas.find(element=> element._id == e.value)
    var newOrden = new OrdenDeCompra()
    newOrden.n_orden = factura.nSolicitud;
    this._ordenCompraService.getOrdenEspecifica(newOrden).subscribe(res => {
      var orden = res as OrdenDeCompra[];
      if(orden.length != 0)
        this.listadoFacturasPagar[i].estadoOrden = orden[0].estadoOrden;
        this.listadoFacturasPagar[i].numeroOrden = orden[0].n_orden;
    })  
  }

  async asignarDatosBanco(e,i){ 
    var cuenta = await this.listaCuentasBancarias.find(element=> element._id == e.value)
    this.listadoPagos[i].banco = cuenta.nombre
    this.listadoPagos[i].cuenta = cuenta.numero
    console.log(cuenta)
  }

  obtenerAbonos(e,i){
    this.listadoFacturasPagar[i].valorAbonado = 0;
    this.listaTransaccionesEncontradas.forEach(element =>{
      this.listadoFacturasPagar[i].valorAbonado += element.valorCancelado;
    })
    this.obtenerDatosFactura(e,i);
  }



  cargarUsuarioLogueado() {
    const promesaUser = new Promise((res, err) => {
      if (localStorage.getItem("maily") != '') 
      var correo = localStorage.getItem("maily");

      this._authenService.getUserLogueado(correo)
        .subscribe(
          res => {
            var usuario = res as user;
            this.comprobantePago.usuario = usuario[0].username.toString();
            this.comprobantePago.sucursal = usuario[0].sucursal.toString();
          }
        )
    });
  }


  

  downloadFile = (e) => {
    this.obtenerDataRecibo(e.row.data);
  };




  calcularValor(e,i){
    if(this.listadoFacturasPagar[i].valorCancelado > this.listadoFacturasPagar[i].valorSaldos){
      this.listadoFacturasPagar[i].valorCancelado = 0; 
      this.mostrarMensajeGenerico(2,"La cantidad ingresada es superior al saldo") 
    }
    this.calcularTotal();
     
  }


  calcularTotal(){
    this.valorTotalFacturas = 0;
    this.listadoFacturasPagar.forEach(element=>{
      this.valorTotalFacturas = this.valorTotalFacturas + element.valorCancelado;
    });
  }

  calcularTotalCheque(){
    console.log("sdsd")
    this.valorTotalCheques = 0;
    this.listadoPagos.forEach(element=>{
      this.valorTotalCheques = this.valorTotalCheques + element.valor;
      console.log(this.valorTotalCheques)
    });
  }


  opcionRadio(e){
    this.listadoComprobantes = [];
      switch (e.value) {
        case "Activos":
          this.listadoComprobantes = this.listadoComprobantesActivos;
          this.mostrarDelete = true;
          this.mostrarAprobacion = false;
          break;
        case "Pendientes":
          this.listadoComprobantes = this.listadoComprobantesPendientes;
          this.mostrarDelete= false;
          this.mostrarAprobacion = true;
          break;
        case "Anulados":
          this.listadoComprobantes = this.listadoComprobantesAnulados;
          this.mostrarDelete= false;
          this.mostrarAprobacion = false;
          break;
        default:    
    }    
  }



  traerComprobantesPagoPorRango() {
    this.limpiarArrays();
    this.listadoComprobantes = [];
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._comprobantePagoProveedoresService.getComprobantePorRango(this.obj).subscribe(res => {
      this.listadoComprobantes = res as ComprobantePagoProveedor[];
      this.separarComprobantes();
    })
  }


  traerTransaccionesFacturaPorRango() {
    this.listadoTransaccionesFactura = [];
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._transaccionesFacturaService.getTransaccionesPorRango(this.obj).subscribe(res => {
      this.listadoTransaccionesFactura = res as TransaccionesFacturas[];
      this.mostrarLoading = false;
    })
  }


  traerTransaccionesChequesPorRango() {
    this.listadoTransaccionesCheque = [];
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._transaccionChequesService.getTransaccionesPorRango(this.obj).subscribe(res => {
      this.listadoTransaccionesCheque = res as TransaccionChequesGirado[];
      this.mostrarLoading = false;
    })
  }

  traerParametrizaciones() {
    this._parametrizacionService.getParametrizacion().subscribe((res) => {
      this.parametrizaciones = res as parametrizacionsuc[];
    });
  }

  traerDatosConfiguracion() {
    this._configuracionService.getDatosConfiguracion().subscribe((res) => {
      this.imagenLogotipo = res[0].urlImage;
    });
  }

  obtenerDataRecibo(e){
    this._comprobantePagoProveedoresService.getComprobantePorId(e).subscribe((res) => {
      this.comprobantePagoDescarga = res[0];
      if(this.comprobantePagoDescarga != null)
        this.crearPDF(this.comprobantePagoDescarga , false);
      else
        this.mostrarMensajeGenerico(2,"Error al traer la información")
    }); 
  }

  async obtenerDatosFactura(e,i){
    var valor = 0;
    var factura = await this.listaFacturas.find(element=> element._id == e.value);
    this.listadoFacturasPagar[i].numFactura = factura.nFactura;
    this.listadoFacturasPagar[i].valorFactura = factura.total;
    this.listadoFacturasPagar[i].fechaFactura = factura.fecha;
    valor =  Number(this.listadoFacturasPagar[i].valorFactura.toFixed(2)) - Number(this.listadoFacturasPagar[i].valorAbonado.toFixed(2));
    this.listadoFacturasPagar[i].valorSaldos = Number(valor.toFixed(2))
  }


  buscarSubCuentas(e,i ,res){
    if(i==0)
      this.listaSubCuentas = res;
    if(i==1)
      this.listaSubCuentas2 = res;
    if(i==2)
      this.listaSubCuentas3 = res;
  }
 

  eliminarRegistro(i: number) {
    this.listadoFacturasPagar.splice(i, 1);
    this.calcularTotal();
  }

  eliminarRegistroPago(i: number) {
    this.listadoPagos.splice(i, 1);
    this.calcularTotalCheque();
  }


  addElement(){
    this.listadoFacturasPagar.push(new TransaccionesFacturas());
  }

  addElementPago(){
    var cont = 0;
    this.listadoPagos.push(new TransaccionChequesGirado());
    this.listadoPagos.forEach(element=>{
      cont++;
      element.idPago = this.contadores[0].pagoCheque_Ndocumento + cont;
    });
  }


  async guardar(){
    var flag = true;
    this.valorTotalCheques = 0;
    this.valorTotalFacturas = 0;

    this.listadoFacturasPagar.forEach(element=>{
      this.valorTotalFacturas = this.valorTotalFacturas + element.valorCancelado;
      if(element.valorFactura == 0 || element.valorCancelado == 0)
        flag = false;
    });

    this.listadoPagos.forEach(element=>{
      this.valorTotalCheques = this.valorTotalCheques + element.valor;
      if(element.valor == 0 || element.cuenta == null)
        flag = false;
    });
     

    if(this.valorTotalCheques != this.valorTotalFacturas){
      flag = false;
      this.mostrarMensajeGenerico(2,"El valor total de los cheques no es el mismo de la suma de las facturas");
    }

    if(flag == true)
        this.obtenerId();
    else
      this.mostrarMensajeGenerico(2,"Hay campos vacios en los registros");
  }

  obtenerId(){
    this.textLoading = "Guardando";
    this.mostrarLoading = true;
    var IdNum = new Promise<any>((resolve, reject) => {
      try {
        this._comprobantePagoProveedoresService.getComprobantePorIdConsecutivo(this.comprobantePago).subscribe(res => {
         this.comprobantesEncontrados = res as ComprobantePago[];
          if(this.comprobantesEncontrados.length == 0){
            resolve("listo");
          }else{
            this.comprobantePago.idDocumento = this.comprobantePago.idDocumento+1
            this.obtenerId();
          }
           
          },(err) => {});
      } catch (error) {
      } 
    })

    IdNum.then((data) => {
      this.generarDto();
    })
  }

  generarDto(){
    var cheques = "";
    var bancos = "";
    var cuentas = "";
    var fechas = "";
    var facturas = "";
    this.comprobantePago.transaccionesFacturas = this.listadoFacturasPagar
    this.comprobantePago.transaccionesCheques = this.listadoPagos
    //var str = id.join(";") 
    
    this.comprobantePago.transaccionesCheques.forEach(element=>{
      cheques = cheques +"-"+ element.numCheque;
      bancos = bancos +"-"+ element.banco;
      cuentas = cuentas +"-"+ element.cuenta;
      fechas = fechas +"-"+ element.fechaPagoDate.toLocaleDateString();
    });

    this.comprobantePago.transaccionesFacturas.forEach(element=>{
      element.estado = "CUBIERTA"
      element.usuario = this.comprobantePago.usuario;
      element.fechaFactura = this.comprobantePago.fechaComprobante;
      element.proveedor = this.comprobantePago.nombreProveedor;
      facturas = facturas +"-"+ element.numFactura;
      element.numCheque = cheques.slice(1);
      element.banco = bancos.slice(1);
      element.cuenta = cuentas.slice(1);
      element.fechaPago = fechas.slice(1);
    });

    this.comprobantePago.transaccionesCheques.forEach(element=>{
      element.facturas = facturas.slice(1);
      element.usuario = this.comprobantePago.usuario;
      element.proveedor = this.comprobantePago.nombreProveedor;
      element.fechaPago = element.fechaPagoDate.toLocaleDateString()
      element.fechaPagoDate = element.fechaPagoDate;
    });

    this.guardarComprobantePago(); 
  }



  guardarComprobantePago(){
    console.log(this.comprobantePago)
    try {
      this._comprobantePagoProveedoresService.newComprobantePago(this.comprobantePago).subscribe((res) => {
        this.actualizarContador();
        this.actualizarEstadosFacturas();
        this.generarTransaccionesFacturas();
      },(err) => {});
    } catch (error) {
      this.mostrarMensajeGenerico(2,"Error al guardar el comprobante"); 
    }    
  }


  actualizarContador(){
    this.contadores[0].comprobantePagoProveedor_Ndocumento = this.comprobantePago.idDocumento
    this._contadoresService.updateContadoresIDComprobantePagoProveedor(this.contadores[0]).subscribe( res => {
    },err => {})

    this.contadores[0].pagoCheque_Ndocumento = this.contadores[0].pagoCheque_Ndocumento + this.comprobantePago.transaccionesCheques.length;
    this._contadoresService.updateContadoresIDPagoCheque(this.contadores[0]).subscribe( res => {
    },err => {})
  }


  actualizarEstadosFacturas(){
    var estado = ""
    this.comprobantePago.transaccionesFacturas.forEach(element=>{
      var total = element.valorSaldos - element.valorCancelado 
      if(total == 0)
        estado = "CUBIERTA"
      else if(total > 0)
        estado = "CUBIERTA PARCIAL"

      this._facturaProveedorService.updateEstadoPorFactura(element.idFactura,estado).subscribe( res => {},err => {})
    });
  }


  generarTransaccionesFacturas(){
    var cont=0;
    this.comprobantePago.transaccionesFacturas.forEach(element=>{
      element.idComprobante = "CPP"+ this.comprobantePago.idDocumento
      try {
        this._transaccionFacturaService.newTransaccion(element).subscribe((res) => {
          cont++
          this.comprobarYMostrarMensaje(cont)},(err) => {});
      } catch (error) {
        this.mostrarMensajeGenerico(2,"Error al guardar la transaccion"); 
      }    
    }); 
    return true;
  }

  comprobarYMostrarMensaje(num:number){
    if(this.comprobantePago.transaccionesFacturas.length == num)
      this.generarTransaccionesCheques();
  }


  generarTransaccionesCheques(){
    var cont=0;
    this.comprobantePago.transaccionesCheques.forEach(element=>{
      element.idComprobante = "CPP"+ this.comprobantePago.idDocumento
      try {
        this._transaccionChequesService.newTransaccion(element).subscribe((res) => {
          cont++
          this.comprobarTransacionesCheques(cont)},(err) => {});
      } catch (error) {
        this.mostrarMensajeGenerico(2,"Error al guardar la transaccion"); 
      }    
    }); 
    return true;
  }

  comprobarTransacionesCheques(num:number){
    if(this.comprobantePago.transaccionesCheques.length == num){
      this.mostrarLoading = false;
      this.crearPDF(this.comprobantePago, true);
    }
  }

  deleteComprobante = (e) => {  
    this.anularComprobante(e.row.data)  
  }

  aprobarEliminacion = (e) => {  
   this.validarTransaccionesFactura(e.row.data)  
  }

  validarTransaccionesFactura(e){
    this.busquedaTransaccion = new tipoBusquedaTransaccion()
    this.busquedaTransaccion.NumDocumento = "CPP"+e.idDocumento
    this.busquedaTransaccion.tipoTransaccion = e.nombreProveedor
    this._transaccionFacturaService.getTransaccionesPorTipoDocumento(this.busquedaTransaccion).subscribe(res => {
      this.listaTransaccionesEncontradasAEliminar = res as TransaccionesFacturas[];
      console.log(this.listaTransaccionesEncontradasAEliminar)
      this.validarTransaccionesCheques(e);
    })
  } 


  validarTransaccionesCheques(e){
    this.busquedaTransaccion = new tipoBusquedaTransaccion()
    this.busquedaTransaccion.NumDocumento = "CPP"+e.idDocumento
    this.busquedaTransaccion.tipoTransaccion = e.nombreProveedor
    this._transaccionChequesService.getTransaccionesPorTipoDocumento(this.busquedaTransaccion).subscribe(res => {
      this.listaTransaccionesChequesEncontradasAEliminar = res as TransaccionChequesGirado[];
      console.log(this.listaTransaccionesChequesEncontradasAEliminar)

      this.eliminarComp(e) 
    })
  } 


  eliminarComp(e){
    Swal.fire({
      title: 'Eliminar Comprobante',
      text: "Eliminar comprobante #"+e.idDocumento,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.mostrarMensaje()
        var obs= e.observaciones + ".. Documento Anulado"  
        e.observaciones= obs
        this._comprobantePagoProveedoresService.updateEstado(e._id,"Anulado").subscribe(
          res => { this.eliminarTransaccionesFacturas();},
          err => { this.mostrarMensajeGenerico(2,"Error al actualizar estado")})
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.mostrarMensajeGenerico(2,"Se ha cancelado su proceso")
      }
    })
  }


  
  eliminarTransaccionesFacturas(){
    var cont = 0;
    this.listaTransaccionesEncontradasAEliminar.forEach(element=>{
      cont++;
      this._transaccionFacturaService.deleteTransaccion(element).subscribe( res => {this.contarTransacciones(cont)}, err => {alert("error")})
    })
  }

  contarTransacciones(cont){
    if(cont == this.listaTransaccionesEncontradasAEliminar.length){
      this.eliminarTransaccionesCheques();
    }
  }

  eliminarTransaccionesCheques(){
    var cont = 0;
    this.listaTransaccionesChequesEncontradasAEliminar.forEach(element=>{
      cont++;
      this._transaccionChequesService.deleteTransaccion(element).subscribe( res => {this.contarTransaccionesCheques(cont)}, err => {alert("error")})
    })
  }

  contarTransaccionesCheques(cont){
    if(cont == this.listaTransaccionesChequesEncontradasAEliminar.length){
      Swal.close()
      Swal.fire({
        title: 'Comprobante Anulado',
        text: 'Se ha guardado con éxito',
        icon: 'success',
        confirmButtonText: 'Ok'
      }).then((result) => {
        this.traerComprobantesPagoPorRango();
      })
    }
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


  anularComprobante(e:any){ 
    Swal.fire({
      title: 'Anular Comprobante',
      text: "Desea anular el comprobante #"+e.idDocumento,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this._comprobantePagoProveedoresService.updateEstado( e._id ,"Pendiente").subscribe( res => {
          Swal.fire({
            title: 'Correcto',
            text: 'Un administrador aprobará su anulación',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            this.traerComprobantesPagoPorRango();
          })
        }, err => {alert("error")})
      }else if (result.dismiss === Swal.DismissReason.cancel) {
        this.mostrarMensajeGenerico(2,"Se ha cancelado su proceso");
      }
    })
  }

  
  onRowPrepared(e: any) {
    console.log(e.data)
  if(e.data && e.data.nombreProveedor == "Rialto") {
      e.rowElement.className += " my-disable";
  }
}



  terminarOperacion(){
    this.mostrarLoading = false;
      Swal.fire({
        title:'Correcto',
        text: 'Se ha guardado con éxito',
        icon: 'success',
        confirmButtonText: 'Ok'
      }).then((result) => {
        window.location.reload()
      })
  }

  terminarDescarga(){
    this.mostrarLoading = false;
      Swal.fire({
        title:'Correcto',
        text: 'Se completo la descarga',
        icon: 'success',
        confirmButtonText: 'Ok'
      }).then((result) => {
        this.comprobantePagoDescarga = null;
      })
  }


  opcionMenu(e){
    switch (e.value) {
      case "Nuevo Comprobante":
        this.mostrarNewCP = true;
        this.mostrarListaCP = false;
        this.mostrarTransaccionesFacturas = false;
        this.mostrarTransaccionesCheques = false;
        this.mostrarPagoDirecto = false;
        this.mostrarGestionCheque = false;
        break;
      case "Pago Directo Facturas":
        this.mostrarNewCP = false;
        this.mostrarListaCP = false;
        this.mostrarTransaccionesFacturas = false;
        this.mostrarTransaccionesCheques = false;
        this.mostrarPagoDirecto = true;
        this.mostrarGestionCheque = false;
        break;
      case "Comprobantes de Pago Generados":
        this.mostrarNewCP = false;
        this.mostrarListaCP = true;
        this.mostrarTransaccionesFacturas = false;
        this.mostrarTransaccionesCheques = false;
        this.mostrarPagoDirecto = false;
        this.mostrarGestionCheque = false;
        if(this.listadoComprobantes.length == 0)
          this.traerComprobantesPagoPorRango();
        break;
      case "Transacciones Facturas":
        this.mostrarNewCP = false;
        this.mostrarListaCP = false;
        this.mostrarTransaccionesFacturas = true;
        this.mostrarTransaccionesCheques = false;
        this.mostrarPagoDirecto = false;
        this.mostrarGestionCheque = false;
        if(this.listadoTransaccionesFactura.length == 0)
          this.traerTransaccionesFacturaPorRango();
        break;
      case "Transacciones Cheques":
        this.mostrarNewCP = false;
        this.mostrarListaCP = false;
        this.mostrarTransaccionesFacturas = false;
        this.mostrarTransaccionesCheques = true;
        this.mostrarPagoDirecto = false;
        this.mostrarGestionCheque = false;
        if(this.listadoTransaccionesCheque.length == 0)
          this.traerTransaccionesChequesPorRango();
        break;
      case "Gestión de Cheques":
        this.mostrarNewCP = false;
        this.mostrarListaCP = false;
        this.mostrarTransaccionesFacturas = false;
        this.mostrarTransaccionesCheques = false;
        this.mostrarPagoDirecto = false;
        this.mostrarGestionCheque = true;
        break;
      default:    
    }      
  }


  onExporting (e) {
    e.component.beginUpdate();
    e.component.columnOption("usuario", "visible", true);
    e.component.columnOption("sucursal", "visible", true);
    e.component.columnOption("observaciones", "visible", true);
  };
  onExported (e) {
     e.component.columnOption("usuario", "visible", false);
    e.component.columnOption("sucursal", "visible", false);
    e.component.columnOption("observaciones", "visible", false);
    e.component.endUpdate(); 
  }


  onExportingTrFact (e) {
    e.component.beginUpdate();
    e.component.columnOption("numCheque", "visible", true);
    e.component.columnOption("banco", "visible", true);
    e.component.columnOption("cuenta", "visible", true);
    e.component.columnOption("usuario", "visible", true);
    e.component.columnOption("observaciones", "visible", true);
  };
  onExportedTrFact (e) {
    e.component.columnOption("numCheque", "visible", false);
    e.component.columnOption("banco", "visible", false);
    e.component.columnOption("cuenta", "visible", false);
    e.component.columnOption("usuario", "visible", false);
    e.component.columnOption("observaciones", "visible", false);
    e.component.endUpdate(); 
  }

  onExportingTrChe (e) {
    e.component.beginUpdate();
    e.component.columnOption("usuario", "visible", true);
    e.component.columnOption("observaciones", "visible", true);
  };
  onExportedTrChe (e) {
    e.component.columnOption("usuario", "visible", false);
    e.component.columnOption("observaciones", "visible", false);
    e.component.endUpdate(); 
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



  crearPDF(recibo , isNew) {
    if(isNew)
      this.textLoading = "Guardando";
    else
      this.textLoading = "Descargando";

    this.mostrarLoading = true;
    this.comprobantePagoDescarga = recibo;
    this.traerDatosFaltantes(this.comprobantePagoDescarga.sucursal);
    const documentDefinition = this.getDocumentDefinition();

    var IdNum = new Promise<any>((resolve, reject) => {
      try {
          pdfMake.createPdf(documentDefinition).download("Comprobante_Pago_Proveedor " + this.comprobantePagoDescarga.idDocumento,function (response){resolve("listo")});
      } catch (error) {
      } 

    })

    IdNum.then((data) => {
      if(isNew)
        this.terminarOperacion();
      else
        this.terminarDescarga();
    });

  }

  traerDatosFaltantes(sucursal){
    this.parametrizacionSucu = this.parametrizaciones.find(element=> element.sucursal == sucursal);
  }



  getDocumentDefinition() {
    return {
      pageSize: "A4",
      pageOrientation: "portrait",
      content: [
        {
          columns: [
            {
              image: this.imagenLogotipo,
              width: 100,
              margin: [0, 0, 0, 0],
            },
            {
              width: 410,
              margin: [0, 0, 0, 0],
              text: " ",
              alignment: "right",
            },
          ],
        },

        {
          columns: [
            [
              {
                text: this.parametrizacionSucu.razon_social,fontSize: 8,
              },
              {
                text: "RUC: " + this.parametrizacionSucu.ruc,fontSize: 8,
              },
              {
                text: "Venta de materiales para acabados de construcción, porcelanatos, cerámicas ",fontSize: 8,
              },
              {
                text: "Dirección: " + this.parametrizacionSucu.direccion,fontSize: 8,
              },
              {
                text: "Teléfonos: " + this.parametrizacionSucu.telefonos,fontSize: 8,
              },
              {
                text: "Auto SRI " + this.parametrizacionSucu.sri,fontSize: 8,
              },
              {
                columns: [
                  {
                    width: 360,
                    text: "COMPROBANTE/PAGO-PROVEEDOR  001 - 000",
                    bold: true,
                    fontSize: 16,
                  },
                  {
                    width: 160,
                    text: "NO 000000" + this.comprobantePagoDescarga.idDocumento,
                    color: "red",
                    bold: true,
                    fontSize: 16,
                    alignment: "right",
                  },
                ],
              },
              {
                //Desde aqui comienza los datos del cliente
                style: "tableExample",
                table: {
                  widths: [100, 140, 100, 140],
                  body: [
                    [
                      {
                        stack: [
                          {
                            type: "none",
                            bold: true,
                            fontSize: 8,
                            ul: [
                              "Fecha",
                              "Girado A",
                              "Usuario",
                            ],
                          },
                        ],
                      },
                      {
                        stack: [
                          {
                            type: "none",
                            fontSize: 8,
                            ul: [
                              "" + this.comprobantePagoDescarga.fechaComprobante.toLocaleString(),
                              "" + this.comprobantePagoDescarga.giradoA,
                              "" + this.comprobantePagoDescarga.usuario,
                            ],
                          },
                        ],
                      },
                      {
                        stack: [
                          {
                            type: "none",
                            bold: true,
                            fontSize: 8,
                            ul: [
                              "Referencia",
                              "Proveedor",
                              "Sucursal",
                            ],
                          },
                        ],
                      },
                      [
                        {
                          stack: [
                            {
                              type: "none",
                              fontSize: 8,
                              ul: [
                                "" + this.comprobantePagoDescarga.referencia,
                                "" + this.comprobantePagoDescarga.nombreProveedor,
                                "" + this.comprobantePagoDescarga.sucursal,
                              ],
                            },
                          ],
                        },
                      ],
                    ],
                  ],
                },
              },
            ],
            [],
          ],
        },

        { text: " RELACIÓN DE FACTURAS A PAGAR " ,style: "subtitulos" },
        this.getListaOperaciones(this.comprobantePagoDescarga.transaccionesFacturas),
        { text: " " },
         { text: " RELACIÓN DE DOCUMENTOS DE PAGO " ,style: "subtitulos" },
        this.getTransaccionesCheques(this.comprobantePagoDescarga.transaccionesCheques),

      ],
      footer: function () {
        return {
          table: {
            body: [
              [
                {
                  text:" ",
                },
              ],
            ],
          },
          layout: "noBorders",
        };
      },
      pageBreakBefore: function (currentNode,followingNodesOnPage) {
        return (
          currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
        );
      },

      images: {
        mySuperImage: "data:image/jpeg;base64,...content...",
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: "underline",
        },
        subtitulos: {
          fontSize: 13,
          bold: true,
          alignment: "center",
        },
        textoPro: {
          bold: true,
          margin: [0, -12, 0, -5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableExample2: {
          margin: [-13, 5, 10, 15],
        },
        tableExample3: {
          margin: [-13, -10, 10, 15],
        },
        tableExample4: {
          margin: [10, -5, 0, 15],
        },
        texto6: {
          fontSize: 14,
          bold: true,
          alignment: "center",
        },
        name: {
          fontSize: 16,
          bold: true,
        },
        jobTitle: {
          fontSize: 14,
          bold: true,
          italics: true,
        },
        textFot: {
          alignment: "center",
          italics: true,
          color: "#bebebe",
          fontSize: 18,
        },
        tableHeader: {
          bold: true,
        },
        tableHeader2: {
          bold: true,
          fontSize: 10,
        },
        fondoFooter: {
          fontSize: 8,
          alignment: "center",
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
          margin: [15, 0, 0, 0],
        },
        sizeText:{
          fontSize:9,
        }
      },
    };
  }

  getListaOperaciones(operaciones: TransaccionesFacturas[]) {
    return {
      table: {
        widths: ["12%", "12%", "12%", "12%", "12%", "10%", "30%"],
        alignment: "center",
        fontSize: 8,
        headerRows: 2,
        body: [
          [
            {
              text: "Factura",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Valor Factura",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Abonados",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Saldos",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Valor",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Estado",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Observaciones",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },

          ],

          ...operaciones.map((ed) => {
            return [
              { text: ed.numFactura,alignment: "center", fontSize: 8 },
              { text: ed.valorFactura, alignment: "center", fontSize: 8 },
              { text: ed.valorAbonado, alignment: "center", fontSize: 8 },
              { text: ed.valorSaldos, alignment: "center", fontSize: 8 },
              { text: ed.valorCancelado, alignment: "center", fontSize: 8 },
              { text: ed.estado, alignment: "center", fontSize: 8 },
              { text: ed.observaciones, alignment: "center", fontSize: 8 },

            ];
          }),
        ],
      },
    };
  }



  getTransaccionesCheques(operaciones: TransaccionChequesGirado[]) {
    if(operaciones?.length > 0){
      return {
      table: {
        widths: ["12%", "12%", "12%", "12%", "12%", "10%", "30%"],
        alignment: "center",
        fontSize: 8,
        headerRows: 2,
        body: [
          [
            {
              text: "Nª Pago",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Cheque",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Valor",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Fecha Pago",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Banco",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Cuenta",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Observaciones",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },

          ],

          ...operaciones.map((ed) => {
            return [
              { text: ed.idPago,alignment: "center", fontSize: 8 },
              { text: ed.numCheque, alignment: "center", fontSize: 8 },
              { text: ed.valor, alignment: "center", fontSize: 8 },
              { text: ed.fechaPago, alignment: "center", fontSize: 8 },
              { text: ed.banco, alignment: "center", fontSize: 8 },
              { text: ed.cuenta, alignment: "center", fontSize: 8 },
              { text: ed.observaciones, alignment: "center", fontSize: 8 },
            ];
          }),
        ],
      },
    };
    }
    
  }


  




  


}
