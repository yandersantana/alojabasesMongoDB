import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class CuentasPorCobrarService {
  //private URL = "http://localhost:3000/cuentaPorCobrar"; //localhost
  private URL = "http://104.131.82.174:3000/cuentaPorCobrar";
  //private URL = "http://159.223.107.115:3000/cuentaPorCobrar";
  constructor(public http: HttpClient, public router: Router) {}

  newCuentaPorCobrar(cuenta) {
    return this.http.post<any>(this.URL + "/newCuentaPorCobrar", cuenta);
  }

  getCuentasPorCobrar() {
    return this.http.get(this.URL + "/getCuentasPorCobrar");
  }

  getCuentasPorCobrarActivas() {
    return this.http.get(this.URL + "/getCuentasPorCobrarActivas");
  }

  getCuentasPorCobrarPendientes() {
    return this.http.get(this.URL + "/getCuentasPorCobrarPendientes");
  }

  getCuentasPorCobrarPorRango(objFecha) {
    return this.http.post(this.URL + "/getCuentasPorRango", objFecha);
  }

  getCuentasXCobrarPorRUC(objeto) {
    return this.http.post(this.URL + `/getCuentasPorRUC/${objeto.rucCliente}`,objeto );
  }

  getCuentasXCobrarPorNombre(objeto) {
    return this.http.post(this.URL + `/getCuentasPorNombre/${objeto.nombreCliente}`,objeto );
  }

  updateEstadoCuenta(objeto, estado: string) {
    return this.http.put(this.URL + `/updateEstado/${objeto._id}/${estado}`, objeto);
  }

  deleteCuenta(cuenta) {
    return this.http.delete(this.URL + `/delete/${cuenta._id}`, cuenta);
  }

  deleteCuentaPorCobrar(cuenta) {
    return this.http.delete(this.URL + `/deleteDoc/${cuenta.rCajaId}`, cuenta);
  }
}
