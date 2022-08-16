import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class CentroCostoService {
  //private URL = "http://159.223.107.115:3000/centroCosto";
  private URL = "http://104.131.82.174:3000/centroCosto";
  //private URL = 'http://localhost:3000/centroCosto'; //localhost

  constructor(public http: HttpClient, public router: Router) {}

  newCentroCosto(centroCosto) {
    return this.http.post<any>(this.URL + "/newCentroCosto", centroCosto);
  }

  getCentrosCostos() {
    return this.http.get(this.URL + "/getCentroCostos");
  }

  updateCentroCosto(centroCosto) {
    return this.http.put(this.URL + `/update/${centroCosto._id}`, centroCosto);
  }

  deleteCentroCpsto(centroCosto) {
    return this.http.delete(this.URL + `/delete/${centroCosto._id}`, centroCosto);
  }
}
