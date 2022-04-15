import { Component, OnInit } from '@angular/core';
import { TransaccionesChequesService } from 'src/app/servicios/transaccionesCheques.service';
import { TransaccionChequesGirado } from '../comprobante-pago-proveedores/comprobante-pago-proveedores';
import { FacturaProveedor } from '../orden-compra/ordencompra';
import { objDate } from '../transacciones/transacciones';
import { AgendaPago } from './base-pago-proveedores';

@Component({
  selector: 'app-base-pagos-proveedores',
  templateUrl: './base-pagos-proveedores.component.html',
  styleUrls: ['./base-pagos-proveedores.component.scss']
})

export class BasePagoProveedoresComponent implements OnInit {
  listaFacturas: FacturaProveedor [] = []
  listaFacturasTmp: FacturaProveedor [] = []
  listadoTransaccionesCheque: TransaccionChequesGirado [] = []
  mostrar2 : boolean = true;
  mostrar3 = false;
  mostrar4 = false;
  mostrar5 = false;
 
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  fechaAnteriorDesde: Date = new Date();
  obj: objDate;
  mostrarLoading: boolean = false;
  tiposFactura: string[] = [
    'Diario',
    'Mensual'
  ];

  tipoFactura = ""
  nombreArchivo = "Facturas Pendientes"

  datosPago : AgendaPago[] = [
    {fecha : new Date(),banco1Nombre :"Guayaquil",valor1 : 100},
    {fecha : new Date(),banco1Nombre :"Guayaquil",valor1 : 200},
    {fecha : new Date(),banco1Nombre :"Guayaquil",valor1 : 500}
  ];

  
  constructor(public _transaccionChequesService: TransaccionesChequesService ) {}

  ngOnInit() {
    this.tipoFactura = "Pendiente"
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.traerTransaccionesChequesPorRango();
  }


  limpiarArreglos(){
    this.listaFacturas = [];
    this.listaFacturasTmp = [];

  }

  traerTransaccionesChequesPorRango() {
    this.listadoTransaccionesCheque = [];
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._transaccionChequesService.getTransaccionesPorRango(this.obj).subscribe(res => {
      this.listadoTransaccionesCheque = res as TransaccionChequesGirado[];
      this.obtenerDatos();
      this.mostrarLoading = false;
    })
  }

  obtenerDatos(){

  }


  opcionRadioTipos(e){
    this.listaFacturas = [];
    /* switch (e.value) {
      case "Pendiente":
        this.nombreArchivo = "Facturas Pendientes";
        this.listaFacturas = this.listaFacturasPendientes;
        break;
      case "Parcial":
        this.nombreArchivo = "Facturas Parciales";
        this.listaFacturas = this.listaFacturasParciales;
        break;
      case "Cubierto":
        this.nombreArchivo = "Facturas Cubiertas";
        this.listaFacturas = this.listaFacturasCubiertas;
        break;
      case "Pagado":
        this.nombreArchivo = "Facturas Pagadas";
        this.listaFacturas = this.listaFacturasPagadas;
        break;
      default:    
    }       */
  }

 /*  separarCuentas(numero){
    this.listaFacturasTmp.forEach(element=>{
      if(element.estado == "PENDIENTE" || element.estado == "Pendiente")
        this.listaFacturasPendientes.push(element)
      else if(element.estado == "PARCIAL")
        this.listaFacturasParciales.push(element)
      else if(element.estado == "CUBIERTA")
        this.listaFacturasCubiertas.push(element)
      else if(element.estado == "Pagada")
        this.listaFacturasPagadas.push(element)
    })

   this.listaFacturas = this.listaFacturasPendientes;    
  } */

}
