import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class TransaccionesFacturasService {
  //private URL = "http://localhost:3000/transaccionFacturas"; //localhost
  //private URL = "http://104.131.82.174:3000/transaccionFacturas";
  private URL = "http://159.223.107.115:3000/transaccionFacturas";
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







  
  getTransaccionesPorTipoDocumento(tipobusqueda) {
    return this.http.post(this.URL + "/getTransaccionesPorTipoDocumento", tipobusqueda);
  }

  obtenerTransaccionesPorDocumentoYRecibo(tipobusqueda) {
    return this.http.post(this.URL + "/getTransaccionesPorTipoDocumentoYRecibo", tipobusqueda);
  }

  obtenerTransaccionesPrestamos(tipobusqueda) {
    return this.http.post(this.URL + "/getTransaccionesPrestamos", tipobusqueda);
  }

  obtenerTransaccionesPorDocumentoYRecibo2(tipobusqueda) {
    return this.http.post(this.URL + "/getTransaccionesPorTipoDocumentoYRecibo2", tipobusqueda);
  }

  updateEstado(transaccion, estado: boolean) {
    return this.http.put(this.URL + `/updateEstado/${transaccion._id}/${estado}`, transaccion);
  }

  updateIsContabilizada(transaccion, estado: boolean) {
    return this.http.put(this.URL + `/updateContabilizada/${transaccion._id}/${estado}`, transaccion);
  }

  deleteTransaccionFinanciera(transaccion) {
    return this.http.delete(this.URL + `/delete/${transaccion._id}`,transaccion);
  }
}
