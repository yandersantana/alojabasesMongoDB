import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { auth } from  'firebase/app';
import { AngularFireAuth } from  "@angular/fire/auth";
import { User } from  'firebase';
import { Session } from 'protractor';

@Injectable()
export class AuthService {
  user: User;
  loggedIn:boolean;

  constructor(private router: Router, public  afAuth:  AngularFireAuth) {
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
  }

  async logIn(login: string, passord: string) {
    try{
      var result = await this.afAuth.auth.signInWithEmailAndPassword(login, passord)
      this.loggedIn = true;
      sessionStorage.setItem("logged", this.loggedIn.toString())
      sessionStorage.setItem("user", login)
      this.router.navigate(['/']);
    }catch(e){
      alert("Credenciales incorrectas")
    }
    
  }

  async logOut() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    this.loggedIn = false;
    sessionStorage.setItem("logged", this.loggedIn.toString())
    this.router.navigate(['/login-form']);
  }

  get isLoggedIn() {
    return this.loggedIn;
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}

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
