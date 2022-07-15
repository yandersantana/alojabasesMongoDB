import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class CombosService {
  private URL = "http://159.223.107.115:3000/comboProductos";
  //private URL = "http://104.131.82.174:3000/comboProductos";
  //private URL = 'http://localhost:3000/comboProductos'; //localhost

  constructor(public http: HttpClient, public router: Router) {}

  newCombo(combos) {
    return this.http.post<any>(this.URL + "/newComboProducto", combos);
  }

  getComboProductos() {
    return this.http.get(this.URL + "/getComboProductos");
  }

  getComboPorNombre(combo) {
    return this.http.post(this.URL + "/getComboPorNombre", combo);
  }

  updateCombo(combo) {
    return this.http.put(this.URL + `/update/${combo._id}`, combo);
  }

  deleteCombos(combo) {
    return this.http.delete(this.URL + `/delete/${combo._id}`, combo);
  }
}
