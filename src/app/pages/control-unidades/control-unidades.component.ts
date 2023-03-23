import { Component, OnInit } from '@angular/core';
import { ControlPreciosService } from 'src/app/servicios/control-precios.service';
import Swal from 'sweetalert2';
import { PrecioEspecialService } from 'src/app/servicios/precio-especial.service';
import { catalogo } from '../catalogo/catalogo';
import { ProductoService } from 'src/app/servicios/producto.service';
import { CatalogoService } from 'src/app/servicios/catalogo.service';
import { producto } from '../ventas/venta';
import { AuthenService } from 'src/app/servicios/authen.service';
import { user } from '../user/user';
import { clasificacionActualizacion } from '../consolidado/consolidado';
import { controlUnidades } from './control-unidades';
import { ControlMercaderiaService } from 'src/app/servicios/control-mercaderia.service';

@Component({
  selector: 'app-control-unidades',
  templateUrl: './control-unidades.component.html',
  styleUrls: ['./control-unidades.component.scss']
})
export class ControlUnidadesComponent implements OnInit {

  nuevaParametrizacion : controlUnidades
  listaParametrizaciones : controlUnidades[]=[]
  mostrarListado = true;
  mostrarNuevo = false;


  productosCatalogo:catalogo[]=[]
  productos:producto[]=[]
  
  nombrePro:producto
  usuarioLogueado : user;
  mostrarBloqueo = true;
  listaClasificacion: clasificacionActualizacion[] = [];
  nombreClasificacion = ""

  constructor(
    public catalagoService:CatalogoService, 
    public _authenService : AuthenService,
    public productosService:ProductoService, 
    public _controlMercaderiaService : ControlMercaderiaService ) 
  { 
    this.nuevaParametrizacion= new controlUnidades()
  }

  ngOnInit() {
    this.cargarUsuarioLogueado()
    this.traerParametrizaciones()
    var clasi = new clasificacionActualizacion()
    clasi.nombreClasificacion = "Ceramicas"
    var clasi2 = new clasificacionActualizacion()
    clasi2.nombreClasificacion = "Porcelanatos"
    this.listaClasificacion.push(clasi)
    this.listaClasificacion.push(clasi2)
  }

  cargarUsuarioLogueado() {
    var correo = ""
    new Promise((res, err) => {
      if (localStorage.getItem("maily") != '') 
        correo = localStorage.getItem("maily");

      this._authenService.getUserLogueado(correo)
        .subscribe(
          res => {
            var usuario = res as user;
            this.usuarioLogueado = usuario[0]
            this.mostrarPopupCodigo();
          }
        )
    });
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
      if(this.usuarioLogueado.codigo == result.value){
        this.mostrarBloqueo = false;       
      }else{
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


  traerParametrizaciones(){
    this._controlMercaderiaService.getParametrizaciones().subscribe(res => {
      this.listaParametrizaciones = res as controlUnidades[];
    })
  }



  registrar(){
    if(this.nuevaParametrizacion._id == null){
      var existe = this.listaParametrizaciones.find(x=> x.nombreGrupo == this.nombreClasificacion)
      if(existe == undefined){
        this.nuevaParametrizacion.nombreGrupo = this.nombreClasificacion
        this._controlMercaderiaService.newParametrizacion(this.nuevaParametrizacion).subscribe(
          res => { this.mensajeCorrecto() },
          err => {
            Swal.fire({
              title: "Error",
              text: 'Revise e intente nuevamente',
              icon: 'error'
            })
          }) 
      }else{
        Swal.fire({
          title: "Error",
          text: 'Ya existe el registro a ingresar',
          icon: 'error'
        })
      }
    }else{
      this._controlMercaderiaService.updateRegistro(this.nuevaParametrizacion).subscribe(
        res => { this.mensajeCorrecto() },
        err => {
          Swal.fire({
            title: "Error",
            text: 'Revise e intente nuevamente',
            icon: 'error'
          })
        }) 
    }
  }


  mostrarUpdateUser = (e) => {  
    this.mostrarPopup(e.row.data)
  }

  mostrarPopup(element : any){
    console.log(element)
    this.nombreClasificacion = element.nombreGrupo;
    this.nuevaParametrizacion = element;
    this.mostrarNuevo = true;
    this.mostrarListado = false;
  }

  errorRango(){
    Swal.fire({
      title: "Error",
      text: 'El numero de rango no puede ser menor al anterior',
      icon: 'error'
    })
  }

  deletePrecio= (e) => {  
    this.delete(e.row.data)
  }

  delete(elemento : any){
    Swal.fire({
      title: 'Advertencia',
      text: "Desea eliminar el registro para el grupo " + elemento.nombreGrupo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.value) {
        this._controlMercaderiaService.deleteRegistro(elemento).subscribe(
          res => { this.mensajeEliminado() },
          err => { this.mensajeError() }
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  mensajeError(){
    Swal.fire({
      title: 'Error',
      text: 'Se produció un error al guardar',
      icon: 'error',
      confirmButtonText: 'Ok'
    })
  }

  mensajeEliminado(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se eliminó con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }

  

  mensajeCorrecto(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se guardó con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }

  mensajeActualizacion(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se actualizó su grupo de precios',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }


  mostrar(i: number) {
    switch (i) {
      case 1:
        this.mostrarListado = true;
        this.mostrarNuevo = false;
        break;

      case 2:
        this.mostrarListado = false;
        this.mostrarNuevo = true;
        break;

      default:
    }
  }


}
