import { Component, OnInit } from '@angular/core';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { CuentasPorCobrarService } from 'src/app/servicios/cuentasPorCobrar.service';
import { NotasPagoService } from 'src/app/servicios/notas.service';
import { ReciboCajaService } from 'src/app/servicios/reciboCaja.service';
import { SubCuentasService } from 'src/app/servicios/subCuentas.service';
import { TransaccionesFinancierasService } from 'src/app/servicios/transaccionesFinancieras.service';
import Swal from 'sweetalert2';
import { Nota } from '../base-pagos-proveedores/base-pago-proveedores';
import { objDate } from '../transacciones/transacciones';
import { CuentaPorCobrar } from './cuentasPorCobrar';

@Component({
  selector: 'app-cuentasPorCobrar',
  templateUrl: './cuentasPorCobrar.component.html',
  styleUrls: ['./cuentasPorCobrar.component.scss']
})

export class CuentaPorCobrarComponent implements OnInit {
  listaCuentas: CuentaPorCobrar [] = []
  listaCuentasActivas: CuentaPorCobrar [] = []
  listaCuentasPendientes: CuentaPorCobrar [] = []
  listaCuentasAnualadas: CuentaPorCobrar [] = []
  listaCuentasCanceladas: CuentaPorCobrar [] = []
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  fechaAnteriorDesde: Date = new Date();
  obj: objDate;
  mostrarLoading: boolean = false;
  estados: string[] = [
      'Activos',
      'Pendientes',
      'Anulados',
      'Pagadas'
  ];
  mostrarDelete = true;
  mostrarAprobacion = false;
  mensajeLoading = "Cargando.."
  estado = "Activos"
  popupVisibleNotas = false;
  popupVisibleEditarNotas = false;
  listadoNotas: Nota [] = []
  mostrarListaNotas : boolean = true;
  mostrarNuevaNotas : boolean = false;
  opciones: string[] = [
      'Lista Notas',
      'Nueva Nota'
  ];
  valorOption = ""

  CuentaActualizar : CuentaPorCobrar;

  nota = {
    fecha:"",
    descripcion:"",
    tipo:""
  }
        



  constructor(
    public _cuentasporCobrarService : CuentasPorCobrarService,
    public _subCuentasService : SubCuentasService,
    public _transaccionFinancieraService : TransaccionesFinancierasService,
    public _reciboCajaService : ReciboCajaService,
    public _contadoresService: ContadoresDocumentosService,
    public _notasService: NotasPagoService
    ) {
      this.valorOption = "Lista Notas";
   }

  ngOnInit() {
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.traerCuentasPorRango();
  }

  traerListaCuentas(){
    this.estado = "Activos"
    this.listaCuentas = [];
    this.listaCuentasActivas = [];
    this.listaCuentasPendientes = [];
    this.listaCuentasAnualadas = [];
    this.mostrarLoading = true;
    this._cuentasporCobrarService.getCuentasPorCobrar().subscribe(res => {
      this.listaCuentas = res as CuentaPorCobrar[];
      this.separarCuentas();
   })
  }

  separarCuentas(){
    this.listaCuentas.forEach(element=> {
      if(element.estado == "Activa")
        this.listaCuentasActivas.push(element);
      else if(element.estado == "Pendiente")
        this.listaCuentasPendientes.push(element);
      else if(element.estado == "Anulado")
        this.listaCuentasAnualadas.push(element);
      else if(element.estado == "Cancelada")
        this.listaCuentasCanceladas.push(element);
    })
    this.listaCuentas = this.listaCuentasActivas;
    this.estado = "Activos"
    this.mostrarLoading = false;
  }

  opcionRadio2(e){
    switch (e.value) {
      case "Lista Notas":
        this.mostrarListaNotas = true;
        this.mostrarNuevaNotas = false;
        this.traerListadoNotas();
        break;
      case "Nueva Nota":
        this.mostrarListaNotas = false;
        this.mostrarNuevaNotas = true;
        break;
      default:    
    }       
  }


  mostrarPopupNotas(){
    this.popupVisibleNotas = true;
    this.traerListadoNotas();
  }

  mostrarPopupEditNotas = (e) => { 
    this.popupVisibleEditarNotas = true;
    this.nota.descripcion = e.row.data.notas;
    this.CuentaActualizar = e.row.data
    console.log(e.row.data.notas)
    
  }

  traerListadoNotas(){
    this.mostrarLoading = true,
    this.listadoNotas = [];
    this._notasService.getNotasPorTipo("CuentaPorCobrar").subscribe(res => {
      this.listadoNotas = res as Nota[];
      this.mostrarLoading = false;
   })
  }

  deleteNota = (e) => {  
    this.eliminarNota(e.row.data)  
  }

  eliminarNota(e:any){ 
    this._notasService.deleteNotas(e).subscribe( res => {
      this.popupVisibleNotas = false;
      Swal.fire({
        title: 'Correcto',
        text: 'Se eliminó la nota con éxito',
        icon: 'success',
        confirmButtonText: 'Ok'
      }).then((result) => { })
    }, err => {alert("error")})
  }


