import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertsService } from 'angular-alert-module';
import { productosPendientesEntrega, producto, contadoresDocumentos } from '../ventas/venta';
import { entregaProductos, documentoGenerado } from './entrega';
import pdfMake from 'pdfmake/build/pdfmake';
import Swal from 'sweetalert2';
import { element } from 'protractor';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { ProductosPendientesService } from 'src/app/servicios/productos-pendientes.service';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { ProductosEntregadosService } from 'src/app/servicios/productos-entregados.service';
import { DocumentoGeneradoEntregaService } from 'src/app/servicios/documento-generado-entrega.service';

@Component({
  selector: 'app-entregas-p',
  templateUrl: './entregas-p.component.html',
  styleUrls: ['./entregas-p.component.scss']
})
export class EntregasPComponent implements OnInit {
  productoLeido: productosPendientesEntrega
  productosPendientes: productosPendientesEntrega[]=[]
  productosPendientesNoEN: productosPendientesEntrega[]=[]
  productosPendientesEntregados: productosPendientesEntrega[]=[]
  popupvisible:boolean=false
  popupvisible2:boolean=false
  numeroFactura:string=""
  entDir:boolean=false
  titulo:string=""
  cantidadEntCajas=0
  cantidadEntPiezas=0
  cantidadEntM2=0
  btDesc:boolean=false
  contm2=0
  cajasP=0
  cajasP2=0
  piezasP=0
  piezasP2=0
  restam2=0
  number_transaccionEnt:number=0
  productoL:producto
  productos:producto[]=[]

  datoDocumento:number=0

  menuDocumento: string[] = [
    "Factura",
    "Nota de Venta"
  ];

  menu1: string[] = [
    "Productos Pendientes",
    "Productos Entregados",
    "Historial de Entregas",
    "Documento por Facturas"
  ];

  entregaProducto: entregaProductos
  productosEntregasSuc:entregaProductos[]=[]
  productosEntregasSuc2:entregaProductos[]=[]
  productosEntregasSuc3:entregaProductos[]=[]
  parametrizaciones:parametrizacionsuc[]=[]
  documentoG:documentoGenerado
  idDoc:number=0
  observaciones:string=""
  parametrizacionSucu:parametrizacionsuc
  docEntregas:documentoGenerado[]=[]
  docEntregasRealizadas:documentoGenerado[]=[]
  docEntregasPendientes:documentoGenerado[]=[]
  docEntregasEliminadas:documentoGenerado[]=[]
  contadores:contadoresDocumentos[]=[]
  constructor(public parametrizacionService:ParametrizacionesService,public documentoGeneradoService:DocumentoGeneradoEntregaService,
    public productosEntregadosService:ProductosEntregadosService, public contadoresService:ContadoresDocumentosService, public productosPendientesService: ProductosPendientesService, public productoService:ProductoService ) {
    this.entregaProducto = new entregaProductos
    this.documentoG = new documentoGenerado
   }

  ngOnInit() {
   /*  this.getProductosPendientes()
    this.getProductos()
    this.getProductosEntregados()
    this.getIDEntregas()
    this.getParametrizaciones()
    this.getDocumentog()
    this.getEntregasDoc() */
    this.traerContadoresDocumentos()
    this.traerProductos()
    this.traerProductosEntregados()
    this.traerParametrizaciones()
    this.traerProductosPendientesEntrega()
    this.traerDocumentoGenerado()
  }

  traerParametrizaciones(){
    this.parametrizacionService.getParametrizacion().subscribe(res => {
      this.parametrizaciones = res as parametrizacionsuc[];
   })
  }

  traerProductos(){
    this.productoService.getProducto().subscribe(res => {
      this.productos = res as producto[];
   })
  }

  traerProductosPendientesEntrega(){
    this.productosPendientesService.getProductoPendiente().subscribe(res => {
      this.productosPendientes = res as productosPendientesEntrega[];
      this.separarEntregas()
   })
  }

  traerProductosEntregados(){
    this.productosEntregadosService.getProductosEntregados().subscribe(res => {
      this.productosEntregasSuc = res as entregaProductos[];
   })
  }

  traerDocumentoGenerado(){
    this.documentoGeneradoService.getDocumentoGenerado().subscribe(res => {
      this.docEntregas = res as documentoGenerado[];
      this.asignarValores()
   })
  }

  traerContadoresDocumentos(){
    this.contadoresService.getContadores().subscribe(res => {
        this.contadores = res as contadoresDocumentos[];
        this.asignarIDdocumentos()
     })
  }
  
  asignarIDdocumentos(){
    this.number_transaccionEnt=this.contadores[0].contProductosEntregadosSucursal_Ndocumento+1
    this.idDoc=this.contadores[0].contDocumentoEntrega_Ndocumento+1
   // this.Id_remision=this.contadores[0].contRemisiones_Ndocumento+1
  }


 /*  async getProductos() {
    //REVISAR OPTIMIZACION
    await this.db.collection('productos').snapshotChanges().subscribe((productos) => {
      this.productos = []
      productos.forEach((nt: any) => {
        this.productos.push(nt.payload.doc.data());
      })
    });;
  } */

 /*  async getProductosPendientes() {
    await this.db.collection('productosPendientesEntrega').snapshotChanges().subscribe((productos) => {
      new Promise<any>((resolve, reject) => {
        productos.forEach((nt: any) => {
          this.productosPendientes.push(nt.payload.doc.data());
        })
      }) 
      this.separarEntregas()
    });;
  } */

 /*  async getProductosEntregados() {
    await this.db.collection('productosEntregadosSucursal').snapshotChanges().subscribe((productos) => {
      new Promise<any>((resolve, reject) => {
        productos.forEach((nt: any) => {
          this.productosEntregasSuc.push(nt.payload.doc.data());
        })
      }) 
    });;
  } */

 /*  async getIDEntregas() {
    
    await this.db.collection('productosEntregadosSucursalID').doc('matriz').snapshotChanges().subscribe((transacciones) => {
      console.log(transacciones.payload.data())
      this.number_transaccionEnt = transacciones.payload.data()['documento_n']+1;    
    });;
  } */

  /* async getDocumentog() {
    console.log("dnnnndte")
    await this.db.collection('documentoEntregaID').doc('matriz').snapshotChanges().subscribe((transacciones) => {
      console.log(transacciones.payload.data())
      this.idDoc = transacciones.payload.data()['documento_n']+1;    
      console.log("el documen "+this.idDoc)
    });;
  } */

  /* getParametrizaciones(){
    this.db.collection('/parametrizacionSucursales').valueChanges().subscribe((data:parametrizacionsuc[]) => {
      if(data != null)
        this.parametrizaciones = data

    })
  } */

  /* getEntregasDoc(){
    this.db.collection('/documentoEntrega').valueChanges().subscribe((data:documentoGenerado[]) => {
      if(data != null)
        this.docEntregas = data

    })
  } */

