
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
 //private URL = 'http://104.248.14.190:3000/facturas';
 private URL = 'http://104.131.82.174:3000/facturas';
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

  updateFacturasEstado(facturas,estado:string){
    return this.http.put(this.URL + `/updateEstado/${facturas._id}/${estado}`, facturas); 
  }

  updateFacturasEstadoAnulacion(facturas,estado:string,mensaje:string){
    return this.http.put(this.URL + `/updateEstadoMensaje/${facturas._id}/${estado}/${mensaje}`, facturas); 
  }

  updateFacturasEstado2(facturas,estado:string){
    console.log("llegue aquiii ")
    console.log("element "+this.URL + `/updateEstadoOb/${facturas._id}/${estado}`)
    return this.http.put(this.URL + `/updateEstadoOb/${facturas._id}/${estado}`, facturas); 
  }

  updateFacturasObervaciones(idFact:string,observaciones:string){
    console.log("sdsd sss "+idFact +"sds "+observaciones)
    return this.http.put(this.URL + `/update2/${idFact}/${observaciones}`, idFact); 
  }

  deleteFacturas(facturas){
    return this.http.delete(this.URL + `/delete/${facturas._id}`, facturas); 
  }

  actualizarNota(facturas,nota:string){
    return this.http.put(this.URL + `/actualizarNota/${facturas._id}/${nota}`, facturas); 
  }

  
}
