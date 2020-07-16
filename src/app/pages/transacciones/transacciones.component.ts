import { Component, OnInit,ViewChild } from '@angular/core';
import { transaccion } from './transacciones';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { DxDataGridComponent } from 'devextreme-angular';
import { TransaccionesService } from 'src/app/servicios/transacciones.service';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.scss']
})
export class TransaccionesComponent implements OnInit {

 transacciones : transaccion[] = []
 popupvisible:boolean=false
 @ViewChild('datag2') dataGrid2: DxDataGridComponent;
  constructor(public transaccionesService: TransaccionesService) { }

  ngOnInit() {
    this.traerTransacciones()
  }

  traerTransacciones(){
    this.transaccionesService.getTransaccion().subscribe(res => {
      this.transacciones = res as transaccion[];
   })
  }


  mostrarpopup(){
    this.popupvisible=true
  }

  onRowPrepared(e) { 
  }

  onExporting (e) {
    e.component.beginUpdate();
    e.component.columnOption("fecha_transaccion", "visible", true);
    e.component.columnOption("bodega", "visible", true);
    e.component.columnOption("valor", "visible", true);
    e.component.columnOption("usu_autorizado", "visible", true);
    e.component.columnOption("usuario", "visible", true);
    e.component.columnOption("observaciones", "visible", true);
    e.component.columnOption("cliente", "visible", true);
    e.component.columnOption("costo_unitario", "visible", true);
    e.component.columnOption("cantM2", "visible", true);
    e.component.columnOption("proveedor", "visible", true);
    e.component.columnOption("maestro", "visible", true);
    e.component.columnOption("movimiento", "visible", true);
    e.component.columnOption("factPro", "visible", true);
  };
  onExported (e) {
    e.component.columnOption("fecha_transaccion", "visible", false);
    e.component.columnOption("bodega", "visible", false);
    e.component.columnOption("valor", "visible", false);
    e.component.columnOption("usu_autorizado", "visible", false);
    e.component.columnOption("usuario", "visible", false);
    e.component.columnOption("cliente", "visible", false);
    e.component.columnOption("cantM2", "visible", false);
    e.component.columnOption("costo_unitario", "visible", false);
    e.component.columnOption("proveedor", "visible", false);
    e.component.columnOption("movimiento", "visible", false);
    e.component.columnOption("maestro", "visible", false);
    e.component.columnOption("observaciones", "visible", false);
    e.component.columnOption("factPro", "visible", false);
    e.component.endUpdate();
  }

 
}
