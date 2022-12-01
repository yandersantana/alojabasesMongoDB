import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ReporteDetalladoService {
  //private URL = "http://159.223.107.115:3000/reporteDetallado";
  private URL = "http://104.131.82.174:3000/reporteDetallado";
  //private URL = 'http://localhost:3000/reporteDetallado'; //localhost

  constructor(public http: HttpClient, public router: Router) {}

  newReporteDetallado(reporteDet) {
    return this.http.post<any>(this.URL + "/newReporteDet", reporteDet);
  }

  getReporteDetallado() {
    return this.http.get(this.URL + "/getReportes");
  }

  updateReporteDetallado(reporteDet) {
    return this.http.put(this.URL + `/update/${reporteDet._id}`, reporteDet);
  }

  deleteReporteDetallado(reporteDet) {
    return this.http.delete(this.URL + `/delete/${reporteDet._id}`, reporteDet);
  }
}
