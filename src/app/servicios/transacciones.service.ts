import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

 //private URL = 'http://localhost:3000/transaccion'; //localhost
 private URL = 'http://104.248.14.190:3000/transaccion';
  constructor(public http: HttpClient, public router: Router ) { }

  newTransaccion(transaccion){
   // alert("aqui ñe "+JSON.stringify(transaccion))
    return this.http.post<any>(this.URL +'/newTransaccion', transaccion);
  }

  getTransaccion(){ 
    return this.http.get(this.URL+'/getTransacciones');
  }

  updateTransaccion(transaccion){
    return this.http.put(this.URL + `/update/${transaccion._id}`, transaccion); 
  }

  deleteTransaccion(transaccion){
    return this.http.delete(this.URL + `/delete/${transaccion._id}`, transaccion); 
  }

  
}
