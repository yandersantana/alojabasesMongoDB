import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { CalculadoraComponent } from './calculadora/calculadora.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { compra } from '../compras/compra';
import { DxFormComponent, RenderData } from 'devextreme-angular';
import { transaccion } from '../transacciones/transacciones';
import { factura, cliente, venta, producto } from './venta';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { AlertsService } from 'angular-alert-module';
import Swal from 'sweetalert2';
import { url } from 'inspector';
import { DatePipe } from '@angular/common';
import { read } from 'fs';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
  providers: [DatePipe]
})
export class VentasComponent implements OnInit {
 nombre:string;
  factura : factura;
  now: Date = new Date();
  maxDate:Date = new Date();
  minDate:Date = new Date();
  productos: producto[] = []
  clientes:cliente[] = []
  sePuedeCalcular:Boolean
  compras: compra[] = []
  transaccion:transaccion
  productosVendidos: venta[] = []
  newButtonEnabled: boolean = true
  medida: string = "m2"
  cantidad: number
  cantidadPiezas: number
  visibleCalculadora: boolean = false
  valorEnM2:number
  pdf:PdfMakeWrapper = new PdfMakeWrapper()
  sucursales:string[]
  productosSolicitados:number
  flag:boolean
  dateToday: number = Date.now();
  datePipe:DatePipe
  

  @ViewChild('ventasForm', { static: false }) ventasForm: DxFormComponent;

  constructor(private db: AngularFirestore, public  afAuth:  AngularFireAuth,private alerts: AlertsService) {
    this.factura = new factura()
    this.factura.fecha = new Date()
    this.maxDate = new Date(this.maxDate.setDate(this.maxDate.getDate() - 2));
    this.minDate = this.now
    
    this.productosVendidos.push(new venta)
    this.sucursales = []
    

  }
  


  //se ejecuta apenas se carga la pantalla
  ngOnInit() {

    this.getSucursales()
    this.getProductos()
    this.getFactureros()
    this.getClientes()
   
   
    this.db.collection('/compras').valueChanges().subscribe((data:compra[]) => {
      this.compras = data
    })
    this.factura.username=this.afAuth.auth.currentUser.email

  }
  async getSucursales() {
    
    await this.db.collection('factureros').snapshotChanges().subscribe((sucursales) => {
      
      sucursales.forEach((nt: any) => {
        this.sucursales.push(nt.payload.doc.id)
      })
    });;
  }

  async getProductos() {
    //REVISAR OPTIMIZACION
    await this.db.collection('productos').snapshotChanges().subscribe((productos) => {
      this.productos = []
      productos.forEach((nt: any) => {
        this.productos.push(nt.payload.doc.data());
      })
    });;
  }
  async getFactureros() {
    //REVISAR OPTIMIZACION
    await this.db.collection('factureros').doc('matriz').snapshotChanges().subscribe((facturero) => {
      console.log(facturero.payload.data())

      this.factura.documento_n = facturero.payload.data()['n_factura']+1;
      console.log(this.factura.documento_n)
    });;
  }
  async getClientes() {
    //REVISAR OPTIMIZACION
    await this.db.collection('clientes').snapshotChanges().subscribe((clientes) => {
      this.clientes = []
      clientes.forEach((element:any) => {
        this.clientes.push(element.payload.doc.data())        
      });
    });;
  }

  anadirProducto = (e) => {
    this.newButtonEnabled = true
    this.productosVendidos.push(new venta())

    
  }

  verCalculadora(e) {
    this.visibleCalculadora = true
    //console.log(this.productosVendidos[this.productosVendidos.length - 1].producto.REFERENCIA)
    if(this.productosVendidos[this.productosVendidos.length - 1].producto != undefined){
      this.sePuedeCalcular=true

    }
    else{
      this.sePuedeCalcular = true;
    }
  }

stringIsNumber(s) {
    var x = +s; // made cast obvious for demonstration
    return x.toString() === s;
}

  ct:string = ""
  selected:number
  //VA A COGER SIEMPRE EL ULTIMO

setSelectedProducto(i:number){
  this.selected=i 
}

  calcularMetros(e) {
    if (this.stringIsNumber(e.event.key)){ //on focus
      this.ct = this.ct + e.event.key
    let tmp = this.productosVendidos[this.selected]

      this.productos.forEach(element => {
        if (element.REFERENCIA == tmp.producto.REFERENCIA) {
          let metros = (element.M2 * tmp.cantidad) + (this.cantidadPiezas * element.M2 / element.P_CAJA);
          this.valorEnM2 = metros
        }
      })
  
    }
  }

