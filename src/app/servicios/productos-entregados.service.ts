import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ProductosEntregadosService {
  //private URL = 'http://localhost:3000/productosEntregados'; //localhost
  //private URL = "http://104.248.14.190:3000/productosEntregados";
  private URL = 'http://104.131.82.174:3000/productosEntregados';
  constructor(public http: HttpClient, public router: Router) {}

  newProductoEntregado(productoIng) {
    return this.http.post<any>(this.URL + "/newProductoEntregado", productoIng);
  }

  getProductosEntregados() {
    return this.http.get(this.URL + "/getProductosEntregados");
  }

  updateProductoEntregado(productoIng) {
    return this.http.put(this.URL + `/update/${productoIng._id}`, productoIng);
  }

  updateEstadoIngreso(productoIng, estado: string) {
    return this.http.put(
      this.URL + `/updateEstadoIngreso/${productoIng._id}/${estado}`,
      productoIng
    );
  }

  updateEstado(productoIng, estado: string) {
    return this.http.put(
      this.URL + `/updateEstado/${productoIng._id}/${estado}`,
      productoIng
    );
  }

  deleteProductoEntregado(productoIng) {
    return this.http.delete(
      this.URL + `/delete/${productoIng._id}`,
      productoIng
    );
  }
}
