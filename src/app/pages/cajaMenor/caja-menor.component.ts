import { Component, OnInit } from '@angular/core';
import { AuthenService } from 'src/app/servicios/authen.service';
import { CajaMenorService } from 'src/app/servicios/cajaMenor.service';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { TransaccionesFinancierasService } from 'src/app/servicios/transaccionesFinancieras.service';
import Swal from 'sweetalert2';
import { objDate } from '../transacciones/transacciones';
import { TransaccionesFinancieras } from '../transaccionesFinancieras/transaccionesFinancieras';
import { user } from '../user/user';
import { contadoresDocumentos } from '../ventas/venta';
import { CajaMenor, DetalleCajaMenor, FormatoImpresion } from './caja-menor';
import pdfMake from "pdfmake/build/pdfmake";
import { DatosConfiguracionService } from 'src/app/servicios/datosConfiguracion.service';
import 'jspdf-autotable';

@Component({
  selector: 'app-caja-menor',
  templateUrl: './caja-menor.component.html',
  styleUrls: ['./caja-menor.component.scss']
})
export class CajaMenorComponent implements OnInit {
  transaccionesCaja: DetalleCajaMenor[] = [];
  listaTransacciones  : TransaccionesFinancieras[] = [];
  listadoCaja: CajaMenor[] = [];
  cajaMenorEncontradas: CajaMenor[] = [];
  contadores: contadoresDocumentos[];
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  dateNow = new Date();
  totalSuma = 0;
  totalResta = 0;
  totalRC = 0;
  isDescarga = false;
  
  cajaMenor : CajaMenor;
  mostrarLoading : boolean = false;
  obj: objDate;
  resultado = 0;
  estadoCuenta = "";
  mensajeLoading = "";
  imagenLogotipo ="";
  existeCaja = false;

  docImpresion : FormatoImpresion [] = [];
  formImpresion : FormatoImpresion
  newCaja = true;

  tipoUsuario = "";
  isAdmin = true;
  isUser = false;
  notas = ""
  popupVisibleNotas = false;
  existeRegistro = false

  menu: string[] = [
    "Caja Menor Diaria",
    "Registros Caja Generados"
  ];

  arraySucursales: string[] = [
    "matriz",
    "sucursal1",
    "sucursal2"
  ];
  
  constructor(
    public _transaccionesFinancierasService : TransaccionesFinancierasService,
    public _authenService: AuthenService,
    public _cajaMenorService : CajaMenorService,
    public _contadoresService : ContadoresDocumentosService,
    public _configurationService : DatosConfiguracionService
    ) {
        this.cajaMenor = new CajaMenor();
        this.cajaMenor.fecha = new Date();
   }

  ngOnInit() {
    this.cargarUsuarioLogueado();
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.traerContadoresDocumentos();
    this.traerDatosConfiguracion();
    this.validarEstadoCaja();
    this.formImpresion = new FormatoImpresion();
  }

  validarEstadoCaja(){
    this.cajaMenor.fecha.setHours(0,0,0,0);
    this._cajaMenorService.getCajaMenorPorFecha(this.cajaMenor).subscribe(
      res => {
        this.cajaMenorEncontradas = res as CajaMenor[];
        if(this.cajaMenorEncontradas.length != 0 ){
          var existeRegistro = this.cajaMenorEncontradas.find(element=>element.sucursal == this.cajaMenor.sucursal);
          this.existeRegistro = existeRegistro ? true : false;
          var existe = this.cajaMenorEncontradas.find(element=>element.sucursal == this.cajaMenor.sucursal && element.estado == "Cerrada") ;
          this.existeCaja = existe != undefined ? true : false;
          this.cajaMenor.estado = existe?.estado ?? "Abierta";
        }else{
          this.existeCaja = false;
          this.cajaMenor.estado = "Abierta";
        } },
      (err) => {});
  }

