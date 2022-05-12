import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { tipoBusquedaTransaccion } from '../transacciones/transacciones';
import { contadoresDocumentos } from '../ventas/venta';
import { AuthenService } from 'src/app/servicios/authen.service';
import { user } from '../user/user';
import { FacturasProveedorService } from 'src/app/servicios/facturas-proveedor.service';
import { TransaccionChequesGirado, TransaccionesFacturas } from '../comprobante-pago-proveedores/comprobante-pago-proveedores';
import { TransaccionesChequesService } from 'src/app/servicios/transaccionesCheques.service';
import { TransaccionesFacturasService } from 'src/app/servicios/transaccionesFacturas.service';
import { FacturaProveedor } from '../orden-compra/ordencompra';

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
  mostrarFacturas  : boolean = false
  busquedaTransaccion : tipoBusquedaTransaccion
  listaFacturas: TransaccionesFacturas [] = []
  listaChequesEncontrados: TransaccionChequesGirado [] = []
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
  estadoFacturas =""

  constructor(
    public _transaccionesChequeService: TransaccionesChequesService,
    public _transaccionesFacturasService: TransaccionesFacturasService,
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
      if(pago.length != 0){
        this.pagoCheque = pago[0];
        this.buscarChequesRelacionados();
        if(this.pagoCheque.estado == "Pagado"){
          this.mostrarMensajeGenerico(2,"El cheque ya se encuentra cancelado")
          this.mostrarLoading = false;
          this.reiniciarPagoCheque()
          return;
        }

      }else
        this.mostrarMensajeGenerico(2,"No se encontraron datos")

      if(this.opMenu == "Gestionar Pagos/Cheques")
        this.buscarFacturasPorComprobante()
      else
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
      if(pago.length != 0){
        this.pagoCheque = pago[0];
        this.buscarChequesRelacionados();
        if(this.pagoCheque.estado == "Pagado"){
          this.mostrarMensajeGenerico(2,"El cheque ya se encuentra cancelado")
          return;
        }

      }else
        this.mostrarMensajeGenerico(2,"No se encontraron datos")
      
      if(this.opMenu == "Gestionar Pagos/Cheques")
        this.buscarFacturasPorComprobante()
      else
        this.mostrarLoading = false;
    })  
  }

  buscarChequesRelacionados(){
    var busquedaTransaccion = new tipoBusquedaTransaccion();
    busquedaTransaccion.NumDocumento = this.pagoCheque.idComprobante;
    this._transaccionesChequeService.getTransaccionesPorIdComprobante(busquedaTransaccion).subscribe(res => {
      this.listaChequesEncontrados = res as TransaccionChequesGirado[];
      this.validarEstadosCheques();
    })  
  }

  buscarFacturasPorComprobante(){
    this.mensajeLoading = "Buscando Facturas..."
    var busquedaTransaccion = new tipoBusquedaTransaccion();
    busquedaTransaccion.NumDocumento = this.pagoCheque.idComprobante;
    this._transaccionesFacturasService.getTransaccionesPorIdComprobante(busquedaTransaccion).subscribe(res => {
      this.listaFacturas = res as TransaccionesFacturas[];
      this.mostrarFacturas = true;
      this.mostrarLoading = false;
    })  
  }

  validarEstadosCheques(){
    var cont = 0;
    var cheque = new TransaccionChequesGirado();
    if(this.listaChequesEncontrados.length == 1)
      this.estadoFacturas = "PAGADA"
    else if(this.listaChequesEncontrados.length > 1){
      this.listaChequesEncontrados.forEach(element => {
        if(element.estado != "Pagado"){
          cont++;
          cheque = element;
        }
      });

      console.log(this.estadoFacturas,cont)
      if(cont == 1 && cheque.idPago == this.pagoCheque.idPago)
        this.estadoFacturas = "PAGADA"
      else
        this.estadoFacturas = "ABONADA"

    }

    
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


  actualizarEstadoPago(){
    if(this.listaFacturas.length != 0){
      Swal.fire({
        title: 'Pago Cheque',
        text: "Esta seguro que desea actualizar el pago del cheque # "+ this.pagoCheque.numCheque ,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.mostrarLoading = true;
          this.pagoCheque.estado = "Pagado"
          this._transaccionesChequeService.updateEstadoPago(this.pagoCheque).subscribe((res) => {
            this.actualizarEstadosFacturas();
          },(err) => {});
      
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.mostrarMensajeGenerico(2,"Se ha cancelado su proceso.");
        }
      })
    }else
      this.mostrarMensajeGenerico(2,"No existen facturas vinculadas")    
  }

  actualizarEstadosFacturas(){
    var sumaValores = 0;
    this.listaFacturas.forEach(element =>{
      sumaValores = sumaValores + element.valorCancelado;
    })
    var valorPorcentaje = (this.pagoCheque.valor * 100) / sumaValores;
    var cont = 0;
    var valorT = 0;
    this.listaFacturas.forEach(element =>{
      cont++;
      element.estado = this.estadoFacturas;
      valorT = (valorPorcentaje*element.valorCancelado) / 100
      element.valorAbonado = valorT + element.valorAbonado;
      this._transaccionesFacturasService.updateEstadoFactura(element,this.estadoFacturas,element.valorAbonado).subscribe((res) => {
        this.contadorVal(cont);
      },(err) => {});
    })
    
  }

  contadorVal(cont) {
    if(this.listaFacturas.length == cont){
      this.actualizarEstadosFacturasProveedor();
    } 
  }

  actualizarEstadosFacturasProveedor(){
    var cont = 0;
    this.listaFacturas.forEach(element =>{
      cont++;
      var busquedaTransaccion = new tipoBusquedaTransaccion();
      busquedaTransaccion.NumDocumento = element.numFactura.toString();
      this._facturaProveedorService.getFacturaPorNFactura(busquedaTransaccion).subscribe((res) => {
        var facturas = res as FacturaProveedor[];
        var facturaEncontrada = facturas[0];
        if(facturaEncontrada.estado == "CUBIERTA"  || facturaEncontrada.estado == "ABONADA"){
          this._facturaProveedorService.updateEstadoFactura(facturaEncontrada._id,this.estadoFacturas).subscribe((res) => {
            this.contadorValFacturas(cont);
          },(err) => {});
        }else{
          this.contadorValFacturas(cont);
        }
        
      },(err) => {});
    })
    
  }

   contadorValFacturas(cont) {
    if(this.listaFacturas.length == cont){
      this.mostrarLoading = false;
      this.mostrarMensajeGenerico(1,"Estado actualizado correctamente")
      this.reiniciarPagoCheque();
    } 
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


   reiniciarPagoCheque(){
    this.pagoCheque = new TransaccionChequesGirado();
    this.idPago = 0;
    this.numCheque = 0;
    this.listaFacturas = [];
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