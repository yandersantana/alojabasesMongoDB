import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class DatosConfiguracionService {
  private URL = 'http://localhost:3000/datosConfiguracion'; //localhost
  //private URL = "http://104.248.14.190:3000/datosConfiguracion";
  //private URL = 'http://104.131.82.174:3000/datosConfiguracion';
  constructor(public http: HttpClient, public router: Router) {}

  getDatosConfiguracion() {
    return this.http.get(this.URL + "/getConfiguracion");
  }

}
