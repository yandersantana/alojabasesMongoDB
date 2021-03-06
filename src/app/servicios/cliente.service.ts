import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { cliente } from '../pages/ventas/venta';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  clientes: cliente[];
  //private URL = 'http://104.248.14.190:3000/clientes';
  private URL = 'http://104.131.82.174:3000/clientes';
  //private URL = 'http://localhost:3000/clientes'; //localhost

  constructor(public http: HttpClient, public router: Router ) { }

  newCliente(cliente){
    return this.http.post<any>(this.URL +'/newCliente', cliente);
  }

  getCliente(){ 
    return this.http.get(this.URL+'/getClientes');
  }

  updateCliente(cliente){
    console.log("entre por aqui  "+ JSON.stringify(cliente))
    return this.http.put(this.URL + `/update/${cliente._id}`, cliente); 
  }

  deleteClientes(cliente){
    return this.http.delete(this.URL + `/delete/${cliente._id}`, cliente); 
  }

  
}
