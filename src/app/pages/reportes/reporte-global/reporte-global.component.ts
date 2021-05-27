import { Component, OnInit } from "@angular/core";
import { AuthenService } from "src/app/servicios/authen.service";
import { TransaccionesService } from "src/app/servicios/transacciones.service";
import { inventario } from "../../consolidado/consolidado";
import { objDate, transaccion } from "../../transacciones/transacciones";
import { reporteDetallado, reporteGlobal, reporteGlobalCompras, reporteDetalladoCompras, reporteGlobalIndicadores } from "../reporte-detallado/reporte";

@Component({
  selector: "app-reporte-global",
  templateUrl: "./reporte-global.component.html",
  styleUrls: ["./reporte-global.component.scss"],
})
export class ReporteGlobalComponent implements OnInit {
  invetarioP: inventario[] = [];
  transaccionesGlobales: transaccion[] = [];
  mostrarLoading: boolean = false;
  reporteDetallado: reporteDetallado[] = [];
  reporteDIndividual: reporteDetallado;
  years: string[] = ["2019","2020","2021","2022","2023","2024","2025"];

  reporteCompras: reporteDetalladoCompras[] = [];
  reporteComprasIndividual: reporteDetalladoCompras;

  reporteGlobalCompras : reporteGlobalCompras[] = [];
  reporteIndGlobalCompras: reporteGlobalCompras;

  //reporte Global
   reporteGlobalIndicadores: reporteGlobalIndicadores[] = [];
  reporteIndvIndicadores: reporteGlobalIndicadores;

  //reporte globa
  reporteGlobal: reporteGlobal[] = [];
  reporteGlobalInd: reporteGlobal;
  obj: objDate;
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  viewTabla : boolean = false;
  aniosSeleccionado : string = "";
  constructor(
    public transaccionesService: TransaccionesService,
    public authenService: AuthenService
  ) {}

  ngOnInit() {
  }

  anioSeleccionado(e) {
    this.aniosSeleccionado = e.value;
    switch (e.value) {
      case "2019":
        this.nowdesde = new Date("01/01/2019");
        this.nowhasta = new Date("12/31/2019");
        break;
      case "2020":
        this.nowdesde = new Date("01/01/2020");
        this.nowhasta = new Date("12/31/2020");
        break;
      case "2021":
        this.nowdesde = new Date("01/01/2021");
        this.nowhasta = new Date("12/31/2021");
        break;
      case "2022":
        this.nowdesde = new Date("01/01/2022");
        this.nowhasta = new Date("12/31/2022");
        break;
      case "2023":
        this.nowdesde = new Date("01/01/2023");
        this.nowhasta = new Date("12/31/2023");
        break;
      case "2024":
        this.nowdesde = new Date("01/01/2024");
        this.nowhasta = new Date("12/31/2024");
        break;
      case "2025":
        this.nowdesde = new Date("01/01/2025");
        this.nowhasta = new Date("12/31/2025");
        break;
      default:
    }
  }

  traerTransaccionesPorRango() {
    this.transaccionesGlobales = [];
    this.reporteDetallado = [];
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    console.log(this.obj)
    this.transaccionesService.getTransaccionesPorRango(this.obj).subscribe(
      (res) => {
        this.transaccionesGlobales = res as transaccion[];
        this.separarTransacciones();
      },
      () => {}
    );
  }

  onCustomizeColumns(columns){  
        for(var i = 0; i < columns.length; i++)  
            columns[i].alignment = 'center';  
    }  

