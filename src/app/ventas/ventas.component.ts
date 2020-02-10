import { Component, OnInit } from '@angular/core';
import { Venta } from './venta';
import { Producto, ProductoDetalleVenta } from '../producto/producto';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  venta:Venta
   productos:any[] = []
   compras:any[] = []
   nombresProductos:string[] = []
   nombresComerciales:string[] = []
   productosVendidos:ProductoDetalleVenta[] = []
   newButtonEnabled:boolean=true
    medida:string = "m2"
   private visibleCalculadora:boolean=false

  constructor(private db:AngularFirestore) {
    this.venta= new Venta()
    this.productosVendidos.push(new ProductoDetalleVenta)

   }
   verCalculadora(e){

     this.visibleCalculadora = true
     console.log(this.visibleCalculadora)
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

  obtenerDatosDeProducto(e){
  this.newButtonEnabled = false

    let arraTmp = e.value.split(" - ")
    console.log(arraTmp)
    this.compras.forEach(element => {
      if(element['producto'] == e.value){
        this.productosVendidos[this.productosVendidos.length - 1].disponible = element['cantidad']  
        this.productosVendidos[this.productosVendidos.length - 1].precio_min = element['precio'] * element['porcentaje_ganancia'] / 100 + element['precio']
      }
    });
  }

  carcularTotalProducto(e){
    console.log(e)
    this.calcularTotalRow()
  }
  
  calcularEquivalencia(e){
    console.log(this.productosVendidos[this.productosVendidos.length - 1].nombreComercial)
    let tmp = this.productosVendidos[this.productosVendidos.length - 1].nombreComercial.split(' - ')
    
    this.productos.forEach(element => {
      console.log(tmp)
    console.log(element['clasificacion'])
    console.log(element['dimension'])
      if(element['clasificacion'] == tmp[0] && element['nombre'] == tmp[1] && element['dimension'] == tmp[2] && element['calidad'] == tmp[3]){
        console.log("entro")
       
      let cajas = Math.trunc(this.productosVendidos[this.productosVendidos.length - 1].cantidad/element['m_caja']);
      
      let piezas= (this.productosVendidos[this.productosVendidos.length - 1].cantidad * Math.trunc(element['p_caja'] /element['m_caja'])) -(cajas * element['p_caja']); 

      this.productosVendidos[this.productosVendidos.length - 1].equivalencia = piezas
      }})
    
  }

  calcularTotalRow(){
    this.productosVendidos[this.productosVendidos.length - 1].total = this.productosVendidos[this.productosVendidos.length - 1].cantidad * this.productosVendidos[this.productosVendidos.length - 1].precio_venta
    console.log(this.productosVendidos[this.productosVendidos.length - 1].cantidad)
    console.log(this.productosVendidos[this.productosVendidos.length - 1].precio_venta)
    console.log(this.productosVendidos[this.productosVendidos.length - 1].total)
  }
  generarNombresProductos(){
    this.productos.forEach(element => {
      this.nombresProductos.push(element['clasificacion'] + " - " + element['nombre'] + " - " + element['dimension'] + " - " + element['calidad'])
      this.nombresComerciales.push(element['clasificacion'] + " - " + element['nombre'])
    });
  }

  anadirProducto = (e) => {
    this.newButtonEnabled = true
    this.productosVendidos.push(new ProductoDetalleVenta())
  }

generarFactura(e){
  this.db
            .collection("coffeeOrders")
            .add(this.productosVendidos)
            .then(a => alert("Facturas ingresadas"));
    
}


}
