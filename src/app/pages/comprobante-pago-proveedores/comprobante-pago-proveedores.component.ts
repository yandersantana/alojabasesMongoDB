import { Component, OnInit } from '@angular/core';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { CuentasService } from 'src/app/servicios/cuentas.service';
import { SubCuentasService } from 'src/app/servicios/subCuentas.service';
import Swal from 'sweetalert2';
import { CentroCosto, Cuenta, SubCuenta } from '../administracion-cuentas/administracion-cuenta';
import { objDate } from '../transacciones/transacciones';
import { contadoresDocumentos } from '../ventas/venta';
import pdfMake from "pdfmake/build/pdfmake";
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { DatosConfiguracionService } from 'src/app/servicios/datosConfiguracion.service';
import { OperacionComercial } from '../reciboCaja/recibo-caja';
import { AuthenService } from 'src/app/servicios/authen.service';
import { user } from '../user/user';
import { ProveedoresService } from 'src/app/servicios/proveedores.service';
import { Proveedor } from '../compras/compra';
import { CentroCostoService } from 'src/app/servicios/centro-costo.service';
import { ComprobantePago } from '../comprobante-pago/comprobante-pago';
import { ComprobantePagoProveedor, TransaccionChequesGirado, TransaccionesFacturas } from './comprobante-pago-proveedores';
import { FacturasProveedorService } from 'src/app/servicios/facturas-proveedor.service';
import { FacturaProveedor } from '../orden-compra/ordencompra';
import { ComprobantePagoProveedoresService } from 'src/app/servicios/comprobantePagoProveedores.service';
import { TransaccionesFacturasService } from 'src/app/servicios/transaccionesFacturas.service';
import { TransaccionesChequesService } from 'src/app/servicios/transaccionesCheques.service';



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
  comprobantePago : ComprobantePagoProveedor
  comprobantePagoDescarga : ComprobantePagoProveedor
  listadoComprobantes: ComprobantePagoProveedor [] = []
  listadoTransaccionesFactura: TransaccionesFacturas [] = []
  listadoTransaccionesCheque: TransaccionChequesGirado [] = []
  proveedores: Proveedor [] = []


  listaFacturas: FacturaProveedor [] = []
  listaCuentasGlobal: Cuenta [] = []
  listaSubCuentas: SubCuenta [] = []
  listaSubCuentas2: SubCuenta [] = []
  listaSubCuentas3: SubCuenta [] = []
  isReadOnly: boolean = false;
  contadores:contadoresDocumentos[]
  comprobantesEncontrados:ComprobantePago[]

  listadoOperaciones: OperacionComercial [] = []
  operacionComercial: OperacionComercial



  mostrarLoading : boolean = false;
  mostrarLoadingBase : boolean = false;

  parametrizaciones: parametrizacionsuc[] = [];
  detallesCostos: CentroCosto[] = [];
  parametrizacionSucu: parametrizacionsuc;
  obj: objDate;
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  menu: string[] = [
    "Nuevo Comprobante",
    "Comprobantes de Pago Generados",
    "Transacciones Facturas",
    "Transacciones Cheques"
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
    public _facturaProveedorService: FacturasProveedorService,
    public _authenService:AuthenService
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

  }


  async traerContadoresDocumentos(){
    await this._contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
      this.comprobantePago.idDocumento = this.contadores[0].comprobantePagoProveedor_Ndocumento + 1;
   })
  }


  traerProveedores(){
    this._proveedoresService.getProveedor().subscribe(res => {
      this.proveedores = res as Proveedor[];
   })
  }

  traerFacturasPorProveedor(e){
    var factura = new FacturaProveedor();
    factura.proveedor = this.comprobantePago.nombreProveedor;
    this._facturaProveedorService.getFacturasPendientesPorProveedor(factura).subscribe(res => {
      this.listaFacturas = res as FacturaProveedor[];
    }) 
  }

  traerDetalleCostos(){
    this._centroCostoService.getCentrosCostos().subscribe(res => {
      this.detallesCostos = res as CentroCosto[];
   })
  }


  traerComprobantesPago(){
    this.listadoComprobantes = [];
    this.mostrarLoadingBase = true;
    this._comprobantePagoProveedoresService.getComprobantes().subscribe(res => {
      this.listadoComprobantes = res as ComprobantePagoProveedor[];
      this.mostrarLoadingBase = false;
    })  
  }

  traerTransaccionesFactura(){
    this.listadoTransaccionesFactura = [];
    this.mostrarLoadingBase = true;
    this._transaccionesFacturaService.getTransacciones().subscribe(res => {
      this.listadoTransaccionesFactura = res as TransaccionesFacturas[];
      this.mostrarLoadingBase = false;
    })  
  }


  traerTransaccionesCheques(){
    this.listadoTransaccionesCheque = [];
    this.mostrarLoadingBase = true;
    this._transaccionChequesService.getTransacciones().subscribe(res => {
      this.listadoTransaccionesCheque = res as TransaccionChequesGirado[];
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
   // var total = this.listadoFacturasPagar[i].valorCancelado - this.listadoFacturasPagar[i].valorCancelado
    if(this.listadoFacturasPagar[i].valorCancelado > this.listadoFacturasPagar[i].valorSaldos){
      this.listadoFacturasPagar[i].valorCancelado = 0; 
      this.mostrarMensajeGenerico(2,"La cantidad ingresada es superior al saldo") 
    }
    
  }

  calcularTotal(e){
    /* this.listadoOperaciones.forEach(element =>{
      this.comprobantePago.total +=element.valor;
    })  */
  }


  traerComprobantesPagoPorRango() {
    this.listadoComprobantes = [];
    this.mostrarLoadingBase = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._comprobantePagoProveedoresService.getComprobantePorRango(this.obj).subscribe(res => {
      this.listadoComprobantes = res as ComprobantePagoProveedor[];
      this.mostrarLoadingBase = false;
    })
  }


  traerTransaccionesFacturaPorRango() {
    this.listadoTransaccionesFactura = [];
    this.mostrarLoadingBase = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._transaccionesFacturaService.getTransaccionesPorRango(this.obj).subscribe(res => {
      this.listadoTransaccionesFactura = res as TransaccionesFacturas[];
      this.mostrarLoadingBase = false;
    })
  }


  traerTransaccionesChequesPorRango() {
    this.listadoTransaccionesCheque = [];
    this.mostrarLoadingBase = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._transaccionChequesService.getTransaccionesPorRango(this.obj).subscribe(res => {
      this.listadoTransaccionesCheque = res as TransaccionChequesGirado[];
      this.mostrarLoadingBase = false;
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
    var factura = await this.listaFacturas.find(element=> element._id == e.value)
    console.log(factura)
    this.listadoFacturasPagar[i].numFactura = Number(factura.nFactura);
    this.listadoFacturasPagar[i].valorFactura = factura.total;
    this.listadoFacturasPagar[i].fechaFactura = factura.fecha;
    this.listadoFacturasPagar[i].valorSaldos = this.listadoFacturasPagar[i].valorFactura - this.listadoFacturasPagar[i].valorAbonado;
    console.log(factura)
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
    this.listadoOperaciones.splice(i, 1);
  }


  addElement(){
    this.listadoFacturasPagar.push(new TransaccionesFacturas());
  }

  addElementPago(){
    this.listadoPagos.push(new TransaccionChequesGirado());
  }


  async guardar(){
    this.obtenerId();


    /* var flag = true;
    this.listadoOperaciones.forEach(element=>{
      if(element.idCuenta == null || element.idSubCuenta == null || element.valor == 0){
        flag = false;
      }
    });

    if(flag == true){
      if(this.comprobantePago.total == 0)
        this.mostrarMensajeGenerico(2,"El total debe ser superior a 0");  
      else 
        this.obtenerId();
    }
    else
      this.mostrarMensajeGenerico(2,"Hay campos vacios en los registros"); */
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
      element.proveedor = this.comprobantePago.nombreProveedor;
      element.fechaPago = element.fechaPagoDate.toLocaleDateString()
    });

    this.guardarComprobantePago(); 
  }



  guardarComprobantePago(){
    console.log(this.comprobantePago)
    try {
      this._comprobantePagoProveedoresService.newComprobantePago(this.comprobantePago).subscribe((res) => {
        this.actualizarContador();
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
       break;
      case "Comprobantes de Pago Generados":
        this.mostrarNewCP = false;
        this.mostrarListaCP = true;
        this.mostrarTransaccionesFacturas = false;
        this.mostrarTransaccionesCheques = false;
        if(this.listadoComprobantes.length == 0)
          this.traerComprobantesPagoPorRango();
        break;
      case "Transacciones Facturas":
        this.mostrarNewCP = false;
        this.mostrarListaCP = false;
        this.mostrarTransaccionesFacturas = true;
        this.mostrarTransaccionesCheques = false;
        if(this.listadoTransaccionesFactura.length == 0)
          this.traerTransaccionesFacturaPorRango();
        break;
      case "Transacciones Cheques":
        this.mostrarNewCP = false;
        this.mostrarListaCP = false;
        this.mostrarTransaccionesFacturas = false;
        this.mostrarTransaccionesCheques = true;
        if(this.listadoTransaccionesCheque.length == 0)
          this.traerTransaccionesChequesPorRango();
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
