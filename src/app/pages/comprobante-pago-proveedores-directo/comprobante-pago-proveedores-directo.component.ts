import { Component, OnInit } from '@angular/core';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import Swal from 'sweetalert2';
import { CentroCosto } from '../administracion-cuentas/administracion-cuenta';
import { objDate, tipoBusquedaTransaccion } from '../transacciones/transacciones';
import { contadoresDocumentos } from '../ventas/venta';
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { DatosConfiguracionService } from 'src/app/servicios/datosConfiguracion.service';
import { OperacionComercial } from '../reciboCaja/recibo-caja';
import { AuthenService } from 'src/app/servicios/authen.service';
import { user } from '../user/user';
import { ProveedoresService } from 'src/app/servicios/proveedores.service';
import { OrdenDeCompra, Proveedor } from '../compras/compra';
import { ComprobantePago } from '../comprobante-pago/comprobante-pago';
import { FacturasProveedorService } from 'src/app/servicios/facturas-proveedor.service';
import { FacturaProveedor } from '../orden-compra/ordencompra';
import { ComprobantePagoProveedoresService } from 'src/app/servicios/comprobantePagoProveedores.service';
import { TransaccionesFacturasService } from 'src/app/servicios/transaccionesFacturas.service';
import { ComprobantePagoProveedor, TransaccionesFacturas } from '../comprobante-pago-proveedores/comprobante-pago-proveedores';
import { OrdenesCompraService } from 'src/app/servicios/ordenes-compra.service';


@Component({
  selector: 'app-comprobante-pago-proveedores-directo',
  templateUrl: './comprobante-pago-proveedores-directo.component.html',
  styleUrls: ['./comprobante-pago-proveedores-directo.component.scss']
})
export class ComprobantePagoProveedoresDirectoComponent implements OnInit {
  listadoFacturasPagar: TransaccionesFacturas [] = []
  comprobantesEncontrados:ComprobantePago[]
  mostrarNewCP: boolean = true;
  mostrarListaCP: boolean = false;
  mostrarTransaccionesFacturas: boolean = false;
  mostrarTransaccionesCheques: boolean = false;
  comprobantePago : ComprobantePagoProveedor
  busquedaTransaccion : tipoBusquedaTransaccion
  comprobantePagoDescarga : ComprobantePagoProveedor
  listadoComprobantes: ComprobantePagoProveedor [] = []
  listadoTransaccionesFactura: TransaccionesFacturas [] = []
  listaTransaccionesEncontradas: TransaccionesFacturas [] = []
  listaTransaccionesEncontradasAEliminar: TransaccionesFacturas [] = []
  listadoComprobantesActivos: ComprobantePagoProveedor [] = []
  listadoComprobantesAnulados: ComprobantePagoProveedor [] = []
  listadoComprobantesPendientes: ComprobantePagoProveedor [] = []
  proveedores: Proveedor [] = []
  listaFacturas: FacturaProveedor [] = []
  isReadOnly: boolean = false;
  contadores:contadoresDocumentos[]

  listadoOperaciones: OperacionComercial [] = []
  operacionComercial: OperacionComercial
  valorTotalFacturas = 0;
  valorTotalCheques = 0;
  mostrarDelete : boolean = true;
  mostrarAprobacion : boolean = false;


  mostrarLoading : boolean = false;
  mensajeLoading = "Cargando"

  parametrizaciones: parametrizacionsuc[] = [];
  detallesCostos: CentroCosto[] = [];
  parametrizacionSucu: parametrizacionsuc;
  obj: objDate;
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();


  arraySucursales: string[] = [
    "matriz",
    "sucursal1",
    "sucursal2"
  ];

  estados: string[] = [
      'Activos',
      'Pendientes',
      'Anulados',
  ];

  imagenLogotipo ="";
  textLoading = "";


  constructor(
    public _contadoresService: ContadoresDocumentosService,
    public _comprobantePagoProveedoresService: ComprobantePagoProveedoresService,
    public _transaccionesFacturaService: TransaccionesFacturasService,
    public _parametrizacionService: ParametrizacionesService,
    public _configuracionService: DatosConfiguracionService,
    public _proveedoresService: ProveedoresService,
    public _facturaProveedorService: FacturasProveedorService,
    public _ordenCompraService : OrdenesCompraService,
    public _authenService:AuthenService,
    ) {
   }

  ngOnInit() {
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.listadoFacturasPagar.push(new TransaccionesFacturas());
    this.comprobantePago = new ComprobantePagoProveedor();
    this.cargarUsuarioLogueado();

    this.traerContadoresDocumentos();
    this.traerParametrizaciones();
    this.traerDatosConfiguracion();
    this.traerProveedores();

  }


