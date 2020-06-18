import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { factura } from '../pages/ventas/venta';

@Injectable({
  providedIn: 'root'
})
export class NotasVentasService {

  facturas: factura[];
 //private URL = 'http://localhost:3000/notasVenta'; //localhost
 private URL = 'http://104.248.14.190:3000/notasVenta';
  constructor(public http: HttpClient, public router: Router ) { }

  newNotaVenta(notasVenta){
    return this.http.post<any>(this.URL +'/newNotaVenta', notasVenta);
  }

  getNotasVentas(){ 
    return this.http.get(this.URL+'/getNotasVenta');
  }

  updateNotasVenta(notasVenta){
    return this.http.put(this.URL + `/update/${notasVenta._id}`, notasVenta); 
  }

  deleteNotasVenta(notasVenta){
    return this.http.delete(this.URL + `/delete/${notasVenta._id}`, notasVenta); 
  }

  
}
