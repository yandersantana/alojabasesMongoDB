import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ingresoDiario } from "../pages/reportes/ingreso-diario/ingreso-diario";

@Injectable({
  providedIn: "root",
})
export class IngresosService {
  ingresos: ingresoDiario[];
  private URL = "http://159.223.107.115:3000/ingresosDiarios";
  //private URL = "http://104.131.82.174:3000/ingresosDiarios";
  //private URL = 'http://localhost:3000/ingresosDiarios'; //localhost

  constructor(public http: HttpClient, public router: Router) {}

  newIngresoDiario(ingreso) {
    return this.http.post<any>(this.URL + "/newIngreso", ingreso);
  }

  getIngresosClientes() {
    return this.http.get(this.URL + "/getIngresos");
  }

  updateIngreso(ingreso) {console.log(ingreso)
    return this.http.put(this.URL + `/update/${ingreso._id}`, ingreso);
  }

  deleteIngresos(ingreso) {
    return this.http.delete(this.URL + `/delete/${ingreso._id}`, ingreso);
  }
}
