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
import { contadoresDocumentos } from '../ventas/venta';
import { OperacionComercial, ReciboCaja } from './recibo-caja';
import pdfMake from "pdfmake/build/pdfmake";
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { DatosConfiguracionService } from 'src/app/servicios/datosConfiguracion.service';
import { element } from 'protractor';
import { AuthenService } from 'src/app/servicios/authen.service';
import { user } from '../user/user';
import { timingSafeEqual } from 'crypto';


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
  contadores:contadoresDocumentos[]
  recibosEncontrados:ReciboCaja[]

  listadoOperaciones: OperacionComercial [] = []
  operacionComercial: OperacionComercial
  reciboCaja : ReciboCaja
  reciboCajaDescarga : ReciboCaja
  valorTotal1 = 0;
  valorTotal2 = 0;
  mostrarLoading : boolean = false;
  mostrarLoadingBase : boolean = false;
  newRecibo: boolean = true;
  listadoRecibosCaja: ReciboCaja [] = []
  listadoRecibosCajaActivos: ReciboCaja [] = []
  listadoRecibosCajaAnulados: ReciboCaja [] = []
  listadoRecibosCajaPendientes: ReciboCaja [] = []
  parametrizaciones: parametrizacionsuc[] = [];
  transaccionesFinancieras: TransaccionesFinancieras [] = []
  parametrizacionSucu: parametrizacionsuc;
  obj: objDate;
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  menu: string[] = [
    "Nuevo Recibo",
    "Recibos Cajas Generados"
  ];

  estados: string[] = [
    'Activos',
    'Pendientes',
    'Anulados',
  ];

  imagenLogotipo ="";
  textLoading = "";
  busquedaTransaccion: tipoBusquedaTransaccion; 
  mostrarDelete : boolean = true;
  mostrarAprobacion : boolean = false;


  constructor(
    public _cuentasService : CuentasService,
    public _subCuentasService : SubCuentasService,
    public _transaccionFinancieraService : TransaccionesFinancierasService,
    public _reciboCajaService : ReciboCajaService,
    public _contadoresService: ContadoresDocumentosService,
    public _cuentaPorCobrar: CuentasPorCobrarService,
    public _parametrizacionService: ParametrizacionesService,
    public _configuracionService: DatosConfiguracionService,
    public _authenService:AuthenService
    ) {
   }

  ngOnInit() {
    this.cargarUsuarioLogueado();
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.listadoOperaciones.push(new OperacionComercial());
    this.reciboCaja = new ReciboCaja();
    this.reciboCaja.fecha = new Date();
    this.traerContadoresDocumentos();
    this.traerListaCuentas();
    this.traerParametrizaciones();
    this.traerDatosConfiguracion();
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

  traerRecibosCaja(){
    this.mostrarLoadingBase = true;
    this._reciboCajaService.getRecibos().subscribe(res => {
      this.listadoRecibosCaja = res as ReciboCaja[];
      this.mostrarLoadingBase = false;
   })
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


  


  buscarSubCuentas(e,i ,res){
    if(i==0)
      this.listaSubCuentas = res;
    if(i==1)
      this.listaSubCuentas2 = res;
    if(i==2)
      this.listaSubCuentas3 = res;
  }


  traersubCuentas(e,i){
    this.listaCuentas.forEach(element =>{
      if(element._id == e.value){
        this._subCuentasService.getSubCuentasPorId(e.value).subscribe(res => {
          element.sub_cuentaList = res as SubCuenta[];
          this.buscarSubCuentas(e,i , res);
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
  }

  eliminarRegistro(i: number) {
    this.listadoOperaciones.splice(i, 1);
  }

  aprobarEliminacion = (e) => {  
    this.validarTransacciones(e.row.data)  
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
    console.log(e)
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
    this.listadoOperaciones.forEach(element=>{
      if(element.idCuenta == null || element.idSubCuenta == null || element.valor == 0){
        flag = false;
      }
    });

    if(flag == true){
      if(this.reciboCaja.valorFactura == 0){
        this.mostrarMensajeGenerico(2,"Debe ingresar un valor de la factura"); 
        flag = false;
      }
         
      if(this.reciboCaja.valorSaldos != 0){
        this.mostrarMensajeGenerico(2,"El saldo del recibo debe ser igual a 0");
        flag = false;
      }
        
      if(flag)
        this.obtenerId();
    }
    else
      this.mostrarMensajeGenerico(2,"Hay campos vacios en los registros");
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
    this.comprobarSaldo();
    this.guardarReciboCaja(); 
    
    return this.reciboCaja;
  }

  comprobarSaldo(){
    if(this.reciboCaja.valorSaldos > 0){
      var cuentaPorCobrar = new CuentaPorCobrar();
      cuentaPorCobrar.fecha = new Date();
      cuentaPorCobrar.sucursal = this.reciboCaja.sucursal;
      cuentaPorCobrar.cliente = this.reciboCaja.cliente;
      cuentaPorCobrar.rucCliente = this.reciboCaja.ruc;
      cuentaPorCobrar.rCajaId = "RC"+this.reciboCaja.idDocumento.toString();
      cuentaPorCobrar.documentoVenta = this.reciboCaja.docVenta;
      cuentaPorCobrar.numDocumento = this.reciboCaja.numDocumento;
      cuentaPorCobrar.valor = this.reciboCaja.valorSaldos;
      cuentaPorCobrar.tipoPago = this.reciboCaja.tipoPago;
      cuentaPorCobrar.notas = this.reciboCaja.observaciones;
      this._cuentaPorCobrar.newCuentaPorCobrar(cuentaPorCobrar).subscribe((res) => {
      },(err) => {});
    }
  }

  guardarReciboCaja(){
    try {
      this._reciboCajaService.newReciboCaja(this.reciboCaja).subscribe((res) => {
        this.actualizarContador();
        this.generarTransaccionesFinancieras();
        if(this.reciboCaja.valorSaldos>0)
          this.generarTransaccionSaldo();

      },(err) => {});
    } catch (error) {
      this.mostrarMensajeGenerico(2,"Error al guardar la transaccion"); 
    }    
  }


  actualizarContador(){
    this.contadores[0].reciboCaja_Ndocumento = this.reciboCaja.idDocumento
    this._contadoresService.updateContadoresIDRegistroCaja(this.contadores[0]).subscribe( res => {
    },err => {})
  }


  generarTransaccionSaldo(){
    var transaccion = new TransaccionesFinancieras();
    transaccion.fecha = new Date();
    transaccion.sucursal = this.reciboCaja.sucursal;
    transaccion.cliente = this.reciboCaja.cliente;
    transaccion.rCajaId = "RC"+this.reciboCaja.idDocumento.toString();
    transaccion.tipoTransaccion = "recibo-caja";
    transaccion.id_documento = this.reciboCaja.idDocumento;
    transaccion.documentoVenta = this.reciboCaja.docVenta;
    transaccion.numDocumento = this.reciboCaja.numDocumento;
    transaccion.valor = this.reciboCaja.valorSaldos;
    transaccion.tipoPago = "";
    transaccion.soporte = "";
    transaccion.dias = 0;
    transaccion.cuenta = "SALDOS";
    transaccion.subCuenta = "Cuentas por cobrar";
    transaccion.notas = this.reciboCaja.observaciones;
    transaccion.tipoCuenta = "Reales y Transitorias";

    try {
      this._transaccionFinancieraService.newTransaccionFinanciera(transaccion).subscribe((res) => {},(err) => {});
    } catch (error) {
      this.mostrarMensajeGenerico(2,"Error al guardar la transaccion"); 
    }    
  }

  generarTransaccionesFinancieras(){
    var cont=0;
    this.reciboCaja.operacionesComercialesList.forEach(element=>{
      var transaccion = new TransaccionesFinancieras();
      transaccion.fecha = new Date();
      transaccion.sucursal = this.reciboCaja.sucursal;
      transaccion.cliente = this.reciboCaja.cliente;
      transaccion.rCajaId = "RC"+this.reciboCaja.idDocumento.toString();
      transaccion.tipoTransaccion = "recibo-caja";
      transaccion.id_documento = this.reciboCaja.idDocumento;
      transaccion.documentoVenta = this.reciboCaja.docVenta;
      transaccion.numDocumento = this.reciboCaja.numDocumento;
      transaccion.valor = element.valor;
      transaccion.tipoPago = "";
      transaccion.soporte = "";
      transaccion.dias = 0;
      transaccion.cuenta = element.nombreCuenta;
      transaccion.subCuenta = element.nombreSubcuenta;
      transaccion.notas = this.reciboCaja.observaciones;
      transaccion.tipoCuenta = element.tipoCuenta;

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
        this.reciboCajaDescarga = null;
      })
  }


  opcionMenu(e){
    switch (e.value) {
      case "Nuevo Recibo":
        this.newRecibo = true;
       break;
      case "Recibos Cajas Generados":
        this.newRecibo = false;
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
                      heights:53,
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
              [ { text: 'Pago Efectivo', bold: true, style: "detalleTotales" }, {text: this.reciboCajaDescarga.valorPagoEfectivo, style:"totales" } ],
              [ { text: 'Saldos', bold: true ,style: "detalleTotales"}, {text: this.reciboCajaDescarga.valorSaldos, style:"totales" }],
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
