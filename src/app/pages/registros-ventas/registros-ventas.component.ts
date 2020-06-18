

import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertsService } from 'angular-alert-module';
import { factura, nota_venta, cotizacion, venta } from '../ventas/venta';
import pdfMake from 'pdfmake/build/pdfmake';
import { element } from 'protractor';
import { ProductoDetalleVenta } from '../producto/producto';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { FacturasService } from 'src/app/servicios/facturas.service';
import { ProformasService } from 'src/app/servicios/proformas.service';

@Component({
  selector: 'app-registros-ventas',
  templateUrl: './registros-ventas.component.html',
  styleUrls: ['./registros-ventas.component.scss']
})
export class RegistrosVentasComponent implements OnInit {
  facturas:factura[]=[]
  facturasTraidas:factura[]=[]
  notasVenta:factura[]=[]
  cotizaciones:factura[]=[]
  factura:factura
  productosVendidos:venta[]=[]
  productosVendidos2:venta[]=[]
  tDocumento:string
  parametrizaciones:parametrizacionsuc[]=[]
  parametrizacionSucu:parametrizacionsuc

  //valores de Factura
  subtotal1:number=0
  Sdescuento:number=0
  subtotal2:number=0
  sIva0:number=0
  sIva12:number=0
  iva:number=0
  numeroFactura:string=""
  constructor(public parametrizacionService:ParametrizacionesService,public facturasService:FacturasService,public proformasService:ProformasService) { 
    this.factura = new factura()
  }

  ngOnInit() {
    /* this.getFacturas()
    this.getNotasVentas()
    this.getCotizaciones()
    this.getProductosComprados() */
    this.traerParametrizaciones()
    this.traerFacturas()
    this.traerProformas()
  }

  traerParametrizaciones(){
    this.parametrizacionService.getParametrizacion().subscribe(res => {
      this.parametrizaciones = res as parametrizacionsuc[];
   })
  }

  traerFacturas(){
    this.facturasService.getFacturas().subscribe(res => {
      this.facturas = res as factura[];
   })
  }

  traerProformas(){
    this.proformasService.getProformas().subscribe(res => {
      this.cotizaciones = res as factura[];
   })
  }


 /*  getParametrizaciones(){
    this.db.collection('/parametrizacionSucursales').valueChanges().subscribe((data:parametrizacionsuc[]) => {
      if(data != null)
        this.parametrizaciones = data

    })
  } */

  /* async getFacturas() {
    await this.db.collection('facturas').snapshotChanges().subscribe((facturas) => {
      facturas.forEach((nt: any) => {
        this.facturas.push(nt.payload.doc.data());
      })
    });;
  }

  async getNotasVentas() {
    await this.db.collection('notas_venta').snapshotChanges().subscribe((notasVenta) => {
      notasVenta.forEach((nt: any) => {
        this.notasVenta.push(nt.payload.doc.data());
      })
    });;
  } */

 /*  async getCotizaciones() {
    await this.db.collection('cotizaciones').snapshotChanges().subscribe((cotizaciones) => {
      cotizaciones.forEach((nt: any) => {
        this.cotizaciones.push(nt.payload.doc.data());
      })
    });;
  }

  async getProductosComprados() {    
    await this.db.collection('productosVendidos').snapshotChanges().subscribe((productosVendidos) => {   
      productosVendidos.forEach((nt: any) => {
        this.productosVendidos.push(nt.payload.doc.data());
      })
    });;

  }
 */

  getCourseFile = (e) => {  
    this.cargarFactura(e.row.data)  
  }
  getCourseFile2 = (e) => {  
    this.cargarNotaVenta(e.row.data)  
  }
  getCourseFile3 = (e) => {  
    this.cargarCotización(e.row.data)  
  }

