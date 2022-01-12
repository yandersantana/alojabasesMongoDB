import { Component, OnInit } from '@angular/core';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { CuentasService } from 'src/app/servicios/cuentas.service';
import { ComprobantePagoService } from 'src/app/servicios/ComprobantePago.service';
import { SubCuentasService } from 'src/app/servicios/subCuentas.service';
import { TransaccionesFinancierasService } from 'src/app/servicios/transaccionesFinancieras.service';
import Swal from 'sweetalert2';
import { Beneficiario, CentroCosto, Cuenta, SubCuenta } from '../administracion-cuentas/administracion-cuenta';
import { objDate, tipoBusquedaTransaccion } from '../transacciones/transacciones';
import { TransaccionesFinancieras } from '../transaccionesFinancieras/transaccionesFinancieras';
import { contadoresDocumentos } from '../ventas/venta';
import pdfMake from "pdfmake/build/pdfmake";
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { DatosConfiguracionService } from 'src/app/servicios/datosConfiguracion.service';
import { ComprobantePago } from './comprobante-pago';
import { AuthenService } from 'src/app/servicios/authen.service';
import { user } from '../user/user';
import { ProveedoresService } from 'src/app/servicios/proveedores.service';
import { Proveedor } from '../compras/compra';
import { CentroCostoService } from 'src/app/servicios/centro-costo.service';
import { BeneficiarioService } from 'src/app/servicios/beneficiario.service';
import { CuentaPorPagar } from '../cuentasPorPagar/cuentasPorPagar';
import { CuentasPorPagarService } from 'src/app/servicios/cuentasPorPagar.service';
import { dataDocumento, OperacionComercial } from '../reciboCaja/recibo-caja';



@Component({
  selector: 'app-comprobante-pago',
  templateUrl: './comprobante-pago.component.html',
  styleUrls: ['./comprobante-pago.component.scss']
})
export class ComprobantePagoComponent implements OnInit {
  newComprobante: boolean = true;
  comprobantePago : ComprobantePago
  comprobantePagoDescarga : ComprobantePago
  listadoComprobantes: ComprobantePago [] = []
  listadoComprobantesActivos: ComprobantePago [] = []
  listadoComprobantesAnulados: ComprobantePago [] = []
  listadoComprobantesPendientes: ComprobantePago [] = []
  proveedores: Proveedor [] = []
  isNormal = true;
  totalDeuda = 0;
  bloquearBoton = false;

  listaCuentas: Cuenta [] = []
  listaCuentasGlobal: Cuenta [] = []
  listaSubCuentas: SubCuenta [] = []
  listaSubCuentas2: SubCuenta [] = []
  listaSubCuentas3: SubCuenta [] = []
  transaccionesFinancieras: TransaccionesFinancieras [] = []
  isReadOnly: boolean = false;
  contadores:contadoresDocumentos[]
  comprobantesEncontrados:ComprobantePago[]

  listadoOperaciones: OperacionComercial [] = []
  operacionComercial: OperacionComercial
  busquedaTransaccion: tipoBusquedaTransaccion; 

  mostrarLoading : boolean = false;
  mostrarLoadingBase : boolean = false;
  mostrarDelete : boolean = true;
  mostrarAprobacion : boolean = false;

  parametrizaciones: parametrizacionsuc[] = [];
  detallesCostos: CentroCosto[] = [];
  beneficiarios: Beneficiario[] = [];
  parametrizacionSucu: parametrizacionsuc;
  obj: objDate;
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  menu: string[] = [
    "Nuevo Comprobante",
    "Comprobantes de Pago Generados"
  ];

  estados: string[] = [
      'Activos',
      'Pendientes',
      'Anulados',
  ];

  tiposBusqueda: string[] = [
    "Beneficiario",
    "Proveedor",
    "Documento"
  ];

   tiposComprobantes: string[] = [
    'Normal',
    'Cta.x Pagar',
  ];

  imagenLogotipo ="";
  textLoading = "";
  tipoComprobante ="";
  valorTipoBusqueda = "";
  nombre_Beneficiario = "";
  mostrarBeneficiario = false;
  mostrarProveedor = false;
  mostrarDocumento = false;
  datosDocumento: dataDocumento [] = []
  textoDatosFactura = "";
  valorDocumento = "";
  idCuentaPorPagar = "";


