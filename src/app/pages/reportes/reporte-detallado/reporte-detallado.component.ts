import { Component, OnInit } from "@angular/core";
import { AuthenService } from "src/app/servicios/authen.service";
import { IngresosService } from "src/app/servicios/ingreso-diario";
import { TransaccionesService } from "src/app/servicios/transacciones.service";
import { inventario } from "../../consolidado/consolidado";
import { objDate, transaccion } from "../../transacciones/transacciones";
import { ingresoDiario } from "../ingreso-diario/ingreso-diario";
import { reporteDetallado } from "./reporte";

@Component({
  selector: "app-reporte-detallado",
  templateUrl: "./reporte-detallado.component.html",
  styleUrls: ["./reporte-detallado.component.scss"],
})
export class ReporteDetalladoComponent implements OnInit {
  invetarioP: inventario[] = [];
  transaccionesGlobales: transaccion[] = [];
  mostrarLoading: boolean = false;
  reporteDetallado: reporteDetallado[] = [];
  reporteDIndividual: reporteDetallado;
  obj: objDate;
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  viewTabla : boolean = false;
  fechaAnteriorDesde: Date = new Date();
  ingresosDiarios : ingresoDiario[] = [];
  constructor(
    public transaccionesService: TransaccionesService,
    public authenService: AuthenService,
    public ingresosService :IngresosService
  ) {}

  ngOnInit() {
    this.traerRegistrosIngresos();
  }

  traerRegistrosIngresos(){
    this.ingresosService.getIngresosClientes().subscribe(res => {
      this.ingresosDiarios = res as ingresoDiario[];
   })
  }

  traerTransaccionesPorRango() {
    this.transaccionesGlobales = [];
    this.reporteDetallado = [];
    this.mostrarLoading = true;
    this.fechaAnteriorDesde = this.nowdesde
    var fechaHoy = this.nowdesde
    fechaHoy.setDate(this.nowdesde.getDate() - 15);
    console.log("1",this.nowdesde)
    console.log("2",fechaHoy)
    var fechaHasta = new Date()
    fechaHasta.setDate(this.nowhasta.getDate() + 15);
    this.obj = new objDate();
    this.obj.fechaActual = fechaHasta;
    this.obj.fechaAnterior = fechaHoy;
    console.log(this.obj)
    this.transaccionesService.getTransaccionesPorRango(this.obj).subscribe(
      (res) => {
        this.transaccionesGlobales = res as transaccion[];
        this.separarTransacciones();
      },
      () => {}
    );
  }