  obtenerDatosDeProductoParaUnDetalle(e, i:number) {

    //se debe validar por e
    let compra:compra
    this.newButtonEnabled = false
    compra=this.compras.filter(x=>x.producto == e.value)[0]
    this.productosVendidos[i].disponible = compra.cantidad
    this.productosVendidos[i].precio_min = compra.precio * compra.porcentaje_ganancia / 100 + compra.precio
    this.calcularEquivalencia(e,i)
  }

  getClientNames(){
    let names = []
    this.clientes.forEach(element => {
      names.push(element.cliente_nombre)    
    });
    return names
  }

  deleteProductoVendido(i){
    if(this.productosVendidos.length > 1){
    this.productosVendidos.splice(i,1);
    this.calcularTotalFactura()
    }
    else{
      alert("Las facturas deben tener al menos un producto")
    }
        }

  setClienteData(e){
    this.clientes.forEach(element => {
        if(element.cliente_nombre == e.component._changedValue)
        this.factura.cliente = element
    });
    
  }

  carcularTotalProducto(e, i:number) {
    
    console.log("ssssss")
    console.log(e)
    this.calcularTotalRow(i)
    this.calcularTotalFactura()
  }

  calcularDisponibilidadProducto(e, i:number) {

    this.productosSolicitados=this.productosVendidos[i].disponible-this.productosVendidos[i].cantidad
    this.calcularTotalFactura()
    //this.alerts.setMessage('All the fields are required','error');
    if(this.productosVendidos[i].cantidad > this.productosVendidos[i].disponible ){
      //this.productosVendidos[i].cantidad=this.productosVendidos[i].disponible
      this.showModal(e,i)
    
      this.calcularEquivalencia(e, i)
      this.calcularTotalFactura()
      this.productosVendidos[i].pedir= true
     //console.log("holasi"+this.showModal())
   }
    /* setTimeout(function () {
      console.log();
   }, 5000); */

  }

calcularTotalFactura(){
  this.factura.total = 0
  this.productosVendidos.forEach(element => {
    console.log(element.seleccionado)
    if(element.seleccionado)
    this.factura.total = element.total + this.factura.total
  });
}
cambiarEstadoSeleccionado(e){
  console.log(e)
  this.calcularTotalFactura()
}

  calcularEquivalencia(e, i:number) {
    this.productos.forEach(element => {
    console.log(this.productosVendidos[i].producto.REFERENCIA)
    console.log(element.REFERENCIA)
    console.log(this.productosVendidos[i].cantidad)

      if(element.PRODUCTO == this.productosVendidos[i].producto.REFERENCIA){
        let cajas = Math.trunc(this.productosVendidos[i].cantidad / element.M2);
        let piezas = Math.trunc(this.productosVendidos[i].cantidad * element.P_CAJA / element.M2) - (cajas * element.P_CAJA);

        this.productosVendidos[i].equivalencia = cajas + "C " + piezas + "P"
      }
    })
  }

  calcularTotalRow(i:number) {
    this.productosVendidos[i].total = this.productosVendidos[i].cantidad * this.productosVendidos[i].precio_venta
    console.log("aqui estoy mostrandi")
    console.log(this.productosVendidos[this.productosVendidos.length - 1].cantidad)
    console.log(this.productosVendidos[this.productosVendidos.length - 1].precio_venta)
    console.log(this.productosVendidos[this.productosVendidos.length - 1].total)
  }


