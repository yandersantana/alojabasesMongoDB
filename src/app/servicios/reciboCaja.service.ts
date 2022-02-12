import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ReciboCajaService {
  private URL = "http://159.223.107.115:3000/reciboCaja";
  //private URL = "http://104.131.82.174:3000/reciboCaja";
  //private URL = 'http://localhost:3000/reciboCaja'; //localhost

  constructor(public http: HttpClient, public router: Router) {}

  newReciboCaja(reciboCaja) {
    return this.http.post<any>(this.URL + "/newReciboCaja", reciboCaja);
  }

  getRecibos() {
    return this.http.get(this.URL + "/getRecibosCaja");
  }

  getRecibosNoAutorizados() {
    return this.http.get(this.URL + "/getRecibosCajaNoAutorizados");
  }

  getReciboCajaPorId(idRecibo) {
    return this.http.post(this.URL + "/getReciboCajaPorId", idRecibo);
  }

  getReciboCajaPorIdConsecutivo(idRecibo) {
    return this.http.post(this.URL + "/getReciboCajaPorIdConsecutivo", idRecibo);
  }

  getReciboCajaPorRango(objFecha) {
    return this.http.post(this.URL + "/getReciboCajaPorRango", objFecha);
  }

  updateReciboCaja(reciboCaja) {
    return this.http.put(this.URL + `/update/${reciboCaja._id}`, reciboCaja);
  }

  updateReciboCajaCierre(reciboCaja) {
    return this.http.put(this.URL + `/updateCierre/${reciboCaja._id}`, reciboCaja);
  }

  updateEstado(comprobante: string, estado: string) {
    return this.http.put(this.URL + `/updateEstado/${comprobante}/${estado}`, comprobante);
  }

  deleteReciboCaja(reciboCaja) {
    return this.http.delete(this.URL + `/delete/${reciboCaja._id}`, reciboCaja);
  }
}
