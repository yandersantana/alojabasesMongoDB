import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ApiVeronicaService {

  //private URL = "https://api-sbox.veronica.ec/api/v2.0/comprobantes";   //INTEGRACION MANUAL SANDBOX
  private URL = "https://api-sbox.veronica.ec/api/v2.0/sri";   //INTEGRACION DIRECTA SANDBOX
  //private URL = "https://api.veronica.ec/api/v2.0/comprobantes";   //produccion


  private URLSECUENCIAL = "https://api-sbox.veronica.ec/api/v1.0/empresas" //SANDBOX


  public ApiKEY = "0JXSvTZbe0WWqf6PxX9L"  //SANDBOX

  constructor(public http: HttpClient, public router: Router) {}

  newFactura(factura) {
    const headers = new HttpHeaders().set('x-api-key', this.ApiKEY);
    return this.http.post<any>(this.URL + "/facturas?logo=true&notificar=true", factura, {'headers': headers});
    //return this.http.post<any>(this.URL + "/facturas", factura, {'headers': headers});
  }


  obtenerSecuencia(numeroRUC : string) {
    return this.http.get<any>(this.URLSECUENCIAL + `/${numeroRUC}/secuenciales?codDoc=01`,  
    { headers: new HttpHeaders({'Content-Type': 'application/json'}).set('x-api-key', this.ApiKEY)} );
  }

}
