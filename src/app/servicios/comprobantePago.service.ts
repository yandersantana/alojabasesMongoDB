import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ComprobantePagoService {
  //private URL = "http://104.248.14.190:3000/comprobantePago";
  private URL = "http://104.131.82.174:3000/comprobantePago";
  //private URL = 'http://localhost:3000/comprobantePago'; //localhost

  constructor(public http: HttpClient, public router: Router) {}

  newComprobantePago(comprobante) {
    return this.http.post<any>(this.URL + "/newComprobantePago", comprobante);
  }

  getComprobantes() {
    return this.http.get(this.URL + "/getComprobantesPago");
  }

  getComprobantePorId(idRecibo) {
    return this.http.post(this.URL + "/getComprobantePorId", idRecibo);
  }

  getComprobantePorIdConsecutivo(idComprobante) {
    return this.http.post(this.URL + "/getComprobantePorIdConsecutivo", idComprobante);
  }

  getComprobantePorRango(objFecha) {
    return this.http.post(this.URL + "/getComprobantesPorRango", objFecha);
  }

  updateComprobante(comprobante) {
    return this.http.put(this.URL + `/update/${comprobante._id}`, comprobante);
  }

  deleteComprobante(comprobante) {
    return this.http.delete(this.URL + `/delete/${comprobante._id}`, comprobante);
  }
}
