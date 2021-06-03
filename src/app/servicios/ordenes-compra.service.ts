import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class OrdenesCompraService {
  private URL = 'http://localhost:3000/ordenesCompra'; //localhost
  //private URL = "http://104.248.14.190:3000/ordenesCompra";
  //private URL = 'http://104.131.82.174:3000/ordenesCompra';
  constructor(public http: HttpClient, public router: Router) {}

  newOrden(venta) {
    return this.http.post<any>(this.URL + "/newOrdenes", venta);
  }

  getOrden() {
    return this.http.get(this.URL + "/getOrdenesCompra");
  }

  getOrdenEspecifica(ordenNueva) {
    return this.http.post(this.URL + `/getOrdenCompraEspecifica/${ordenNueva.n_orden}`,ordenNueva);
  }

  getOrdenesCompraPorRango(objFecha) {
    return this.http.post(this.URL + "/getOrdenesPorRango", objFecha);
  }

  getOrdenesMensuales(objFecha) {
    return this.http.post(this.URL + "/getOrdenesCompraMensuales", objFecha);
  }

  getOrdenbyID(id: string) {
    return this.http.get(this.URL + `/getOrdenesCompraID/${id}`);
  }

  updateOrden(ordenes) {
    return this.http.put(this.URL + `/update/${ordenes._id}`, ordenes);
  }

  updateEstadoProductos(ordenes: string, producto: string, estado: string) {
    return this.http.put(
      this.URL + `/updateEstadoProductos/${ordenes}/${producto}/${estado}`,
      ordenes
    );
  }

  updateEstadoProductosFactura(
    ordenes: string,
    producto: string,
    estado: string
  ) {
    console.log(
      "ssssssssss " +
        this.URL +
        `/updateEstadoProductosFactura/${ordenes}/${producto}/${estado}`
    );
    return this.http.put(
      this.URL +
        `/updateEstadoProductosFactura/${ordenes}/${producto}/${estado}`,
      ordenes
    );
  }

  updateEstadoOrden(ordenes, estado: string) {
    return this.http.put(
      this.URL + `/updateEstadoOrden/${ordenes._id}/${estado}`,
      ordenes
    );
  }

  updateEstadoOrden2(ordenes, estado: string) {
    console.log("sssssss " + ordenes._id + "estado +" + estado);
    return this.http.put(
      this.URL + `/updateEstadoOrdenes2/${ordenes._id}/${estado}`,
      ordenes
    );
  }

  updateEstadosOrdenes(orden: string, estado: string, estado2: string) {
    return this.http.put(
      this.URL + `/updateEstadosOrdenes/${orden}/${estado}/${estado2}`,
      orden
    );
  }

  updateOrdenEstadoRechazo(
    id: string,
    variable: string,
    mensaje: string,
    estado2: string
  ) {
    return this.http.put(
      this.URL + `/updateEstadoRechazo/${id}/${variable}/${mensaje}/${estado2}`,
      variable
    );
  }

  updateOrdenEstadoRechazo2(
    id: string,
    variable: string,
    mensaje: string,
    estado2: string
  ) {
    return this.http.put(
      this.URL +
        `/updateEstadoRechazo2/${id}/${variable}/${mensaje}/${estado2}`,
      variable
    );
  }

  updateOrdenEstadoAprobado(
    id: string,
    variable: string,
    orden: number,
    usuario: string,
    estado2: string
  ) {
    return this.http.put(
      this.URL +
        `/updateEstadoAprobado/${id}/${variable}/${orden}/${usuario}/${estado2}`,
      variable
    );
  }

  actualizarNota(orden, nota: string) {
    return this.http.put(
      this.URL + `/actualizarNota/${orden._id}/${nota}`,
      orden
    );
  }

  deleteOrden(ordenes) {
    return this.http.delete(this.URL + `/delete/${ordenes._id}`, ordenes);
  }
}
