import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class TransaccionesFinancierasService {
  private URL = "http://localhost:3000/transaccionFinanciera"; //localhost
  //private URL = "http://104.131.82.174:3000/transaccionFinanciera";
  //private URL = "http://159.223.107.115:3000/transaccionFinanciera";
  constructor(public http: HttpClient, public router: Router) {}

  newTransaccionFinanciera(transaccion) {
    return this.http.post<any>(this.URL + "/newTransaccion", transaccion);
  }

  getTransaccionesFinancieras() {
    return this.http.get(this.URL + "/getTransacciones");
  }

  getTransaccionesFinancierasPorRango(objFecha) {
    return this.http.post(this.URL + "/getTransaccionesPorRango", objFecha);
  }

  getTransaccionesPorTipoDocumento(tipobusqueda) {
    return this.http.post(this.URL + "/getTransaccionesPorTipoDocumento", tipobusqueda);
  }

  deleteTransaccionFinanciera(transaccion) {
    return this.http.delete(
      this.URL + `/delete/${transaccion._id}`,
      transaccion
    );
  }
}
