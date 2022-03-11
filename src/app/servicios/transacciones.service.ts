import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class TransaccionesService {
  //private URL = "http://localhost:3000/transaccion"; //localhost
  private URL = "http://104.131.82.174:3000/transaccion";
  //private URL = "http://159.223.107.115:3000/transaccion";
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

  deleteTransaccion(transaccion) {
    return this.http.delete(this.URL + `/delete/${transaccion._id}`,transaccion);
  }

  deleteTransaccionPorDevoluciones(transaccion) {
    return this.http.post(this.URL + `/deletePorDocumento`, transaccion);
  }
}
