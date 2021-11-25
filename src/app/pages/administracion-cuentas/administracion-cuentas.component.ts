import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Cuenta, SubCuenta } from './administracion-cuenta';
import { CuentasService } from 'src/app/servicios/cuentas.service';
import { SubCuentasService } from 'src/app/servicios/subCuentas.service';
import { timingSafeEqual } from 'crypto';


@Component({
  selector: 'app-administracion-cuentas',
  templateUrl: './administracion-cuentas.component.html',
  styleUrls: ['./administracion-cuentas.component.scss']
})
export class AdministracionCuentasComponent implements OnInit {

  listaCuentas : Cuenta[]=[]
  cuenta = {
    nombre:"",
    tipoCuenta:""
  }
  subCuenta = {
    nombre:""
  }
  varDis:boolean=true
  bloqueoSubCuenta:boolean=true



  valueCuenta= "";
  cuentaPrueba:Cuenta[]=[]
  newCuenta:Cuenta
  cuentaPrueba1:Cuenta
  cuentaPrueba2:Cuenta
  cuentaPrueba3:Cuenta
  popupVisible:boolean = false
  popupVisibleSubcuenta:boolean = false
  sectionCuentas:boolean = true
  sectionSubCuentas:boolean = false

  newSubCuenta: SubCuenta
  idCuenta:string
  isNew:boolean = true;

  menu1: string[] = ["Ingresos", "Salidas", "Reales y Transitorias"];

  subCuentaPrueba: SubCuenta[]=[]
  subCuentaPrueba1: SubCuenta
  subCuentaPrueba2: SubCuenta
  subCuentaPrueba3: SubCuenta
  constructor(
    public _cuentasService : CuentasService,
    public _subCuentasService : SubCuentasService,
    ) {
   }

  ngOnInit() {
    this.subCuentaPrueba1 = new SubCuenta();
    this.subCuentaPrueba1._id = "12345";
    this.subCuentaPrueba1.nombre = "ACTIVOS";

    this.subCuentaPrueba2 = new SubCuenta();
    this.subCuentaPrueba2._id = "234234";
    this.subCuentaPrueba2.nombre = "PASIVOS";


    this.subCuentaPrueba.push(this.subCuentaPrueba1);
    this.subCuentaPrueba.push(this.subCuentaPrueba2);

    this.traerListaCuentas()
    //this.traerContadoresDocumentos()

    
  }


  onKey(value: string) {
    this.valueCuenta = value;
  }

  

  enviar(e,cuenta){
    console.log("desbloqueare",cuenta._id +"sdsd :"+this.valueCuenta)
  }

  mostrarPopup(){
    this.popupVisible=true
    this.cuenta.nombre = "";
  }

  mostrarPopupSubCuenta(){
    this.popupVisibleSubcuenta=true
    this.subCuenta.nombre = "";
  }
 
  traerListaCuentas(){
    this._cuentasService.getCuentas().subscribe(res => {
      this.listaCuentas = res as Cuenta[];
      this.traersubCuentas();
   })
  }


  traersubCuentas(){
    this.listaCuentas.forEach(element=>{
      this._subCuentasService.getSubCuentasPorId(element._id).subscribe(res => {
      element.sub_cuentaList = res as SubCuenta[];
      })
    })

    

  }


  obtenerIdCuenta(e){
    this.idCuenta= e.value
  }


  obtenerTipoCuenta(e){
    this.cuenta.tipoCuenta = e.value
  }

 
  desbloquear(){
    this.varDis=!this.varDis
  }

  desbloquearSub(){
    this.bloqueoSubCuenta=!this.bloqueoSubCuenta
  }


