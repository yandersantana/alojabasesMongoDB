import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { user } from "../pages/user/user";

@Injectable({
  providedIn: "root",
})
export class AuthenService {
  userEmail = "";
  userLogin;
  usuario: user;
  usuarios: user[] = [];
  usuarios2: user[] = [];
  estalogeado: boolean = true;

  private URL = "http://159.223.107.115:3000/usuario";
  //private URL = "http://104.131.82.174:3000/usuario";
  //private URL = 'http://localhost:3000/usuario';

  constructor(private http: HttpClient, private router: Router) {}

  signup(user) {
    return this.http.post<any>(this.URL + "/register", user);
  }

  signIn(user) {
    this.userEmail = user.email;
    localStorage.setItem("maily", (this.userEmail = user.email));
    return this.http.post<any>(this.URL + "/signIn", user);
  }

  loggedIn() {
    //comprobar si el usuario esta logeado
    return !!localStorage.getItem("token");
  }

  returnUserRol() {
    const pr = localStorage.getItem("maily");
    return this.http.get(this.URL + `/getUsers1/${pr}`);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("contrasena");
    this.router.navigate(["/login"]);
  }

  getUsers() {
    return this.http.get(this.URL + "/getUsers");
  }

  getUserLogueado(correo: string) {
    return this.http.get(this.URL + `/getUsers1/${correo}`);
  }

  Savesresponse(responce) {
    this.userEmail = responce["email"];
    localStorage.setItem("maily", (this.userEmail = responce["email"]));
    return this.http.post<any>(this.URL + "/signInGoogle", responce);
  }
}
