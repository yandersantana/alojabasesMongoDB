import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuditoriasService {
  private URL = 'http://localhost:3000/auditorias'; //localhost
  //private URL = "http://104.131.82.174:3000/auditorias";
  //private URL = "http://104.248.14.190:3000/auditorias"; //localhost

  constructor(public http: HttpClient, public router: Router) {}

  newAuditoria(auditoria) {
    return this.http.post<any>(this.URL + "/newAuditoria", auditoria);
  }

  getAuditorias() {
    return this.http.get(this.URL + "/getAuditorias");
  }

  updateAuditoria(auditoria) {
    return this.http.put(this.URL + `/update/${auditoria._id}`, auditoria);
  }

  updateAuditoriaProductos(auditoria, cantidad: number) {
    return this.http.put(
      this.URL + `/updateAuditoriaCantidad/${auditoria._id}/${cantidad}`,
      auditoria
    );
  }

  updateAuditoriaEstado(auditoria, fecha: string, estado: string) {
    return this.http.put(
      this.URL + `/updateAuditoriaEstado/${auditoria._id}/${estado}`,
      auditoria
    );
  }

  deleteBodegas(auditoria) {
    return this.http.delete(this.URL + `/delete/${auditoria._id}`, auditoria);
  }
}
