import { Component, OnInit } from '@angular/core';
import { anulaciones } from './anulaciones';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { element } from 'protractor';
import { OrdenDeCompra } from '../compras/compra';
import { CONNREFUSED } from 'dns';
import pdfMake from 'pdfmake/build/pdfmake';
import { FacturaProveedor } from '../orden-compra/ordencompra';
import { ProductoDetalleCompra } from '../producto/producto';
import Swal from 'sweetalert2';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { factura, venta, producto, contadoresDocumentos } from '../ventas/venta';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { eventsHandler } from 'devextreme/events';
import { transaccion } from '../transacciones/transacciones';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { OrdenesCompraService } from 'src/app/servicios/ordenes-compra.service';
import { TransaccionesService } from 'src/app/servicios/transacciones.service';
import { FacturasService } from 'src/app/servicios/facturas.service';
import { ProformasService } from 'src/app/servicios/proformas.service';
import { NotasVentasService } from 'src/app/servicios/notas-ventas.service';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';

@Component({
  selector: 'app-anulaciones',
  templateUrl: './anulaciones.component.html',
  styleUrls: ['./anulaciones.component.scss']
})
export class AnulacionesComponent implements OnInit {
  num_orden:number=0
  motivo:string
  anulacion:anulaciones

  estadoD:string
  nsolicitudOrden:number
  nAnulacion:number=0
  ordenesCompra:OrdenDeCompra[]=[]
  ordenesCompraPendientes:OrdenDeCompra[]=[]
  ordenesCompraPendientesAnulacion:OrdenDeCompra[]=[]

  ordenDeCompra2 : OrdenDeCompra;
  ordenDeCompra3 : OrdenDeCompra;
  facturaProveedor: FacturaProveedor;
  factProvPagos: FacturaProveedor[] = []
  popupVisible = false;
  popupVisible2 = false;
  productosComprados: ProductoDetalleCompra[] = []
  numOrden:number=0
  productosComprados2: ProductoDetalleCompra[] = []
  productosComprados3: ProductoDetalleCompra[] = []
  productosComprados4: ProductoDetalleCompra[] = []

  parametrizaciones:parametrizacionsuc[]=[]
  parametrizacionSucu:parametrizacionsuc
  menu1: string[] = [
    "Ordenes de Compra",
    "Facturas",
    "Notas de Venta"
  ];
  numeroFactura:string
subtotal:number=0
  subtotal1:number=0
  subtDesc:number=0
  subtMenosDesc:number=0
  subtotalFactura1:number=0
  subtotalFactura2:number=0
  subtotalIva:number=0
  subtotalGeneral2:number=0
  subtCostosGenerales:number=0
  subtOtrsoDesc:number=0
  totalsuma:number=0
  totalOrden:number=0
  estadoOrden:string=""
  totalsuma2:number=0
  
  facturas:factura[]=[]
  facturasAP:factura[]=[]
  facturasPEN:factura[]=[]
  facturasELI:factura[]=[]
  notasVenta:factura[]=[]
  notasVentaAP:factura[]=[]
  notasVentaPEN:factura[]=[]
  notasVentaELI:factura[]=[]
  cotizaciones:factura[]=[]
  productos:producto[]=[]
  factura:factura
  productosVendidos:venta[]=[]
  productosVendidos2:venta[]=[]
  tDocumento:string
  Sdescuento:number=0
  subtotal2:number=0
  sIva0:number=0
  sIva12:number=0
  iva:number=0
  transacciones: transaccion[]=[]
  contadores:contadoresDocumentos[]=[]
  expensesCollection3: AngularFirestoreCollection<transaccion>;
  constructor(public parametrizacionService:ParametrizacionesService,public contadoresService:ContadoresDocumentosService, public notasventaService:NotasVentasService, public facturasService:FacturasService, public proformasService:ProformasService,
    public ordenesService:OrdenesCompraService,public transaccionesService:TransaccionesService, public productoService:ProductoService,) {
    this.anulacion= new anulaciones()
  }

  ngOnInit() {
   /*  this.getOrdenCompra()
    this.getProductosComprados()
    this.getParametrizaciones()
    this.getFacturas()
    this.getNotasVentas()
    this.getCotizaciones()
    this.getPComprados()
    this.getTransacciones()
    this.getProductos() */
    this.traerOrdenesCompra()
    this.traerParametrizaciones()
    this.traerFacturas()
    this.traerNotasVenta()
    this.traerProformas()
    this.traerTransacciones()
    this.traerProductos()
  }


  traerParametrizaciones(){
    this.parametrizacionService.getParametrizacion().subscribe(res => {
      this.parametrizaciones = res as parametrizacionsuc[];
   })
  }

