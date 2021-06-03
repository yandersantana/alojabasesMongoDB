import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class RemisionesService {
  private URL = 'http://localhost:3000/remisiones'; //localhost
  //private URL = "http://104.248.14.190:3000/remisiones";
  //private URL = 'http://104.131.82.174:3000/remisiones';
  constructor(public http: HttpClient, public router: Router) {}

  newRemision(remisiones) {
    return this.http.post<any>(this.URL + "/newRemision", remisiones);
  }

  getRemisiones() {
    return this.http.get(this.URL + "/getRemisiones");
  }

  getRemisionesMensuales(objFecha) {
    return this.http.post(this.URL + "/getRemisionesMensuales", objFecha);
  }

  updateRemisiones(remisiones) {
    return this.http.put(this.URL + `/update/${remisiones._id}`, remisiones);
  }

  updateEstado(remisiones, estado: string) {
    return this.http.put(
      this.URL + `/updateEstado/${remisiones._id}/${estado}`,
      remisiones
    );
  }

  updateRechazarRemision(remisiones, estado: string, mensaje: string) {
    return this.http.put(
      this.URL + `/updateRechazarRemi/${remisiones._id}/${estado}/${mensaje}`,
      remisiones
    );
  }

  deleteRemisiones(remisiones) {
    return this.http.delete(this.URL + `/delete/${remisiones._id}`, remisiones);
  }
}
