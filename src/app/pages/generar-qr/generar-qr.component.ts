import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/servicios/producto.service';
import { producto } from '../ventas/venta';
import pdfMake from 'pdfmake/build/pdfmake';
import { OpcionesCatalogoService } from 'src/app/servicios/opciones-catalogo.service';
import { opcionesCatalogo } from '../catalogo/catalogo';
import { element } from 'protractor';
import { productoqr } from './productoqr';
import Swal from 'sweetalert2';

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
  texto="hola"
  opcionesCatalogo: opcionesCatalogo[]=[]
  arrayClasif: string[]
  arrayUnid: string[]
  productoqr: productoqr[]=[]
  productoqrcol1: productoqr[]=[]
  productoqrcol2: productoqr[]=[]
  productoqrcol3: productoqr[]=[]
  productoind:productoqr

  constructor(public productoService:ProductoService,public opcionesService:OpcionesCatalogoService) { 
    this.productoind = new productoqr()
    this.productoqr.push(this.productoind)
  }

  ngOnInit() {
    this.traerProductos()
    this.traerOpcionesCatalogo()
  }


  traerProductos(){
    this.productoService.getProductosActivos().subscribe(res => {
      this.productosActivos = res as producto[]; 
   })
  }

  traerOpcionesCatalogo(){
    this.opcionesService.getOpciones().subscribe(res => {
      this.opcionesCatalogo = res as opcionesCatalogo[];
      this.llenarCombos()
   })
  }

  llenarCombos(){
    this.opcionesCatalogo.forEach(element=>{
      console.log(JSON.stringify(element))
         this.arrayUnid= element.arrayUnidades
         this.arrayClasif= element.arrayClasificación
    })
  }

  obtenerDatosDeProductoParaUnDetalle(){
    this.limpiarArreglo()
    this.productosActivos.forEach(element=>{
      if(element.PRODUCTO == this.nombre_producto){
        this.cantidadPiezas= element.P_CAJA
        this.m2Caja= element.M2
        this.texto = "http://104.248.14.190:3000/#/info-productos/"+element._id
        this.productoind.url= "http://104.248.14.190:3000/#/info-productos/"+element._id
        this.productoind.nombre_producto= element.PRODUCTO
        this.productoind.piezas_producto= element.P_CAJA
        this.productoind.metros_producto= element.M2
        this.productoqr.push(this.productoind)
        var x = document.getElementById("codigo");
        x.style.display = "block";
      }
    })
  }

  limpiarArreglo(){
    var cont=0
    this.productoqr.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.productoqr.forEach(element=>{
        this.productoqr.splice(0)    
      })
    }
  }

  limpiarArreglo2(){
    var cont=0
    this.productoqrcol1.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.productoqrcol1.forEach(element=>{
        this.productoqrcol1.splice(0)    
      })
    }
  }

  limpiarArreglo3(){
    var cont=0
    this.productoqrcol2.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.productoqrcol2.forEach(element=>{
        this.productoqrcol2.splice(0)    
      })
    }
  }

  limpiarArreglo4(){
    var cont=0
    this.productoqrcol3.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.productoqrcol3.forEach(element=>{
        this.productoqrcol3.splice(0)    
      })
    }
  }

  opcionMenu2(e){
    this.limpiarArreglo()
    this.limpiarArreglo2()
    this.limpiarArreglo3()
    this.limpiarArreglo4()
    this.productosActivos.forEach(element=>{
      if(element.CLASIFICA == e.value){
        this.productoind = new productoqr()
        this.productoind.url= "http://104.248.14.190:3000/#/info-productos/"+element._id
        this.productoind.nombre_producto= element.PRODUCTO
        this.productoind.piezas_producto= element.P_CAJA
        this.productoind.metros_producto= element.M2
        this.productoqr.push(this.productoind)
      }
    })
    var cont=0
    this.productoqr.forEach(element=>{
      cont++
      switch (cont) {
        case 1:
          this.productoqrcol1.push(element)
          break;
        case 2:
          this.productoqrcol2.push(element)
          break;
        case 3:
          this.productoqrcol3.push(element)
          cont=0
          break;
        default:
          break;
      }
    })
    console.log("sssss 1"+this.productoqrcol1.length)
    console.log("sssss 2"+this.productoqrcol2.length)
    console.log("sssss 3"+this.productoqrcol3.length)

   

  }


  opcionMenu(e){
    var x = document.getElementById("op1");
    var y = document.getElementById("op2");

    switch (e.value) {
      case "Producto Unitario":
        x.style.display = "block";
        y.style.display="none";
       break;

      case "Grupo de Productos":
        x.style.display = "none";
        y.style.display="block";
        break;
      default:    
    }     
  }

  crearPDF(){
    console.log("sssssss "+window.location)
      if(this.productoqrcol1[0] == undefined){
        this.mensajeError()
      }else{
        if(this.productoqrcol3[0] == undefined){
          console.log("verda")
          const documentDefinition = this.getDocumentDefinition3();
          pdfMake.createPdf(documentDefinition).download('codigo ', function() {  });
        }else{
          console.log("faalse")
          const documentDefinition = this.getDocumentDefinition();
          pdfMake.createPdf(documentDefinition).download('codigo ', function() {  });
        }
      }
    
  }

  mensajeError(){
    Swal.fire(
      'Error!',
      'No ha seleccionado ningun grupo',
      'error'
    )
  }

  crearPDF2(){
    console.log(this.productoind.url)
    if(this.productoind.url == undefined){
      Swal.fire(
        'Error!',
        'No ha seleccionado ningun producto',
        'error'
      )
    }else{    
        const documentDefinition = this.getDocumentDefinition2();
        pdfMake.createPdf(documentDefinition).download('codigo ', function() {  });
      
      
    }
  }



  getDocumentDefinition() {
    sessionStorage.setItem('resume', JSON.stringify("jj"));
    return {
      pageSize: 'A4',
      content: [
        this.getProductosVendidos(this.productoqrcol1,this.productoqrcol2,this.productoqrcol3),
      ],
      footer: function (currentPage, pageCount) {
        return {
        };
      }
      , pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
        return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
     },
      info: {
        title: "Factura" + '_RESUME',
        author: "this.resume.name",
        subject: 'RESUME',
        keywords: 'RESUME, ONLINE RESUME',
      }
    };
  } 

  getDocumentDefinition3() {
    sessionStorage.setItem('resume', JSON.stringify("jj"));
    return {
      pageSize: 'A4',
      content: [
        this.getProductosVendidos3(this.productoqrcol1,this.productoqrcol2),
      ],
      footer: function (currentPage, pageCount) {
        return {
        };
      }
      , pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
        return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
     },
      info: {
        title: "Factura" + '_RESUME',
        author: "this.resume.name",
        subject: 'RESUME',
        keywords: 'RESUME, ONLINE RESUME',
      }
    };
  } 


  getDocumentDefinition2() {
    sessionStorage.setItem('resume', JSON.stringify("codigos"));
    return {
      pageSize: 'A4',
      content: [
  
        this.getProductosVendidos2(this.productoqr),

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


  getProductosVendidos(productos: productoqr[],productos2: productoqr[],productos3: productoqr[]) {
    return {
      columns: [
        {
          width: 175,
           table: {
            widths: ["35%","65%"],
            alignment:'center',
            body: [
              ...productos.map(ed =>{
                return [ { qr: ed.url, fit: '62',margin: [20, 15, 0, 15] },
                {	type: 'none',
                margin: [0, 15, 20, 15],
                fontSize: 8,
                ol: [
                  ed.nombre_producto,
                  "Piezas/Caja: "+ed.piezas_producto,
                  "Metros/Caja: "+ed.metros_producto
                ]}];
              }),
            ]
          } ,
          layout: 'lightHorizontalLines',
        },
        {
          width: 175,
          table: {
           widths: ["35%","65%"],
           alignment:'center',
           body: [
             ...productos2.map(ed =>{
               return [ { qr: ed.url, fit: '62',margin: [20, 15, 0, 15] },
               {	type: 'none',
               margin: [0, 15, 20, 15],
               fontSize: 8,
               ol: [
                 ed.nombre_producto,
                 "Piezas/Caja: "+ed.piezas_producto,
                 "Metros/Caja: "+ed.metros_producto
               ]}];
             }),
           ]
         } ,
         layout: 'lightHorizontalLines',
        },
        {
          width: 175,
          table: {
           widths: ["35%","65%"],
           alignment:'center',
           body: [
             ...productos3.map(ed =>{
               return [ { qr: ed.url, fit: '62',margin: [20, 15, 0, 15] },
               {	type: 'none',
               margin: [0, 15, 20, 15],
               fontSize: 8,
               ol: [
                 ed.nombre_producto,
                 "Piezas/Caja: "+ed.piezas_producto,
                 "Metros/Caja: "+ed.metros_producto
               ]}];
             }),
           ]
         } ,
         layout: 'lightHorizontalLines',
        },
      ],
    };
  }

  getProductosVendidos3(productos: productoqr[],productos2: productoqr[]) {
    return {
      columns: [
        {
          width: 175,
           table: {
            widths: ["35%","65%"],
            alignment:'center',
            body: [
              ...productos.map(ed =>{
                return [ { qr: ed.url, fit: '62',margin: [20, 15, 0, 15] },
                {	type: 'none',
                margin: [0, 15, 20, 15],
                fontSize: 8,
                ol: [
                  ed.nombre_producto,
                  "Piezas/Caja: "+ed.piezas_producto,
                  "Metros/Caja: "+ed.metros_producto
                ]}];
              }),
            ]
          } ,
          layout: 'lightHorizontalLines',
        },
        {
          width: 175,
          table: {
           widths: ["35%","65%"],
           alignment:'center',
           body: [
             ...productos2.map(ed =>{
               return [ { qr: ed.url, fit: '62',margin: [20, 15, 0, 15] },
               {	type: 'none',
               margin: [0, 15, 20, 15],
               fontSize: 8,
               ol: [
                 ed.nombre_producto,
                 "Piezas/Caja: "+ed.piezas_producto,
                 "Metros/Caja: "+ed.metros_producto
               ]}];
             }),
           ]
         } ,
         layout: 'lightHorizontalLines',
        },
        {
        
        },
      ],
    };
  }



  getProductosVendidos2(productos: productoqr[]) {
    return {
      columns: [
        {
          width: 175,
           table: {
            widths: ["35%","65%"],
            alignment:'center',
            body: [
              ...productos.map(ed =>{
                return [ { qr: ed.url, fit: '62',margin: [20, 15, 0, 15] },
                {	type: 'none',
                margin: [0, 15, 20, 15],
                fontSize: 8,
                ol: [
                  ed.nombre_producto,
                  "Piezas/Caja: "+ed.piezas_producto,
                  "Metros/Caja: "+ed.metros_producto
                ]}];
              }),
            ]
          } ,
          layout: 'lightHorizontalLines',
        },
        {
        
        },
        {
         
        },
      ],
      
    };
  }
}
