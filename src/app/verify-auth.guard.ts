import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenService } from './servicios/authen.service';
import { user } from './pages/user/user';
import { Role } from './layouts/role';

@Injectable({
  providedIn: 'root'
})
export class VerifyAuthGuard implements CanActivate {
  role = ''
  constructor(
    private authenService: AuthenService,
    private router: Router
  ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (this.authenService.loggedIn()) {

      this.authenService.returnUserRol().subscribe((ordenes: user[]) => {
        new Promise<any>((resolve, reject) => {
          ordenes.forEach((nt) => {
            this.role = nt.rol
            //alert("sx "+this.role)
            if (route.data.roles && route.data.roles.indexOf(this.role) === -1) {
              // role not authorised so redirect to home page
              //this.router.navigate(['/dashboard']);
              return false;
            }



          })

        })
      })

      console.log(this.role)
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }    /*(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): 
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }*/


}
