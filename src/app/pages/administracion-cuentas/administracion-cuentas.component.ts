import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Beneficiario, CentroCosto, Cuenta, CuentaBancaria, SubCuenta } from './administracion-cuenta';
import { CuentasService } from 'src/app/servicios/cuentas.service';
import { SubCuentasService } from 'src/app/servicios/subCuentas.service';
import { CentroCostoService } from 'src/app/servicios/centro-costo.service';
import { BeneficiarioService } from 'src/app/servicios/beneficiario.service';
import { CuentaBancariaService } from 'src/app/servicios/cuentaBancaria.service';
import { AuthenService } from 'src/app/servicios/authen.service';
import { user } from '../user/user';

@Component({
  selector: 'app-administracion-cuentas',
  templateUrl: './administracion-cuentas.component.html',
  styleUrls: ['./administracion-cuentas.component.scss']
})
export class AdministracionCuentasComponent implements OnInit {

  listaCuentas : Cuenta[]=[]
  listaCentroCosto : CentroCosto[]=[]
  listaBeneficiarios : Beneficiario[]=[]
  listaCuentasBancarias : CuentaBancaria[]=[]
  cuenta = {
    nombre:"",
    tipoCuenta:""
  }
  subCuenta = {
    nombre:"",
    mcaCajaMenor :true
  }
  centroCosto = {
    nombre:""
  }
  beneficiario = {
    nombre:""
  }

  cuentaBancaria = {
    nombre:"",
    numero:""
  }
  centroCsotos:CentroCosto[]=[]
  varDis:boolean=true
  bloqueoSubCuenta:boolean=true
  mostrarLoading : boolean = false;
  mensajeLoading = ""
  mostrarBloqueo = true;



  valueCuenta= "";
  cuentaPrueba:Cuenta[]=[]
  newCuenta:Cuenta
  newCuentaBancaria:CuentaBancaria
  newCentroCosto: CentroCosto
  newBeneficiario: Beneficiario
  popupVisible:boolean = false
  popupVisibleCuentaBancaria:boolean = false
  popupVisibleSubcuenta:boolean = false
  popupVisibleCosto:boolean = false
  popupVisibleBeneficiario:boolean = false
  sectionCuentas:boolean = true
  sectionSubCuentas:boolean = false
  sectionCostos:boolean = false
  sectionBeneficiarios:boolean = false
  sectionCuentasBancarias:boolean = false
  mcaCajaMenor:boolean = true

  newSubCuenta: SubCuenta
  idCuenta:string
  isNew:boolean = true;
  usuarioLogueado : user;

  menu1: string[] = ["Ingresos", "Salidas", "Reales y Transitorias"];

  constructor(
    public _cuentasService : CuentasService,
    public _subCuentasService : SubCuentasService,
    public _centroCostoService : CentroCostoService,
    public _beneficiariosService : BeneficiarioService,
    public _cuentaBancariaService : CuentaBancariaService,
    public _authenService : AuthenService
    ) {
   }

  ngOnInit() {
    this.cargarUsuarioLogueado();
    this.mensajeLoading = "Cargando datos..."
    this.traerListaCuentas()
  }

  cargarUsuarioLogueado() {
    var correo = "";
    new Promise((res, err) => {
      if (localStorage.getItem("maily") != '') 
        correo = localStorage.getItem("maily");

      this._authenService.getUserLogueado(correo).subscribe(
          res => {
            var usuario = res as user;
            this.usuarioLogueado = usuario[0];
            this.mostrarPopupCodigo();
          }
        )
    });
  }

   mostrarPopupCodigo(){
     Swal.fire({
      title: 'Código de Seguridad',
      allowOutsideClick: false,
      showCancelButton: false,
      inputAttributes: {
        autocapitalize: 'off'
      },
      confirmButtonText: 'Ingresar',
      input: 'password',
    }).then((result) => {
      if(this.usuarioLogueado.codigo == result.value)
          this.mostrarBloqueo = false;
        else  {
          Swal.fire({
            title: 'Error',
            text: 'El código ingresado no es el correcto',
            icon: 'error',
            confirmButtonText: 'Ok'
          }).then((result) => {
            this.mostrarPopupCodigo();
          })
        }
    })
  }