  cargarFactura(e){
    this.limpiarArregloPFact()
   this.facturas.forEach(element=>{
     if(e.documento_n == element.documento_n){
      this.factura= element
      this.productosVendidos2=this.factura.productosVendidos
     }
   })
   
   this.productosVendidos.forEach(element=>{
     if(element.factura_id== e.documento_n && element.tipoDocumentoVenta=="Factura"){
      this.productosVendidos2.push(element)
     }
   })
   this.parametrizaciones.forEach(element=>{
     console.log("las facturas es "+this.factura.sucursal)
    if(element.sucursal == this.factura.sucursal){
      console.log("sii encontreee")
      this.parametrizacionSucu= element
    }else{
      console.log("no encontre")
    }
  })
   this.tDocumento="Factura"
   this.crearPDF(e)
   this.mostrarDatos()
  }

  //cargar Nota de Venta
  cargarNotaVenta(e){
    this.notasVenta.forEach(element=>{
      if(e.documento_n == element.documento_n){
       this.factura= element
      }
    })
    this.limpiarArregloPFact()
    this.productosVendidos.forEach(element=>{
      if(element.factura_id== e.documento_n && element.tipoDocumentoVenta=="Nota de Venta"){
       this.productosVendidos2.push(element)
      }
    })
    this.parametrizaciones.forEach(element=>{
      if(element.sucursal == this.factura.sucursal){
        this.parametrizacionSucu= element
      }
    })
    this.tDocumento="NOTA DE VENTA 001"
    this.crearPDF(e)
    //this.mostrarDatos()
  }


  //cargar Cotizacion
  cargarCotización(e){
    this.cotizaciones.forEach(element=>{
      if(e.documento_n == element.documento_n){
       this.factura= element
      }
    })
    this.limpiarArregloPFact()
    this.productosVendidos.forEach(element=>{
      if(element.factura_id== e.documento_n && element.tipoDocumentoVenta=="Cotización"){
       this.productosVendidos2.push(element)
      }
    })
    this.parametrizaciones.forEach(element=>{
      if(element.sucursal == this.factura.sucursal){
        this.parametrizacionSucu= element
      }
    })
    this.tDocumento="PROFORMA 000 001"
    this.crearPDF(e)
    this.mostrarDatos()
  }

  

  mostrarDatos(){
    console.log(JSON.stringify(this.factura))
  }

  crearPDF(e){
    var tipoDoc:boolean=false
      if(this.tDocumento == "Factura"){
          const documentDefinition = this.getDocumentDefinition();
          pdfMake.createPdf(documentDefinition).download('Factura '+e.documento_n, function(response) { });
      }else if(this.tDocumento == "NOTA DE VENTA 001"){
        const documentDefinition = this.getDocumentDefinitionNotaVenta();
        pdfMake.createPdf(documentDefinition).download('Nota de Venta '+e.documento_n, function(response) { });
    }else if(this.tDocumento == "PROFORMA 000 001"){
      const documentDefinition = this.getDocumentDefinitionCotizacion();
      pdfMake.createPdf(documentDefinition).download('Proforma '+e.documento_n, function(response) { });
  }
  }

  limpiarArregloPFact(){
    var cont=0
    this.productosVendidos2.forEach(element=>{
      cont++
    })
    console.log("mostrando antes"+this.productosVendidos2.length)
    if(cont>=0){
      this.productosVendidos2.forEach(element=>{
        this.productosVendidos2.splice(0)
      })
    }
  }

  onExporting (e) {
    e.component.beginUpdate();
    e.component.columnOption("cliente.ruc", "visible", true);
    e.component.columnOption("tipo_venta", "visible", true);
    e.component.columnOption("cotizacion", "visible", true);
    e.component.columnOption("tipo_cliente", "visible", true);
    e.component.columnOption("username", "visible", true);
    e.component.columnOption("coste_transportea", "visible", true);
    e.component.columnOption("observaciones", "visible", true); 
  };
  onExported (e) {
    e.component.columnOption("cliente.ruc", "visible", false);
    e.component.columnOption("tipo_venta", "visible", false);
    e.component.columnOption("cotizacion", "visible", false);
    e.component.columnOption("tipo_cliente", "visible", false);
    e.component.columnOption("username", "visible", false);
    e.component.columnOption("coste_transportea", "visible", false);
    e.component.columnOption("observaciones", "visible", false);
    e.component.endUpdate();
  }

