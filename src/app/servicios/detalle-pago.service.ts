import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { factura } from "../pages/ventas/venta";

@Injectable({
  providedIn: "root",
})
export class DetallePagoService {
  facturas: factura[];
  //private URL = 'http://localhost:3000/detallePago'; //localhost
  private URL = "http://104.248.14.190:3000/detallePago";
  //private URL = 'http://104.131.82.174:3000/detallePago';
  constructor(public http: HttpClient, public router: Router) {}

  newDetallePago(detallePago) {
    return this.http.post<any>(this.URL + "/newDetallePago", detallePago);
  }

  getDetallePagos() {
    return this.http.get(this.URL + "/getDetallePago");
  }

  updateDetallePagos(detallePago) {
    return this.http.put(this.URL + `/update/${detallePago._id}`, detallePago);
  }

  updateEstado(detallePago, estado: string) {
    return this.http.put(
      this.URL + `/updateEstado/${detallePago._id}/${estado}`,
      detallePago
    );
  }

  deleteDetallePago(detallePago) {
    return this.http.delete(
      this.URL + `/delete/${detallePago._id}`,
      detallePago
    );
  }
}