 /*  async getEntregasDoc() {
    
    await this.db.collection('documentoEntrega').snapshotChanges().subscribe((traslados) => {
      new Promise<any>((resolve, reject) => {
        traslados.forEach((nt: any) => {
          this.docEntregas.push(nt.payload.doc.data());
        })
      }) 
    this.asignarValores()
    });;
  } */

  separarEntregas(){
    this.productosPendientes.forEach(element=>{
      if(element.estado == "PENDIENTE"){
          this.productosPendientesNoEN.push(element)
      }else{
        this.productosPendientesEntregados.push(element)
      }
    })
  }


  asignarValores(){
    this.docEntregas.forEach(element=>{
      console.log(JSON.stringify(element))
      if(element.estado=="PENDIENTE"){
        this.docEntregasPendientes.push(element)
      }else if(element.estado=="ENTREGADO"){
        this.docEntregasRealizadas.push(element)
      }else if(element.estado=="ELIMINADO"){
        this.docEntregasEliminadas.push(element)
      }
    })
  }


  verEntrega(){
    var x = document.getElementById("ent");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  calcularEquivalencia(producto: producto){
    this.cantidadEntM2= ((producto.M2*this.cantidadEntCajas)+(this.cantidadEntPiezas*producto.M2/producto.P_CAJA))
    console.log("2222 "+this.cantidadEntM2)
    console.log("2222333 "+this.entregaProducto.productoPorEntregar.cantM2)
    if(this.cantidadEntM2 >this.entregaProducto.productoPorEntregar.cantM2){
      Swal.fire({
        title: 'Error',
        text: 'Excede la cantidad indicada',
        icon: 'error'
      })
      this.cantidadEntCajas=0
      this.cantidadEntPiezas=0
      this.cantidadEntM2=0
      this.btDesc=true
      this.popupvisible=false
    }else{
      this.btDesc=false
    }
  }

  totalPiezasEntregar(){
    var totalPiezasEntregar=0
    totalPiezasEntregar= (this.entregaProducto.cajas* this.entregaProducto.productoPorEntregar.producto.P_CAJA) +this.entregaProducto.piezas
  }

  guardarEntrega(e){
    var totalPiezas=0
    var totalPiezasEntregar=0
  
    this.entregaProducto.identrega= this.number_transaccionEnt
    this.entregaProducto.cajas=this.cantidadEntCajas
    this.entregaProducto.piezas=this.cantidadEntPiezas
    this.entregaProducto.m2=this.cantidadEntM2

   
    totalPiezasEntregar= (this.entregaProducto.productoPorEntregar.cajas* this.entregaProducto.productoPorEntregar.producto.P_CAJA) +this.entregaProducto.productoPorEntregar.piezas
    var contM2t=this.entregaProducto.productoPorEntregar.cantM2-this.entregaProducto.m2
    this.cajasP2=Math.trunc(contM2t / this.entregaProducto.productoPorEntregar.producto.M2);
    this.piezasP2=Math.trunc(contM2t * this.entregaProducto.productoPorEntregar.producto.P_CAJA /this.entregaProducto.productoPorEntregar.producto.M2 ) - (this.cajasP2* this.entregaProducto.productoPorEntregar.producto.P_CAJA);
    totalPiezas= (this.cajasP*this.entregaProducto.productoPorEntregar.producto.P_CAJA)+this.piezasP
    this.restam2= this.entregaProducto.productoPorEntregar.cantM2 - this.entregaProducto.m2
   
     console.log("Tengo que entregar en piezas "+totalPiezasEntregar)
     console.log("voy a total piezas "+totalPiezas)
     console.log("me quedan a entregar en m2" + this.restam2)
     console.log("me quedan a entregar "+this.cajasP)
     console.log("me quedan a entregar piezas "+this.piezasP)
  
    this.productos.forEach(element=>{
      if(element.PRODUCTO == this.entregaProducto.productoPorEntregar.producto.PRODUCTO ){
       this.productoL= element
      // console.log("entregue aquiii "+JSON.stringify(this.productoL))
      }
    })
    switch (this.entregaProducto.productoPorEntregar.sucursal) {
      case "matriz":
        if(this.productoL.sucursal1>=contM2t){
          this.autorizarEntrega()
        }else{
          this.popupvisible=false
          Swal.fire({
            title: 'Error',
            text: 'No hay producto suficiente',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        }
        break;
      case "sucursal1":
        if(this.productoL.sucursal2>=contM2t){
          this.autorizarEntrega()
        }else{
          this.popupvisible=false
          Swal.fire({
            title: 'Error',
            text: 'No hay producto suficiente',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        }
        break;
      case "sucursal2":
        if(this.productoL.sucursal3>=contM2t){
          this.autorizarEntrega()
        }else{
          this.popupvisible=false
          Swal.fire({
            title: 'Error',
            text: 'No hay producto suficiente',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        }
        break;
      default:  
   }
  }

  guardarEntregaDirecta(e){
    this.entregaProducto.identrega= this.number_transaccionEnt
    this.entregaProducto.cajas=this.entregaProducto.productoPorEntregar.cajas
    this.entregaProducto.piezas=this.entregaProducto.productoPorEntregar.piezas
    this.entregaProducto.m2=this.entregaProducto.productoPorEntregar.cantM2
  
    this.productos.forEach(element=>{
      if(element.PRODUCTO == this.entregaProducto.productoPorEntregar.producto.PRODUCTO ){
       this.productoL= element
      }
    })

    switch (this.entregaProducto.productoPorEntregar.sucursal) {
      case "matriz":
        if(this.productoL.sucursal1>=this.entregaProducto.m2){
          this.autorizarEntrega2()
        }else{
          this.popupvisible=false
          Swal.fire({
            title: 'Error',
            text: 'No hay producto suficiente',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        }
        break;
      case "sucursal1":
        if(this.productoL.sucursal2>=this.entregaProducto.m2){
          this.autorizarEntrega2()
        }else{
          this.popupvisible=false
          Swal.fire({
            title: 'Error',
            text: 'No hay producto suficiente',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        }
        break;
      case "sucursal2":
        if(this.productoL.sucursal3>=this.entregaProducto.m2){
          this.autorizarEntrega2()
        }else{
          this.popupvisible=false
          Swal.fire({
            title: 'Error',
            text: 'No hay producto suficiente',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        }
        break;
      default: 
    
    //his.db.collection('/productos').doc(element.producto.PRODUCTO).update({"cantidad" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));   
   }
  }


  opcionMenu(e){
    
    var x = document.getElementById("pendientes");
    var y = document.getElementById("entregados");
    var z = document.getElementById("historial");
    var z2 = document.getElementById("entrega");
    switch (e.value) {
      case "Productos Pendientes":
        x.style.display = "block";
        y.style.display="none";
        z.style.display="none";
        z2.style.display="none";
       break;
  
      case "Productos Entregados":
        x.style.display = "none";
        y.style.display="block";
        z.style.display="none";
        z2.style.display="none";
        break;

      case "Historial de Entregas":
        x.style.display = "none";
        y.style.display="none";
        z.style.display="block";
        z2.style.display="none";
        break;
        
      case "Documento por Facturas":
        x.style.display = "none";
        y.style.display="none";
        z.style.display="none";
        z2.style.display="block";
        break;
      default:    
    }     
  }

  

  obtenerDocumento(e){
    this.documentoG.tipoDocumento=e.value
    this.limpiarArreglo()
      this.productosEntregasSuc.forEach(element=>{
        if(element.productoPorEntregar.documento == this.datoDocumento && element.productoPorEntregar.tipo_documento == e.value && element.estado=="ENTREGADO"){
          element.m2= parseInt(element.m2.toFixed(2))
          this.productosEntregasSuc2.push(element)
        }
      })

      if(this.productosEntregasSuc2.length==0){
        Swal.fire({
          title: 'Error',
          text: 'No se encontró el documento',
          icon: 'error'
        })
      }

      console.log("ssss "+JSON.stringify(this.productosEntregasSuc2))
  }

  generarDocumento(){
    this.parametrizaciones.forEach(element=>{
      if(element.sucursal == this.productosEntregasSuc2[0].productoPorEntregar.sucursal){
        this.parametrizacionSucu= element
      }
    })
   
    this.documentoG.Ndocumento = this.idDoc
    this.documentoG.idDocumento = this.datoDocumento
    this.documentoG.fecha= this.productosEntregasSuc2[0].fecha
    this.documentoG.fechaEntrega= new Date().toLocaleString()
    this.documentoG.arreEntregas= this.productosEntregasSuc2
    this.documentoG.observaciones= this.observaciones
    this.setearNFactura()
    new Promise<any>((resolve, reject) => {
      this.mostrarMensaje()
       /*  this.db.collection("/documentoEntrega").doc(this.idDoc+"").set({ ...Object.assign({}, this.documentoG)})
        .then(resolve => {this.crearPDF3()}, err => reject(err));
        this.db.collection('/documentoEntregaID').doc("matriz").update({"documento_n" :this.idDoc}); */   

        this.documentoGeneradoService.newDocumentoGenerado(this.documentoG).subscribe( res => {
          this.contadores[0].contDocumentoEntrega_Ndocumento=this.idDoc
          this.contadoresService.updateContadoresIDDocumentoGenerado(this.contadores[0]).subscribe( res => {},err => {})
        },err => {})
       
    })
    
  }


  autorizarEntrega(){
    this.setearNFactura()
    this.productosEntregasSuc3.push(this.entregaProducto)
    var cont=Number(this.entregaProducto.productoPorEntregar.id_Pedido)
    new Promise<any>((resolve, reject) => {
      this.mostrarMensaje()
      if(this.cajasP2== 0 && this.piezasP2 == 0){
        this.actualizarPendientes()
        this.entregaProducto.productoPorEntregar.estado="ENTREGADO"
        this.entregaProducto.productoPorEntregar.cajas=this.cajasP2
        this.entregaProducto.productoPorEntregar.piezas=this.piezasP2
        this.entregaProducto.productoPorEntregar.cantM2=0
        this.entregaProducto.productoPorEntregar.cajasEntregadas=this.productoLeido.cajas
        this.entregaProducto.productoPorEntregar.piezasEntregadas=this.productoLeido.piezas
        this.entregaProducto.productoPorEntregar.m2Entregados=this.productoLeido.cantM2
        this.productosPendientesService.updateProductoPendiente(this.entregaProducto.productoPorEntregar).subscribe( res => {},err => {})
      this.productosEntregadosService.newProductoEntregado(this.entregaProducto).subscribe( res => {
        this.actualizarPendientes(),
        this.contadores[0].contProductosEntregadosSucursal_Ndocumento=this.number_transaccionEnt
        this.contadoresService.updateContadoresIDProductosEntregados(this.contadores[0]).subscribe( res => { },err => {})
      },err => {})
       /* this.db.collection('/productosPendientesEntrega').doc(cont+"").update({"estado":"ENTREGADO", "cajas":this.cajasP2 , "piezas":this.piezasP2 , "cantM2":0 , "cajasEntregadas":this.productoLeido.cajas,
      "piezasEntregadas":this.productoLeido.piezas, "m2Entregados":this.productoLeido.cantM2}) */
        /* this.db.collection("/productosEntregadosSucursal").doc(this.number_transaccionEnt+"").set({ ...Object.assign({}, this.entregaProducto)})
        .then(resolve => {this.actualizarPendientes()}, err => reject(err));  */  
        //this.db.collection('/productosEntregadosSucursalID').doc("matriz").update({"documento_n" :this.number_transaccionEnt});  
      }else{
        this.entregaProducto.productoPorEntregar.cajas=this.cajasP2
        this.entregaProducto.productoPorEntregar.piezas=this.piezasP2
        this.entregaProducto.productoPorEntregar.cantM2=this.restam2
        this.entregaProducto.productoPorEntregar.cajasEntregadas=this.productoLeido.cajas
        this.entregaProducto.productoPorEntregar.piezasEntregadas=this.productoLeido.piezas
        this.entregaProducto.productoPorEntregar.m2Entregados=this.productoLeido.cantM2
        this.productosPendientesService.updateProductoPendiente(this.entregaProducto).subscribe( res => {},err => {})
      this.productosEntregadosService.newProductoEntregado(this.entregaProducto).subscribe( res => {
        this.actualizarPendientes(),
        this.contadores[0].contProductosEntregadosSucursal_Ndocumento=this.number_transaccionEnt
        this.contadoresService.updateContadoresIDProductosEntregados(this.contadores[0]).subscribe( res => { },err => {})
      },err => {})
        
        /* this.db.collection('/productosPendientesEntrega').doc(cont+"").update({"cajas":this.cajasP2 , "piezas":this.piezasP2 , "cantM2":this.restam2 , "cajasEntregadas":this.productoLeido.cajas,
        "piezasEntregadas":this.productoLeido.piezas, "m2Entregados":this.productoLeido.cantM2})
        this.db.collection("/productosEntregadosSucursal").doc(this.number_transaccionEnt+"").set({ ...Object.assign({}, this.entregaProducto)})
        .then(resolve => {this.actualizarPendientes()}, err => reject(err));   
        this.db.collection('/productosEntregadosSucursalID').doc("matriz").update({"documento_n" :this.number_transaccionEnt}); */   
      }  
    })
  }

  actualizarPendientes(){
    var resta=0
   // resta=this.entregaProducto.m2-
    this.productos.forEach(element=>{
        if(element.PRODUCTO == this.entregaProducto.productoPorEntregar.producto.PRODUCTO){
          switch (this.entregaProducto.productoPorEntregar.sucursal) {
            case "matriz":
              resta=element.suc1Pendiente-this.entregaProducto.m2
              this.productoService.updateProductoPendienteSucursal1(element,resta).subscribe( res => { },err => {})
             // this.db.collection('/productos').doc(element.PRODUCTO).update({"suc1Pendiente" :resta});
              break;
            case "sucursal1":
              resta=element.suc2Pendiente-this.entregaProducto.m2
              this.productoService.updateProductoPendienteSucursal2(element,resta).subscribe( res => { },err => {})
              //this.db.collection('/productos').doc(element.PRODUCTO).update({"suc2Pendiente" :resta});
              break;
            case "sucursal2":
              resta=element.suc3Pendiente-this.entregaProducto.m2
              this.productoService.updateProductoPendienteSucursal3(element,resta).subscribe( res => { },err => {})
              //this.db.collection('/productos').doc(element.PRODUCTO).update({"suc3Pendiente" :resta});
              break;
            default:  
         }
        
        }
    })
    this.mensajeConf()
  }

  autorizarEntrega2(){
    this.setearNFactura()
    this.productosEntregasSuc3.push(this.entregaProducto)
    var cont=Number(this.entregaProducto.productoPorEntregar.id_Pedido)
    console.log("entre a a ctualizar el "+cont)
    new Promise<any>((resolve, reject) => {
      this.mostrarMensaje()
      this.entregaProducto.productoPorEntregar.estado="ENTREGADO"
      this.entregaProducto.productoPorEntregar.cajas=0
      this.entregaProducto.productoPorEntregar.piezas=0
      this.entregaProducto.productoPorEntregar.cantM2=0
      this.entregaProducto.productoPorEntregar.cajasEntregadas=this.productoLeido.cajas
      this.entregaProducto.productoPorEntregar.piezasEntregadas=this.productoLeido.piezas
      this.entregaProducto.productoPorEntregar.m2Entregados=this.productoLeido.cantM2
      this.productosPendientesService.updateProductoPendiente(this.entregaProducto).subscribe( res => {},err => {})
    this.productosEntregadosService.newProductoEntregado(this.entregaProducto).subscribe( res => {
      this.actualizarPendientes(),
      this.contadores[0].contProductosEntregadosSucursal_Ndocumento=this.number_transaccionEnt
      this.contadoresService.updateContadoresIDProductosEntregados(this.contadores[0]).subscribe( res => { },err => {})
    },err => {})
      


       /*  this.db.collection('/productosPendientesEntrega').doc(cont+"").update({"estado":"ENTREGADO", "cajas":0 , "piezas":0 , "cantM2":0, "cajasEntregadas":this.productoLeido.cajas,
        "piezasEntregadas":this.productoLeido.piezas, "m2Entregados":this.productoLeido.cantM2})
        this.db.collection("/productosEntregadosSucursal").doc(this.number_transaccionEnt+"").set({ ...Object.assign({}, this.entregaProducto)})
        .then(resolve => {this.actualizarPendientes()}, err => reject(err));
        this.db.collection('/productosEntregadosSucursalID').doc("matriz").update({"documento_n" :this.number_transaccionEnt}); */   
       
    })
  }

  guardado(){
    Swal.close()
    Swal.fire({
      title: 'Correcto',
      text: 'Se guardó con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }

  
  mostrarMensaje(){
    this.popupvisible=false
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
              const b = content.querySelector('b')
              
            }
          }, 100)
        },
        onClose: () => {
          clearInterval(timerInterval)
        }
      })
  }


  getCourseFile = (e) => {  
    this.mostrarPopup(e.row.data)  
  }

  getCourseFile2 = (e) => {  
    this.mostrarPopup2(e.row.data)  
  }

  getCourseFile3= (e) => {  
    this.cargarDatos2(e.row.data)  
  }

  getCourseFile4= (e) => {  
    this.actualizarEntrega(e.row.data)  
  }

  getCourseFile5= (e) => {  
    this.rechazarEliminacion(e.row.data)  
  }

  getCourseFile6= (e) => {  
    this.eliminarDocumento(e.row.data)  
  }


  cargarDatos(e:any){
    this.limpiarArreglo2()
    this.productosEntregasSuc.forEach(element=>{
      if(element.identrega == e.identrega){
        this.productoLeido = element.productoPorEntregar
        this.entregaProducto.identrega = element.identrega
        this.entregaProducto.fecha= element.fecha
        this.productosEntregasSuc3.push(element)
        this.buscarDatosSucursal()
        this.crearPDF2()
      }
    })
  }

  cargarDatos2(e:any){
    this.limpiarArreglo2()
    this.docEntregas.forEach(element=>{
      if(element.Ndocumento == e.Ndocumento){
        this.documentoG = element
        this.productosEntregasSuc2 = element.arreEntregas
        this.buscarDatosSucursal()
        this.crearPDF2()
      }
    })
  }

  

  actualizarEntrega(e){
    Swal.fire({
      title: 'Anular entrega',
      text: "Se anulará la entrega de productos #"+e.Ndocumento,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.documentoGeneradoService.updateEstado(e,"PENDIENTE").subscribe( res => {Swal.fire({
          title: 'Correcto',
          text: 'Un administrador aprobará su solicitud',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
        }) },err => {})

       /*  this.db.collection('/documentoEntrega').doc(e.Ndocumento+"").update({"estado":"PENDIENTE"}).then(res => {  Swal.fire({
          title: 'Correcto',
          text: 'Un administrador aprobará su solicitud',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
        })}, err => alert(err));   */
       
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  rechazarEliminacion(e){
    Swal.fire({
      title: 'Rechazar Eliminación',
      text: "Se rechazará la eliminación del documento #"+e.Ndocumento,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.documentoGeneradoService.updateEstado(e,"ENTREGADO").subscribe( res => {Swal.fire({
          title: 'Correcto',
          text: 'Se realizó su proceso con éxito',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
        }) },err => {})
      /*   this.db.collection('/documentoEntrega').doc(e.Ndocumento+"").update({"estado":"ENTREGADO"}).then(res => {  Swal.fire({
          title: 'Correcto',
          text: 'Se realizó su proceso con éxito',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
        })}, err => alert(err)); */  
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }


  eliminarDocumento(e){
    Swal.fire({
      title: 'Eliminar entrega',
      text: "Se eliminará el documento #"+e.Ndocumento,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.documentoGeneradoService.updateEstado(e,"ELIMINADO").subscribe( res => {this.actualizarProductos(e) },err => {})
       /*  this.db.collection('/documentoEntrega').doc(e.Ndocumento+"").update({"estado":"ELIMINADO"}).then(res => {  this.actualizarProductos(e)
        }, err => alert(err)); */  
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }


  actualizarProductos(e){  
    this.docEntregas.forEach(element=>{
      if(element.Ndocumento == e.Ndocumento){
        this.documentoG = element
        this.productosEntregasSuc2 = element.arreEntregas
      }
    })
    console.log("entre a actualizar")
     var sumaProductos =0
     var sumaDeuda =0
     var num1:number=0
     var num2:number=0
     var num3:number=0
     var cont2ing=0
      var contIng:number=0
      var entre:boolean=true     
      new Promise<any>((resolve, reject) => {
        this.productosEntregasSuc2[0].productoPorEntregar.estado="PENDIENTE"
        this.productosEntregasSuc2[0].productoPorEntregar.cajas=this.productosEntregasSuc2[0].productoPorEntregar.cajasPen
        this.productosEntregasSuc2[0].productoPorEntregar.piezas=this.productosEntregasSuc2[0].productoPorEntregar.piezasPen
        this.productosEntregasSuc2[0].productoPorEntregar.cantM2=this.productosEntregasSuc2[0].productoPorEntregar.cantM2Pen
        this.productosPendientesService.updateProductoPendiente( this.productosEntregasSuc2[0].productoPorEntregar).subscribe( res => {},err => {})
        /* this.db.collection('/productosPendientesEntrega').doc(this.productosEntregasSuc2[0].productoPorEntregar.id_Pedido+"").update({ "estado" :"PENDIENTE" , "cajas":this.productosEntregasSuc2[0].productoPorEntregar.cajasPen,
      "piezas":this.productosEntregasSuc2[0].productoPorEntregar.piezasPen, "cantM2":this.productosEntregasSuc2[0].productoPorEntregar.cantM2Pen}).then(res => {}, err => alert(err));  */
        this.productosEntregasSuc2.forEach(element=>{
          this.productos.forEach(elemento1=>{
            if(elemento1.PRODUCTO == element.productoPorEntregar.producto.PRODUCTO){
              switch (this.productosEntregasSuc2[0].productoPorEntregar.sucursal) {
                case "matriz":
                  num1=parseInt(element.m2.toFixed(0))
                  num2=elemento1.sucursal1
                  num3=elemento1.suc1Pendiente
                  sumaProductos = Number(num2)+Number(num1)
                  sumaDeuda = Number(num3)+Number(num1)
                  break;
                case "sucursal1":
                  num1=parseInt(element.m2.toFixed(0))
                  num2=elemento1.sucursal2
                  num3=elemento1.suc1Pendiente
                  sumaProductos = Number(num2)+Number(num1)
                  sumaDeuda = Number(num3)+Number(num1)
                  break;
                case "sucursal2":
                  num1=parseInt(element.m2.toFixed(0))
                  num2=elemento1.sucursal3
                  num3=elemento1.suc1Pendiente
                  sumaProductos = Number(num2)+Number(num1)
                  sumaDeuda = Number(num3)+Number(num1)
                    break;
                default:
              }
            }
         })
         if(entre){       
          switch (this.productosEntregasSuc2[0].productoPorEntregar.sucursal) {
            case "matriz":
              this.productosEntregadosService.updateEstado(element,"PENDIENTE").subscribe( res => {},err => {})
              this.productoService.updateProductoPendienteSucursal1(element.productoPorEntregar.producto,sumaDeuda).subscribe( res => {cont2ing++, this.contadorValidaciones2(cont2ing) },err => {})
              //this.db.collection('/productosEntregadosSucursal').doc(element.identrega+"").update({ "estado" :"PENDIENTE"}).then(res => {}, err => alert(err)); 
              //this.db.collection('/productos').doc(element.productoPorEntregar.producto.PRODUCTO).update({ "suc1Pendiente" :sumaDeuda}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err)); 
              
              break;
            case "sucursal1":
              this.productosEntregadosService.updateEstado(element,"PENDIENTE").subscribe( res => {},err => {})
              this.productoService.updateProductoPendienteSucursal2(element.productoPorEntregar.producto,sumaDeuda).subscribe( res => {cont2ing++, this.contadorValidaciones2(cont2ing) },err => {})
              //this.db.collection('/productosEntregadosSucursal').doc(element.identrega+"").update({ "estado" :"PENDIENTE"}).then(res => {}, err => alert(err)); 
              //this.db.collection('/productos').doc(element.productoPorEntregar.producto.PRODUCTO).update({"suc2Pendiente" :sumaDeuda}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));
              break;
            case "sucursal2":
              this.productosEntregadosService.updateEstado(element,"PENDIENTE").subscribe( res => {},err => {})
              this.productoService.updateProductoPendienteSucursal3(element.productoPorEntregar.producto,sumaDeuda).subscribe( res => {cont2ing++, this.contadorValidaciones2(cont2ing)},err => {})
              //this.db.collection('/productosEntregadosSucursal').doc(element.identrega+"").update({ "estado" :"PENDIENTE"}).then(res => {}, err => alert(err)); 
              //this.db.collection('/productos').doc(element.productoPorEntregar.producto.PRODUCTO).update({"suc3Pendiente" :sumaDeuda}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));
              // console.log("aaaaccctttuuuallice")
              break;
            default: 
          
          //his.db.collection('/productos').doc(element.producto.PRODUCTO).update({"cantidad" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));   
         }
         }
        })
       
      })
       
    }


    contadorValidaciones2(i:number){
      if(this.productosEntregasSuc2.length==i){
          console.log("recien termine")
          Swal.close()
          Swal.fire({
            title: 'Documento Eliminado',
            text: 'Se ha realizado con éxito',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            window.location.reload()
          })
      }else{
        console.log("no he entrado actualizar"+i)
      }
    }


  eliminarEntrega(e){
    Swal.fire({
      title: 'Eliminar entrega',
      text: "Eliminar entrega de productos #"+e.documento_n,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.mostrarMensaje()
       // this.db.collection('/productosEntregadosSucursal').doc(e.documento_n+"").update({"estado":"ELIMINADA"}).then(res => { this.actualizarProductos(e)}, err => alert(err));  
       
     
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  buscarDatosSucursal(){
    this.parametrizaciones.forEach(element=>{
      if(element.sucursal == this.documentoG.arreEntregas[0].productoPorEntregar.sucursal){
        this.parametrizacionSucu= element
      }
    })
  }



  limpiarArreglo2(){
    var cont=0
    this.productosEntregasSuc3.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.productosEntregasSuc3.forEach(element=>{
        this.productosEntregasSuc3.splice(0)    
      })
    }
  }

  
  limpiarArreglo(){
    var cont=0
    this.productosEntregasSuc2.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.productosEntregasSuc2.forEach(element=>{
        this.productosEntregasSuc2.splice(0)    
      })
    }
  }

  mostrarPopup(e:any){
    this.limpiarArreglo()
    this.productosPendientes.forEach(element=>{
      this.popupvisible= true
      if(element.id_Pedido == e.id_Pedido){
        this.titulo= element.tipo_documento + " "+element.documento + "  -  "+element.producto.PRODUCTO
        this.productoLeido= element
        this.entregaProducto.productoPorEntregar=element
      }
    })

    this.productosEntregasSuc.forEach(element=>{
      if(element.productoPorEntregar.id_Pedido == this.productoLeido.id_Pedido  && element.estado == "ENTREGADO"){
        this.productosEntregasSuc2.push(element)
         this.entDir=true
      }
    })
   
   
    var contCajas=0
    var contPiezas=0

    this.parametrizaciones.forEach(element=>{
      if(element.sucursal == this.productoLeido.sucursal){
        this.parametrizacionSucu= element
      }
    })
    
    this.productosEntregasSuc2.forEach(element=>{
      this.contm2=element.m2+this.contm2
    })
  }

  mostrarPopup2(e:any){
    this.limpiarArreglo()
    this.productosPendientes.forEach(element=>{

      if(element.id_Pedido == e.id_Pedido){
        this.titulo= element.tipo_documento + " "+element.documento + "  -  "+element.producto.PRODUCTO
        this.productoLeido= element
        
        this.entregaProducto.productoPorEntregar=element
      }
    })

    this.productosEntregasSuc.forEach(element=>{
      if(element.productoPorEntregar.id_Pedido == this.productoLeido.id_Pedido){
        this.productosEntregasSuc2.push(element)
         
      }
    })
    this.popupvisible2= true
   
    var contCajas=0
    var contPiezas=0
    
    this.parametrizaciones.forEach(element=>{
      if(element.sucursal == this.productoLeido.sucursal){
        this.parametrizacionSucu= element
      }
    })
    this.productosEntregasSuc2.forEach(element=>{
      this.contm2=element.m2+this.contm2
    })
  }


  onExporting (e) {
    e.component.beginUpdate();
    e.component.columnOption("tipo_documento", "visible", true);
    e.component.columnOption("celular", "visible", true);
    e.component.columnOption("valor_unitario", "visible", true);
    e.component.columnOption("cajas", "visible", true);
    e.component.columnOption("piezas", "visible", true);
    e.component.columnOption("cantM2", "visible", true);
    //e.component.columnOption("total", "visible", true);
   
  };
  onExported (e) {
    e.component.columnOption("tipo_documento", "visible", false);
    e.component.columnOption("celular", "visible", false);
    e.component.columnOption("valor_unitario", "visible", false);
    e.component.columnOption("cajas", "visible", false);
    e.component.columnOption("piezas", "visible", false);
    e.component.columnOption("cantM2", "visible", false);
  //  e.component.columnOption("total", "visible", false);
    e.component.endUpdate();
  }

  onExporting3 (e) {
    e.component.beginUpdate();
    e.component.columnOption("tipo_documento", "visible", true);
    e.component.columnOption("celular", "visible", true);
    e.component.columnOption("valor_unitario", "visible", true);
    e.component.columnOption("cajasEntregadas", "visible", true);
    e.component.columnOption("piezasEntregadas", "visible", true);
    e.component.columnOption("m2Entregados", "visible", true);
    //e.component.columnOption("total", "visible", true);
   
  };
  onExported3 (e) {
    e.component.columnOption("tipo_documento", "visible", false);
    e.component.columnOption("celular", "visible", false);
    e.component.columnOption("valor_unitario", "visible", false);
    e.component.columnOption("cajasEntregadas", "visible", false);
    e.component.columnOption("piezasEntregadas", "visible", false);
    e.component.columnOption("m2Entregados", "visible", false);
  //  e.component.columnOption("total", "visible", false);
    e.component.endUpdate();
  }

  onExporting2 (e) {
    e.component.beginUpdate();
    e.component.columnOption("tipo_documento", "visible", true);
    e.component.columnOption("celular", "visible", true);
    e.component.columnOption("valor_unitario", "visible", true);
    e.component.columnOption("cajas", "visible", true);
    e.component.columnOption("piezas", "visible", true);
    e.component.columnOption("cantM2", "visible", true);
    e.component.columnOption("total", "visible", true);
   
  };
  onExported2 (e) {
    e.component.columnOption("tipo_documento", "visible", false);
    e.component.columnOption("celular", "visible", false);
    e.component.columnOption("valor_unitario", "visible", false);
    e.component.columnOption("cajas", "visible", false);
    e.component.columnOption("piezas", "visible", false);
    e.component.columnOption("cantM2", "visible", false);
    e.component.columnOption("total", "visible", false);
    e.component.endUpdate();
  }



  crearPDF(){
    console.log("entre  a creaar PDF")
    const documentDefinition = this.getDocumentDefinition();
    pdfMake.createPdf(documentDefinition).download('Entrega Producto '+this.productoLeido.id_Pedido, function(response) { Swal.close()
      Swal.fire({
        title: 'Correcto',
        text: 'Se guardó con éxito',
        icon: 'success',
        confirmButtonText: 'Ok'
      }).then((result) => {
        window.location.reload()
      })
     });
  }

  mensajeConf(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se guardó con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }



  crearPDF2(){
    this.setearNFactura()
    const documentDefinition = this.getDocumentDefinition2();
    pdfMake.createPdf(documentDefinition).download('Entrega Producto '+this.documentoG.Ndocumento, function(response) {
     });

  }


  crearPDF3(){
    //this.setearNFactura()
    const documentDefinition = this.getDocumentDefinition2();
    pdfMake.createPdf(documentDefinition).download('Entrega Producto '+this.documentoG.Ndocumento, function(response) {
      Swal.close()
      Swal.fire({
        title: 'Correcto',
        text: 'Se creó con éxito',
        icon: 'success',
        confirmButtonText: 'Ok'
      }).then((result) => {
        window.location.reload()
      })
     });

  }


  setearNFactura(){
    let nf=this.documentoG.Ndocumento
    let num=('' + nf).length
    console.log("el numero es"+num)
    switch (num) {
      case 1:
          this.numeroFactura="00000"+nf
          break;
      case 2:
          this.numeroFactura="0000"+nf
          break;
      case 3:
          this.numeroFactura="000"+nf
          break; 
      case 4:
          this.numeroFactura="00"+nf
          break; 
      case 5:
          this.numeroFactura="0"+nf
          break;
      case 6:
          //this.numeroFactura= nf
          break;    
      default:
    }
  } 


  getDocumentDefinition2() {
   // this.setearNFactura()
    sessionStorage.setItem('Entrega', JSON.stringify("jj"));
    return {
      pageSize: 'A4',
      pageOrientation: 'portrait', 
      content: [
        {
          columns: [{
          text:"hola",
          width: 100,
          margin: [0, 20, 0, 10],
          },
          {
            width:410,
            margin: [0, 20, 0, 10],
            text:" ",
            alignment:"right"
          },
          ]
        }, 
       
        {
          columns: [
            
            [
              { 
              text: this.parametrizacionSucu.razon_social,
            },
            {
              text: "RUC: "+this.parametrizacionSucu.ruc,
            },
            
            {
              text: "Venta de materiales para acabados de construcción, porcelanatos, cerámicas ", fontSize:9
            },
            {
              text: "Dirección: "+this.parametrizacionSucu.direccion,
            },
            {
              text: "Teléfonos: "+this.parametrizacionSucu.telefonos,
            },
            {
              text: "Auto SRI "+this.parametrizacionSucu.sri,
            },{
              columns: [{
              width:320,
              text: "ENTREGA PRODUCTOS  001 - 000",
              bold: true,
              fontSize: 20,
            },
            {
              width:200,
              text: ""+this.numeroFactura,
              color: 'red',
              bold: true,
              fontSize: 20,
              alignment:"right"
            },
            ]
            },
            {
            //Desde aqui comienza los datos del cliente
            style: 'tableExample',
            table: {
              widths: [100,140,100,140],
              body: [
                [
                  {
                    stack: [
                      {
                        type: 'none',
                        bold: true,
                        fontSize:9,
                        ul: [
                          'Numero Doc.',
                          'Tipo',
                          'Cliente',
                          'Sucursal',  
                        ]
                      }
                    ]
                  },
                  {
                    stack: [
                      {
                        type: 'none',
                        fontSize:9,
                        ul: [
                          ''+this.productosEntregasSuc2[0].productoPorEntregar.documento,
                          ''+this.productosEntregasSuc2[0].productoPorEntregar.tipo_documento,
                          ''+this.productosEntregasSuc2[0].productoPorEntregar.cliente,
                          ''+this.productosEntregasSuc2[0].productoPorEntregar.sucursal,
                       
                        ]
                      }
                    ]
                  },
                  {
                    stack: [
                      {
                        type: 'none',
                        bold: true,
                        fontSize:9,
                        ul: [
                          'Fecha Entrega',
                          'Fecha/transaccion',
                          'Usuario',
                          
                           
                        ]
                      }
                    ]
                  },
                  [{
                    stack: [
                      {
                        type: 'none',
                        fontSize:9,
                        ul: [
                          ''+this.documentoG.fecha,
                          ''+this.documentoG.fechaEntrega,
                          ''+this.productosEntregasSuc2[0].productoPorEntregar.usuario,
                        ]
                      }
                    ]
                  },
                  ],
                 
                ]
              ]
            }
            },
           
            ],
            [
              
            ]
          ]
        },
       
        this.getProductosIngresados3(this.productosEntregasSuc2),
        {text:" "}, {text:" "},
         {
          text:"Observaciones:   "+this.documentoG.observaciones,fontSize:9
        }, 

        {text:" "},

       /*  {
          
          columns: [{
          width:450,
          text: "Total:",
          bold: true,
          fontSize: 15,
          alignment:"right",
        },
        {
          width:60,
          text: +this.,
          bold: true,
          fontSize: 15,
          alignment:"right"
        },
        ]
        }, */
        {text:" "}, {text:" "},{text:" "},
          {
          columns: [{
           text:"Firma conformidad entrega",
          width: 250,
          fontSize:10,
          alignment:"right",
          margin: [55, 20, 40, 10],
          },
          {
            width:250,
            margin: [40, 20, 20, 10],
            fontSize:10,
            text:"Firma conformidad recibo ",
            alignment:"left"
          },
          ]
          
          //alignment: 'center'
        }, 
      ],
      footer: function (currentPage, pageCount) {
        return {
          table: {
            body: [
              
              [{text: '  ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL ', alignment: 'center', style:"textFot"}],
            ]
          },
          layout: 'noBorders'
        };
      }, pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
        return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
     },
      
      images: {
        mySuperImage: 'data:image/jpeg;base64,...content...'
      },
      info: {
        title: "Factura" + '_RESUME',
        author: "this.resume.name",
        subject: 'RESUME',
        keywords: 'RESUME, ONLINE RESUME',
      },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 20, 0, 10],
            decoration: 'underline'
          },
          textoPro:{
            bold: true,
            margin: [0, -12, 0, -5]
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          },
          tableExample2: {
            margin: [-13, 5, 10, 15]
          },
          tableExample3: {
            margin: [-13, -10, 10, 15]
          },
          tableExample4: {
            margin: [10, -5, 0, 15]
          },
          texto6: {
            fontSize: 14,
            bold: true,
            alignment: "center"
          },
          name: {
            fontSize: 16,
            bold: true
          },
          jobTitle: {
            fontSize: 14,
            bold: true,
            italics: true
          },
          textFot: {   
            alignment: 'center',
            italics: true,
            color: "#bebebe",
            fontSize:18,
          },
          tableHeader: {
            bold: true,
          },
          tableHeader2: {
            bold: true,
            fontSize:10,
          },
          
          fondoFooter: {
            fontSize: 8,
            alignment: "center"
          },
          totales: {
            margin: [0, 0, 15, 0],
            alignment: "right",
          },
          totales2: {
            margin: [0, 0, 5, 0],
            alignment: "right",
          },
          detalleTotales: {
            margin: [15, 0, 0, 0]
          }
        }
    };
  }



  getDocumentDefinition() {
    
    sessionStorage.setItem('Entrega', JSON.stringify("jj"));
    return {
      pageSize: 'A4',
      pageOrientation: 'portrait', 
      content: [
        {
          columns: [{
          text:"hola",
          width: 100,
          margin: [0, 20, 0, 10],
          },
          {
            width:410,
            margin: [0, 20, 0, 10],
            text:" ",
            alignment:"right"
          },
          ]
        }, 
       
        {
          columns: [
            
            [
              { 
              text: this.parametrizacionSucu.razon_social,
            },
            {
              text: "RUC: "+this.parametrizacionSucu.ruc,
            },
            
            {
              text: "Venta de materiales para acabados de construcción, porcelanatos, cerámicas ", fontSize:9
            },
            {
              text: "Dirección: "+this.parametrizacionSucu.direccion,
            },
            {
              text: "Teléfonos: "+this.parametrizacionSucu.telefonos,
            },
            {
              text: "Auto SRI "+this.parametrizacionSucu.sri,
            },{
              columns: [{
              width:320,
              text: "ENTREGA PRODUCTOS  001 - 000",
              bold: true,
              fontSize: 20,
            },
            {
              width:200,
              text: "NO "+this.numeroFactura,
              color: 'red',
              bold: true,
              fontSize: 20,
              alignment:"right"
            },
            ]
            },
            {
            //Desde aqui comienza los datos del cliente
            style: 'tableExample',
            table: {
              widths: [100,140,100,140],
              body: [
                [
                  {
                    stack: [
                      {
                        type: 'none',
                        bold: true,
                        fontSize:9,
                        ul: [
                          'Numero Doc.',
                          'Tipo',
                          'Cliente',
                          'Sucursal',  
                        ]
                      }
                    ]
                  },
                  {
                    stack: [
                      {
                        type: 'none',
                        fontSize:9,
                        ul: [
                          ''+this.productoLeido.documento,
                          ''+this.productoLeido.tipo_documento,
                          ''+this.productoLeido.cliente,
                          ''+this.productoLeido.sucursal,
                       
                        ]
                      }
                    ]
                  },
                  {
                    stack: [
                      {
                        type: 'none',
                        bold: true,
                        fontSize:9,
                        ul: [

                          'Fecha Entrega',
                          'Fecha/transaccion',
                          'Usuario',
                          
                           
                        ]
                      }
                    ]
                  },
                  [{
                    stack: [
                      {
                        type: 'none',
                        fontSize:9,
                        ul: [
                          ''+this.entregaProducto.fecha,
                          ''+this.productoLeido.fecha,
                          ''+this.productoLeido.usuario,
                        ]
                      }
                    ]
                  },
                  ],
                 
                ]
              ]
            }
            },
           
            ],
            [
              
            ]
          ]
        },
       
        this.getProductosIngresados2(this.productosEntregasSuc3),
        {text:" "}, {text:" "},
       /*  {
          text:"Observaciones:   "+this.devolucioLeida.observaciones,fontSize:9
        }, */

        {text:" "},
       /*  {
          
          columns: [{
          width:450,
          text: "Total:",
          bold: true,
          fontSize: 15,
          alignment:"right",
        },
        {
          width:60,
          text: +this.,
          bold: true,
          fontSize: 15,
          alignment:"right"
        },
        ]
        }, */
        {text:" "}, {text:" "},{text:" "},
          {
          columns: [{
           text:"Firma conformidad entrega",
          width: 250,
          fontSize:10,
          alignment:"right",
          margin: [55, 20, 40, 10],
          },
          {
            width:250,
            margin: [40, 20, 20, 10],
            fontSize:10,
            text:"Firma conformidad recibo ",
            alignment:"left"
          },
          ]
          
          //alignment: 'center'
        }, 
      ],
      footer: function (currentPage, pageCount) {
        return {
          table: {
            body: [
              
              [{text: '  ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL ', alignment: 'center', style:"textFot"}],
            ]
          },
          layout: 'noBorders'
        };
      }, pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
        return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
     },
      
      images: {
        mySuperImage: 'data:image/jpeg;base64,...content...'
      },
      info: {
        title: "Factura" + '_RESUME',
        author: "this.resume.name",
        subject: 'RESUME',
        keywords: 'RESUME, ONLINE RESUME',
      },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 20, 0, 10],
            decoration: 'underline'
          },
          textoPro:{
            bold: true,
            margin: [0, -12, 0, -5]
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          },
          tableExample2: {
            margin: [-13, 5, 10, 15]
          },
          tableExample3: {
            margin: [-13, -10, 10, 15]
          },
          tableExample4: {
            margin: [10, -5, 0, 15]
          },
          texto6: {
            fontSize: 14,
            bold: true,
            alignment: "center"
          },
          name: {
            fontSize: 16,
            bold: true
          },
          jobTitle: {
            fontSize: 14,
            bold: true,
            italics: true
          },
          textFot: {   
            alignment: 'center',
            italics: true,
            color: "#bebebe",
            fontSize:18,
          },
          tableHeader: {
            bold: true,
          },
          tableHeader2: {
            bold: true,
            fontSize:10,
          },
          
          fondoFooter: {
            fontSize: 8,
            alignment: "center"
          },
          totales: {
            margin: [0, 0, 15, 0],
            alignment: "right",
          },
          totales2: {
            margin: [0, 0, 5, 0],
            alignment: "right",
          },
          detalleTotales: {
            margin: [15, 0, 0, 0]
          }
        }
    };
  }
  
  getProductosIngresados2(productos: entregaProductos[]) {
    return {
      table: {
        widths: ["50%","15%","15%","20%"],
        alignment:'center',
        fontSize:9,
        headerRows: 2,
        body: [
          
          [{
            text: 'Producto',
            style: 'tableHeader2',
            rowSpan:2,
            fontSize:8,
            alignment: 'center'
          },
          {
            text: 'Cantidad Entregada',
            style: 'tableHeader2', 
            colSpan:2,
            fontSize:8,
            alignment: 'center'
          },
          {
            
          },
          {
            text: 'Total M2/Unidad',
            style: 'tableHeader2', 
            rowSpan:2,
            fontSize:8,
            alignment: 'center'
          }
          ],
          [
            {},
          {
            text: 'Cajas',
            style: 'tableHeader2', 
            fontSize:8,
            alignment: 'center'
          },
          {
            text: 'Piezas',
            style: 'tableHeader2',
            fontSize:8, 
            alignment: 'center'
          },
          {
            
          }
          ],
          
          ...productos.map(ed =>{
            return [ {text:ed.productoPorEntregar.producto.PRODUCTO, fontSize:9}, { text: ed.cajas, alignment: 'center', fontSize:9 }, { text: ed.piezas, alignment: 'center', fontSize:9 },
           {text:ed.m2.toFixed(2), alignment:"center", fontSize:9}];
            
          }),
         
          
        ]
      }
   
    };
  }


  getProductosIngresados3(productos: entregaProductos[]) {
    return {
      table: {
        widths: ["40%","15%","15%","15%","15%"],
        alignment:'center',
        fontSize:9,
        headerRows: 2,
        body: [
          
          [{
            text: 'Producto',
            style: 'tableHeader2',
            rowSpan:2,
            fontSize:8,
            alignment: 'center'
          },
          {
            text: 'Cantidad Entregada',
            style: 'tableHeader2', 
            colSpan:2,
            fontSize:8,
            alignment: 'center'
          },
          {
            
          },
          {
            text: 'Total M2/Unidad',
            style: 'tableHeader2', 
            rowSpan:2,
            fontSize:8,
            alignment: 'center'
          },
          {
            text: 'ID Remision',
            style: 'tableHeader2', 
            rowSpan:2,
            fontSize:8,
            alignment: 'center'
          }
          ],
          [
            {},
          {
            text: 'Cajas',
            style: 'tableHeader2', 
            fontSize:8,
            alignment: 'center'
          },
          {
            text: 'Piezas',
            style: 'tableHeader2',
            fontSize:8, 
            alignment: 'center'
          },
          {
            
          }
          ],
          
          ...productos.map(ed =>{
            return [ {text:ed.productoPorEntregar.producto.PRODUCTO, fontSize:9}, { text: ed.cajas, alignment: 'center', fontSize:9 }, { text: ed.piezas, alignment: 'center', fontSize:9 },
           {text:ed.m2.toFixed(2), alignment:"center", fontSize:9},{text:ed.identrega, alignment:"center", fontSize:9}];
            
          }),
         
          
        ]
      }
   
    };
  }
}
