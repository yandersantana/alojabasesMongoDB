import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { tipoBusquedaTransaccion } from '../transacciones/transacciones';
import { contadoresDocumentos } from '../ventas/venta';
import { AuthenService } from 'src/app/servicios/authen.service';
import { user } from '../user/user';
import { FacturasProveedorService } from 'src/app/servicios/facturas-proveedor.service';
import { FacturaProveedor } from '../orden-compra/ordencompra';
import { TransaccionChequesGirado } from '../comprobante-pago-proveedores/comprobante-pago-proveedores';
import { TransaccionesChequesService } from 'src/app/servicios/transaccionesCheques.service';

@Component({
  selector: 'app-gestion-pago-cheques',
  templateUrl: './gestion-pago-cheques.component.html',
  styleUrls: ['./gestion-pago-cheques.component.scss']
})
export class GestionPagoChequesComponent implements OnInit {
  pagoCheque: TransaccionChequesGirado
  listadoTransaccionesCheque: TransaccionChequesGirado [] = []
  nuevaFecha : Date = new Date
  fechaMinima = Date.now();
  idPago : number
  numCheque : number
  mostrarSeccionFecha : boolean = true
  mostrarSeccionPagoEstado : boolean = false
  busquedaTransaccion : tipoBusquedaTransaccion
  listaFacturas: FacturaProveedor [] = []
  isReadOnly: boolean = false;
  contadores:contadoresDocumentos[]
  mostrarLoading : boolean = false;
  mensajeLoading = "Cargando"
  textLoading = "";
  opMenu = "";
  tiposMenu: string[] = [
    'Gestionar Fechas Pago',
    'Gestionar Pagos/Cheques'
  ];


  constructor(
    public _transaccionesChequeService: TransaccionesChequesService,
    public _facturaProveedorService: FacturasProveedorService,
    public _authenService:AuthenService,
    ) {
      this.pagoCheque = new TransaccionChequesGirado();
      this.fechaMinima = Date.now();
      this.opMenu = 'Gestionar Fechas Pago';
   }

  ngOnInit() {
    this.cargarUsuarioLogueado();
  }

  opcionRadioTipos(e){
    switch (e.value) {
      case "Gestionar Fechas Pago":
        this.mostrarSeccionFecha = true;
        this.mostrarSeccionPagoEstado = false;
        break;
      case "Gestionar Pagos/Cheques":
        this.mostrarSeccionFecha = false;
        this.mostrarSeccionPagoEstado = true;
        break;
      default:    
    }      
  }


  buscarTransaccionChequePorIdPago(){
    this.mostrarLoading = true;
    this.mensajeLoading = "Buscando Pago..."
    var busquedaTransaccion = new tipoBusquedaTransaccion();
    busquedaTransaccion.NumDocumento = this.idPago.toString();
    this._transaccionesChequeService.getTransaccionesPorIdPago(busquedaTransaccion).subscribe(res => {
      var pago = res as TransaccionChequesGirado[];
      if(pago.length != 0)
        this.pagoCheque = pago[0];
      else
        this.mostrarMensajeGenerico(2,"No se encontraron datos")
      this.mostrarLoading = false;
    })  
  }

  buscarTransaccionChequePorNumCheque(){
    this.mostrarLoading = true;
    this.mensajeLoading = "Buscando Pago..."
    var busquedaTransaccion = new tipoBusquedaTransaccion();
    busquedaTransaccion.NumDocumento = this.numCheque.toString();
    this._transaccionesChequeService.getTransaccionesPorNumCheque(busquedaTransaccion).subscribe(res => {
      var pago = res as TransaccionChequesGirado[];
      if(pago.length != 0)
        this.pagoCheque = pago[0];
      else
        this.mostrarMensajeGenerico(2,"No se encontraron datos")
      
      this.mostrarLoading = false;
    })  
  }


  cargarUsuarioLogueado() {
    new Promise((res, err) => {
      if (localStorage.getItem("maily") != '') 
      var correo = localStorage.getItem("maily");

      this._authenService.getUserLogueado(correo)
        .subscribe(
          res => { var usuario = res as user; }
        )
    });
  }



  guardar(){
    this.mostrarLoading = true;
    this.mensajeLoading = "Actualizando .."
    this.pagoCheque.fechaPago = this.nuevaFecha.toLocaleDateString();
    this._transaccionesChequeService.updateFechaPago(this.pagoCheque).subscribe((res) => {
      this.mostrarLoading = false;
      this.mostrarMensajeGenerico(1,"Fecha de Pago actualizada")
      this.reiniciar();
    },(err) => {});
  }


  reiniciar(){
    this.pagoCheque = new TransaccionChequesGirado();
    this.idPago = 0;
    this.numCheque = 0;
  }

  
  terminarOperacion(){
    this.mostrarLoading = false;
      Swal.fire({
        title:'Correcto',
        text: 'Se ha guardado con éxito',
        icon: 'success',
        confirmButtonText: 'Ok'
      }).then((result) => {
        window.location.reload()
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
