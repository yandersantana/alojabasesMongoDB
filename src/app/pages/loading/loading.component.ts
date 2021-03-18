import { Component, OnInit,ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { TransaccionesService } from 'src/app/servicios/transacciones.service';
import { AuthenService } from 'src/app/servicios/authen.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

 /*transacciones : transaccion[] = []
 transaccionesGlobales : transaccion[] = []
 popupvisible:boolean=false
 correo:string
 usuarioLogueado:user*/
 popupVisible:boolean = true;
 @ViewChild('datag2') dataGrid2: DxDataGridComponent;
  constructor(public transaccionesService: TransaccionesService,public authenService:AuthenService) { }

  ngOnInit() {
    //this.cargarUsuarioLogueado()
    //this.traerTransacciones()
  }

  
}
