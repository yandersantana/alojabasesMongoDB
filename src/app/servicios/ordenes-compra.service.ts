import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OrdenesCompraService {

 //private URL = 'http://localhost:3000/ordenesCompra'; //localhost
  private URL = 'http://104.248.14.190:3000/ordenesCompra';
  constructor(public http: HttpClient, public router: Router ) { }

  newOrden(venta){
    return this.http.post<any>(this.URL +'/newOrdenes', venta);
  }

  getOrden(){ 
    return this.http.get(this.URL+'/getOrdenesCompra');
  }

  getOrdenbyID(id:string){ 
    return this.http.get(this.URL+`/getOrdenesCompraID/${id}`);
  }

  updateOrden(ordenes){
    return this.http.put(this.URL + `/update/${ordenes._id}`, ordenes); 
  }

  updateEstadoOrden(ordenes,estado:string){
    return this.http.put(this.URL + `/updateEstadoOrden/${ordenes._id}/${estado}`, ordenes); 
  }

  updateEstadoOrden2(orden:string,estado:string){
    console.log("aquii leggue "+ JSON.stringify(orden))
    return this.http.put(this.URL + `/updateEstadoOrdenes2/${orden}/${estado}`, orden); 
  }

  updateOrdenEstadoRechazo(id:string, variable:string , mensaje:string , estado2:string){
    return this.http.put(this.URL + `/updateEstadoRechazo/${id}/${variable}/${mensaje}/${estado2}`, variable); 
  }

  updateOrdenEstadoAprobado(id:string, variable:string , orden:number , usuario:string, estado2:string){
    return this.http.put(this.URL + `/updateEstadoAprobado/${id}/${variable}/${orden}/${usuario}/${estado2}`, variable); 
    
  }

  deleteOrden(ordenes){
    return this.http.delete(this.URL + `/delete/${ordenes._id}`, ordenes); 
  }

  
}
