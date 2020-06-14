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
  constructor(private router: Router,public authenService: AuthenService, public  afAuth:  AngularFireAuth) {
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

  async logIn(login: string, password: string) {
     this.user2.email=login
    this.user2.password=password
    try{
      var result = await this.authenService.signIn(this.user2)
      this.loggedIn = true;
      sessionStorage.setItem("logged", this.loggedIn.toString())
      
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

        if (isLoggedIn) {
          //alert("entre")
          this.authenService.returnUserRol().subscribe((ordenes: user[]) => {
            new Promise<any>((resolve, reject) => {
              ordenes.forEach((nt) => {
                this.role = nt.rol
               console.log("sx "+this.role)
                if (route.data.roles && route.data.roles.indexOf(this.role) === -1) {
                  // role not authorised so redirect to home page
                  this.router.navigate(['/dashboard']);
                  return false;
                }
    
    
    
              })
    
            })
          })
    
          console.log(this.role)
          return true;
        }else{
         // alert("ll")
        }

        return isLoggedIn || isLoginForm;
    }
}
