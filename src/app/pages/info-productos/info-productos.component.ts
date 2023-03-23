import { Component, OnInit } from '@angular/core';
import { catalogo } from '../catalogo/catalogo';
import { CatalogoService } from 'src/app/servicios/catalogo.service';
import { ActivatedRoute } from '@angular/router';
import { producto } from '../ventas/venta';
import { ProductoService } from 'src/app/servicios/producto.service';
import { infoprod } from './info-productos';
import { ControlPreciosService } from 'src/app/servicios/control-precios.service';
import { PrecioEspecialService } from 'src/app/servicios/precio-especial.service';
import { preciosEspeciales, precios } from '../control-precios/controlPrecios';
import { inventario, productoTransaccion } from '../consolidado/consolidado';
import { transaccion } from '../transacciones/transacciones';
import { TransaccionesService } from 'src/app/servicios/transacciones.service';

@Component({
  selector: 'app-info-productos',
  templateUrl: './info-productos.component.html',
  styleUrls: ['./info-productos.component.scss']
})
export class InfoProductosComponent implements OnInit {
  catalogoLeido:catalogo
  productoLeido:producto
  productosActivos:producto[]=[]
  productosCatalogo:catalogo[]=[]
  idProducto:string=""
  infoproducto: infoprod
  imagenes:string[]
  precios:precios[]=[]
  ubi1:string[]=[]
  ubi2:string[]=[]
  ubi3:string[]=[]
  preciosEspeciales:preciosEspeciales[]=[]
  prodSuc1=0
  prodSuc2=0
  prodSuc3=0
  prodBod=0
  invetarioP: inventario[] = [];
  invetarioProd: inventario;
  transaccionesGlobales: transaccion[] = [];
  transaccionesCompras: transaccion[] = [];
  mostrarTabla = false;
  proTransaccion: productoTransaccion;
  nombre_producto: string;
  mensajeLoading = "Cargando";
  mostrarLoading = false;
  transacciones: transaccion[] = [];

  constructor(public catalogoService: CatalogoService,
    public preciosEspecialesService:PrecioEspecialService,
    public preciosService:ControlPreciosService, 
    private rutaActiva: ActivatedRoute,
    private transaccionesService: TransaccionesService,
    public productoService:ProductoService) {
    this.idProducto = this.rutaActiva.snapshot.paramMap.get("id")
    this.infoproducto = new infoprod();
    this.proTransaccion = new productoTransaccion();
   }

  ngOnInit() {
    this.traerProductosCatalogo()
    this.traerPrecios()
    this.traerPreciosEspeciales()
    this.traerProductosActivos()
  }

  traerProductosCatalogo(){
    const promesaUser = new Promise((res, err)=>{
    this.catalogoService.getCatalogo().subscribe(res => {
      this.productosCatalogo = res as catalogo[];
      this.traerProductoId()
   })
  });
   
  }

  traerPrecios(){
    this.preciosService.getPrecio().subscribe(res => {
      this.precios = res as precios[];
   })
  }

  traerPreciosEspeciales(){
    this.preciosEspecialesService.getPrecio().subscribe(res => {
      this.preciosEspeciales = res as preciosEspeciales[];
   })
  }

  traerProductoId(){
    this.productoService.getProductobyId(this.idProducto).subscribe(res => {
      this.productoLeido = res as producto;
      this.obtenerDatosDeProductoParaUnDetalle()
   })
  }

  traerProductos(){
    this.productoService.getProducto().subscribe(res => {
      this.productoLeido = res as producto;
   })
  }

  traerProductosActivos(){
    this.productoService.getProducto().subscribe(res => {
      this.productosActivos = res as producto[];
   })
  }

  
  actualizarDato( event: any) {
     this.infoproducto.cantidad = event.target.textContent;
     this.precios.forEach(element=>{
      if(element.aplicacion == this.infoproducto.productoLeido.APLICACION){
        if(this.infoproducto.cantidad >0 && this.infoproducto.cantidad <=element.cant1){
          this.infoproducto.precioCliente = parseFloat((this.infoproducto.productoLeido.precio * element.percent1 / 100 + this.infoproducto.productoLeido.precio).toFixed(2))
          
        }
        if(this.infoproducto.cantidad >element.cant1 && this.infoproducto.cantidad <=element.cant2){
          this.infoproducto.precioCliente = parseFloat((this.infoproducto.productoLeido.precio * element.percent2 / 100 + this.infoproducto.productoLeido.precio).toFixed(2))
        }

        if(this.infoproducto.cantidad >element.cant2){
          this.infoproducto.precioCliente = parseFloat((this.infoproducto.productoLeido.precio * element.percent3 / 100 + this.infoproducto.productoLeido.precio).toFixed(2))
         
        }
      }
    })
   }



