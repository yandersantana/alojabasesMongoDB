import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { Component, OnInit } from '@angular/core';
import { BeneficiarioService } from 'src/app/servicios/beneficiario.service';
import { TransaccionesFinancierasService } from 'src/app/servicios/transaccionesFinancieras.service';
import Swal from 'sweetalert2';
import { Beneficiario } from '../administracion-cuentas/administracion-cuenta';
import { objDate } from '../transacciones/transacciones';
import { TransaccionesFinancieras } from '../transaccionesFinancieras/transaccionesFinancieras';


@Component({
  selector: 'app-transaccionesNominas',
  templateUrl: './transaccionesNominas.component.html',
  styleUrls: ['./transaccionesNominas.component.scss']
})


export class TransaccionesNominasComponent implements OnInit {
  listaTransacciones: TransaccionesFinancieras [] = []
  beneficiarios: Beneficiario [] = []
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  fechaAnteriorDesde: Date = new Date();
  obj: objDate;
  mostrarLoading: boolean = false;
  valorNominas = 0;
  valorAnticipos = 0;
  valorPagosExtras = 0;
  valorComisiones = 0;
  valorDescuentos = 0;
  valorPagoPrestamos = 0;
  resultado = 0;
  estadoCuenta = ""
  beneficiario = ""

  constructor(public _transaccionFinancieraService : TransaccionesFinancierasService,
    public _beneficiarioService : BeneficiarioService) {}

  ngOnInit() {
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.traerTransaccionesPorRango();
    this.traerBeneficiarios();
  }

  traerBeneficiarios(){
    this._beneficiarioService.getBeneficiarios().subscribe(res => {
      this.beneficiarios = res as Beneficiario[];
   })
  }

  traerListaTransacciones(){
    this.listaTransacciones = [];
    this.mostrarLoading = true;
    this._transaccionFinancieraService.getTransaccionesFinancierasNominas().subscribe(res => {
      this.listaTransacciones = res as TransaccionesFinancieras[];
      this.obtenerDatos();
      this.mostrarLoading = false;
   })
  }

  traerTransaccionesPorRango() {
    this.listaTransacciones = [];
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaActual.setHours(24);
    this._transaccionFinancieraService.getTransaccionesFinancierasNominasPorRango(this.obj).subscribe(
      (res) => {
        this.listaTransacciones = res as TransaccionesFinancieras[];
        this.obtenerDatos();
        this.mostrarLoading = false;
      },
      () => {}
    );
  }


  traerTransaccionesPorRangoYBeneficiario() {
    this.listaTransacciones = [];
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaActual.setHours(24);
    this.obj.sucursal = this.beneficiario;
    this._transaccionFinancieraService.getTransaccionesFinancierasNominasPorRangoYBeneficiario(this.obj).subscribe(
      (res) => {
        this.listaTransacciones = res as TransaccionesFinancieras[];
        this.obtenerDatos();
        this.mostrarLoading = false;
      },
      () => {}
    );
  }


  obtenerDatos(){
    this.valorAnticipos = 0;
    this.valorDescuentos = 0;
    this.valorPagosExtras = 0;
    this.valorComisiones = 0;
    this.valorPagoPrestamos = 0;
    this.valorNominas = 0;
    this.resultado = 0;
    this.listaTransacciones.forEach(element =>{
      if(element.subCuenta == "1.5.2 Nominas"){
        this.valorNominas = element.valor + this.valorNominas;
      }else if(element.subCuenta == "1.5.3 Anticipos nomina"){
        this.valorAnticipos = element.valor + this.valorAnticipos;
      }else if(element.subCuenta == "1.5.7 Descuentos"){
        this.valorDescuentos = element.valor + this.valorDescuentos;
      }else if(element.subCuenta == "1.5.4 Pagos extras"){
        this.valorPagosExtras = element.valor + this.valorPagosExtras;
      }else if(element.subCuenta == "1.5.5 Comisiones x Fletes"){
        this.valorComisiones = element.valor + this.valorComisiones;
      }else if(element.subCuenta == "1.3.3 Pago o Abono Préstamo"){
        this.valorPagoPrestamos = element.valor + this.valorPagoPrestamos;
      }
    })
    this.resultado = this.valorNominas - this.valorAnticipos - this.valorPagoPrestamos - this.valorDescuentos + this.valorPagosExtras + this.valorComisiones;
  }

  onExporting (e) {
    e.component.beginUpdate();
    e.component.columnOption("notas", "visible", true);
    e.component.columnOption("beneficiario", "visible", true);
    e.component.columnOption("proveedor", "visible", true);
    e.component.columnOption("centroCosto", "visible", true);
   
  };
  onExported (e) {
    e.component.columnOption("notas", "visible", false);
    e.component.columnOption("beneficiario", "visible", false);
    e.component.columnOption("proveedor", "visible", false);
    e.component.columnOption("centroCosto", "visible", false);
    e.component.endUpdate();
  }

  mostrarMensajeGenerico(tipo:number , texto:string){
    if(tipo == 1){
      Swal.fire({
        title: "Correcto",
        text: texto,
        icon: 'success'
      })
    }else{
      Swal.fire({
        title: "Error",
        text: texto,
        icon: 'error'
      })
    }
       
  }


}
