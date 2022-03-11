import { Component, OnInit } from '@angular/core';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { PrestamosService } from 'src/app/servicios/prestamos.service';
import { ReciboCajaService } from 'src/app/servicios/reciboCaja.service';
import { SubCuentasService } from 'src/app/servicios/subCuentas.service';
import { TransaccionesFinancierasService } from 'src/app/servicios/transaccionesFinancieras.service';
import Swal from 'sweetalert2';
import { objDate } from '../transacciones/transacciones';
import { Prestamos } from './prestamos';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.scss']
})

export class PrestamosComponent implements OnInit {
  listaPrestamosTmp: Prestamos [] = []
  listaPrestamos: Prestamos [] = []
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  fechaAnteriorDesde: Date = new Date();
  obj: objDate;
  mostrarLoading: boolean = false;
  tiposRecibo: string[] = [
    'Activas',
    'Canceladas'
  ];

  tipoRecibo = ""

  constructor(
    public _prestamosService : PrestamosService,
    public _subCuentasService : SubCuentasService,
    public _transaccionFinancieraService : TransaccionesFinancierasService,
    public _reciboCajaService : ReciboCajaService,
    public _contadoresService: ContadoresDocumentosService,
    ) {
   }

  ngOnInit() {
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.traerCuentasPorRango();
  }

  traerlistaPrestamos(){
    this.listaPrestamosTmp = [];
    this.mostrarLoading = true;
    this._prestamosService.getPrestamos().subscribe(res => {
      this.listaPrestamosTmp = res as Prestamos[];
      this.separarCuentas(1)
      this.mostrarLoading = false;
   })
  }

  traerCuentasPorRango() {
    this.listaPrestamosTmp = [];
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._prestamosService.getPrestamosPorRango(this.obj).subscribe(
      (res) => {
        this.listaPrestamosTmp = res as Prestamos[];
        this.separarCuentas(1)
        this.mostrarLoading = false;
      },
      () => {}
    );
  }

  opcionRadioTipos(e){
    this.tipoRecibo = e.value;
    switch (e.value) {
      case "Activas":
        this.separarCuentas(1)

        break;
      case "Canceladas":
        this.separarCuentas(2)
        break;
      default:    
    }      
  }

  separarCuentas(numero){
    this.listaPrestamos = []
    if(numero == 1){
      this.listaPrestamosTmp.forEach(element=>{
      if(element.estado == "Activa")
        this.listaPrestamos.push(element)
      })
    }else if(numero == 2){
      this.listaPrestamosTmp.forEach(element=>{
      if(element.estado == "Cancelado")
        this.listaPrestamos.push(element)
      })
    }
    
  }

  onExporting (e) {
/*     e.component.beginUpdate();
    e.component.columnOption("tipo_documento", "visible", true);
    e.component.columnOption("celular", "visible", true);
    e.component.columnOption("valor_unitario", "visible", true);
    e.component.columnOption("cajas", "visible", true);
    e.component.columnOption("piezas", "visible", true);
    e.component.columnOption("cantM2", "visible", true);
    e.component.columnOption("notas", "visible", true); */
   
  };
  onExported (e) {
/*     e.component.columnOption("tipo_documento", "visible", false);
    e.component.columnOption("celular", "visible", false);
    e.component.columnOption("valor_unitario", "visible", false);
    e.component.columnOption("cajas", "visible", false);
    e.component.columnOption("piezas", "visible", false);
    e.component.columnOption("cantM2", "visible", false);
    e.component.columnOption("notas", "visible", false);
    e.component.endUpdate(); */
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
