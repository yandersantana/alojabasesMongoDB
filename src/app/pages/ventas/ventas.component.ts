import { Component, OnInit, ViewChild } from '@angular/core';
import { Factura, Cliente } from './venta';
import { Producto, ProductoDetalleVenta } from '../producto/producto';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { CalculadoraComponent } from './calculadora/calculadora.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { compra } from '../compras/compra';
import { DxFormComponent } from 'devextreme-angular';
import { transaccion } from '../transacciones/transacciones';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  factura : Factura;
  now: Date = new Date();
  maxDate:Date = new Date();
  minDate:Date = new Date();
  productos: Producto[] = []
  clientes:Cliente[] = []
  sePuedeCalcular:Boolean
  compras: compra[] = []
  transaccion:transaccion
  productosVendidos: ProductoDetalleVenta[] = []
  newButtonEnabled: boolean = true
  medida: string = "m2"
  cantidad: number
  cantidadPiezas: number
  visibleCalculadora: boolean = false
  valorEnM2:number
  @ViewChild('ventasForm', { static: false }) ventasForm: DxFormComponent;

  constructor(private db: AngularFirestore, public  afAuth:  AngularFireAuth) {
    this.factura = new Factura()
    this.factura.fecha = new Date()
    this.maxDate = new Date(this.maxDate.setDate(this.maxDate.getDate() - 2));
    this.minDate = this.now
    
    this.productosVendidos.push(new ProductoDetalleVenta)

  }

  anadirProducto = (e) => {
    this.newButtonEnabled = true
    this.productosVendidos.push(new ProductoDetalleVenta())

  }

  verCalculadora(e) {
    this.visibleCalculadora = true
    console.log(this.productosVendidos[this.productosVendidos.length - 1].nombreComercial)
    if(this.productosVendidos[this.productosVendidos.length - 1].nombreComercial != undefined){
      this.sePuedeCalcular=true

    }
    else{
      this.sePuedeCalcular = false;
    }
  }

stringIsNumber(s) {
    var x = +s; // made cast obvious for demonstration
    return x.toString() === s;
}

  ct:string = ""
  //VA A COGER SIEMPRE EL ULTIMO
  calcularMetros(e) {
    if (this.stringIsNumber(e.event.key)){
      this.ct = this.ct + e.event.key

    }
   /*   let tmp = this.productosVendidos[this.productosVendidos.length - 1].nombreComercial.split(' - ')
      this.productos.forEach(element => {
        if (element['clasificacion'] == tmp[0] && element['nombre'] == tmp[1] && element['dimension'] == tmp[2] && element['calidad'] == tmp[3]) {
          let metros = (element['m_caja'] * parseInt(this.ct)) + (this.cantidadPiezas * element['m_caja'] / element['p_caja']);
         console.log((element['m_caja'] * parseInt(this.ct)))
         console.log(metros)

          this.valorEnM2 = metros
        }
      })
    
    */

  }

  obtenerDatosDeProductoParaUnDetalle(e) {

    //se debe validar por e
    
    let compra:compra
    this.newButtonEnabled = false
    compra=this.compras.filter(x=>x.producto == e.value)[0]
    console.log(compra)
    this.productosVendidos[this.productosVendidos.length - 1].disponible = compra.cantidad
    this.productosVendidos[this.productosVendidos.length - 1].precio_min = compra.precio * compra.porcentaje_ganancia / 100 + compra.precio
    
  }

  //se ejecuta apenas se carga la pantalla
  ngOnInit() {
    this.db.collection('/productos').valueChanges().subscribe((data:Producto[]) => {
      this.productos = data
      this.generarNombresProductos()
      console.log(this.productos)
    })
    this.db.collection('/compras').valueChanges().subscribe((data:compra[]) => {
      this.compras = data

    })


    this.db.collection('/clientes').valueChanges().subscribe((data:Cliente[]) => {
      this.clientes = data

    })

    this.factura.vendedor=this.afAuth.auth.currentUser.email

  }


  deleteProductoVendido(i){
    this.productosVendidos.splice(i,1);
    this.calcularTotalFactura()
        }

  setClienteData(e){
    this.factura.documento = e.value
    this.factura.direccion = this.clientes.filter(x=>x.ruc = e.value)[0].direccion
  }

  carcularTotalProducto(e) {
    console.log(e)
    this.calcularTotalRow()
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

  calcularEquivalencia(e) {

    this.productos.forEach(element => {

        let cajas = Math.trunc(this.productosVendidos[this.productosVendidos.length - 1].cantidad / element.m_caja);
        console.log("CAJAS " + cajas)
        let piezas = Math.trunc(this.productosVendidos[this.productosVendidos.length - 1].cantidad * element.p_caja / element.m_caja) - (cajas * element.p_caja);

        this.productosVendidos[this.productosVendidos.length - 1].equivalencia = cajas + "C " + piezas + "P"
    })
  }

  calcularTotalRow() {
    this.productosVendidos[this.productosVendidos.length - 1].total = this.productosVendidos[this.productosVendidos.length - 1].cantidad * this.productosVendidos[this.productosVendidos.length - 1].precio_venta
    console.log(this.productosVendidos[this.productosVendidos.length - 1].cantidad)
    console.log(this.productosVendidos[this.productosVendidos.length - 1].precio_venta)
    console.log(this.productosVendidos[this.productosVendidos.length - 1].total)
  }
  generarNombresProductos() {
    this.productos.forEach(element => {
      element.nombreComercial = element.clasificacion + " - " + element.nombre + " - " + element.dimension + " - " + element.calidad
    });
  }

  generarFactura(e) {
    let i = 0
    //SE DEBE GRABAR EL ENCABEZADO DE LA FACTURA Y SU DETALLE EN LA BASE DE DATOS
    //validar todo 
    //grabar en usuarios
    //grabar en factura
    //grabar en productodetalle
    //transacciones
    if(this.ventasForm.instance.validate().isValid){
      console.log("valido")
      new Promise<any>((resolve, reject) => {
        this.db
          .collection("/facturas")
          .doc(i.toString()).set({ ...this.factura })
          .then(res => { }, err => reject(err));
        this.productosVendidos.forEach(element => {
          this.db.collection("/productosVendidos")
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

          i++
        });
      });
    }
        
    }
  }

