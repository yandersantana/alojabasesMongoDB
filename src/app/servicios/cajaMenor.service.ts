import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class CajaMenorService {
  private URL = "http://159.223.107.115:3000/cajaMenor";
  //private URL = "http://104.131.82.174:3000/cajaMenor";
  //private URL = 'http://localhost:3000/cajaMenor'; //localhost

  constructor(public http: HttpClient, public router: Router) {}

  newCajaMenor(cajaMenor) {
    return this.http.post<any>(this.URL + "/newCajaMenor", cajaMenor);
  }

  getCajaMenor() {
    return this.http.get(this.URL + "/getCajasMenor");
  }

  getCajaMenorPorId(idRecibo) {
    return this.http.post(this.URL + "/getCajaMenorPorId", idRecibo);
  }

  getCajaMenorPorIdConsecutivo(idCajaMenor) {
    return this.http.post(this.URL + "/getCajaMenorPorIdConsecutivo", idCajaMenor);
  }

  getCajaMenorPorFecha(idCajaMenor) {
    return this.http.post(this.URL + "/getCajaMenorPorFecha", idCajaMenor);
  }

  getCajaMenorPorRango(objFecha) {
    return this.http.post(this.URL + "/getCajaMenorPorRango", objFecha);
  }

  updateCajaMenor(cajaMenor) {
    return this.http.put(this.URL + `/update/${cajaMenor._id}`, cajaMenor);
  }

  deleteCajaMenor(cajaMenor) {
    return this.http.delete(this.URL + `/delete/${cajaMenor._id}`, cajaMenor);
  }

  updateEstado(cajaMenor, estado: string) {
    return this.http.put(this.URL + `/updateEstado/${cajaMenor._id}/${estado}`, cajaMenor);
  }

  updateValidacion(cajaMenor, estado: string) {
    return this.http.put(this.URL + `/updateValidacion/${cajaMenor._id}/${estado}`, cajaMenor);
  }
}