  onKey(value: string) {
    this.valueCuenta = value;
  }

  mostrarPopup(){
    this.popupVisible=true
    this.cuenta.nombre = "";
  }

  mostrarPopupSubCuenta(){
    this.isNew = true;
    this.popupVisibleSubcuenta=true
    this.subCuenta.nombre = "";
  }

  mostrarPopupCentroCosto(){
    this.popupVisibleCosto=true
    this.centroCosto.nombre = "";
  }

  mostrarPopupBeneficiarios(){
    this.popupVisibleBeneficiario=true
    this.beneficiario.nombre = "";
    this.isNew = true;
  }

  mostrarPopupCuentasBancarias(){
    this.popupVisibleCuentaBancaria=true
    this.cuentaBancaria.nombre = "";
    this.cuentaBancaria.numero = "";
  }
 
  traerListaCuentas(){
    this.mostrarLoading = true;
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
    this.mostrarLoading = false;
  }

  traerCuentasCostos(){
    this.mostrarLoading = true;
    this._centroCostoService.getCentrosCostos().subscribe(res => {
      this.listaCentroCosto = res as CentroCosto[];
      this.mostrarLoading = false;
   })
  }


  traerBeneficiarios(){
    this.mostrarLoading = true;
    this._beneficiariosService.getBeneficiarios().subscribe(res => {
      this.listaBeneficiarios = res as Beneficiario[];
      this.mostrarLoading = false;
   })
  }


