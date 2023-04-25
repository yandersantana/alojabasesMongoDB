import { Component, OnInit } from '@angular/core';
import { AuthenService } from 'src/app/servicios/authen.service';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import Swal from 'sweetalert2';
import { user } from '../user/user';
import { DescuentosService } from 'src/app/servicios/descuentos.service';
import { CodDescuento } from './descuentos';

@Component({
  selector: 'app-descuentos',
  templateUrl: './descuentos.component.html',
  styleUrls: ['./descuentos.component.scss']
})

export class DescuentoComponent implements OnInit {

  tipoRecibo = ""
  usuarioLogueado : user;
  mostrarBloqueo = true;
  mostrarLoading = false;
  mensajeLoading = "";

  codigoGenerado = "52369"

  constructor(
    public _authenService : AuthenService,
    public _contadoresService: ContadoresDocumentosService,
    public _descuentosService : DescuentosService
    ) {
   }

  ngOnInit() {
    this.cargarUsuarioLogueado();

  }

  cargarUsuarioLogueado() {
    var correo = "";
    new Promise((res, err) => {
      if (localStorage.getItem("maily") != '') 
        correo = localStorage.getItem("maily");
      
      this._authenService.getUserLogueado(correo)
        .subscribe(
          res => {
            this.usuarioLogueado = res as user;  
            this.mostrarPopupCodigo();
          },
          err => {}
        )
    });
  }


  generar(){
    this.codigoGenerado = (Math.floor(Math.random() * 90000) + 10000).toString();
    var codigoDescuento = new CodDescuento();
    codigoDescuento.codigo = this.codigoGenerado;
    codigoDescuento.generadoPor = this.usuarioLogueado.name;
    this._descuentosService.guardarCodigo(codigoDescuento).subscribe(
      (res) => {
        console.log("generado")
      },
      (err) => {}
    );
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
      if(this.usuarioLogueado[0].codigo == result.value){
        this.mostrarBloqueo = false;       
      }else{
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

  copiarTexto(){
    //this.clipboard.('Alphonso');
  }



}
