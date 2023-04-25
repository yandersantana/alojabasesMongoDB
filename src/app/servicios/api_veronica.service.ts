import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ApiVeronicaService {

  //*****************SANDBOX VERONICA***************** */
  // public APIKEY = "0JXSvTZbe0WWqf6PxX9L"  //SANDBOX
  // private URLSECUENCIAL = "https://api-sbox.veronica.ec/api/v1.0/empresas" //SANDBOX
  // private URLFACTURACION = "https://api-sbox.veronica.ec/api/v2.0/sri";   //INTEGRACION DIRECTA SANDBOX
  // private URLFACTURACIONMANUAL = "https://api-sbox.veronica.ec/api/v2.0/comprobantes";   //INTEGRACION MANUAL SANDBOX


  //******************PRODUCCION VERONICA************ */
  public APIKEY = "dwRgAygAHxtiSPPDhIup"  //PRODUCCION
  private URLSECUENCIAL = "https://api.veronica.ec/api/v1.0/empresas" //PRODUCCION
  private URLFACTURACION = "https://api.veronica.ec/api/v2.0/sri";   //INTEGRACION DIRECTA PRODUCCION
  private URLFACTURACIONMANUAL = "https://api.veronica.ec/api/v2.0/comprobantes";   //INTEGRACION MANUAL PRODUCCION


  constructor(public http: HttpClient, public router: Router) {}

  newFactura(factura) {
    const headers = new HttpHeaders().set('x-api-key', this.APIKEY);
    return this.http.post<any>(this.URLFACTURACION + "/facturas?logo=true&notificar=true", factura, {'headers': headers});
    //return this.http.post<any>(this.URL + "/facturas", factura, {'headers': headers});
  }


  obtenerSecuencia(numeroRUC : string) {
    return this.http.get<any>(this.URLSECUENCIAL + `/${numeroRUC}/secuenciales?codDoc=01`,  
    { headers: new HttpHeaders({'Content-Type': 'application/json'}).set('x-api-key', this.APIKEY)} );
  }

}
