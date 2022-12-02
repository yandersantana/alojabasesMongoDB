import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { user } from "../pages/user/user";

@Injectable({
  providedIn: "root",
})
export class UserService {
  usuarios: user[];
  role = "";
  userEmail = "";
  //private URL = 'http://localhost:3000/usuario';
  private URL = "http://159.223.107.115:3000/usuario";
  //private URL = 'http://104.131.82.174:3000/usuario';
  constructor(private http: HttpClient,) {}

  newUser(user) {
    return this.http.post<any>(this.URL + "/newUser", user);
  }

  getUsers() {
    return this.http.get(this.URL + "/getUsers");
  }

  updateUsuario(usuario) {
    return this.http.put(this.URL + `/update/${usuario._id}`, usuario);
  }

  deleteUsuario(usuario) {
    return this.http.delete(this.URL + `/delete/${usuario._id}`, usuario);
  }

  updateUser(user) {
    return this.http.put(this.URL + `/updateUser/${user._id}`, user);
  }

  signup(user) {
    return this.http.post<any>(this.URL + "/register", user);
  }

  signIn(user) {
    this.userEmail = user.email;
    localStorage.setItem("maily", (this.userEmail = user.email));
    return this.http.post<any>(this.URL + "/signIn", user);
  }
}
