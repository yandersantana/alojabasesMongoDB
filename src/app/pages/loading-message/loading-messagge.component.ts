import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { TransaccionesService } from 'src/app/servicios/transacciones.service';
import { AuthenService } from 'src/app/servicios/authen.service';

@Component({
  selector: 'app-loading-messagge',
  templateUrl: './loading-messagge.component.html',
  styleUrls: ['./loading-messagge.component.scss']
})
export class LoadingMessaggeComponent implements OnInit {
  @Input() messagge: string;
  popupVisible:boolean = true;
  mensajeLoading : string = "";
  @ViewChild('datag2') dataGrid2: DxDataGridComponent;
  constructor(public transaccionesService: TransaccionesService,public authenService:AuthenService) { }

  ngOnInit() {
    this.mensajeLoading = this.messagge;
  }

  
}
