import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})

export class RevisionInventarioProductoService {
  //private URL = 'http://localhost:3000/revisionInventarioProducto'; //localhost
  //private URL = "http://159.223.107.115:3000/revisionInventarioProducto";
  private URL = 'http://104.131.82.174:3000/revisionInventarioProducto';


  constructor(public http: HttpClient, public router: Router) {}

  newRevisionInventarioProducto(revision) {
    return this.http.post<any>(this.URL + "/newRevisionInventarioProducto", revision);
  }

  getRevisionesProductos() {
    return this.http.get(this.URL + "/getRevisionesProductos");
  }

  getRevisionesProductosPorId(id) {
    return this.http.post(this.URL + `/getRevisionesProductosPorId/${id}`,id);
  }

  deleteRevisionProducto(opciones) {
    return this.http.delete(this.URL + `/delete/${opciones._id}`, opciones);
  }

  updateRevisionProducto(revision) {
    return this.http.put(this.URL + `/update/${revision._id}`, revision);
  }

}
