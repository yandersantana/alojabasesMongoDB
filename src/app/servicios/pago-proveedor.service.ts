import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class PagoProveedorService {

private URL = 'http://localhost:3000/pagoProveedor'; //localhost
 //private URL = 'http://104.248.14.190:3000/pagoProveedor';
  constructor(public http: HttpClient, public router: Router ) { }

  newPagoProveedor(pagoP){
    return this.http.post<any>(this.URL +'/newPagoProveedor', pagoP);
  }

  getPagosProveedor(){ 
    return this.http.get(this.URL+'/getPagosProveedor');
  }

  updatePagosProveedor(pagoP){
    return this.http.put(this.URL + `/update/${pagoP._id}`, pagoP); 
  }

  deletePagosProveedor(pagoP){
    return this.http.delete(this.URL + `/delete/${pagoP._id}`, pagoP); 
  }

  
}
