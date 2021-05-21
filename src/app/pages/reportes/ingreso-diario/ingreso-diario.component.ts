import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { IngresosService } from "src/app/servicios/ingreso-diario";
import { ProductoService } from "src/app/servicios/producto.service";
import Swal from "sweetalert2";
import { producto } from "../../ventas/venta";
import { ingresoDiario } from "./ingreso-diario";

@Component({
  selector: "app-ingreso-diario",
  templateUrl: "./ingreso-diario.component.html",
  styleUrls: ["./ingreso-diario.component.scss"],
})
export class IngresoDiarioComponent implements OnInit {
  mostrarLoading: boolean = false;
  ingresosDiarios: ingresoDiario[] = [];
  productosActivos: producto[] = [];
  ingresoDiarioIndividual: ingresoDiario;
  nowdesde: Date = new Date();
  nombreSucursal: string = ""
  valorIngreso: number =0
  viewTabla: boolean = true 
  viewForm: boolean = false 
  registro: boolean = true 
  actualizar: boolean = false 

  sucursales: string[] = [
    "matriz",
    "sucursal1",
  ];

  

  constructor(
    public ingresosService :IngresosService,
    public productoService : ProductoService
  ) { }

  ngOnInit() {
    this.traerRegistrosIngresos()
    this.traerProductos()
  }


  traerRegistrosIngresos(){
    this.ingresosService.getIngresosClientes().subscribe(res => {
      this.ingresosDiarios = res as ingresoDiario[];
   })
  }

  traerProductos(){
    this.productoService.getProducto().subscribe(res => {
      this.productosActivos = res as producto[];
      this.mostrarProductos()
   })
  }

  mostrarProductos(){
    this.productosActivos.forEach((element) => {
        if (element.precio == 0) {
          console.log(element.PRODUCTO)
        }
      });
  }
  

  mostrarUpdate = (e) => {  
    this.mostrarPopup(e.row.data)
    
  }

  mostrarPopup(e:any){
    this.actualizar = true
    this.registro = false
    this.ingresoDiarioIndividual = e
    console.log(this.ingresoDiarioIndividual)
    this.nowdesde = this.ingresoDiarioIndividual.fecha
    this.nombreSucursal = this.ingresoDiarioIndividual.sucursal
    this.valorIngreso = this.ingresoDiarioIndividual.valor
    this.mostrar(2)
   
  }

  setTipo(e){
    //this.usuario.status =e.value
  }

  deleteIngreso = (e) => {  
    this.mensajeConfirmacion(e.row.data) 
  }






  mensajeConfirmacion(e:any){
    Swal.fire({
      title: 'Advertencia',
      text: "Desea eliminar el registro",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.value) {
        this.deleteIngresoDiario(e)
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  deleteIngresoDiario(e:any) {
   this.ingresosService.deleteIngresos(e).subscribe(res => {
      this.mensajeEliminado()},
      err => {
        Swal.fire({
          title: "Error",
          text: 'Revise e intente nuevamente',
          icon: 'error'
        })
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


  mensajeUpdate() {
    Swal.close()
    Swal.fire({
      title: 'Registro actualizado',
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
      title: 'Registro eliminado',
      text: 'Se ha eliminado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }



  mostrar(i: number) {
    if(i == 1){
      this.viewTabla = true;
      this.viewForm = false;
    }else if(i == 2){
      this.viewTabla = false;
      this.viewForm = true;
    }
  }
  


  register(f: NgForm) {

    if(!this.ingresoDiarioIndividual){
      this.nuevoRegistro()
    }else{
      this.updateIngreso()
    }
    
    
  } 

  nuevoRegistro(){
  this.ingresoDiarioIndividual = new ingresoDiario()
      this.ingresoDiarioIndividual.fecha = this.nowdesde;
      this.ingresoDiarioIndividual.sucursal = this.nombreSucursal;
      this.ingresoDiarioIndividual.valor = this.valorIngreso;
      console.log(this.ingresoDiarioIndividual)

      if(this.ingresoDiarioIndividual.sucursal != null && this.ingresoDiarioIndividual.valor != 0){
          this.ingresosService.newIngresoDiario(this.ingresoDiarioIndividual).subscribe(res => {
              this.mensajeCorrecto()},
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
          text: 'Hay campos incorrectos',
          icon: 'error'
        })
      }
  }

  updateIngreso() {
    if(this.ingresoDiarioIndividual._id){
       this.ingresoDiarioIndividual.fecha = this.nowdesde;
      this.ingresoDiarioIndividual.sucursal = this.nombreSucursal;
      this.ingresoDiarioIndividual.valor = this.valorIngreso;
      this.ingresosService.updateIngreso(this.ingresoDiarioIndividual).subscribe(res => {
            this.mensajeUpdate()},
            err => {
              Swal.fire({
                title: "Error",
                text: 'Revise e intente nuevamente',
                icon: 'error'
              })
            })
    }
   
  }

 

  mensajeCorrecto() {
    Swal.close()
    Swal.fire({
      title: 'Registro exitoso',
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

}