  correcto(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se ha guardado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      this.traerListaCuentas();
    })
  }

  messaggeDelete(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se ha eliminado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      this.traerListaCuentas();
    })
  }
  

  error(){
    Swal.fire({
      title: "Error",
      text: 'Revise e intente nuevamente',
      icon: 'error'
    })
  }


   saveNewCuenta(){
    var existe = this.listaCuentas.find(element=> element.nombre == this.cuenta.nombre);
    if(!existe){
      this.popupVisible = false;
      this.newCuenta = new Cuenta();
      this.newCuenta.nombre = this.cuenta.nombre;
      this.newCuenta.tipoCuenta = this.cuenta.tipoCuenta;
      console.log("cuenta",this.newCuenta);
      this.mensajeGuardando()
      new Promise<any>((resolve, reject) => {
        this._cuentasService.newCuenta(this.newCuenta).subscribe(
          res => {
            this.correcto()
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
      this.popupVisible = false;
      Swal.fire({
        title: 'Error',
        text: 'El nombre de cuenta a crear ya existe',
        icon: 'error'
      })
    }
  } 


  saveNewSubCuenta(){
    if(true){
      this.popupVisibleSubcuenta = false;
      this.newSubCuenta  = new SubCuenta();
      this.newSubCuenta.idCuenta = this.idCuenta;
      this.newSubCuenta.nombre = this.subCuenta.nombre;
      this.mensajeGuardando()
      new Promise<any>((resolve, reject) => {
        this._subCuentasService.newSubCuenta(this.newSubCuenta).subscribe(
          res => {
            this.correcto()
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
      this.popupVisible = false;
      Swal.fire({
        title: 'Error',
        text: 'El nombre de cuenta a crear ya existe',
        icon: 'error'
      })
    }
  } 


  guardar(e,cuenta){
    this.cuenta = cuenta;
    this.popupVisible = true;
    this.isNew = false;
    
  }

  actualizarCuenta(){
    /* var existe = this.listaCuentas.find(element=> element.nombre == this.cuenta.nombre);
    if(!existe){ */
      this.mensajeGuardando()
      new Promise<any>((resolve, reject) => {
        this._cuentasService.updateCuentas(this.cuenta).subscribe(
          res => {
            this.popupVisible = false;
            this.correcto()
          },
          err => {
            Swal.fire({
              title: err.error,
              text: 'Revise e intente nuevamente',
              icon: 'error'
            })
          })
      })
    //}
   /*  else{
      Swal.fire({
        title: 'Error',
        text: 'El nombre de cuenta a crear ya existe',
        icon: 'error'
      })
    }  */
  }


  actualizarSubCuenta(e,subCuenta){
    //var existe = this.listaCuentas.find(element=> element.nombre == this.valueCuenta);
    if(true){
      subCuenta.nombre = this.valueCuenta;
      this.mensajeGuardando()
      new Promise<any>((resolve, reject) => {
        this._subCuentasService.updateSubCuentas(subCuenta).subscribe(
          res => {
            this.correcto()
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
        text: 'El nombre de cuenta a crear ya existe',
        icon: 'error'
      })
    }
  }



  eliminar(e,cuenta){
    Swal.fire({
      title: 'Eliminar Cuenta',
      text: "Esta seguro que desea eliminar el nombre de cuenta "+ cuenta.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        //this.mensajeGuardando()
        this._cuentasService.deleteCuentas(cuenta).subscribe(
          res => {
           this.messaggeDelete();
          },err => {alert("error")})
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }


  eliminarSubCuenta(e,subCuenta){
    Swal.fire({
      title: 'Eliminar Subcuenta',
      text: "Esta seguro que desea eliminar la subCuenta "+ subCuenta.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this._subCuentasService.deleteSubCuentas(subCuenta).subscribe(
          res => {
           this.messaggeDelete();
          },err => {alert("error")})
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
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



  mostrar(i:number){
    switch (i) {
      case 1:
       this.sectionCuentas = true;
       this.sectionSubCuentas = false;
       break;
  
      case 2:
         this.sectionCuentas = false;
       this.sectionSubCuentas = true;
        break;
      default:    
    }      
  }

}
