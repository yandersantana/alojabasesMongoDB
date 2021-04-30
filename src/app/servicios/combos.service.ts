import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { cliente } from "../pages/ventas/venta";

@Injectable({
  providedIn: "root",
})
export class CombosService {
  ///private URL = 'http://104.248.14.190:3000/combos';
  private URL = "http://104.131.82.174:3000/combos";
  //private URL = 'http://localhost:3000/combos'; //localhost

  constructor(public http: HttpClient, public router: Router) {}

  newCombo(combos) {
    return this.http.post<any>(this.URL + "/newCombo", combos);
  }

  getCombo() {
    return this.http.get(this.URL + "/getCombos");
  }

  updateCombo(combo) {
    return this.http.put(this.URL + `/update/${combo._id}`, combo);
  }

  deleteCombos(combo) {
    return this.http.delete(this.URL + `/delete/${combo._id}`, combo);
  }
}
