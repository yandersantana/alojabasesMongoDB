import { Component, OnInit } from '@angular/core';
import { user } from './user';
import { SucursalesService } from 'src/app/servicios/sucursales.service';
import { Sucursal } from '../compras/compra';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/servicios/user.service';
import { AuthenService } from 'src/app/servicios/authen.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  rolon: '';
  menuTipoDatos: string[] = [
    "Activo",
    "Inactivo",
  ];

  //usuario:user
  usuario = {
    _id: "",
    name: '',
    password: '',
    email: '',
    rol: 'Usuario',
    sucursal: "matriz",
    username: "",
    status:"Activo",
    codigoFacturacion: '',
  }
  popupVisible:boolean=false
  nombreUser: string = ""
  usuarios: user[] = []
  usuariosempresa2: user[] = []
  usuariosprueba: user[] = []
  correo: string
  empresa: string
  rolUser:boolean=false
  usuarioLogueado: user
  usuarioLogueado2: user
  localAsignado:string=""
  cantidadUsuarios: number = 0
  cont1: number = 0
  locales:Sucursal[]=[]
  mostrarLoading = false;
  mensajeLoading = ""
  mostrarBloqueo = true;
  
  menu1: string[] = [
    "Usuario",
    "Administrador",
    "Usuario Web",
    "Supervisor",
    "Inspector",
    "Distribuidor"
  ];

  constructor(
    public sucursalesService:SucursalesService, 
    public _authenService : AuthenService,
    public userService:UserService) { }

  ngOnInit() {
    this.cargarUsuarioLogueado();
    this.traerSucursales()
    this.traerUsuarios()
    
  }

  mostrarPopupCodigo(){
     Swal.fire({
      title: 'Código de Seguridad',
      allowOutsideClick: false,
      showCancelButton: false,
      inputAttributes: {
        autocapitalize: 'off'
      },
      confirmButtonText: 'Ingresar',
      input: 'password',
    }).then((result) => {
      if(this.usuarioLogueado.codigo == result.value)
          this.mostrarBloqueo = false;
        else  {
          Swal.fire({
            title: 'Error',
            text: 'El código ingresado no es el correcto',
            icon: 'error',
            confirmButtonText: 'Ok'
          }).then((result) => {
            this.mostrarPopupCodigo();
          })
        }
    })
  }


  cargarUsuarioLogueado() {
    var correo = "";
    const promesaUser = new Promise((res, err) => {
      if (localStorage.getItem("maily") != '') 
        correo = localStorage.getItem("maily");

      this._authenService.getUserLogueado(correo).subscribe(
          res => {
            var usuario = res as user;
            this.usuarioLogueado = usuario[0];
            this.mostrarPopupCodigo();
          }
        )
    });
  }

  traerSucursales(){
    this.sucursalesService.getSucursales().subscribe(res => {
      this.locales = res as Sucursal[];
   })
  }

  traerUsuarios(){
    this.mensajeLoading = "Cargando.."
    this.mostrarLoading = true;
    this.userService.getUsers().subscribe(res => {
      this.usuarios= res as user[];
      this.mostrarLoading = false;
    },err => {})
  }

  mostrarUpdateUser = (e) => {  
    this.mostrarPopup(e.row.data)
  }

   mostrarPopup(e:any){
    this.usuario= e
    this.popupVisible=true
  }

  setTipo(e){
    this.usuario.status =e.value
  }

  deleteUser = (e) => {  
    this.mensajeConfirmacion(e.row.data)
  }


  updateUsuario() {
    this.popupVisible=false
    this.mensajeGuardando()
    this.userService.updateUsuario(this.usuario).subscribe(
      res => { this.mensajeUpdate() },
      err => { this.mensajeError() }
    )
  }


  mensajeConfirmacion(e:any){
    Swal.fire({
      title: 'Advertencia',
      text: "Desea eliminar el usuario "+e.username,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si'
    }).then((result) => {
      this.deleteUsuario(e)  
    })
  }

  deleteUsuario(e:any) {
    this.usuario = e
    this.mensajeGuardando()
    this.userService.deleteUsuario(this.usuario).subscribe(
      res => { this.mensajeEliminado() },
      err => { this.mensajeError() }
    )
  }

  mensajeError() {
    Swal.close()
    Swal.fire({
      title: 'Error',
      text: 'Se ha producido un error al guardar',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }


  mensajeUpdate() {
    Swal.close()
    Swal.fire({
      title: 'Usuario actualizado',
      text: 'Se ha guardado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }

  mensajeEliminado() {
    Swal.close()
    Swal.fire({
      title: 'Usuario eliminado',
      text: 'Se ha eliminado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }



  mostrar(i: number) {
    this.usuario.email=""
    this.usuario.name=""
    this.usuario.username=""
    this.usuario.password=""

    var x = document.getElementById("read");
    var y = document.getElementById("new");
    switch (i) {
      case 1:
        x.style.display = "block";
        y.style.display = "none";
        break;

      case 2:
        x.style.display = "none";
        y.style.display = "block";
        break;

      case 3:
        x.style.display = "none";
        y.style.display = "none";
        break;
      default:
    }
  }


  register(f: NgForm) {
      if (this.usuario.email != "" && this.usuario.name != "" && this.usuario.password != "" && this.usuario.codigoFacturacion != "") {
        this.validarUserRepet(this.usuario.username)
      } else {
        Swal.fire({
          title: 'Hay campos vacios',
          text: 'Revise e intente nuevamente',
          icon: 'error'
        })
      }  
  }

  asignarRol(e){
    this.usuario.rol=e.value
  }


  validarUserRepet(user: string) {
    this.mensajeGuardando()
    this.usuario.sucursal= this.localAsignado
    this.userService.newUser(this.usuario)
      .subscribe(
        res => { this.mensajeCorrecto() },
        err => {
          Swal.fire({
            title: err.error,
            text: 'Revise e intente nuevamente',
            icon: 'error'
          })
    })


  }

  mensajeCorrecto() {
    Swal.close()
    Swal.fire({
      title: 'Usuario creado',
      text: 'Se ha guardado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }

  mensajeGuardando() {
    Swal.close()
    let timerInterval
    Swal.fire({
      title: 'Guardando',
      html: 'Procesando',
      timerProgressBar: true,
      onBeforeOpen: () => {
        Swal.showLoading()
        timerInterval = setInterval(() => {
          const content = Swal.getContent()
          if (content) {
            const b = content.querySelector('b')

          }
        }, 100)
      },
      onClose: () => {
        clearInterval(timerInterval)
      }
    })
  }

}