  separarTransacciones() {
    console.log("global", this.transaccionesGlobales.length);
    this.fechaAnteriorDesde.setDate(this.nowdesde.getDate() + 15) 
    var start = this.fechaAnteriorDesde;
    var end = this.nowhasta
    var loop = new Date(start);
    loop.setDate(loop.getDate() - 1);
    var sumaN: number = 0;
    var sumaSuc1: number = 0;
    var sumaTotal: number = 0;
    //Variables matriz
    var sumaCalculoPCostoMat: number = 0;
    var sumaCalculoPVentaMat: number = 0;
    var sumaCalUtilidadMat: number = 0;
    var sumaTotalCalculoUtilidadMat = 0;
    //Variables Suc1
    var sumaCalculoPCostoSuc1: number = 0;
    var sumaCalculoPVentaSuc1: number = 0;
    var sumaCalUtilidadSuc1: number = 0;
    var sumaTotalCalculoUtilidadSuc1 = 0;
    var sumaDevolMatriz = 0;
    var sumaDevolSuc1 = 0;
    var diferenciaIngresoMatriz =0;
    var diferenciaIngresoSucursal1 =0;
    while (loop < end) {
      this.transaccionesGlobales.forEach((element) => {
        var loop5 = new Date(element.fecha_transaccion);
          loop5.setDate(loop5.getDate() - 1);
        if (loop5.toLocaleDateString() == loop.toLocaleDateString()
        ) {
          switch (element.tipo_transaccion) {
            case "venta-not":
              if(element.sucursal == "matriz"){
                sumaN = Number(sumaN) + Number(element.totalsuma);
                sumaCalculoPCostoMat = Number(element.costo_unitario) * Number (element.cantM2)
                sumaCalculoPVentaMat = Number(element.valor) * Number (element.cantM2)
                sumaCalUtilidadMat = Number(sumaCalculoPVentaMat) - Number(sumaCalculoPCostoMat)
                sumaTotalCalculoUtilidadMat =  Number(sumaTotalCalculoUtilidadMat) + Number(sumaCalUtilidadMat)
              }else if(element.sucursal == "sucursal1"){
                sumaSuc1 = Number(sumaSuc1) + Number(element.totalsuma);
                sumaCalculoPCostoSuc1 = Number(element.costo_unitario) * Number (element.cantM2)
                sumaCalculoPVentaSuc1 = Number(element.valor) * Number (element.cantM2)
                sumaCalUtilidadSuc1 = Number(sumaCalculoPVentaSuc1) - Number(sumaCalculoPCostoSuc1)
                sumaTotalCalculoUtilidadSuc1 =  Number(sumaTotalCalculoUtilidadSuc1) + Number(sumaCalUtilidadSuc1)
              }
              
              break;
            case "venta-fact":
              if(element.sucursal == "matriz"){
                sumaN = Number(sumaN) + Number(element.totalsuma);
                sumaCalculoPCostoMat = Number(element.costo_unitario) * Number (element.cantM2)
                sumaCalculoPVentaMat = Number(element.valor) * Number (element.cantM2)
                sumaCalUtilidadMat = Number(sumaCalculoPVentaMat) - Number(sumaCalculoPCostoMat)
                sumaTotalCalculoUtilidadMat =  Number(sumaTotalCalculoUtilidadMat) + Number(sumaCalUtilidadMat)
              }else if(element.sucursal == "sucursal1"){
                sumaSuc1 = Number(sumaSuc1) + Number(element.totalsuma);
                sumaCalculoPCostoSuc1 = Number(element.costo_unitario) * Number (element.cantM2)
                sumaCalculoPVentaSuc1 = Number(element.valor) * Number (element.cantM2)
                sumaCalUtilidadSuc1 = Number(sumaCalculoPVentaSuc1) - Number(sumaCalculoPCostoSuc1)
                sumaTotalCalculoUtilidadSuc1 =  Number(sumaTotalCalculoUtilidadSuc1) + Number(sumaCalUtilidadSuc1)
              }
              
              break;
            case "devolucion":
              if(element.sucursal == "matriz"){
                sumaN = Number(sumaN) - Number(element.totalsuma? element.totalsuma:0);
                sumaDevolMatriz = Number(sumaDevolMatriz)+ Number(element.totalsuma? element.totalsuma:0)
              }else if(element.sucursal == "sucursal1"){
                sumaSuc1 = Number(sumaSuc1) - Number(element.totalsuma? element.totalsuma:0);
                sumaDevolSuc1 = Number(sumaDevolSuc1)+ Number(element.totalsuma? element.totalsuma:0)
              }
              break;
            default:
              break;
          }
        }
      });
      sumaTotal = Number(sumaN)+Number(sumaSuc1);
      this.reporteDIndividual = new reporteDetallado();
      this.reporteDIndividual.fecha = loop;
      this.reporteDIndividual.VDiariaMatriz = Number(sumaN.toFixed(2));
      this.reporteDIndividual.DevDiariaMatriz = Number(sumaDevolMatriz.toFixed(2));
      this.reporteDIndividual.VDiariaSucursal1 = Number(sumaSuc1.toFixed(2));
      this.reporteDIndividual.DevDiariaSucursal1 = Number(sumaDevolSuc1.toFixed(2));
      this.reporteDIndividual.VDiariaTotal = Number(sumaTotal.toFixed(2));
      this.reporteDIndividual.MatUBruta = Number(sumaTotalCalculoUtilidadMat.toFixed(2));
      this.reporteDIndividual.MatPorcentaje = Number(sumaTotalCalculoUtilidadMat.toFixed(2)) / Number(sumaN.toFixed(2)) ;
      this.reporteDIndividual.Suc1UBruta = Number(sumaTotalCalculoUtilidadSuc1.toFixed(2));
      this.reporteDIndividual.Suc1Porcentaje = Number(sumaTotalCalculoUtilidadSuc1.toFixed(2)) / Number(sumaSuc1.toFixed(2)) ;

      
      this.ingresosDiarios.forEach((element) => {
        var loop4 = new Date(element.fecha);
          loop4.setDate(loop4.getDate() - 1);
        if (loop4.toLocaleDateString() == loop.toLocaleDateString()) {
          if(element.sucursal == "matriz")
            diferenciaIngresoMatriz = Number(this.reporteDIndividual.VDiariaMatriz) -  Number(element.valor)

            if(element.sucursal == "sucursal1")
            diferenciaIngresoSucursal1 =  Number(this.reporteDIndividual.VDiariaSucursal1) -  Number(element.valor) 
        }
      });

      this.reporteDIndividual.validacionMatriz = diferenciaIngresoMatriz;
      this.reporteDIndividual.validacionSucursal1 = diferenciaIngresoSucursal1;
      if(isNaN(this.reporteDIndividual.MatPorcentaje ))
      this.reporteDIndividual.MatPorcentaje =0 
      if(isNaN(this.reporteDIndividual.Suc1Porcentaje ))
      this.reporteDIndividual.Suc1Porcentaje =0 
      this.reporteDetallado.push(this.reporteDIndividual);
      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
      sumaN = 0;
      sumaSuc1 = 0;
      sumaTotal = 0;
      sumaTotalCalculoUtilidadMat = 0;
      sumaTotalCalculoUtilidadSuc1 = 0;
      sumaDevolMatriz = 0;
      sumaDevolSuc1 = 0;
      diferenciaIngresoSucursal1 =0;
      diferenciaIngresoMatriz = 0;
    }
    this.viewTabla = true;
    this.mostrarLoading = false
  }

  calcularDiferenciaIngresos(){
     console.log("global", this.transaccionesGlobales.length);
    this.fechaAnteriorDesde.setDate(this.nowdesde.getDate() + 15) 
    var start = this.fechaAnteriorDesde;
    var end = this.nowhasta
    var loop = new Date(start);
    loop.setDate(loop.getDate() - 1);
    var sumaN: number = 0;
    var sumaSuc1: number = 0;
    var sumaTotal: number = 0;
    //Variables matriz
    var sumaCalculoPCostoMat: number = 0;
    var sumaCalculoPVentaMat: number = 0;
    var sumaCalUtilidadMat: number = 0;
    var sumaTotalCalculoUtilidadMat = 0;
    //Variables Suc1
    var sumaCalculoPCostoSuc1: number = 0;
    var sumaCalculoPVentaSuc1: number = 0;
    var sumaCalUtilidadSuc1: number = 0;
    var sumaTotalCalculoUtilidadSuc1 = 0;
    var sumaDevolMatriz = 0;
    var sumaDevolSuc1 = 0;
    while (loop < end) {
      this.transaccionesGlobales.forEach((element) => {
        if (
          new Date(element.fecha_transaccion).toLocaleDateString() ==
          loop.toLocaleDateString()
        ) {
      
        }
      });
      sumaTotal = Number(sumaN)+Number(sumaSuc1);
     
    }
    this.viewTabla = true;
    this.mostrarLoading = false
  }


  


}
