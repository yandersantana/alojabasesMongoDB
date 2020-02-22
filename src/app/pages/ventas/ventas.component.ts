import { Component, OnInit } from '@angular/core';
import { Venta } from './venta';
import { Producto, ProductoDetalleVenta } from '../producto/producto';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { CalculadoraComponent } from './calculadora/calculadora.component';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  venta: Venta
  productos: any[] = []
  compras: any[] = []
  nombresProductos: string[] = []
  nombresComerciales: string[] = []
  productosVendidos: ProductoDetalleVenta[] = []
  newButtonEnabled: boolean = true
  medida: string = "m2"
  cantidad: number
  cantidadPiezas: number
  visibleCalculadora: boolean = false
  valorEnM2:number

  constructor(private db: AngularFirestore) {
    this.venta = new Venta()
    this.venta.fecha = new Date()
    this.productosVendidos.push(new ProductoDetalleVenta)

  }

  anadirProducto = (e) => {
    this.newButtonEnabled = true
    this.productosVendidos.push(new ProductoDetalleVenta())
  }

  verCalculadora(e) {
    this.visibleCalculadora = true
  }

  calcularMetros(e) {
    let tmp = this.productosVendidos[this.productosVendidos.length - 1].nombreComercial.split(' - ')
    this.productos.forEach(element => {
      if (element['clasificacion'] == tmp[0] && element['nombre'] == tmp[1] && element['dimension'] == tmp[2] && element['calidad'] == tmp[3]) {
        let metros = (element['m_caja'] * this.cantidad) + (this.cantidadPiezas * element['m_caja'] / element['p_caja']);
        this.valorEnM2 = metros
      }
    })

  }

  obtenerDatosDeProductoParaUnDetalle(e) {

    //se debe validar por e
    this.newButtonEnabled = false
    this.compras.forEach(element => {
      if (element['producto'] == e.value) {
        this.productosVendidos[this.productosVendidos.length - 1].disponible = element['cantidad']
        this.productosVendidos[this.productosVendidos.length - 1].precio_min = element['precio'] * element['porcentaje_ganancia'] / 100 + element['precio']
      }
    });
  }

  //se ejecuta apenas se carga la pantalla
  ngOnInit() {
    this.db.collection('/productos').valueChanges().subscribe(data => {
      this.productos = data
      this.generarNombresProductos()
      console.log(this.productos)
    })
    this.db.collection('/compras').valueChanges().subscribe(data => {
      this.compras = data

    })
  }

  carcularTotalProducto(e) {
    console.log(e)
    this.calcularTotalRow()
  }

  calcularEquivalencia(e) {
    console.log(this.productosVendidos[this.productosVendidos.length - 1].nombreComercial)
    let tmp = this.productosVendidos[this.productosVendidos.length - 1].nombreComercial.split(' - ')

    this.productos.forEach(element => {
      console.log(tmp)
      console.log(element['clasificacion'])
      console.log(element['dimension'])
      if (element['clasificacion'] == tmp[0] && element['nombre'] == tmp[1] && element['dimension'] == tmp[2] && element['calidad'] == tmp[3]) {
        console.log("entro")

        let cajas = Math.trunc(this.productosVendidos[this.productosVendidos.length - 1].cantidad / element['m_caja']);
        console.log("CAJAS " + cajas)
        let piezas = Math.trunc(this.productosVendidos[this.productosVendidos.length - 1].cantidad * element['p_caja'] / element['m_caja']) - (cajas * element['p_caja']);

        this.productosVendidos[this.productosVendidos.length - 1].equivalencia = cajas + "C " + piezas + "P"
      }
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
      this.nombresProductos.push(element['clasificacion'] + " - " + element['nombre'] + " - " + element['dimension'] + " - " + element['calidad'])
      this.nombresComerciales.push(element['clasificacion'] + " - " + element['nombre'])
    });
  }

  generarFactura(e) {
    //SE DEBE GRABAR EL ENCABEZADO DE LA FACTURA Y SU DETALLE EN LA BASE DE DATOS
    this.post().then(res => {
      console.log("bien")
    })
  }

  post() {
    return new Promise<any>((resolve, reject) => {
      this.db
        .collection("/ventas")
        .add({ ...this.productosVendidos[this.productosVendidos.length - 1] })
        .then(res => { }, err => reject(err));
    });
  }

}
