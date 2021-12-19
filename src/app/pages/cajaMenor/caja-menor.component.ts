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
  dateNow = new Date().toLocaleDateString();
  two = 2;

  cajaMenor : CajaMenor;
  mostrarLoading : boolean = false;
  obj: objDate;
  resultado = 0;
  estadoCuenta = "";
  mensajeLoading = "";
  imagenLogotipo ="";

  docImpresion : FormatoImpresion [] = [];
  formImpresion : FormatoImpresion
  newCaja = true;

  menu: string[] = [
    "Caja Menor Diaria",
    "Registros Caja Generados"
  ];
  
  constructor(
    public _transaccionesFinancierasService : TransaccionesFinancierasService,
    public _authenService: AuthenService,
    public _cajaMenorService : CajaMenorService,
    public _contadoresService : ContadoresDocumentosService,
    public _configurationService : DatosConfiguracionService
    ) {
   }

  ngOnInit() {
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.traerContadoresDocumentos();
    this.traerDatosConfiguracion();
    this.traerTransaccionesFinancierasPorDia();
    this.cargarUsuarioLogueado();
    this.cajaMenor = new CajaMenor();
    this.cajaMenor.fecha = this.dateNow;
    this.formImpresion = new FormatoImpresion();
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
          }
        )
    });
  }


  calcular(){
    var totalSuma = 0;
    var totalResta = 0;
    var totalRC = 0;
    this.transaccionesCaja.forEach(element=>{
      totalSuma += element.TotalIngresos ?? 0 ;
      totalResta += element.TotalSalidas ?? 0;
      totalRC += element.TotalRC ?? 0;
    });

    this.resultado = totalSuma - totalResta - totalRC;
    if(this.resultado == 0)
      this.estadoCuenta = "OK"
    else if(this.resultado > 0)
      this.estadoCuenta = "SOBRANTE"
    else if(this.resultado < 0)
      this.estadoCuenta = "FALTANTE"
    
    this.cajaMenor.totalIngresos = totalSuma;
    this.cajaMenor.totalSalidas = totalResta;
    this.cajaMenor.totalRC = totalRC;
    this.cajaMenor.resultado = this.resultado;
    this.cajaMenor.estadoCaja = this.estadoCuenta;
  }


  traerTransaccionesFinancierasPorDia(){
    this.obj = new objDate();
    this.obj.fechaActual = new Date();
    this.obj.fechaAnterior = new Date();
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._transaccionesFinancierasService.getTransaccionesFinancierasPorRango(this.obj).subscribe(res => {
      this.listaTransacciones = res as TransaccionesFinancieras[];
      this.crearTransaccionesCaja();
   })
  }


  crearTransaccionesCaja(){
    this.listaTransacciones.forEach(element=>{
      var newCaja = new DetalleCajaMenor();
      newCaja.OrderDate = element.fecha.toLocaleString();
      newCaja.Sub1 = element.numDocumento;
      newCaja.Sub2 = element.documentoVenta;
      newCaja.SubCuenta = element.subCuenta;
      newCaja.Cuenta = element.cuenta;
      if(element.tipoCuenta == "Ingresos")
        newCaja.TotalIngresos = element.valor;
      if(element.tipoCuenta == "Salidas")
        newCaja.TotalSalidas = element.valor;
      if(element.tipoCuenta == "Reales y Transitorias")
        newCaja.TotalRC = element.valor;


      this.transaccionesCaja.push(newCaja);
      this.calcular();
    });
  }

  
  
  downloadFile = (e) => {
    //this.obtenerDataRecibo(e.row.data);
  };



  guardarCajaMenor(){
    this.cajaMenor.estadoCaja = "Cerrado";
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
        this._cajaMenorService.getCajaMenorPorIdConsecutivo(this.cajaMenor).subscribe(res => {
         this.cajaMenorEncontradas = res as CajaMenor[];
          if(this.cajaMenorEncontradas.length == 0)
            resolve("listo");
          else{
            this.cajaMenor.idDocumento = this.cajaMenor.idDocumento + 1
            this.obtenerId();
          }
          },(err) => {});
      } catch (error) {} 
    })

    IdNum.then((data) => {
      this.guardarCaja();
    })
  }


  guardarCaja(){
    try {
      this._cajaMenorService.newCajaMenor(this.cajaMenor).subscribe((res) => {
        this.actualizarContador();
      },(err) => {});
    } catch (error) {
      this.mostrarMensajeGenerico(2,"Error al guardar"); 
    }    
  }

  actualizarContador(){
    this.contadores[0].cajaMenor_Ndocumento = this.cajaMenor.idDocumento
    this._contadoresService.updateContadoresIDCajaMenor(this.contadores[0]).subscribe( res => {
      this.mostrarLoading = false;
      this.crearPDF(null,true);
      //this.mostrarMensajeGenerico(1,"Documento Guardado con éxito");
    },err => {})
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


   crearPDF(recibo , isNew) {
     this.formImpresion.nombreCuenta = "COSTO";
     this.formImpresion.listaSubCuentas = this.transaccionesCaja;
     this.docImpresion.push(this.formImpresion);
     this.docImpresion.push(this.formImpresion);
    

    if(isNew)
      this.mensajeLoading = "Guardando";
    else
      this.mensajeLoading = "Descargando";

    this.mostrarLoading = true;
    //this.comprobantePagoDescarga = recibo;
    //this.traerDatosFaltantes(this.comprobantePagoDescarga.sucursal);
    const documentDefinition = this.getDocumentDefinition();

    var IdNum = new Promise<any>((resolve, reject) => {
      try {
          pdfMake.createPdf(documentDefinition).download("Caja_Menor " + this.cajaMenor.idDocumento,function (response){resolve("listo")});
      } catch (error) {
      } 

    })

    IdNum.then((data) => {
      if(isNew)
      this.mostrarMensajeGenerico(1,"descarga completa")
        //this.terminarOperacion();
      else
      console.log("dd");
        //this.terminarDescarga();
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

        {
          style: "tableExample",
          table: {
            widths: [78, 100, 56, 56, 56, 56, 56],
            body: [
              [
                {
                  stack: [
                    {
                      type: "none",
                      bold: true,
                      fontSize: 8,
                      ul: [
                        "CUENTA",
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
                        "SUBCUENTA",
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
                        "DOC",
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
                        "CC",
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
                        "CC",
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
                        "CC",
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
                        "CC",
                      ],
                    },
                  ],
                },
               
              ],
            ],
          },
        },


        this.getListaOperaciones(this.docImpresion),
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
                          {text: 'Observaciones: ' , style:"sizeText"},
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
              [ { text: 'Total', bold: true ,style: "detalleTotales"}, {text: "", style:"totales" }],
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

  getListaOperaciones(operaciones: FormatoImpresion[]) {
    var ll;
    operaciones.forEach(element=>{
      ll = 
     {
          table: {
            body: [
              [
                {
                  text:element.nombreCuenta,
                },
              ],
            ],
          },
          layout: "noBorders",
        };
    
      
    
    }); 

    return ll;

     /* return {

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
               
              { text: ed.nombreCuenta,alignment: "center", fontSize: 8 },
              { text: ed.nombreCuenta, alignment: "center", fontSize: 8 },
              { text: ed.nombreCuenta, alignment: "center", fontSize: 8 },

            ];
          }),
        ],
      },

      
    };  */
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




