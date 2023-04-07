import { Component, OnInit } from '@angular/core';
import { BeneficiarioService } from 'src/app/servicios/beneficiario.service';
import { ComprobantePagoService } from 'src/app/servicios/comprobantePago.service';
import { NotasPagoService } from 'src/app/servicios/notas.service';
import { TransaccionesFinancierasService } from 'src/app/servicios/transaccionesFinancieras.service';
import Swal from 'sweetalert2';
import { Beneficiario } from '../administracion-cuentas/administracion-cuenta';
import { Nota } from '../base-pagos-proveedores/base-pago-proveedores';
import { ComprobantePago } from '../comprobante-pago/comprobante-pago';
import { objDate } from '../transacciones/transacciones';
import { TransaccionesFinancieras } from '../transaccionesFinancieras/transaccionesFinancieras';


@Component({
  selector: 'app-transaccionesNominas',
  templateUrl: './transaccionesNominas.component.html',
  styleUrls: ['./transaccionesNominas.component.scss']
})


export class TransaccionesNominasComponent implements OnInit {
  listaTransacciones: TransaccionesFinancieras [] = []
  beneficiarios: Beneficiario [] = []
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  fechaAnteriorDesde: Date = new Date();
  obj: objDate;
  mostrarLoading: boolean = false;
  valorNominas = 0;
  valorAnticipos = 0;
  valorPagosExtras = 0;
  valorComisiones = 0;
  valorDescuentos = 0;
  valorPagoPrestamos = 0;
  resultado = 0;
  estadoCuenta = ""
  beneficiario = ""
  popupVisibleNotas : boolean = false;
  popupVisibleNotasTabla : boolean = false;
  mostrarListaNotas : boolean = true;
  valorOption = ""
  textoNota = ""
  nombre = ""
  nombreSubCuenta = ""
  mostrarNuevaNotas : boolean = false;
  listadoNotas: Nota [] = []

  opciones: string[] = [
      'Lista Notas',
      'Nueva Nota'
  ];


  nota = {
    fecha:"",
    descripcion:"",
    tipo:""
  }
       

  constructor(public _transaccionFinancieraService : TransaccionesFinancierasService,
    public _notasService : NotasPagoService,
    public _comprobantePagoService : ComprobantePagoService,
    public _beneficiarioService : BeneficiarioService) {}

  ngOnInit() {
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.traerTransaccionesPorRango();
    this.traerBeneficiarios();
  }

  traerBeneficiarios(){
    this._beneficiarioService.getBeneficiarios().subscribe(res => {
      this.beneficiarios = res as Beneficiario[];
   })
  }

  traerListaTransacciones(){
    this.listaTransacciones = [];
    this.mostrarLoading = true;
    this._transaccionFinancieraService.getTransaccionesFinancierasNominas().subscribe(res => {
      this.listaTransacciones = res as TransaccionesFinancieras[];
      this.obtenerDatos();
      this.mostrarLoading = false;
   })
  }

  traerTransaccionesPorRango() {
    this.listaTransacciones = [];
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaActual.setHours(24);
    this._transaccionFinancieraService.getTransaccionesFinancierasNominasPorRango(this.obj).subscribe(
      (res) => {
        this.listaTransacciones = res as TransaccionesFinancieras[];
        this.obtenerDatos();
        this.mostrarLoading = false;
      },
      () => {}
    );
  }


  traerTransaccionesPorRangoYBeneficiario() {
    this.listaTransacciones = [];
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaActual.setHours(24);
    this.obj.sucursal = this.beneficiario;
    this._transaccionFinancieraService.getTransaccionesFinancierasNominasPorRangoYBeneficiario(this.obj).subscribe(
      (res) => {
        this.listaTransacciones = res as TransaccionesFinancieras[];
        this.obtenerDatos();
        this.mostrarLoading = false;
      },
      () => {}
    );
  }


  obtenerDatos(){
    this.valorAnticipos = 0;
    this.valorDescuentos = 0;
    this.valorPagosExtras = 0;
    this.valorComisiones = 0;
    this.valorPagoPrestamos = 0;
    this.valorNominas = 0;
    this.resultado = 0;
    this.listaTransacciones.forEach(element =>{
      if(element.subCuenta == "1.5.2 Nominas"){
        this.valorNominas = element.valor + this.valorNominas;
      }else if(element.subCuenta == "1.5.3 Anticipos nomina"){
        this.valorAnticipos = element.valor + this.valorAnticipos;
      }else if(element.subCuenta == "1.5.7 Descuentos"){
        this.valorDescuentos = element.valor + this.valorDescuentos;
      }else if(element.subCuenta == "1.5.4 Pagos extras"){
        this.valorPagosExtras = element.valor + this.valorPagosExtras;
      }else if(element.subCuenta == "1.5.5 Comisiones x Fletes"){
        this.valorComisiones = element.valor + this.valorComisiones;
      }else if(element.subCuenta == "1.3.3 Pago o Abono Préstamo"){
        this.valorPagoPrestamos = element.valor + this.valorPagoPrestamos;
      }
    })
    this.resultado = this.valorNominas + this.valorAnticipos - this.valorPagoPrestamos - this.valorDescuentos + this.valorPagosExtras + this.valorComisiones;
  }

  onExporting (e) {
    e.component.beginUpdate();
    e.component.columnOption("notas", "visible", true);
    e.component.columnOption("beneficiario", "visible", true);
    e.component.columnOption("proveedor", "visible", true);
    e.component.columnOption("centroCosto", "visible", true);
   
  };
  onExported (e) {
    e.component.columnOption("notas", "visible", false);
    e.component.columnOption("beneficiario", "visible", false);
    e.component.columnOption("proveedor", "visible", false);
    e.component.columnOption("centroCosto", "visible", false);
    e.component.endUpdate();
  }

  mostrarPopupNotas(){
    this.popupVisibleNotas = true;
    this.traerListadoNotas();
  }


  traerListadoNotas(){
    this.mostrarLoading = true,
    this.listadoNotas = [];
    this._notasService.getNotasPorTipo("TNomina").subscribe(res => {
      this.listadoNotas = res as Nota[];
      this.mostrarLoading = false;
   })
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

  deleteNota = (e) => {  
    this.eliminarNota(e.row.data)  
  }

  mostrarNotas = (e) => {
    this.mostrarPopupNotasTabla(e.row.data);
  };

  mostrarPopupNotasTabla(e: any) {
    this.nombre = e.cliente
    this.nombreSubCuenta = e.subCuenta
    this.popupVisibleNotasTabla = true;

    var comprobante = new ComprobantePago();
    comprobante.idDocumento = e.id_documento
    this._comprobantePagoService.getComprobantePorIdConsecutivo(comprobante).subscribe( 
      res => { var notas = res as ComprobantePago[];
              this.textoNota = notas[0].observaciones}, 
      err => {alert("error")})

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
      this.nota.tipo = "TNomina"
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
