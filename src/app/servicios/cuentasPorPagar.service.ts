import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class CuentasPorPagarService {
  //private URL = "http://localhost:3000/cuentaPorPagar"; //localhost
  //private URL = "http://104.131.82.174:3000/cuentaPorPagar";
  private URL = "http://159.223.107.115:3000/cuentaPorPagar";
  constructor(public http: HttpClient, public router: Router) {}

  newCuentaPorPagar(cuenta) {
    return this.http.post<any>(this.URL + "/newCuentaPorPagar", cuenta);
  }

  getCuentasPorPagar() {
    return this.http.get(this.URL + "/getCuentasPorPagar");
  }

  getCuentasPorPagarActivas() {
    return this.http.get(this.URL + "/getCuentasPorPagarActivas");
  }

  getCuentasPorPagarPendientes() {
    return this.http.get(this.URL + "/getCuentasPorPagarPendientes");
  }

  getCuentasPorPagarPorRango(objFecha) {
    return this.http.post(this.URL + "/getCuentasPorRango", objFecha);
  }

  getCuentasXPagarPorRUC(objeto) {
    return this.http.post(this.URL + `/getCuentasPorRUC/${objeto.rucCliente}`,objeto );
  }

  getCuentasXPagarPorNombre(objeto) {
    return this.http.post(this.URL + `/getCuentasPorNombre/${objeto.nombreCliente}`,objeto );
  }

  updateEstadoCuenta(objeto, estado: string) {
    return this.http.put(this.URL + `/updateEstado/${objeto._id}/${estado}`, objeto);
  }

  deleteCuenta(cuenta) {
    return this.http.delete(this.URL + `/delete/${cuenta._id}`, cuenta);
  }

  deleteCuentaPorPagar(cuenta) {
    return this.http.delete(this.URL + `/deleteDoc/${cuenta.rCajaId}`, cuenta);
  }
}