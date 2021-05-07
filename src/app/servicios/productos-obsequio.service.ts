import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ProductosObsequioService {
  //private URL = 'http://localhost:3000/productosObsequio'; //localhost
  private URL = "http://104.248.14.190:3000/productosObsequio";
  //private URL = 'http://104.131.82.174:3000/productosObsequio';
  constructor(public http: HttpClient, public router: Router) {}

  newProductoObsequio(productoObs) {
    return this.http.post<any>(this.URL + "/newProductoObsequio", productoObs);
  }

  getProductosObsequio() {
    return this.http.get(this.URL + "/getProductosObsequio");
  }

  updateProductoObsequio(productoObs) {
    return this.http.put(this.URL + `/update/${productoObs._id}`, productoObs);
  }

  deleteProductoObsequio(productoObs) {
    return this.http.delete(
      this.URL + `/delete/${productoObs._id}`,
      productoObs
    );
  }
}
