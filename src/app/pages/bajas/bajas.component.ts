import { Component, OnInit } from '@angular/core';
import { productosBajas, baja } from './bajas';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertsService } from 'angular-alert-module';
import Swal from 'sweetalert2';
import pdfMake from 'pdfmake/build/pdfmake';
import { producto, contadoresDocumentos } from '../ventas/venta';
import { Sucursal } from '../compras/compra';
import { element } from 'protractor';
import { transaccion } from '../transacciones/transacciones';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { SucursalesService } from 'src/app/servicios/sucursales.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { BajasService } from 'src/app/servicios/bajas.service';
import { TransaccionesService } from 'src/app/servicios/transacciones.service';

@Component({
  selector: 'app-bajas',
  templateUrl: './bajas.component.html',
  styleUrls: ['./bajas.component.scss']
})
export class BajasComponent implements OnInit {


  usuario:string="q@q.com"
  observaciones:string
  sucursal:string
  transaccion:transaccion
  fecha:Date =new Date
  fecha_transaccion:string
  id_baja:number
  totalBajas:number=0
  estado:string
  totalbaja:number=0
  numeroFactura:string
  baja:baja
  contap:number=0
  contap2:number=0
  number_transaccion:number=0
  locales: Sucursal[]=[]
  productosBaja: productosBajas[]=[]
  productosBajaBase: productosBajas[]=[]
  productosBajaLeido: productosBajas[]=[]
  parametrizaciones:parametrizacionsuc[]=[]
  parametrizacionSucu:parametrizacionsuc
  bajas: baja[]=[]
  bajasPendientes: baja[]=[]
  bajasAprobadas: baja[]=[]
  bajasRechazadas: baja[]=[]
  bajaLeida:baja
  productos: producto[] = []
  productosActivos: producto[] = []
  
  menuMotivo: string[] = [
    "Caducidad",
    "Desiciones comerciales",
    "Daño",
    "Defectos fábrica",
    "Pérdida Fisica",
    "Otros"
  ];

  menu1: string[] = [
    "Bajas",
  "Aprobaciones",
  "Bajas Aprobadas"
  ];
  contadores:contadoresDocumentos[]=[]
  constructor(public parametrizacionService:ParametrizacionesService,public transaccionesService:TransaccionesService, public bajasService:BajasService, public productoService:ProductoService, public sucursalesService:SucursalesService, public contadoresService:ContadoresDocumentosService, ) { 
    this.baja = new baja
    this.productosBaja.push(new productosBajas)
  }

  ngOnInit() {
    //this.getIDBjas()
    //this.getProductos()
    //this.getLocales()
    //this.getBajas()
    //this.getProductosBajas()
    //this.getIDTransacciones()
    //this.getParametrizaciones()
    this.traerParametrizaciones()
    this.traerBajas()
    this.traerSucursales()
    this.traerParametrizaciones()
    this.traerContadoresDocumentos()
    this.traerProductos()
    this.traerSucursales()
    
  }

  traerParametrizaciones(){
    this.parametrizacionService.getParametrizacion().subscribe(res => {
      this.parametrizaciones = res as parametrizacionsuc[];
   })
  }

  traerSucursales(){
    this.sucursalesService.getSucursales().subscribe(res => {
      this.locales = res as Sucursal[];
   })
  }

  traerProductos(){
    this.productoService.getProducto().subscribe(res => {
      this.productosActivos = res as producto[];
      this.llenarComboProductos()
   })
  }

  traerBajas(){
    this.bajasService.getBajas().subscribe(res => {
      this.bajas = res as baja[];
   })
  }

