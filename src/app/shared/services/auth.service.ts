import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { auth } from  'firebase/app';
import { AngularFireAuth } from  "@angular/fire/auth";
import { User } from  'firebase';
import { Session } from 'protractor';
import { AuthenService } from 'src/app/servicios/authen.service';
import { user } from 'src/app/pages/user/user';

@Injectable()
export class AuthService {
  user: User;
  loggedIn:boolean;
  user2 = { email: '',
  password: ''

  }
  /* constructor(private router: Router,public authenService: AuthenService, public  afAuth:  AngularFireAuth) {
    if(sessionStorage.getItem("logged") == undefined){
      sessionStorage.setItem("logged", false.toString())
    }
    this.loggedIn = JSON.parse(sessionStorage.getItem("logged"));
    
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user){
        this.user = user;
        sessionStorage.setItem('user', JSON.stringify(this.user.email));
      } else {
        sessionStorage.setItem('user', null);
      }
    })
  } */

  constructor(private router: Router,public authenService: AuthenService, public  afAuth:  AngularFireAuth) {
    if(localStorage.getItem("logged") == undefined){
      localStorage.setItem("logged", false.toString())
    }
    this.loggedIn = JSON.parse(localStorage.getItem("logged"));
    
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user){
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user.email));
      } else {
        localStorage.setItem('user', null);
      }
    })
  }

  async logIn(login: string, password: string) {
     this.user2.email=login
    this.user2.password=password
    try{
      this.authenService.signIn(this.user2)
        .subscribe(
          res => {
            localStorage.setItem('token', res.token);
            this.loggedIn = true;
            localStorage.setItem("logged", this.loggedIn.toString())
            
            this.router.navigate(['/']);

          },
          error => {
            alert("Credenciales incorrectas")
          }
        );
     
    }catch(e){
      
    }
    
  }


  async loginIn(){
    

    try{
      if("token" in localStorage){ 
        this.router.navigate(['/home']);
      }else{
        console.log("no")
      }
     
    }catch(e){
      
    }
  }

  async logOut() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.loggedIn = false;
    localStorage.setItem("logged", this.loggedIn.toString())
    this.router.navigate(['/login-form']);
  }

  get isLoggedIn() {
    return this.loggedIn;
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private router: Router, private authService: AuthService, public authenService:AuthenService) {}
    role = ''
    canActivate(route: ActivatedRouteSnapshot): boolean {
        const isLoggedIn = this.authService.isLoggedIn;
        const isLoginForm = route.routeConfig.path === 'login-form';
        if (isLoggedIn && isLoginForm) {
            this.router.navigate(['/']);
            return false;
        }

        if (!isLoggedIn && !isLoginForm) {
            this.router.navigate(['/login-form']);
        }

        return isLoggedIn || isLoginForm;
    }
}
