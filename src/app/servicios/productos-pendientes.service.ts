import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductosPendientesService {

 //private URL = 'http://localhost:3000/productosPendientes'; //localhost
 private URL = 'http://104.248.14.190:3000/productosPendientes';
 //private URL = 'http://104.131.82.174:3000/productosPendientes';
  constructor(public http: HttpClient, public router: Router ) { }

  newProductoPendiente(productoPen){
    return this.http.post<any>(this.URL +'/newProductoPendiente', productoPen);
  }

  getProductoPendiente(){ 
    return this.http.get(this.URL+'/getProductosPendientes');
  }

  getProductosPendientesEntrega(){ 
    return this.http.get(this.URL+'/getProductosPendientesEntrega');
  }

  updateProductoPendiente(productoPen){
    return this.http.put(this.URL + `/update/${productoPen._id}`, productoPen); 
  }

  updateProductoPendienteEstado(productoPen){
    return this.http.put(this.URL + `/updateEstado/${productoPen._id}`, productoPen); 
  }

  actualizarNota(productoPen,nota:string){
    return this.http.put(this.URL + `/actualizarNota/${productoPen._id}/${nota}`, productoPen); 
  }

  deleteProductoPendiente(productoPen){
    return this.http.delete(this.URL + `/delete/${productoPen._id}`, productoPen); 
  }

  
}
