import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catalogo } from '../pages/catalogo/catalogo';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  empresa: catalogo[];
  private URL = 'http://104.248.14.190:3000/catalogo';
 //private URL = 'http://localhost:3000/catalogo'; //localhost

  constructor(public http: HttpClient, public router: Router ) { }

  newCatalogo(catalogo){
    return this.http.post<any>(this.URL +'/newCatalogo', catalogo);
  }

  getCatalogo(){ 
    return this.http.get(this.URL+'/getCatalogos');
  }

  updateCatalogo(catalogo){
    console.log("lll "+catalogo._id)
    return this.http.put(this.URL + `/update/${catalogo._id}`, catalogo); 
  }

  deleteEmpresas(catalogo){
    return this.http.delete(this.URL + `/delete/${catalogo._id}`, catalogo); 
  }

  
}
