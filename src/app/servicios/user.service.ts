import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { user } from '../pages/user/user';
import { AuthenService} from './authen.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  usuarios: user[];
  role = ''
  userEmail = '';
  //private URL = 'http://localhost:3000/usuario';
  //private URL = 'http://104.248.14.190:3000/usuario';
  private URL = 'http://104.131.82.174:3000/usuario';
  constructor(private http: HttpClient, private router: Router, private authenService: AuthenService, ) { }

  newUser(user){
    console.log("el usuario "+JSON.stringify(user))
    return this.http.post<any>(this.URL +'/newUser', user);
  }

  getUsers(){ 
    return this.http.get(this.URL+'/getUsers');
  }

  updateUsuario(usuario){
    return this.http.put(this.URL + `/update/${usuario._id}`, usuario); 
  }

  deleteUsuario(usuario){
    return this.http.delete(this.URL + `/delete/${usuario._id}`, usuario); 
  }

  updateUser(user){
    console.log("aqui es "+this.URL + `/update/${user._id}`)
    return this.http.put(this.URL + `/updateUser/${user._id}`, user); 
  }

  //autenticacion

  signup(user) {

    return this.http.post<any>(this.URL + '/register', user);
  }

  signIn(user) {
    this.userEmail = user.email;
    console.log(user.email + "aqui");
    localStorage.setItem('maily',  this.userEmail = user.email);
    return this.http.post<any>(this.URL + '/signIn', user);
  }



 
}
