import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class DescuentosService {
  //private URL = "http://localhost:3000/descuentos"; //localhost
  private URL = "http://104.131.82.174:3000/descuentos";
  //private URL = "http://159.223.107.115:3000/descuentos";
  constructor(public http: HttpClient, public router: Router) {}

  guardarCodigo(descuento) {
    return this.http.post<any>(this.URL + "/newCodigo", descuento);
  }

  
}
