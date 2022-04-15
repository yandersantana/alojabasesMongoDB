import { Component, OnInit } from '@angular/core';
import { FacturasProveedorService } from 'src/app/servicios/facturas-proveedor.service';
import { FacturaProveedor } from '../orden-compra/ordencompra';
import { objDate } from '../transacciones/transacciones';

@Component({
  selector: 'app-registro-facturas',
  templateUrl: './registro-facturas.component.html',
  styleUrls: ['./registro-facturas.component.scss']
})

export class RegistroFacturasComponent implements OnInit {
  listaFacturas: FacturaProveedor [] = []
  listaFacturasTmp: FacturaProveedor [] = []
  listaFacturasPendientes: FacturaProveedor [] = []
  listaFacturasParciales: FacturaProveedor [] = []
  listaFacturasCubiertas: FacturaProveedor [] = []
  listaFacturasPagadas: FacturaProveedor [] = []
 
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  fechaAnteriorDesde: Date = new Date();
  obj: objDate;
  mostrarLoading: boolean = false;
  tiposFactura: string[] = [
    'Pendiente',
    'Parcial',
    'Cubierto',
    'Pagado'
  ];

  tipoFactura = ""
  nombreArchivo = "Facturas Pendientes"

  
  constructor(public _facturasProveedorService: FacturasProveedorService ) {}

  ngOnInit() {
    this.tipoFactura = "Pendiente"
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.traerFacturasPorRango();
  }

  traerlistaFacturas(){
    this.limpiarArreglos();
    this.mostrarLoading = true;
    this._facturasProveedorService.getFacturasProveedor().subscribe(res => {
      this.listaFacturasTmp = res as FacturaProveedor[];
      this.separarCuentas(1)
      this.mostrarLoading = false;
   })
  }


  limpiarArreglos(){
    this.listaFacturas = [];
    this.listaFacturasTmp = [];
    this.listaFacturasCubiertas = [];
    this.listaFacturasPagadas = [];
    this.listaFacturasParciales = [];
    this.listaFacturasPendientes = [];
  }

  traerFacturasPorRango() {
    this.limpiarArreglos();
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._facturasProveedorService.getFacturasPorRango(this.obj).subscribe(
      (res) => {
        this.listaFacturasTmp = res as FacturaProveedor[];
        this.separarCuentas(1)
        this.mostrarLoading = false;
      },
      () => {}
    );
  }

  opcionRadioTipos(e){
    this.listaFacturas = [];
    switch (e.value) {
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
    }      
  }

  separarCuentas(numero){
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
  }

}
