import { Component, OnInit } from '@angular/core';
import { SucursalesService } from 'src/app/servicios/sucursales.service';
import { sucursal, cliente } from '../ventas/venta';
import { Sucursal } from '../compras/compra';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/servicios/user.service';
import { user } from '../user/user';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { element } from 'protractor';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  rolon: '';
  menuTipoDatos: string[] = [
    "Activo",
    "Inactivo",
  ];

  formaPago: string[] = [
    "Credito",
    "Contado",
  ];

  tiposClientes: string[] = [
    "Normal",
    "Socio",
    "Distribuidor"
  ];

  estado:string
  fechaNacimiento2:Date
  cliente = {
    _id: "",
    cliente_nombre: '',
    ruc: '',
    direccion: '',
    celular: '',
    tventa: "",
    telefono: "",
    correo:"",
    nombreContacto:"",
    direccionContacto:"",
    ciudad:"",
    celularContacto:"",
    fechaNacimiento:"",
    notas:"",
    t_cliente:"",
    regimen:"",
    forma_pago:"",
    dias_credito:0,
    cupo_maximo:0,
    tipoCliente:"",
    estado:"",

  }
  popupVisible:boolean=false
  nombreUser: string = ""
  clientes: cliente[] = []

  correo: string
  empresa: string
  rolUser:boolean=false
  usuarioLogueado: user
  usuarioLogueado2: user
  localAsignado:string=""
  cantidadUsuarios: number = 0
  cont1: number = 0
  locales:Sucursal[]=[]
  mensaje:string=""
  menu1: string[] = [
    "Usuario",
    "Administrador"
  ];

  constructor(public sucursalesService:SucursalesService,public clientesService:ClienteService, public userService:UserService) { }

  ngOnInit() {
    this.traerSucursales()
    this.traerClientes()
  }


  traerSucursales(){
    this.sucursalesService.getSucursales().subscribe(res => {
      this.locales = res as Sucursal[];
   })
  }

  traerClientes(){
    this.clientesService.getCliente().subscribe(res => {
      this.clientes= res as cliente[];
    },err => {})
  }

  mostrarUpdateUser = (e) => {  
    this.mostrarPopup(e.row.data)
    
  }

   mostrarPopup(e:any){
    this.cliente=e
    var y = document.getElementById("new");
    var z = document.getElementById("read");
    y.style.display = "block";
    z.style.display = "none";

  }

  setTipo(e){
    //this.usuario.status =e.value
  }

  deleteUser = (e) => {  
    this.mensajeConfirmacion(e.row.data) 
  }

  setClienteData(e){
    console.log("entre con "+e.value)
    this.clientes.forEach(element=>{
      if(element.cliente_nombre == this.mensaje){
        //alert("jale los daos "+JSON.stringify(element))
        this.cliente=element
      }
    })
  }


  updateCliente() {
    this.popupVisible=false
    this.mensajeGuardando()
    console.log("entre a actualizar " + JSON.stringify(this.cliente))
    this.clientesService.updateCliente(this.cliente).subscribe(
      res => {
        console.log(res); this.mensajeUpdate()
      },
      err => { console.log(err); this.mensajeError() }
    )
  }


  mensajeConfirmacion(e:any){
    Swal.fire({
      title: 'Advertencia',
      text: "Desea eliminar el cliente "+e.cliente_nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.value) {
        this.deleteUsuario(e)
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  deleteUsuario(e:any) {
    this.cliente=e
    this.mensajeGuardando()
    this.clientesService.deleteClientes(this.cliente).subscribe(
      res => {
        console.log(); this.mensajeEliminado()
      },
      err => { console.log(err); this.mensajeError() }
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
      title: 'Cliente actualizado',
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
      title: 'Cliente eliminado',
      text: 'Se ha eliminado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }



  mostrar(i: number) {
    

    var x = document.getElementById("read");
    var y = document.getElementById("new");
  
    switch (i) {
      case 1:
        x.style.display = "block";
        y.style.display = "none";
      
        break;

      case 2:
        this.cliente=new cliente
        x.style.display = "none";
        y.style.display = "block";
      
        break;

     
      default:
    }
  }
  


   register(f: NgForm) {
     //this.cliente.fechaNacimiento=this.fechaNacimiento2.toLocaleString()
    this.mensajeGuardando()
     if(this.cliente._id){
      this.clientesService.updateCliente(this.cliente).subscribe(res => {
        console.log(res + "entre por si"); this.mensajeActualizacion()},
      err => {
        Swal.fire({
          title: "Error",
          text: 'Revise e intente nuevamente',
          icon: 'error'
        })
       })
     }else{
      this.clientesService.newCliente(this.cliente).subscribe(res => {
        console.log(res + "entre por si"); this.mensajeCorrecto()},
      err => {
        Swal.fire({
          title: "Error",
          text: 'Revise e intente nuevamente',
          icon: 'error'
        })
       })
     }   
  } 

  asignarRol(e){
   // this.usuario.rol=e.value
  }


  validarUserRepet(user: string) {
   

   
      this.mensajeGuardando()
      //this.usuario.sucursal= this.localAsignado
      this.userService.newUser(this.cliente)
        .subscribe(
          res => {
            console.log(res + "entre por si"); this.mensajeCorrecto()
          },
          err => {
            Swal.fire({
              title: err.error,
              text: 'Revise e intente nuevamente',
              icon: 'error'
            })
          })
    /* } else {
      Swal.fire({
        title: 'Usuario existe',
        text: 'Ya hay un nombre creado con ese usuario',
        icon: 'error'
      })
    } */

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

  mensajeActualizacion() {
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

  onExporting (e) {
    e.component.beginUpdate();
    e.component.columnOption("telefono", "visible", true);
    e.component.columnOption("correo", "visible", true);
    e.component.columnOption("nombreContacto", "visible", true);
    e.component.columnOption("direccionContacto", "visible", true);
    e.component.columnOption("ciudad", "visible", true);
    e.component.columnOption("celularContacto", "visible", true);
    e.component.columnOption("fechaNacimiento", "visible", true);
    e.component.columnOption("notas", "visible", true);
    e.component.columnOption("t_cliente", "visible", true);
    e.component.columnOption("regimen", "visible", true);
    e.component.columnOption("forma_pago", "visible", true);
    e.component.columnOption("dias_credito", "visible", true);
    e.component.columnOption("cupo_maximo", "visible", true);
    e.component.columnOption("tipoCliente", "visible", true);
    e.component.columnOption("estado", "visible", true);
   
  };
  onExported (e) {
    e.component.beginUpdate();
    e.component.columnOption("telefono", "visible", false);
    e.component.columnOption("correo", "visible", false);
    e.component.columnOption("nombreContacto", "visible", false);
    e.component.columnOption("direccionContacto", "visible", false);
    e.component.columnOption("ciudad", "visible", false);
    e.component.columnOption("celularContacto", "visible", false);
    e.component.columnOption("fechaNacimiento", "visible", false);
    e.component.columnOption("notas", "visible", false);
    e.component.columnOption("t_cliente", "visible", false);
    e.component.columnOption("regimen", "visible", false);
    e.component.columnOption("forma_pago", "visible", false);
    e.component.columnOption("dias_credito", "visible", false);
    e.component.columnOption("cupo_maximo", "visible", false);
    e.component.columnOption("tipoCliente", "visible", false);
    e.component.columnOption("estado", "visible", false);
    e.component.endUpdate();
  }

}
