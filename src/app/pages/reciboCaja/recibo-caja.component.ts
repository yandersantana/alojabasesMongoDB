import { Component, OnInit } from '@angular/core';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { CuentasService } from 'src/app/servicios/cuentas.service';
import { CuentasPorCobrarService } from 'src/app/servicios/cuentasPorCobrar.service';
import { ReciboCajaService } from 'src/app/servicios/reciboCaja.service';
import { SubCuentasService } from 'src/app/servicios/subCuentas.service';
import { TransaccionesFinancierasService } from 'src/app/servicios/transaccionesFinancieras.service';
import Swal from 'sweetalert2';
import { Cuenta, SubCuenta } from '../administracion-cuentas/administracion-cuenta';
import { CuentaPorCobrar } from '../cuentasPorCobrar/cuentasPorCobrar';
import { objDate, tipoBusquedaTransaccion } from '../transacciones/transacciones';
import { TransaccionesFinancieras } from '../transaccionesFinancieras/transaccionesFinancieras';
import { cliente, contadoresDocumentos, factura } from '../ventas/venta';
import { dataDocumento, OperacionComercial, ReciboCaja } from './recibo-caja';
import pdfMake from "pdfmake/build/pdfmake";
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { DatosConfiguracionService } from 'src/app/servicios/datosConfiguracion.service';
import { AuthenService } from 'src/app/servicios/authen.service';
import { user } from '../user/user';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturasService } from 'src/app/servicios/facturas.service';
import { NotasVentasService } from 'src/app/servicios/notas-ventas.service';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { CajaMenorService } from 'src/app/servicios/cajaMenor.service';
import { CajaMenor } from '../cajaMenor/caja-menor';

@Component({
  selector: 'app-recibo-caja',
  templateUrl: './recibo-caja.component.html',
  styleUrls: ['./recibo-caja.component.scss']
})
export class ReciboCajaComponent implements OnInit {

  resultado =0;
  listaCuentas: Cuenta [] = []
  listaCuentasGlobal: Cuenta [] = []
  listaSubCuentas: SubCuenta [] = []
  listaSubCuentas2: SubCuenta [] = []
  listaSubCuentas3: SubCuenta [] = []
  isReadOnly: boolean = false;
  isNormal: boolean = true;
  isFacturacion: boolean = true;
  numReciboCajaTraido = "";
  contadores:contadoresDocumentos[]
  recibosEncontrados:ReciboCaja[]
  documentoVenta = "";
  listadoOperaciones: OperacionComercial [] = []
  operacionComercial: OperacionComercial
  reciboCaja : ReciboCaja
  reciboCajaDescarga : ReciboCaja
  valorTotal1 = 0;
  valorTotal2 = 0;
  mostrarLoading : boolean = false;
  mostrarLoadingBase : boolean = false;
  newRecibo: boolean = true;
  registroRecibos: boolean = false;
  autorizaciones: boolean = false;
  listadoRecibosCaja: ReciboCaja [] = []
  listadoRecibosCajaNoAutorizados: ReciboCaja [] = []
  listadoRecibosCajaActivos: ReciboCaja [] = []
  listadoRecibosCajaAnulados: ReciboCaja [] = []
  listadoRecibosCajaPendientes: ReciboCaja [] = []
  parametrizaciones: parametrizacionsuc[] = [];
  transaccionesFinancieras: TransaccionesFinancieras [] = []
  datosDocumento: dataDocumento [] = []
  facturas:factura[] = []
  clientes:cliente[] = []
  parametrizacionSucu: parametrizacionsuc;
  obj: objDate;
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  bloquearValor = false;
  existeCuentaPorCobrar=false;
  seccionPrestamo : boolean = false;
  isTipoCierre = false;
  menu: string[] = [
    "Nuevo Recibo",
    "Autorizaciones",
    "Recibos Cajas Generados"
  ];

  tipoDocumentos: string[] = [
    "Factura",
    "Nota de Venta"
  ];

  tiposBusqueda: string[] = [
    "Nombre",
    "Documento"
  ];

  estados: string[] = [
    'Activos',
    'Pendientes',
    'Anulados',
  ];

  tiposRecibo: string[] = [
    'Normal',
    'Cierre',
    'Facturación',
    'Cta.x Cobrar',
    'Préstamos',
  ];

  imagenLogotipo ="";
  textLoading = "";
  busquedaTransaccion: tipoBusquedaTransaccion; 
  mostrarDelete : boolean = true;
  mostrarAprobacion : boolean = false;
  mostrarCliente : boolean = false;
  mostrarCedula : boolean = false;
  tipoDocumento = 0;
  idDocumento = 0;
  factura : factura;
  textoDatosFactura = "";
  valorTipoBusqueda = "";
  valorDocumento = "";
  nombre_cliente = "";
  idCuentaPorCobrar = "";
  tipoRecibo = "";
  bloquearBoton = false;
  fechaDocumentoPendiente = new Date();
  existeCaja = false
  valorTotalInicioFactura = 0
  tipoDocumentoCuenta = ""
  fechaDeuda = new Date()



  constructor(
    public _cuentasService : CuentasService,
    public _subCuentasService : SubCuentasService,
    public _transaccionFinancieraService : TransaccionesFinancierasService,
    public _reciboCajaService : ReciboCajaService,
    public _contadoresService: ContadoresDocumentosService,
    public _cuentaPorCobrar: CuentasPorCobrarService,
    public _parametrizacionService: ParametrizacionesService,
    public _configuracionService: DatosConfiguracionService,
    public _facturaService: FacturasService,
    public _notaVentaService : NotasVentasService,
    public _clienteService : ClienteService,
    public _authenService:AuthenService,
    public _cajaMenorService : CajaMenorService,
    private route: ActivatedRoute,
    private _router: Router) {
      this.factura = new factura()
      this.tipoRecibo = this.tiposRecibo[0];
   }

