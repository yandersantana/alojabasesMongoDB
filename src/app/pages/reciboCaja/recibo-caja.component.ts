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
import { objDate } from '../transacciones/transacciones';
import { TransaccionesFinancieras } from '../transaccionesFinancieras/transaccionesFinancieras';
import { contadoresDocumentos } from '../ventas/venta';
import { OperacionComercial, ReciboCaja } from './recibo-caja';
import pdfMake from "pdfmake/build/pdfmake";
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { DatosConfiguracionService } from 'src/app/servicios/datosConfiguracion.service';


@Component({
  selector: 'app-recibo-caja',
  templateUrl: './recibo-caja.component.html',
  styleUrls: ['./recibo-caja.component.scss']
})
export class ReciboCajaComponent implements OnInit {

  resultado =0;
  listaCuentas: Cuenta [] = []
  listaSubCuentas: SubCuenta [] = []
  listaSubCuentas2: SubCuenta [] = []
  listaSubCuentas3: SubCuenta [] = []
  isReadOnly: boolean = false;
  contadores:contadoresDocumentos[]
  recibosEncontrados:ReciboCaja[]

  listadoOperaciones: OperacionComercial [] = []
  operacionComercial: OperacionComercial
  reciboCaja : ReciboCaja
  valorTotal1 = 0;
  valorTotal2 = 0;
  mostrarLoading : boolean = false;
  mostrarLoadingBase : boolean = false;
  newRecibo: boolean = true;
  listadoRecibosCaja: ReciboCaja [] = []
  parametrizaciones: parametrizacionsuc[] = [];
  parametrizacionSucu: parametrizacionsuc;
  obj: objDate;
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  menu: string[] = [
    "Nuevo Recibo",
    "Recibos Cajas Generados"
  ];

  imagenLogotipo ="";


  constructor(
    public _cuentasService : CuentasService,
    public _subCuentasService : SubCuentasService,
    public _transaccionFinancieraService : TransaccionesFinancierasService,
    public _reciboCajaService : ReciboCajaService,
    public _contadoresService: ContadoresDocumentosService,
    public _cuentaPorCobrar: CuentasPorCobrarService,
    public _parametrizacionService: ParametrizacionesService,
    public _configuracionService: DatosConfiguracionService,
    ) {
   }

