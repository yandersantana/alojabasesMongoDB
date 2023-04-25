import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { factura } from "../pages/ventas/venta";

@Injectable({
  providedIn: "root",
})
export class ServicioWebVeronicaService {
  venta: factura[];
  //private URL = 'http://localhost:3000/servicioWebVeronica'; //localhost
  //private URL = "http://159.223.107.115:3000/servicioWebVeronica";
  private URL = 'http://104.131.82.174:3000/servicioWebVeronica';
  constructor(public http: HttpClient, public router: Router) {}

  newLog(log) {
    return this.http.post<any>(this.URL + "/newLog", log);
  }
}