  ngOnInit() {
    this.reciboCaja = new ReciboCaja();
    this.route.queryParams.subscribe(params => {
      this.documentoVenta = params['id'] || 0;
      this.idDocumento = params['id'] || 0;
      this.tipoDocumento = params['tipo'] || 0;
    });

    if(this.idDocumento != 0 && this.tipoDocumento != 0)
      this.buscarDatosFactura();

    this.cargarUsuarioLogueado();
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.listadoOperaciones.push(new OperacionComercial());
    this.reciboCaja.fecha = new Date();
    this.traerContadoresDocumentos();
    this.traerListaCuentas();
    this.traerParametrizaciones();
    this.traerDatosConfiguracion();
  }

  buscarDatosFactura(){
    this.isNormal = false;
    this.isFacturacion = true;
    this.tipoRecibo = this.tiposRecibo[1];
    if(this.tipoDocumento == 1){
      this.reciboCaja.docVenta = this.idDocumento.toString();
      this.reciboCaja.tipoDoc = this.tipoDocumentos[0];
      this.traerDocumentosPorTipo(this.reciboCaja.tipoDoc,1)
    }else if(this.tipoDocumento == 2){
      this.reciboCaja.docVenta = this.idDocumento.toString();
      this.reciboCaja.tipoDoc = this.tipoDocumentos[1];
      this.traerDocumentosPorTipo(this.reciboCaja.tipoDoc,1)
    }
  }


