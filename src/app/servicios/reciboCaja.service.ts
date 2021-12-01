import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ReciboCajaService {
  //private URL = "http://104.248.14.190:3000/reciboCaja";
  private URL = "http://104.131.82.174:3000/reciboCaja";
  //private URL = 'http://localhost:3000/reciboCaja'; //localhost

  constructor(public http: HttpClient, public router: Router) {}

  newReciboCaja(reciboCaja) {
    return this.http.post<any>(this.URL + "/newReciboCaja", reciboCaja);
  }

  getRecibos() {
    return this.http.get(this.URL + "/getRecibosCaja");
  }

  getReciboCajaPorId(tipobusqueda) {
    return this.http.post(this.URL + "/getReciboCajaPorId", tipobusqueda);
  }

  updateReciboCaja(reciboCaja) {
    return this.http.put(this.URL + `/update/${reciboCaja._id}`, reciboCaja);
  }

  deleteReciboCaja(reciboCaja) {
    return this.http.delete(this.URL + `/delete/${reciboCaja._id}`, reciboCaja);
  }
}
