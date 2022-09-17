import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})

export class RevisionInventarioService {
  //private URL = 'http://localhost:3000/revisionInventario'; //localhost
  private URL = "http://159.223.107.115:3000/revisionInventario";
  //private URL = 'http://104.131.82.174:3000/revisionInventario';


  constructor(public http: HttpClient, public router: Router) {}

  newRevisionInventario(revision) {
    return this.http.post<any>(this.URL + "/newRevisionInventario", revision);
  }

  getRevisiones() {
    return this.http.get(this.URL + "/getRevisiones");
  }

  getRevisionesIniciadas() {
    return this.http.get(this.URL + "/getRevisionesIniciadas");
  }

  getRevisionPorIdConsecutivo(idRecibo) {
    return this.http.post(this.URL + "/getRevisionPorIdConsecutivo", idRecibo);
  }

  updateEstado(IdRevision: string, estado: string) {
    return this.http.put(this.URL + `/updateEstado/${IdRevision}/${estado}`, IdRevision);
  }

  deleteRevision(revision) {
    return this.http.delete(this.URL + `/delete/${revision._id}`, revision);
  }

  /* updateOpciones(opciones) {
    return this.http.put(this.URL + `/update/${opciones._id}`, opciones);
  }

  deleteOpciones(opciones) {
    return this.http.delete(this.URL + `/delete/${opciones._id}`, opciones);
  } */
}
