import { Component, OnInit } from '@angular/core';
import { TransaccionesFinancierasService } from 'src/app/servicios/transaccionesFinancieras.service';
import Swal from 'sweetalert2';
import { objDate } from '../transacciones/transacciones';
import { TransaccionesFinancieras } from './transaccionesFinancieras';


@Component({
  selector: 'app-transaccionesFinancieras',
  templateUrl: './transaccionesFinancieras.component.html',
  styleUrls: ['./transaccionesFinancieras.component.scss']
})
export class TransaccionesFinancierasComponent implements OnInit {
  listaTransacciones: TransaccionesFinancieras [] = []
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  fechaAnteriorDesde: Date = new Date();
  obj: objDate;
  mostrarLoading: boolean = false;

  constructor(public _transaccionFinancieraService : TransaccionesFinancierasService) {}

  ngOnInit() {
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.traerTransaccionesPorRango();
  }

  traerListaTransacciones(){
    this.listaTransacciones = [];
    this.mostrarLoading = true;
    this._transaccionFinancieraService.getTransaccionesFinancieras().subscribe(res => {
      this.listaTransacciones = res as TransaccionesFinancieras[];
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
    this._transaccionFinancieraService.getTransaccionesFinancierasPorRango(this.obj).subscribe(
      (res) => {
        this.listaTransacciones = res as TransaccionesFinancieras[];
        this.mostrarLoading = false;
      },
      () => {}
    );
  }

  onExporting (e) {
    e.component.beginUpdate();
    e.component.columnOption("notas", "visible", true);
   
  };
  onExported (e) {
    e.component.columnOption("notas", "visible", false);
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