  traerProductos(){
    this.productoService.getProducto().subscribe(res => {
      this.productos = res as producto[];
   })
  }

  traerOrdenesCompra(){
    this.ordenesService.getOrden().subscribe(res => {
      this.ordenesCompra = res as OrdenDeCompra[];
      this.obtenerOrdenesPendientes()
   })
  }

  traerTransacciones(){
    this.transaccionesService.getTransaccion().subscribe(res => {
      this.transacciones = res as transaccion[];
   })
  }

  traerFacturas(){
    this.facturasService.getFacturas().subscribe(res => {
      this.facturas = res as factura[];
      this.dividirFacturas()
   })
  }

  traerProformas(){
    this.proformasService.getProformas().subscribe(res => {
      this.cotizaciones = res as factura[];
   })
  }

  traerNotasVenta(){
    this.notasventaService.getNotasVentas().subscribe(res => {
      this.notasVenta = res as factura[];
      this.dividirNotasVenta()
   })
  }

  traerContadoresDocumentos(){
    this.contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
      this.asignarIDdocumentos()
   })
  }

  asignarIDdocumentos(){
   // this.ordenDeCompra.documento =this.contadores[0].ordenesCompra_Ndocumento+1
    //this.ordenDeCompra.documento =this.contadores[0].ordenesCompra_Ndocumento+1
  }

  /* getTransacciones(){
    this.db.collection('/transacciones').valueChanges().subscribe((data:transaccion[]) => {
      this.transacciones = data
  
    })
  } */


 /*  async getOrdenCompra() {
    
    await this.db.collection('ordenesDeCompra').snapshotChanges().subscribe((ordenes) => {
      new Promise<any>((resolve, reject) => {
        ordenes.forEach((nt: any) => {
          this.ordenesCompra.push(nt.payload.doc.data());
         
        })
        this.obtenerOrdenesPendientes()
        //alert(this.ordenesCompra.length)
      })    
    });;
   
  } */

 /*  async getFacturas() {
    await this.db.collection('facturas').snapshotChanges().subscribe((facturas) => {
      new Promise<any>((resolve, reject) => {
        facturas.forEach((nt: any) => {
          this.facturas.push(nt.payload.doc.data());
        })
      })
      this.dividirFacturas()
    });;
  }

  async getNotasVentas() {
    await this.db.collection('notas_venta').snapshotChanges().subscribe((notasVenta) => {
      new Promise<any>((resolve, reject) => {
      notasVenta.forEach((nt: any) => {
        this.notasVenta.push(nt.payload.doc.data());
      })
    })
    this.dividirNotasVenta()
    });;
  }

  async getCotizaciones() {
    await this.db.collection('cotizaciones').snapshotChanges().subscribe((cotizaciones) => {
      cotizaciones.forEach((nt: any) => {
        this.cotizaciones.push(nt.payload.doc.data());
      })
    });;
  } */


  /* async getProductosComprados() {    
    await this.db.collection('productosVendidos').snapshotChanges().subscribe((productosVendidos) => {   
      productosVendidos.forEach((nt: any) => {
        this.productosVendidos.push(nt.payload.doc.data());
      })
    });;

  } */

  /* async getProductos() {
    //REVISAR OPTIMIZACION
    await this.db.collection('productos').snapshotChanges().subscribe((productos) => {
      new Promise<any>((resolve, reject) => {
        productos.forEach((nt: any) => {
          this.productos.push(nt.payload.doc.data());
        })
      })
    });;
  } */
 

 /*  async getIDTransacciones() {
    
    await this.db.collection('anulaciones_ID').doc('matriz').snapshotChanges().subscribe((anulaciones) => {
      console.log(anulaciones.payload.data())
      this.nAnulacion = anulaciones.payload.data()['documento_n']+1;    
    });;
  } */

 /*  async getPComprados() {
    
    await this.db.collection('productosComprados').snapshotChanges().subscribe((productoC) => {
      
      productoC.forEach((nt: any) => {
        this.productosComprados.push(nt.payload.doc.data());
       
      })
      console.log("kjkj"+productoC.length)
    });;

  } */

  /* getParametrizaciones(){
    this.db.collection('/parametrizacionSucursales').valueChanges().subscribe((data:parametrizacionsuc[]) => {
      if(data != null)
        this.parametrizaciones = data

    })
  } */

  buscarOrden(){
    console.log("estado")
    this.ordenesCompra.forEach(element=>{
      if(this.num_orden == element.n_orden){
        element.estadoOrden=="PENDIENTE"
        this.estadoOrden=element.estadoOrden
        this.nsolicitudOrden=element.documento
      }
    })
    console.log("estado es "+this.estadoOrden)
    if(this.estadoOrden == "PENDIENTE"){
      //alert("NO INGRESA")
      this.estadoD= "OK"
     
    }else{
      this.estadoD= "ORDEN EN PROCESO"
    }
  }

  obtenerOrdenesPendientes(){
    this.ordenesCompra.forEach(element=>{
      if(element.estadoOrden=="PENDIENTE"){
        this.ordenesCompraPendientes.push(element)
      }else if(element.estadoOrden=="Pendiente-Anulacion"){
        this.ordenesCompraPendientesAnulacion.push(element)
      }
    })
  }

 /*  guardarAnulacion(){
    this.anulacion.id=this.nAnulacion
    
    new Promise<any>((resolve, reject) => {
      this.db.collection('/anulaciones').doc(this.nAnulacion+"").set({...Object.assign({},this.anulacion )}) ;
      this.db.collection('/anulaciones_ID').doc("matriz").update({"documento_n" : this.anulacion.id});
      this.db.collection('/ordenesDeCompra').doc(this.nsolicitudOrden+"").update({"estadoOrden" : "Pendiente_Anulacion","msjGeneral":this.motivo});
    })
    alert("Termine")
   
  } */


  anularOrden = (e) => {  
    this.actualizarOrdenRec(e.row.data) 
  }

  rechazarAnulFact= (e) => {  
    this.rechazarFactAnu(e.row.data) 
  }

  eliminarFactura= (e) => {  
    this.eliminarFact(e.row.data) 
  }

  eliminarNotaVenta= (e) => {  
    this.eliminarNot(e.row.data) 
  }

  anularOrden2 = (e) => {  
    this.actualizarOrdenRec2(e.row.data) 
  }
  anularFactura= (e) => {  
    this.actualizarFact(e.row.data) 
  }

  anularNotaVenta= (e) => {  
    this.actualizarNotV(e.row.data) 
  }

  getCourseFile = (e) => {
    this.cargarOrdenCompra(e.row.data)  
  }

  getCourseFile4 = (e) => {  
    this.cargarFactura(e.row.data)  
  }
  getCourseFile2 = (e) => {  
    this.cargarNotaVenta(e.row.data)  
  }
  getCourseFile3 = (e) => {  
    this.cargarCotización(e.row.data)  
  }


  dividirFacturas(){
    //alert("si entroo" + this.facturas.length)
    this.facturas.forEach(element=>{
      if(element.estado == "ELIMINADA"){
        this.facturasELI.push(element)
      }else if(element.estado == "PENDIENTE"){
        this.facturasPEN.push(element)
      }else if(element.estado == "CONTABILIZADA"){
        this.facturasAP.push(element)
      }
    })

  }

  dividirNotasVenta(){
    this.notasVenta.forEach(element=>{
      if(element.estado == "ELIMINADA"){
        this.notasVentaELI.push(element)
      }else if(element.estado == "PENDIENTE"){
        this.notasVentaPEN.push(element)
      }else if(element.estado == "CONTABILIZADA"){
        this.notasVentaAP.push(element)
      }
    })
  }


  
  cargarFactura(e){
    this.limpiarArregloPFact()
    this.facturas.forEach(element=>{
      if(e.documento_n == element.documento_n){
       this.factura= element
       this.productosVendidos2=element.productosVendidos
      }
    })
    
    /* this.productosVendidos.forEach(element=>{
      if(element.factura_id== e.documento_n && element.tipoDocumentoVenta=="Factura"){
       this.productosVendidos2.push(element)
      }
    }) */

    this.parametrizaciones.forEach(element=>{
       if(element.sucursal == this.factura.sucursal){
         this.parametrizacionSucu= element
       }
     })
    this.tDocumento="Factura"
    this.crearPDF2(e)
   // this.mostrarDatos()
   }
 
   //cargar Nota de Venta
   cargarNotaVenta(e){
    this.limpiarArregloPFact()
     console.log("entre aqui a buscar las notas de venta")
     this.notasVenta.forEach(element=>{
       if(e.documento_n == element.documento_n){
        this.factura= element
        this.productosVendidos2=element.productosVendidos
       
       }
     })
     
    
     console.log("ss "+this.productosVendidos.length)
     /* this.productosVendidos.forEach(element=>{
       if(element.factura_id== e.documento_n && element.tipoDocumentoVenta=="Nota de Venta"){
        this.productosVendidos2.push(element)
        console.log("ddd "+JSON.stringify(element))
       }
     }) */
     this.parametrizaciones.forEach(element=>{
      if(element.sucursal == this.factura.sucursal){
        this.parametrizacionSucu= element
        console.log("asigne "+JSON.stringify(this.parametrizacionSucu))
      }
    })
     this.tDocumento="NOTA DE VENTA 001"
     this.crearPDF2(e)
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
     this.tDocumento="PROFORMA 000 001"
     this.crearPDF2(e)
     //this.mostrarDatos()
   }

   crearPDF2(e){
    var tipoDoc:boolean=false
      if(this.tDocumento == "Factura"){
          const documentDefinition = this.getDocumentDefinition2();
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
    e.component.columnOption("tipo_cliente", "visible", true);
    e.component.columnOption("coste_transportea", "visible", true);
    e.component.columnOption("observaciones", "visible", true); 
  };
  onExported (e) {
    e.component.columnOption("cliente.ruc", "visible", false);
    e.component.columnOption("tipo_venta", "visible", false);
    e.component.columnOption("tipo_cliente", "visible", false);
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

  setearNFactura2(){
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




   getDocumentDefinition2() {
    this.setearNFactura2()
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
           /*  {
              text: "Fecha de impresión: "+this.factura.fecha, fontSize:10
            }, */
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

    this.setearNFactura2()
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
            /* {
              text: "Fecha de impresión: "+this.factura.fecha, fontSize:10
            }, */
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
        widths: ["8%","6%","50%","9%","10%","13%","4%"],
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



   getDocumentDefinitionCotizacion() {
    //var fecha2 = this.datePipe.transform(new Date(),"dd-MM-yyyy");
  //console.log("holaaaa"+fecha2); 
    this.setearNFactura2()
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
            /* {
              text: "Fecha de impresión: "+this.factura.fecha, fontSize:10
            }, */
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

  actualizarNotV(e){
    Swal.fire({
      title: 'Anular Nota de Venta',
      text: "Se anulará la nota de venta #"+e.documento_n,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        //this.db.collection('/notas_venta').doc(e.documento_n+"").update({"estado":"PENDIENTE"}).then(res => {  }, err => alert(err));  
        this.notasventaService.updateNotasVentaEstado(e,"PENDIENTE").subscribe(
          res => {
            console.log(res + "entre por si");this.coorecto()
          },err => {alert("error")})
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  coorecto(){
    Swal.fire({
      title: 'Correcto',
      text: 'Un administrador aprobará su solicitud',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }


  actualizarFact(e){
    Swal.fire({
      title: 'Anular Factura',
      text: "Se anulará la factura #"+e.documento_n,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
       /*  this.db.collection('/facturas').doc(e.documento_n+"").update({"estado":"PENDIENTE"}).then(res => {  Swal.fire({
          title: 'Correcto',
          text: 'Un administrador aprobará su solicitud',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
        })}, err => alert(err)); */  
        this.facturasService.updateFacturasEstado(e,"PENDIENTE").subscribe(
          res => {
            console.log(res + "entre por si");this.coorecto()
          },err => {alert("error")})
       
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  rechazarFactAnu(e){
    Swal.fire({
      title: 'Rechazar Anulación Factura',
      text: "Rechzar proceso de anulación #"+e.documento_n,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        /* this.db.collection('/facturas').doc(e.documento_n+"").update({"estado":"FACTURADA"}).then(res => {  Swal.fire({
          title: 'Correcto',
          text: 'Se realizó su proceso con éxito',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
        })}, err => alert(err)); */  
        this.facturasService.updateFacturasEstado(e,"PENDIENTE").subscribe(
          res => {
            console.log(res + "entre por si");this.coorecto()
          },err => {alert("error")})
       
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }


  mensajeConf(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se realizó su proceso con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }
  
  eliminarFact(e){
    Swal.fire({
      title: 'Eliminar Factura',
      text: "Eliminar factura #"+e.documento_n,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.mostrarMensaje()
        //this.db.collection('/facturas').doc(e.documento_n+"").update({"estado":"ELIMINADA"}).then(res => { this.actualizarProductos(e)}, err => alert(err));  
        this.facturasService.updateFacturasEstado(e,"ELIMINADA").subscribe(
          res => {
            console.log(res + "entre por si");this.actualizarProductos(e)
          },err => {alert("error")})
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  eliminarNot(e){
    Swal.fire({
      title: 'Eliminar Nota Venta',
      text: "Eliminar nota de venta #"+e.documento_n,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.mostrarMensaje()
        //this.db.collection('/notas_venta').doc(e.documento_n+"").update({"estado":"ELIMINADA"}).then(res => { this.actualizarProductos2(e)}, err => alert(err));  
        this.notasventaService.updateNotasVentaEstado(e,"ELIMINADA").subscribe(
          res => {
            console.log(res + "entre por si");this.actualizarProductos2(e)
          },err => {alert("error")})
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }
  eliminarTransacciones(num:number){
    this.transacciones.forEach(element=>{
      if(element.documento== num+"" && element.tipo_transaccion=="venta-fact"){
        this.transaccionesService.deleteTransaccion(element).subscribe( res => {console.log(res + "termine1");}, err => {alert("error")})
     /* console.log("entre con el "+element.idTransaccion)
       this.expensesCollection3 = this.db.collection('/transacciones', ref => ref.where('idTransaccion', '==', element.idTransaccion));
       this.expensesCollection3.get().toPromise().then(function(querySnapshot) {
         querySnapshot.forEach(function(doc) {
           doc.ref.delete();
         });
       }); */
      }
    })
   }

  eliminarTransacciones2(num:number){
    this.transacciones.forEach(element=>{
      if(element.documento== num+"" && element.tipo_transaccion=="venta-not"){
        this.transaccionesService.deleteTransaccion(element).subscribe( res => {console.log(res + "termine1");}, err => {alert("error")})
    /*  console.log("entre con el "+element.idTransaccion)
       this.expensesCollection3 = this.db.collection('/transacciones', ref => ref.where('idTransaccion', '==', element.idTransaccion));
       this.expensesCollection3.get().toPromise().then(function(querySnapshot) {
         querySnapshot.forEach(function(doc) {
           doc.ref.delete();
         });
       }); */
      }
    })
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

  actualizarProductos(e){  
    this.eliminarTransacciones(e.documento_n)
    console.log("entre a actualizar")
     var sumaProductos =0
     var num1:number=0
     var num2:number=0
     var num3:number=0
     var cont2ing=0
      var contIng:number=0
      var entre:boolean=true     
      this.facturas.forEach(element=>{
        if(e.documento_n== element.documento_n){
          this.productosVendidos2=element.productosVendidos
        }
      })
      /* this.productosVendidos.forEach(element=>{
        if(element.factura_id== e.documento_n && element.tipoDocumentoVenta=="Factura"){
         this.productosVendidos2.push(element)
         console.log("LLLL "+JSON.stringify(element))
        }
      }) */
      new Promise<any>((resolve, reject) => {
        this.productosVendidos2.forEach(element=>{
          this.productos.forEach(elemento1=>{
            if(elemento1.PRODUCTO == element.producto.PRODUCTO){
             // contIng=0
             switch (e.sucursal) {
              case "matriz":
                num1=parseInt(element.cantidad.toFixed(0))
                num2=elemento1.sucursal1
                sumaProductos = Number(num2)+Number(num1)
                console.log("entre por aqui a sumar "+ sumaProductos + "de "+element.producto.PRODUCTO)
                break;
              case "sucursal1":
                num1=parseInt(element.cantidad.toFixed(0))
                num2=elemento1.sucursal2
                sumaProductos =Number(num2)+Number(num1)
                break;
              case "sucursal2":
                num1=parseInt(element.cantidad.toFixed(0))
                num2=elemento1.sucursal3
                sumaProductos =Number(num2)+Number(num1)
                  break;
              default:
            }
            }
         })
         if(entre){
          switch (e.sucursal) {
            case "matriz":
              //this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal1" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err)); 
              element.producto.sucursal1=sumaProductos
              this.productoService.updateProductoSucursal1(element.producto).subscribe( res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => {alert("error")})
              break;
            case "sucursal1":
              //this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal2" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));
              element.producto.sucursal2=sumaProductos
              this.productoService.updateProductoSucursal2(element.producto).subscribe( res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => {alert("error")})
              break;
            case "sucursal2":
              //this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal3" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));
              element.producto.sucursal3=sumaProductos
              this.productoService.updateProductoSucursal3(element.producto).subscribe( res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => {alert("error")})
              break;
            default: 
          
          //his.db.collection('/productos').doc(element.producto.PRODUCTO).update({"cantidad" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));   
         }
        }
        })
      })
       
    }

    actualizarProductos2(e){  
      this.eliminarTransacciones2(e.documento_n)
      console.log("entre a actualizar")
       var sumaProductos =0
       var num1:number=0
       var num2:number=0
       var num3:number=0
       var cont2ing=0
        var contIng:number=0
        var entre:boolean=true     
        this.notasVenta.forEach(element=>{
          if(e._id == element._id){
              this.productosVendidos2 = element.productosVendidos
          }
        })
        /* this.productosVendidos.forEach(element=>{
          if(element.factura_id== e.documento_n && element.tipoDocumentoVenta=="Nota de Venta"){
           this.productosVendidos2.push(element)
           console.log("LLLL "+JSON.stringify(element))
          }
        }) */
        //alert("hayyy "+this.productosVendidos2.length)
        new Promise<any>((resolve, reject) => {
          this.productosVendidos2.forEach(element=>{
            this.productos.forEach(elemento1=>{
              if(elemento1.PRODUCTO == element.producto.PRODUCTO){
               // contIng=0
               switch (e.sucursal) {
                case "matriz":
                  num1=parseInt(element.cantidad.toFixed(0))
                  num2=elemento1.sucursal1
                  sumaProductos = Number(num2)+Number(num1)
                  console.log("entre por aqui a sumar "+ sumaProductos + "de "+element.producto.PRODUCTO)
                  break;
                case "sucursal1":
                  num1=parseInt(element.cantidad.toFixed(0))
                  num2=elemento1.sucursal2
                  sumaProductos =Number(num2)+Number(num1)
                  break;
                case "sucursal2":
                  num1=parseInt(element.cantidad.toFixed(0))
                  num2=elemento1.sucursal3
                  sumaProductos =Number(num2)+Number(num1)
                    break;
                default:
              }
              }
           })
           if(entre){
            switch (e.sucursal) {
              case "matriz":
                //this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal1" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err)); 
                element.producto.sucursal1=sumaProductos
              this.productoService.updateProductoSucursal1(element.producto).subscribe( res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => {alert("error")})
                break;
              case "sucursal1":
                //this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal2" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));
                element.producto.sucursal2=sumaProductos
              this.productoService.updateProductoSucursal2(element.producto).subscribe( res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => {alert("error")})
                break;
              case "sucursal2":
                //this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal3" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));
                element.producto.sucursal3=sumaProductos
              this.productoService.updateProductoSucursal3(element.producto).subscribe( res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => {alert("error")})
                break;
              default: 
            
            //his.db.collection('/productos').doc(element.producto.PRODUCTO).update({"cantidad" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));   
           }
          }
          })
        })
         
      }

    contadorValidaciones2(i:number){
      if(this.productosVendidos2.length==i){
          console.log("recien termine")
          Swal.close()
          Swal.fire({
            title: 'Factura Eliminada',
            text: 'Se ha guardado con éxito',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            window.location.reload()
          })
      }else{
        console.log("no he entrado actualizar"+i)
      }
    }
   

  actualizarOrdenRec2(e){
    Swal.fire({
      title: 'Anular Orden',
      text: "Se anulará la orden #"+e.n_orden,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        //this.db.collection('/ordenesDeCompra').doc(e.documento+"").update({"estado":"Aprobado","estadoOrden":"ANULADO"}).then(res => {  }, err => alert(err));  
        this.ordenesService.updateEstadosOrdenes(e._id,"Aprobado","ANULADO").subscribe( res => {Swal.fire({
          title: 'Correcto',
          text: 'Se anuló con éxito',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
        })}, err => {alert("error")})
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  actualizarOrdenRec(e){
    Swal.fire({
      title: 'Orden #'+e.n_orden,
      text: "Motivo de anulación",
      icon: 'warning',
      input: 'textarea',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        var num:string
        num=e.documento+""
        new Promise<any>((resolve, reject) => {
         // this.db.collection('/ordenesDeCompra').doc(num).update({"estado" :"Aprobado", "msjGeneral":result.value,"estadoOrden":"Pendiente/Anulacion"}).then(res => { this.confirmarM()}, err => alert(err));  
         this.ordenesService.updateOrdenEstadoRechazo2(e._id,"Aprobado",result.value,"Pendiente-Anulacion").subscribe( res => {this.confirmarM()}, err => {alert("error")})
        })
        

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
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
                  Swal.fire({
                      title: 'Orden rechazada',
                      text: 'Se envió su información',
                      icon: 'success',
                      confirmButtonText: 'Ok'
                    }).then((result) => {
                      window.location.reload()
                    })
          }
        })
       
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'error'
        )
      }
    })
   
   
  }

  confirmarM(){
              Swal.close()
              Swal.fire({
                  title: 'Orden rechazada',
                  text: 'Se envió su información',
                  icon: 'success',
                  confirmButtonText: 'Ok'
                }).then((result) => {
                  window.location.reload()
                })
   
  }


  opcionMenu(e){
    var x = document.getElementById("ordenes");
    var y = document.getElementById("facturas");
    var z = document.getElementById("notas");
    switch (e.value) {
      case "Ordenes de Compra":
        x.style.display = "block";
        y.style.display="none";
        z.style.display="none";
       break;

      case "Facturas":
        x.style.display = "none";
        y.style.display="block";
        z.style.display="none";
        break;

      case "Notas de Venta":
          x.style.display = "none";
          y.style.display="none";
          z.style.display="block";
          break;
      default:    
    }       
  }


  cargarOrdenCompra(e: any){
    var cont=0
    this.productosComprados2.forEach(element=>{
      cont++
    })
    console.log("mostrando antes"+this.productosComprados2.length)
    if(cont>=0){
      this.productosComprados2.forEach(element=>{
        this.productosComprados2.splice(0)
      })
      
      console.log("mostrando despues"+this.productosComprados2.length)
    }
  
    var orden_n=e.documento
    this.ordenesCompra.forEach(element=>{
      if(element.documento==orden_n){
        console.log("si encontre...222"+ orden_n)
         this.ordenDeCompra2 = element
         this.productosComprados2=element.productosComprados
         this.numOrden= element.documento
         if(element.n_orden>0){
          this.numOrden= element.n_orden
          //this.textoDes= "ORDEN / COMPRA 001-000"
        }
         
      }     
    })

   /*  this.productosComprados.forEach(element=>{
      if(element.solicitud_n == orden_n){
        this.productosComprados2.push(element)
      }
    }) */

    this.parametrizaciones.forEach(element=>{
      if(element.sucursal == this.ordenDeCompra2.sucursal.nombre){
        this.parametrizacionSucu= element
      }
    })

    console.log("voy a mostrar elementos de la factura detalles "+this.ordenDeCompra2.TotalIva +" total "+ this.ordenDeCompra2.documento )
    console.log("estoy mostrando elementos productos" +this.productosComprados2.length)
    this.cargarValoresFactura()
    this.crearPDF()

  }


  setearNFactura(){
    let nf=this.numOrden
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
          //this.numeroFactura= nf
          break;    
      default:
  }
}

crearPDF(){
  console.log("entre  a creaar PDF")
  const documentDefinition = this.getDocumentDefinition();
  pdfMake.createPdf(documentDefinition).download('Orden/Compra '+this.numOrden, function() {  });
  
}

getDocumentDefinition() {
  //var fecha2 = this.datePipe.transform(new Date(),"dd-MM-yyyy");
//console.log("holaaaa"+fecha2); 
  this.setearNFactura()
  
  sessionStorage.setItem('resume', JSON.stringify("jj"));
  //let tipoDocumento="Factura";
  return {
    pageSize: 'A4',
    content: [
      {
        columns: [{
         text:"jkj",
        width: 100,
        margin: [0, 20, 0, 10],
        },
        {
          
          width:410,
          margin: [0, 20, 0, 10],
          text: "Fecha:   "+this.ordenDeCompra2.fecha,
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
/*           {
            text: "Fecha de impresión: "+this.ordenDeCompra2.fecha, fontSize:10
          }, */
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
            text: "ORDEN / COMPRA 001-000",
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
          //Desde aqui comienza los datos del cliente
          style: 'tableExample',
          table: {
            widths: [130,365],
            body: [
              [
                {
                  stack: [
                    {
                      type: 'none',
                      bold: true,
                      ul: [
                        'Sucursal',
                        'Contacto',
                        "Fecha de entrega",
                        "Lugar de entrega",
                        "Usuario"
                      ]
                    }
                  ]
                },
                [{
                  stack: [
                    {
                      type: 'none',
                      ul: [
                        ''+this.ordenDeCompra2.sucursal.nombre,
                        ''+this.ordenDeCompra2.sucursal.contacto,
                        ''+this.ordenDeCompra2.fechaEntrega,
                        ''+this.ordenDeCompra2.lugarentrega,
                        ''+this.ordenDeCompra2.usuario,
                      ]
                    }
                  ]
                },
                ],
               
              ]
            ]
          }
          },

          //aqui termina{}
          {
            text:"Datos del Proveedor",alignment:"center",style:"textoPro"
          },
          {
            //Desde aqui comienza los datos del cliente
            style: 'tableExample',
            table: {
              widths: [130,365],
              body: [
                [
                  {
                    stack: [
                      {
                        type: 'none',
                        bold: true,
                        ul: [
                          'Proveedor',
                          'Contacto',
                          "Dirección",
                          "Teléfonos",
                          "Condición/Pago"
                        ],
                      },
                      
                    ]
                  },
                  [{
                    stack: [
                      {
                        type: 'none',
                        ul: [
                          ''+this.ordenDeCompra2.proveedor.nombre_proveedor,
                          ''+this.ordenDeCompra2.proveedor.contacto,
                          ''+this.ordenDeCompra2.proveedor.direccion,
                          ''+this.ordenDeCompra2.proveedor.celular,
                          ''+this.ordenDeCompra2.condpago,
                        ]
                      },
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
     
      
      this.getProductosVendidos2(this.productosComprados2),
      {
        //espacio en blanco despues de detalle de productos
        text: " ",
      },
     
      {
        //absolutePosition: {x: 40, y: 600},
        columns: [{

          type: 'none',
          ul: [
                {
                  style: 'tableExample2',
                  table: {
                    widths: [250],
                    heights:105,
                    body: [
                      [
                        {text: 'Observaciones: '+this.ordenDeCompra2.observaciones},
                      ]
                    ]
                  },

                },{
                  style: 'tableExample3',
                
                  table: {
                    widths: ["*"],
                    heights:70,
                    body: [
                      [
                        {
                          stack: [
                            {
                              type: 'none',
                              
                              fontSize: 8,
                              ul: [
                                
                                ' ',
                                ' ',
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

                },
          ]
          
          
      },
      {
       
        style: 'tableExample',
       
        table: {
          widths: [125,100],
          body: [
            [ { text: 'Subtotal', bold: true ,style: "detalleTotales"}, {text:this.ordenDeCompra2.subtDetalles2.toFixed(2), style:"totales" }],
            [ { text: 'Descuento', bold: true ,style: "detalleTotales"}, {text:this.subtMenosDesc.toFixed(2), style:"totales" }],
            [ { text: 'Subt.Desc', bold: true ,style: "detalleTotales"}, {text:this.ordenDeCompra2.subtotalDetalles.toFixed(2), style:"totales" }],
            [ { text: 'Otros desc.(%)', bold: true , style: "detalleTotales" }, {text:this.ordenDeCompra2.otrosDescuentosGen +" %", style:"totales" } ],              
            [ { text: 'Otros Descuentos', bold: true ,style: "detalleTotales"}, {text:this.subtOtrsoDesc.toFixed(2) , style:"totales" }],
            [ { text: 'Subtotal 2', bold: true ,style: "detalleTotales"}, {text:this.subtotalGeneral2.toFixed(2), style:"totales" }],             
            [ { text: 'Costos Seguro', bold: true, style: "detalleTotales" }, {text:this.subtCostosGenerales.toFixed(2), style:"totales" } ],
            [ { text: 'Iva', bold: true ,style: "detalleTotales"}, {text:this.ordenDeCompra2.TotalIva.toFixed(2), style:"totales" } ],
            [ { text: 'Cost/Unit/Trans.', bold: true ,style: "detalleTotales"}, {text:this.ordenDeCompra2.costeUnitaTransport.toFixed(2), style:"totales" } ],
            [ { text: 'Total', bold: true, style: "detalleTotales" }, {text:this.ordenDeCompra2.total.toFixed(2), style:"totales" } ]
          ]
        }
        },
      ]
      },
      this.getDatosFooter2(),
     
      
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
        textoPro:{
          bold: true,
          margin: [0, -12, 0, -5]
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

cargarValoresFactura(){
   

  let products=0
  this.productosComprados2.forEach(element=>{
      products=element.total+products
  })

  let subtotal2=0
  this.subtotalFactura1=this.ordenDeCompra2.subtotal/1.12
  //this.subtotalFactura2=products/1.12
 // console.log("subt "+this.subtotalFactura2)
  console.log("total "+this.ordenDeCompra2.total)
  //console.log("subt "+this.subtotalFactura2)
  this.subtotal = this.ordenDeCompra2.total +this.ordenDeCompra2.costeUnitaTransport+this.ordenDeCompra2.otrosCostosGen
  this.subtotal1 =this.subtotal
  this.subtMenosDesc=this.ordenDeCompra2.subtotalDetalles-this.ordenDeCompra2.subtDetalles2
  //this.subtDesc= 
  subtotal2= ((this.ordenDeCompra2.otrosDescuentosGen/100)*this.ordenDeCompra2.subtotalDetalles)
  this.subtotalGeneral2= this.ordenDeCompra2.subtotalDetalles-subtotal2
  
  this.subtCostosGenerales=this.ordenDeCompra2.otrosCostosGen/1.12
  this.subtotalIva=(this.subtCostosGenerales+this.subtotalGeneral2)*0.12
  this.subtOtrsoDesc=subtotal2
   
  //desde aqui comienza los totales
  this.subtotal1 =this.subtotal/1.12

}



getProductosVendidos2(productos: ProductoDetalleCompra[]) {
  return {
    table: {
      widths: ["10%","56%","10%","11%","13%"],
      alignment:'center',
      body: [
        
        [{
          text: 'Cantidad',
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
          return [ { text: ed.cantidad, alignment: 'center' },ed.nombreComercial.PRODUCTO, {text:ed.precio_compra.toFixed(2), alignment:"center"}, {text:ed.desct, alignment:"center"}, {text:ed.total.toFixed(2), alignment:"right",style:"totales2"}];
          
        }),
        /* [
          { text: " -- ", alignment: 'center' }, "Servicios de Transporte", { text: " -- ", alignment: 'center' }, { text: " -- ", alignment: 'center' }, {text:this.factura.coste_transporte.toFixed(2), alignment:"right",style:"totales2"} 
        ] */
        
      ]
    }
  };
}


getOtrosValores2() {
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
          text: ' '+this.ordenDeCompra2.costeUnitaTransport,
         
          alignment: 'center'
        },
        ],
        
      ]
    }
  };
}



getDatosFooter2() {
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


}
