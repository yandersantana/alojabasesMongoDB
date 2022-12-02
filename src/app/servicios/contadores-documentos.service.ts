import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ContadoresDocumentosService {
  //private URL = 'http://localhost:3000/contadores'; //localhost
  private URL = "http://159.223.107.115:3000/contadores";
  //private URL = "http://104.131.82.174:3000/contadores";

  constructor(public http: HttpClient, public router: Router) {}

  newContadores(contadores) {
    return this.http.post<any>(this.URL + "/newContadores", contadores);
  }

  getContadores() {
    return this.http.get(this.URL + "/getContadores");
  }

  updateContadores(contadores) {
    return this.http.put(this.URL + `/update/${contadores._id}`, contadores);
  }

  updateContadoresIDFacturaMatriz(contadores) {
    return this.http.put(
      this.URL + `/updateIdFacturaMatriz/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDFacturaSuc1(contadores) {
    return this.http.put(
      this.URL + `/updateIdFacturaSuc1/${contadores._id}`,
      contadores
    );
  }

  updateContadoresTraslados(contadores) {
    return this.http.put(
      this.URL + `/updateIdTraslados/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDFacturaSuc2(contadores) {
    return this.http.put(
      this.URL + `/updateIdFacturaSuc2/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDNotasVenta(contadores) {
    return this.http.put(
      this.URL + `/updateIdNotasVenta/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDAuditorias(contadores) {
    return this.http.put(
      this.URL + `/updateIdAuditoria/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDProformas(contadores) {
    return this.http.put(
      this.URL + `/updateIdProformas/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDOrdenes(contadores) {
    return this.http.put(
      this.URL + `/updateIdOrdenes/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDRemisiones(contadores) {
    return this.http.put(
      this.URL + `/updateIdRemisiones/${contadores._id}`,
      contadores
    );
  }

  updateContadoresDevoluciones(contadores) {
    return this.http.put(
      this.URL + `/updateIdDevoluciones/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDOrdenesAprobadas(contadores) {
    return this.http.put(
      this.URL + `/updateIdOrdenesAprobadas/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDPagosproveedor(contadores) {
    return this.http.put(
      this.URL + `/updateIdPagosProveedor/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDProductosPendientes(contadores) {
    return this.http.put(
      this.URL + `/updateIdProductosPendientes/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDBajas(contadores) {
    return this.http.put(
      this.URL + `/updateIdBajas/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDDocumentoGenerado(contadores) {
    return this.http.put(
      this.URL + `/updateIdDocumentoEntrega/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDProductosEntregados(contadores) {
    return this.http.put(
      this.URL + `/updateIdProductosEntregados/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDFacturasProveedor(contadores) {
    console.log("sad " + JSON.stringify(contadores));
    return this.http.put(
      this.URL + `/updateIDFacturasProveedor/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDPagosProveedor(contadores) {
    return this.http.put(
      this.URL + `/updateIDPagosProveedor/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDTransacciones(contadores) {
    return this.http.put(
      this.URL + `/updateIdTransacciones/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDRegistroCaja(contadores) {
    return this.http.put(
      this.URL + `/updateIDRegistroCaja/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDComprobantePago(contadores) {
    return this.http.put(
      this.URL + `/updateIDComprobantePago/${contadores._id}`,
      contadores
    );
  }

  updateContadoresIDComprobantePagoProveedor(contadores) {
    return this.http.put(this.URL + `/updateIDComprobantePagoProveedor/${contadores._id}`,contadores);
  }

  updateContadoresIDCajaMenor(contadores) {
    return this.http.put(this.URL + `/updateIDCajaMenor/${contadores._id}`,contadores );
  }

  updateContadoresIDPagoCheque(contadores) {
    return this.http.put(this.URL + `/updateIDPagoCheque/${contadores._id}`,contadores );
  }

  updateIdRevisionInventario(contadores) {
    return this.http.put(this.URL + `/updateIdRevisionInventario/${contadores._id}`,contadores );
  }
  
  deleteContadores(contadores) {
    return this.http.delete(this.URL + `/delete/${contadores._id}`, contadores);
  }
}
