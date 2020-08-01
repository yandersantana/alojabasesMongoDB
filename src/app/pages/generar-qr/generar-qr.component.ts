import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/servicios/producto.service';
import { producto } from '../ventas/venta';
import pdfMake from 'pdfmake/build/pdfmake';

@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.component.html',
  styleUrls: ['./generar-qr.component.scss']
})
export class GenerarQRComponent implements OnInit {

  tiposCodigos: string[] = [
    "Producto Unitario",
    "Grupo de Productos"
  ];

  productosActivos:producto[]=[]
  nombre_producto:string
  cantidadPiezas:number
  m2Caja:number

  constructor(public productoService:ProductoService) { }

  ngOnInit() {
    this.traerProductos()
  }


  traerProductos(){
    this.productoService.getProductosActivos().subscribe(res => {
      this.productosActivos = res as producto[]; 
   })
  }

  obtenerDatosDeProductoParaUnDetalle(){
    this.productosActivos.forEach(element=>{
      if(element.PRODUCTO == this.nombre_producto){
        this.cantidadPiezas= element.P_CAJA
        this.m2Caja= element.M2
      }
    })

  }


  opcionMenu(e){
    var x = document.getElementById("op1");
    var y = document.getElementById("op2");

    switch (e.value) {
      case "De cajas a m2":
        x.style.display = "block";
        y.style.display="none";
       break;

      case "De m2 a cajas":
        x.style.display = "none";
        y.style.display="block";
        break;
      default:    
    }     
  }

  crearPDF(){
    console.log("entre  a creaar PDF")

    const documentDefinition = this.getDocumentDefinition();

      pdfMake.createPdf(documentDefinition).download('Solicitud/Compra ', function() {  });
    
  }



  getDocumentDefinition() {
    sessionStorage.setItem('resume', JSON.stringify("jj"));
    return {
      pageSize: 'A4',
      content: [
  
        this.getProductosVendidos(this.productosActivos),

        {
          text:"Códigos QR",
          style: 'texto6'
        },
      
        
      ],
      footer: function (currentPage, pageCount) {
        return {
          
          table: {
            body: [
              
              [],
            ]
          },
          layout: 'noBorders'
        };
      }
      , pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
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


  getProductosVendidos(productos: producto[]) {
    return {
      columns: [
        {
          width: 200,
           table: {
            widths: ["35%","65%"],
            alignment:'center',
            body: [
              ...productos.map(ed =>{
                return [ { qr: ed.PRODUCTO, fit: '70',margin: [20, 15, 0, 15] },
                {	type: 'none',
                margin: [0, 15, 20, 15],
                fontSize: 8,
                ol: [
                  ed.PRODUCTO,
                  "Piezas/Caja: "+ed.P_CAJA,
                  "Metros/Caja: "+ed.M2
                ]}];
              }),
            ]
          } ,
          layout: 'lightHorizontalLines',
        },
        {
          // star-sized columns fill the remaining space
          // if there's more than one star-column, available width is divided equally
          width: 200,
          text: 'Second column'
        },
        {
          // fixed width
          width: 100,
          text: 'Third column'
        },
      ],
      /* table: {
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
            text: 'Dto(%)',
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
          
          ...productos.map(ed =>{
            return [ { text: ed.cantidad, alignment: 'center' },{text:ed.producto.UNIDAD,fontSize:8,alignment:"center"},ed.producto.PRODUCTO, {text:ed.precio_venta.toFixed(2), alignment:"center"}, {text:ed.descuento, alignment:"center"}, {text:ed.total.toFixed(2), alignment:"right",style:"totales2"},
            {text:ed.tipoDocumentoVenta, alignment:"center",style:"totales2"}];
            
          }),
          
          
        ]
      } */
    };
  }
}
