import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { AuthService } from '../../services';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxCheckBoxModule } from 'devextreme-angular/ui/check-box';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxValidatorModule } from 'devextreme-angular/ui/validator';
import { DxValidationGroupModule } from 'devextreme-angular/ui/validation-group';
import { AngularFireModule } from 'angularfire2';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { user } from 'src/app/pages/user/user';
import { AuthenService } from 'src/app/servicios/authen.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  login = '';
  password = '';

  response;
  usuario:user
  loggedIn: boolean;
  public isError = false;
  public isErrorGoogle = false;
  public loginError = "";

  user = { email: '',
  password: ''

  }
 
  constructor(private authenService: AuthenService,private router: Router, private authService: AuthService) { }


  ngOnInit() {
    this.traerUsuarios()
  }

  traerUsuarios() {
    this.authenService.getUsers().subscribe(res => {
      this.authenService.usuarios = res as user[];
    })
  }

  leerToken(){
    this.authService.loginIn();
  }

  signIn(e) {
    this.authService.logIn(this.login, this.password);
  }

}



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxValidationGroupModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  declarations: [ LoginFormComponent ],
  exports: [ LoginFormComponent ]
})
export class LoginFormModule { }
