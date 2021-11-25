import { Component, OnInit } from '@angular/core';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { CuentasService } from 'src/app/servicios/cuentas.service';
import { ReciboCajaService } from 'src/app/servicios/reciboCaja.service';
import { SubCuentasService } from 'src/app/servicios/subCuentas.service';
import { TransaccionesFinancierasService } from 'src/app/servicios/transaccionesFinancieras.service';
import Swal from 'sweetalert2';
import { Cuenta, SubCuenta } from '../administracion-cuentas/administracion-cuenta';
import { contadoresDocumentos } from '../ventas/venta';
import { OperacionComercial, ReciboCaja, TransaccionesFinancieras } from './recibo-caja';


@Component({
  selector: 'app-recibo-caja',
  templateUrl: './recibo-caja.component.html',
  styleUrls: ['./recibo-caja.component.scss']
})
export class ReciboCajaComponent implements OnInit {

  resultado =0;
  listaCuentas: Cuenta [] = []
  listaSubCuentas: SubCuenta [] = []
  listaSubCuentas2: SubCuenta [] = []
  listaSubCuentas3: SubCuenta [] = []
  isReadOnly: boolean = false;
  contadores:contadoresDocumentos[]
  recibosEncontrados:ReciboCaja[]

  listadoOperaciones: OperacionComercial [] = []
  operacionComercial: OperacionComercial
  reciboCaja : ReciboCaja
  valorTotal1 = 0;
  valorTotal2 = 0;
  mostrarLoading : boolean = false;


  constructor(
    public _cuentasService : CuentasService,
    public _subCuentasService : SubCuentasService,
    public _transaccionFinancieraService : TransaccionesFinancierasService,
    public _reciboCajaService : ReciboCajaService,
    public _contadoresService: ContadoresDocumentosService,
    ) {
   }

  ngOnInit() {
    this.listadoOperaciones.push(new OperacionComercial());
    this.reciboCaja = new ReciboCaja();
    this.traerContadoresDocumentos();
    this.traerListaCuentas();
  }


  async traerContadoresDocumentos(){
    await this._contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
      this.reciboCaja.idDocumento = this.contadores[0].reciboCaja_Ndocumento + 1;
   })
  }

  


  traerListaCuentas(){
    this._cuentasService.getCuentas().subscribe(res => {
      this.listaCuentas = res as Cuenta[];
      this.traersubCuentas();
   })
  }

  buscarSubCuentas(e,i){
    if(i==0)
      this.listaSubCuentas =  this.listaCuentas.find(element=> element._id == e.value).sub_cuentaList;
    if(i==1)
      this.listaSubCuentas2 =  this.listaCuentas.find(element=> element._id == e.value).sub_cuentaList;
    if(i==2)
      this.listaSubCuentas3 =  this.listaCuentas.find(element=> element._id == e.value).sub_cuentaList;
  }


  traersubCuentas(){
    this.listaCuentas.forEach(element=>{
      this._subCuentasService.getSubCuentasPorId(element._id).subscribe(res => {
        element.sub_cuentaList = res as SubCuenta[];
      })
    })
  }

 
  calcularValores(){
    this.valorTotal1 = this.reciboCaja.valorFactura;
    this.valorTotal2 = this.reciboCaja.valorOtros + this.reciboCaja.valorPagoEfectivo + this.reciboCaja.valorRecargo;
    this.reciboCaja.valorSaldos = this.valorTotal1 - this.valorTotal2 ;
  }

  eliminarRegistro(i: number) {
    this.listadoOperaciones.splice(i, 1);
  }


  addElement(){
    if(this.listadoOperaciones.length <= 2)
      this.listadoOperaciones.push(new OperacionComercial());
    else
      this.mostrarMensajeGenerico(2,"No se pueden ingresar mas operaciones");
  }


  async guardar(){
    var flag = true;
    this.listadoOperaciones.forEach(element=>{
      if(element.idCuenta == null || element.idSubCuenta == null || element.valor == 0){
        flag = false;
      }
    });

    if(flag == true)
      this.generarDto();
    else
      this.mostrarMensajeGenerico(2,"Hay campos vacios en los registros");
  }

  obtenerId(){
    console.log("pase");
    var IdNum = new Promise<any>((resolve, reject) => {
      try {
        this._reciboCajaService.getReciboCajaPorId(this.reciboCaja).subscribe(res => {
         this.recibosEncontrados = res as ReciboCaja[];
          if(this.recibosEncontrados.length == 0){
            resolve("listo");
          }else{
            this.reciboCaja.idDocumento = this.reciboCaja.idDocumento+1
            this.obtenerId();
          }
           
          },(err) => {});
      } catch (error) {
       
      } 

    })

    IdNum.then((data) => {
        console.log("----",JSON.stringify(data));
      })
      .catch((error) => {
        console.log("Promise rejected with " + JSON.stringify(error));
      });
  }

  generarDto(){
    if(this.reciboCaja.valorFactura == 0){
      this.mostrarMensajeGenerico(2,"Debe ingresar un valor de la factura");  
    }else{
      this.mostrarLoading = true;
      this.reciboCaja.operacionesComercialesList = this.listadoOperaciones;
      this.reciboCaja.operacionesComercialesList.forEach(element=>{
        var cuenta = this.listaCuentas.find(element2=> element2._id == element.idCuenta);
        element.nombreCuenta = cuenta.nombre;
        element.nombreSubcuenta = cuenta.sub_cuentaList.find(element2=> element2._id == element.idSubCuenta).nombre;
      });
      this.guardarReciboCaja(); 
    }
    return this.reciboCaja;
  }

  generarTransaccionesFinancieras(){
    var cont=0;
    this.reciboCaja.operacionesComercialesList.forEach(element=>{
      var transaccion = new TransaccionesFinancieras();
      transaccion.fecha = new Date();
      transaccion.sucursal = this.reciboCaja.sucursal;
      transaccion.cliente = this.reciboCaja.cliente;
      transaccion.rCajaId = this.reciboCaja.idDocumento.toString();
      transaccion.documentoVenta = this.reciboCaja.docVenta;
      transaccion.numDocumento = this.reciboCaja.numDocumento;
      transaccion.valor = element.valor;
      transaccion.tipoPago = "";
      transaccion.soporte = "";
      transaccion.dias = 0;
      transaccion.cuenta = element.nombreCuenta;
      transaccion.subCuenta = element.nombreSubcuenta;
      transaccion.notas = this.reciboCaja.observaciones;

      try {
        this._transaccionFinancieraService.newTransaccionFinanciera(transaccion).subscribe((res) => {
          cont++
          this.comprobarYMostrarMensaje(cont)},(err) => {});
      } catch (error) {
        this.mostrarMensajeGenerico(2,"Error al guardar la transaccion"); 
      }    
    });
    return true;
  }

  comprobarYMostrarMensaje(num:number){
    if(this.reciboCaja.operacionesComercialesList.length == num){
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
  }

  guardarReciboCaja(){
    try {
      this._reciboCajaService.newReciboCaja(this.reciboCaja).subscribe((res) => {
        this.actualizarContador();
        this.generarTransaccionesFinancieras();
      },(err) => {});
    } catch (error) {
      this.mostrarMensajeGenerico(2,"Error al guardar la transaccion"); 
    }    
  }


  actualizarContador(){
    this.contadores[0].reciboCaja_Ndocumento = this.reciboCaja.idDocumento
    this._contadoresService.updateContadoresIDRegistroCaja(this.contadores[0]).subscribe( res => {
    },err => {})
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
