import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ProductosVendidosService {
  //private URL = 'http://localhost:3000/productosVendidos'; //localhost
  private URL = "http://159.223.107.115:3000/productosVendidos";
  //private URL = 'http://104.131.82.174:3000/productosVendidos';
  constructor(public http: HttpClient, public router: Router) {}

  newProductoVendido(productoVen) {
    return this.http.post<any>(this.URL + "/newProductoVendido", productoVen);
  }

  getProductoVendido() {
    return this.http.get(this.URL + "/getProductosvendidos");
  }

  updateProductoVendido(productoVen) {
    return this.http.put(this.URL + `/update/${productoVen._id}`, productoVen);
  }

  deleteProductoVendido(productoVen) {
    return this.http.delete(
      this.URL + `/delete/${productoVen._id}`,
      productoVen
    );
  }
}
