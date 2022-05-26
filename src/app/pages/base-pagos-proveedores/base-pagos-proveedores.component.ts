import { Component, OnInit } from '@angular/core';
import { CuentaBancariaService } from 'src/app/servicios/cuentaBancaria.service';
import { NotasPagoService } from 'src/app/servicios/notas.service';
import { TransaccionesChequesService } from 'src/app/servicios/transaccionesCheques.service';
import Swal from 'sweetalert2';
import { CuentaBancaria } from '../administracion-cuentas/administracion-cuenta';
import { TransaccionChequesGirado } from '../comprobante-pago-proveedores/comprobante-pago-proveedores';
import { FacturaProveedor } from '../orden-compra/ordencompra';
import { objDate } from '../transacciones/transacciones';
import { AgendaPago, ArrayPagos, Nota } from './base-pago-proveedores';

@Component({
  selector: 'app-base-pagos-proveedores',
  templateUrl: './base-pagos-proveedores.component.html',
  styleUrls: ['./base-pagos-proveedores.component.scss']
})

export class BasePagoProveedoresComponent implements OnInit {
  listaFacturas: FacturaProveedor [] = []
  listaFacturasTmp: FacturaProveedor [] = []
  listaPagos: AgendaPago [] = []
  listaArrayPagos: ArrayPagos [] = []
  listaCuentasBancarias: CuentaBancaria [] = []
  listadoTransaccionesCheque: TransaccionChequesGirado [] = []
  listadoNotas: Nota [] = []
  estados: string[] = [
      'Lista Notas',
      'Nueva Nota'
  ];

  nota = {
    fecha:"",
    tipo:"",
    descripcion:""
  }

  popupVisibleNotas = false;
  mostrar2 : boolean = true;
  mostrarListaNotas : boolean = true;
  mostrarNuevaNotas : boolean = false;
  mostrar3 = false;
  mostrar4 = false;
  mostrar5 = false;

  nombreBanco1 = "";
  nombreBanco2 = "";
  nombreBanco3 = "";
  nombreBanco4 = "";
  nombreBanco5 = "";

  cuentaBanco1 = "";
  cuentaBanco2 = "";
  cuentaBanco3 = "";
  cuentaBanco4 = "";
  cuentaBanco5 = "";
 
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  fechaAnteriorDesde: Date = new Date();
  obj: objDate;
  mostrarLoading: boolean = false;
  tiposFactura: string[] = [
    'Diario',
    'Mensual'
  ];

  valorOption = ""

  tipoFactura = ""
  nombreArchivo = "Facturas Pendientes"

  datosPago : AgendaPago[] = [];
  datosPagoTmp : AgendaPago[] = [];

  
  constructor(public _transaccionChequesService: TransaccionesChequesService,
            public _cuentaBancariaService: CuentaBancariaService,
            public _notasService : NotasPagoService ) {}

  ngOnInit() {
    this.tipoFactura = "Diario"
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.traerCuentasBancarias();
    this.valorOption = "Lista Notas"

  }


  limpiarArreglos(){
    this.listaFacturas = [];
    this.listaFacturasTmp = [];

  }

  traerCuentasBancarias(){
    this._cuentaBancariaService.getCuentas().subscribe(res => {
      this.listaCuentasBancarias = res as CuentaBancaria[];
      this.traerTransaccionesChequesPorRango();
   })
  }

  traerListadoNotas(){
    this.mostrarLoading = true,
    this.listadoNotas = [];
    this._notasService.getNotasPorTipo("Agenda").subscribe(res => {
      this.listadoNotas = res as Nota[];
      this.mostrarLoading = false;
   })
  }

  traerTransaccionesChequesPorRango() {
    this.listadoTransaccionesCheque = [];
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._transaccionChequesService.getTransaccionesPorRangoEstadoCubierto(this.obj).subscribe(res => {
      this.listadoTransaccionesCheque = res as TransaccionChequesGirado[];
      this.obtenerDatos();
      this.mostrarLoading = false;
    })
  }

