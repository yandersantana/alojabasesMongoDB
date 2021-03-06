import { Component, NgModule, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxListModule } from 'devextreme-angular/ui/list';
import { DxContextMenuModule } from 'devextreme-angular/ui/context-menu';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthenService } from 'src/app/servicios/authen.service';
import { user } from 'src/app/pages/user/user';

@Component({
  selector: 'app-user-panel',
  templateUrl: 'user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})

export class UserPanelComponent implements OnInit {
  @Input()
  menuItems: any;

  @Input()
  menuMode: string;
  usuarioLogueado:user
  user:string
  correo:string=""
  constructor(public  afAuth:  AngularFireAuth ,public authenService: AuthenService) {
    //this.user=sessionStorage.getItem("user")
    
  }

  ngOnInit(){
    this.cargarUsuarioLogueado()
  }


  cargarUsuarioLogueado() {
    const promesaUser = new Promise((res, err) => {
      if (localStorage.getItem("maily") != '') {
        this.correo = localStorage.getItem("maily");
      }
      this.authenService.getUserLogueado(this.correo)
        .subscribe(
          res => {
            this.usuarioLogueado = res as user;
            console.log("dd "+JSON.stringify(this.usuarioLogueado))
            this.user=this.usuarioLogueado[0].username
            console.log("dcc "+this.user)
            sessionStorage.setItem("user", this.usuarioLogueado[0].username)
          },
          err => {
          }
        )
    });
  }
  
  
}

@NgModule({
  imports: [
    DxListModule,
    DxContextMenuModule,
    CommonModule
  ],
  declarations: [ UserPanelComponent ],
  exports: [ UserPanelComponent ]
})
export class UserPanelModule { }
