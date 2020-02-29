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
 nombre:string
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
        if (element.nombreComercial == tmp.nombreComercial) {
          let metros = (element.m_caja * tmp.cantidad) + (this.cantidadPiezas * element.m_caja / element.p_caja);
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
      if(data != null)
        this.clientes = data

    })

    this.db.collection('/factureros').doc('matriz').valueChanges().subscribe(data => {
      console.log(data)
      if(data != null)
        this.factura.documento = data['n_factura']

    })

    this.factura.vendedor=this.afAuth.auth.currentUser.email

  }


  getClientNames(){
    let names = []
    this.clientes.forEach(element => {
      names.push(element.nombre)    
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
  console.log("siiiii")
    if(element.nombre == e.component._changedValue)
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

        let cajas = Math.trunc(this.productosVendidos[i].cantidad / element.m_caja);
        console.log("CAJAS " + cajas)
        let piezas = Math.trunc(this.productosVendidos[i].cantidad * element.p_caja / element.m_caja) - (cajas * element.p_caja);

        this.productosVendidos[i].equivalencia = cajas + "C " + piezas + "P"
    })
  }

  calcularTotalRow(i:number) {
    this.productosVendidos[i].total = this.productosVendidos[i].cantidad * this.productosVendidos[i].precio_venta
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
          .collection("/facturas")
          .doc(this.factura.documento.toString()).set({ ...this.factura })
          .then(res => { }, err => reject(err));
        this.productosVendidos.forEach(element => {
          element.factura = this.factura.documento
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
  generarCotizacion(e) {
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
        });
      });
    }
        
    }
  generarNotaDeVenta(e) {
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
        });
      });
    }
        
    }
  }

