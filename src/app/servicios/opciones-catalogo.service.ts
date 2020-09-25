import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Producto } from '../pages/compras/compra';

@Injectable({
  providedIn: 'root'
})
export class OpcionesCatalogoService {

  empresa: Producto[];
 //private URL = 'http://localhost:3000/opciones'; //localhost
 private URL = 'http://104.248.14.190:3000/opciones';
 //private URL = 'http://104.131.82.174:3000/opciones';
  constructor(public http: HttpClient, public router: Router ) { }

  newOpciones(opciones){
    return this.http.post<any>(this.URL +'/newOpcionesCat', opciones);
  }

  getOpciones(){ 
    return this.http.get(this.URL+'/getOpciones');
  }

  updateOpciones(opciones){
    return this.http.put(this.URL + `/update/${opciones._id}`, opciones); 
  }

  deleteOpciones(opciones){
    return this.http.delete(this.URL + `/delete/${opciones._id}`, opciones); 
  }

  
}
