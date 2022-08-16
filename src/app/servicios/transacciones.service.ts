import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { inventario, invFaltanteSucursal, productoTransaccion } from "../pages/consolidado/consolidado";
import { transaccion } from "../pages/transacciones/transacciones";
import { producto } from "../pages/ventas/venta";


@Injectable({
  providedIn: "root",
})

export class TransaccionesService {
  //private URL = "http://localhost:3000/transaccion"; //localhost
  private URL = "http://104.131.82.174:3000/transaccion";
  //private URL = "http://159.223.107.115:3000/transaccion";


  proTransaccion: productoTransaccion = new productoTransaccion();
  transacciones: transaccion[] = [];
  invetarioProd: inventario;
  invetarioP: inventario[] = [];
  invetarioFaltante1: invFaltanteSucursal;
  invetarioFaltante: invFaltanteSucursal[] = [];


  constructor(public http: HttpClient, public router: Router) {}

  newTransaccion(transaccion) {
    return this.http.post<any>(this.URL + "/newTransaccion", transaccion);
  }

  getTransaccion() {
    return this.http.get(this.URL + "/getTransacciones");
  }

  getTransaccionesPorRango(objFecha) {
    return this.http.post(this.URL + "/getTransaccionesPorRango", objFecha);
  }

  getTransaccionesPorProducto(producto) {
    return this.http.post(this.URL + "/getTransaccionesPorProducto", producto);
  }

  getTransaccionesPorTipoDocumento(tipobusqueda) {
    return this.http.post(this.URL + "/getTransaccionesPorTipoDocumento", tipobusqueda);
  }

  getTransaccionesPorProductoYFecha(producto) {
    return this.http.post(this.URL + "/getTransaccionesPorProductoYFecha",producto);
  }

  updateTransaccion(transaccion) {
    return this.http.put(this.URL + `/update/${transaccion._id}`, transaccion);
  }

  updateTransaccionEntrega(transaccion) {
    return this.http.put(this.URL + `/updateTransaccionEntrega/${transaccion._id}`, transaccion);
  }

  deleteTransaccion(transaccion) {
    return this.http.delete(this.URL + `/delete/${transaccion._id}`,transaccion);
  }

  deleteTransaccionPorDevoluciones(transaccion) {
    return this.http.post(this.URL + `/deletePorDocumento`, transaccion);
  }






  traerTransaccionesPorProducto(nombreProducto: producto) {
    this.proTransaccion.nombre = nombreProducto.PRODUCTO;
    this.getTransaccionesPorProducto(this.proTransaccion)
      .subscribe((res) => {
        this.transacciones = res as transaccion[];
        this.cargarDatosProductoUnitario(nombreProducto);
      });
  }


  cargarDatosProductoUnitario(nombreProducto : producto) {
    var contCajas = 0;
    var contCajas2 = 0;
    var contCajas3 = 0;
    var contPiezas = 0;
    var contPiezas2 = 0;
    var contPiezas3 = 0;

    this.transacciones.forEach((element) => {
      if ( nombreProducto.PRODUCTO == element.producto && element.sucursal == "matriz") {
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
      } else if ( nombreProducto.PRODUCTO == element.producto && element.sucursal == "sucursal1") {
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
      } else if ( nombreProducto.PRODUCTO == element.producto && element.sucursal == "sucursal2") {
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
    var cantidadRestante = 0;
    this.invetarioProd = new inventario();
    this.invetarioProd.producto = nombreProducto;
    this.invetarioProd.cantidadCajas = contCajas;
    this.invetarioProd.cantidadCajas2 = contCajas2;
    this.invetarioProd.cantidadCajas3 = contCajas3;

    this.invetarioProd.cantidadPiezas = contPiezas;
    this.invetarioProd.cantidadPiezas2 = contPiezas2;
    this.invetarioProd.cantidadPiezas3 = contPiezas3;
    //this.invetarioProd.bodega= "S1 ("+this.bodegasMatriz+" ) S2 ("+this.bodegasSucursal1+") S3("+this.bodegasSucursal2+")"
    //this.invetarioProd.bodega = "S1 (" +element2.ubicacionSuc1 +" ) S2 (" +element2.ubicacionSuc2 + ") S3(" + element2.ubicacionSuc3 +")";

    //this.invetarioProd.ultimoPrecioCompra = element2.ultimoPrecioCompra;
    //this.invetarioProd.ultimaFechaCompra = element2.ultimaFechaCompra;
    //this.invetarioProd.notas = element2.notas;
    this.invetarioProd.execute = false;
    //if (this.invetarioProd.producto.PRODUCTO == nombreProducto) {
      this.invetarioP.push(this.invetarioProd);
    //}

    contCajas = 0;
    contPiezas = 0;
    contCajas2 = 0;
    contPiezas2 = 0;
    contCajas3 = 0;
    contPiezas3 = 0;
    
    this.transformarM2();
  }



  transformarM2() {
    this.invetarioP.forEach((element) => {
      element.cantidadM2 = parseFloat(
        (
          element.producto.M2 * element.cantidadCajas +
          (element.cantidadPiezas * element.producto.M2) / element.producto.P_CAJA
        ).toFixed(2)
      );
      element.cantidadM2b2 = parseFloat(
        (
          element.producto.M2 * element.cantidadCajas2 +
          (element.cantidadPiezas2 * element.producto.M2) / element.producto.P_CAJA
        ).toFixed(2)
      );
      element.cantidadM2b3 = parseFloat(
        (
          element.producto.M2 * element.cantidadCajas3 +
          (element.cantidadPiezas3 * element.producto.M2) / element.producto.P_CAJA
        ).toFixed(2)
      );
      element.totalb1 = parseFloat( (element.cantidadM2 * element.producto.precio).toFixed(2) );
      element.totalb2 = parseFloat((element.cantidadM2b2 * element.producto.precio).toFixed(2));
      element.totalb3 = parseFloat( (element.cantidadM2b3 * element.producto.precio).toFixed(2));
    });
    //this.sumarProductosRestados();
    this.cambiarValores();
   // this.controlarInventario();
  }

  cambiarValores() {
    this.invetarioP.forEach((element) => {
      element.cantidadCajas = Math.trunc( element.cantidadM2 / element.producto.M2);
      element.cantidadPiezas = parseInt(
        (
          (element.cantidadM2 * element.producto.P_CAJA) / element.producto.M2 -
          element.cantidadCajas * element.producto.P_CAJA
        ).toFixed(0)
      );
      element.cantidadM2 = parseFloat(element.cantidadM2.toFixed(2));

      element.cantidadCajas2 = Math.trunc( element.cantidadM2b2 / element.producto.M2);
      element.cantidadPiezas2 = parseInt(
        (
          (element.cantidadM2b2 * element.producto.P_CAJA) /
            element.producto.M2 -
          element.cantidadCajas2 * element.producto.P_CAJA
        ).toFixed(0)
      );
      element.cantidadM2b2 = parseFloat(element.cantidadM2b2.toFixed(2));

      element.cantidadCajas3 = Math.trunc( element.cantidadM2b3 / element.producto.M2);
      element.cantidadPiezas3 = parseInt(
        (
          (element.cantidadM2b3 * element.producto.P_CAJA) /
            element.producto.M2 -
          element.cantidadCajas3 * element.producto.P_CAJA
        ).toFixed(0)
      );
      element.cantidadM2b3 = parseFloat(element.cantidadM2b3.toFixed(2));
    });

    console.log(this.invetarioP)
    return this.invetarioP;
  }

}
