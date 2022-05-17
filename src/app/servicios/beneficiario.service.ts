import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class BeneficiarioService {
  //private URL = "http://159.223.107.115:3000/beneficiario";
  private URL = "http://104.131.82.174:3000/beneficiario";
  //private URL = 'http://localhost:3000/beneficiario'; //localhost

  constructor(public http: HttpClient, public router: Router) {}

  newBeneficiario(beneficiario) {
    return this.http.post<any>(this.URL + "/newBeneficiario", beneficiario);
  }

  getBeneficiarios() {
    return this.http.get(this.URL + "/getBeneficiarios");
  }

  updateBeneficiario(beneficiario) {
    return this.http.put(this.URL + `/update/${beneficiario._id}`, beneficiario);
  }

  deleteBeneficiario(beneficiario) {
    return this.http.delete(this.URL + `/delete/${beneficiario._id}`, beneficiario);
  }
}
