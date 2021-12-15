import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class CuentasPorCobrarService {
  //private URL = "http://localhost:3000/cuentaPorCobrar"; //localhost
  //private URL = "http://104.131.82.174:3000/cuentaPorCobrar";
  private URL = "http://159.223.107.115:3000/cuentaPorCobrar";
  constructor(public http: HttpClient, public router: Router) {}

  newCuentaPorCobrar(cuenta) {
    return this.http.post<any>(this.URL + "/newCuentaPorCobrar", cuenta);
  }

  getCuentasPorCobrar() {
    return this.http.get(this.URL + "/getCuentasPorCobrar");
  }

  getCuentasPorCobrarPorRango(objFecha) {
    return this.http.post(this.URL + "/getCuentasPorRango", objFecha);
  }

  deleteCuentaPorCobrar(cuenta) {
    return this.http.delete(this.URL + `/delete/${cuenta._id}`, cuenta);
  }

 

  
}