  traerCuentasBancarias(){
    this.mostrarLoading = true;
    this._cuentaBancariaService.getCuentas().subscribe(res => {
      this.listaCuentasBancarias = res as CuentaBancaria[];
      this.mostrarLoading = false;
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

  correctoCostos(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se ha guardado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      this.traerCuentasCostos();
    })
  }

  correctoBeneficiarios(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se ha guardado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      this.traerBeneficiarios();
    })
  }

  correctoCuentasBancarias(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se ha guardado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      this.traerCuentasBancarias();
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

  messaggeDeleteCosto(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se ha eliminado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      this.traerCuentasCostos();
    })
  }

  messaggeDeleteBeneficiario(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se ha eliminado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      this.traerBeneficiarios();
    })
  }

  messaggeDeleteCuentaBancaria(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se ha eliminado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      this.traerCuentasBancarias();
    })
  }
  


   saveNewCuenta(){
    var existe = this.listaCuentas.find(element=> element.nombre == this.cuenta.nombre);
    if(!existe){
      this.popupVisible = false;
      this.newCuenta = new Cuenta();
      this.newCuenta.nombre = this.cuenta.nombre;
      this.newCuenta.tipoCuenta = this.cuenta.tipoCuenta;
      this.mensajeGuardando()
      new Promise<any>((resolve, reject) => {
        this._cuentasService.newCuenta(this.newCuenta).subscribe(
          res => {
            this.correcto()
          },
          err => {
             this.mostrarMensajeGenerico(2,"Revise e intente nuevamente")
          })
      })
    }else{
      this.popupVisible = false;
      this.mostrarMensajeGenerico(2,"El nombre de cuenta a crear ya existe");
    }
  } 


  saveNewSubCuenta(){
    this.popupVisibleSubcuenta = false;
    this.newSubCuenta  = new SubCuenta();
    this.newSubCuenta.idCuenta = this.idCuenta;
    this.newSubCuenta.nombre = this.subCuenta.nombre;
    this.newSubCuenta.mcaCajaMenor = this.subCuenta.mcaCajaMenor;
    this.mensajeGuardando()
    new Promise<any>((resolve, reject) => {
      this._subCuentasService.newSubCuenta(this.newSubCuenta).subscribe(
        res => { this.correcto() },
        err => { this.mostrarMensajeGenerico(2,"Revise e intente nuevamente") })
    })
  } 

  saveNewCentroCosto(){
    var existe = this.listaCentroCosto.find(element=> element.nombre == this.centroCosto.nombre);
    if(!existe){
      this.popupVisibleCosto = false;
      this.newCentroCosto = new CentroCosto();
      this.newCentroCosto.nombre = this.centroCosto.nombre;
      this.mensajeGuardando()
      new Promise<any>((resolve, reject) => {
        this._centroCostoService.newCentroCosto(this.newCentroCosto).subscribe(
          res => {this.correctoCostos()},
          err => {this.mostrarMensajeGenerico(2,"Error a guardar")})
      })
    }else{
      this.popupVisibleCosto = false;
      this.mostrarMensajeGenerico(2,"El nombre a crear ya existe")
    }
  } 


  saveNewBeneficiario(){
    var existe = this.listaBeneficiarios.find(element=> element.nombre == this.centroCosto.nombre);
    if(!existe){
      this.popupVisibleBeneficiario = false;
      this.newBeneficiario = new Beneficiario();
      this.newBeneficiario.nombre = this.beneficiario.nombre;
      this.mensajeGuardando()
      new Promise<any>((resolve, reject) => {
        this._beneficiariosService.newBeneficiario(this.newBeneficiario).subscribe(
          res => {this.correctoBeneficiarios()},
          err => {this.mostrarMensajeGenerico(2,"Error a guardar")})
      })
    }else{
      this.popupVisibleBeneficiario = false;
      this.mostrarMensajeGenerico(2,"El nombre a crear ya existe")
    }
  } 


  saveNewCuentaBancaria(){
    var existe = this.listaCuentasBancarias.find(element=> element.nombre == this.cuenta.nombre);
    if(!existe){
      this.popupVisibleCuentaBancaria = false;
      this.newCuentaBancaria = new CuentaBancaria();
      this.newCuentaBancaria.nombre = this.cuentaBancaria.nombre;
      this.newCuentaBancaria.numero = this.cuentaBancaria.numero;
      this.mensajeGuardando()
      new Promise<any>((resolve, reject) => {
        this._cuentaBancariaService.newCuenta(this.newCuentaBancaria).subscribe(
          res => {
            this.correctoCuentasBancarias()
          },
          err => {
             this.mostrarMensajeGenerico(2,"Revise e intente nuevamente")
          })
      })
    }else{
      this.popupVisible = false;
      this.mostrarMensajeGenerico(2,"El nombre de cuenta a crear ya existe");
    }
  } 


  guardar(e,cuenta){
    this.cuenta = cuenta;
    this.popupVisible = true;
    this.isNew = false;
  }

  guardarSubCuenta(e,subCuenta){
    this.subCuenta = subCuenta;
    this.popupVisibleSubcuenta = true;
    this.isNew = false;
  }

  guardarCuentaBancaria(e,cuenta){
    this.cuentaBancaria = cuenta;
    this.popupVisibleCuentaBancaria = true;
    this.isNew = false;
  }

  actualizaDetalleCosto(e,centroCosto){
    this.centroCosto = centroCosto;
    this.popupVisibleCosto = true;
    this.isNew = false;
  }

  actualizaBeneficiario(e,beneficiario){
    this.beneficiario = beneficiario;
    this.popupVisibleBeneficiario = true;
    this.isNew = false;
  }

  actualizarCuenta(){
    this.mensajeGuardando()
    new Promise<any>((resolve, reject) => {
      this._cuentasService.updateCuentas(this.cuenta).subscribe(
        res => {
          this.popupVisible = false;
          this.correcto()
        },
        err => {
          this.mostrarMensajeGenerico(2,"Revise e intente nuevamente");
        })
    })
  }

  actualizarCuentaBancaria(){
    this.mensajeGuardando()
    new Promise<any>((resolve, reject) => {
      this._cuentaBancariaService.updateCuentas(this.cuentaBancaria).subscribe(
        res => {
          this.popupVisibleCuentaBancaria = false;
          this.correctoCuentasBancarias()
        },
        err => {
          this.mostrarMensajeGenerico(2,"Revise e intente nuevamente");
        })
    })
  }

  actualizarDetalleCosto(){
    this.mensajeGuardando()
    new Promise<any>((resolve, reject) => {
      this._centroCostoService.updateCentroCosto(this.centroCosto).subscribe(
        res => {
          this.popupVisibleCosto = false;
          this.correctoCostos();
        },
        err => {
          this.mostrarMensajeGenerico(2,"Revise e intente nuevamente")
        })
    })
  }


  actualizarBeneficiario(){
    this.mensajeGuardando()
    new Promise<any>((resolve, reject) => {
      this._beneficiariosService.updateBeneficiario(this.beneficiario).subscribe(
        res => {
          this.popupVisibleBeneficiario = false;
          this.correctoBeneficiarios();
        },
        err => {
          this.mostrarMensajeGenerico(2,"Revise e intente nuevamente")
        })
    })
  }


  actualizarSubCuenta(e,subCuenta){
    this.popupVisibleSubcuenta = false;
    this.mensajeGuardando()
    new Promise<any>((resolve, reject) => {
      this._subCuentasService.updateSubCuentas(subCuenta).subscribe(
        res => { this.correcto()},
        err => { this.mostrarMensajeGenerico(2,"Revise e intente nuevamente")})
    })

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
         this.mostrarMensajeGenerico(2,"Se ha cancelado su proceso.")
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
         this.mostrarMensajeGenerico(2,"Se ha cancelado su proceso.");
      }
    })
  }

  eliminarDetalleCosto(e,detalleCosto){
    Swal.fire({
      title: 'Eliminar Cuenta',
      text: "Esta seguro que desea eliminar "+ detalleCosto.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this._centroCostoService.deleteCentroCpsto(detalleCosto).subscribe(
          res => {
           this.messaggeDeleteCosto();
          },err => {alert("error")})
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.mostrarMensajeGenerico(2,"Se ha cancelado su proceso.");
      }
    })
  }


  eliminarBeneficiario(e,beneficiario){
    Swal.fire({
      title: 'Eliminar Beneficiario',
      text: "Esta seguro que desea eliminar "+ beneficiario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this._beneficiariosService.deleteBeneficiario(beneficiario).subscribe(
          res => {
           this.messaggeDeleteBeneficiario();
          },err => {alert("error")})
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.mostrarMensajeGenerico(2,"Se ha cancelado su proceso.");
      }
    })
  }


  eliminarCuentaBancaria(e,cuenta){
    Swal.fire({
      title: 'Eliminar Cuenta',
      text: "Esta seguro que desea eliminar el nombre de cuenta "+ cuenta.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this._cuentaBancariaService.deleteCuentas(cuenta).subscribe(
          res => {
           this.messaggeDeleteCuentaBancaria();
          },err => {alert("error")})
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
         this.mostrarMensajeGenerico(2,"Se ha cancelado su proceso.")
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
        this.sectionCostos = false;
        this.sectionBeneficiarios = false;
        this.sectionCuentasBancarias = false;
        break;
  
      case 2:
        this.sectionCuentas = false;
        this.sectionSubCuentas = true;
        this.sectionCostos = false;
        this.sectionBeneficiarios = false;
        this.sectionCuentasBancarias = false;
        break;

      case 3:
        this.sectionCuentas = false;
        this.sectionSubCuentas = false;
        this.sectionCostos = true;
        this.sectionBeneficiarios = false;
        this.sectionCuentasBancarias = false;
        if(this.listaCentroCosto.length == 0)
            this.traerCuentasCostos();
        break;

      case 4:
        this.sectionCuentas = false;
        this.sectionSubCuentas = false;
        this.sectionCostos = false;
        this.sectionBeneficiarios = true;
        this.sectionCuentasBancarias = false;
        if(this.listaBeneficiarios.length == 0)
            this.traerBeneficiarios();
        break;

      case 5:
        this.sectionCuentas = false;
        this.sectionSubCuentas = false;
        this.sectionCostos = false;
        this.sectionBeneficiarios = false;
        this.sectionCuentasBancarias = true;
        if(this.listaCuentasBancarias.length == 0)
            this.traerCuentasBancarias();
        break;
      default:    
    }      
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