   traerTransaccionesPorRango() {
    this.mostrarTabla = true;
    this.transaccionesCompras = [];
    this.transaccionesGlobales = [];
    var fechaHoy = new Date();
    var fechaAnterior = new Date();
    fechaHoy.setDate(fechaHoy.getDate() + 1);
    fechaAnterior.setDate(fechaHoy.getDate() - 60);
    this.proTransaccion.nombre = this.nombre_producto;
    this.proTransaccion.fechaActual = fechaHoy;
    this.proTransaccion.fechaAnterior = fechaAnterior;
    this.transaccionesService
      .getTransaccionesPorProductoYFecha(this.proTransaccion)
      .subscribe((res) => {
        this.transaccionesGlobales = res as transaccion[];
        this.buscarTransacciones();
      });
  }

  buscarTransacciones() {
    this.transaccionesGlobales.forEach((element) => {
      if (
        element.tipo_transaccion == "venta-not" ||
        element.tipo_transaccion == "venta-fact"
      ) {
        this.transaccionesCompras.push(element);
      }
    });
  }


  traerTransaccionesPorProducto() {
    this.mensajeLoading = "Buscando transacciones";
    this.mostrarLoading = true;

    this.transaccionesService.getTransaccionesPorProducto(this.proTransaccion).subscribe((res) => {
      this.transacciones = res as transaccion[];
      this.cargarDatosProductoUnitario();
    });

  }


  obtenerDatosDeProductoParaUnDetalle() {
    this.mostrarTabla = false;
    this.transaccionesCompras = [];
    this.transaccionesGlobales = [];
    this.invetarioP = [];
    this.transacciones = [];
    this.nombre_producto = this.productoLeido.PRODUCTO;
    this.proTransaccion.nombre = this.productoLeido.PRODUCTO;
    this.traerTransaccionesPorProducto();

    this.productosActivos.forEach((element) => {
      if (element.PRODUCTO == this.nombre_producto) 
        this.productoLeido = element;
    });
    this.cargarProductoTabla();
  }


  cargarProductoTabla() {
    this.infoproducto.producto = this.productoLeido.PRODUCTO;
    this.infoproducto.precioCosto = this.productoLeido.precio;
    this.infoproducto.productoLeido = this.productoLeido;
    this.infoproducto.piezas = this.productoLeido.P_CAJA;
    this.infoproducto.metros = this.productoLeido.M2;
    this.infoproducto.fabrica = "";

    this.infoproducto.disponibilidad =
      this.productoLeido.sucursal1 +
      "M  - " +
      this.productoLeido.sucursal2 +
      "S1  - " +
      this.productoLeido.sucursal3 +
      "S2  - " +
      this.productoLeido.bodegaProveedor +
      "P ";
    this.prodSuc1 = parseFloat(this.productoLeido.sucursal1.toFixed(2));
    this.prodSuc2 = parseFloat(this.productoLeido.sucursal2.toFixed(2));
    this.prodSuc3 = parseFloat(this.productoLeido.sucursal3.toFixed(2));
    this.prodBod = parseFloat(
      Number(this.productoLeido.bodegaProveedor).toFixed(2)
    );
    if (this.prodSuc1 < 0) {
      this.prodSuc1 = 0;
    }
    if (this.prodSuc2 < 0) {
      this.prodSuc2 = 0;
    }
    if (this.prodSuc3 < 0) {
      this.prodSuc3 = 0;
    }
    if (this.prodBod < 0) {
      this.prodBod = 0;
    }
    this.infoproducto.ubicacion =
      "M(" +
      this.productoLeido.ubicacionSuc1 +
      ") - " +
      "S1(" +
      this.productoLeido.ubicacionSuc2 +
      ") - " +
      "S2(" +
      this.productoLeido.ubicacionSuc3 +
      ") ";
    this.ubi1 = this.productoLeido.ubicacionSuc1;
    this.ubi2 = this.productoLeido.ubicacionSuc2;
    this.ubi3 = this.productoLeido.ubicacionSuc3;
    //this.infoproducto.notas = this.productoLeido.notas;
    this.infoproducto.notas = ""
    this.productoLeido.notas.forEach((element) => {
      this.infoproducto.notas = element +" , "+ this.infoproducto.notas
    });

    this.productosCatalogo.forEach((element) => {
      if (element.PRODUCTO == this.infoproducto.producto) {
        //this.infoproducto.notas = element.notas;
        this.infoproducto.fabrica = element.CASA;
        this.imagenes = element.IMAGEN;
      }
    });
    

    this.infoproducto.cantidad = 1;
    this.infoproducto.precioCliente = parseFloat(
      (
        this.infoproducto.productoLeido.precio *
          (this.infoproducto.productoLeido.porcentaje_ganancia / 100) +
        this.infoproducto.productoLeido.precio
      ).toFixed(2)
    );
    this.precios.forEach((element) => {
      if (element.aplicacion == this.infoproducto.productoLeido.APLICACION) {
        if (
          this.infoproducto.cantidad > 0 &&
          this.infoproducto.cantidad <= element.cant1
        ) {
          this.infoproducto.precioCliente = parseFloat(
            (
              (this.infoproducto.productoLeido.precio * element.percent1) /
                100 +
              this.infoproducto.productoLeido.precio
            ).toFixed(2)
          );
        }
        if (
          this.infoproducto.cantidad > element.cant1 &&
          this.infoproducto.cantidad <= element.cant2
        ) {
          this.infoproducto.precioCliente = parseFloat(
            (
              (this.infoproducto.productoLeido.precio * element.percent2) /
                100 +
              this.infoproducto.productoLeido.precio
            ).toFixed(2)
          );
        }

        if (this.infoproducto.cantidad > element.cant2) {
          this.infoproducto.precioCliente = parseFloat(
            (
              (this.infoproducto.productoLeido.precio * element.percent3) /
                100 +
              this.infoproducto.productoLeido.precio
            ).toFixed(2)
          );
        }
      }
    });

    //precio distribuidor
    this.infoproducto.precioDist = parseFloat(
      (
        (this.infoproducto.productoLeido.precio *
          this.preciosEspeciales[0].precioDistribuidor) /
          100 +
        this.infoproducto.productoLeido.precio
      ).toFixed(2)
    );
    //precio socio
    this.infoproducto.precioSocio = parseFloat(
      (
        (this.infoproducto.productoLeido.precio *
          this.preciosEspeciales[0].precioSocio) /
          100 +
        this.infoproducto.productoLeido.precio
      ).toFixed(2)
    );
  }

