import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class TransaccionesChequesService {
  //private URL = "http://localhost:3000/transaccionesCheques"; //localhost
  private URL = "http://104.131.82.174:3000/transaccionesCheques";
  //private URL = "http://159.223.107.115:3000/transaccionesCheques";

  constructor(public http: HttpClient, public router: Router) {}

  newTransaccion(transaccion) {
    return this.http.post<any>(this.URL + "/newTransaccion", transaccion);
  }

  getTransacciones() {
    return this.http.get(this.URL + "/getTransacciones");
  }

  getTransaccionesPorRango(objFecha) {
    return this.http.post(this.URL + "/getTransaccionesPorRango", objFecha);
  }

  getTransaccionesPorRangoEstadoCubierto(objFecha) {
    return this.http.post(this.URL + "/getTransaccionesPorRangoEstadoCubierto", objFecha);
  }

  getTransaccionesPorTipoDocumento(tipobusqueda) {
    return this.http.post(this.URL + "/getTransaccionesPorTipoDocumento", tipobusqueda);
  }

  getTransaccionesPorIdPago(tipobusqueda) {
    return this.http.post(this.URL + "/getTransaccionesPorIdPago", tipobusqueda);
  }

  getTransaccionesPorNumCheque(tipobusqueda) {
    return this.http.post(this.URL + "/getTransaccionesPorNumCheque", tipobusqueda);
  }

  getTransaccionesPorIdComprobante(tipobusqueda) {
    return this.http.post(this.URL + "/getTransaccionesPorIdComprobante", tipobusqueda);
  }

  updateFechaPago(transaccion) {
    return this.http.put(this.URL + `/updateFechaPago/${transaccion._id}`, transaccion);
  }

  updateEstadoPago(transaccion) {
    return this.http.put(this.URL + `/updateEstadoPago/${transaccion._id}`, transaccion);
  }

  deleteTransaccion(transaccion) {
    return this.http.delete(this.URL + `/delete/${transaccion._id}`,transaccion);
  }
}
