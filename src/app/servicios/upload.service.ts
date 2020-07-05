import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private URL = 'http://104.248.14.190:3000/upload';
  //private URL = 'http://localhost:3000/upload';
  constructor(private http: HttpClient) { }

  uploadFile(formData) {
   console.log(formData)
    return this.http.post<any>(this.URL +'/uploadFile', formData);
  }

  uploadFile2(formData) {
    console.log("yes "+JSON.stringify(formData))
     return this.http.post<any>(this.URL +'/upload3', formData);
   }

   uploadFile3(formData) {
    console.log("yes "+JSON.stringify(formData))
     return this.http.post<any>(this.URL +'/upload23', formData);
   }

   uploadFile4(formData) {
    console.log("yes "+JSON.stringify(formData))
     return this.http.post<any>(this.URL +'/uploadNew5', formData);
   }


  newDocumento(documento){
    console.log("el documento tiene "+JSON.stringify(documento))
    return this.http.post<any>(this.URL +'/newDocument', documento);
  }

  getDocumentos(){ 
    return this.http.get(this.URL+'/getDocumentos');
  }

  getDocumetosbyEmpresa(empresa:string){ 
    return this.http.get(this.URL+`/getDocumentos2/${empresa}`);
  }

 /* getDocumetosbyClase(clase:string){ 
    return this.http.get(this.URL+`/getDocumentos3/${clase}`);
  }*/

  getDocumetosbyClase(clase){ 
    console.log("soy clasex1"+clase)
    return this.http.post<any>(this.URL+'/DocumentosByClass/',clase);
  }

  updateFile(documento){
   console.log("yaaa "+JSON.stringify(documento))
    return this.http.put(this.URL + `/updateFile/${documento._id}`, documento); 
  }
  

 
  updateDocumento(documento){
    console.log("aqui es "+this.URL + `/update/${documento._id}`)
    return this.http.put(this.URL + `/update/${documento._id}`, documento); 
  }

  deleteDocumento(documento){
    return this.http.delete(this.URL + `/delete/${documento._id}`, documento); 
  }

  updateDocumemto(documento){
    console.log("aqui es "+this.URL + `/update/${documento._id}`)
    return this.http.put(this.URL + `/updateDocumento/${documento._id}`, documento); 
  }

  

}