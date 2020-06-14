import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Producto } from '../pages/compras/compra';

@Injectable({
  providedIn: 'root'
})
export class SucursalesService {

  empresa: Producto[];
// private URL = 'http://localhost:3000/sucursales'; //localhost
 private URL = 'http://104.248.14.190:3000/sucursales';
  constructor(public http: HttpClient, public router: Router ) { }

  newSucursal(sucursal){
    return this.http.post<any>(this.URL +'/newSucursal', sucursal);
  }

  getSucursales(){ 
    return this.http.get(this.URL+'/getSucursales');
  }

  updateSucursales(sucursal){
    return this.http.put(this.URL + `/update/${sucursal._id}`, sucursal); 
  }

  deleteSucursales(sucursal){
    return this.http.delete(this.URL + `/delete/${sucursal._id}`, sucursal); 
  }

  
}
