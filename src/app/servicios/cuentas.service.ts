import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class CuentasService {
  //private URL = "http://159.223.107.115:3000/cuentas";
  private URL = "http://104.131.82.174:3000/cuentas";
  //private URL = 'http://localhost:3000/cuentas'; //localhost

  constructor(public http: HttpClient, public router: Router) {}

  newCuenta(cuentas) {
    return this.http.post<any>(this.URL + "/newCuenta", cuentas);
  }

  getCuentas() {
    return this.http.get(this.URL + "/getCuentas");
  }

  updateCuentas(cuenta) {
    return this.http.put(this.URL + `/update/${cuenta._id}`, cuenta);
  }

  deleteCuentas(cuenta) {
    return this.http.delete(this.URL + `/delete/${cuenta._id}`, cuenta);
  }
}
