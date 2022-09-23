import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ProveedoresService {
  //private URL = 'http://localhost:3000/proveedores'; //localhost
  //private URL = "http://159.223.107.115:3000/proveedores";
  private URL = 'http://104.131.82.174:3000/proveedores';
  constructor(public http: HttpClient, public router: Router) {}

  newProveedor(proveedor) {
    return this.http.post<any>(this.URL + "/newProveedor", proveedor);
  }

  getProveedor() {
    return this.http.get(this.URL + "/getProveedores");
  }

  updateProveedor(proveedor) {
    return this.http.put(this.URL + `/update/${proveedor._id}`, proveedor);
  }

  deleteProveedor(proveedor) {
    return this.http.delete(this.URL + `/delete/${proveedor._id}`, proveedor);
  }
}
