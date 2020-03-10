import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { CalculadoraComponent } from './calculadora/calculadora.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { compra } from '../compras/compra';
import { DxFormComponent } from 'devextreme-angular';
import { transaccion } from '../transacciones/transacciones';
import { factura, cliente, venta, producto } from './venta';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
 nombre:string
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

  //@ViewChild('ventasForm', { static: false }) ventasForm: DxFormComponent;

  constructor(private db: AngularFirestore, public  afAuth:  AngularFireAuth) {
    this.factura = new factura()
    this.factura.fecha = new Date()
    this.maxDate = new Date(this.maxDate.setDate(this.maxDate.getDate() - 2));
    this.minDate = this.now
    
    this.productosVendidos.push(new venta)
    this.sucursales = []
    /*this.pdf.add("Hello world")
    
    try {
      this.pdf.create().download();
    } catch (err) {
      alert(err);
    }
*/
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

      this.factura.documento_n = facturero.payload.data()['n_factura']
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
    console.log(this.productosVendidos[this.productosVendidos.length - 1].producto.REFERENCIA)
    if(this.productosVendidos[this.productosVendidos.length - 1].producto.REFERENCIA != undefined){
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
    console.log(e)
    this.calcularTotalRow(i)
    this.calcularTotalFactura()
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

      if(element.PRODUCTO == this.productosVendidos[i].producto.REFERENCIA){
        let cajas = Math.trunc(this.productosVendidos[i].cantidad / element.M2);
        let piezas = Math.trunc(this.productosVendidos[i].cantidad * element.P_CAJA / element.M2) - (cajas * element.P_CAJA);

        this.productosVendidos[i].equivalencia = cajas + "C " + piezas + "P"
      }
    })
  }

  calcularTotalRow(i:number) {
    this.productosVendidos[i].total = this.productosVendidos[i].cantidad * this.productosVendidos[i].precio_venta
    console.log(this.productosVendidos[this.productosVendidos.length - 1].cantidad)
    console.log(this.productosVendidos[this.productosVendidos.length - 1].precio_venta)
    console.log(this.productosVendidos[this.productosVendidos.length - 1].total)
  }
  /*generarNombresProductos() {
    this.productos.forEach(element => {
      element.nombreComercial = element.clasificacion + " - " + element.nombre + " - " + element.dimension + " - " + element.calidad
    });
  }
*/
  generarFactura(e) {
    //SE DEBE GRABAR EL ENCABEZADO DE LA FACTURA Y SU DETALLE EN LA BASE DE DATOS
    //validar todo 
    //grabar en usuarios
    //grabar en factura
    //grabar en productodetalle
    //transacciones
    /*if(this.ventasForm.instance.validate().isValid){
      let grabar = true
      this.clientes.forEach(element => {
        if(element.ruc == this.factura.cliente.ruc)
          grabar = false
      });
*/
      new Promise<any>((resolve, reject) => {
  //      if(grabar)
          this.db
            .collection("/clientes")
            .doc(this.factura.cliente.ruc).set({ ...this.factura.cliente })
            .then(res => { }, err => reject(err));
        this.db
          .collection("/facturas")
          .doc(this.factura.documento_n.toString()).set({ ...this.factura })
          .then(res => { }, err => reject(err));
        this.productosVendidos.forEach(element => {
          element.factura_id = this.factura.documento_n
          this.db.collection("/productosVendidos").add({ ...element })
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
        
    }
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