  traerContadoresDocumentos(){
    this.contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
      this.id_baja =this.contadores[0].contBajas_Ndocumento+1
      this.number_transaccion =this.contadores[0].transacciones_Ndocumento+1

      
      //this.asignarIDdocumentos()
   })
  }

  /* async getIDBjas() {
    await this.db.collection('/bajas_ID').doc('matriz').snapshotChanges().subscribe((contador) => {
      console.log(contador.payload.data())
      this.id_baja = contador.payload.data()['documento_n']+1;  
    });;
  }
 */
  /* async getBajas() {
    await this.db.collection('bajas').snapshotChanges().subscribe((bajas) => {
      new Promise<any>((resolve, reject) => {
        bajas.forEach((nt: any) => {
          this.bajas.push(nt.payload.doc.data());
        })
      }).then(res => {}, err => alert(err));  
     
    });;
  } */


  /* async getIDTransacciones() {
    await this.db.collection('transacciones_ID').doc('matriz').snapshotChanges().subscribe((transacciones) => {
      console.log(transacciones.payload.data())
      this.number_transaccion = transacciones.payload.data()['documento_n'];    
    });;
  } */

  /* async getProductosBajas() {    
    await this.db.collection('productosBaja').snapshotChanges().subscribe((productos) => {   
      productos.forEach((nt: any) => {
        this.productosBajaBase.push(nt.payload.doc.data());
      })
    });;
  } */

 /*  getParametrizaciones(){
    this.db.collection('/parametrizacionSucursales').valueChanges().subscribe((data:parametrizacionsuc[]) => {
      if(data != null)
        this.parametrizaciones = data

    })
  } */

 /*  getLocales(){
    new Promise<any>((resolve, reject) => {
    this.db.collection('/locales').valueChanges().subscribe((data:Sucursal[]) => {
      if(data != null)
        this.locales = data
    })
    console.log("hayyy"+this.locales.length)
  })
    
  } */

  /* async getProductos() {
    //REVISAR OPTIMIZACION
    await this.db.collection('productos').snapshotChanges().subscribe((productos) => {
      this.productos = []
      new Promise<any>((resolve, reject) => {
        productos.forEach((nt: any) => {
          this.productosActivos.push(nt.payload.doc.data());
        })
      })
      this.llenarComboProductos()
    });;
  } */

  llenarComboProductos(){
    this.productosActivos.forEach(element=>{
      if(element.ESTADO == "ACTIVO"){
        this.productos.push(element)
      }
    })
  }

  getCourseFile = (e) => {  
    this.cargarDatosBaja(e.row.data)  
  }

  getCourseFile2 = (e) => {  
    this.aceptarBaja(e.row.data)  
  }
  getCourseFile3 = (e) => {  
    this.rechazarBaja(e.row.data)  
  }

  anadirProducto(e){
    this.productosBaja.push(new productosBajas)
  }

  asignarDatoSucursal(e){
    this.baja.sucursal= e.value
    console.log("5656 "+this.baja.sucursal)
  }

  deleteProducto(e,i:number){
    if(this.productosBaja.length > 1){
    this.productosBaja.splice(i,1);
    }
    else{
      Swal.fire(
        'Alerta',
        'Debe tener al menos un producto',
        'warning'
      )
    }
    this.calcularTotal()
  }

  rechazarBaja(e:any){
    Swal.fire({
      title: 'Rechazar Baja de Productos',
      text: "Desea rechazar la orden de baja #"+e.id_baja,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        new Promise<any>((resolve, reject) => {
          this.bajasService.updateEstadoBaja(e,"Rechazado").subscribe( res => {Swal.fire({
            title: 'Correcto',
            text: 'Se guardó con éxito',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            window.location.reload()
          })}, err => {alert("error")})
       
       
         /*  this.db.collection('/bajas').doc(e.id_baja+"").update({"estado":"Rechazado"}).then(res => {  Swal.fire({
          title: 'Correcto',
          text: 'Se guardó con éxito',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
        })}, err => alert(err));   */
       
      })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    }) 
  }

  aceptarBaja(e:any){
    Swal.fire({
      title: 'Aceptar Baja de Productos',
      text: "Desea aceptar la baja de productos #"+e.id_baja,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        new Promise<any>((resolve, reject) => {
          this.mostrarMensaje()
       // this.db.collection('/bajas').doc(e.id_baja+"").update({"estado":"Aprobado"}).then(res => {  }, err => alert(err));  
       this.bajasService.updateEstadoBaja(e,"Aprobado").subscribe( res => {console.log("suuu"),this.realizarTransacciones(e)}, err => {alert("error")})
      })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    }) 
  }

  realizarTransacciones(e:any){
    var contVal=0
    this.bajas.forEach(element=>{
      if(element.id_baja == e.id_baja){
        this.bajaLeida=element
        this.productosBajaLeido=element.productosBaja
      }
    })

   
     new Promise<any>((resolve, reject) => {
       //alert("voy a "+ this.productosBajaLeido.length)
     this.productosBajaLeido.forEach(element=>{
        this.transaccion = new transaccion()
        this.transaccion.fecha_mov=this.bajaLeida.fecha
        this.transaccion.fecha_transaccion=new Date()
        this.transaccion.sucursal=this.bajaLeida.sucursal
        this.transaccion.bodega="bodega2"
        this.transaccion.documento=this.bajaLeida.id_baja+""
        this.transaccion.producto=element.producto.PRODUCTO
        this.transaccion.cajas=element.cantFactCajas
        this.transaccion.piezas=element.cantFactPiezas
        this.transaccion.observaciones=element.justificacion
        this.transaccion.tipo_transaccion="baja"
        this.transaccion.movimiento=-1
        this.transaccion.valor=element.producto.precio
        this.transaccion.cantM2=element.cantbajam2
        this.transaccion.totalsuma=element.total
        this.transaccion.usu_autorizado="q@q.com"
        this.transaccion.usuario="q@q.com"
        this.transaccion.factPro=""
        this.transaccion.idTransaccion=this.number_transaccion++
       /*  this.db.collection("/transacciones")
        .add({ ...this.transaccion })
        .then(res => {contVal++,this.contadorValidaciones(contVal) }, err => reject(err));
        this.db.collection("/transacciones_ID").doc("matriz").set({ documento_n:this.number_transaccion })
          .then(res => { }, err => reject(err)); */
          this.transaccionesService.newTransaccion(this.transaccion).subscribe(
            res => {
              this.contadores[0].transacciones_Ndocumento = this.number_transaccion++
              this.contadoresService.updateContadoresIDTransacciones(this.contadores[0]).subscribe(
                res => {
                  contVal++,this.contadorValidaciones(contVal)
                },
                err => {
                  Swal.fire({
                    title: "Error al guardar",
                    text: 'Revise e intente nuevamente',
                    icon: 'error'
                  })
                })
            },err => {
            })
    })
  })
  }

  contadorValidaciones(i:number){
    if(this.productosBajaLeido.length==i){
      console.log("guarde")
      this.actualizarProductos()
    }else{
      console.log("no he entrado "+i)
    }
  }

  actualizarProductos(){  
    console.log("entre a actualizar")
     var sumaProductos =0
     var num1:number=0
     var num2:number=0
     var num3:number=0
     var cont2ing=0
      var contIng:number=0
      var entre:boolean=true     
      new Promise<any>((resolve, reject) => {
        this.productosBajaLeido.forEach(element=>{
          this.productos.forEach(elemento1=>{
            if(elemento1.PRODUCTO == element.producto.PRODUCTO){
             // contIng=0
             switch (this.bajaLeida.sucursal) {
              case "matriz":
                num1=parseInt(element.cantbajam2.toFixed(0))
                num2=elemento1.sucursal1
                sumaProductos = Number(num2)-Number(num1)
                break;
              case "sucursal1":
                num1=parseInt(element.cantbajam2.toFixed(0))
                num2=elemento1.sucursal2
                sumaProductos =Number(num2)-Number(num1)
                break;
              case "sucursal2":
                num1=parseInt(element.cantbajam2.toFixed(0))
                num2=elemento1.sucursal3
                sumaProductos =Number(num2)-Number(num1)
                  break;
              default:
            }
            }
         })
         if(entre){
          switch (this.bajaLeida.sucursal) {
            case "matriz":
              element.producto.sucursal1=sumaProductos
              
              this.productoService.updateProductoSucursal1(element.producto).subscribe( res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => {})
              //this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal1" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err)); 
              break;
            case "sucursal1":
              element.producto.sucursal2=sumaProductos
              this.productoService.updateProductoSucursal2(element.producto).subscribe( res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => {})
              //this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal2" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));
              break;
            case "sucursal2":
              //alert("entre")
              element.producto.sucursal3=sumaProductos
              this.productoService.updateProductoSucursal3(element.producto).subscribe( res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => {})
              //this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal3" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));
              break;
            default: 
          
          //his.db.collection('/productos').doc(element.producto.PRODUCTO).update({"cantidad" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));   
         }
        }
        })
      })
       
    }

  obtenerDetallesDoc(e,i:number){
    this.productos.forEach(element=>{
      if(element.PRODUCTO == e.value){
        this.productosBaja[i].producto=element
        this.productosBaja[i].costo= element.precio
      }
    })
  }

  contadorValidaciones2(i:number){
    if(this.productosBajaLeido.length==i){
        console.log("recien termine")
        Swal.close()
        Swal.fire({
          title: 'Baja de productos Aprobada',
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


  cargarBajas(){
    this.bajas.forEach(element=>{
      if(element.estado=="Pendiente"){
        this.bajasPendientes.push(element)
      }else if(element.estado=="Aprobado"){
        this.bajasAprobadas.push(element)
      }else if(element.estado=="Rechazado"){
        this.bajasRechazadas.push(element)
      }
    })
  }

  cargarDatosBaja(e: any){
    // alert("voy a buscar la remision "+e.id_remision)
    var cont=0
    this.productosBajaLeido.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.productosBajaLeido.forEach(element=>{
        this.productosBajaLeido.splice(0)   
      })
    }

     this.bajas.forEach(element=>{
         if(element.id_baja == e.id_baja){
           this.bajaLeida=element
           this.productosBajaLeido=element.productosBaja
         }
     })
     this.parametrizaciones.forEach(element=>{
     //  alert("kjjlk "+this.bajaLeida.sucursal)
      if(element.sucursal == this.bajaLeida.sucursal){
        this.parametrizacionSucu= element
      }
    })
   
     this.crearPDF()
 }

 


  transformarM2(e,i:number){
   // console.log("rr2444 "+this.productosDevueltos[i].producto)
    this.productos.forEach(element=>{
      if(this.productosBaja[i].producto.PRODUCTO== element.PRODUCTO){
       // this.productosBaja[i].cantbajam2=parseInt(((element.producto.M2*this.productosDevueltos[i].cantDevueltaCajas)+((this.productosDevueltos[i].cantDevueltaPiezas*element.producto.M2)/element.producto.P_CAJA)).toFixed(0))
        this.productosBaja[i].cantbajam2=parseFloat(((element.M2*this.productosBaja[i].cantFactCajas)+((this.productosBaja[i].cantFactPiezas*element.M2)/element.P_CAJA)).toFixed(2))
        this.productosBaja[i].total= element.precio *  this.productosBaja[i].cantbajam2
       // console.log("ddddd "+)
       console.log("222 "+this.productosBaja[i].cantbajam2)
       console.log("222 "+element.precio)
      }
      
    })
    this.calcularTotal()
  }

  calcularTotal(){
    this.totalBajas=0
    this.productosBaja.forEach(element=>{
      this.totalBajas=parseFloat((element.total+this.totalBajas).toFixed(2))
      //this.total=element.total+this.total
    })
  }


  crearPDF(){
    console.log("entre  a creaar PDF")
    const documentDefinition = this.getDocumentDefinition();
    pdfMake.createPdf(documentDefinition).download('Baja '+this.bajaLeida.id_baja, function() {  });
  }

  setearNFactura(){
    let nf=this.bajaLeida.id_baja
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

  getDocumentDefinition() {
    this.setearNFactura()
    sessionStorage.setItem('Devolucion', JSON.stringify("jj"));
    //let tipoDocumento="Factura";
    return {
      pageSize: 'A4',
      pageOrientation: 'portrait', 
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
            text:" ",
            alignment:"right"
          },
          ]
          
          //alignment: 'center'
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
              width:260,
              text: "BAJA  001 - 000",
              bold: true,
              fontSize: 20,
            },
            {
              width:260,
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
              widths: [100,400],
              body: [
                [
                  {
                    stack: [
                      {
                        type: 'none',
                        bold: true,
                        fontSize:9,
                        ul: [
                          'Usuario.',
                          'Sucursal',
                          'Fecha',
                          'Fecha. Trans.',

                          
                           
                        ]
                      }
                    ]
                  },
                  {
                    stack: [
                      {
                        type: 'none',
                        fontSize:9,
                        ul: [
                          ''+this.bajaLeida.usuario,
                          ''+this.bajaLeida.sucursal,
                          ''+this.bajaLeida.fecha,
                          ''+this.bajaLeida.fecha_transaccion,
                         
                         
                       
                        ]
                      }
                    ]
                  },
                 
                 
                ]
              ]
            }
            },
           
            ],
            [
              
            ]
          ]
        },
       
        this.getProductosIngresados2(this.productosBajaLeido),
        {text:" "}, {text:" "},
        {
          text:"Observaciones:   "+this.bajaLeida.observaciones,fontSize:9
        },

        {text:" "},
        {
          
          columns: [{
          width:450,
          text: "Total:",
          bold: true,
          fontSize: 15,
          alignment:"right",
        },
        {
          width:60,
          text: +this.bajaLeida.totalBajas,
          bold: true,
          fontSize: 15,
          alignment:"right"
        },
        ]
        },
        {text:" "}, {text:" "},{text:" "},
          {
          columns: [{
           text:"Firma conformidad entrega",
          width: 250,
          fontSize:10,
          alignment:"right",
          margin: [55, 20, 40, 10],
          },
          {
            width:250,
            margin: [40, 20, 20, 10],
            fontSize:10,
            text:"Firma conformidad recibo ",
            alignment:"left"
          },
          ]
          
          //alignment: 'center'
        }, 
      ],
      footer: function (currentPage, pageCount) {
        return {
          table: {
            body: [
              
              [{text: '  ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL ', alignment: 'center', style:"textFot"}],
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


  getProductosIngresados2(productos: productosBajas[]) {
    return {
     /*  [{text: 'Header with Colspan = 2', style: 'tableHeader', colSpan: 2, alignment: 'center'}, {}, {text: 'Header 3', style: 'tableHeader', alignment: 'center'}], */
      table: {
        widths: ["32%","5%","6%","7%","18%","12%","20%"],
        alignment:'center',
        fontSize:9,
        headerRows: 2,
        body: [
          
          [{
            text: 'Producto',
            style: 'tableHeader2',
            rowSpan:2,
            fontSize:8,
            alignment: 'center'
          },
          {
            text: 'Cantidad',
            style: 'tableHeader2', 
            colSpan:2,
            fontSize:8,
            alignment: 'center'
          },
          {
            
          },
          {
            text: 'Total',
            style: 'tableHeader2', 
            rowSpan:2,
            fontSize:8,
            alignment: 'center'
          },
          {
            text: 'Responsable',
            style: 'tableHeader2', 
            rowSpan:2,
            fontSize:8,
            alignment: 'center'
          },
          {
            text: 'Causa',
            style: 'tableHeader2', 
            rowSpan:2,
            fontSize:8,
            alignment: 'center'
          },
          {
            text: 'Justificación',
            rowSpan:2,
            style: 'tableHeader2',
            fontSize:8,
            alignment: 'center'
          },
          ],
          [
            {},
          {
            text: 'Cajas',
            style: 'tableHeader2', 
            fontSize:8,
            alignment: 'center'
          },
          {
            text: 'Piezas',
            style: 'tableHeader2',
            fontSize:8, 
            alignment: 'center'
          },
          {
            
          },
          {
            
          },
          {
          
          },
          ],
          
          ...productos.map(ed =>{
            return [ {text:ed.producto.PRODUCTO, fontSize:9}, { text: ed.cantFactCajas, alignment: 'center', fontSize:9 }, { text: ed.cantFactPiezas, alignment: 'center', fontSize:9 },
           {text:ed.total.toFixed(2), alignment:"center", fontSize:9},{text:ed.responsable, alignment:"center", fontSize:9},{text:ed.causa, alignment:"center", fontSize:9},
            {text:ed.justificacion, alignment:"center", fontSize:9}];
            
          }),
         
          
        ]
      }
   
    };
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

  mensajeCorrecto(){
    Swal.close()
    Swal.fire({
      title: 'Baja Registrada',
      text: 'Se ha guardado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }

  contadorValidaciones3(i:number){
    if(this.productosBaja.length==i){
        console.log("recien termine")
      
    }else{
      console.log("no he entrado actualizar"+i)
    }
  }


  guardarBaja(){
    this.baja.fecha=this.fecha.toLocaleDateString()
    this.baja.id_baja=this.id_baja
    this.baja.observaciones=this.observaciones
    this.baja.usuario=this.usuario
    this.baja.totalBajas=this.totalBajas
    this.baja.productosBaja=this.productosBaja
   var contV=0
    if( this.baja.usuario!=undefined){
      this.mostrarMensaje()
      new Promise<any>((resolve, reject) => {
        this.bajasService.newBajas(this.baja).subscribe( res => {
          this.contadores[0].contBajas_Ndocumento=this.id_baja
          this.contadoresService.updateContadoresIDBajas(this.contadores[0]).subscribe( res => {this.mensajeCorrecto()}, err => {alert("error")})
        }, err => {alert("error")})

        //this.db.collection('/bajas').doc(this.baja.id_baja+"").set({...Object.assign({},this.baja )}) ;
        //this.db.collection('/bajas_ID').doc("matriz").update({"documento_n" :this.id_baja});
        /* this.productosBaja.forEach(element => {
          element.baja_id=this.id_baja
          this.db.collection("/productosBaja").add({ ...Object.assign({}, element)})
          .then(resolve => {contV++,this.contadorValidaciones3(contV)}, err => reject(err));   
          }) */
      })
    }else{
      alert("hay campos vacios")
    }  
  }


  opcionMenu(e){
    //var cont1=0
    this.contap2++
        if(this.contap2<=1){
          this.cargarBajas()
        }
    var x = document.getElementById("devolucion");
    var y = document.getElementById("admin");
    var z = document.getElementById("aprobaciones");
    switch (e.value) {
      case "Bajas":
        x.style.display = "block";
        y.style.display="none";
        z.style.display="none";
       break;
  
      case "Aprobaciones":
        x.style.display = "none";
        y.style.display="block";
        z.style.display="none";
        break;
     
      case "Bajas Aprobadas":
        
        //this.cargarDevoluciones()
        x.style.display = "none";
        y.style.display="none";
        z.style.display="block";
        break;
      default:    
    }     
    }
  

}
