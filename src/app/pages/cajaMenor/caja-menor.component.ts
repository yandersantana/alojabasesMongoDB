import { Component, OnInit } from '@angular/core';
import { CuentasService } from 'src/app/servicios/cuentas.service';
import { SubCuentasService } from 'src/app/servicios/subCuentas.service';


@Component({
  selector: 'app-caja-menor',
  templateUrl: './caja-menor.component.html',
  styleUrls: ['./caja-menor.component.scss']
})
export class CajaMenorComponent implements OnInit {

  orders: Order[] = [
{
  ID: 91,
  OrderNumber: 214222,
  OrderDate: '2014-02-08',    //DD2
  Sub1: 'RC100',
  Sub2: '',
  TotalIngresos: 11050,  //totalIngresos
  TotalSalidas: 0,   //TotalSalidas
  TotalRC: 0,   //TotalSalidas
  SubCuenta: 'Viene anterior',  //subcuenta
  Cuenta: 'A1:Vienen',  //Cuenta
  Orden: 1
},
{
  ID: 91,
  OrderNumber: 214222,
  OrderDate: '2014-02-08',    //DD2
  Sub1: 'FACT110',
  Sub2: '',
  TotalIngresos: 0,  //totalIngresos
  TotalSalidas: 1500,   //TotalSalidas
  TotalRC: 0,   //TotalSalidas
  SubCuenta: 'Devolucion Venta',  //subcuenta
  Cuenta: 'B:Devoluciones',  //Cuenta
  Orden: 2
},
{
  ID: 91,
  OrderNumber: 214222,
  OrderDate: '2014-02-08',    //DD2
  Sub1: 'FACT111',
  Sub2: '',
  TotalIngresos: 0,  //totalIngresos
  TotalSalidas: 100,   //TotalSalidas
  TotalRC: 5,   //TotalSalidas
  SubCuenta: 'Devolucion Venta',  //subcuenta
  Cuenta: 'B:Devoluciones',  //Cuenta
  Orden: 2
},
{
  ID: 91,
  OrderNumber: 214222,
  OrderDate: '2014-02-08',    //DD2
  Sub1: 'FACT111',
  Sub2: '',
  TotalIngresos: 0,  //totalIngresos
  TotalSalidas: 110,   //TotalSalidas
  TotalRC: 0,   //TotalSalidas
  SubCuenta: 'Pago Telfono',  //subcuenta
  Cuenta: 'C:Gastos',  //Cuenta
  Orden: 2
},
{
  ID: 91,
  OrderNumber: 214222,
  OrderDate: '2014-02-08',    //DD2
  Sub1: 'FACT111',
  Sub2: '',
  TotalIngresos: 0,  //totalIngresos
  TotalSalidas: 50,   //TotalSalidas
  TotalRC: 0,   //TotalSalidas
  SubCuenta: 'Pago Luz',  //subcuenta
  Cuenta: 'C:Gastos',  //Cuenta
  Orden: 2
},
{
  ID: 91,
  OrderNumber: 214222,
  OrderDate: '2014-02-08',    //DD2
  Sub1: 'FACT111',
  Sub2: 'FAC100',
  TotalIngresos: 0,  //totalIngresos
  TotalSalidas: 25,   //TotalSalidas
  TotalRC: 0,   //TotalSalidas
  SubCuenta: 'Pago Agua',  //subcuenta
  Cuenta: 'C:Gastos',  //Cuenta
  Orden: 2
},
];

  
  resultado =0;
  estadoCuenta = "";


  
  constructor(
    public _cuentasService : CuentasService,
    public _subCuentasService : SubCuentasService,
    ) {
   }

  ngOnInit() {
   this.getOrders();
    this.calcular();
    
  }

  calcular(){
   
    var totalSuma = 0;
    var totalResta = 0;
    var totalRC = 0;
    this.orders.forEach(element=>{
      totalSuma += element.TotalIngresos ;
      totalResta += element.TotalSalidas ;
      totalRC += element.TotalRC ;
    });

    this.resultado = totalSuma - totalResta - totalRC;
    if(this.resultado == 0){
      this.estadoCuenta = "OK"
    }
    else if(this.resultado > 0){
      this.estadoCuenta = "SOBRANTE"
    }
    else if(this.resultado < 0){
      this.estadoCuenta = "FALTANTE"
    }
    console.log(this.resultado)
  }


   getOrders() {
    return this.orders;
  }

}




export class Order {
  ID: number;
  OrderNumber: number;
  OrderDate: string;
  TotalIngresos: number;
  TotalSalidas: number;
  TotalRC: number;
  Sub1: string;
  Sub2: string;
  SubCuenta: string;
  Cuenta: string;
  Orden: number;
}