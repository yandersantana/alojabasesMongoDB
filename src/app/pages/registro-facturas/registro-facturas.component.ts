import { Component, OnInit } from '@angular/core';
import { FacturasProveedorService } from 'src/app/servicios/facturas-proveedor.service';
import { OrdenesCompraService } from 'src/app/servicios/ordenes-compra.service';
import { TransaccionesChequesService } from 'src/app/servicios/transaccionesCheques.service';
import { TransaccionesFacturasService } from 'src/app/servicios/transaccionesFacturas.service';
import Swal from 'sweetalert2';
import { OrdenDeCompra } from '../compras/compra';
import { TransaccionChequesGirado, TransaccionesFacturas } from '../comprobante-pago-proveedores/comprobante-pago-proveedores';
import { FacturaProveedor } from '../orden-compra/ordencompra';
import { objDate, tipoBusquedaTransaccion } from '../transacciones/transacciones';

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
  listaFacturasCubiertasParciales: FacturaProveedor [] = []
  listaFacturasPagadas: FacturaProveedor [] = []
  listadoTransaccionesFacturas: TransaccionesFacturas [] = []
  listadoTransaccionesCheques: TransaccionChequesGirado [] = []
 
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  fechaAnteriorDesde: Date = new Date();
  obj: objDate;
  busquedaTransaccion : tipoBusquedaTransaccion
  popupVisible = false;
  popupVisibleDescuentos = false;
  valorTotalACancelar = 0;
  valorDescuento = 0;
  comentario = "";
  mcaDescuento = false;
  popupVisibleEstado = false;
  mostrarLoading: boolean = false;
  numeroFactura = "";
  estadoOrden = " ";
  numOrden = "";
  datosFactura : FacturaProveedor = new FacturaProveedor();
  tiposFactura: string[] = [
    'General',
    'Pendiente',
    'Parcial',
    'Cubierta',
    'Cubierta Parcial',
    'Pagada'
  ];

  tipoFactura = ""
  nombreArchivo = "Facturas Pendientes"

  
  constructor(public _facturasProveedorService: FacturasProveedorService,
    public _transaccionFacturaService : TransaccionesFacturasService,
    public _ordenCompraService : OrdenesCompraService,
    public _facturaProveedorService : FacturasProveedorService,
    public _transaccionesChequesService : TransaccionesChequesService ) {}

  ngOnInit() {
    this.tipoFactura = "General"
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.traerFacturasPorRango();
  }

  traerlistaFacturas(){
    this.limpiarArreglos();
    this.mostrarLoading = true;
    this._facturasProveedorService.getFacturasProveedor().subscribe(res => {
      this.listaFacturasTmp = res as FacturaProveedor[];
      console.log("Hay",this.listaFacturasTmp.length)
      this.separarCuentas(1)
      this.mostrarLoading = false;
   })
  }

  actualizarEstados(){
    this.listaFacturasTmp.forEach(element=>{
      this._facturaProveedorService.updateEstadoMasivo(element,"PAGADA").subscribe( res => {
        console.log("correcto")
      },err => {console.log("error")})
    })
    
  }

  calcularTotal(){
    this.valorTotalACancelar = this.datosFactura.total - this.valorDescuento
  }

  aplicarDescuento(){
    if(this.valorDescuento != 0){
      this.datosFactura.valorDescuento = this.valorDescuento;
      this.datosFactura.total = this.valorTotalACancelar;
      this.datosFactura.observaciones = this.comentario
      this._facturaProveedorService.updateValoresDescuentos(this.datosFactura).subscribe( res => {
        this.popupVisibleDescuentos = false;
        Swal.fire({
            title: "Correcto",
            text: "Se realizo su proceso con éxito",
            icon: 'success'
          })
        console.log("correcto")
      },err => {console.log("error")})
    }else{
       alert("No hay un valor de descuento aplicado")
    }

  }


  eliminarDescuento(){
    this.popupVisibleDescuentos = false;
    Swal.fire({
      title: 'Anular Descuento',
      text: "Estimado usuario esta seguro que desea eliminar el descuento aplicado?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if(result.value) {
        this.datosFactura.total = this.datosFactura.total + this.datosFactura.valorDescuento;
        this.datosFactura.valorDescuento = 0;
        this.datosFactura.observaciones = "";
        this._facturaProveedorService.updateValoresDescuentos(this.datosFactura).subscribe( res => {
          Swal.fire({
            title: "Correcto",
            text: "Se realizo su proceso con éxito",
            icon: 'success'
          })
        },err => {console.log("error")})
      }
    })
  }


  limpiarArreglos(){
    this.listaFacturas = [];
    this.listaFacturasTmp = [];
    this.listaFacturasCubiertas = [];
    this.listaFacturasCubiertasParciales = [];
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


  mostrarTransaciones = (e) => {
    this.obtenerTransaccionesFacturas(e.row.data);
  }

  mostrarEstado = (e) => {
    this.obtenerEstadoOrden(e.row.data);
  }

  obtenerEstadoOrden(e:any){
    this.numeroFactura = e.nFactura;
    this.popupVisibleEstado = true;
    this.mostrarLoading = true;
    var newOrden = new OrdenDeCompra()
    newOrden.n_orden = e.nSolicitud;
    this._ordenCompraService.getOrdenEspecifica(newOrden).subscribe(res => {
      var orden = res as OrdenDeCompra[];
      this.mostrarLoading = false;
      if(orden.length != 0)
        this.estadoOrden= orden[0].estadoOrden;
        this.numOrden = orden[0].n_orden.toString();
    }) 
  }

  obtenerTransaccionesFacturas(e:any){
    this.numeroFactura = e.nFactura;
    this.popupVisible = true;
    this.busquedaTransaccion = new tipoBusquedaTransaccion()
    this.busquedaTransaccion.NumDocumento = e.nFactura;
    this._transaccionFacturaService.obtenerTransaccionesPorFactura(this.busquedaTransaccion).subscribe(res => {
      this.listadoTransaccionesFacturas = res as TransaccionesFacturas[];
    }) 
  }

  mostrarSeccionDescuento= (e) =>{
    this.mostrarDescuentos(e.row.data);
  }

  mostrarDescuentos(e:any){
    this.numeroFactura = e.nFactura;
    this.datosFactura = e;
    this.popupVisibleDescuentos = true;
  }

  opcionRadioTipos(e){
    this.listaFacturas = [];
    switch (e.value) {
      case "General":
        this.nombreArchivo = "Facturas Generales";
        this.listaFacturas = this.listaFacturasTmp;
        break;
      case "Pendiente":
        this.nombreArchivo = "Facturas Pendientes";
        this.listaFacturas = this.listaFacturasPendientes;
        break;
      case "Parcial":
        this.nombreArchivo = "Facturas Parciales";
        this.listaFacturas = this.listaFacturasParciales;
        break;
      case "Cubierta":
        this.nombreArchivo = "Facturas Cubiertas";
        this.listaFacturas = this.listaFacturasCubiertas;
        break;
      case "Cubierta Parcial":
        this.nombreArchivo = "Facturas Cubiertas Parciales";
        this.listaFacturas = this.listaFacturasCubiertasParciales;
        break;
      case "Pagada":
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
      else if(element.estado == "CUBIERTA PARCIAL")
        this.listaFacturasCubiertasParciales.push(element)
      else if(element.estado == "PAGADA" || element.estado == "Pagada")
        this.listaFacturasPagadas.push(element)
    })

   this.listaFacturas = this.listaFacturasTmp;    
  }

}