  calcularValoresFactura(){
    //let costo=50;
   this.subtotal1=(((this.factura.total+this.factura.coste_transporte)-this.factura.coste_transporte)/1.12)+this.factura.coste_transporte
   this.Sdescuento=this.factura.subtotalF1-this.factura.subtotalF2
   this.subtotal2=this.subtotal1-this.Sdescuento
   this.sIva0= this.factura.coste_transporte;
   this.sIva12=this.subtotal2-this.sIva0
   this.iva= this.sIva12*0.12
  }

  setearNFactura(){
    let nf=this.factura.documento_n
    //this.variab= this.factura.documento_n
    //alert("escogi el "+nf)
    let num=('' + nf).length
    console.log("el numero es"+num)
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
          break;    
      default:
    }
   }



   getDocumentDefinitionCotizacion() {
    //var fecha2 = this.datePipe.transform(new Date(),"dd-MM-yyyy");
  //console.log("holaaaa"+fecha2); 
    this.setearNFactura()
    this.calcularValoresFactura()
    sessionStorage.setItem('resume', JSON.stringify("jj"));
    let tipoDocumento="Factura";
    return {
      pageSize: 'A4',
      content: [
        {
          columns: [{
          text:"hola",
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
          
          //alignment: 'center'
        }, {
    
        },
        
        {
          columns: [
            
            [
            {
              text: "Fecha de impresión: "+this.factura.fecha, fontSize:10
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
              columns: [{
              width:300,
              text: " "+this.tDocumento,
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
              text: "Fecha de Autorización "+this.parametrizacionSucu.fecha,
            },
            {
              width:215,
              text: "Vendedor: "+this.factura.username,
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
                          ''+this.factura.cliente.direccion,
                          ''+this.factura.cliente.direccion,
                          ''+this.factura.cliente.celular,
                          ''+this.factura.fecha2,
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
       
        
        this.getProductosVendidosCotizacion(this.productosVendidos2),
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
          //absolutePosition: {x: 40, y: 600},
          columns: [{

            type: 'none',
            style: 'tableExample',
                    table: {
                      widths: [250],
                      heights:70,
                      body: [
                        [
                          {text: 'Observaciones:  ' +this.factura.observaciones+ " / "},
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
          
          /* {
            text: 'Est',
            style: 'tableHeader'
          }, */
          ],
          
          ...productos.map(ed =>{
            return [ { text: ed.cantidad, alignment: 'center' },{text:ed.producto.UNIDAD,fontSize:8,alignment:"center"},ed.producto.nombre_comercial, {text:ed.precio_venta.toFixed(2), alignment:"center"}, {text:ed.descuento, alignment:"center"}, {text:ed.total.toFixed(2), alignment:"right",style:"totales2"}];
            
          }),
          /* [
            { text: " -- ", alignment: 'center' }, "Servicios de Transporte", { text: " -- ", alignment: 'center' }, { text: " -- ", alignment: 'center' }, {text:this.factura.coste_transporte.toFixed(2), alignment:"right",style:"totales2"} 
          ] */
          
        ]
      }
    };
  }


  getDocumentDefinition() {
    this.setearNFactura()
    this.calcularValoresFactura()
    sessionStorage.setItem('resume', JSON.stringify("jj"));
    let tipoDocumento="Factura";
    return {
      pageSize: 'A4',
      content: [
        {
          columns: [{
           text:"hola",
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
          
          //alignment: 'center'
        }, {

     
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
              text: "Fecha de impresión: "+this.factura.fecha, fontSize:10
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
              text: "FACTURA 001-001-000 ",
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
              text: "Fecha de Autorización "+this.parametrizacionSucu.fecha,
            },
            {
              width:215,
              text: "Vendedor: "+this.factura.username,
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
                          "Teléfonos"
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
                          ''+this.factura.cliente.direccion,
                          ''+this.factura.cliente.direccion,
                          ''+this.factura.cliente.celular,
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
       
        
        this.getProductosVendidos(this.productosVendidos2),
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
          //absolutePosition: {x: 40, y: 600},
          columns: [{

            type: 'none',
            ul: [
                  {
                    style: 'tableExample2',
                    table: {
                      widths: [250],
                      heights:70,
                      body: [
                        [
                          {text: 'Observaciones: '+this.factura.observaciones+ " / "},
                        ]
                      ]
                    },

                  },{
                    style: 'tableExample3',
                  
                    table: {
                      widths: ["*"],
                      heights:40,
                      body: [
                        [
                          {
                            stack: [
                              {
                                type: 'none',
                                
                                fontSize: 8,
                                ul: [
                                  'Nota: despues de 30 dias no se aceptan reclamos ni devoluciones',
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

                  }
            ]
            
            
        },
        {
          //Desde aqui comienza los datos del cliente
          style: 'tableExample',
         
          table: {
            widths: [125,100],
            body: [
              [ { text: 'Subtotal', bold: true ,style: "detalleTotales"}, {text: this.factura.subtotalF1.toFixed(2), style:"totales" }],
              [ { text: 'Otros descuentos', bold: true ,style: "detalleTotales"}, {text:this.Sdescuento.toFixed(2), style:"totales" } ],
              [ { text: 'Subtotal', bold: true, style: "detalleTotales" }, {text: this.factura.subtotalF2.toFixed(2), style:"totales" } ],
              [ { text: 'Tarifa 0', bold: true , style: "detalleTotales" }, {text:this.sIva0.toFixed(2), style:"totales" } ],
              [ { text: 'Tarifa 12', bold: true ,style: "detalleTotales"}, {text: this.factura.subtotalF2.toFixed(2) , style:"totales" }],
              [ { text: '12% IVA', bold: true ,style: "detalleTotales"}, {text: this.factura.totalIva.toFixed(2), style:"totales" } ],
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



  getDocumentDefinitionNotaVenta() {
    //var fecha2 = this.datePipe.transform(new Date(),"dd-MM-yyyy");
  //console.log("holaaaa"+fecha2); 
    this.setearNFactura()
    this.calcularValoresFactura()
    sessionStorage.setItem('resume', JSON.stringify("jj"));
    let tipoDocumento="Factura";
    return {
      pageSize: 'A4',
      content: [
        {
          columns: [{
           text:"hola",
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
          
          //alignment: 'center'
        }, {
    
        },
        
        {
          columns: [
            
            [
            {
              text: "Fecha de impresión: "+this.factura.fecha, fontSize:10
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
              columns: [{
              width:300,
              text: " "+this.tDocumento,
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
              text: "Fecha de Autorización "+this.parametrizacionSucu.fecha,
            },
            {
              width:215,
              text: "Vendedor: "+this.factura.username,
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
                          "Teléfonos"
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
                          ''+this.factura.cliente.direccion,
                          ''+this.factura.cliente.direccion,
                          ''+this.factura.cliente.celular,
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
       
        
        this.getProductosVendidos(this.productosVendidos2),
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
          //absolutePosition: {x: 40, y: 600},
          columns: [{

            type: 'none',
            style: 'tableExample',
                    table: {
                      widths: [250],
                      heights:70,
                      body: [
                        [
                          {text: 'Observaciones:  ' +this.factura.observaciones+ " / "
                        },
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


  getProductosVendidos(productos: venta[]){
    let productos2:venta[]=[]
    productos.forEach(element=>{
      if(element.entregar==true){
          element.tipoDocumentoVenta="E"
      }else{
        element.tipoDocumentoVenta="P"
      }
      productos2.push(element)
    })
    return {
      table: {
        widths: ["8%","6%","53%","9%","7%","13%","4%"],
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
          
          {
            text: 'Est',
            style: 'tableHeader', 
            alignment: 'center'
          }
          ],
          
          ...productos2.map(ed =>{
            return [ { text: ed.cantidad, alignment: 'center' },{text:ed.producto.UNIDAD,fontSize:8,alignment:"center"},ed.producto.PRODUCTO, {text:ed.precio_venta.toFixed(2), alignment:"center"}, {text:ed.descuento, alignment:"center"}, {text:ed.total.toFixed(2), alignment:"right",style:"totales2"},
            {text:ed.tipoDocumentoVenta, alignment:"center",style:"totales2"}];
            
          }),
        ]
      }
    };
  }



  

}
