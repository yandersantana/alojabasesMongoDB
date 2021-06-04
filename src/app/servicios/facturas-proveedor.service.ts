import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { factura } from "../pages/ventas/venta";

@Injectable({
  providedIn: "root",
})
export class FacturasProveedorService {
  facturas: factura[];
  //private URL = 'http://localhost:3000/facturasProveedor'; //localhost
  //private URL = "http://104.248.14.190:3000/facturasProveedor";
  private URL = 'http://104.131.82.174:3000/facturasProveedor';
  constructor(public http: HttpClient, public router: Router) {}

  newFacturaProveedor(facturasProveedor) {
    return this.http.post<any>(
      this.URL + "/newFacturaProveedor",
      facturasProveedor
    );
  }

  getFacturasProveedor() {
    return this.http.get(this.URL + "/getFacturasProveedor");
  }

  updateFacturasProveedor(facturasProveedor) {
    return this.http.put(
      this.URL + `/update/${facturasProveedor._id}`,
      facturasProveedor
    );
  }

  updateEstado(facturasProveedor: string, estado: string) {
    return this.http.put(
      this.URL + `/updateEstado/${facturasProveedor}/${estado}`,
      facturasProveedor
    );
  }

  updateEstado2(facturasProveedor, estado: string) {
    return this.http.put(
      this.URL + `/updateEstado2/${facturasProveedor._id}/${estado}`,
      facturasProveedor
    );
  }

  updateEstado3(id: string, estado: string) {
    return this.http.put(this.URL + `/updateEstado3/${id}/${estado}`, id);
  }

  deleteFacturasProveedor(facturasProveedor) {
    return this.http.delete(
      this.URL + `/delete/${facturasProveedor._id}`,
      facturasProveedor
    );
  }
}
