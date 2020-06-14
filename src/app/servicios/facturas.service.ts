
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { factura } from '../pages/ventas/venta';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  facturas: factura[];
 //private URL = 'http://localhost:3000/facturas'; //localhost
 private URL = 'http://104.248.14.190:3000/clientes';
  constructor(public http: HttpClient, public router: Router ) { }

  newFactura(facturas){
    return this.http.post<any>(this.URL +'/newFactura', facturas);
  }

  getFacturas(){ 
    return this.http.get(this.URL+'/getFacturas');
  }

  updateFacturas(facturas){
    return this.http.put(this.URL + `/update/${facturas._id}`, facturas); 
  }

  deleteFacturas(facturas){
    return this.http.delete(this.URL + `/delete/${facturas._id}`, facturas); 
  }

  
}