  ngOnInit() {
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.listadoOperaciones.push(new OperacionComercial());
    this.reciboCaja = new ReciboCaja();
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
      this.listaCuentas = res as Cuenta[];
      this.traersubCuentas();
   })
  }

  traerRecibosCaja(){
    this.mostrarLoadingBase = true;
    this._reciboCajaService.getRecibos().subscribe(res => {
      this.listadoRecibosCaja = res as ReciboCaja[];
      this.mostrarLoadingBase = false;
   })
  }

  traerRecibosCajaPorRango() {
    this.listadoRecibosCaja = [];
    this.mostrarLoadingBase = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._reciboCajaService.getReciboCajaPorRango(this.obj).subscribe(res => {
      this.listadoRecibosCaja = res as ReciboCaja[];
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


  buscarSubCuentas(e,i){
    if(i==0)
      this.listaSubCuentas =  this.listaCuentas.find(element=> element._id == e.value).sub_cuentaList;
    if(i==1)
      this.listaSubCuentas2 =  this.listaCuentas.find(element=> element._id == e.value).sub_cuentaList;
    if(i==2)
      this.listaSubCuentas3 =  this.listaCuentas.find(element=> element._id == e.value).sub_cuentaList;
  }


  traersubCuentas(){
    this.listaCuentas.forEach(element=>{
      this._subCuentasService.getSubCuentasPorId(element._id).subscribe(res => {
        element.sub_cuentaList = res as SubCuenta[];
      })
    })
  }

 
  calcularValores(){
    this.valorTotal1 = this.reciboCaja.valorFactura;
    this.valorTotal2 = this.reciboCaja.valorOtros + this.reciboCaja.valorPagoEfectivo + this.reciboCaja.valorRecargo;
    this.reciboCaja.valorSaldos = this.valorTotal1 - this.valorTotal2 ;
  }

  eliminarRegistro(i: number) {
    this.listadoOperaciones.splice(i, 1);
  }


  addElement(){
    if(this.listadoOperaciones.length <= 2)
      this.listadoOperaciones.push(new OperacionComercial());
    else
      this.mostrarMensajeGenerico(2,"No se pueden ingresar mas operaciones");
  }


  async guardar(){
    var flag = true;
    this.listadoOperaciones.forEach(element=>{
      if(element.idCuenta == null || element.idSubCuenta == null || element.valor == 0){
        flag = false;
      }
    });

    if(flag == true)
      this.obtenerId();
    else
      this.mostrarMensajeGenerico(2,"Hay campos vacios en los registros");
  }

  obtenerId(){
    var IdNum = new Promise<any>((resolve, reject) => {
      try {
        this._reciboCajaService.getReciboCajaPorId(this.reciboCaja).subscribe(res => {
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
    .catch((error) => {
    });
  }

  generarDto(){
    if(this.reciboCaja.valorFactura == 0){
      this.mostrarMensajeGenerico(2,"Debe ingresar un valor de la factura");  
    }else{
      this.mostrarLoading = true;
      this.reciboCaja.operacionesComercialesList = this.listadoOperaciones;
      this.reciboCaja.operacionesComercialesList.forEach(element=>{
        var cuenta = this.listaCuentas.find(element2=> element2._id == element.idCuenta);
        element.nombreCuenta = cuenta.nombre;
        element.tipoCuenta = cuenta.tipoCuenta;
        element.nombreSubcuenta = cuenta.sub_cuentaList.find(element2=> element2._id == element.idSubCuenta).nombre;
      });
      this.comprobarSaldo();
      this.guardarReciboCaja(); 
    }
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

  generarTransaccionesFinancieras(){
    var cont=0;
    this.reciboCaja.operacionesComercialesList.forEach(element=>{
      var transaccion = new TransaccionesFinancieras();
      transaccion.fecha = new Date();
      transaccion.sucursal = this.reciboCaja.sucursal;
      transaccion.cliente = this.reciboCaja.cliente;
      transaccion.rCajaId = "RC"+this.reciboCaja.idDocumento.toString();
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
      this.crearPDF();
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



  crearPDF() {
    this.traerDatosFaltantes();
    const documentDefinition = this.getDocumentDefinition();
    pdfMake.createPdf(documentDefinition) .download("Recibo_Caja " + this.reciboCaja.idDocumento,function () {});
    this.mostrarLoading = false
  }

  traerDatosFaltantes(){
    this.parametrizacionSucu = this.parametrizaciones.find(element=> element.sucursal == this.reciboCaja.sucursal);
    console.log(this.parametrizacionSucu)
  }



  getDocumentDefinition() {
    sessionStorage.setItem("resume", JSON.stringify("PDF"));
    //let tipoDocumento="Factura";
    return {
      pageSize: "A4",
      pageOrientation: "portrait",
      content: [
        {
          columns: [
            {
              image: this.imagenLogotipo,
              width: 100,
              margin: [0, 20, 0, 10],
            },
            {
              width: 410,
              margin: [0, 20, 0, 10],
              text: " ",
              alignment: "right",
            },
          ],

          //alignment: 'center'
        },

        {
          columns: [
            [
              {
                text: this.parametrizacionSucu.razon_social,
              },
              {
                text: "RUC: " + this.parametrizacionSucu.ruc,
              },

              {
                text:
                  "Venta de materiales para acabados de construcción, porcelanatos, cerámicas ",
                fontSize: 9,
              },
              {
                text: "Dirección: " + this.parametrizacionSucu.direccion,
              },
              {
                text: "Teléfonos: " + this.parametrizacionSucu.telefonos,
              },
              {
                text: "Auto SRI " + this.parametrizacionSucu.sri,
              },
              {
                columns: [
                  {
                    width: 260,
                    text: "RECIBO CAJA  001 - 000",
                    bold: true,
                    fontSize: 20,
                  },
                  {
                    width: 260,
                    text: "NO " + this.reciboCaja.idDocumento,
                    color: "red",
                    bold: true,
                    fontSize: 20,
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
                            fontSize: 9,
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
                            fontSize: 9,
                            ul: [
                              "" + this.reciboCaja.cliente,
                              "" + this.reciboCaja.ruc,
                              "" + this.reciboCaja.docVenta,
                               "" + this.reciboCaja.fecha.toLocaleString(),
                              "" + this.reciboCaja.sucursal,
                            ],
                          },
                        ],
                      },
                      {
                        stack: [
                          {
                            type: "none",
                            bold: true,
                            fontSize: 9,
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
                              fontSize: 9,
                              ul: [
                                "" + this.reciboCaja.tipoPago,
                                "" + this.reciboCaja.numDocumento,
                                "" + this.reciboCaja.banco,
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

        //this.getProductosIngresados2(this.productosControlIngresados),
       // this.getProductosObsequio(this.productosObsequios2),
        { text: " " },
        { text: " " },
        { text: " " },
        { text: " " },
        {
          columns: [
            {
              text: "Firma conformidad entrega",
              width: 250,
              fontSize: 10,
              alignment: "right",
              margin: [55, 20, 40, 10],
            },
            {
              width: 250,
              margin: [40, 20, 20, 10],
              fontSize: 10,
              text: "Firma conformidad recibo ",
              alignment: "left",
            },
          ],

          //alignment: 'center'
        },
      ],
      footer: function (currentPage, pageCount) {
        return {
          table: {
            body: [
              [
                {
                  text:
                    "  ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL ",
                  alignment: "center",
                  style: "textFot",
                },
              ],
            ],
          },
          layout: "noBorders",
        };
      },
      pageBreakBefore: function (
        currentNode,
        followingNodesOnPage,
        nodesOnNextPage,
        previousNodesOnPage
      ) {
        return (
          currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
        );
      },

      images: {
        mySuperImage: "data:image/jpeg;base64,...content...",
      },
      info: {
        title: "Recibo Caja",
        author: "this.resume.name",
        subject: "RESUME",
        keywords: "RESUME, ONLINE RESUME",
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
      },
    };
  }

  




  


}
