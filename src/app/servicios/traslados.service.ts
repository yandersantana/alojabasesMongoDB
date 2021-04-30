import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TrasladosService {

  //private URL = 'http://localhost:3000/traslados'; //localhost
  //private URL = 'http://104.248.14.190:3000/traslados';
  private URL = 'http://104.131.82.174:3000/traslados';
  constructor(public http: HttpClient, public router: Router ) { }

  newTraslado(traslado){
    return this.http.post<any>(this.URL +'/newTraslado', traslado);
  }

  getTraslado(){ 
    return this.http.get(this.URL+'/getTraslados');
  }

  getTrasladosMensuales(objFecha){ 
    return this.http.post(this.URL+'/getTrasladosMensuales',objFecha);
  }

  updateTraslado(traslado){
    return this.http.put(this.URL + `/update/${traslado._id}`, traslado); 
  }

  updateEstadoTraslado(traslado,estado:string){
    return this.http.put(this.URL + `/updateEstado/${traslado._id}/${estado}`, traslado); 
  }

  deleteTraslado(traslado){
    return this.http.delete(this.URL + `/delete/${traslado._id}`, traslado); 
  }

  
}
