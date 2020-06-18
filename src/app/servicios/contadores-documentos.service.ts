import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { factura } from '../pages/ventas/venta';

@Injectable({
  providedIn: 'root'
})
export class ContadoresDocumentosService {

  facturas: factura[];
  //private URL = 'http://localhost:3000/contadores'; //localhost
  private URL = 'http://104.248.14.190:3000/contadores';


  constructor(public http: HttpClient, public router: Router ) { }

  newContadores(contadores){
    
    return this.http.post<any>(this.URL +'/newContadores', contadores);
  }

  getContadores(){ 
    return this.http.get(this.URL+'/getContadores');
  }

  updateContadores(contadores){
    return this.http.put(this.URL + `/update/${contadores._id}`, contadores); 
  }

  updateContadoresIDFacturaMatriz(contadores){
    console.log("dddddff "+this.URL + `/updateIdFacturaMatriz/${contadores._id}`)
    return this.http.put(this.URL + `/updateIdFacturaMatriz/${contadores._id}`, contadores); 
  }

  updateContadoresIDFacturaSuc1(contadores){
    return this.http.put(this.URL + `/updateIdFacturaSuc1/${contadores._id}`, contadores); 
  }

  updateContadoresIDFacturaSuc2(contadores){
    return this.http.put(this.URL + `/updateIdFacturaSuc2/${contadores._id}`, contadores); 
  }
  
  updateContadoresIDNotasVenta(contadores){
    return this.http.put(this.URL + `/updateIdNotasVenta/${contadores._id}`, contadores); 
  }

  updateContadoresIDProformas(contadores){
    return this.http.put(this.URL + `/updateIdProformas/${contadores._id}`, contadores); 
  }

  updateContadoresIDOrdenes(contadores){
    return this.http.put(this.URL + `/updateIdOrdenes/${contadores._id}`, contadores); 
  }

  updateContadoresIDRemisiones(contadores){
    return this.http.put(this.URL + `/updateIdRemisiones/${contadores._id}`, contadores); 
  }

  updateContadoresIDOrdenesAprobadas(contadores){
    return this.http.put(this.URL + `/updateIdOrdenesAprobadas/${contadores._id}`, contadores); 
  }

  updateContadoresIDPagosproveedor(contadores){
    return this.http.put(this.URL + `/updateIdPagosProveedor/${contadores._id}`, contadores); 
  }

  updateContadoresIDFacturasProveedor(contadores){
    console.log("sad "+JSON.stringify(contadores))
    return this.http.put(this.URL + `/updateIDFacturasProveedor/${contadores._id}`, contadores); 
  }

  updateContadoresIDPagosProveedor(contadores){
    return this.http.put(this.URL + `/updateIDPagosProveedor/${contadores._id}`, contadores); 
  }

  updateContadoresIDTransacciones(contadores){
    console.log("contadorID "+JSON.stringify(contadores))
    return this.http.put(this.URL + `/updateIdTransacciones/${contadores._id}`, contadores); 
  }

  deleteContadores(contadores){
    return this.http.delete(this.URL + `/delete/${contadores._id}`, contadores); 
  }

  
}