  cargarDatosProductoUnitario() {
    var contCajas = 0;
    var contCajas2 = 0;
    var contCajas3 = 0;
    var contPiezas = 0;
    var contPiezas2 = 0;
    var contPiezas3 = 0;
    for (let index = 0; index < this.productosActivos.length; index++) {
      const element2 = this.productosActivos[index];

      this.transacciones.forEach((element) => {
        if ( element2.PRODUCTO == element.producto && element.sucursal == "matriz") {
          switch (element.tipo_transaccion) {
            case "devolucion":
              contCajas = Number(element.cajas) + contCajas;
              contPiezas = Number(element.piezas) + contPiezas;
              break;
            case "compra-dir":
              contCajas = Number(contCajas) + Number(element.cajas);
              contPiezas = Number(contPiezas) + Number(element.piezas);
              break;
            case "compra":
              contCajas = Number(contCajas) + Number(element.cajas);
              contPiezas = Number(contPiezas) + Number(element.piezas);
              break;
            case "compra_obs":
              contCajas = Number(contCajas) + Number(element.cajas);
              contPiezas = Number(contPiezas) + Number(element.piezas);
              break;
            case "ajuste-faltante":
              contCajas = Number(contCajas) - Number(element.cajas);
              contPiezas = Number(contPiezas) - Number(element.piezas);
              break;
            case "baja":
              contCajas = Number(contCajas) - Number(element.cajas);
              contPiezas = Number(contPiezas) - Number(element.piezas);
              break;
            case "venta-fact":
              contCajas = Number(contCajas) - Number(element.cajas);
              contPiezas = Number(contPiezas) - Number(element.piezas);
              break;
            case "venta-not":
              contCajas = Number(contCajas) - Number(element.cajas);
              contPiezas = Number(contPiezas) - Number(element.piezas);
              break;
            case "traslado1":
              contCajas = Number(contCajas) - Number(element.cajas);
              contPiezas = Number(contPiezas) - Number(element.piezas);
              break;
            case "traslado2":
              contCajas = Number(contCajas) + Number(element.cajas);
              contPiezas = Number(contPiezas) + Number(element.piezas);
              break;
            case "ajuste-sobrante":
              contCajas = Number(contCajas) + Number(element.cajas);
              contPiezas = Number(contPiezas) + Number(element.piezas);

              break;
            default:
          }
        } else if (element2.PRODUCTO == element.producto && element.sucursal == "sucursal1") {
          switch (element.tipo_transaccion) {
            case "devolucion":
              contCajas2 = Number(element.cajas) + contCajas2;
              contPiezas2 = Number(element.piezas) + contPiezas2;
              break;
            case "compra-dir":
              contCajas2 = Number(contCajas2) + Number(element.cajas);
              contPiezas2 = Number(contPiezas2) + Number(element.piezas);
              break;
            case "compra":
              contCajas2 = Number(contCajas2) + Number(element.cajas);
              contPiezas2 = Number(contPiezas2) + Number(element.piezas);
              break;
            case "compra_obs":
              contCajas2 = Number(contCajas2) + Number(element.cajas);
              contPiezas2 = Number(contPiezas2) + Number(element.piezas);
              break;
            case "ajuste-faltante":
              contCajas2 = Number(contCajas2) - Number(element.cajas);
              contPiezas2 = Number(contPiezas2) - Number(element.piezas);
              break;
            case "baja":
              contCajas2 = Number(contCajas2) - Number(element.cajas);
              contPiezas2 = Number(contPiezas2) - Number(element.piezas);
              break;
            case "venta-fact":
              contCajas2 = Number(contCajas2) - Number(element.cajas);
              contPiezas2 = Number(contPiezas2) - Number(element.piezas);
              break;
            case "venta-not":
              contCajas2 = Number(contCajas2) - Number(element.cajas);
              contPiezas2 = Number(contPiezas2) - Number(element.piezas);
              break;
            case "traslado1":
              contCajas2 = Number(contCajas2) - Number(element.cajas);
              contPiezas2 = Number(contPiezas2) - Number(element.piezas);
              break;
            case "traslado2":
              contCajas2 = Number(contCajas2) + Number(element.cajas);
              contPiezas2 = Number(contPiezas2) + Number(element.piezas);
              break;
            case "ajuste-sobrante":
              contCajas2 = Number(contCajas2) + Number(element.cajas);
              contPiezas2 = Number(contPiezas2) + Number(element.piezas);
              break;
            default:
          }
        } else if ( element2.PRODUCTO == element.producto && element.sucursal == "sucursal2") {
          switch (element.tipo_transaccion) {
            case "devolucion":
              contCajas3 = Number(element.cajas) + contCajas3;
              contPiezas3 = Number(element.piezas) + contPiezas3;
              break;
            case "compra-dir":
              contCajas3 = Number(contCajas3) + Number(element.cajas);
              contPiezas3 = Number(contPiezas3) + Number(element.piezas);
              break;
            case "compra":
              contCajas3 = Number(contCajas3) + Number(element.cajas);
              contPiezas3 = Number(contPiezas3) + Number(element.piezas);
              break;
            case "compra_obs":
              contCajas3 = Number(contCajas3) + Number(element.cajas);
              contPiezas3 = Number(contPiezas3) + Number(element.piezas);
              break;
            case "ajuste-faltante":
              contCajas3 = Number(contCajas3) - Number(element.cajas);
              contPiezas3 = Number(contPiezas3) - Number(element.piezas);
              break;
            case "baja":
              contCajas3 = Number(contCajas3) - Number(element.cajas);
              contPiezas3 = Number(contPiezas3) - Number(element.piezas);
              break;
            case "venta-fact":
              contCajas3 = Number(contCajas3) - Number(element.cajas);
              contPiezas3 = Number(contPiezas3) - Number(element.piezas);
              break;
            case "venta-not":
              contCajas3 = Number(contCajas3) - Number(element.cajas);
              contPiezas3 = Number(contPiezas3) - Number(element.piezas);
              break;
            case "traslado1":
              contCajas3 = Number(contCajas3) - Number(element.cajas);
              contPiezas3 = Number(contPiezas3) - Number(element.piezas);
              break;
            case "traslado2":
              contCajas3 = Number(contCajas3) + Number(element.cajas);
              contPiezas3 = Number(contPiezas3) + Number(element.piezas);
              break;
            case "ajuste-sobrante":
              contCajas3 = Number(contCajas3) + Number(element.cajas);
              contPiezas3 = Number(contPiezas3) + Number(element.piezas);
              break;

            default:
          }
        }
      });
      this.invetarioProd = new inventario();
      this.invetarioProd.producto = element2;
      this.invetarioProd.cantidadCajas = contCajas;
      this.invetarioProd.cantidadCajas2 = contCajas2;
      this.invetarioProd.cantidadCajas3 = contCajas3;

      this.invetarioProd.cantidadPiezas = contPiezas;
      this.invetarioProd.cantidadPiezas2 = contPiezas2;
      this.invetarioProd.cantidadPiezas3 = contPiezas3;
      //this.invetarioProd.bodega= "S1 ("+this.bodegasMatriz+" ) S2 ("+this.bodegasSucursal1+") S3("+this.bodegasSucursal2+")"
      this.invetarioProd.bodega =
        "  S1 (" + element2.ubicacionSuc1 +
        ") S2 (" +element2.ubicacionSuc2 +
        ") S3(" + element2.ubicacionSuc3 +")";

      this.invetarioProd.ultimoPrecioCompra = element2.ultimoPrecioCompra;
      this.invetarioProd.ultimaFechaCompra = element2.ultimaFechaCompra;
      this.invetarioProd.porUtilidad = element2.porcentaje_ganancia;
      this.invetarioProd.valorProducto = (element2.porcentaje_ganancia * element2.precio) + element2.precio ;
      this.invetarioProd.notas = element2.notas;
      this.invetarioProd.execute = false;

      if (this.invetarioProd.producto.PRODUCTO == this.nombre_producto) 
        this.invetarioP.push(this.invetarioProd);
      
      contCajas = 0;
      contPiezas = 0;
      contCajas2 = 0;
      contPiezas2 = 0;
      contCajas3 = 0;
      contPiezas3 = 0;
    }
    this.transformarM2();
  }


