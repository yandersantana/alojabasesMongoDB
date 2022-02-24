import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class TransportistaService {
  //private URL = 'http://localhost:3000/transportista'; //localhost
  //private URL = "http://159.223.107.115:3000/transportista";
  private URL = 'http://104.131.82.174:3000/transportista';
  constructor(public http: HttpClient, public router: Router) {}

  newTransportista(transportista) {
    return this.http.post<any>(this.URL + "/newTransportista", transportista);
  }

  getTransportistas() {
    return this.http.get(this.URL + "/getTransportista");
  }

  updateTransportista(transportista) {
    return this.http.put(
      this.URL + `/update/${transportista._id}`,
      transportista
    );
  }

  deleteTransportista(transportista) {
    return this.http.delete(
      this.URL + `/delete/${transportista._id}`,
      transportista
    );
  }
}
