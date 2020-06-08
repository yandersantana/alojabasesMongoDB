import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { sucursal } from '../ventas/venta';
import { Sucursal } from '../compras/compra';
import Swal from 'sweetalert2';
import { parametrizacionsuc } from './parametrizacion';
import { element } from 'protractor';

@Component({
  selector: 'app-parametrizacion',
  templateUrl: './parametrizacion.component.html',
  styleUrls: ['./parametrizacion.component.scss']
})
export class ParametrizacionComponent implements OnInit {

  locales:Sucursal[]=[]
  parametroSuc = {
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
  
  constructor(private db: AngularFirestore, public  afAuth:  AngularFireAuth) {
    this.parametroSuc.sucursal="Milagro"
   }

  ngOnInit() {
    this.db.collection('/locales').snapshotChanges().subscribe((locales) => {
      this.locales = []
      locales.forEach((nt: any) => {
        this.locales.push(nt.payload.doc.data());
      })
    });;

    this.getParametrizaciones()
  }

  getParametrizaciones(){
    this.db.collection('/parametrizacionSucursales').snapshotChanges().subscribe((locales) => {
      new Promise<any>((resolve, reject) => {
        locales.forEach((nt: any) => {
          this.parametrizacionesData.push(nt.payload.doc.data());
        })
      })
      this.obtenerData()
    })
  }

  desbloquear(){

    if(this.varDis){
      this.varDis=false
    }else{
      this.varDis=true
    }
  }

  getParametrizaciones2(){
    this.db.collection('/parametrizacionSucursales').snapshotChanges().subscribe((locales) => {
      new Promise<any>((resolve, reject) => {
        locales.forEach((nt: any) => {
          this.parametrizacionesData.push(nt.payload.doc.data());
        })
      })
      
    })
  }

  obtenerData(){
    var cont=0
    this.getParametrizaciones2()
    //this.getParametrizaciones()
    //console.log("entre a cargar "+sucursal +this.parametrizaciones.length)
    this.parametrizacionesData.forEach(element=>{
      console.log("para "+JSON.stringify(element))
      if(element.sucursal == "Milagro"){
        cont++
        this.parametroSuc = element
        console.log("encontre "+JSON.stringify(element))
        console.log("sume "+cont)

      }
    })
  }

  obtenerData2(){
    var cont=0
 this.getParametrizaciones2()
    this.parametrizacionesData.forEach(element=>{
      console.log("para "+JSON.stringify(element))
      if(element.sucursal == "Naranjito"){
        cont++
        this.parametroSuc = element
        console.log("encontre "+JSON.stringify(element))
        console.log("sume "+cont)

      }
    })
  }

  obtenerData3(){
    var cont=0
    this.getParametrizaciones2()
    console.log("entre a cargar "+sucursal +this.parametrizacionesData.length)
    this.parametrizacionesData.forEach(element=>{
      console.log("para "+JSON.stringify(element))
      if(element.sucursal == "El Triunfo"){
        cont++
        this.parametroSuc = element
        console.log("encontre "+JSON.stringify(element))
        console.log("sume "+cont)

      }
    })
  }


  newParametrizacion(){
    console.log("kjkjl "+JSON.stringify(this.parametroSuc))
    if(this.parametroSuc.direccion!="" && this.parametroSuc.fecha!= "" && this.parametroSuc.inicio!=0 && this.parametroSuc.fin!=0 && this.parametroSuc.razon_social!=""
    && this.parametroSuc.ruc!="" && this.parametroSuc.sri!="" && this.parametroSuc.telefonos!=""){
      this.mensajeGuardando()
      var sucurs= this.parametroSuc.sucursal
      new Promise<any>((resolve, reject) => {
        this.db.collection('/parametrizacionSucursales').doc(sucurs).set({...Object.assign({},this.parametroSuc )}).then(res => {
        Swal.close()
        Swal.fire({
          title: 'Proceso guardado',
          text: 'Se ha guardado con éxito',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
        })
         }, err => reject(err));
      })
    }else{
      Swal.fire({
        title: 'Error',
        text: 'Hay campos vacios',
        icon: 'error'
      })
    }
    
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
        this.parametroSuc.sucursal="Milagro";
        x.style.display = "block";
        y.style.display="none";
        z.style.display="none";
        this.obtenerData()
       break;
  
      case 2:
        this.parametroSuc.sucursal="Naranjito";
        x.style.display = "none";
        y.style.display="block";
        z.style.display="none";
        this.obtenerData2()
        break;

      case 3:
        this.parametroSuc.sucursal="El Triunfo";
        x.style.display = "none";
        y.style.display="none";
        z.style.display="block";
        this.obtenerData3()
        break;
      default:    
    }      
  }

}
