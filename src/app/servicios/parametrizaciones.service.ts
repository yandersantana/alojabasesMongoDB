import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ParametrizacionesService {


 //private URL = 'http://localhost:3000/parametrizaciones'; //localhost
 //private URL = 'http://104.248.14.190:3000/parametrizaciones';
 private URL = 'http://104.131.82.174:3000/parametrizaciones';
  constructor(public http: HttpClient, public router: Router ) { }

  newParametrizacion(parametrizacion){
    return this.http.post<any>(this.URL +'/newParametrizacion', parametrizacion);
  }

  getParametrizacion(){ 
    return this.http.get(this.URL+'/getParametrizaciones');
  }

  updateParametrizacion(parametrizacion){
    return this.http.put(this.URL + `/update/${parametrizacion._id}`, parametrizacion); 
  }

  deleteParametrizacion(parametrizacion){
    return this.http.delete(this.URL + `/delete/${parametrizacion._id}`, parametrizacion); 
  }
}
