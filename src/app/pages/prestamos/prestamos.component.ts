import { Component, OnInit } from '@angular/core';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { PrestamosService } from 'src/app/servicios/prestamos.service';
import { ReciboCajaService } from 'src/app/servicios/reciboCaja.service';
import { SubCuentasService } from 'src/app/servicios/subCuentas.service';
import { TransaccionesFinancierasService } from 'src/app/servicios/transaccionesFinancieras.service';
import Swal from 'sweetalert2';
import { objDate, tipoBusquedaTransaccion } from '../transacciones/transacciones';
import { TransaccionesFinancieras } from '../transaccionesFinancieras/transaccionesFinancieras';
import { Prestamos } from './prestamos';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.scss']
})

export class PrestamosComponent implements OnInit {
  listaPrestamosTmp: Prestamos [] = []
  listaPrestamos: Prestamos [] = []
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  fechaAnteriorDesde: Date = new Date();
  obj: objDate;
  mostrarDelete = true;
  mensajeLoading = "Cargando..";
  mostrarLoading: boolean = false;
  tiposRecibo: string[] = [
    'Activos',
    'Cancelados',
    'Anulados'
  ];

  tipoRecibo = ""

  constructor(
    public _prestamosService : PrestamosService,
    public _subCuentasService : SubCuentasService,
    public _transaccionFinancieraService : TransaccionesFinancierasService,
    public _reciboCajaService : ReciboCajaService,
    public _contadoresService: ContadoresDocumentosService,
    ) {
   }

  ngOnInit() {
    this.tipoRecibo = "Activos"
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.traerCuentasPorRango();
  }

  traerlistaPrestamos(){
    this.listaPrestamosTmp = [];
    this.mostrarLoading = true;
    this._prestamosService.getPrestamos().subscribe(res => {
      this.listaPrestamosTmp = res as Prestamos[];
      this.separarCuentas(1)
      this.mostrarLoading = false;
   })
  }

  traerCuentasPorRango() {
    this.listaPrestamosTmp = [];
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._prestamosService.getPrestamosPorRango(this.obj).subscribe(
      (res) => {
        this.listaPrestamosTmp = res as Prestamos[];
        this.separarCuentas(1)
        this.mostrarLoading = false;
      },
      () => {}
    );
  }

  opcionRadioTipos(e){
    this.tipoRecibo = e.value;
    switch (e.value) {
      case "Activos":
        this.separarCuentas(1)
        this.mostrarDelete = true;
        break;
      case "Cancelados":
        this.separarCuentas(2)
        this.mostrarDelete = false;
        break;
      case "Anulados":
        this.separarCuentas(3)
        this.mostrarDelete = false;
        break;
      default:    
    }      
  }

  separarCuentas(numero){
    this.listaPrestamos = []
    if(numero == 1){
      this.listaPrestamosTmp.forEach(element=>{
      if(element.estado == "Activa")
        this.listaPrestamos.push(element)
      })
    }else if(numero == 2){
      this.listaPrestamosTmp.forEach(element=>{
      if(element.estado == "Cancelado")
        this.listaPrestamos.push(element)
      })
    }else if(numero == 3){
      this.listaPrestamosTmp.forEach(element=>{
      if(element.estado == "Anulado")
        this.listaPrestamos.push(element)
      })
    }
  }


  deletePrestamo = (e) => {  
    this.anularPrestamo(e.row.data)  
  }


  anularPrestamo(e:any){ 
    Swal.fire({
      title: 'Anular Préstamo',
      text: "Desea anular el préstamo perteneciente a "+e.beneficiario+ " por un valor de "+e.valor,
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.mensajeLoading = "Procesando.."
        this.mostrarLoading = true;
        this.actualizarEstadoTransacciones(e);
      }
        
      else if (result.dismiss === Swal.DismissReason.cancel) 
        this.mostrarMensajeGenerico(2,"Se ha cancelado su proceso");
      
    })
  }

  async actualizarEstadoTransacciones(e:any){
    var busquedaTransaccion = new tipoBusquedaTransaccion()
    busquedaTransaccion.NumDocumento = e.comprobanteId;
    this._transaccionFinancieraService.obtenerTransaccionesPrestamosPorComprobante(busquedaTransaccion).subscribe(
      async (res) => {
        var transacciones = res as TransaccionesFinancieras[];
        if(transacciones.length == 0){
          this.mostrarLoading = false;
          this.mostrarMensajeGenerico(2,"No existen transacciones para el registro que se desea anular")
        }else
          await this.actualizarTransacciones(transacciones);},
      (err) => {});

    setTimeout(() => {
      this._prestamosService.updateEstadoPrestamo( e ,"Anulado").subscribe( res => {
        this.mostrarLoading = false;
        this.mostrarMensajeGenerico(1,"Se anuló correctamente su préstamo")
        this.traerCuentasPorRango();
      }, err => {alert("error")})
    }, 1500);

     
  }

  async actualizarTransacciones(transacciones : TransaccionesFinancieras[]){
    transacciones.forEach(element=>{
      if((element.subCuenta == "2.1.0 Internos" || element.subCuenta == "2.2.1 Externos" || element.subCuenta == "2.2.4 Saldos"))
       this._transaccionFinancieraService.updateEstado(element,false).subscribe((res) => {},(err) => {});   
    });
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