  async traerContadoresDocumentos(){
    await this._contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
      this.comprobantePago.idDocumento = this.contadores[0].comprobantePagoProveedor_Ndocumento + 1;
   })
  }

  traerProveedores(){
    this.mostrarLoading = true;
    this._proveedoresService.getProveedor().subscribe(res => {
      this.proveedores = res as Proveedor[];
      this.mostrarLoading = false;
   })
  }

  traerFacturasPorProveedor(e){
    this.mostrarLoading = true;
    this.mensajeLoading = "Buscando Facturas"
    var factura = new FacturaProveedor();
    factura.proveedor = this.comprobantePago.nombreProveedor;
    this._facturaProveedorService.getFacturasPendientesPorProveedor(factura).subscribe(res => {
      this.listaFacturas = res as FacturaProveedor[];
      this.mostrarLoading = false;
    }) 
  }


  obtenerAbonos(e,i){
    this.listadoFacturasPagar[i].valorAbonado = 0;
    this.listaTransaccionesEncontradas.forEach(element =>{
      this.listadoFacturasPagar[i].valorAbonado += element.valorCancelado;
    })
    this.obtenerDatosFactura(e,i);
  }


  cargarUsuarioLogueado() {
    const promesaUser = new Promise((res, err) => {
      if (localStorage.getItem("maily") != '') 
      var correo = localStorage.getItem("maily");

      this._authenService.getUserLogueado(correo)
        .subscribe(
          res => {
            var usuario = res as user;
            this.comprobantePago.usuario = usuario[0].username.toString();
            this.comprobantePago.sucursal = usuario[0].sucursal.toString();
          }
        )
    });
  }


  calcularValor(e,i){
    var valor = this.listadoFacturasPagar[i].valorFactura - this.listadoFacturasPagar[i].valorAbonado
    var valor2 = Number(valor.toFixed(2)) - Number(this.listadoFacturasPagar[i].valorCancelado.toFixed(2))
    this.listadoFacturasPagar[i].valorSaldos = Number(valor2.toFixed(2))

    if(this.listadoFacturasPagar[i].valorCancelado > valor){
      this.listadoFacturasPagar[i].valorCancelado = 0; 
      this.mostrarMensajeGenerico(2,"La cantidad ingresada es superior al saldo") 
    }
 
    var valor = this.listadoFacturasPagar[i].valorFactura - this.listadoFacturasPagar[i].valorAbonado
    var total = valor - this.listadoFacturasPagar[i].valorCancelado 
    if(total == 0)
      this.listadoFacturasPagar[i].estado = "PAGADA"
    else if(total > 0)
      this.listadoFacturasPagar[i].estado = "CUBIERTA PARCIAL"

    this.calcularTotal();
    
  }


  calcularTotal(){
    this.valorTotalFacturas = 0;
    this.listadoFacturasPagar.forEach(element=>{
      this.valorTotalFacturas = Number(this.valorTotalFacturas.toFixed(2)) + Number(element.valorCancelado.toFixed(2));
    });
  }



  traerParametrizaciones() {
    this._parametrizacionService.getParametrizacion().subscribe((res) => {
      this.parametrizaciones = res as parametrizacionsuc[];
    });
  }

  traerDatosConfiguracion() {
    this._configuracionService.getDatosConfiguracion().subscribe((res) => {
      this.imagenLogotipo = res[0].urlImage;
    });
  }



  async obtenerDatosFactura(e,i){
    var valor = 0;
    var factura = await this.listaFacturas.find(element=> element._id == e.value);
    this.listadoFacturasPagar[i].numFactura = factura.nFactura;
    this.listadoFacturasPagar[i].valorFactura = factura.total;
    this.listadoFacturasPagar[i].fechaFactura = factura.fecha;
    valor =  Number(this.listadoFacturasPagar[i].valorFactura.toFixed(2)) - Number(this.listadoFacturasPagar[i].valorAbonado.toFixed(2));
    this.listadoFacturasPagar[i].valorSaldos = Number(valor.toFixed(2))
    //this.listadoFacturasPagar[i].valorCancelado = Number(valor.toFixed(2))
  }


  eliminarRegistro(i: number) {
    this.listadoFacturasPagar.splice(i, 1);
    this.calcularTotal();
  }


  addElement(){
    this.listadoFacturasPagar.push(new TransaccionesFacturas());
  }


  async guardar(){
    var flag = true;
    this.valorTotalCheques = 0;
    this.valorTotalFacturas = 0;

    this.listadoFacturasPagar.forEach(element=>{
      this.valorTotalFacturas = this.valorTotalFacturas + element.valorCancelado;
      if(element.valorFactura == 0 || element.valorCancelado == 0)
        flag = false;
    });


    if(flag == true)
        this.obtenerId();
    else
      this.mostrarMensajeGenerico(2,"Hay campos vacios en los registros");
  }

  obtenerId(){
    this.textLoading = "Guardando";
    this.mostrarLoading = true;
    var IdNum = new Promise<any>((resolve, reject) => {
      try {
        this._comprobantePagoProveedoresService.getComprobantePorIdConsecutivo(this.comprobantePago).subscribe(res => {
         this.comprobantesEncontrados = res as ComprobantePago[];
          if(this.comprobantesEncontrados.length == 0){
            resolve("listo");
          }else{
            this.comprobantePago.idDocumento = this.comprobantePago.idDocumento+1
            this.obtenerId();
          }
           
          },(err) => {});
      } catch (error) {
      } 
    })

    IdNum.then((data) => {
      this.generarDto();
    })
  }




  generarDto(){
    this.comprobantePago.transaccionesFacturas = this.listadoFacturasPagar
    
    this.comprobantePago.transaccionesFacturas.forEach(element=>{
      //element.estado = "PAGADA"
      element.usuario = this.comprobantePago.usuario;
      element.fechaFactura = this.comprobantePago.fechaComprobante;
      element.proveedor = this.comprobantePago.nombreProveedor;
      element.numCheque = "";
      element.banco = "";
      element.cuenta = "";
      element.fechaPago = "";
    });

    this.guardarComprobantePago(); 
  }


  guardarComprobantePago(){
    try {
      this._comprobantePagoProveedoresService.newComprobantePago(this.comprobantePago).subscribe((res) => {
        this.actualizarContador();
        this.actualizarEstadosFacturas();
        this.generarTransaccionesFacturas();
      },(err) => {});
    } catch (error) {
      this.mostrarMensajeGenerico(2,"Error al guardar el comprobante"); 
    }    
  }


  actualizarContador(){
    this.contadores[0].comprobantePagoProveedor_Ndocumento = this.comprobantePago.idDocumento
    this._contadoresService.updateContadoresIDComprobantePagoProveedor(this.contadores[0]).subscribe( res => {
    },err => {})
  }


  async traerTransaccionesPorFactura(e,i){ 
     var factura = await this.listaFacturas.find(element=> element._id == e.value)
    this.listadoFacturasPagar[i].estado = factura.estado;
    this.busquedaTransaccion = new tipoBusquedaTransaccion()
    this.busquedaTransaccion.NumDocumento = factura.nFactura;
    this._transaccionesFacturaService.obtenerTransaccionesPorFactura(this.busquedaTransaccion).subscribe(res => {
      this.listaTransaccionesEncontradas = res as TransaccionesFacturas[];
      this.obtenerAbonos(e,i);
      this.obtenerOrdenCompraRelacionada(e,i);
    })  
  }


  async obtenerOrdenCompraRelacionada(e,i){ 
    var factura = await this.listaFacturas.find(element=> element._id == e.value)
    var newOrden = new OrdenDeCompra()
    newOrden.n_orden = factura.nSolicitud;
    this._ordenCompraService.getOrdenEspecifica(newOrden).subscribe(res => {
      var orden = res as OrdenDeCompra[];
      if(orden.length != 0){
        this.listadoFacturasPagar[i].estadoOrden = orden[0].estadoOrden;
        this.listadoFacturasPagar[i].numeroOrden = orden[0].n_orden;
      }
    })  
  }


  actualizarEstadosFacturas(){
    this.comprobantePago.transaccionesFacturas.forEach(element=>{
      var abono = element.valorAbonado + element.valorCancelado
      //updateEstadoFacturaProveedor
      this._facturaProveedorService.updateEstadoFacturaProveedor(element.idFactura, element.estado, abono, abono).subscribe( res => {
      },err => {})
    });
  }


  generarTransaccionesFacturas(){
    var cont=0;
    this.comprobantePago.transaccionesFacturas.forEach(element=>{
      element.idComprobante = "CPP"+ this.comprobantePago.idDocumento
      try {
        this._transaccionesFacturaService.newTransaccion(element).subscribe((res) => {
          cont++
          this.comprobarYMostrarMensaje(cont)},(err) => {});
      } catch (error) {
        this.mostrarMensajeGenerico(2,"Error al guardar la transaccion"); 
      }    
    }); 
    return true;
  }

  comprobarYMostrarMensaje(num:number){
    if(this.comprobantePago.transaccionesFacturas.length == num)
      this.terminarOperacion();
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