  traerContadoresDocumentos(){
    this._contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
      this.cajaMenor.idDocumento = this.contadores[0].cajaMenor_Ndocumento + 1;
   })
  }

  traerDatosConfiguracion() {
    this._configurationService.getDatosConfiguracion().subscribe((res) => {
      this.imagenLogotipo = res[0].urlImage;
    });
  }

  traerCajaPagoPorRango() {
    this.listadoCaja = [];
    this.mensajeLoading = "Cargando datos";
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._cajaMenorService.getCajaMenorPorRango(this.obj).subscribe(res => {
      this.listadoCaja = res as CajaMenor[];
      this.mostrarLoading = false;
    })
  }

  

  traerDocumentosCaja(){
    this.listadoCaja = [];
    this.mensajeLoading = "Cargando datos";
    this.mostrarLoading = true;
    this._cajaMenorService.getCajaMenor().subscribe(res => {
      this.listadoCaja = res as CajaMenor[];
      this.mostrarLoading = false;
    })
  }

  buscarTransaccionesPorFecha(e){
    this.mensajeLoading = "Buscando datos.."
    this.mostrarLoading = true;
    this.resetearValores();
    this.obj = new objDate();
    this.obj.sucursal = this.cajaMenor.sucursal;
    this.obj.fechaAnterior = this.cajaMenor.fecha;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this.obj.fechaActual = new Date(this.cajaMenor.fecha);
    this.obj.fechaActual.setHours(24);
    this._transaccionesFinancierasService.getTransaccionesFinancierasPorRango(this.obj).subscribe(res => {
      this.listaTransacciones = res as TransaccionesFinancieras[];
      this.crearTransaccionesCaja();
    })
    this.validarEstadoCaja();
  }


  buscarTransaccionesPorFechaDescarga(e){
    this.mensajeLoading = "Buscando datos.."
    this.mostrarLoading = true;
    this.resetearValores();
    this.obj = new objDate();
    this.obj.sucursal = this.cajaMenor.sucursal;
    this.obj.fechaAnterior = this.cajaMenor.fecha;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this.obj.fechaActual = new Date(this.cajaMenor.fecha);
    this.obj.fechaActual.setHours(24);
    this._transaccionesFinancierasService.getTransaccionesFinancierasPorRango(this.obj).subscribe(res => {
      this.listaTransacciones = res as TransaccionesFinancieras[];
      this.crearTransaccionesCaja();
    })
  }


  resetearValores(){
    this.resultado = 0;
    this.estadoCuenta = "";
    this.cajaMenor.resultado = this.resultado;
    this.cajaMenor.estadoCaja = this.estadoCuenta;
  }

  cargarUsuarioLogueado() {
    new Promise((res, err) => {
      if (localStorage.getItem("maily") != '') 
      var correo = localStorage.getItem("maily");

      this._authenService.getUserLogueado(correo)
        .subscribe(
          res => {
            var usuario = res as user;
            this.cajaMenor.usuario = usuario[0].username.toString();
            this.cajaMenor.sucursal = usuario[0].sucursal.toString();
            this.traerTransaccionesFinancierasPorDia();

            if(usuario[0].rol == "Administrador")
              this.isAdmin = true;
            else if(usuario[0].rol == "Usuario")
              this.isUser = true;
            else
              this.isAdmin = false;
            
          }
        )
    });
  }


  calcular(){
    this.resultado = 0;
    this.totalSuma = 0;
    this.totalResta = 0;
    this.totalRC = 0;

    this.transaccionesCaja.forEach(element=>{
      this.totalSuma += element.TotalIngresos ?? 0 ;
      this.totalResta += element.TotalSalidas ?? 0;
      this.totalRC += element.TotalRC ?? 0;
    });

    this.resultado = this.totalSuma - this.totalResta - this.totalRC;
    if(this.resultado == 0)
      this.estadoCuenta = "OK"
    else if(this.resultado > 0)
      this.estadoCuenta = "SOBRANTE"
    else if(this.resultado < 0)
      this.estadoCuenta = "FALTANTE"
    
    this.cajaMenor.totalIngresos = Number(this.totalSuma.toFixed(2));
    this.cajaMenor.totalSalidas = Number(this.totalResta.toFixed(2));
    this.cajaMenor.totalRC = Number(this.totalRC.toFixed(2));
    this.cajaMenor.resultado = Number(this.resultado.toFixed(2));
    this.cajaMenor.estadoCaja = this.estadoCuenta;
    this.mostrarLoading = false;
  }


  traerTransaccionesFinancierasPorDia(){
    this.obj = new objDate();
    this.obj.sucursal = this.cajaMenor.sucursal;
    this.obj.fechaAnterior = this.cajaMenor.fecha;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this.obj.fechaActual = new Date(this.cajaMenor.fecha);
    this.obj.fechaActual.setHours(24);
    this._transaccionesFinancierasService.getTransaccionesFinancierasPorRango(this.obj).subscribe(res => {
      this.listaTransacciones = res as TransaccionesFinancieras[];
      this.crearTransaccionesCaja();
    })
    this.validarEstadoCaja();
  }


  crearTransaccionesCaja(){
    if(this.listaTransacciones.length == 0)
      this.mostrarLoading = false;

    this.transaccionesCaja = [];
    this.listaTransacciones.forEach(element=>{
      var newCaja = new DetalleCajaMenor();
      newCaja.OrderDate = element.fecha.toLocaleString();
      newCaja.Sub1 = element.numDocumento;
      newCaja.Notas = element.notas;
      console.log(newCaja.Notas)
      if(element.cuenta == "2.1 PRÉSTAMOS")
        newCaja.Sub2 = element.cedula;
      else
        newCaja.Sub2 = element.documentoVenta;
      newCaja.SubCuenta = element.subCuenta;
      newCaja.Cuenta = element.cuenta;
      var cadena = element.cuenta.split(" ");
      newCaja.Orden = Number(cadena[0]);


      /* if(newCaja.Orden == 1)
        newCaja.Cuenta = "A. "+newCaja.Cuenta;
      else if(newCaja.Orden == 2)
        newCaja.Cuenta = "B. "+newCaja.Cuenta;
      else if(newCaja.Orden == 3)
        newCaja.Cuenta = "C. "+newCaja.Cuenta;
      else if(newCaja.Orden == 4)
        newCaja.Cuenta = "D. "+newCaja.Cuenta;
      else if(newCaja.Orden == 5)
        newCaja.Cuenta = "E. "+newCaja.Cuenta;
      else if(newCaja.Orden == 6)
        newCaja.Cuenta = "F. "+newCaja.Cuenta;
      else if(newCaja.Orden == 7)
        newCaja.Cuenta = "G. "+newCaja.Cuenta;
      else if(newCaja.Orden == 8)
        newCaja.Cuenta = "H. "+newCaja.Cuenta;
      else if(newCaja.Orden == 9)
        newCaja.Cuenta = "I. "+newCaja.Cuenta;
      else if(newCaja.Orden == 10)
        newCaja.Cuenta = "J. "+newCaja.Cuenta;
      else if(newCaja.Orden == 11)
        newCaja.Cuenta = "K. "+newCaja.Cuenta; */


      if(element.tipoCuenta == "Ingresos") 
        newCaja.TotalIngresos = element.valor;

      if(element.tipoCuenta == "Salidas")
         newCaja.TotalSalidas = element.valor;

       
      if(element.tipoCuenta == "Reales y Transitorias")
        newCaja.TotalRC = element.valor;

      if(element.isContabilizada == true)
        this.transaccionesCaja.push(newCaja);
      
    });
    this.calcular();

    if(this.isDescarga)
        this.crearPDF(null, false);
  }

  
  
  downloadFile = (e) => {
    this.obtenerDatosTransacciones(e.row.data);
  };

  mostrarNotas = (e) => {
    this.asignarValornota(e.row.data);
  };

  asignarValornota(e){
    this.notas = e.Notas == "" ? "S/N" : e.Notas
    this.popupVisibleNotas = true;
  }

  validateCaja = (e) => {
    this.validarCaja(e.row.data);
  };

  openCaja = (e) => {
    this.abrirCaja(e.row.data);
  };

  validarCaja(e){
    Swal.fire({
      title: 'Validar caja',
      text: "Desea marcar la caja como validada?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) { 
        this._cajaMenorService.updateValidacion(e,"SI").subscribe(res => {
          this.mostrarMensajeGenerico(1,"Caja actualizada");
          this.traerCajaPagoPorRango();
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado!','Se ha cancelado su proceso.','error')
      }
    })
    
  }

  abrirCaja(e){
    Swal.fire({
      title: 'Abrir caja',
      text: "Está seguro que desea abrir nuevamente la caja",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) { 
        this._cajaMenorService.updateEstado(e,"Abierta").subscribe(res => {
          this.mostrarMensajeGenerico(1,"Caja actualizada");
          this.traerCajaPagoPorRango();
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado!','Se ha cancelado su proceso.','error')
      }
    })
    
  }


  obtenerDatosTransacciones(e){
    this.isDescarga = true;
    this.cajaMenor = e;
    this.cajaMenor.sucursal = e.sucursal;
    this.cajaMenor.fecha = new Date(e.fecha);
    console.log(this.cajaMenor)
    this.buscarTransaccionesPorFechaDescarga(e);
    
  }


  actualizarCaja(){
    var idCaja = this.cajaMenorEncontradas.find(element=>element.sucursal == this.cajaMenor.sucursal);
    console.log(idCaja._id)
    this.cajaMenor._id = idCaja._id;
    this.cajaMenor.estado = "Cerrada";
    this.cajaMenor.idDocumento = idCaja.idDocumento;
      this._cajaMenorService.updateCajaMenor(this.cajaMenor).subscribe((res) => {
        Swal.fire({
          title:'Correcto',
          text: 'Se ha actualizado con éxito',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
        })
        //this.mostrarMensajeGenerico(1,"Caja actualizada y cerrada");
      },(err) => {});
  }



  guardarCajaMenor(){
    if(this.transaccionesCaja.length == 0)
      this.mostrarMensajeGenerico(2,"No hay transacciones efectuadas");  
    else 
      this.obtenerId();
  }



  obtenerId(){
    this.mensajeLoading = "Guardando";
    this.mostrarLoading = true;

    var IdNum = new Promise<any>((resolve, reject) => {
      try {
        this._cajaMenorService.getCajaMenorPorIdConsecutivo(this.cajaMenor).subscribe(
          res => {
          this.cajaMenorEncontradas = res as CajaMenor[];
            if(this.cajaMenorEncontradas.length == 0)
              resolve("listo");
            else{
              this.cajaMenor.idDocumento = this.cajaMenor.idDocumento + 1
              this.obtenerId();
            }},(err) => {});
      } catch (error) {} 
    })

    IdNum.then((data) => { this.guardarCaja() })
  }


  guardarCaja(){
    try {
      this.cajaMenor.estado = "Cerrada";
      this._cajaMenorService.newCajaMenor(this.cajaMenor).subscribe((res) => {
        this.actualizarContador();
        this.revisarTransacciones();
      },(err) => {});
    } catch (error) {
      this.mostrarMensajeGenerico(2,"Error al guardar"); 
    }    
  }

  revisarTransacciones(){
    this.listaTransacciones.forEach(element =>{
      if(element.cuenta == "1.8 EFECTIVO LÍQUIDO"){
        var fechaNueva = new Date(element.fecha)
        fechaNueva.setDate(fechaNueva.getDate()+1);
        element.fecha = fechaNueva
        //element.cuenta = "1.8 EFECTIVO LÍQUIDO"
        //element.subCuenta = "1.8.0 Queda en caja"
        //element.tipoCuenta = "Ingresos"
        this._transaccionesFinancierasService.newTransaccionFinanciera(element).subscribe((res) => {})
      }

    })
  }

  actualizarContador(){
    this.contadores[0].cajaMenor_Ndocumento = this.cajaMenor.idDocumento
    this._contadoresService.updateContadoresIDCajaMenor(this.contadores[0]).subscribe( res => {
      this.mostrarLoading = false;
      this.crearPDF(null,true);
    },err => {})
  }


  terminarOperacion(){
    //alert("efddf")
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


  opcionMenu(e){
    switch (e.value) {
      case "Caja Menor Diaria":
        this.newCaja = true;
        
       break;
      case "Registros Caja Generados":
        this.newCaja = false;
        if(this.listadoCaja.length == 0)
          this.traerCajaPagoPorRango();
        break;
      default:    
    }      
  }

 


  convertirDatos(){
    this.formImpresion.nombreCuenta = "COSTO";
    this.formImpresion.listaSubCuentas = this.transaccionesCaja;
    console.log(this.formImpresion)
    this.docImpresion.push(this.formImpresion);
    this.docImpresion.push(this.formImpresion);
    this.docImpresion.push(this.formImpresion);

  }



  crearPDF(recibo , isNew) {
    if(isNew)
      this.mensajeLoading = "Guardando";
    else
      this.mensajeLoading = "Descargando";

    this.mostrarLoading = true;
    const documentDefinition = this.getDocumentDefinition();

    var IdNum = new Promise<any>((resolve, reject) => {
      try {
          pdfMake.createPdf(documentDefinition).download("Caja_Menor " + this.cajaMenor.idDocumento,function (response){resolve("listo")});
      } catch (error) {} 

    })

    IdNum.then((data) => {
      this.mostrarLoading = false;
      if(isNew)
        this.terminarOperacion();
      else
        this.mostrarMensajeGenerico(1,"Descarga completa")
      
    });

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
                columns: [
                  {
                    width: 290,
                    text: "CAJA MENOR  001 - 000",
                    bold: true,
                    fontSize: 18,
                  },
                  {
                    width: 230,
                    text: "NO 000000" + this.cajaMenor.idDocumento,
                    color: "red",
                    bold: true,
                    fontSize: 18,
                    alignment: "right",
                  },
                ],
              },
              {
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
                              "" + this.cajaMenor.fecha.toLocaleString(),
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
                                "" + this.cajaMenor.sucursal,
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

        


        this.getListaOperaciones(this.transaccionesCaja),

        {
          style: 'tableExample2',
          fontSize: 7,
          table: {
            widths: [343,46,46,43],
            body: [
              [ { text: 'Balance Caja', bold: true ,style: "detalleTotales"}, {text: this.totalSuma.toFixed(2), style:"totales" }, {text: this.totalResta.toFixed(2), style:"totales" }, {text: this.totalRC.toFixed(2), style:"totales" }],
             
            ]
          }
        },
        {
          style: 'tableExample2',
          fontSize: 7,
          table: {
            widths: [315,180],
            body: [
              [ { text: 'Resultado del Ejercicio', bold: true ,style: "detalleTotales"}, {text: this.resultado.toFixed(2), style:"totales" }],
              [ { text: 'Estado de la Caja', bold: true ,style: "detalleTotales"}, {text: this.estadoCuenta, style:"totales" }],
            ]
          }
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
          hLineColor :'#ff0000',
        },
        tableExample2: {
          margin: [0, 2, 0, 0],
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
          alignment: "center",
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


   getListaOperaciones(operaciones: DetalleCajaMenor[]) {
     operaciones.sort((a,b) => (a.Cuenta > b.Cuenta ? 1 : -1));
      return {

      table: {
        widths: ["25%", "25%", "10%", "10%", "10%", "10%", "10%"],
        alignment: "center",
        fontSize: 7,
        headerRows: 2,
        body: [
          [
            { text: "Cuenta", style: "tableHeader2", fontSize: 7,},
            { text: "SubCuenta", style: "tableHeader2", fontSize: 7,},
            { text: "Doc", style: "tableHeader2", fontSize: 7,},
            { text: "CC", style: "tableHeader2", fontSize: 7,},
            { text: "Ingresos", style: "tableHeader2", fontSize: 7,},
            { text: "Salidas", style: "tableHeader2", fontSize: 7,},
            { text: "RyT", style: "tableHeader2", fontSize: 7,},
          ],

          ...operaciones.map((ed) => {
            return [
              { text: ed.Cuenta,alignment: "center", fontSize: 7 },
              { text: ed.SubCuenta, alignment: "center", fontSize: 7 },
              { text: ed.Sub1, alignment: "center", fontSize: 7 },
              { text: ed.Sub2, alignment: "center", fontSize: 7 },
              { text: ed.TotalIngresos, alignment: "center", fontSize: 7 },
              { text: ed.TotalSalidas, alignment: "center", fontSize: 7 },
              { text: ed.TotalRC, alignment: "center", fontSize: 7 },
            ];
          }),
        ],
      },
      layout: 'lightHorizontalLines'
      
    }; 
  }



  getSubcuentas(operaciones: DetalleCajaMenor[]) {
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
            },
            {text: "",},
            {text: "",},
          ],

          ...operaciones.map((ed) => {
            return [
               
              { text: ed.SubCuenta,alignment: "center", fontSize: 8 },
              { text: ed.SubCuenta, alignment: "center", fontSize: 8 },
              { text: ed.SubCuenta, alignment: "center", fontSize: 8 },

            ];
          }),
        ],
      },

      
    };
  }

}




