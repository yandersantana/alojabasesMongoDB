import { Component, OnInit } from '@angular/core';
import { producto } from '../ventas/venta';
import { ProductoService } from 'src/app/servicios/producto.service';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.scss']
})
export class CalculadorasComponent implements OnInit {

  constructor( public productoService: ProductoService) { }

  valorEnM2:number=0
  calp:number=0
  calmetros:number=0
  caltotal:number=0
  cantidadcal: number=0
  productos2: producto[] = []
  productosActivos: producto[] = []
  tipoConversiones: string[] = [
    "De cajas a m2",
    "De m2 a cajas"
  ];


  ngOnInit() {
    this.traerProductos()
  }

  traerProductos(){
    this.productoService.getProducto().subscribe(res => {
      this.productosActivos = res as producto[];
      this.llenarPR()
   })
  }

  llenarPR(){
    this.productosActivos.forEach(element=>{
      /* if(element.CLASIFICA== "Porcelanatos" || element.CLASIFICA=="Ceramicas"  || element.CLASIFICA=="Cerámicas"){
          this.productos2.push(element)
      } */
      if(element.UNIDAD == "Metros"){
        this.productos2.push(element)
      }
    })
  }

  obtenerDatosCalculadora(e){
    this.productos2.forEach(element=>{
      if(element.PRODUCTO == e.value){
        this.calp=element.P_CAJA
        this.calmetros=element.M2
      }
    })
    this.calcularMetros(e)
  }
  obtenerDatosCalculadora2(e){
    this.productos2.forEach(element=>{
      if(element.PRODUCTO == e.value){
        this.calp=element.P_CAJA
        this.calmetros=element.M2
      }
    })
    this.calcularMetros2(e)
  }

  opcionMenu(e){
    var x = document.getElementById("op1");
    var y = document.getElementById("op2");

    switch (e.value) {
      case "De cajas a m2":
        x.style.display = "block";
        y.style.display="none";
       break;

      case "De m2 a cajas":
        x.style.display = "none";
        y.style.display="block";
        break;
      default:    
    }     
  }

  calcularMetros2(e) {
    this.cantidadcal=Math.trunc(this.caltotal / this.calmetros);
    
    this.valorEnM2=Math.trunc(this.caltotal * this.calp / this.calmetros) - (this.cantidadcal * this.calp);
  }

  calcularMetros(e) {

      this.caltotal=parseFloat(((this.calmetros*this.cantidadcal)+((this.valorEnM2*this.calmetros)/this.calp)).toFixed(5))
  }

}
