import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ventas2',
  templateUrl: './ventas2.component.html',
  styleUrls: ['./ventas2.component.css']
})
export class Ventas2Component implements OnInit {

  nombreBoton:String = "FACTURA";

  producto:String[]=["Bionica Blanco", "Blanco Brillante", "Blanco Premium" ]
  

  constructor() { }

  ngOnInit() {
  }
  generarFactura(){
    this.nombreBoton= "SE GENERO FACTURA"
    this.producto.push("hola")
    }
  

}
