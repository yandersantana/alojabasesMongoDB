import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuditoriaProductoService {
  //private URL = 'http://localhost:3000/auditoriasProductos'; //localhost
  private URL = "http://104.131.82.174:3000/auditoriasProductos";
  //private URL = "http://159.223.107.115:3000/auditoriasProductos"; //localhost

  constructor(public http: HttpClient, public router: Router) {}

  newAuditoriaProducto(auditoria) {
    return this.http.post<any>(this.URL + "/newAuditoriaProducto", auditoria);
  }

  getAuditoriasProductos() {
    return this.http.get(this.URL + "/getAuditorias");
  }

  updateAuditoriaProducto(auditoria) {
    return this.http.put(this.URL + `/update/${auditoria._id}`, auditoria);
  }

  updateAuditoriaProductos(id: number, cantidad: number) {
    return this.http.put(
      this.URL + `/updateAuditoriaCantidad/${id}/${cantidad}`,
      cantidad
    );
  }

  updateAuditoriaEstado(auditoria, estado: string) {
    return this.http.put(
      this.URL + `/updateAuditoriaEstado/${auditoria._id}/${estado}`,
      auditoria
    );
  }

  deleteAuditoria(auditoria) {
    return this.http.delete(this.URL + `/delete/${auditoria._id}`, auditoria);
  }
}
