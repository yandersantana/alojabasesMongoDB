import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { factura } from '../pages/ventas/venta';

@Injectable({
  providedIn: 'root'
})
export class DocumentoGeneradoEntregaService {

  facturas: factura[];
  //private URL = 'http://localhost:3000/documentoGenerado'; //localhost
 private URL = 'http://104.248.14.190:3000/documentoGenerado';
 //private URL = 'http://104.131.82.174:3000/documentoGenerado';
  constructor(public http: HttpClient, public router: Router ) { }

  newDocumentoGenerado(documento){
    return this.http.post<any>(this.URL +'/newDocumentoGenerado', documento);
  }

  getDocumentoGenerado(){ 
    return this.http.get(this.URL+'/getDocumentosGenerado');
  }

  updateDocumentoGenerado(documento){
    return this.http.put(this.URL + `/update/${documento._id}`, documento); 
  }

  updateEstado(documento,estado:string){
    return this.http.put(this.URL + `/updateEstado/${documento._id}/${estado}`, documento); 
  }

  deleteDocumentoGenerado(documento){
    return this.http.delete(this.URL + `/delete/${documento._id}`, documento); 
  }

  
}