  constructor(
    public _cuentasService : CuentasService,
    public _subCuentasService : SubCuentasService,
    public _transaccionFinancieraService : TransaccionesFinancierasService,
    public _contadoresService: ContadoresDocumentosService,
    public _comprobantePagoService: ComprobantePagoService,
    public _parametrizacionService: ParametrizacionesService,
    public _configuracionService: DatosConfiguracionService,
    public _proveedoresService: ProveedoresService,
    public _centroCostoService: CentroCostoService,
    public _beneficiarioService: BeneficiarioService,
    public _authenService:AuthenService,
    public _cuentaPorPagar: CuentasPorPagarService
    ) {
      this.tipoComprobante = this.tiposComprobantes[0];
   }

  ngOnInit() {
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.listadoOperaciones.push(new OperacionComercial());
    this.comprobantePago = new ComprobantePago();
    this.cargarUsuarioLogueado();

    this.traerContadoresDocumentos();
    this.traerListaCuentas();
    this.traerParametrizaciones();
    this.traerDatosConfiguracion();
    this.traerProveedores();
    this.traerDetalleCostos();
    this.traerBeneficiarios();
  }


  async traerContadoresDocumentos(){
    await this._contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
      this.comprobantePago.idDocumento = this.contadores[0].comprobantePago_Ndocumento + 1;
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
      if(element.tipoCuenta == "Salidas" || element.tipoCuenta == "Reales y Transitorias")
        this.listaCuentas.push(element);
    })
  }

  traerProveedores(){
    this._proveedoresService.getProveedor().subscribe(res => {
      this.proveedores = res as Proveedor[];
   })
  }

  traerDetalleCostos(){
    this._centroCostoService.getCentrosCostos().subscribe(res => {
      this.detallesCostos = res as CentroCosto[];
   })
  }

  traerBeneficiarios(){
    this._beneficiarioService.getBeneficiarios().subscribe(res => {
      this.beneficiarios = res as Beneficiario[];
   })
  }


  traerComprobantesPago(){
    this.mostrarLoadingBase = true;
    this._comprobantePagoService.getComprobantes().subscribe(res => {
      this.listadoComprobantes = res as ComprobantePago[];
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
    this.mostrarLoadingBase = false;
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


  opcionRadioTipos(e){
    this.tipoComprobante = e.value;
    switch (e.value) {
      case "Normal":
        this.isNormal = true;
        break;
      case "Cta.x Pagar":
        this.isNormal = false;
        break;
      default:    
    }      
  }


  asignarDatos(e){
    this.idCuentaPorPagar = e.value._id;
    this.textoDatosFactura = e.value.textoCombo;
    if(this.mostrarBeneficiario || this.mostrarDocumento)
      this.comprobantePago.beneficiario = e.value.nombreCliente;

    if(this.mostrarProveedor)
      this.comprobantePago.proveedor = e.value.nombreCliente;
    this.comprobantePago.ruc = e.value.rucCliente;
    //this.comprobantePago.total = e.value.totalFactura;
    this.totalDeuda = e.value.totalFactura;
    this.comprobantePago.sucursal = e.value.sucursal; 
    this.comprobantePago.documento = e.value.num_documento; 

    if(this.tipoComprobante == "Cta.x Pagar")
      this.comprobantePago.beneficiario = e.value.nombreCliente;
  }


  setClienteData(e){
    this.textLoading = "Buscando..";
    this.mostrarLoading = true;
    if(this.valorTipoBusqueda == "Beneficiario" || this.valorTipoBusqueda == "Proveedor"){
      var docData = new dataDocumento();
      docData.nombreCliente = this.nombre_Beneficiario;
      this._cuentaPorPagar.getCuentasXPagarPorNombre(docData).subscribe(res => {
        var cuentas = res as CuentaPorPagar[];
        this.llenarDatosComboCuentasPagar(cuentas);
        this.mostrarLoading = false;
      });
    }else if(this.valorTipoBusqueda == "Documento"){
      var docData = new dataDocumento();
      docData.rucCliente = this.valorDocumento;
      this._cuentaPorPagar.getCuentasXPagarPorRUC(docData).subscribe(res => {
        var cuentas = res as CuentaPorPagar[];
        this.llenarDatosComboCuentasPagar(cuentas);
        this.mostrarLoading = false;
      });
    }
  }

  llenarDatosComboCuentasPagar(array){
    this.datosDocumento = [];
    array.forEach(element => {
      var object = new dataDocumento();
      object._id = element._id;
      object.nombreCliente = element.beneficiario;
      object.rucCliente = element.rucBeneficiario;
      object.totalFactura = element.valor;
      object.sucursal = element.sucursal;
      object.textoCombo = element.comprobanteId+" - "+object.totalFactura
      object.num_documento = element.numDocumento
      this.datosDocumento.push(object);
    });
  }

  asignarValorBusqueda(e){
    if(e.value == "Beneficiario"){
      this.mostrarBeneficiario = true;
      this.mostrarProveedor = false;
      this.mostrarDocumento = false;
    }else if(e.value == "Proveedor"){
      this.mostrarBeneficiario = false;
      this.mostrarProveedor = true;
      this.mostrarDocumento = false;
    }else{
      this.mostrarBeneficiario = false;
      this.mostrarProveedor = false;
      this.mostrarDocumento = true;
    }
  }
  

  downloadFile = (e) => {
    this.obtenerDataRecibo(e.row.data);
  };


  deleteComprobante = (e) => {  
    this.anularComprobante(e.row.data)  
  }

  aprobarEliminacion = (e) => {  
    this.validarTransaccionesFactura(e.row.data)  
  }



  calcularTotal(e){
    this.comprobantePago.total = 0;
    this.listadoOperaciones.forEach(element =>{
      this.comprobantePago.total +=element.valor;
    })

    if( this.comprobantePago.total > this.totalDeuda)
      this.mostrarMensajeGenerico(2,"La suma de los valores no puede ser mayor al valor de la deuda");
  }


  traerComprobantesPagoPorRango() {
    this.limpiarArrays();
    this.mostrarLoadingBase = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._comprobantePagoService.getComprobantePorRango(this.obj).subscribe(res => {
      this.listadoComprobantes = res as ComprobantePago[];
      this.separarComprobantes();
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
    this._comprobantePagoService.getComprobantePorId(e).subscribe((res) => {
      this.comprobantePagoDescarga = res[0];
      if(this.comprobantePagoDescarga != null)
        this.crearPDF(this.comprobantePagoDescarga , false);
      else
        this.mostrarMensajeGenerico(2,"Error al traer la información")
    }); 
  }

  limpiarArrays(){
    this.listadoComprobantes = [];
    this.listadoComprobantesActivos = [];
    this.listadoComprobantesAnulados = [];
    this.listadoComprobantesPendientes = [];
  }


  buscarSubCuentas(e,i ,res){
    if(i==0)
      this.listaSubCuentas = res;
    if(i==1)
      this.listaSubCuentas2 = res;
    if(i==2)
      this.listaSubCuentas3 = res;
  }


  traersubCuentas(e,i){
    var arrayCuentas = [];
    this.listaCuentas.forEach(element =>{
      if(element._id == e.value){
        this._subCuentasService.getSubCuentasPorId(e.value).subscribe(res => {
          element.sub_cuentaList = res as SubCuenta[];
          if(element._id == "6195b036f75a418e9c2eba06"){
            element.sub_cuentaList.forEach(element2 =>{
              if(element2.tipoCuenta == "SALIDA")
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

 

  eliminarRegistro(i: number) {
    this.listadoOperaciones.splice(i, 1);
  }


  validarTransaccionesFactura(e){
    this.busquedaTransaccion = new tipoBusquedaTransaccion()
    this.busquedaTransaccion.NumDocumento = e.idDocumento
    this.busquedaTransaccion.tipoTransaccion = "comprobante"
    this._transaccionFinancieraService.getTransaccionesPorTipoDocumento(this.busquedaTransaccion).subscribe(res => {
      this.transaccionesFinancieras = res as TransaccionesFinancieras[];
      if(this.transaccionesFinancieras.length == 0)
        this.mostrarMensajeGenerico(2,"No se encontraron transacciones")
      else
        this.eliminarComp(e)
    })
  }


  eliminarTransacciones(){
    var cont = 0;
    this.transaccionesFinancieras.forEach(element=>{
      cont++;
      this._transaccionFinancieraService.deleteTransaccionFinanciera(element).subscribe( res => {this.contarTransacciones(cont)}, err => {alert("error")})
    })
  }

  contarTransacciones(cont){
    if(cont == this.transaccionesFinancieras.length){
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
        this._comprobantePagoService.updateEstado(e._id,"Anulado").subscribe(
          res => { this.eliminarTransacciones();},
          err => { this.mostrarMensajeGenerico(2,"Error al actualizar estado")})
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.mostrarMensajeGenerico(2,"Se ha cancelado su proceso")
      }
    })
  }



  addElement(){
    if(this.listadoOperaciones.length <= 2)
      this.listadoOperaciones.push(new OperacionComercial());
    else
      this.mostrarMensajeGenerico(2,"No se pueden ingresar mas operaciones");
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
      if(this.comprobantePago.total == 0){
        flag = false;
        this.bloquearBoton = false;
        this.mostrarMensajeGenerico(2,"El total debe ser superior a 0");
      }
          

      if(this.tipoComprobante == "Cta.x Pagar"){
        if( this.comprobantePago.total > this.totalDeuda){
          flag = false;
          this.bloquearBoton = false;
          this.mostrarMensajeGenerico(2,"La suma de los valores no puede ser mayor al valor de la deuda");
        }

        if( this.comprobantePago.total < this.totalDeuda){
          flag = false;
          this.bloquearBoton = false;
          this.mostrarMensajeGenerico(2,"El total del comprobante no puede ser menor al total de la deuda, si el valor a pagar es menor al valor total de la deuda por favor genere una nueva cuenta por Pagar");
        }
      }
      
      
     if(flag)
        this.obtenerId();

    }
    else{
      this.bloquearBoton = false;
      this.mostrarMensajeGenerico(2,"Hay campos vacios en los registros");
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



  obtenerId(){
    this.textLoading = "Guardando";
    this.mostrarLoading = true;
    var IdNum = new Promise<any>((resolve, reject) => {
      try {
        this._comprobantePagoService.getComprobantePorIdConsecutivo(this.comprobantePago).subscribe(res => {
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
    this.comprobantePago.operacionesComercialesList = this.listadoOperaciones;
    this.comprobantePago.operacionesComercialesList.forEach(element=>{
      var cuenta = this.listaCuentas.find(element2=> element2._id == element.idCuenta);
      element.nombreCuenta = cuenta.nombre;
      element.tipoCuenta = cuenta.tipoCuenta;
      element.nombreSubcuenta = cuenta.sub_cuentaList.find(element2=> element2._id == element.idSubCuenta).nombre;
    });
    this.guardarComprobantePago(); 
    if(this.tipoComprobante == "Cta.x Pagar")
    this.actualizarRecibo();
    
    return this.comprobantePago;
  }

  actualizarRecibo(){
    var cuenta = new CuentaPorPagar();
    cuenta._id = this.idCuentaPorPagar;
    this._cuentaPorPagar.updateEstadoCuenta(cuenta,"Cancelada").subscribe( res => {},err => {})
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
        this._comprobantePagoService.updateEstado( e._id ,"Pendiente").subscribe( res => {

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



  guardarComprobantePago(){
    try {
      this._comprobantePagoService.newComprobantePago(this.comprobantePago).subscribe((res) => {
        this.actualizarContador();
        this.generarTransaccionesFinancieras();
      },(err) => {});
    } catch (error) {
      this.mostrarMensajeGenerico(2,"Error al guardar la transaccion"); 
    }    
  }

  InsertarCuentaPorPagar(transaccion : TransaccionesFinancieras ){
    var cuentaPorPagar = new CuentaPorPagar();
    cuentaPorPagar.fecha = this.comprobantePago.fecha;
    cuentaPorPagar.sucursal = this.comprobantePago.sucursal;
    cuentaPorPagar.beneficiario = this.comprobantePago.beneficiario ?? this.comprobantePago.proveedor;
    cuentaPorPagar.rucBeneficiario = this.comprobantePago.ruc;
    cuentaPorPagar.comprobanteId = "CP"+this.comprobantePago.idDocumento.toString();
    cuentaPorPagar.numDocumento = this.comprobantePago.documento;
    cuentaPorPagar.valor = transaccion.valor;
    cuentaPorPagar.notas = this.comprobantePago.observaciones;
    this._cuentaPorPagar.newCuentaPorPagar(cuentaPorPagar).subscribe((res) => {
    },(err) => {});
  }


  actualizarContador(){
    this.contadores[0].comprobantePago_Ndocumento = this.comprobantePago.idDocumento
    this._contadoresService.updateContadoresIDComprobantePago(this.contadores[0]).subscribe( res => {
    },err => {})
  }

  generarTransaccionesFinancieras(){
    var cont=0;
    this.comprobantePago.operacionesComercialesList.forEach(element=>{
      var transaccion = new TransaccionesFinancieras();
      transaccion.fecha = this.comprobantePago.fecha;
      transaccion.sucursal = this.comprobantePago.sucursal;
      transaccion.cliente = this.comprobantePago.beneficiario;
      transaccion.rCajaId = "CP"+this.comprobantePago.idDocumento.toString();
      transaccion.id_documento = this.comprobantePago.idDocumento;
      transaccion.tipoTransaccion = "comprobante";
      transaccion.documentoVenta = this.comprobantePago.documento;
      transaccion.numDocumento = this.comprobantePago.documento;
      transaccion.valor = element.valor;
      transaccion.tipoPago = "";
      transaccion.soporte = "";
      transaccion.dias = 0;
      transaccion.cuenta = element.nombreCuenta;
      transaccion.subCuenta = element.nombreSubcuenta;
      transaccion.notas = this.comprobantePago.observaciones;
      transaccion.tipoCuenta = element.tipoCuenta;

      if(element.nombreCuenta == "10 SALDOS" && element.nombreSubcuenta == "10.1 Cuentas x Pagar"){
        this.InsertarCuentaPorPagar(transaccion)
        cont++
        this.comprobarYMostrarMensaje(cont)
      }else{
        try {
        this._transaccionFinancieraService.newTransaccionFinanciera(transaccion).subscribe((res) => {
          cont++
          this.comprobarYMostrarMensaje(cont)},(err) => {});
        } catch (error) {
          this.mostrarMensajeGenerico(2,"Error al guardar la transaccion"); 
        }   
      }

       
    });
    return true;
  }

  comprobarYMostrarMensaje(num:number){
    if(this.comprobantePago.operacionesComercialesList.length == num){
      this.crearPDF(this.comprobantePago, true);
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
        this.newComprobante = true;
       break;
      case "Comprobantes de Pago Generados":
        this.newComprobante = false;
        this.traerComprobantesPagoPorRango();
        break;
      default:    
    }      
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
          pdfMake.createPdf(documentDefinition).download("Comprobante_Pago " + this.comprobantePagoDescarga.idDocumento,function (response){resolve("listo")});
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
                    width: 290,
                    text: "COMPROBANTE/PAGO  001 - 000",
                    bold: true,
                    fontSize: 18,
                  },
                  {
                    width: 230,
                    text: "NO 000000" + this.comprobantePagoDescarga.idDocumento,
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
                              "Fecha",
                              "Documento",
                              "Centro/Costo",
                              "Usuario",
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
                              "" + this.comprobantePagoDescarga.fecha.toLocaleString(),
                              "" + this.comprobantePagoDescarga.documento,
                              "" + this.comprobantePagoDescarga.centroCosto,
                              "" + this.comprobantePagoDescarga.usuario,
                              "" + this.comprobantePagoDescarga.sucursal,
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
                              "Beneficiario",
                              "Proveedor",
                              "RUC",
                              "Teléfono",
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
                                "" + this.comprobantePagoDescarga.beneficiario,
                                "" + this.comprobantePagoDescarga.proveedor,
                                "" + this.comprobantePagoDescarga.ruc,
                                "" + this.comprobantePagoDescarga.telefono,
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

        this.getListaOperaciones(this.comprobantePagoDescarga.operacionesComercialesList),
        { text: " " },
        {
          columns: [{
            type: 'none',
            ul: [
                  {
                    style: 'tableExample2',
                    table: {
                      widths: [250],
                      heights:53,
                      fontSize: 8,
                      body: [
                        [
                          {text: 'Observaciones: '+this.comprobantePagoDescarga.observaciones , style:"sizeText"},
                        ]
                      ]
                    },
                  }
            ]
        },
        {
          style: 'tableExample',
          fontSize: 12,
          table: {
            widths: [125,100],
            body: [
              [ { text: 'Total', bold: true ,style: "detalleTotales"}, {text: this.comprobantePagoDescarga.total, style:"totales" }],
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
              { text: ed.nombreCuenta,alignment: "center", fontSize: 8 },
              { text: ed.nombreSubcuenta, alignment: "center", fontSize: 8 },
              { text: ed.valor, alignment: "center", fontSize: 8 },

            ];
          }),
        ],
      },
    };
  }

  




  


}
