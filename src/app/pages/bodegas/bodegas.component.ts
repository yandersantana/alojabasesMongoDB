import { Component, OnInit } from '@angular/core';
import { bodega } from '../producto/producto';
import { BodegaService } from 'src/app/servicios/bodega.service';
import Swal from 'sweetalert2';
import { SucursalesService } from 'src/app/servicios/sucursales.service';
import { sucursal } from '../ventas/venta';
import { Sucursal } from '../compras/compra';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-bodegas',
  templateUrl: './bodegas.component.html',
  styleUrls: ['./bodegas.component.scss']
})
export class BodegasComponent implements OnInit {

  bodegas:bodega[]=[]
  bodega:bodega
  popupVisible:boolean=false
  locales:Sucursal[]=[]
  localAsignado:string=""

  bodegaL = {
    _id: "",
    nombre: '',
    persona_responsable: '',
    direccion: '',
    sucursal: ''
  }
  constructor(public bodegasService:BodegaService,public sucursalesService:SucursalesService) { }

  ngOnInit() {
    this.traerBodegas()
    this.traerSucursales()
  }

  traerBodegas(){
    this.bodegasService.getBodegas().subscribe(res => {
      this.bodegas = res as bodega[];
   })
  }

  traerSucursales(){
    this.sucursalesService.getSucursales().subscribe(res => {
      this.locales = res as Sucursal[];
   })
  }

  mostrarUpdateBodega = (e) => {  
    this.mostrarPopup(e.row.data)
  }

   mostrarPopup(e:any){
    this.bodega= e
    this.popupVisible=true
  }

  deleteBodega = (e) => {  
    this.mensajeConfirmacion(e.row.data)
    
  }

  updateBodega() {
    this.popupVisible=false
    this.mensajeGuardando()
    this.bodega.sucursal = this.localAsignado
    this.bodegasService.updateBodega(this.bodega).subscribe(
      res => {
        console.log(res); this.mensajeUpdate()
      },
      err => { console.log(err); this.mensajeError() }
    )
  }

  register(f: NgForm) {
    if (this.bodegaL.nombre != "" && this.bodegaL.direccion != "" && this.bodegaL.persona_responsable != "") {
      this.mensajeGuardando()
      this.bodegaL.sucursal = this.localAsignado
    this.bodegasService.newBodegas(this.bodegaL)
      .subscribe(
        res => {
          this.mensajeCorrecto()
        },
        err => {
          Swal.fire({
            title: err.error,
            text: 'Revise e intente nuevamente',
            icon: 'error'
          })
        })
    } else {
      Swal.fire({
        title: 'Hay campos vacios',
        text: 'Revise e intente nuevamente',
        icon: 'error'
      })
    }  
}

  validarUserRepet(user: string) {
    this.mensajeGuardando()
    this.bodegasService.newBodegas(this.bodegaL)
      .subscribe(
        res => {
          this.mensajeCorrecto()
        },
        err => {
          Swal.fire({
            title: err.error,
            text: 'Revise e intente nuevamente',
            icon: 'error'
          })
        })
  }

  mensajeConfirmacion(e:any){
    Swal.fire({
      title: 'Advertencia',
      text: "Desea eliminar la bodega "+e.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si'
    }).then((result) => {
      this.deleteBod(e)  
    })
  }

  deleteBod(e:any) {
    this.bodega=e
    this.mensajeGuardando()
    this.bodegasService.deleteBodegas(this.bodega).subscribe(
      res => {
        console.log(); this.mensajeEliminado()
      },
      err => { console.log(err); this.mensajeError() }
    )
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

  mensajeCorrecto() {
    Swal.close()
    Swal.fire({
      title: 'Correcto',
      text: 'Se ha realizado su proceso con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }


  mensajeUpdate() {
    Swal.close()
    Swal.fire({
      title: 'Bodega actualizada',
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
      title: 'Bodega eliminada',
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

}
