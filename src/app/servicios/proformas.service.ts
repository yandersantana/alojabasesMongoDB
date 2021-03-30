import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { factura } from '../pages/ventas/venta';

@Injectable({
  providedIn: 'root'
})
export class ProformasService {

  facturas: factura[];
 //private URL = 'http://localhost:3000/proformas'; //localhost
 //private URL = 'http://104.248.14.190:3000/proformas';
 private URL = 'http://104.131.82.174:3000/proformas';
  constructor(public http: HttpClient, public router: Router ) { }

  newProforma(proforma){
    return this.http.post<any>(this.URL +'/newProforma', proforma);
  }

  getProformas(){ 
    return this.http.get(this.URL+'/getProformas');
  }

  getProformasMensuales(objFecha){ 
    return this.http.post(this.URL+'/getProformasMensuales',objFecha);
  }

  updateProformas(proforma){
    return this.http.put(this.URL + `/update/${proforma._id}`, proforma); 
  }

  actualizarNota(proforma,nota:string){
    return this.http.put(this.URL + `/actualizarNota/${proforma._id}/${nota}`, proforma); 
  }

  deleteProformas(proforma){
    return this.http.delete(this.URL + `/delete/${proforma._id}`, proforma); 
  }

  
}
