import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BajasService {
 //private URL = 'http://localhost:3000/baja'; //localhost
 private URL = 'http://104.248.14.190:3000/baja'; //localhost

  constructor(public http: HttpClient, public router: Router ) { }

  newBajas(bajas){
    console.log("recibi "+JSON.stringify(bajas))
    return this.http.post<any>(this.URL +'/newBaja2', bajas);
  }

  getBajas(){ 
    return this.http.get(this.URL+'/getBajas');
  }

  updateBaja(bajas){
    return this.http.put(this.URL + `/update/${bajas._id}`, bajas); 
  }

  updateEstadoBaja(bajas,estado:string){
    return this.http.put(this.URL + `/updateEstadoBaja/${bajas._id}/${estado}`, bajas); 
  }

  deleteBodegas(bajas){
    return this.http.delete(this.URL + `/delete/${bajas._id}`, bajas); 
  }

  
}
