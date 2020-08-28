import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ControlPreciosService {

 
  // private URL = 'http://104.248.14.190:3000/precios';
  private URL = 'http://104.131.82.174:3000/precios';
 // private URL = 'http://localhost:3000/precios'; //localhost

  constructor(public http: HttpClient, public router: Router ) { }

  newPrecio(precio){
    return this.http.post<any>(this.URL +'/newPrecio', precio);
  }

  getPrecio(){ 
    return this.http.get(this.URL+'/getPrecios');
  }

  updatePrecio(precio){
    //console.log("entre por aqui  "+ JSON.stringify(precio))
    return this.http.put(this.URL + `/update/${precio._id}`, precio); 
  }

  deletePrecio(precio){
    return this.http.delete(this.URL + `/delete/${precio._id}`, precio); 
  }

  
}
