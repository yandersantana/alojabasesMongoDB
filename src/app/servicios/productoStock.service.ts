import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ProductosStockLocalesService {

  //private URL = 'http://localhost:3000/stockProductosLocales'; //localhost
  //private URL = "http://159.223.107.115:3000/stockProductosLocales";
  private URL = 'http://104.131.82.174:3000/stockProductosLocales';

  constructor(public http: HttpClient, public router: Router) {}

  newStockProductoLocal(stock) {
    return this.http.post<any>(this.URL + "/newProductoStock", stock);
  }

  getProductosStock() {
    return this.http.get(this.URL + "/getProductosStock");
  }

  getProductosPorFiltros(producto) {
    return this.http.post(this.URL + "/getProductosPorFiltros", producto);
  }

  updateProductoStock(stock) {
    return this.http.put(this.URL + `/update/${stock._id}`, stock);
  }

  deleteProductoStock(stock) {
    return this.http.delete(this.URL + `/delete/${stock._id}`, stock);
  }
}


