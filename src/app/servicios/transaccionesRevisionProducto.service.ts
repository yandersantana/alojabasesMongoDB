import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class TransaccionesRevisionProductoService {
  //private URL = "http://localhost:3000/transaccionRevisionProducto"; //localhost
  //private URL = "http://104.131.82.174:3000/transaccionRevisionProducto";
  private URL = "http://159.223.107.115:3000/transaccionRevisionProducto";
  constructor(public http: HttpClient, public router: Router) {}

  newTransaccion(transaccion) {
    return this.http.post<any>(this.URL + "/newTransaccion", transaccion);
  }

  getTransacciones() {
    return this.http.get(this.URL + "/getTransacciones");
  }

  getTransaccionesFinancierasPorRango(objFecha) {
    return this.http.post(this.URL + "/getTransaccionesPorRango", objFecha);
  }

  

}
