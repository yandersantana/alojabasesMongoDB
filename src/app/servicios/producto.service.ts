
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Producto } from '../pages/compras/compra';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  empresa: Producto[];
 //private URL = 'http://localhost:3000/producto'; //localhost
 private URL = 'http://104.248.14.190:3000/producto';
  constructor(public http: HttpClient, public router: Router ) { }

  newProducto(producto){
    return this.http.post<any>(this.URL +'/newProducto', producto);
  }

  getProducto(){ 
    return this.http.get(this.URL+'/getProductos');
  }

  updateProducto(producto){
    return this.http.put(this.URL + `/update/${producto._id}`, producto); 
  }

  deleteProducto(producto){
    return this.http.delete(this.URL + `/delete/${producto._id}`, producto); 
  }

  updateProductoBodegaProveedor(producto){
    return this.http.put(this.URL + `/updateBodega/${producto._id}`, producto); 
  }

  updateProductoSucursal1(producto){
    return this.http.put(this.URL + `/updateProductoSuc1/${producto._id}`, producto); 
  }

  updateProductoSucursal1ComD(producto,suma:number, precio:number){
    return this.http.put(this.URL + `/updateProductoSuc1Dir/${producto._id}/${suma}/${precio}`, producto); 
  }

  updateProductoSucursal2ComD(producto,suma:number ,precio:number){
    return this.http.put(this.URL + `/updateProductoSuc2Dir/${producto._id}/${suma}/${precio}`, producto); 
  }

  updateProductoSucursal3ComD(producto,suma:number, precio:number){
    return this.http.put(this.URL + `/updateProductoSuc3Dir/${producto._id}/${suma}/${precio}`, producto); 
  }

  updateProductoSucursal2(producto){
    return this.http.put(this.URL + `/updateProductoSuc2/${producto._id}`, producto); 
  }
  
  updateProductoSucursal3(producto){
    return this.http.put(this.URL + `/updateProductoSuc3/${producto._id}`, producto); 
  }

  
}
