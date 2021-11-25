import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class SubCuentasService {
  //private URL = "http://104.248.14.190:3000/subCuentas";
  //private URL = "http://104.131.82.174:3000/subCuentas";
  private URL = 'http://localhost:3000/subCuentas'; //localhost

  constructor(public http: HttpClient, public router: Router) {}

  newSubCuenta(subcuenta) {
    return this.http.post<any>(this.URL + "/newSubCuenta", subcuenta);
  }

  getSubCuentas() {
    return this.http.get(this.URL + "/getSubCuenta");
  }

  getSubCuentasPorId(idCuenta) {
    return this.http.post(this.URL +`/getSubCuentasPorId/${idCuenta}` ,idCuenta);
  }

  updateSubCuentas(subcuenta) {
    return this.http.put(this.URL + `/update/${subcuenta._id}`, subcuenta);
  }

  deleteSubCuentas(subcuenta) {
    return this.http.delete(this.URL + `/delete/${subcuenta._id}`, subcuenta);
  }
}