  obtenerDatos(){
    this.datosPago = [];
    this.datosPagoTmp = [];
    var currentDate = this.nowdesde;
    var endDate = this.nowhasta;
    var valor = 0;

    while(currentDate <= endDate) {
      
      var listado = this.listadoTransaccionesCheque.filter(element=>element.fechaPago == currentDate.toLocaleDateString())
      var pago = new AgendaPago();
      var fecha = currentDate;
      pago.fecha = currentDate;
      switch (this.listaCuentasBancarias.length) {
        case 1:
            this.nombreBanco1 = this.listaCuentasBancarias[0].nombre 
            this.cuentaBanco1 = this.listaCuentasBancarias[0].numero
            var listaBanco = listado.filter(element=>element.cuenta == this.listaCuentasBancarias[0].numero)
            listaBanco.forEach(element=>{valor = valor + element.valor})
            pago.banco1Nombre = this.listaCuentasBancarias[0].numero;
            pago.valor1 = valor;
          break;
        case 2:
            this.nombreBanco1 = this.listaCuentasBancarias[0].nombre 
            this.cuentaBanco1 = this.listaCuentasBancarias[0].numero
            valor = 0;
            var listaBanco = listado.filter(element=>element.cuenta == this.listaCuentasBancarias[0].numero)
            listaBanco.forEach(element=>{valor = valor + element.valor})
            pago.banco1Nombre = this.listaCuentasBancarias[0].numero;
            pago.valor1 = valor;
            valor = 0;
            this.nombreBanco2 = this.listaCuentasBancarias[1].nombre 
            this.cuentaBanco2 = this.listaCuentasBancarias[1].numero
            var listaBanco2 = listado.filter(element=>element.cuenta == this.listaCuentasBancarias[1].numero)
            listaBanco2.forEach(element=>{valor = valor + element.valor})
            pago.banco2Nombre = this.listaCuentasBancarias[1].numero;
            pago.valor2 = valor;
            this.mostrar2 = true;
          break;
        case 3:
            this.nombreBanco1 = this.listaCuentasBancarias[0].nombre 
            this.cuentaBanco1 = this.listaCuentasBancarias[0].numero
            valor = 0;
            var listaBanco = listado.filter(element=>element.cuenta == this.listaCuentasBancarias[0].numero)
            listaBanco.forEach(element=>{valor = valor + element.valor})
            pago.banco1Nombre = this.listaCuentasBancarias[0].numero;
            pago.valor1 = valor;
            valor = 0;
            this.nombreBanco2 = this.listaCuentasBancarias[1].nombre 
            this.cuentaBanco2 = this.listaCuentasBancarias[1].numero
            var listaBanco2 = listado.filter(element=>element.cuenta == this.listaCuentasBancarias[1].numero)
            listaBanco2.forEach(element=>{valor = valor + element.valor})
            pago.banco2Nombre = this.listaCuentasBancarias[1].numero;
            pago.valor2 = valor;
            valor = 0;
            this.nombreBanco3 = this.listaCuentasBancarias[2].nombre 
            this.cuentaBanco3 = this.listaCuentasBancarias[2].numero
            var listaBanco3 = listado.filter(element=>element.cuenta == this.listaCuentasBancarias[2].numero)
            listaBanco3.forEach(element=>{valor = valor + element.valor})
            pago.banco3Nombre = this.listaCuentasBancarias[2].numero;
            pago.valor3 = valor;
            this.mostrar2 = true;
            this.mostrar3 = true;
          break;
        case 4:
            this.nombreBanco1 = this.listaCuentasBancarias[0].nombre 
            this.cuentaBanco1 = this.listaCuentasBancarias[0].numero
            valor = 0;
            var listaBanco = listado.filter(element=>element.cuenta == this.listaCuentasBancarias[0].numero)
            listaBanco.forEach(element=>{valor = valor + element.valor})
            pago.banco1Nombre = this.listaCuentasBancarias[0].numero;
            pago.valor1 = valor;
            valor = 0;
            this.nombreBanco2 = this.listaCuentasBancarias[1].nombre 
            this.cuentaBanco2 = this.listaCuentasBancarias[1].numero
            var listaBanco2 = listado.filter(element=>element.cuenta == this.listaCuentasBancarias[1].numero)
            listaBanco2.forEach(element=>{valor = valor + element.valor})
            pago.banco2Nombre = this.listaCuentasBancarias[1].numero;
            pago.valor2 = valor;
            valor = 0;
            this.nombreBanco3 = this.listaCuentasBancarias[2].nombre 
            this.cuentaBanco3 = this.listaCuentasBancarias[2].numero
            var listaBanco3 = listado.filter(element=>element.cuenta == this.listaCuentasBancarias[2].numero)
            listaBanco3.forEach(element=>{valor = valor + element.valor})
            pago.banco3Nombre = this.listaCuentasBancarias[2].numero;
            pago.valor3 = valor;
            valor = 0;
            this.nombreBanco4 = this.listaCuentasBancarias[3].nombre 
            this.cuentaBanco4 = this.listaCuentasBancarias[3].numero
            var listaBanco4 = listado.filter(element=>element.cuenta == this.listaCuentasBancarias[3].numero)
            listaBanco4.forEach(element=>{valor = valor + element.valor})
            pago.banco4Nombre = this.listaCuentasBancarias[3].numero;
            pago.valor4 = valor;
            this.mostrar2 = true;
            this.mostrar3 = true;
            this.mostrar4 = true;
          break;
        case 5:
            this.nombreBanco1 = this.listaCuentasBancarias[0].nombre 
            this.cuentaBanco1 = this.listaCuentasBancarias[0].numero
            valor = 0;
            var listaBanco = listado.filter(element=>element.cuenta == this.listaCuentasBancarias[0].numero)
            listaBanco.forEach(element=>{valor = valor + element.valor})
            pago.banco1Nombre = this.listaCuentasBancarias[0].numero;
            pago.valor1 = valor;
            valor = 0;
            this.nombreBanco2 = this.listaCuentasBancarias[1].nombre 
            this.cuentaBanco2 = this.listaCuentasBancarias[1].numero
            var listaBanco2 = listado.filter(element=>element.cuenta == this.listaCuentasBancarias[1].numero)
            listaBanco2.forEach(element=>{valor = valor + element.valor})
            pago.banco2Nombre = this.listaCuentasBancarias[1].numero;
            pago.valor2 = valor;
            valor = 0;
            this.nombreBanco3 = this.listaCuentasBancarias[2].nombre 
            this.cuentaBanco3 = this.listaCuentasBancarias[2].numero
            var listaBanco3 = listado.filter(element=>element.cuenta == this.listaCuentasBancarias[2].numero)
            listaBanco3.forEach(element=>{valor = valor + element.valor})
            pago.banco3Nombre = this.listaCuentasBancarias[2].numero;
            pago.valor3 = valor;
            valor = 0;
            this.nombreBanco4 = this.listaCuentasBancarias[3].nombre 
            this.cuentaBanco4 = this.listaCuentasBancarias[3].numero
            var listaBanco4 = listado.filter(element=>element.cuenta == this.listaCuentasBancarias[3].numero)
            listaBanco4.forEach(element=>{valor = valor + element.valor})
            pago.banco4Nombre = this.listaCuentasBancarias[3].numero;
            pago.valor4 = valor;
            valor = 0;
            this.nombreBanco5 = this.listaCuentasBancarias[4].nombre 
            this.cuentaBanco5 = this.listaCuentasBancarias[4].numero
            var listaBanco5 = listado.filter(element=>element.cuenta == this.listaCuentasBancarias[4].numero)
            listaBanco5.forEach(element=>{valor = valor + element.valor})
            pago.banco5Nombre = this.listaCuentasBancarias[4].numero;
            pago.valor5 = valor;
            this.mostrar2 = true;
            this.mostrar3 = true;
            this.mostrar4 = true;
            this.mostrar5 = true;
          break;
        default:
          break;
      } 
      this.datosPagoTmp.push(pago);
      currentDate = new Date(currentDate.setDate(currentDate.getDate()+1));
    }

    this.datosPagoTmp.forEach(element=>{
      var nueva = new AgendaPago();
      nueva.fecha =  new Date(element.fecha.setDate(element.fecha.getDate()-1));
      switch (this.listaCuentasBancarias.length) {
        case 1:
            nueva.banco1Nombre = element.banco1Nombre;
            nueva.valor1 = element.valor1;
            nueva.totalColumna = element.valor1;
          break;
        case 2:
            nueva.banco1Nombre = element.banco1Nombre;
            nueva.valor1 = element.valor1;
            nueva.banco2Nombre = element.banco2Nombre;
            nueva.valor2 = element.valor2;
            nueva.totalColumna = element.valor1 + element.valor2;
          break;
        case 3:
            nueva.banco1Nombre = element.banco1Nombre;
            nueva.valor1 = element.valor1;
            nueva.banco2Nombre = element.banco2Nombre;
            nueva.valor2 = element.valor2;
            nueva.banco3Nombre = element.banco3Nombre;
            nueva.valor3 = element.valor3;
            nueva.totalColumna = element.valor1 + element.valor2 + element.valor3;
          break;
        case 4:
            nueva.banco1Nombre = element.banco1Nombre;
            nueva.valor1 = element.valor1;
            nueva.banco2Nombre = element.banco2Nombre;
            nueva.valor2 = element.valor2;
            nueva.banco3Nombre = element.banco3Nombre;
            nueva.valor3 = element.valor3;
            nueva.banco4Nombre = element.banco4Nombre;
            nueva.valor4 = element.valor4;
            nueva.totalColumna = element.valor1 + element.valor2 + element.valor3 + element.valor4;
          break;
        case 5:
            nueva.banco1Nombre = element.banco1Nombre;
            nueva.valor1 = element.valor1;
            nueva.banco2Nombre = element.banco2Nombre;
            nueva.valor2 = element.valor2;
            nueva.banco3Nombre = element.banco3Nombre;
            nueva.valor3 = element.valor3;
            nueva.banco4Nombre = element.banco4Nombre;
            nueva.valor4 = element.valor4;
            nueva.banco5Nombre = element.banco5Nombre;
            nueva.valor5 = element.valor5;
            nueva.totalColumna = element.valor1 + element.valor2 + element.valor3 + element.valor4 + element.valor5;
          break;
        default:
          break;
        
      } 
      this.datosPago.push(nueva);
         
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

  mostrarPopupNotas(){
    this.popupVisibleNotas = true;
    this.traerListadoNotas();
  }

  guardarNuevaNota(){
    if(this.nota.descripcion != null && this.nota.fecha != null){
      this.popupVisibleNotas = false;
      this.mostrarLoading = true;
      this.nota.tipo = "Agenda"
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


  opcionRadio(e){
    this.listaFacturas = [];
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

}
