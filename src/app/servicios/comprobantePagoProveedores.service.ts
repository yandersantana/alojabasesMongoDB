import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ComprobantePagoProveedoresService {
  private URL = "http://159.223.107.115:3000/comprobantePagoProveedor";
  //private URL = "http://104.131.82.174:3000/comprobantePagoProveedor";
  //private URL = 'http://localhost:3000/comprobantePagoProveedor'; //localhost

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

  updateEstado(comprobante: string, estado: string) {
    return this.http.put(this.URL + `/updateEstado/${comprobante}/${estado}`, comprobante);
  }

  deleteComprobante(comprobante) {
    return this.http.delete(this.URL + `/delete/${comprobante._id}`, comprobante);
  }
}
