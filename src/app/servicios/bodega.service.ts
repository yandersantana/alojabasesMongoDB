import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BodegaService {
 //private URL = 'http://localhost:3000/bodegas'; //localhost
 private URL = 'http://104.248.14.190:3000/bodegas'; //localhost
 //private URL = 'http://104.131.82.174:3000/bodegas';

  constructor(public http: HttpClient, public router: Router ) { }

  newBodegas(bodegas){
    return this.http.post<any>(this.URL +'/newBodega', bodegas);
  }

  getBodegas(){ 
    return this.http.get(this.URL+'/getBodegas');
  }

  updateBodega(bodegas){
    return this.http.put(this.URL + `/update/${bodegas._id}`, bodegas); 
  }

  deleteBodegas(bodegas){
    return this.http.delete(this.URL + `/delete/${bodegas._id}`, bodegas); 
  }

  
}
