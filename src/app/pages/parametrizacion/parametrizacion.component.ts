import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { sucursal, contadoresDocumentos } from '../ventas/venta';
import { Sucursal } from '../compras/compra';
import Swal from 'sweetalert2';
import { parametrizacionsuc } from './parametrizacion';
import { element } from 'protractor';
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { SucursalesService } from 'src/app/servicios/sucursales.service';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';

@Component({
  selector: 'app-parametrizacion',
  templateUrl: './parametrizacion.component.html',
  styleUrls: ['./parametrizacion.component.scss']
})
export class ParametrizacionComponent implements OnInit {

  locales:Sucursal[]=[]
  parametroSuc = {
    nombre:"",
    sucursal:"",
    ruc:"",
    razon_social:"",
    sri:"",
    fecha:"",
    inicio:0,
    fin:0,
    direccion:"",
    telefonos:""
  }
  varDis:boolean=true
  parametrizacionesData:parametrizacionsuc[]=[]
  parametrizacionSucu:parametrizacionsuc
  contadores:contadoresDocumentos
  nombreSucursal:string=""
  constructor(public parametrizacionService:ParametrizacionesService,public contadorService:ContadoresDocumentosService, public sucursalesService:SucursalesService) {
    this.parametroSuc.sucursal="Matriz"
   }