  showModal(e,i:number){
    /* Swal.fire({
      title: 'Cantidad no disponible!',
      text: 'Desea hacer un pedido del producto?',
      icon: 'warning',
      confirmButtonText: 'Ok'
    }) */
    
    
    Swal.fire({
      title: 'Cantidad no disponible',
      text: "Desea hacer un pedido del producto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Producto solicitado!',
          'Tu producto ha sido añadido con éxito',
          'success'
          
        )
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su orden.',
          'error'
        )
        this.deleteProductoVendido(i)
      }
    })
    
  }


  /*generarNombresProductos() {
    this.productos.forEach(element => {
      element.nombreComercial = element.clasificacion + " - " + element.nombre + " - " + element.dimension + " - " + element.calidad
    });
  }
*/



  crearPDF(){
    const documentDefinition = this.getDocumentDefinition();
  pdfMake.createPdf(documentDefinition).open();

    /* const documentDefinition = this.getDocumentDefinition();
    this.pdf.add(documentDefinition);
  this.pdf.add("Hello world")
    try {
      this.pdf.create().download();
    } catch (err) {
      alert(err);
    } */}



    getDocumentDefinition() {
      //var fecha2 = this.datePipe.transform(new Date(),"dd-MM-yyyy");
    //console.log("holaaaa"+fecha2); 
      sessionStorage.setItem('resume', JSON.stringify("jj"));
      return {
        content: [
          {
            
            text: 'RESUME',
            bold: true,
            fontSize: 20,
            alignment: 'center',
            margin: [0, 0, 0, 20]
          }, {

       
          },
          {
            columns: [
              [{
                columns: [{
                width:300,
                text: "FORERO DELGADO JUAN ",
              },
              {
                width:300,
                text: "FECHA:17/03/2020 ",
              },
              ]
              
              },
              {
                text: "RUC: 0961654563",
              },
              {
                text: "Fecha de impresión: "+this.factura.fecha,
              },
              {
                text: "Venta de materiales para acabados de construcción, porcelanatos, cerámicas ",
              },
              {
                text: "Dirección: Av. Juan Montalvo entre Seminario y Olmedo 423 ",
              },
              {
                text: "Teléfonos: 0986951573 - 0997975089 - Milagro ",
              },
              {
                text: "Auto SRI 1124706493",
              },{
                columns: [{
                width:300,
                text: "FACTURA 001-001-000 ",
                bold: true,
                fontSize: 20,
              },
              {
                width:300,
                text: "NO "+"001479",
                color: 'red',
                bold: true,
                fontSize: 20,
              },
              ]
              },
              {
                columns: [{
                width:300,
                text: "Fecha de Autorización 29 de Abril 2019 ",
              },
              {
                width:300,
                text: "Vendedor: "+"Juan Forero",
              },
              ]
              
              },{
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
              {
                columns: [{
                width:100,
                text: "Cliente ",
              },
              {
                width:300,
                text: ""+this.factura.cliente.cliente_nombre,
                background: '#F1F2F3'
              },
              ]
              
              },{
                columns: [{
                width:100,
                text: "Contacto ",
              },
              {
                width:300,
                text: ""+this.factura.cliente.cliente_nombre,
                background: '#F1F2F3'
              },
              ]
              
              },{
                columns: [{
                width:100,
                text: "Dirección ",
              },
              {
                width:300,
                text: ""+this.factura.cliente.cliente_nombre,
                background: '#F1F2F3'
              },
              ]
              
              },{
                columns: [{
                width:100,
                text: "Teléfonos ",
              },
              {
                width:300,
                background: '#F1F2F3',
                text: ""+this.factura.cliente.cliente_nombre,
                fillColor: '#2361AE',
           
              },
              ]
              
              },
              {
                text: "Cliente : "+this.factura.cliente.cliente_nombre,
                style: 'name'
              },
              {
                text: "Contacto : "+this.factura.cliente.celular,
              },
              {
                text: 'Dirección : ' + this.factura.cliente.t_cliente,
              },
              {
                text: 'Teléfonos : ' + this.factura.cliente.direccion,
              },
              
              ],
              [
                
              ]
            ]
          },
          {
            text: 'Skills',
            style: 'header'
          },
          
          
        ], images: {
          mySuperImage: 'data:image/jpeg;base64,...content...'
        },
        info: {
          title: "this.resume.name" + '_RESUME',
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
            name: {
              fontSize: 16,
              bold: true
            },
            jobTitle: {
              fontSize: 14,
              bold: true,
              italics: true
            },
            sign: {
              margin: [0, 50, 0, 10],
              alignment: 'right',
              italics: true
            },
            tableHeader: {
              bold: true,
            }
          }
      };
    } 

    

  generarFactura(e) {
    //SE DEBE GRABAR EL ENCABEZADO DE LA FACTURA Y SU DETALLE EN LA BASE DE DATOS
    //validar todo 
    //grabar en usuarios
    //grabar en factura
    //grabar en productodetalle
    //transacciones
    if(this.ventasForm.instance.validate().isValid){
      let grabar = true
      this.clientes.forEach(element => {
        if(element.ruc == this.factura.cliente.ruc)
          grabar = false
      });

      new Promise<any>((resolve, reject) => {
  //      if(grabar)
          this.db
            .collection("/clientes")
            .doc(this.factura.cliente.ruc).set({ ...this.factura.cliente })
            .then(res => { }, err => reject(err));
            //console.log("los datos"+this.factura.cliente.cliente_nombre)
        this.db
          .collection("/facturas")
          .doc(this.factura.documento_n.toString()).set({ ...this.factura.cliente })
          .then(res => { }, err => reject(err));

        this.productosVendidos.forEach(element => {
          element.factura_id = this.factura.documento_n
          console.log("aqui inicio"+element);
          console.log("aqui inicio"+element.factura_id);
          console.log("cantidad"+element.cantidad);
          console.log("aqui inicio"+element.disponible);
          console.log("aqui inicio"+element.entregar);
          console.log("equivalencia"+element.equivalencia);
          console.log("producto"+element.producto.REFERENCIA);
          console.log("aqui inicio"+this.factura.cliente);
          
          this.db.collection("/productosVendidos").add({ ... element})
          .then(res => { }, err => reject(err));

      /*    this.transaccion = new transaccion()
          this.transaccion.marca_temporal = new Date(this.transaccion.marca_temporal.getDate())
          this.transaccion.fecha=this.factura.fecha
          this.transaccion.sucursal="Milagro"
          this.transaccion.documento=null
          this.transaccion.producto=element.nombreComercial
          this.transaccion.cajas=null
          this.transaccion.piezas=element.cantidad*-1

          this.db.collection("/transacciones")
          .add({ ...this.transaccion })
          .then(res => { }, err => reject(err));
*/
        });
      });
    }
    //window.location.reload();
    this.getFactureros();
    this.crearPDF();
   
    


    
        
    }}
 /* generarCotizacion(e) {
    //SE DEBE GRABAR EL ENCABEZADO DE LA FACTURA Y SU DETALLE EN LA BASE DE DATOS
    //validar todo 
    //grabar en usuarios
    //grabar en factura
    //grabar en productodetalle
    //transacciones
    if(this.ventasForm.instance.validate().isValid){
      let grabar = true
      this.clientes.forEach(element => {
        if(element.ruc == this.factura.cliente.ruc)
          grabar = false
      });

      new Promise<any>((resolve, reject) => {
        if(grabar)
          this.db
            .collection("/clientes")
            .doc(this.factura.cliente.ruc).set({ ...this.factura.cliente })
            .then(res => { }, err => reject(err));
        this.db
          .collection("/cotizaciones")
          .add({ ...this.factura })
          .then(res => { }, err => reject(err));
        this.productosVendidos.forEach(element => {
          /*this.db.collection("/productosVendidos")
          .doc(i.toString()).set({ ...element })
          .then(res => { }, err => reject(err));

          this.transaccion = new transaccion()
          this.transaccion.marca_temporal = new Date(this.transaccion.marca_temporal.getDate())
          this.transaccion.fecha=this.factura.fecha
          this.transaccion.sucursal="Milagro"
          this.transaccion.documento=null
          this.transaccion.producto=element.nombreComercial
          this.transaccion.cajas=null
          this.transaccion.piezas=element.cantidad*-1

          this.db.collection("/transacciones")
          .add({ ...this.transaccion })
          .then(res => { }, err => reject(err));

          i++*/
  /*      });
      });
    }
        
    }
  /*generarNotaDeVenta(e) {
    let i = 0
    //SE DEBE GRABAR EL ENCABEZADO DE LA FACTURA Y SU DETALLE EN LA BASE DE DATOS
    //validar todo 
    //grabar en usuarios
    //grabar en factura
    //grabar en productodetalle
    //transacciones
    if(this.ventasForm.instance.validate().isValid){
      let grabar = true
      this.clientes.forEach(element => {
        if(element.ruc == this.factura.cliente.ruc)
          grabar = false
      });

      new Promise<any>((resolve, reject) => {
        if(grabar)
          this.db
            .collection("/clientes")
            .doc(this.factura.cliente.ruc).set({ ...this.factura.cliente })
            .then(res => { }, err => reject(err));
        this.db
          .collection("/notas_venta")
          .doc(i.toString()).set({ ...this.factura })
          .then(res => { }, err => reject(err));
        this.productosVendidos.forEach(element => {
          this.db.collection("/productosVendidos")
          .doc(i.toString()).set({ ...element })
          .then(res => { }, err => reject(err));

          /*this.transaccion = new transaccion()
          this.transaccion.marca_temporal = new Date(this.transaccion.marca_temporal.getDate())
          this.transaccion.fecha=this.factura.fecha
          this.transaccion.sucursal="Milagro"
          this.transaccion.documento=null
          this.transaccion.producto=element.nombreComercial
          this.transaccion.cajas=null
          this.transaccion.piezas=element.cantidad*-1

          this.db.collection("/transacciones")
          .add({ ...this.transaccion })
          .then(res => { }, err => reject(err));

          i++*/
    /*    });
      });
    }
      
    }
  }*/