  async traerContadoresDocumentos(){
    await this._contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
      this.reciboCaja.idDocumento = this.contadores[0].reciboCaja_Ndocumento + 1;
   })
  }


  traerListaCuentas(){
    this._cuentasService.getCuentas().subscribe(res => {
      this.listaCuentasGlobal = res as Cuenta[];
      this.separarcuentas();
   })
  }

  separarcuentas(){
    this.listaCuentasGlobal.forEach(element=>{
      if(element.tipoCuenta == "Ingresos" || element.tipoCuenta == "Reales y Transitorias")
        this.listaCuentas.push(element);
    })
  }

  cargarCuentasCierre(){
    this.listaCuentas = []
    this.listaCuentasGlobal.forEach(element=>{
      if(element._id == "6195b01ef75a418e9c2eba04" || element._id == "6195af71f75a418e9c2eba03")
        this.listaCuentas.push(element);
    })
  }

  traerRecibosCaja(){
    this.mostrarLoadingBase = true;
    this._reciboCajaService.getRecibos().subscribe(res => {
      this.listadoRecibosCaja = res as ReciboCaja[];
      this.mostrarLoadingBase = false;
   })
  }

  traerRecibosCajaNoAutorizados(){
    this.mostrarLoadingBase = true;
    this._reciboCajaService.getRecibosNoAutorizados().subscribe(res => {
      this.listadoRecibosCajaNoAutorizados = res as ReciboCaja[];
      this.mostrarLoadingBase = false;
   })
  }

  traerClientes(){
    this._clienteService.getCliente().subscribe(res => {
      this.clientes = res as cliente[];
   })
  }

  traerDocumentosPorTipo(e, tipo : number){
    this.facturas = [];
    var valor = "";
    if(tipo == 2) valor = e.value;
    else valor = e;

    this.reciboCaja.docVenta = valor;
    this.reciboCaja.numDocumento = this.documentoVenta;

    if(valor == "Factura"){
      this.factura.documento_n = Number(this.reciboCaja.numDocumento);
      this._facturaService.getFacturasDocumentoVenta(this.factura).subscribe(res => {
        this.facturas = res as factura[];
        this.llenarDatosCombo(this.facturas)
      });
    }else if(valor == "Nota de Venta"){
      this.factura.documento_n = Number(this.reciboCaja.numDocumento);
      this._notaVentaService.getNotasVentaXDocumento(this.factura).subscribe(res => {
        this.facturas = res as factura[];
        this.llenarDatosCombo(this.facturas)
      });
    }
  }

  asignarDatos(e){
    this.idCuentaPorCobrar = e.value._id;
    this.textoDatosFactura = e.value.textoCombo;
    this.reciboCaja.cliente = e.value.nombreCliente;
    this.reciboCaja.ruc = e.value.rucCliente;
    this.reciboCaja.valorFactura = e.value.totalFactura;
    this.reciboCaja.sucursal = e.value.sucursal;
    this.valorTotalInicioFactura = e.value.valorInicialFactura
    this.tipoDocumentoCuenta = e.value.tipo_documento
    this.fechaDeuda = e.value.fecha_deuda
    if(this.tipoRecibo == "Facturacion")
      this.reciboCaja.fecha = e.value.fecha;

    if(this.tipoRecibo == "Cta.x Cobrar"){
      this.fechaDocumentoPendiente = e.value.fecha;
      console.log(e.value.fecha);
      console.log(this.fechaDocumentoPendiente);
      this.reciboCaja.numDocumento = e.value.num_documento;
    }
      
   
  }


  llenarDatosCombo(array){
    this.datosDocumento = [];
    array.forEach(element => {
      var object = new dataDocumento();
      object._id = element._id;
      object.nombreCliente = element.cliente.cliente_nombre;
      object.rucCliente = element.cliente.ruc;
      object.totalFactura = element.total.toString();
      object.valorInicialFactura = element.total.toString();
      object.tipo_documento = element.tipoDocumento;
      object.textoCombo = object.nombreCliente+" - "+object.rucCliente+" - "+object.totalFactura;
      object.fecha = element.fecha;
      object.fecha_deuda = element.fecha;
      object.sucursal = element.sucursal;
      console.log(object)
      this.datosDocumento.push(object);
    });
  }



  cargarUsuarioLogueado() {
    const promesaUser = new Promise((res, err) => {
      if (localStorage.getItem("maily") != '') 
      var correo = localStorage.getItem("maily");

      this._authenService.getUserLogueado(correo)
        .subscribe(
          res => {
            var usuario = res as user;
            this.reciboCaja.sucursal = usuario[0].sucursal.toString();
          }
        )
    });
  }

  setClienteData(e){
    this.textLoading = "Buscando..";
    this.mostrarLoading = true;
    if(this.valorTipoBusqueda == "Nombre"){
      var docData = new dataDocumento();
      docData.nombreCliente = this.nombre_cliente;
      this._cuentaPorCobrar.getCuentasXCobrarPorNombre(docData).subscribe(res => {
        var cuentas = res as CuentaPorCobrar[];
        this.llenarDatosComboCuentasCobrar(cuentas);
        this.mostrarLoading = false;
      });
    }else if(this.valorTipoBusqueda == "Documento"){
      var docData = new dataDocumento();
      docData.rucCliente = this.valorDocumento;
      this._cuentaPorCobrar.getCuentasXCobrarPorRUC(docData).subscribe(res => {
        var cuentas = res as CuentaPorCobrar[];
        this.llenarDatosComboCuentasCobrar(cuentas);
        this.mostrarLoading = false;
      });
    }
  }

  llenarDatosComboCuentasCobrar(array){
    this.datosDocumento = [];
    array.forEach(element => {
      var object = new dataDocumento();
      object._id = element._id;
      object.nombreCliente = element.cliente;
      object.rucCliente = element.rucCliente;
      object.totalFactura = element.valor;
      object.valorInicialFactura = element.valorFactura;
      object.sucursal = element.sucursal;
      object.fecha = element.fecha;
      object.fecha_deuda = element.fecha_deuda;
      object.num_documento = element.documentoVenta;
      object.tipo_documento = element.tipo_doc;
      object.textoCombo = element.rCajaId+" - "+object.totalFactura;
      this.numReciboCajaTraido = element.rCajaId;
      this.datosDocumento.push(object);
    });
  }


  asignarValorBusqueda(e){
    if(e.value == "Nombre"){
      if(this.clientes.length == 0)
        this.traerClientes();

      this.mostrarCliente = true;
      this.mostrarCedula = false;
    }else{
      this.mostrarCliente = false;
      this.mostrarCedula = true;

    }
  }

  downloadFile = (e) => {
    this.obtenerDataRecibo(e.row.data);
  };

  deleteRecibo = (e) => {  
    this.anularRecibo(e.row.data)  
  }

  anularRecibo(e:any){ 
    Swal.fire({
      title: 'Anular Recibo',
      text: "Desea anular el recibo #"+e.idDocumento,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this._reciboCajaService.updateEstado( e._id ,"Pendiente").subscribe( res => {

        Swal.fire({
          title: 'Correcto',
          text: 'Un administrador aprobará su anulación',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
         this.traerRecibosCajaPorRango();
        })
        }, err => {alert("error")})
      
      }else if (result.dismiss === Swal.DismissReason.cancel) {
        this.mostrarMensajeGenerico(2,"Se ha cancelado su proceso");
      }
    })
  }


  traerRecibosCajaPorRango() {
    this.limpiarArrays();
    this.listadoRecibosCaja = [];
    this.mostrarLoadingBase = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._reciboCajaService.getReciboCajaPorRango(this.obj).subscribe(res => {
      this.listadoRecibosCaja = res as ReciboCaja[];
      this.separarRecibos();
    })
  }

  separarRecibos(){
    this.listadoRecibosCaja.forEach(element=> {
      if(element.estadoRecibo == "Activo")
        this.listadoRecibosCajaActivos.push(element);
      else if(element.estadoRecibo == "Pendiente")
        this.listadoRecibosCajaPendientes.push(element);
      else if(element.estadoRecibo == "Anulado")
        this.listadoRecibosCajaAnulados.push(element);
    })
    this.listadoRecibosCaja = this.listadoRecibosCajaActivos;
    this.mostrarLoadingBase = false;
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
    this._reciboCajaService.getReciboCajaPorId(e).subscribe((res) => {
      this.reciboCajaDescarga = res[0];
      if(this.reciboCajaDescarga != null)
        this.crearPDF(this.reciboCajaDescarga , false);
      else
        this.mostrarMensajeGenerico(2,"Error al traer la información")
    }); 
  }

  limpiarArrays(){
    this.listadoRecibosCaja = [];
    this.listadoRecibosCajaActivos = [];
    this.listadoRecibosCajaAnulados = [];
    this.listadoRecibosCajaPendientes = [];
  }

  opcionRadio(e){
    this.listadoRecibosCaja = [];
    switch (e.value) {
      case "Activos":
        this.listadoRecibosCaja = this.listadoRecibosCajaActivos;
        this.mostrarDelete = true;
        this.mostrarAprobacion = false;
        break;
      case "Pendientes":
        this.listadoRecibosCaja = this.listadoRecibosCajaPendientes;
        this.mostrarDelete= false;
        this.mostrarAprobacion = true;
        break;
      case "Anulados":
        this.listadoRecibosCaja = this.listadoRecibosCajaAnulados;
        this.mostrarDelete= false;
        this.mostrarAprobacion = false;
        break;
      default:    
    }      
  }


  opcionRadioTipos(e){
    this.tipoRecibo = e.value;
    switch (e.value) {
      case "Normal":
        this.bloquearValor = false;
        this.isFacturacion = true;
        this.isNormal = true;
        this.isTipoCierre = false;
        this.seccionPrestamo = false;
        break;
      case "Facturación":
        this.bloquearValor = true;
        this.isFacturacion = true;
        this.isNormal = false;
        this.isTipoCierre = false;
        this.seccionPrestamo = false;
        break;
      case "Cta.x Cobrar":
        this.bloquearValor = false;
        this.isFacturacion = false;
        this.isNormal = false;
        this.isTipoCierre = false;
        this.seccionPrestamo = false;
        break;
      case "Cierre":
        this.bloquearValor = false;
        this.isFacturacion = true;
        this.isNormal = true;
        this.isTipoCierre = true;
        this.seccionPrestamo = false;
        this.cargarCuentasCierre();
        break;
      case "Préstamos":
        this.seccionPrestamo = true;
        break;
      default:    
    }      
  }


  


  buscarSubCuentas(e,i ,res){
    var array = []
    if(this.tipoRecibo == "Facturación" || this.tipoRecibo == "Cta.x Cobrar"){
      res.forEach(element => {
        if(element.nombre == "1.3.0 Facturacion" || element.nombre == "1.3.1 Nota_Venta"){
        }else{
          array.push(element)
        }
      });

      if(i==0)
        this.listaSubCuentas = array;
      if(i==1)
        this.listaSubCuentas2 = array;
      if(i==2)
        this.listaSubCuentas3 = array;
    }else{
      if(i==0)
        this.listaSubCuentas = res;
      if(i==1)
        this.listaSubCuentas2 = res;
      if(i==2)
        this.listaSubCuentas3 = res;
    }

    
  }


  traersubCuentas(e,i){
    var arrayCuentas = [];
    this.listaCuentas.forEach(element =>{
      if(element._id == e.value){
        this._subCuentasService.getSubCuentasPorId(e.value).subscribe(res => {
          element.sub_cuentaList = res as SubCuenta[];
          if(element._id == "6195b036f75a418e9c2eba06"){
            element.sub_cuentaList.forEach(element2 =>{
              if(element2.tipoCuenta == "INGRESO")
              arrayCuentas.push(element2)
            })
            this.buscarSubCuentas(e,i , arrayCuentas);
          }else{
            this.buscarSubCuentas(e, i , res);
          }
        })
      }
    })
  }

  calcularTotal(e){
    this.reciboCaja.valorPagoEfectivo = 0;
    this.listadoOperaciones.forEach(element =>{
      this.reciboCaja.valorPagoEfectivo +=element.valor;
    })
    this.calcularValores();
  }

 
  calcularValores(){
    this.valorTotal1 = this.reciboCaja.valorFactura;
    this.valorTotal2 = this.reciboCaja.valorPagoEfectivo ;
    this.reciboCaja.valorSaldos = this.valorTotal1 - this.valorTotal2 + this.reciboCaja.valorRecargo;
    if(this.reciboCaja.valorSaldos < 0)
/*     Swal.fire({
        title: "Atención",
        text: texto,
        icon: 'success'
      }) */
       Swal.fire( "Atención","La suma de los valores no puede ser mayor al valor de la factura",'warning')
      //this.mostrarMensajeGenerico(2,"La suma de los valores no puede ser mayor al valor de la factura");
  }

  eliminarRegistro(i: number) {
    this.listadoOperaciones.splice(i, 1);
  }

  aprobarEliminacion = (e) => {  
    this.validarTransacciones(e.row.data)  
  }

  autorizarReciboAdmin = (e) => {  
    this.autorizarRecibo(e.row.data)  
  }

  rechazarReciboAdmin = (e) => {  
    this.recRecibo(e.row.data)  
  }


  addElement(){
    if(this.listadoOperaciones.length <= 2)
      this.listadoOperaciones.push(new OperacionComercial());
    else
      this.mostrarMensajeGenerico(2,"No se pueden ingresar mas operaciones");
  }



  validarTransacciones(e){
    this.busquedaTransaccion = new tipoBusquedaTransaccion()
    this.busquedaTransaccion.NumDocumento = e.idDocumento
    this.busquedaTransaccion.tipoTransaccion = "recibo-caja"
    this._transaccionFinancieraService.getTransaccionesPorTipoDocumento(this.busquedaTransaccion).subscribe(res => {
      this.transaccionesFinancieras = res as TransaccionesFinancieras[];
      if(this.transaccionesFinancieras.length == 0)
        this.mostrarMensajeGenerico(2,"No se encontraron transacciones")
      else
        this.eliminarComp(e)
    })
  }

  traerTransaccionesYActualizar(e){
    this.textLoading = "Actualizando"
    this.mostrarLoading = true;
    this.busquedaTransaccion = new tipoBusquedaTransaccion()
    this.busquedaTransaccion.NumDocumento = e.idDocumento
    this.busquedaTransaccion.tipoTransaccion = "recibo-caja"
    this._transaccionFinancieraService.getTransaccionesPorTipoDocumento(this.busquedaTransaccion).subscribe(res => {
      this.transaccionesFinancieras = res as TransaccionesFinancieras[];
      if(this.transaccionesFinancieras.length == 0){
        this.mostrarLoading = false;
        this.mostrarMensajeGenerico(2,"No se encontraron transacciones")
      }
      else{
         this.updateEstadoRecibo(e)
      }
       
    })
  }

  updateEstadoRecibo(e){
    e.isAutorizado = true
    e.isRechazado = false
    this._reciboCajaService.updateReciboCajaCierre(e).subscribe(
      res => { this.actualizarTransaccionesAutorizadas(e)},
      err => { this.mostrarMensajeGenerico(2,"Error al actualizar estado recibo")})
  }

  actualizarTransaccionesAutorizadas(e){
    var cont = 0
    this.transaccionesFinancieras.forEach(element=>{
      element.isContabilizada = true;
      this._transaccionFinancieraService.updateIsContabilizada(element,true).subscribe((res) => {cont++,this.terminarOperacionActualizaciones(cont)},(err) => {});
    });
  }

  terminarOperacionActualizaciones(num){
    if(this.transaccionesFinancieras.length == num){
      this.mostrarLoading = false;
      Swal.fire({
        title:'Correcto',
        text: 'Se ha actualizado con éxito',
        icon: 'success',
        confirmButtonText: 'Ok'
      }).then((result) => {
        window.location.reload()
      })
    }
    
  }



  



  eliminarComp(e){
    Swal.fire({
      title: 'Anular Recibo Caja',
      text: "Anular documento #"+e.idDocumento,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.mostrarMensaje()
        var obs= e.observaciones + ".. Documento Anulado"  
        e.observaciones= obs
        this._reciboCajaService.updateEstado(e._id,"Anulado").subscribe(
          res => { this.completarEliminacion(e)},
          err => { this.mostrarMensajeGenerico(2,"Error al actualizar estado")})
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.mostrarMensajeGenerico(2,"Se ha cancelado su proceso")
      }
    })
  }

  autorizarRecibo(e){
    Swal.fire({
      title: 'Autorizar Recibo',
      text: "Desea autorizar el recibo #"+e.idDocumento,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.traerTransaccionesYActualizar(e)
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.mostrarMensajeGenerico(2,"Se ha cancelado su proceso")
      }
    })
  }


  recRecibo(e){
    Swal.fire({
      title: 'Rechazar Autorizacion',
      text: "Rechazar la autorizacion del recibo #"+e.idDocumento,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.mostrarLoading = true
        e.isAutorizado = true
        e.isRechazado = true
        this._reciboCajaService.updateReciboCajaCierre(e).subscribe(
          res => { 
            Swal.fire({
              title:'Correcto',
              text: 'Se ha actualizado con éxito',
              icon: 'success',
              confirmButtonText: 'Ok'
            }).then((result) => {
              window.location.reload()
            })
          },
          err => { this.mostrarMensajeGenerico(2,"Error al actualizar estado recibo")})
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.mostrarMensajeGenerico(2,"Se ha cancelado su proceso")
      }
    })
  }

  completarEliminacion(e){
    this.eliminarTransacciones();
    this.eliminarCuentaPorCobrar(e);
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


  eliminarTransacciones(){
    var cont = 0;
    this.transaccionesFinancieras.forEach(element=>{
      cont++;
      this._transaccionFinancieraService.deleteTransaccionFinanciera(element).subscribe( res => {this.contarTransacciones(cont)}, err => {alert("error")})
    })
  }


  eliminarCuentaPorCobrar(e){
    var cuenta = new CuentaPorCobrar();
    cuenta.rCajaId = "RC"+e.idDocumento;
    this._cuentaPorCobrar.deleteCuentaPorCobrar(cuenta).subscribe( res => {}, err => {alert("error")})
  }

  contarTransacciones(cont){
    if(cont == this.transaccionesFinancieras.length){
      Swal.close()
      Swal.fire({
        title: 'Recibo Anulado',
        text: 'Se ha guardado con éxito',
        icon: 'success',
        confirmButtonText: 'Ok'
      }).then((result) => {
        this.traerRecibosCajaPorRango();
      })
    }
  }



  async guardar(){
    var flag = true;
    this.bloquearBoton = true;
    this.listadoOperaciones.forEach(element=>{
      if(element.idCuenta == null || element.idSubCuenta == null || element.valor == 0){
        flag = false;
      }
    });

    if(flag == true){
      if(this.reciboCaja.valorFactura == 0){
        this.mostrarMensajeGenerico(2,"Debe ingresar un valor de la factura"); 
        flag = false;
        this.bloquearBoton = false;
      }

      if(this.reciboCaja.valorSaldos < 0){
        Swal.fire( "Atención","La suma de los valores no puede ser mayor al valor de la factura, por favor actulice los valores e intente nuevamente",'warning')
        flag = false;
        this.bloquearBoton = false;
      }

      if(this.tipoRecibo == "Cta.x Cobrar" && this.reciboCaja.valorSaldos != 0){
        Swal.fire( "Atención","El saldo del recibo debe ser igual a 0, si el valor a pagar es menor al valor total de la deuda por favor genere una nueva cuenta por Cobrar",'warning')
        flag = false;
        this.bloquearBoton = false;
      } 
            
      if(flag)
        this.obtenerId();
    }
    else{
      this.mostrarMensajeGenerico(2,"Hay campos vacios en los registros");
      this.bloquearBoton = false;
    }
      
  }

  validarEstadoCaja(){
    this.reciboCaja.fecha.setHours(0,0,0,0);
    this._cajaMenorService.getCajaMenorPorFecha(this.reciboCaja).subscribe(
      res => {
       var listaCaja = res as CajaMenor[];
        if(listaCaja.length != 0 ){
          var caja = listaCaja.find(element=>element.sucursal == this.reciboCaja.sucursal) ;
          if(caja != undefined){
            if(caja.sucursal == this.reciboCaja.sucursal && caja.estado == "Cerrada" )
              Swal.fire( "Atención","No puede generar registros para la fecha establecida, la caja menor se encuentra cerrada",'error')
            else
              this.guardar()
          }else
            this.guardar()
        }else
          this.guardar()
      },
      (err) => {});
  }

  validarEstadoCajaCierre(){
    this.reciboCaja.fecha.setHours(0,0,0,0);
    this._cajaMenorService.getCajaMenorPorFecha(this.reciboCaja).subscribe(
      res => {
       var listaCaja = res as CajaMenor[];
        if(listaCaja.length != 0 ){
          var caja = listaCaja.find(element=>element.sucursal == this.reciboCaja.sucursal) ;
          if(caja != undefined){
            if(caja.sucursal == this.reciboCaja.sucursal && caja.estado == "Cerrada" )
              Swal.fire( "Atención","No puede generar registros para la fecha establecida, la caja menor se encuentra cerrada",'error')
            else
              this.generarCierre()
          }else
            this.generarCierre()
        }else
          this.generarCierre()
      },
      (err) => {});
  }

  generarCierre(){
    Swal.fire({
      title: 'Cierre Caja',
      text: "Estimado usuario esta realizando un recibo de caja tipo Cierre, recuerde que debe ser aprobado previamente por un administrador. Desea continuar?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.reciboCaja.isAutorizado = false;
        this.guardar()
      }else if (result.dismiss === Swal.DismissReason.cancel) {
        this.mostrarMensajeGenerico(2,"Genere un recibo de caja de otro tipo");
      }
    })
  }

  obtenerId(){
    this.textLoading = "Guardando";
    this.mostrarLoading = true;
    var IdNum = new Promise<any>((resolve, reject) => {
      try {
        this._reciboCajaService.getReciboCajaPorIdConsecutivo(this.reciboCaja).subscribe(res => {
         this.recibosEncontrados = res as ReciboCaja[];
          if(this.recibosEncontrados.length == 0){
            resolve("listo");
          }else{
            this.reciboCaja.idDocumento = this.reciboCaja.idDocumento+1
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
    this.reciboCaja.operacionesComercialesList = this.listadoOperaciones;
    this.reciboCaja.operacionesComercialesList.forEach(element=>{
      var cuenta = this.listaCuentas.find(element2=> element2._id == element.idCuenta);
      element.nombreCuenta = cuenta.nombre;
      element.tipoCuenta = cuenta.tipoCuenta;
      element.nombreSubcuenta = cuenta.sub_cuentaList.find(element2=> element2._id == element.idSubCuenta).nombre;
    });

    if(this.tipoRecibo == "Cta.x Cobrar")
      this.actualizarRecibo();

    this.guardarReciboCaja(); 
    
    return this.reciboCaja;
  }

  actualizarRecibo(){
    var cuenta = new CuentaPorCobrar();
    cuenta._id = this.idCuentaPorCobrar;
    this._cuentaPorCobrar.updateEstadoCuenta(cuenta,"Cancelada").subscribe( res => {},err => {})
  }


  InsertarCuentaPorCobrar(transaccion : TransaccionesFinancieras ){
    var cuentaPorCobrar = new CuentaPorCobrar();
    cuentaPorCobrar.fecha = this.reciboCaja.fecha;
    cuentaPorCobrar.sucursal = this.reciboCaja.sucursal;
    cuentaPorCobrar.cliente = this.reciboCaja.cliente;
    cuentaPorCobrar.rucCliente = this.reciboCaja.ruc;
    cuentaPorCobrar.rCajaId = "RC"+this.reciboCaja.idDocumento.toString();
    cuentaPorCobrar.documentoVenta = this.reciboCaja.numDocumento;
    cuentaPorCobrar.numDocumento = this.reciboCaja.numDocumento;
    cuentaPorCobrar.tipo_doc = this.tipoDocumentoCuenta == "" ? this.reciboCaja.tipoDoc : this.tipoDocumentoCuenta;
    cuentaPorCobrar.valor = transaccion.valor;
    cuentaPorCobrar.valorFactura = this.valorTotalInicioFactura;
    cuentaPorCobrar.fecha_deuda = this.fechaDeuda;
    cuentaPorCobrar.tipoPago = this.reciboCaja.tipoPago;
    cuentaPorCobrar.notas = this.reciboCaja.observaciones;
    this._cuentaPorCobrar.newCuentaPorCobrar(cuentaPorCobrar).subscribe((res) => {
    },(err) => {});
  }


  async guardarReciboCaja(){
    try {
      this._reciboCajaService.newReciboCaja(this.reciboCaja).subscribe(async (res) => {
        this.actualizarContador();
        this.generarTransaccionesFinancieras();
        await this.actualizarEstadoTransacciones();

      },(err) => {});
    } catch (error) {
      this.mostrarMensajeGenerico(2,"Error al guardar la transaccion"); 
    }    
  }

  async actualizarEstadoTransacciones(){
    var fechaRecibo = this.reciboCaja.fecha.toLocaleDateString();
    var fecha2  = new Date(this.fechaDocumentoPendiente).toLocaleDateString();
    if(fechaRecibo == fecha2 && this.tipoRecibo == "Cta.x Cobrar"){
      this.busquedaTransaccion = new tipoBusquedaTransaccion()
      this.busquedaTransaccion.NumDocumento = this.reciboCaja.numDocumento
      this.busquedaTransaccion.tipoTransaccion = "recibo-caja"
      this.busquedaTransaccion.rCajaId = this.numReciboCajaTraido;
      console.log(this.busquedaTransaccion)
      this._transaccionFinancieraService.obtenerTransaccionesPorDocumentoYRecibo(this.busquedaTransaccion).subscribe(
        async (res) => {
          var transacciones = res as TransaccionesFinancieras[];
          await this.actualizarTransacciones(transacciones);},
        (err) => {});
    } 
  }

  async actualizarTransacciones(transacciones : TransaccionesFinancieras[]){
    transacciones.forEach(element=>{
      if(element.subCuenta == "2.0.0 Cuentas x Cobrar"){
        this._transaccionFinancieraService.updateEstado(element,false).subscribe((res) => {},(err) => {});
      }    
    });
  }


  actualizarContador(){
    this.contadores[0].reciboCaja_Ndocumento = this.reciboCaja.idDocumento
    this._contadoresService.updateContadoresIDRegistroCaja(this.contadores[0]).subscribe( res => {
    },err => {})
  }


  generarTransaccionSaldo(){
    var transaccion = new TransaccionesFinancieras();
    transaccion.fecha = this.reciboCaja.fecha;
    transaccion.sucursal = this.reciboCaja.sucursal;
    transaccion.cliente = this.reciboCaja.cliente;
    transaccion.rCajaId = "RC"+this.reciboCaja.idDocumento.toString();
    transaccion.tipoTransaccion = "recibo-caja";
    transaccion.id_documento = this.reciboCaja.idDocumento;
    transaccion.documentoVenta = this.reciboCaja.docVenta;
    transaccion.cedula = this.reciboCaja.ruc;
    transaccion.numDocumento = this.reciboCaja.numDocumento;
    transaccion.valor = this.reciboCaja.valorSaldos;
    transaccion.tipoPago = "";
    transaccion.soporte = "";
    transaccion.dias = 0;
    transaccion.isContabilizada = true;
    transaccion.cuenta = "2.0 SALDOS";
    transaccion.subCuenta = "2.0.0 Cuentas x Cobrar";
    transaccion.notas = this.reciboCaja.observaciones;
    transaccion.tipoCuenta = "Reales y Transitorias";

    try {
      this._transaccionFinancieraService.newTransaccionFinanciera(transaccion).subscribe((res) => {},(err) => {});
    } catch (error) {
      this.mostrarMensajeGenerico(2,"Error al guardar la transaccion"); 
    }    
  }

  validar(){
    var fechaRecibo = this.reciboCaja.fecha.toLocaleDateString();
    var fecha2  = new Date(this.fechaDocumentoPendiente).toLocaleDateString();
    if(fechaRecibo == fecha2)
      console.log("son iguales")

  }

  generarTransaccionesFinancieras(){
    var cont=0;
    var isContabilizada = true;
    var fechaRecibo = this.reciboCaja.fecha.toLocaleDateString();
    var fecha2  = new Date(this.fechaDocumentoPendiente).toLocaleDateString();
    if(fechaRecibo == fecha2 && this.tipoRecibo == "Cta.x Cobrar")
      isContabilizada = false;

    this.reciboCaja.operacionesComercialesList.forEach(element=>{
      var transaccion = new TransaccionesFinancieras();
      transaccion.fecha = this.reciboCaja.fecha;
      transaccion.sucursal = this.reciboCaja.sucursal;
      transaccion.cliente = this.reciboCaja.cliente;
      transaccion.rCajaId = "RC"+this.reciboCaja.idDocumento.toString();
      transaccion.tipoTransaccion = "recibo-caja";
      transaccion.id_documento = this.reciboCaja.idDocumento;
      transaccion.documentoVenta = this.reciboCaja.docVenta;
      transaccion.cedula = this.reciboCaja.ruc;
      transaccion.numDocumento = this.reciboCaja.numDocumento;
      transaccion.valor = element.valor;
      transaccion.isContabilizada = isContabilizada;
      if(this.tipoRecibo != "Cta.x Cobrar"){
        if(fechaRecibo == fecha2 && element.tipoCuenta == "Reales y Transitorias")
          transaccion.isContabilizada = true;
        else
          transaccion.isContabilizada = false;
      }
      
      if(this.tipoRecibo == "Cta.x Cobrar"){
        if(fechaRecibo == fecha2 && element.tipoCuenta == "Reales y Transitorias")
          transaccion.isContabilizada = true;
      }

      transaccion.tipoPago = "";
      transaccion.soporte = "";
      transaccion.dias = 0;
      transaccion.cuenta = element.nombreCuenta;
      transaccion.subCuenta = element.nombreSubcuenta;
      transaccion.notas = this.reciboCaja.observaciones;
      transaccion.tipoCuenta = element.tipoCuenta;

      if(element.nombreCuenta == "2.0 SALDOS" && element.nombreSubcuenta == "2.0.0 Cuentas x Cobrar"){
        this.InsertarCuentaPorCobrar(transaccion)
        this.existeCuentaPorCobrar = true;
      }

      try {
        this._transaccionFinancieraService.newTransaccionFinanciera(transaccion).subscribe((res) => {
          cont++
          this.comprobarYMostrarMensaje(cont)},(err) => {});
      } catch (error) {
        this.mostrarMensajeGenerico(2,"Error al guardar la transaccion"); 
      }    
    });
    return true;
  }

  comprobarYMostrarMensaje(num:number){
    if(this.reciboCaja.operacionesComercialesList.length == num){
      this.crearPDF(this.reciboCaja, true);
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
        
        window.location.replace('http://159.223.107.115:3000/#/recibo-caja');
        //window.location.replace('http://localhost:4200/#/recibo-caja');
        window.location.reload()//this._router.navigate(['/recibo-caja']);
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
        this.reciboCajaDescarga = null;
      })
  }


  opcionMenu(e){
    switch (e.value) {
      case "Nuevo Recibo":
        this.registroRecibos = false;
        this.newRecibo = true;
        this.autorizaciones = false;
       break;
      case "Autorizaciones":
        this.registroRecibos = false;
        this.newRecibo = false;
        this.autorizaciones = true;
        if(this.listadoRecibosCajaNoAutorizados.length == 0)
          this.traerRecibosCajaNoAutorizados()
       break;
      case "Recibos Cajas Generados":
        this.registroRecibos = true;
        this.newRecibo = false;
        this.autorizaciones = false;
        this.traerRecibosCajaPorRango();
        break;
      default:    
    }      
  }


  onExporting (e) {
    e.component.beginUpdate();
    e.component.columnOption("observaciones", "visible", true);
    e.component.columnOption("tipoPago", "visible", true);
    e.component.columnOption("numDocumento", "visible", true);
    e.component.columnOption("banco", "visible", true);
    e.component.columnOption("tipoPago", "visible", true);
    e.component.columnOption("valorRecargo", "visible", true);
    e.component.columnOption("valorPagoEfectivo", "visible", true); 
    e.component.columnOption("valorSaldos", "visible", true); 
   
  };
  onExported (e) {
     e.component.columnOption("observaciones", "visible", false);
    e.component.columnOption("tipoPago", "visible", false);
    e.component.columnOption("numDocumento", "visible", false);
    e.component.columnOption("banco", "visible", false);
    e.component.columnOption("tipoPago", "visible", false);
    e.component.columnOption("valorRecargo", "visible", false);
    e.component.columnOption("valorPagoEfectivo", "visible", false); 
    e.component.columnOption("valorSaldos", "visible", false); 
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
    this.reciboCajaDescarga = recibo;
    this.traerDatosFaltantes(this.reciboCajaDescarga.sucursal);
    const documentDefinition = this.getDocumentDefinition();

    var IdNum = new Promise<any>((resolve, reject) => {
      try {
          pdfMake.createPdf(documentDefinition).download("Recibo_Caja " + this.reciboCajaDescarga.idDocumento,function (response){resolve("listo")});
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
                    width: 260,
                    text: "RECIBO CAJA  001 - 000",
                    bold: true,
                    fontSize: 18,
                  },
                  {
                    width: 260,
                    text: "NO 000000" + this.reciboCajaDescarga.idDocumento,
                    color: "red",
                    bold: true,
                    fontSize: 18,
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
                              "Cliente",
                              "RUC",
                              "Doc.Venta",
                              "Fecha",
                              "Sucursal",
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
                              "" + this.reciboCajaDescarga.cliente,
                              "" + this.reciboCajaDescarga.ruc,
                              "" + this.reciboCajaDescarga.docVenta,
                               "" + this.reciboCajaDescarga.fecha.toLocaleString(),
                              "" + this.reciboCajaDescarga.sucursal,
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
                              "Tipo Pago",
                              "Num. Documento",
                              "Banco",
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
                                "" + this.reciboCajaDescarga.tipoPago,
                                "" + this.reciboCajaDescarga.numDocumento,
                                "" + this.reciboCajaDescarga.banco,
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

        this.getListaOperaciones(this.reciboCajaDescarga.operacionesComercialesList),
        { text: " " },
        {
          columns: [{
            type: 'none',
            ul: [
                  {
                    style: 'tableExample2',
                    table: {
                      widths: [250],
                      heights:53,//53
                      fontSize: 8,
                      body: [
                        [
                          {text: 'Observaciones: '+this.reciboCajaDescarga.observaciones , style:"sizeText"},
                        ]
                      ]
                    },
                  }
            ]
        },
        {
          style: 'tableExample',
          fontSize: 8,
          table: {
            widths: [125,100],
            body: [
              [ { text: 'Valor Factura', bold: true ,style: "detalleTotales"}, {text: this.reciboCajaDescarga.valorFactura, style:"totales" }],
              [ { text: 'Recargos', bold: true ,style: "detalleTotales"}, {text:this.reciboCajaDescarga.valorRecargo, style:"totales" } ],
              [ { text: 'Total Recibo', bold: true, style: "detalleTotales" }, {text: this.reciboCajaDescarga.valorPagoEfectivo, style:"totales" } ],
              [ { text: 'Saldos Valores No Ingresados', bold: true ,style: "detalleTotales"}, {text: this.reciboCajaDescarga.valorSaldos, style:"totales" }],
            ]
          }
          },
        ]
        },
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

  getListaOperaciones(operaciones: OperacionComercial[]) {
    return {
      table: {
        widths: ["40%", "40%", "20%"],
        alignment: "center",
        fontSize: 8,
        headerRows: 2,
        body: [
          [
            {
              text: "Cuenta",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Subcuenta",
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

          ],

          ...operaciones.map((ed) => {
            return [
              { text: ed.nombreCuenta, fontSize: 9 },
              { text: ed.nombreSubcuenta, alignment: "center", fontSize: 9 },
              { text: ed.valor, alignment: "center", fontSize: 9 },

            ];
          }),
        ],
      },
    };
  }

  




  


}
