import { Component, OnInit } from '@angular/core';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { CuentasPorPagarService } from 'src/app/servicios/cuentasPorPagar.service';
import { ReciboCajaService } from 'src/app/servicios/reciboCaja.service';
import { SubCuentasService } from 'src/app/servicios/subCuentas.service';
import { TransaccionesFinancierasService } from 'src/app/servicios/transaccionesFinancieras.service';
import Swal from 'sweetalert2';
import { objDate } from '../transacciones/transacciones';
import { CuentaPorPagar } from './cuentasPorPagar';



@Component({
  selector: 'app-cuentasPorPagar',
  templateUrl: './cuentasPorPagar.component.html',
  styleUrls: ['./cuentasPorPagar.component.scss']
})
export class CuentaPorPagarComponent implements OnInit {
  listaCuentas: CuentaPorPagar [] = []
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  fechaAnteriorDesde: Date = new Date();
  obj: objDate;
  mostrarLoading: boolean = false;

  constructor(
    public _cuentasporPagarService : CuentasPorPagarService,
    public _subCuentasService : SubCuentasService,
    public _transaccionFinancieraService : TransaccionesFinancierasService,
    public _reciboCajaService : ReciboCajaService,
    public _contadoresService: ContadoresDocumentosService
    ) {
   }

  ngOnInit() {
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.traerCuentasPorRango();
  }

  traerListaCuentas(){
    this.listaCuentas = [];
    this.mostrarLoading = true;
    this._cuentasporPagarService.getCuentasPorPagarActivas().subscribe(res => {
      this.listaCuentas = res as CuentaPorPagar[];
      this.mostrarLoading = false;
   })
  }

  traerCuentasPorRango() {
    this.listaCuentas = [];
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._cuentasporPagarService.getCuentasPorPagarPorRango(this.obj).subscribe(
      (res) => {
        this.listaCuentas = res as CuentaPorPagar[];
        this.mostrarLoading = false;
      },
      () => {}
    );
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
