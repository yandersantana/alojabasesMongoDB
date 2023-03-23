import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ControlMercaderiaService {
  private URL = "http://159.223.107.115:3000/controlMercaderia";
  //private URL = 'http://104.131.82.174:3000/controlMercaderia';
  //private URL = 'http://localhost:3000/controlMercaderia'; //localhost

  constructor(public http: HttpClient, public router: Router) {}

  newParametrizacion(precio) {
    return this.http.post<any>(this.URL + "/newParametrizacion", precio);
  }

  getParametrizaciones() {
    return this.http.get(this.URL + "/getParametrizaciones");
  }

  updateRegistro(precio) {
    return this.http.put(this.URL + `/update/${precio._id}`, precio);
  }

  deleteRegistro(precio) {
    return this.http.delete(this.URL + `/delete/${precio._id}`, precio);
  }
}
