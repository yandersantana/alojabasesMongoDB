import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catalogo } from '../pages/catalogo/catalogo';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  empresa: catalogo[];
  //private URL = 'http://104.248.14.190:3000/catalogo';
  private URL = 'http://104.131.82.174:3000/catalogo';
  //private URL = 'http://localhost:3000/catalogo'; //localhost

  constructor(public http: HttpClient, public router: Router ) { }

  newCatalogo(catalogo){
    return this.http.post<any>(this.URL +'/newCatalogo', catalogo);
  }

  getCatalogo(){ 
    return this.http.get(this.URL+'/getCatalogos');
  }

  updateCatalogo(catalogo){
    return this.http.put(this.URL + `/update/${catalogo._id}`, catalogo); 
  }

  updateCatalogoEliminacion(catalogo , estado:string){
    return this.http.put(this.URL + `/updateEliminacion/${catalogo._id}/${estado}`, catalogo); 
  }
  

  updateCatalogoAplicacion(nombre:string, aplicacion:string){
    return this.http.put(this.URL + `/updateAplicacion/${nombre}/${aplicacion}`, catalogo); 
  }

  deleteCatalogo(catalogo){
    return this.http.delete(this.URL + `/delete/${catalogo._id}`, catalogo); 
  }

  
}
