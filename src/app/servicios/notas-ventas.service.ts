import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { factura } from "../pages/ventas/venta";

@Injectable({
  providedIn: "root",
})
export class NotasVentasService {
  facturas: factura[];
  //private URL = "http://localhost:3000/notasVenta"; //localhost
  private URL = "http://159.223.107.115:3000/notasVenta";
  //private URL = "http://104.131.82.174:3000/notasVenta";
  constructor(public http: HttpClient, public router: Router) {}

  newNotaVenta(notasVenta) {
    return this.http.post<any>(this.URL + "/newNotaVenta", notasVenta);
  }

  getNotasVentas() {
    return this.http.get(this.URL + "/getNotasVenta");
  }

  getNotasVentasMensuales(objFecha) {
    return this.http.post(this.URL + "/getNotasVentaMensuales", objFecha);
  }

  getNotasVentaPorRango(objFecha) {
    return this.http.post(this.URL + "/getNotasVentaPorRango", objFecha);
  }

  getNotasVemtaDocumento(documento) {
    return this.http.post(
      this.URL + `/getNotasVentaPorDocumento/${documento}`,
      documento
    );
  }

  updateNotasVenta(notasVenta) {
    return this.http.put(this.URL + `/update/${notasVenta._id}`, notasVenta);
  }

  updateNotasVentaObervaciones(notasventa, observaciones: string) {
    return this.http.put(
      this.URL + `/updateObservaciones/${notasventa._id}/${observaciones}`,
      notasventa
    );
  }

  updateNotasVentaEstado(notasventa, estado: string) {
    return this.http.put(
      this.URL + `/updateEstado/${notasventa._id}/${estado}`,
      notasventa
    );
  }

  updateNotasVentaEstadoAnulación(notasventa, estado: string, mensaje: string) {
    return this.http.put(
      this.URL +
        `/updateEstadoAnulacion/${notasventa._id}/${estado}/${mensaje}`,
      notasventa
    );
  }

  updateNotasVentaEstado2(notasventa, estado: string) {
    console.log("sdsdsd " + `/updateEstadoObs/${notasventa._id}/${estado}`);
    return this.http.put(
      this.URL + `/updateEstadoObs/${notasventa._id}/${estado}`,
      notasventa
    );
  }

  actualizarNota(notasventa, nota: string) {
    return this.http.put(
      this.URL + `/actualizarNota/${notasventa._id}/${nota}`,
      notasventa
    );
  }

  deleteNotasVenta(notasVenta) {
    return this.http.delete(this.URL + `/delete/${notasVenta._id}`, notasVenta);
  }
}
