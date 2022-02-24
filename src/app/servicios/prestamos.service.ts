import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class PrestamosService {
  //private URL = "http://localhost:3000/prestamos"; //localhost
  private URL = "http://104.131.82.174:3000/prestamos";
  //private URL = "http://159.223.107.115:3000/prestamos";
  constructor(public http: HttpClient, public router: Router) {}

  newPrestamo(prestamo) {
    return this.http.post<any>(this.URL + "/newPrestamo", prestamo);
  }

  getPrestamos() {
    return this.http.get(this.URL + "/getPrestamos");
  }

  getPrestamosPorRUC(objeto) {
    return this.http.post(this.URL + `/getPrestamosPorRUC/${objeto.rucCliente}`,objeto );
  }

  getPrestamosPorNombre(objeto) {
    return this.http.post(this.URL + `/getPrestamosPorNombre/${objeto.nombreCliente}`,objeto );
  }

  getCuentasPorPagarActivas() {
    return this.http.get(this.URL + "/getCuentasPorPagarActivas");
  }

  getCuentasPorPagarPendientes() {
    return this.http.get(this.URL + "/getCuentasPorPagarPendientes");
  }

  getPrestamosPorRango(objFecha) {
    return this.http.post(this.URL + "/getPrestamosPorRango", objFecha);
  }

  getCuentasXPagarPorRUC(objeto) {
    return this.http.post(this.URL + `/getCuentasPorRUC/${objeto.rucCliente}`,objeto );
  }

  getCuentasXPagarPorNombre(objeto) {
    return this.http.post(this.URL + `/getCuentasPorNombre/${objeto.nombreCliente}`,objeto );
  }

  updateEstadoPrestamo(objeto, estado: string) {
    return this.http.put(this.URL + `/updateEstado/${objeto._id}/${estado}`, objeto);
  }

  deleteCuenta(cuenta) {
    return this.http.delete(this.URL + `/delete/${cuenta._id}`, cuenta);
  }

  deleteCuentaPorPagar(cuenta) {
    return this.http.delete(this.URL + `/deleteDoc/${cuenta.rCajaId}`, cuenta);
  }
}