  ngOnInit() {
    

    //this.getParametrizaciones()
    this.traerSucursales()
    this.traerParametrizaciones()
    this.traerContadoresDocumentos()
  }

 
   traerContadoresDocumentos(){
     this.contadorService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos;
   })
  }

  traerSucursales(){
    this.sucursalesService.getSucursales().subscribe(res => {
      this.locales = res as Sucursal[];
   })
  }


  traerParametrizaciones(){
    this.parametrizacionService.getParametrizacion().subscribe(res => {
      this.parametrizacionesData = res as parametrizacionsuc[];
      this.obtenerData()
   })
  }

  traerParametrizaciones2(){
    this.parametrizacionService.getParametrizacion().subscribe(res => {
      this.parametrizacionesData = res as parametrizacionsuc[];
   })
  }

  /* getParametrizaciones(){
    this.db.collection('/parametrizacionSucursales').snapshotChanges().subscribe((locales) => {
      new Promise<any>((resolve, reject) => {
        locales.forEach((nt: any) => {
          this.parametrizacionesData.push(nt.payload.doc.data());
        })
      })
      this.obtenerData()
    })
  } */

  desbloquear(){

    if(this.varDis){
      this.varDis=false
    }else{
      this.varDis=true
    }
  }

 /*  getParametrizaciones2(){
    this.db.collection('/parametrizacionSucursales').snapshotChanges().subscribe((locales) => {
      new Promise<any>((resolve, reject) => {
        locales.forEach((nt: any) => {
          this.parametrizacionesData.push(nt.payload.doc.data());
        })
      })
      
    })
  } */

  obtenerData(){
    var cont=0
    this.traerParametrizaciones2()
    this.parametrizacionesData.forEach(element=>{
      //console.log("para "+JSON.stringify(element))
      if(element.sucursal == "matriz"){
        cont++
        this.parametroSuc = element
        console.log("encontre "+JSON.stringify(element))
        console.log("sume "+cont)

      }
    })
  }

  obtenerData2(){
    var cont=0
    this.traerParametrizaciones2()
    this.parametrizacionesData.forEach(element=>{
      console.log("para "+JSON.stringify(element))
      if(element.sucursal == "sucursal1"){
        cont++
        this.parametroSuc = element
        console.log("encontre "+JSON.stringify(element))
        console.log("sume "+cont)

      }
    })
  }

  obtenerData3(){
    var cont=0
    this.traerParametrizaciones2()
    console.log("entre a cargar "+sucursal +this.parametrizacionesData.length)
    this.parametrizacionesData.forEach(element=>{
      console.log("para "+JSON.stringify(element))
      if(element.sucursal == "sucursal2"){
        cont++
        this.parametroSuc = element
        console.log("encontre "+JSON.stringify(element))
        console.log("sume "+cont)

      }
    })
  }

  actualizarContadores(){
    

    switch (this.parametroSuc.sucursal) {
      case "matriz":
        this.contadores[0].facturaMatriz_Ndocumento = this.parametroSuc.inicio
        this.contadorService.updateContadoresIDFacturaMatriz(this.contadores[0]).subscribe(res => {this.correcto()},err => {this.error()})
        break;
      case "sucursal1":
        this.contadores[0].facturaSucursal1_Ndocumento = this.parametroSuc.inicio
        this.contadorService.updateContadoresIDFacturaSuc1(this.contadores[0]).subscribe(res => {this.correcto()},err => {this.error()})
        break;
      case "sucursal2":
        this.contadores[0].facturaSucursal2_Ndocumento = this.parametroSuc.inicio
        this.contadorService.updateContadoresIDFacturaSuc2(this.contadores[0]).subscribe(res => {this.correcto()},err => {this.error()})
        break;
      default:
        break;
    }

    
  }


  correcto(){
    Swal.fire({
      title: 'Proceso guardado',
      text: 'Se ha guardado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }
  

  error(){
    Swal.fire({
      title: "Error",
      text: 'Revise e intente nuevamente',
      icon: 'error'
    })
  }
  


   newParametrizacion(){
    this.nombreSucursal= this.parametroSuc.nombre
    if(this.parametroSuc.nombre!="" &&this.parametroSuc.direccion!="" && this.parametroSuc.fecha!= "" && this.parametroSuc.inicio!=0 && this.parametroSuc.fin!=0 && this.parametroSuc.razon_social!=""
    && this.parametroSuc.ruc!="" && this.parametroSuc.sri!="" && this.parametroSuc.telefonos!=""){
      this.mensajeGuardando()
      var sucurs= this.parametroSuc.sucursal
      new Promise<any>((resolve, reject) => {
        this.parametrizacionService.updateParametrizacion(this.parametroSuc).subscribe(
          res => {
            this.actualizarsucursal()
          },
          err => {
            Swal.fire({
              title: err.error,
              text: 'Revise e intente nuevamente',
              icon: 'error'
            })
          })
      })
    }else{
      Swal.fire({
        title: 'Error',
        text: 'Hay campos vacios',
        icon: 'error'
      })
    }
    
  } 

  actualizarsucursal(){
    this.locales.forEach(element=>{
      if(this.parametroSuc.sucursal == element.nombre){
        //alert(this.nombreSucursal)
        element.nombreComercial= this.nombreSucursal
        this.sucursalesService.updateSucursales(element).subscribe(
          res => {
            this.actualizarContadores()
          },
          err => {
            Swal.fire({
              title: err.error,
              text: 'Revise e intente nuevamente',
              icon: 'error'
            })
          })
      }
    })
  }

  mensajeGuardando(){
    let timerInterval
          Swal.fire({
          title: 'Guardando !',
          html: 'Procesando',
          timerProgressBar: true,
          onBeforeOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
              const content = Swal.getContent()
              if (content) {
              }
            }, 100)
          },
          onClose: () => {
            clearInterval(timerInterval)
          }
        })
  }

  limpiarCampos(){
    this.parametroSuc.direccion=""
    this.parametroSuc.fecha=""
    this.parametroSuc.fin=0
    this.parametroSuc.inicio=0
    this.parametroSuc.razon_social=""
    this.parametroSuc.ruc=""
    this.parametroSuc.sri=""

  }

  mostrar(i:number){
    this.limpiarCampos()
    var x = document.getElementById("op1");
    var y = document.getElementById("op2");
    var z = document.getElementById("op3");
    switch (i) {
      case 1:
        this.parametroSuc.sucursal="matriz";
        x.style.display = "block";
        y.style.display="none";
        z.style.display="none";
        this.obtenerData()
       break;
  
      case 2:
        this.parametroSuc.sucursal="sucursal1";
        x.style.display = "none";
        y.style.display="block";
        z.style.display="none";
        this.obtenerData2()
        break;

      case 3:
        this.parametroSuc.sucursal="sucursal2";
        x.style.display = "none";
        y.style.display="none";
        z.style.display="block";
        this.obtenerData3()
        break;
      default:    
    }      
  }

}
