import { Component, OnInit } from '@angular/core';
import { AuthenService } from 'src/app/servicios/authen.service';
import { TransaccionesFinancierasService } from 'src/app/servicios/transaccionesFinancieras.service';
import Swal from 'sweetalert2';
import { objDate } from '../transacciones/transacciones';
import { TransaccionesFinancieras } from '../transaccionesFinancieras/transaccionesFinancieras';
import { user } from '../user/user';
import { cajaMenor, DetalleCajaMenor } from './caja-menor';


@Component({
  selector: 'app-caja-menor',
  templateUrl: './caja-menor.component.html',
  styleUrls: ['./caja-menor.component.scss']
})
export class CajaMenorComponent implements OnInit {
  transaccionesCaja: DetalleCajaMenor[] = [];
  listaTransacciones  : TransaccionesFinancieras[] = [];
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  dateNow = new Date().toLocaleDateString();

  cajaMenor : cajaMenor;

  obj: objDate;
  resultado =0;
  estadoCuenta = "";
  
  constructor(
    public _transaccionesFinancierasService : TransaccionesFinancierasService,
    public _authenService: AuthenService
    ) {
   }

  ngOnInit() {
    this.traerTransaccionesFinancierasPorDia();
    this.cargarUsuarioLogueado();
    this.cajaMenor = new cajaMenor();
    this.cajaMenor.fecha = this.dateNow;
  }

  cargarUsuarioLogueado() {
    new Promise((res, err) => {
      if (localStorage.getItem("maily") != '') 
      var correo = localStorage.getItem("maily");

      this._authenService.getUserLogueado(correo)
        .subscribe(
          res => {
            var usuario = res as user;
            this.cajaMenor.usuario = usuario[0].username.toString();
            this.cajaMenor.sucursal = usuario[0].sucursal.toString();
          }
        )
    });
  }


  calcular(){
    var totalSuma = 0;
    var totalResta = 0;
    var totalRC = 0;
    this.transaccionesCaja.forEach(element=>{
      totalSuma += element.TotalIngresos ?? 0 ;
      totalResta += element.TotalSalidas ?? 0;
      totalRC += element.TotalRC ?? 0;
    });

    this.resultado = totalSuma - totalResta - totalRC;
    if(this.resultado == 0){
      this.estadoCuenta = "OK"
    }
    else if(this.resultado > 0){
      this.estadoCuenta = "SOBRANTE"
    }
    else if(this.resultado < 0){
      this.estadoCuenta = "FALTANTE"
    }
  }


  traerTransaccionesFinancierasPorDia(){
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this._transaccionesFinancierasService.getTransaccionesFinancierasPorRango(this.obj).subscribe(res => {
      this.listaTransacciones = res as TransaccionesFinancieras[];
      this.crearTransaccionesCaja();
   })
  }


  crearTransaccionesCaja(){
    this.listaTransacciones.forEach(element=>{
      var newCaja = new DetalleCajaMenor();
      newCaja.OrderDate = element.fecha.toLocaleString();
      newCaja.Sub1 = element.numDocumento;
      newCaja.Sub2 = element.documentoVenta;
      newCaja.SubCuenta = element.subCuenta;
      newCaja.Cuenta = element.cuenta;
      if(element.tipoCuenta == "Ingresos")
        newCaja.TotalIngresos = element.valor;
      if(element.tipoCuenta == "Salidas")
        newCaja.TotalSalidas = element.valor;
      if(element.tipoCuenta == "Reales y Transitorias")
        newCaja.TotalRC = element.valor;


      this.transaccionesCaja.push(newCaja);
      this.calcular();
    });
  }


 /*  guardar(){
    var flag = true;
    this.listadoOperaciones.forEach(element=>{
      if(element.idCuenta == null || element.idSubCuenta == null || element.valor == 0){
        flag = false;
      }
    });

    if(this.listaTransacciones.length == 0)
        this.mostrarMensajeGenerico(2,"El total debe ser superior a 0");  
      else 
        this.obtenerId();
    }
    else
      this.mostrarMensajeGenerico(2,"Hay campos vacios en los registros");
  }

  obtenerId(){
    this.textLoading = "Guardando";
    this.mostrarLoading = true;
    var IdNum = new Promise<any>((resolve, reject) => {
      try {
        this._comprobantePagoService.getComprobantePorIdConsecutivo(this.comprobantePago).subscribe(res => {
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
  } */

}




