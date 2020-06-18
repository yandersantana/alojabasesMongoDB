import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { user } from '../pages/user/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {
  userEmail = '';
  userLogin;
  usuario: user;
  usuarios: user[] = []
  usuarios2: user[] = []
  estalogeado:boolean = true;
  

  // private URL = 'http://localhost:3000/usuario';
  private URL = 'http://localhost:3000/usuario';
  //private URL = 'http://104.248.14.190:3000/usuario';

  constructor(private http: HttpClient, private router: Router) { }

  signup(user) {

    return this.http.post<any>(this.URL + '/register', user);
  }

  signIn(user) {
    this.userEmail = user.email;
    console.log(JSON.stringify(user));
    localStorage.setItem('maily',  this.userEmail = user.email);
    return this.http.post<any>(this.URL + '/signIn', user);
  }

  loggedIn() {//comprobar si el usuario esta logeado
    return !!localStorage.getItem('token');
  }

  returnUserRol(){ 
    const pr = localStorage.getItem('maily')
    console.log(this.URL+`/getUsers1/${pr}`)
    return this.http.get(this.URL+`/getUsers1/${pr}`);
    
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getUsers() {
    return this.http.get(this.URL + '/getUsers');
  }

  
  getUserLogueado(correo:string){ 
    console.log(this.URL+`/getUsers1/${correo}`)
    return this.http.get(this.URL+`/getUsers1/${correo}`);
  }


  Savesresponse(responce) {
    console.log("soy gmail"+responce['email']);
     this.userEmail= responce['email'];
     localStorage.setItem('maily',  this.userEmail = responce['email']);
    return this.http.post<any>(this.URL + '/signInGoogle', responce);
    //return this.http.post(this.URL,responce);
  }

 

}