  separarTransacciones() {
    console.log("global", this.transaccionesGlobales.length);
    var start = this.nowdesde;
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
    
    //Variables Compras
    var sumaCompraDirecta = 0;
    var sumaCompraIndirecta = 0;
    while (loop < end) {
      this.transaccionesGlobales.forEach((element) => {
        var loop5 = new Date(element.fecha_transaccion);
          loop5.setDate(loop5.getDate() - 1);
        if (
          loop5.toLocaleDateString() ==
          loop.toLocaleDateString()
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

            case "compra":
              sumaCompraDirecta = Number(sumaCompraDirecta) + Number(element.totalsuma)
              break;

            case "compra-dir":
              sumaCompraIndirecta = Number(sumaCompraIndirecta) + Number(element.totalsuma)
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
      this.reporteDIndividual.validacionMatriz = 0;
      this.reporteDIndividual.validacionSucursal1 = 0;
      if(isNaN(this.reporteDIndividual.MatPorcentaje ))
      this.reporteDIndividual.MatPorcentaje =0 
      if(isNaN(this.reporteDIndividual.Suc1Porcentaje ))
      this.reporteDIndividual.Suc1Porcentaje =0 


      //Compra
      this.reporteComprasIndividual = new reporteDetalladoCompras();
      this.reporteComprasIndividual.fecha = loop;
      this.reporteComprasIndividual.ComprasDiariasDirectas = sumaCompraDirecta ;
      this.reporteComprasIndividual.ComprasDiariasIndirectas = sumaCompraIndirecta ;
      this.reporteComprasIndividual.comprasDiariasTotales = Number(sumaCompraDirecta) + Number(sumaCompraIndirecta) ;
      this.reporteDetallado.push(this.reporteDIndividual);
      this.reporteCompras.push(this.reporteComprasIndividual)
      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
      sumaN = 0;
      sumaSuc1 = 0;
      sumaTotal = 0;
      sumaTotalCalculoUtilidadMat = 0;
      sumaTotalCalculoUtilidadSuc1 = 0;
      sumaDevolMatriz = 0;
      sumaDevolSuc1 = 0;
      sumaCompraDirecta = 0;
      sumaCompraIndirecta = 0;
    }
    this.viewTabla = true;
    this.separarTransaccionesPorMes()
  }

  customizeValue(data: any) { 
    var valor= "$"+data.value.toFixed(2) 
      return valor;  
  }

  customizeValuePercent(data: any) { 
    var valor= data.value.toFixed(2)  +"%"
      return valor;  
  }

  customizeValueRow(data: any) { 
    var valor= data.value.toFixed(2) 
      return valor;  
  }

  separarTransaccionesPorMes(){
    var loop = 0;
    var sumaMesMatriz: number = 0;
    var sumaMesSuc1: number = 0;
    var sumaTotalMes: number = 0;
    var sumaUtilidad: number = 0;
    while (loop <= 12) {
      this.reporteDetallado.forEach((element) => {
        if (element.fecha.getMonth() == loop) {
          sumaMesMatriz = Number(sumaMesMatriz)+ Number(element.VDiariaMatriz)
          sumaMesSuc1 = Number(sumaMesSuc1)+ Number(element.VDiariaSucursal1)
          sumaUtilidad = Number(sumaUtilidad) + Number(element.MatUBruta)+ Number(element.Suc1UBruta)
        }
      });
      loop++
      sumaTotalMes = Number(sumaMesMatriz)+Number(sumaMesSuc1) 
      this.reporteGlobalInd = new reporteGlobal();
      this.reporteGlobalInd.mes = this.validarMes(loop);
      this.reporteGlobalInd.numMes = loop;
      this.reporteGlobalInd.VMesMatriz = Number(sumaMesMatriz.toFixed(2));
      this.reporteGlobalInd.VMesSucursal1 = Number(sumaMesSuc1.toFixed(2));
      this.reporteGlobalInd.VMesTotal = Number(sumaTotalMes.toFixed(2));
      this.reporteGlobalInd.PorcentajeMes = Number(sumaUtilidad.toFixed(2)) / Number(sumaTotalMes.toFixed(2));
      if(isNaN(this.reporteGlobalInd.PorcentajeMes))
        this.reporteGlobalInd.PorcentajeMes = 0
      console.log(this.reporteGlobalInd)

      if(this.reporteGlobalInd.VMesTotal!=0){
        this.reporteGlobal.push(this.reporteGlobalInd)
      }

      //borrar
      if(this.reporteGlobalInd.numMes == 7 && this.aniosSeleccionado == "2020")
        this.reporteGlobal.push(this.reporteGlobalInd)
      

      //INICIAR VARIABLES
      sumaMesSuc1 = 0;
      sumaMesMatriz = 0;
      sumaTotalMes = 0;
      sumaUtilidad = 0;
    }
    this.calcularComprasPorMes()
  }

  calcularComprasPorMes(){
    var loopCompras= 0;
    var sumacomprasDirectas: number = 0;
    var sumaComprasIndirectas: number = 0;
    var sumaTotalMesCompras: number = 0;

    while (loopCompras <= 12) {
      this.reporteCompras.forEach((element) => {
        if (element.fecha.getMonth() == loopCompras) {
          sumacomprasDirectas = Number(sumacomprasDirectas)+ Number(element.ComprasDiariasDirectas)
          sumaComprasIndirectas = Number(sumaComprasIndirectas)+ Number(element.ComprasDiariasIndirectas)
          //sumaTotalMesCompras = Number(sumaTotalMesCompras) + Number(element.comprasDiariasTotales)
        }
      });
      loopCompras++
      sumaTotalMesCompras = Number(sumacomprasDirectas)+Number(sumaComprasIndirectas) 
      this.reporteIndGlobalCompras = new reporteGlobalCompras();
      this.reporteIndGlobalCompras.mes = this.validarMes(loopCompras);
      this.reporteIndGlobalCompras.numMes = loopCompras;
      this.reporteIndGlobalCompras.ComprasMesDirectas = sumacomprasDirectas;
      this.reporteIndGlobalCompras.ComprasMesIndirectas = sumaComprasIndirectas;
      this.reporteIndGlobalCompras.comprasMesTotal = sumaTotalMesCompras;
      if(this.reporteIndGlobalCompras.comprasMesTotal!=0){
        this.reporteGlobalCompras.push(this.reporteIndGlobalCompras)
      }
      

      //INICIAR VARIABLES
      sumacomprasDirectas = 0;
      sumaComprasIndirectas = 0;
      sumaTotalMesCompras = 0;
    }
    this.calcularReporteGlobal()
  }

  calcularReporteGlobal(){
    var loopCompras= 0;
    var sumaCompras: number = 0;
    var sumaVentas: number = 0;
    var indDiferencia: number = 0;
    while (loopCompras <= 12) {
      this.reporteGlobalCompras.forEach((element) => {
        if (element.numMes == loopCompras) {
          sumaCompras = Number(element.comprasMesTotal)
        }
      });

      this.reporteGlobal.forEach((element) => {
        if (element.numMes == loopCompras) {
          sumaVentas = Number(element.VMesTotal)
        }
      });
      
      indDiferencia = Number(sumaCompras)/Number(sumaVentas) 
      if(indDiferencia == Infinity)indDiferencia =0;
      this.reporteIndvIndicadores = new reporteGlobalIndicadores();
      this.reporteIndvIndicadores.mes = this.validarMes(loopCompras);
      this.reporteIndvIndicadores.numMes = loopCompras;
      this.reporteIndvIndicadores.ventasTotales = sumaVentas;
      this.reporteIndvIndicadores.comprasTotales = sumaCompras;
      this.reporteIndvIndicadores.indDiferencia = Number(indDiferencia);
      console.log(this.reporteIndvIndicadores)
      if(this.reporteIndvIndicadores.ventasTotales!=0 || this.reporteIndvIndicadores.comprasTotales!=0){
        this.reporteGlobalIndicadores.push(this.reporteIndvIndicadores)
      }
      loopCompras++

      //INICIAR VARIABLES
      sumaCompras = 0;
      sumaVentas = 0;
      indDiferencia = 0;
    }
    this.mostrarLoading = false
  }


  
  validarMes(mes){
    var NombreMes = ""
    switch (mes) {
      case 1:
        NombreMes = "Enero"
        break;
      case 2:
        NombreMes = "Febrero"
        break;
      case 3:
        NombreMes = "Marzo"
        break;
      case 4:
        NombreMes = "Abril"
        break;
      case 5:
        NombreMes = "Mayo"
        break;
      case 6:
        NombreMes = "Junio"
        break;
      case 7:
        NombreMes = "Julio"
        break;
      case 8:
        NombreMes = "Agosto"
        break;
      case 9:
        NombreMes = "Septiembre"
        break;
      case 10:
        NombreMes = "Octubre"
        break;
      case 11:
        NombreMes = "Noviembre"
        break;
      case 12:
        NombreMes = "Diciembre"
        break;
    
      default:
        break;
    }
    return NombreMes;
  }


}