  guardarNuevaNota(){
    if(this.nota.descripcion != null){
      this.popupVisibleNotas = false;
      this.mostrarLoading = true;
      this.nota.tipo = "CuentaPorCobrar"
      this._notasService.newNota(this.nota).subscribe(res => {
        this.mostrarLoading = false;
        this.mostrarMensajeGenerico(1,"Se registró su nota con éxito");
        this.nota.descripcion = ""
        this.valorOption = "Lista Notas"
        this.mostrarListaNotas = true;
        this.mostrarNuevaNotas = false;
        this.traerListadoNotas();
      })
    }else{
      this.mostrarMensajeGenerico(2,"Hay campos vacios");
    }
    
  }

  actualizarComentario(){
    this.mensajeLoading = "Actualizando..."
    this.mostrarLoading = true;
    this.CuentaActualizar.notas = this.nota.descripcion;
    this._cuentasporCobrarService.updateNotas(this.CuentaActualizar).subscribe(res => {
        this.mostrarMensajeGenerico(1,"Se realizo la actualización con éxito")
        this.ngOnInit();
        this.mostrarLoading = false;
        this.popupVisibleEditarNotas = false;
        this.nota.descripcion = ""
    })  
  
  }

  traerCuentasPorRango() {
    this.estado = "Activos"
    this.listaCuentas = [];
    this.listaCuentasActivas = [];
    this.listaCuentasPendientes = [];
    this.listaCuentasAnualadas = [];
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._cuentasporCobrarService.getCuentasPorCobrarPorRango(this.obj).subscribe(
      (res) => {
        this.listaCuentas = res as CuentaPorCobrar[];
        this.separarCuentas();
      },
      () => {}
    );
  }

  opcionRadio(e){
    this.listaCuentas = [];
      switch (e.value) {
        case "Activos":
          this.listaCuentas = this.listaCuentasActivas;
          this.mostrarDelete = true;
          this.mostrarAprobacion = false;
          break;
        case "Pendientes":
          this.listaCuentas = this.listaCuentasPendientes;
          this.mostrarDelete= false;
          this.mostrarAprobacion = true;
          break;
        case "Anulados":
          this.listaCuentas = this.listaCuentasAnualadas;
          this.mostrarDelete= false;
          this.mostrarAprobacion = false;
          break;
        case "Pagadas":
          this.listaCuentas = this.listaCuentasCanceladas;
          this.mostrarDelete= false;
          this.mostrarAprobacion = false;
          break;
        default:    
    }    
  }



  deleteCuenta = (e) => {  
    this.anularCuenta(e.row.data)  
  }

  aprobarEliminacion = (e) => {  
    this.eliminarComp(e.row.data)  
  }

  rechazarEliminacion = (e) => { 
    this.rechazarEliminacionComp(e.row.data)  
  }

  eliminarComp(e){
    Swal.fire({
      title: 'Eliminar Cuenta por Cobrar',
      text: "Eliminar Cuenta por el valor de " + e.valor,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.mostrarLoading = true;
        this._cuentasporCobrarService.updateEstadoCuenta(e,"Anulado").subscribe(
          res => { 
            this.mostrarLoading = false; 
            this.mostrarMensajeGenerico(1,"Su proceso se realizó correctamente")
            this.traerCuentasPorRango();},
          err => { 
            this.mostrarLoading = false; 
            this.mostrarMensajeGenerico(2,"Error al actualizar estado")})
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.mostrarMensajeGenerico(2,"Se ha cancelado su proceso")
      }
    })
  }

  rechazarEliminacionComp(e){
    Swal.fire({
      title: 'Rechazar Eliminacion Cuenta',
      text: "Está seguro que desea reversar la anulación ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.mostrarLoading = true;
        this._cuentasporCobrarService.updateEstadoCuenta(e,"Activa").subscribe(
          res => { 
            this.mostrarLoading = false; 
            this.mostrarMensajeGenerico(1,"Se realizo su proceso correctamente");
            this.traerCuentasPorRango();},
          err => { 
            this.mostrarLoading = false; 
            this.mostrarMensajeGenerico(2,"Error al actualizar estado")})
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.mostrarMensajeGenerico(2,"Se ha cancelado su proceso")
      }
    })
  }


  anularCuenta(e:any){ 
    Swal.fire({
      title: 'Anular Cuenta',
      text: "Desea anular la cuenta por cobrar por el valor de "+e.valor,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this._cuentasporCobrarService.updateEstadoCuenta( e ,"Pendiente").subscribe( res => {
          Swal.fire({
            title: 'Correcto',
            text: 'Un administrador aprobará su anulación',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            this.traerCuentasPorRango();
          })
        }, err => {alert("error")})
      }else if (result.dismiss === Swal.DismissReason.cancel) {
        this.mostrarMensajeGenerico(2,"Se ha cancelado su proceso");
      }
    })
  }



  mostrarMensajeGenerico(tipo:number , texto:string){
    if(tipo == 1){
      Swal.fire({
        title: "Correcto",
        text: texto,
        icon: 'success'
      })
    }else{
      Swal.fire({
        title: "Error",
        text: texto,
        icon: 'error'
      })
    }
       
  }


}
