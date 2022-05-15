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
  private URL = "http://159.223.107.115:3000/facturasProveedor";
  //private URL = 'http://104.131.82.174:3000/facturasProveedor';
  constructor(public http: HttpClient, public router: Router) {}

  newFacturaProveedor(facturasProveedor) {
    return this.http.post<any>(this.URL + "/newFacturaProveedor", facturasProveedor);
  }

  getFacturasProveedor() {
    return this.http.get(this.URL + "/getFacturasProveedor");
  }

  getFacturasDocumento(documento) {
    return this.http.post(this.URL + `/getFacturasPorDocumento/${documento.nSolicitud}`,documento);
  }

  getFacturasPendientesPorProveedor(documento) {
    return this.http.post(this.URL + `/getFacturasPendientesPorProveedor/${documento.proveedor}`,documento);
  }

  updateFacturasProveedor(facturasProveedor) {
    return this.http.put(this.URL + `/update/${facturasProveedor._id}`,facturasProveedor);
  }

  updateEstado(facturasProveedor: string, estado: string) {
    return this.http.put(this.URL + `/updateEstado/${facturasProveedor}/${estado}`, facturasProveedor);
  }

  updateEstadoFactura(facturasProveedor: string, estado: string) {
    return this.http.put(this.URL + `/updateEstadoFactura/${facturasProveedor}/${estado}`, facturasProveedor);
  }

  updateEstado2(facturasProveedor, estado: string) {
    return this.http.put(this.URL + `/updateEstado2/${facturasProveedor._id}/${estado}`,facturasProveedor);
  }

  getFacturasPorRango(objFecha) {
    return this.http.post(this.URL + "/getFacturasPorRango", objFecha);
  }

  getFacturaPorNFactura(tipobusqueda) {
    return this.http.post(this.URL + "/getFacturaPorNumero", tipobusqueda);
  }

  updateEstado3(id: string, estado: string) {
    return this.http.put(this.URL + `/updateEstado3/${id}/${estado}`, id);
  }

  updateEstadoPorFactura(id: string, estado: string) {
    return this.http.put(this.URL + `/updateEstadoPorId/${id}/${estado}`, id);
  }

  updateFacturaPorTransaccion(id: string, estado: string, valor : number) {
    return this.http.put(this.URL + `/updateEstadoPorId2/${id}/${estado}/${valor}`, id);
  }

  deleteFacturasProveedor(facturasProveedor) {
    return this.http.delete(this.URL + `/delete/${facturasProveedor._id}`, facturasProveedor);
  }
}
