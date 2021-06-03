import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Producto } from "../pages/compras/compra";
import { producto } from "../pages/ventas/venta";

@Injectable({
  providedIn: "root",
})
export class ProductoService {
  empresa: Producto[];

  private URL = 'http://localhost:3000/producto'; //localhost
  //private URL = "http://104.248.14.190:3000/producto";
  //private URL = "http://104.131.82.174:3000/producto";
  constructor(public http: HttpClient, public router: Router) {}

  newProducto(producto) {
    return this.http.post<any>(this.URL + "/newProducto", producto);
  }

  getProducto() {
    return this.http.get(this.URL + "/getProductos");
  }

  getProductobyId(id: string) {
    return this.http.get(this.URL + `/getProductobyID/${id}`);
  }

  getProductosActivos() {
    return this.http.get(this.URL + "/getProductosActivos");
  }

  updateProducto(producto) {
    return this.http.put(this.URL + `/update/${producto._id}`, producto);
  }

  deleteProducto(producto) {
    return this.http.delete(this.URL + `/delete/${producto._id}`, producto);
  }

  updateProductosSucursales(
    producto,
    suc1: number,
    suc2: number,
    suc3: number
  ) {
    return this.http.put(
      this.URL +
        `/updateProductosSucursales/${producto._id}/${suc1}/${suc2}/${suc3}`,
      producto
    );
  }

  updateProductosSucursalesNuevo(productoActualizable) {
    return this.http.post(
      this.URL + `/updateProductosSucursalesNuevo`,
      productoActualizable
    );
  }

  updateProductoEstado(producto: string, estado: string) {
    return this.http.put(
      this.URL + `/updateEstado/${producto}/${estado}`,
      producto
    );
  }

  updateProductoBodegaProveedor(producto) {
    return this.http.put(this.URL + `/updateBodega/${producto._id}`, producto);
  }
  //updatePCatalogo/:producto/:referencia/:nombre/:aplicacion
  updateProductoCatalogo(
    producto: string,
    referencia: string,
    nombre: string,
    aplicacion: string,
    m2: number,
    pcajas: number,
    ganancia: number,
    precio: number,
    estado: string
  ) {
    return this.http.put(
      this.URL +
        `/updatePCatalogo/${producto}/${referencia}/${nombre}/${aplicacion}/${m2}/${pcajas}/${ganancia}/${precio}/${estado}`,
      producto
    );
  }

  updateProductoAplicacion(id: string, aplicacion: string) {
    return this.http.put(
      this.URL + `/updateAplicacion/${id}/${aplicacion}`,
      aplicacion
    );
  }

  updateProductoSucursal1ComD(producto, suma: number, precio: number) {
    return this.http.put(
      this.URL + `/updateProductoSuc1Dir/${producto._id}/${suma}/${precio}`,
      producto
    );
  }

  updateProductoSucursal2ComD(producto, suma: number, precio: number) {
    return this.http.put(
      this.URL + `/updateProductoSuc2Dir/${producto._id}/${suma}/${precio}`,
      producto
    );
  }

  updateProductoUbicaciones(producto) {
    return this.http.put(
      this.URL + `/updateProductoUbicaciones/${producto._id}`,
      producto
    );
  }

  updateProductoNotas(producto) {
    return this.http.put(
      this.URL + `/updateProductoNotas/${producto._id}`,
      producto
    );
  }

  updateProductoSucursal3ComD(producto, suma: number, precio: number) {
    return this.http.put(
      this.URL + `/updateProductoSuc3Dir/${producto._id}/${suma}/${precio}`,
      producto
    );
  }

  updateProductoSucursal1(producto) {
    return this.http.put(
      this.URL + `/updateProductoSuc1/${producto._id}`,
      producto
    );
  }

  updateProductoSucursal2(producto) {
    return this.http.put(
      this.URL + `/updateProductoSuc2/${producto._id}`,
      producto
    );
  }

  updateProductoSucursal3(producto) {
    return this.http.put(
      this.URL + `/updateProductoSuc3/${producto._id}`,
      producto
    );
  }

  updateProductoSucursal1conBodega(producto) {
    return this.http.put(
      this.URL + `/updateProductoSuc1conBodega/${producto._id}`,
      producto
    );
  }

  updateProductoSucursal2conBodega(producto) {
    return this.http.put(
      this.URL + `/updateProductoSuc2conBodega/${producto._id}`,
      producto
    );
  }

  updateProductoSucursal3conBodega(producto) {
    return this.http.put(
      this.URL + `/updateProductoSuc3conBodega/${producto._id}`,
      producto
    );
  }

  updateProductoSucursal1Bodega(producto) {
    return this.http.put(
      this.URL + `/updateProductoSuc1Bodega/${producto._id}`,
      producto
    );
  }

  updateProductoSucursal2Bodega(producto) {
    return this.http.put(
      this.URL + `/updateProductoSuc2Bodega/${producto._id}`,
      producto
    );
  }

  updateProductoSucursal3Bodega(producto) {
    return this.http.put(
      this.URL + `/updateProductoSuc3Bodega/${producto._id}`,
      producto
    );
  }

  updateProductoPendienteSucursal1(producto, num: number) {
    return this.http.put(
      this.URL + `/updateProductoPenSuc1/${producto._id}/${num}`,
      producto
    );
  }

  updateProductoPendienteSucursal2(producto, num: number) {
    return this.http.put(
      this.URL + `/updateProductoPenSuc2/${producto._id}/${num}`,
      producto
    );
  }

  updateProductoPendienteSucursal3(producto, num: number) {
    return this.http.put(
      this.URL + `/updateProductoPenSuc3/${producto._id}/${num}`,
      producto
    );
  }
}