  transformarM2() {
    this.invetarioP.forEach((element) => {
      element.cantidadM2 = parseFloat(
        (element.producto.M2 * element.cantidadCajas +(element.cantidadPiezas * element.producto.M2) /element.producto.P_CAJA).toFixed(2)
      );
      element.cantidadM2b2 = parseFloat(
        (element.producto.M2 * element.cantidadCajas2 + (element.cantidadPiezas2 * element.producto.M2) /element.producto.P_CAJA).toFixed(2)
      );
      element.cantidadM2b3 = parseFloat(
        (element.producto.M2 * element.cantidadCajas3 +(element.cantidadPiezas3 * element.producto.M2) / element.producto.P_CAJA ).toFixed(2)
      );
      element.totalb1 = parseFloat((element.cantidadM2 * element.producto.precio).toFixed(2));
      element.totalb2 = parseFloat((element.cantidadM2b2 * element.producto.precio).toFixed(2));
      element.totalb3 = parseFloat((element.cantidadM2b3 * element.producto.precio).toFixed(2));
    });
    this.cambiarValores();

  }


  cambiarValores() {
    this.invetarioP.forEach((element) => {
      element.cantidadCajas = Math.trunc( element.cantidadM2 / element.producto.M2);
      element.cantidadPiezas = parseInt( ((element.cantidadM2 * element.producto.P_CAJA) / element.producto.M2 -element.cantidadCajas * element.producto.P_CAJA ).toFixed(0));
      element.cantidadM2 = parseFloat(element.cantidadM2.toFixed(2));

      element.cantidadCajas2 = Math.trunc( element.cantidadM2b2 / element.producto.M2);
      element.cantidadPiezas2 = parseInt(( (element.cantidadM2b2 * element.producto.P_CAJA) /element.producto.M2 -element.cantidadCajas2 * element.producto.P_CAJA ).toFixed(0));
      element.cantidadM2b2 = parseFloat(element.cantidadM2b2.toFixed(2));

      element.cantidadCajas3 = Math.trunc( element.cantidadM2b3 / element.producto.M2 );
      element.cantidadPiezas3 = parseInt( ((element.cantidadM2b3 * element.producto.P_CAJA) / element.producto.M2 -element.cantidadCajas3 * element.producto.P_CAJA).toFixed(0) );
      element.cantidadM2b3 = parseFloat(element.cantidadM2b3.toFixed(2));
    });

    /* this.invetarioP.forEach((element) => {
      if(element.cantidadM2 < 0){
        element.cantidadCajas = 0
        element.cantidadPiezas = 0
        element.cantidadM2 = 0
      }
      if(element.cantidadM2b2 < 0){
        element.cantidadCajas2 = 0
        element.cantidadPiezas2 = 0
        element.cantidadM2b2 = 0
      }
      if(element.cantidadM2b3 < 0){
        element.cantidadCajas3 = 0
        element.cantidadPiezas3 = 0
        element.cantidadM2b3 = 0
      }
      
    }); */

    this.mostrarLoading = false;
  }


}
