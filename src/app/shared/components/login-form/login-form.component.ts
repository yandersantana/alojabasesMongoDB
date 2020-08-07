import { Component, NgModule, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { AuthService, AppInfoService } from '../../services';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxCheckBoxModule } from 'devextreme-angular/ui/check-box';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxValidatorModule } from 'devextreme-angular/ui/validator';
import { DxValidationGroupModule, DxValidationGroupComponent } from 'devextreme-angular/ui/validation-group';
import { AngularFireModule } from 'angularfire2';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { user } from 'src/app/pages/user/user';
import { AuthenService } from 'src/app/servicios/authen.service';
import { NgForm } from '@angular/forms';

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
 // @ViewChild("validateLogin", { static: false }) validateLogin: DxValidationGroupComponent

  //constructor(private authService: AuthService, public appInfo: AppInfoService, private spinner: NgxSpinnerService) { }
  constructor(private authenService: AuthenService,private router: Router, private authService: AuthService) { }


  ngOnInit() {
    /* localStorage.removeItem('token');
    if("maily" in localStorage){ 
      localStorage.removeItem('maily');
      localStorage.removeItem('contrasena');
    } 
    if("currentUser" in localStorage){ 
      localStorage.removeItem('currentUser');
    }  */
    this.traerUsuarios()
    //this.leerToken()
    
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
    //this.spinner.show()
    /* if (!this.validateLogin.instance.validate().isValid) {
      return;
    } */

    this.authService.logIn(this.login, this.password);

    //this.validateLogin.instance.reset();
   // this.spinner.hide()
  }

 
 /*  signIn(e) {
    this.user.email=this.login
    this.user.password=this.password
      this.authService.logIn(this.user)
        .subscribe(
          res => {
            this.router.navigate(['/']);
            localStorage.setItem('token', res.token);
            console.log("entre por correcto");
          },
          error => {
            console.log("entre por error "+error.error);
            this.isError = true;
            this.loginError = error.error;
            setTimeout(() => {
              this.isError = false;
            }, 5000);
          }
        );
    
  } */

  /* signIn(f: NgForm) {
    //console.log(this.user);
    if (f.valid) {

      this.authenService.signIn(this.user)
        .subscribe(
          res => {
            localStorage.setItem('token', res.token);
           // localStorage.setItem('token', res.to);
            this.router.navigate(['/dashboard']);

          },
          error => {
            this.isError = true;
            this.loginError = error.error;
            setTimeout(() => {
              this.isError = false;
            }, 5000);
          }
        );
    }
  } */
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
