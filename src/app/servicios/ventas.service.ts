import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { factura } from '../pages/ventas/venta';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  venta: factura[];
 //private URL = 'http://localhost:3000/ventas'; //localhost
  private URL = 'http://104.248.14.190:3000/ventas';
  //private URL = 'http://104.131.82.174:3000/ventas';
  constructor(public http: HttpClient, public router: Router ) { }

  newVenta(venta){
    return this.http.post<any>(this.URL +'/newVenta', venta);
  }

  getVenta(){ 
    return this.http.get(this.URL+'/getVenta');
  }

  updateVenta(venta){
    return this.http.put(this.URL + `/update/${venta._id}`, venta); 
  }

  deleteVenta(venta){
    return this.http.delete(this.URL + `/delete/${venta._id}`, venta); 
  }


    
}
