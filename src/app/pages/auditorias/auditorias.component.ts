import { Component, OnInit, ViewChild } from '@angular/core';
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { SucursalesService } from 'src/app/servicios/sucursales.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { Sucursal } from '../compras/compra';
import { producto, contadoresDocumentos } from '../ventas/venta';
import { auditoria, auditoriasProductos, coincidencias } from './auditorias';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { AuditoriasService } from 'src/app/servicios/auditorias.service';
import Swal from 'sweetalert2';
import { AuditoriaProductoService } from 'src/app/servicios/auditoria-producto.service';
import { TransaccionesService } from 'src/app/servicios/transacciones.service';
import { transaccion } from '../transacciones/transacciones';
import { inventario, invFaltanteSucursal, productoTransaccion } from '../consolidado/consolidado';
import { user } from '../user/user';
import { AuthenService } from 'src/app/servicios/authen.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { DxDataGridComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services';
import pdfMake from "pdfmake/build/pdfmake";

@Component({
  selector: 'app-auditorias',
  templateUrl: './auditorias.component.html',
  styleUrls: ['./auditorias.component.scss']
})
export class AuditoriasComponent implements OnInit {

  sucursal:string
  now: Date = new Date();
  productoEntregado:string
  parametrizaciones: parametrizacionsuc[]=[]
  locales: Sucursal[]=[]
  productosActivos: producto[]=[]
  productos: producto[]=[]
  nombreSucursal:string
  number_transaccion:number=0
  auditoria:auditoriasProductos
  auditoriaProductosBase:auditoriasProductos[]=[]
  auditoriaProductosleida:auditoriasProductos[]=[]
  auditoriaProductosleidarepetidos:auditoriasProductos[]=[]
  auditoriaProductosleidarepetidos2:auditoriasProductos[]=[]
  auditoriaProductosleida2:auditoriasProductos[]=[]
  newAuditoria: auditoria
  dataAuditoria: auditoria = new auditoria()
  editAuditoria: auditoriasProductos
  contadores:contadoresDocumentos[]=[]
  nameSucursal:string=""
  auditoriasBase: auditoria[]=[]
  auditoriasIniciadas: auditoria[]=[]
  auditoriaEditable: auditoria
  auditoriasAcabadas: auditoria[]=[]
  transacciones: transaccion[]=[]
  transaccion:transaccion
  idAuditorialeida:auditoria
  numProductos:number
  btnRe: boolean=false
  valordefault=0
  invetarioProd:inventario
  invetarioP:inventario[]=[]
  invetarioFaltante1: invFaltanteSucursal
  invetarioFaltante:invFaltanteSucursal[]=[]
  contadorFirebase:contadoresDocumentos[]=[]
  productos22: DataSource;
  lectura:boolean=false
  correo:string
  pass:string
  loadIndicatorVisible=true
  usuarioLogueado:user
  seleccionado:boolean=false
  numCoinc:coincidencias
  arreglocoincidencias:coincidencias[]=[]
  arreglocoincidencias2:coincidencias[]=[]
  mostrarLoading:boolean=false;
  mensajeLoading = "Cargando";
  esEditado = false;
  newAud = true;
  mostrarBloqueo = false;
  menuValoracion: string[] = [
    "Ok",
    "Roto",
    "Sin vigencia",
    "Desmantelado",
    "No funcional",
    "Obsoleto",
    "Rayado",
    "Manchado"
  ];
  fecha_inicio= new Date()

  menu: string[] = [
    "Nueva Auditoria",
    "Ver Auditorias",
    "Novedades registradas"
  ];

  menuSupervisor: string[] = [
    
    "Ver Auditorias",
    "Novedades registradas"
  ];
 
  menuGlobal:string[]
  ubicaciones:string[]
  proTransaccion: productoTransaccion;
  mostrarTablaAuditoria : boolean = false;

  @ViewChild('datag2') dataGrid2: DxDataGridComponent;

  constructor(private db: AngularFirestore,
    public authService: AuthService,
    private router:Router, public  afAuth:  AngularFireAuth,public transaccionesService:TransaccionesService,public authenService:AuthenService, public auditoriaProductoService: AuditoriaProductoService, public auditoriasService:AuditoriasService, public contadoresService:ContadoresDocumentosService, public parametrizacionService: ParametrizacionesService, public sucursalesService: SucursalesService , public productoService:ProductoService) { 
    this.auditoria = new auditoriasProductos()
    this.numCoinc = new coincidencias()
    this.auditoria.valoracion= "Ok"
    this.newAuditoria = new auditoria()
    this.newAuditoria.fecha_inicio = new Date().toLocaleString()
    this.editAuditoria= new auditoriasProductos()
    this.newAuditoria.contrasena=""
    this.menuGlobal= this.menuSupervisor
    this.proTransaccion = new productoTransaccion();
  }

  ngOnInit() {
    this.traerParametrizaciones()
    this.traerSucursales()
    this.traerProductos()
    this.traerContadoresDocumentos()
    this.traerAuditorias()
    this.traerAuditoriasProductos()
    this.cargarUsuarioLogueado()
    this.getIDDocumentos()
  }

  onShown() {
    setTimeout(() => {
        this.loadIndicatorVisible = false;
    }, 3000);
  }

  traerParametrizaciones(){
    this.parametrizacionService.getParametrizacion().subscribe(res => {
      this.parametrizaciones = res as parametrizacionsuc[];
   })
  }

  traerSucursales(){
    this.sucursalesService.getSucursales().subscribe(res => {
      this.locales = res as Sucursal[];
   })
  }

  traerAuditorias(){
    this.auditoriasService.getAuditorias().subscribe(res => {
      this.auditoriasBase = res as auditoria[];
      this.separarAuditorias()
   })
  }

  traerAuditoriasProductos(){
    this.auditoriaProductoService.getAuditoriasProductos().subscribe(res => {
      this.auditoriaProductosBase = res as auditoriasProductos[];
   })
  }

   traerContadoresDocumentos(){
     this.contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
      this.newAuditoria.idAuditoria = this.contadores[0].auditorias_Ndocumento+1
   })
  }

  traerTransaccionesPorProducto(nombreProducto) {
    this.mensajeLoading = "Buscando datos";
    this.mostrarLoading = true;
    this.proTransaccion.nombre = nombreProducto;
    this.transaccionesService.getTransaccionesPorProducto(this.proTransaccion).subscribe((res) => {
      this.transacciones = res as transaccion[];
      this.cargarDatosProductoUnitario(nombreProducto);
    });

  }


  async getIDDocumentos() {
    //REVISAR OPTIMIZACION
    await this.db.collection('consectivosBaseMongoDB').valueChanges().subscribe((data:contadoresDocumentos[]) => {
      new Promise<any>((resolve, reject) => {
        if(data != null){this.contadorFirebase = data} 
      })
      this.asignarIDdocumentos2()
    })
    
  }
   asignarIDdocumentos2(){
     this.number_transaccion = this.contadorFirebase[0].transacciones_Ndocumento;
  }

  traerProductos(){
    this.mostrarLoading = true;
    this.productoService.getProducto().subscribe(res => {
      this.productosActivos = res as producto[];
      this.llenarComboProductos()
   })
  }

  traerTransacciones(){
    this.transaccionesService.getTransaccion().subscribe(res => {
      this.transacciones = res as transaccion[];
      this.traerProductos2()
   })
  }

  traerProductos2(){
    this.productoService.getProductosActivos().subscribe(res => {
      this.productos = res as producto[];
    // this.cargarDatos()
   })
  }

  llenarComboProductos(){
    this.productosActivos.forEach(element=>{
      if(element.ESTADO == "ACTIVO"){
        this.productos.push(element)
      }
    })

    this.productos22 = new DataSource({  
      store: this.productos,  
      sort: [{ field: "PRODUCTO", asc: true }],    
    });
    this.mostrarLoading = false;
  }


  clearForm(){
    this.auditoria.producto = null;
    this.productoEntregado = "";
    this.auditoria.cajas_fisico = 0;
    this.auditoria.cajas_danadas = 0;
    this.auditoria.cajas_diferencia = 0;
    this.auditoria.cajas_sistema = 0;
    this.auditoria.piezas_danadas = 0;
    this.auditoria.piezas_diferencia = 0;
    this.auditoria.piezas_fisico = 0;
    this.auditoria.piezas_sistema = 0;
    this.auditoria.nombreproducto = "";
    this.auditoria.ubicacion = "";
    this.auditoria.observaciones = "";
    this.auditoria.valoracion= "Ok"

  }
 

  obtenerDetallesproducto(e){
    this.productosActivos.forEach(element=>{
      if(element.PRODUCTO == this.productoEntregado){
        this.auditoria.producto = element
        this.auditoria.nombreproducto = element.PRODUCTO
        
        if(element.CLASIFICA != "Ceramicas" && element.CLASIFICA != "Porcelanatos" && element.CLASIFICA != "Porcelanato")
          this.lectura=true
        else
          this.lectura=false

        this.compararProducto()
      }
    })
  }

  compararProducto(){
    var coincidencia = false;
    if(this.esEditado)
      coincidencia = true;

    if(this.auditoriaProductosleida.length == 0){
      this.traerTransaccionesPorProducto(this.productoEntregado)
    }else{
       this.auditoriaProductosleida.forEach(element=>{
        if(element.producto.PRODUCTO == this.auditoria.producto.PRODUCTO){
          Swal.fire({
            title: 'Atención..!',
            text: "Este producto ya ha sido auditado, Desea editar el producto?",
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.value) {
                coincidencia = true
                this.editAuditoria = element
                this.editAuditoria.idAud = element.idAud
                this.productoEntregado= element.nombreproducto
                this.nombreSucursal= element.sucursal.nombre
                this.mostrarTablaAuditoria = false
                this.buscarInformacionEdit()
                var x = document.getElementById("editAud");
                var y = document.getElementById("newAud");
                var z = document.getElementById("tabla3");
                x.style.display = "block";
                y.style.display = "none";
                z.style.display = "none";
             
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                'Cancelado!',
                'Se ha cancelado su proceso.',
                'error'
              )
              this.productoEntregado=""
              this.btnRe=true
            }
          })
        }
      })

      if(!coincidencia){
        this.btnRe=false
        //this.buscarInformacionNuevoProceso()
        this.traerTransaccionesPorProducto(this.productoEntregado)
      }
    }
    
  }

 

  onExporting2 (e) {
    e.component.beginUpdate();
    e.component.columnOption("observaciones", "visible", true);
    e.component.columnOption("auditor", "visible", true);
    e.component.columnOption("auditado", "visible", true);
    e.component.columnOption("ubicacion", "visible", true);
    e.component.columnOption("sucursal.nombre", "visible", true);
    
  };
  onExported2 (e) {
    e.component.columnOption("observaciones", "visible", false);
    e.component.columnOption("auditor", "visible", false);
    e.component.columnOption("auditado", "visible", false);
    e.component.columnOption("ubicacion", "visible", false);
    e.component.columnOption("sucursal.nombre", "visible", false);
    e.component.endUpdate();
  }


  onExporting3 (e) {
    e.component.beginUpdate();
    e.component.columnOption("ubicacion", "visible", true);
    e.component.columnOption("observaciones", "visible", true);
    
  };
  onExported3 (e) {
    e.component.columnOption("observacubicacioniones", "visible", false);
    e.component.columnOption("observaciones", "visible", false);
    e.component.endUpdate();
  }
  opcionMenu(e){
    //var x = document.getElementById("newAudGlobal");
    var y = document.getElementById("tabla3");
    var z = document.getElementById("tabla2");
    var z0 = document.getElementById("tabla4");
    var z1 = document.getElementById("newAud");
    var z2 = document.getElementById("editAud");
    //var z3 = document.getElementById("tablaAuditoria");

    switch (e.value) {
      case  "Nueva Auditoria":
        //x.style.display = "block";
        y.style.display="none";
        z.style.display="none";
        z1.style.display="none";
        z0.style.display="none";
        z2.style.display="none";
        this.mostrarTablaAuditoria = false;
        //z4.style.display="none";

        this.newAud = true;
       
       break;
      case "Ver Auditorias":
        this.router.navigate(['/auditorias/tabla']);
        break;
      case "Novedades registradas":
        this.router.navigate(['/auditorias/novedades']);
        
        break;
      default:    
    }     
  }

  buscarInformacion(){
    this.invetarioP.forEach(element=>{
      if(element.producto.PRODUCTO == this.auditoria.producto.PRODUCTO){
        console.log("suc",this.auditoria)
        switch (this.auditoria.sucursal.nombre) {
          case "matriz":
            this.auditoria.cajas_sistema= element.cantidadCajas
            this.auditoria.piezas_sistema= element.cantidadPiezas
            this.ubicaciones= element.producto.ubicacionSuc1
            this.calcularTotalM2Base()
            break;
          case "sucursal1":
            this.auditoria.cajas_sistema= element.cantidadCajas2
            this.auditoria.piezas_sistema= element.cantidadPiezas2
            this.ubicaciones= element.producto.ubicacionSuc2
            this.calcularTotalM2Base()
            break;
          case "sucursal2":
            this.auditoria.cajas_sistema= element.cantidadCajas3
            this.auditoria.piezas_sistema= element.cantidadPiezas3
            this.ubicaciones= element.producto.ubicacionSuc3
            this.calcularTotalM2Base()
            break;
          default:
            break;
        }
        
      }
    })
    this.calcularTotalM2()
  }

  buscarInformacionNuevoProceso(){
    this.productosActivos.forEach(element=>{
      if(element.PRODUCTO == this.auditoria.producto.PRODUCTO){
        switch (this.auditoria.sucursal.nombre) {
          case "matriz":
            this.auditoria.cajas_sistema= Math.trunc((element.sucursal1+0.01) / element.M2);
            this.auditoria.piezas_sistema=  Math.trunc((element.sucursal1+0.01) * element.P_CAJA / element.M2) - (this.auditoria.cajas_sistema * element.P_CAJA);
            this.ubicaciones= element.ubicacionSuc1
            this.auditoria.m2base = element.sucursal1
            console.log("m2",this.auditoria.m2base)
            break;
          case "sucursal1":
            this.auditoria.cajas_sistema= Math.trunc((element.sucursal2+0.01) / element.M2);
            this.auditoria.piezas_sistema=  Math.trunc((element.sucursal2+0.01) * element.P_CAJA / element.M2) - (this.auditoria.cajas_sistema * element.P_CAJA);
            this.ubicaciones= element.ubicacionSuc2
            this.auditoria.m2base = element.sucursal2
            console.log("m2",this.auditoria.m2base)
            break;
          case "sucursal2":
            this.auditoria.cajas_sistema= Math.trunc((element.sucursal3+0.01) / element.M2);
            this.auditoria.piezas_sistema=  Math.trunc((element.sucursal3+0.01) * element.P_CAJA / element.M2) - (this.auditoria.cajas_sistema * element.P_CAJA);
            this.ubicaciones= element.ubicacionSuc3
            this.auditoria.m2base = element.sucursal3
            console.log("m2",this.auditoria.m2base)
            break;
          default:
            break;
        }
        
      }
    })
    this.calcularTotalM2()
  }

  buscarInformacionEdit(){
    this.invetarioP.forEach(element=>{
      if(element.producto.PRODUCTO == this.editAuditoria.producto.PRODUCTO){
        switch (this.editAuditoria.sucursal.nombre) {
          case "matriz":
            this.editAuditoria.cajas_sistema= element.cantidadCajas
            this.editAuditoria.piezas_sistema= element.cantidadPiezas
            
            this.calcularTotalM2BaseEdit()
            break;
          case "sucursal1":
            this.editAuditoria.cajas_sistema= element.cantidadCajas2
            this.editAuditoria.piezas_sistema= element.cantidadPiezas2
            
            this.calcularTotalM2BaseEdit()
            break;
          case "sucursal2":
            this.editAuditoria.cajas_sistema= element.cantidadCajas3
            this.editAuditoria.piezas_sistema= element.cantidadPiezas3
            
            this.calcularTotalM2BaseEdit()
            break;
          default:
            break;
        }
        
      }
    })
  }

  

  regresar(){
    this.mostrarTablaAuditoria = false;
    this.newAud = true;
  }

  regresar2(){
    var x = document.getElementById("tabla4");
    var z = document.getElementById("tabla2");
    var y = document.getElementById("tabla3");
      x.style.display = "none";
      z.style.display = "none";
      y.style.display = "block";
  }

   verLista(aud :auditoria){
    this.mostrarLoading = true;
    this.mostrarTablaAuditoria = true;
    var z = document.getElementById("tabla3");
      z.style.display = "none";
      this.newAud = false;
    this.auditoriaProductosleida = []


    this.dataAuditoria = aud;
    var newAuditoria = new auditoriasProductos();
    newAuditoria.idPrincipal = aud.idAuditoria;
    this.auditoriaProductoService.getAuditoriasProductosPorId(newAuditoria).subscribe(res => {
      var datos =  res as auditoriasProductos[];
      this.auditoriaProductosleida = datos;
      this.mostrarLoading = false;
    })
  }

  verLista2(e){
    var x = document.getElementById("tabla2");
    var y = document.getElementById("tabla3");
      x.style.display = "block";
      y.style.display = "none";
    var cont=0
    this.auditoriaProductosleida.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.auditoriaProductosleida.forEach(element=>{
        this.auditoriaProductosleida.splice(0)    
      })
    }
    this.auditoriaProductosBase.forEach(element=>{
      if(element.idPrincipal == e.idAuditoria){
        this.auditoriaProductosleida.push(element)
      }
    })
    
  }

  verLista3(e){
    
    var cont=0
    this.auditoriaProductosleida2.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.auditoriaProductosleida2.forEach(element=>{
        this.auditoriaProductosleida2.splice(0)    
      })
    }
    this.auditoriaProductosBase.forEach(element=>{
      if(element.idPrincipal == e.idAuditoria ){
        if(element.valoracion!="Ok"){
          this.auditoriaProductosleida2.push(element)
        }
        
      }
    })

    if(this.auditoriaProductosleida2.length==0){

    }
    var x = document.getElementById("tabla4");
    var y = document.getElementById("tabla3");
      x.style.display = "block";
      y.style.display = "none";
    this.dataGrid2.instance.refresh()
   
  }

  llenarLista(id:number){
    var cont=0
    this.auditoriaProductosleida.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.auditoriaProductosleida.forEach(element=>{
        this.auditoriaProductosleida.splice(0)    
      })
    }
    this.auditoriaProductosBase.forEach(element=>{
      if(element.idPrincipal == id){
        this.auditoriaProductosleida.push(element)
      }
    })
  }

  onExporting (e) {
    e.component.beginUpdate();
    e.component.columnOption("condicion", "visible", true);
    e.component.columnOption("auditor", "visible", true);
    e.component.columnOption("auditado", "visible", true);
    e.component.columnOption("impacto", "visible", true);
    e.component.columnOption("ubicacion", "visible", true);
    e.component.columnOption("sucursal.nombre", "visible", true);
    e.component.columnOption("observaciones", "visible", true);
   
  };
 
  onExported (e) {
    e.component.columnOption("condicion", "visible", false);
    e.component.columnOption("impacto", "visible", false);
    e.component.columnOption("auditor", "visible", false);
    e.component.columnOption("auditado", "visible", false);
    e.component.columnOption("ubicacion", "visible", false);
    e.component.columnOption("sucursal.nombre", "visible", false);
    e.component.columnOption("observaciones", "visible", false);

    e.component.endUpdate();
  }

  cambiarEstadoSeleccionado(e){
    
  }

  getCourseFile = (e) => {
    this.verLista2(e.row.data)  
  }

  getCourseFile2 = (e) => {
    this.verLista3(e.row.data)  
  }

  getCourseFile3 = (e) => {
    this.eliminarAuditoria(e.row.data)  
  }

  verEdit= (e) =>{
    this.editarPro(e.row.data)
  }

  eliminarProd = (e) => {
    this.eliminarAuditoriaProducto(e.row.data)
  }

  editarPro(e:any){
    this.editarAuditoriaProducto(e.idAud , e.nombreproducto)
  }


  eliminarAuditoria(e){
    Swal.fire({
      title: 'Eliminar Auditoría',
      text: "Esta seguro que desea eliminar la auditoria #"+e.idAud,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.mostrarMensaje()
        this.auditoriaProductoService.deleteAuditoria(e).subscribe( res => { 
          this.actualizarProductoEliminado(e)
        }, err => {alert("error")})
        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  actualizarProductoEliminado(e){
    var sumaProductos=0
    this.productos.forEach(element=>{
      if(element.PRODUCTO == e.producto.PRODUCTO){
        switch (e.sucursal.nombre) {
          case "matriz":
            sumaProductos= element.sucursal1- e.m2diferencia
            this.productoService.updateProductoSucursal1ComD(element,sumaProductos,element.precio).subscribe( res => {this.eliminarTransaccion(e)}, err => {alert("error")})
            break;
          case "sucursal1":
            sumaProductos= element.sucursal2- e.m2diferencia
            this.productoService.updateProductoSucursal2ComD(element,sumaProductos,element.precio).subscribe( res => {this.eliminarTransaccion(e)}, err => {alert("error")})
            break;
          case "sucursal2":
            sumaProductos= element.sucursal3- e.m2diferencia
          this.productoService.updateProductoSucursal3ComD(element,sumaProductos,element.precio).subscribe( res => {this.eliminarTransaccion(e)}, err => {alert("error")})
              break;
          default:
        }

      }
    })
  }

  eliminarTransaccion(e){
    this.transacciones.forEach(element=>{
      if(element.documento == e.idPrincipal &&  element.producto == e.producto.PRODUCTO){
        if(element.tipo_transaccion=="ajuste-faltante" || element.tipo_transaccion=="ajuste-sobrante"){
          this.transaccionesService.deleteTransaccion(element).subscribe( res => {this.mensajeOK()}, err => {alert("error")})
        }
      }
    })
  }

  seguirAuditoria(i:number){
    this.pass = localStorage.getItem("contrasena");
    if (this.pass == this.auditoriasIniciadas[i].contrasena ) {
     var x = document.getElementById("newAud");
      //var y = document.getElementById("newAudGlobal");
      var z = document.getElementById("tabla3");
     x.style.display = "block";
//      y.style.display = "none";
      z.style.display = "none";
      this.newAud = false;
      console.log("pass")
      this.auditoria.sucursal = this.auditoriasIniciadas[i].sucursal
      this.auditoria.idPrincipal = this.auditoriasIniciadas[i].idAuditoria
      this.auditoria.auditado = this.auditoriasIniciadas[i].auditado
      this.nombreSucursal =  this.auditoriasIniciadas[i].sucursal.nombre
      this.auditoria.idAud = this.auditoriasIniciadas[i].idAuditoria +" - "+ Number(this.auditoriasIniciadas[i].cantidad_productos+1)
      this.idAuditorialeida = this.auditoriasIniciadas[i]
      this.auditoria.auditor = this.usuarioLogueado[0].name
      this.numProductos = Number(this.auditoriasIniciadas[i].cantidad_productos+1)
      this.llenarLista(this.auditoriasIniciadas[i].idAuditoria)
    }else{
      Swal.fire(
        'Error',
        'Usted no se encuentra realizando esta auditoria, debe primero ingresar el código',
        'error'
      )
    }
         
  }

  mensajeOK(){
    Swal.close()
    Swal.fire({
      title: 'Correcto',
      text: 'Se eliminó con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }

  separarAuditorias(){
   
    this.auditoriasBase.forEach(element=>{
      if(element.estado == "Iniciada"){
        this.auditoriasIniciadas.push(element)
      }else{
        this.auditoriasAcabadas.push(element)
      }
    })
    
  }

  obtenerSucursal(e){
    this.locales.forEach(element=>{
      if(element.nombre == e.value){
        this.newAuditoria.sucursal = element
        this.nameSucursal= element.nombre       
      }
    })
  }

  validarSucursal(e){
    var cont=0
    this.auditoriasIniciadas.forEach(element=>{
      if(element.sucursal.nombre == e.value){
        cont++
      }
    })
    if(cont==0){
      this.obtenerSucursal(e)
    }else{
      this.nameSucursal = " "
      this.newAuditoria.sucursal = undefined
      Swal.fire({
        title: 'Error',
        text: 'Hay un proceso iniciado, finalice primero para poder continuar',
        icon: 'error'
      })
    }
  }

  mostrar(i:number){

  }

  guardarAuditoria(){
     if( this.newAuditoria.contrasena!="" && this.newAuditoria.sucursal != undefined && this.newAuditoria.auditado!= " "){
     
      this.mostrarMensaje()
      new Promise<any>((resolve, reject) => {
        this.auditoriasService.newAuditoria(this.newAuditoria).subscribe( res => {
          this.contadores[0].auditorias_Ndocumento=this.newAuditoria.idAuditoria
          this.contadoresService.updateContadoresIDAuditorias(this.contadores[0]).subscribe( res => {this.mensajeCorrecto()}, err => {alert("error")})
        }, err => {alert("error")})
      }) 
    }else{
      Swal.fire({
        title: 'Error al guardar',
        text: 'Hay campos vacios',
        icon: 'error'
      })
    } 
  }

guardarAuditoriaProducto(){
  if(this.auditoria.m2fisico == null)
    this.auditoria.m2fisico = 0;
  if(this.auditoria.piezas_fisico == null)
    this.auditoria.piezas_fisico = 0
    
  this.auditoria.fecha= new Date().toLocaleString()
   //if( this.auditoria.valoracion!= undefined && this.auditoria.m2fisico!=null && this.auditoria.piezas_fisico!=null && this.auditoria.m2diferencia!=null ){
   if( this.auditoria.valoracion!= undefined && this.auditoria.m2diferencia!=null ){
   //alert("aqui estoy")
    this.actualizarUbicacion()
    this.mostrarMensaje()
    new Promise<any>((resolve, reject) => {
      this.auditoriaProductoService.newAuditoriaProducto(this.auditoria).subscribe( res => {
        this.auditoriasService.updateAuditoriaProductos(this.idAuditorialeida ,this.numProductos).subscribe( res => {this.mensajeCorrecto()}, err => {alert("error")})
      }, err => {alert("error")})
    }) 
   }else{
     Swal.fire({
       title: 'Error al guardar',
       text: 'Vuelva a intentarlo',
       icon: 'error'
     })
   }
}

  guardarEditAuditoriaProducto(){
    this.editAuditoria.fecha= new Date().toLocaleString()
    if( this.editAuditoria.m2fisico!=0 && this.editAuditoria.valoracion!= undefined){
      this.actualizarUbicacionEdit()
        this.mostrarMensaje()
      new Promise<any>((resolve, reject) => {
          this.auditoriaProductoService.updateAuditoriaProducto(this.editAuditoria).subscribe( res => {this.mensajeUpdate()}, err => {alert("error")})
      }) 
    }else{
      Swal.fire({
        title: 'Error al guardar',
        text: 'Hay campos vacios',
        icon: 'error'
      })
    }
  }

  finalizarAuditoria(i:number){
    this.auditoriasIniciadas[i].estado = "Finalizada"
    Swal.fire({
      title: 'Finalizar auditoria',
      text: "Desea finalizar el proceso de auditoria #"+this.auditoriasIniciadas[i].idAuditoria,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        new Promise<any>((resolve, reject) => {
          var fecha2=new Date().toLocaleDateString()
          this.auditoriasIniciadas[i].fecha_fin = new Date().toLocaleDateString()
          this.auditoriasService.updateAuditoriaEstado(this.auditoriasIniciadas[i],fecha2,"Finalizada").subscribe( res => {this.mensajeCorrecto2()}, err => {alert("error")})
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  eliminarAuditoriaProducto(e:any){
    Swal.fire({
      title: 'Eliminar Auditoria',
      text: "Desea eliminar la auditoria del producto "+e.nombreproducto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.auditoriaProductosBase.forEach(element=>{
          if(element._id ==e._id ){
            this.auditoriaProductoService.deleteAuditoria(element).subscribe( res => {
              Swal.fire({
                title: 'Correcto',
                text: 'Se ha realizado su proceso con éxito',
                icon: 'success',
                confirmButtonText: 'Ok'
              }).then((result) => {
                window.location.reload()
              })
            }, err => {alert("error")})
          }
        })
        
  
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    })
  }


  revisarDuplicados(){
    var matriz = {};
    var matriz2 = {};
    
    
    this.auditoriaProductosleida.forEach(element=> { 
      var nombreproducto = element.nombreproducto
      matriz[nombreproducto] = matriz[nombreproducto] ? (matriz[nombreproducto] + 1) : 1;
      this.numCoinc = new coincidencias()
      this.numCoinc.nombreProducto=nombreproducto
      this.numCoinc.cantidad=matriz[nombreproducto] 
      this.arreglocoincidencias.push(this.numCoinc)
    });
     
    matriz = Object.keys(matriz).map(function(nombreproducto) {
      return { nombre: nombreproducto, cant: matriz[nombreproducto] };
   });
   

   this.arreglocoincidencias.forEach(element=>{
     if(element.cantidad>1){
       this.arreglocoincidencias2.push(element)
     }
   })

  
   if(this.arreglocoincidencias2.length>0){
    
    Swal.fire({
      title: 'ERROR',
      text: 'Se han encontrado productos duplicados en la auditoria, resuelvalos e intente nuevamente',
      icon: 'error',
      confirmButtonText: 'Ok'
    }).then((result) => {
      var x = document.getElementById("tablaRepetidos");
      x.style.display = "block";
    })
   }else{
     Swal.fire({
      title: 'Alerta',
      text: "Está seguro de realizar la actualización, esto afectará los inventarios de productos",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.realizarActualizaciones()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
   }

 

  }


  realizarActualizaciones(){
    this.mostrarMensaje()
    var contVal=0

    this.auditoriaProductosleida.forEach(element=>{
      if(element.condicion != "OK"){
        this.transaccion = new transaccion()
        this.transaccion.fecha_mov=new Date().toLocaleString()
        this.transaccion.fecha_transaccion=new Date()
        this.transaccion.sucursal=element.sucursal.nombre
        this.transaccion.totalsuma=element.impacto
        this.transaccion.bodega="12"
        
        this.transaccion.cantM2=0
        this.transaccion.costo_unitario=element.producto.precio
        this.transaccion.documento=element.idPrincipal+""
        this.transaccion.factPro=""
        this.transaccion.maestro=""
        this.transaccion.producto=element.producto.PRODUCTO
        this.transaccion.observaciones =element.observaciones
        if(element.cajas_diferencia <0 || element.piezas_diferencia<0){
          this.transaccion.cajas=element.cajas_diferencia*(-1)
          this.transaccion.piezas=element.piezas_diferencia*(-1)
          this.transaccion.valor=element.impacto*(-1)
          this.transaccion.totalsuma=element.impacto*(-1)
        }else{
          this.transaccion.cajas=element.cajas_diferencia
          this.transaccion.piezas=element.piezas_diferencia
          this.transaccion.valor=element.impacto
          this.transaccion.totalsuma=element.impacto
        }
        
        this.transaccion.usu_autorizado=this.usuarioLogueado[0].username
        this.transaccion.usuario=this.usuarioLogueado[0].username
        this.transaccion.idTransaccion=this.number_transaccion++
        this.transaccion.cliente=""
        switch (element.condicion) {
          case "SOBRANTE":
            this.transaccion.tipo_transaccion="ajuste-sobrante"
            this.transaccion.movimiento=1
            break;
          case "FALTANTE":
            this.transaccion.tipo_transaccion="ajuste-faltante"
            this.transaccion.movimiento=-1
            break;
        
          default:
            break;
        }


        this.transaccionesService.newTransaccion(this.transaccion).subscribe(
          res => {
            this.contadores[0].transacciones_Ndocumento = this.number_transaccion
            this.contadoresService.updateContadoresIDTransacciones(this.contadores[0]).subscribe(
              res => { contVal++,this.contadorValidaciones(contVal) },
              err => { this.mostrarMensajeGenerico(2,"Revise e intente nuevamente") })
          },
          err => { this.mostrarMensajeGenerico(2,"Revise e intente nuevamente") })
        }else{
          contVal++,this.contadorValidaciones(contVal)
        }
    })
  
  }

  contadorValidaciones(i:number){
    if(this.auditoriaProductosleida.length==i)
      this.actualizarProductos()
  }

  editarAuditoriaProducto(id:string, producto:string){
    this.auditoriaProductosBase.forEach(element=>{
      if(element.idAud ==id && element.nombreproducto == producto){
        this.esEditado = true
        this.editAuditoria = element
        this.editAuditoria.idAud = element.idAud
        this.productoEntregado = element.nombreproducto
        this.nombreSucursal = element.sucursal.nombre
        this.mostrarTablaAuditoria = true;
        
        var x = document.getElementById("editAud");
        var y = document.getElementById("newAud");
        var z = document.getElementById("tabla3");
        x.style.display = "block";
        y.style.display = "none";
        z.style.display = "none";
      }
    })
  }


  actualizarProductos(){
    var contVal=0
    this.auditoriaProductosleida.forEach(element=>{
        switch (element.sucursal.nombre) {
          
          case "matriz":
            element.producto.sucursal1=element.m2fisico-element.producto.suc1Pendiente
            this.productoService.updateProductoSucursal1(element.producto).subscribe( res => {contVal++,this.contadorValidaciones2(contVal)}, err => {})
            break;
          case "sucursal1":
            element.producto.sucursal2=element.m2fisico-element.producto.suc2Pendiente
            console.log("aquiiii "+ element.producto.sucursal2)
            this.productoService.updateProductoSucursal2(element.producto).subscribe( res => {contVal++,this.contadorValidaciones2(contVal)}, err => {})
            break;
          case "sucursal2":
            element.producto.sucursal3=element.m2fisico-element.producto.suc3Pendiente
            this.productoService.updateProductoSucursal3(element.producto).subscribe( res => {contVal++,this.contadorValidaciones2(contVal)}, err => {})
            break;
          default:
        }
    })
  }

  contadorValidaciones2(i:number){
    this.auditoriasIniciadas.forEach(element=>{
      if(element.idAuditoria == this.auditoriaProductosleida[0].idPrincipal){ 
        this.auditoriaEditable=element
      }
    })

    if(this.auditoriaProductosleida.length==i){
      var fecha2= new Date().toLocaleDateString()
      this.auditoriaEditable.fecha_fin= new Date().toLocaleDateString()
      this.auditoriasService.updateAuditoriaEstado(this.auditoriaEditable,fecha2,"Finalizada").subscribe( res => {
         Swal.fire({
          title: 'Correcto',
          text: 'Se ha realizado su auditoria',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
        })
      }, err => {alert("error")})
    
    }else{
      console.log("no he entrado "+i)
    }
  }



  cargarUsuarioLogueado() {
    const promesaUser = new Promise((res, err) => {
      if (localStorage.getItem("maily") != '') {
        this.correo = localStorage.getItem("maily");
      }
      this.authenService.getUserLogueado(this.correo)
        .subscribe(
          res => {
            this.usuarioLogueado = res as user;
            if(this.usuarioLogueado[0].status == "Inactivo")
              this.authService.logOut();

            if(this.usuarioLogueado[0].rol == "Administrador"){
              this.mostrarBloqueo = true;
              this.mostrarPopupCodigo();
            }
              
            
            this.validarRol()
          },
          err => {}
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


  validarRol(){
    if(this.usuarioLogueado[0].rol == "Administrador"){
      this.menuGlobal = this.menu
    }
  }

  calcularTotalM2BaseEdit(){
    this.editAuditoria.m2base=parseFloat(((this.editAuditoria.producto.M2*this.editAuditoria.cajas_sistema)+((this.editAuditoria.piezas_sistema*this.editAuditoria.producto.M2)/this.editAuditoria.producto.P_CAJA)).toFixed(2))
    console.log("editAuditoria "+this.editAuditoria.m2base)
  }

  calcularTotalM2Base(){
    this.auditoria.m2base=parseFloat(((this.auditoria.producto.M2*this.auditoria.cajas_sistema)+((this.auditoria.piezas_sistema*this.auditoria.producto.M2)/this.auditoria.producto.P_CAJA)).toFixed(2))
    console.log("fff "+this.auditoria.m2base)
  }

  calcularTotalM2(){
    this.auditoria.m2fisico=parseFloat(((this.auditoria.producto.M2*this.auditoria.cajas_fisico)+((this.auditoria.piezas_fisico*this.auditoria.producto.M2)/this.auditoria.producto.P_CAJA)).toFixed(2))
    console.log("fff "+this.auditoria.m2fisico)
    this.calculardiferencia()
  }

  calcularTotalM2Dano(){
    this.auditoria.m2daño=parseFloat(((this.auditoria.producto.M2*this.auditoria.cajas_danadas)+((this.auditoria.piezas_danadas*this.auditoria.producto.M2)/this.auditoria.producto.P_CAJA)).toFixed(2))
    console.log("fff "+this.auditoria.m2daño)
    this.auditoria.impactoDanado = parseFloat((this.auditoria.m2daño * this.auditoria.producto.precio).toFixed(2))
  }

  calcularTotalM2Edit(){
    this.editAuditoria.m2fisico=parseFloat(((this.editAuditoria.producto.M2*this.editAuditoria.cajas_fisico)+((this.editAuditoria.piezas_fisico*this.editAuditoria.producto.M2)/this.editAuditoria.producto.P_CAJA)).toFixed(2))
    console.log("fff "+this.editAuditoria.m2fisico)
    this.calculardiferencia2()
  }

  calcularTotalM2DanoEdit(){
    this.editAuditoria.m2daño=parseFloat(((this.editAuditoria.producto.M2*this.editAuditoria.cajas_danadas)+((this.editAuditoria.piezas_danadas*this.editAuditoria.producto.M2)/this.editAuditoria.producto.P_CAJA)).toFixed(2))
    console.log("fff "+this.editAuditoria.m2daño)
    this.editAuditoria.impactoDanado = parseFloat((this.editAuditoria.m2daño * this.editAuditoria.producto.precio).toFixed(2))
  }

  calculardiferencia(){
    var impactoNeto=0
    impactoNeto=this.auditoria.m2fisico-this.auditoria.m2base
    console.log("this.auditoria.m2fisico",this.auditoria.m2fisico)
    console.log("this.auditoria.m2base",this.auditoria.m2base)
    if(this.auditoria.producto.CLASIFICA != "Ceramicas" && this.auditoria.producto.CLASIFICA != "Porcelanatos" && this.auditoria.producto.CLASIFICA != "Porcelanato")
       this.auditoria.m2diferencia=this.auditoria.m2fisico-this.auditoria.m2base
    else{
      if(this.auditoria.m2fisico<this.auditoria.m2base)
        this.auditoria.m2diferencia=this.auditoria.m2fisico-this.auditoria.m2base-0.04
      else
        this.auditoria.m2diferencia=this.auditoria.m2fisico-this.auditoria.m2base+0.03
   }
    
    console.log("la diferencia es "+this.auditoria.m2diferencia)
    this.auditoria.cajas_diferencia=Math.trunc(this.auditoria.m2diferencia /  this.auditoria.producto.M2);
    console.log("cajas diferencia "+this.auditoria.cajas_diferencia)
    
    this.auditoria.piezas_diferencia=Math.trunc(this.auditoria.m2diferencia * this.auditoria.producto.P_CAJA /this.auditoria.producto.M2) - (this.auditoria.cajas_diferencia * this.auditoria.producto.P_CAJA);
    console.log("piezas diferencia "+this.auditoria.piezas_diferencia)

    this.auditoria.impacto = parseFloat((impactoNeto * this.auditoria.producto.precio).toFixed(2))
    if(this.auditoria.cajas_diferencia==0 && this.auditoria.piezas_diferencia==0){
      this.auditoria.condicion= "OK"
      this.auditoria.impacto=0
    }else if (this.auditoria.m2diferencia<0){
      this.auditoria.condicion = "FALTANTE"
    }else if(this.auditoria.m2diferencia >0){
      this.auditoria.condicion = "SOBRANTE"
    } 
  }

  calculardiferencia2(){
    var impactoNeto=0
    impactoNeto=this.editAuditoria.m2fisico-this.editAuditoria.m2base
    console.log("this.editAuditoria.m2fisico",this.editAuditoria.m2fisico)
    console.log("this.editAuditoria.m2base",this.editAuditoria.m2base)
    if(this.editAuditoria.producto.CLASIFICA != "Ceramicas" && this.editAuditoria.producto.CLASIFICA != "Porcelanatos" ){
      this.editAuditoria.m2diferencia=this.editAuditoria.m2fisico-this.editAuditoria.m2base
    }else{
      if(this.editAuditoria.m2fisico<this.editAuditoria.m2base){
        this.editAuditoria.m2diferencia=this.editAuditoria.m2fisico-this.editAuditoria.m2base-0.04
      }else{
        this.editAuditoria.m2diferencia=this.editAuditoria.m2fisico-this.editAuditoria.m2base+0.03
      }
    }
    
    console.log("la diferencia es "+this.editAuditoria.m2diferencia)
    this.editAuditoria.cajas_diferencia=Math.trunc(this.editAuditoria.m2diferencia /  this.editAuditoria.producto.M2);
    console.log("cajas diferencia "+this.editAuditoria.cajas_diferencia)
    
    this.editAuditoria.piezas_diferencia=Math.trunc(this.editAuditoria.m2diferencia * this.editAuditoria.producto.P_CAJA /this.editAuditoria.producto.M2) - (this.editAuditoria.cajas_diferencia * this.editAuditoria.producto.P_CAJA);
    console.log("piezas diferencia "+this.editAuditoria.piezas_diferencia)

    this.editAuditoria.impacto = parseFloat((impactoNeto * this.editAuditoria.producto.precio).toFixed(2))
    console.log("sss "+this.editAuditoria.impacto)

    if(this.editAuditoria.m2diferencia >0){
      this.editAuditoria.condicion = "SOBRANTE"
    }else if (this.editAuditoria.m2diferencia<0){
      this.editAuditoria.condicion = "FALTANTE"
    }else{
      this.editAuditoria.condicion= "OK"
    }
  }




  actualizarUbicacion(){
     var cont=0
        switch (this.auditoria.sucursal.nombre) {
          case "matriz":
             for (let index = 0; index < this.auditoria.producto.ubicacionSuc1.length; index++) {
              const element2 = this.auditoria.producto.ubicacionSuc1[index];
               if(element2 == this.auditoria.ubicacion){
                cont++
              }  
            }
            
            if(cont==0){
              this.auditoria.producto.ubicacionSuc1.push(this.auditoria.ubicacion)
              this.productoService.updateProductoUbicaciones(this.auditoria.producto).subscribe( res => {}, err => {alert("error")})
            } 
            break;
           case "sucursal1":
            for (let index = 0; index < this.auditoria.producto.ubicacionSuc2.length; index++) {
              const element2 = this.auditoria.producto.ubicacionSuc2[index];
              if(element2 == this.auditoria.ubicacion){
                cont++
              } 
            }
            if(cont==0){
              this.auditoria.producto.ubicacionSuc2.push(this.auditoria.ubicacion)
              this.productoService.updateProductoUbicaciones(this.auditoria.producto).subscribe( res => {}, err => {alert("error")})
            }
            
            break;
          case "sucursal2":
            for (let index = 0; index < this.auditoria.producto.ubicacionSuc3.length; index++) {
              const element2 = this.auditoria.producto.ubicacionSuc3[index];
              if(element2 == this.auditoria.ubicacion){
                cont++
              } 
            }
            if(cont==0){
              this.auditoria.producto.ubicacionSuc3.push(this.auditoria.ubicacion)
              this.productoService.updateProductoUbicaciones(this.auditoria.producto).subscribe( res => {}, err => {alert("error")})
            }
              break; 
          default:
            break;
        } 
  }

  actualizarUbicacionEdit(){
     var cont=0
        switch (this.editAuditoria.sucursal.nombre) {
          case "matriz":
             for (let index = 0; index < this.editAuditoria.producto.ubicacionSuc1.length; index++) {
              const element2 = this.editAuditoria.producto.ubicacionSuc1[index];
               if(element2 == this.editAuditoria.ubicacion){
                cont++
              }  
            }
            
            if(cont==0){
              this.editAuditoria.producto.ubicacionSuc1.push(this.editAuditoria.ubicacion)
              this.productoService.updateProductoUbicaciones(this.editAuditoria.producto).subscribe( res => {}, err => {alert("error")})
            } 
            break;
           case "sucursal1":
            for (let index = 0; index < this.editAuditoria.producto.ubicacionSuc2.length; index++) {
              const element2 = this.editAuditoria.producto.ubicacionSuc2[index];
              if(element2 == this.editAuditoria.ubicacion){
                cont++
              } 
            }
            if(cont==0){
              this.editAuditoria.producto.ubicacionSuc2.push(this.editAuditoria.ubicacion)
              this.productoService.updateProductoUbicaciones(this.editAuditoria.producto).subscribe( res => {}, err => {alert("error")})
            }
            
            break;
          case "sucursal2":
            for (let index = 0; index < this.editAuditoria.producto.ubicacionSuc3.length; index++) {
              const element2 = this.editAuditoria.producto.ubicacionSuc3[index];
              if(element2 == this.editAuditoria.ubicacion){
                cont++
              } 
            }
            if(cont==0){
              this.editAuditoria.producto.ubicacionSuc3.push(this.editAuditoria.ubicacion)
              this.productoService.updateProductoUbicaciones(this.editAuditoria.producto).subscribe( res => {}, err => {alert("error")})
            }
              break; 
          default:
            break;
        } 
  }



  continuarAuditoria(i:number){
    Swal.fire({
      title: 'Código',
      showCancelButton: true,
      inputAttributes: {
        autocapitalize: 'off'
      },
      confirmButtonText: 'Ingresar',
      cancelButtonText: 'Cancelar',
      input: 'text',
    }).then((result) => {
      if (result.value) {
        if(result.value == this.auditoriasIniciadas[i].contrasena){
          var x = document.getElementById("newAud");
          var z = document.getElementById("tabla3");
          x.style.display = "block";
          z.style.display = "none";
          this.newAud = false;
          localStorage.setItem('contrasena',  result.value);
          this.auditoria.sucursal = this.auditoriasIniciadas[i].sucursal
          this.auditoria.idPrincipal = this.auditoriasIniciadas[i].idAuditoria
          this.auditoria.auditado = this.auditoriasIniciadas[i].auditado
          this.nombreSucursal =  this.auditoriasIniciadas[i].sucursal.nombre
          this.auditoria.idAud = this.auditoriasIniciadas[i].idAuditoria +" - "+ Number(this.auditoriasIniciadas[i].cantidad_productos+1)
          this.idAuditorialeida = this.auditoriasIniciadas[i]
          this.auditoria.auditor = this.usuarioLogueado[0].name
          this.numProductos = Number(this.auditoriasIniciadas[i].cantidad_productos+1)
          this.llenarLista(this.auditoriasIniciadas[i].idAuditoria)
        }else{ this.mostrarMensajeGenerico(2,"Código incorrecto")}
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
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

  mostrarMensaje(){
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

  mensajeCorrecto(){
    Swal.close()
    Swal.fire({
      title: 'Auditoria Registrada',
      text: 'Se ha guardado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }

  mensajeUpdate(){
    Swal.close()
    Swal.fire({
      title: 'Auditoria Actualizada',
      text: 'Se ha guardado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }

  mensajeCorrecto2(){
    Swal.fire({
      title: 'Correcto',
      text: 'Se ha realizado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      window.location.reload()
    })
  }



  







  //Desde aqui empieza
  cargarDatosProductoUnitario(nombreProducto) {
    var contCajas = 0;
    var contCajas2 = 0;
    var contCajas3 = 0;
    var contPiezas = 0;
    var contPiezas2 = 0;
    var contPiezas3 = 0;
    for (let index = 0; index < this.productos.length; index++) {
      const element2 = this.productos[index];

      this.transacciones.forEach((element) => {
        if (element2.PRODUCTO == element.producto &&element.sucursal == "matriz") {
          switch (element.tipo_transaccion) {
            case "devolucion":
              contCajas = Number(element.cajas) + contCajas;
              contPiezas = Number(element.piezas) + contPiezas;
              break;
            case "compra-dir":
              contCajas = Number(contCajas) + Number(element.cajas);
              contPiezas = Number(contPiezas) + Number(element.piezas);
              break;
            case "compra":
              contCajas = Number(contCajas) + Number(element.cajas);
              contPiezas = Number(contPiezas) + Number(element.piezas);
              break;
            case "compra_obs":
              contCajas = Number(contCajas) + Number(element.cajas);
              contPiezas = Number(contPiezas) + Number(element.piezas);
              break;
            case "ajuste-faltante":
              contCajas = Number(contCajas) - Number(element.cajas);
              contPiezas = Number(contPiezas) - Number(element.piezas);
              break;
            case "baja":
              contCajas = Number(contCajas) - Number(element.cajas);
              contPiezas = Number(contPiezas) - Number(element.piezas);
              break;
            case "venta-fact":
              contCajas = Number(contCajas) - Number(element.cajas);
              contPiezas = Number(contPiezas) - Number(element.piezas);
              break;
            case "venta-not":
              contCajas = Number(contCajas) - Number(element.cajas);
              contPiezas = Number(contPiezas) - Number(element.piezas);
              break;
            case "traslado1":
              contCajas = Number(contCajas) - Number(element.cajas);
              contPiezas = Number(contPiezas) - Number(element.piezas);
              break;
            case "traslado2":
              contCajas = Number(contCajas) + Number(element.cajas);
              contPiezas = Number(contPiezas) + Number(element.piezas);
              break;
            case "ajuste-sobrante":
              contCajas = Number(contCajas) + Number(element.cajas);
              contPiezas = Number(contPiezas) + Number(element.piezas);

              break;
            default:
          }
        } else if (element2.PRODUCTO == element.producto && element.sucursal == "sucursal1") {
          switch (element.tipo_transaccion) {
            case "devolucion":
              contCajas2 = Number(element.cajas) + contCajas2;
              contPiezas2 = Number(element.piezas) + contPiezas2;
              break;
            case "compra-dir":
              contCajas2 = Number(contCajas2) + Number(element.cajas);
              contPiezas2 = Number(contPiezas2) + Number(element.piezas);
              break;
            case "compra":
              contCajas2 = Number(contCajas2) + Number(element.cajas);
              contPiezas2 = Number(contPiezas2) + Number(element.piezas);
              break;
            case "compra_obs":
              contCajas2 = Number(contCajas2) + Number(element.cajas);
              contPiezas2 = Number(contPiezas2) + Number(element.piezas);
              break;
            case "ajuste-faltante":
              contCajas2 = Number(contCajas2) - Number(element.cajas);
              contPiezas2 = Number(contPiezas2) - Number(element.piezas);
              break;
            case "baja":
              contCajas2 = Number(contCajas2) - Number(element.cajas);
              contPiezas2 = Number(contPiezas2) - Number(element.piezas);
              break;
            case "venta-fact":
              contCajas2 = Number(contCajas2) - Number(element.cajas);
              contPiezas2 = Number(contPiezas2) - Number(element.piezas);
              break;
            case "venta-not":
              contCajas2 = Number(contCajas2) - Number(element.cajas);
              contPiezas2 = Number(contPiezas2) - Number(element.piezas);
              break;
            case "traslado1":
              contCajas2 = Number(contCajas2) - Number(element.cajas);
              contPiezas2 = Number(contPiezas2) - Number(element.piezas);
              break;
            case "traslado2":
              contCajas2 = Number(contCajas2) + Number(element.cajas);
              contPiezas2 = Number(contPiezas2) + Number(element.piezas);
              break;
            case "ajuste-sobrante":
              contCajas2 = Number(contCajas2) + Number(element.cajas);
              contPiezas2 = Number(contPiezas2) + Number(element.piezas);
              break;
            default:
          }
        } else if ( element2.PRODUCTO == element.producto && element.sucursal == "sucursal2") {
          switch (element.tipo_transaccion) {
            case "devolucion":
              contCajas3 = Number(element.cajas) + contCajas3;
              contPiezas3 = Number(element.piezas) + contPiezas3;
              break;
            case "compra-dir":
              contCajas3 = Number(contCajas3) + Number(element.cajas);
              contPiezas3 = Number(contPiezas3) + Number(element.piezas);
              break;
            case "compra":
              contCajas3 = Number(contCajas3) + Number(element.cajas);
              contPiezas3 = Number(contPiezas3) + Number(element.piezas);
              break;
            case "compra_obs":
              contCajas3 = Number(contCajas3) + Number(element.cajas);
              contPiezas3 = Number(contPiezas3) + Number(element.piezas);
              break;
            case "ajuste-faltante":
              contCajas3 = Number(contCajas3) - Number(element.cajas);
              contPiezas3 = Number(contPiezas3) - Number(element.piezas);
              break;
            case "baja":
              contCajas3 = Number(contCajas3) - Number(element.cajas);
              contPiezas3 = Number(contPiezas3) - Number(element.piezas);
              break;
            case "venta-fact":
              contCajas3 = Number(contCajas3) - Number(element.cajas);
              contPiezas3 = Number(contPiezas3) - Number(element.piezas);
              break;
            case "venta-not":
              contCajas3 = Number(contCajas3) - Number(element.cajas);
              contPiezas3 = Number(contPiezas3) - Number(element.piezas);
              break;
            case "traslado1":
              contCajas3 = Number(contCajas3) - Number(element.cajas);
              contPiezas3 = Number(contPiezas3) - Number(element.piezas);
              break;
            case "traslado2":
              contCajas3 = Number(contCajas3) + Number(element.cajas);
              contPiezas3 = Number(contPiezas3) + Number(element.piezas);
              break;
            case "ajuste-sobrante":
              contCajas3 = Number(contCajas3) + Number(element.cajas);
              contPiezas3 = Number(contPiezas3) + Number(element.piezas);
              break;

            default:
          }
        }
      });
      var cantidadRestante = 0;
      this.invetarioProd = new inventario();
      this.invetarioProd.producto = element2;
      this.invetarioProd.cantidadCajas = contCajas;
      this.invetarioProd.cantidadCajas2 = contCajas2;
      this.invetarioProd.cantidadCajas3 = contCajas3;

      this.invetarioProd.cantidadPiezas = contPiezas;
      this.invetarioProd.cantidadPiezas2 = contPiezas2;
      this.invetarioProd.cantidadPiezas3 = contPiezas3;
      this.invetarioProd.bodega = "S1 (" + element2.ubicacionSuc1 +" ) S2 (" + element2.ubicacionSuc2 + ") S3(" + element2.ubicacionSuc3 +")";

      this.invetarioProd.ultimoPrecioCompra = element2.ultimoPrecioCompra;
      this.invetarioProd.ultimaFechaCompra = element2.ultimaFechaCompra;
      this.invetarioProd.notas = element2.notas;
      this.invetarioProd.execute = false;
      if (this.invetarioProd.producto.PRODUCTO == nombreProducto) {
        this.invetarioP.push(this.invetarioProd);
      }

      contCajas = 0;
      contPiezas = 0;
      contCajas2 = 0;
      contPiezas2 = 0;
      contCajas3 = 0;
      contPiezas3 = 0;
    }
    this.transformarM2();
  }

  //desde aqui comienza seccion de consolidado

  
  transformarM2() {
    this.invetarioP.forEach((element) => {
      element.cantidadM2 = parseFloat((element.producto.M2 * element.cantidadCajas +(element.cantidadPiezas * element.producto.M2) /element.producto.P_CAJA).toFixed(2));
      element.cantidadM2b2 = parseFloat((element.producto.M2 * element.cantidadCajas2 +(element.cantidadPiezas2 * element.producto.M2) / element.producto.P_CAJA).toFixed(2));
      element.cantidadM2b3 = parseFloat((element.producto.M2 * element.cantidadCajas3 +(element.cantidadPiezas3 * element.producto.M2) /element.producto.P_CAJA).toFixed(2));
      element.totalb1 = parseFloat((element.cantidadM2 * element.producto.precio).toFixed(2));
      element.totalb2 = parseFloat((element.cantidadM2b2 * element.producto.precio).toFixed(2));
      element.totalb3 = parseFloat((element.cantidadM2b3 * element.producto.precio).toFixed(2));
    });
    //this.sumarProductosRestados();
    this.cambiarValores();
    this.controlarInventario();
  }

  sumarProductosRestados() {
    for (let index = 0; index < this.productos.length; index++) {
      const element = this.productos[index];
      this.invetarioP.forEach((element2) => {
        if (!element2.execute) {
          if (element.PRODUCTO == element2.producto.PRODUCTO) {
            //element2.cantidadM2 = element2.cantidadM2 + element.suc1Pendiente;
            //element2.cantidadM2b2 = element2.cantidadM2b2 + element.suc2Pendiente;
            //element2.cantidadM2b3 = element2.cantidadM2b3 + element.suc3Pendiente;
            element2.cantidadM2 = element2.cantidadM2;
            element2.cantidadM2b2 = element2.cantidadM2b2;
            element2.cantidadM2b3 = element2.cantidadM2b3;
            element2.execute = true;
          }
        }
      });
    }
  }

   controlarInventario() {
    this.invetarioP.forEach((element) => {
      if (element.cantidadM2 < 0) {
        this.invetarioFaltante1 = new invFaltanteSucursal();
        this.invetarioFaltante1.producto = element.producto;
        this.invetarioFaltante1.cantidadCajas = element.cantidadCajas;
        this.invetarioFaltante1.cantidadPiezas = element.cantidadPiezas;
        this.invetarioFaltante1.cantidadM2 = element.cantidadCajas;
        this.invetarioFaltante1.totalb1 = element.totalb1;
        this.invetarioFaltante1.sucursal = "Matriz";
        this.invetarioFaltante.push(this.invetarioFaltante1);
      }
      if (element.cantidadM2b2 < 0) {
        this.invetarioFaltante1 = new invFaltanteSucursal();
        this.invetarioFaltante1.producto = element.producto;
        this.invetarioFaltante1.cantidadCajas = element.cantidadCajas2;
        this.invetarioFaltante1.cantidadPiezas = element.cantidadPiezas2;
        this.invetarioFaltante1.cantidadM2 = element.cantidadCajas2;
        this.invetarioFaltante1.totalb1 = element.totalb2;
        this.invetarioFaltante1.sucursal = "Sucursal 1";
        this.invetarioFaltante.push(this.invetarioFaltante1);
      }
      if (element.cantidadM2b3 < 0) {
        this.invetarioFaltante1 = new invFaltanteSucursal();
        this.invetarioFaltante1.producto = element.producto;
        this.invetarioFaltante1.cantidadCajas = element.cantidadCajas3;
        this.invetarioFaltante1.cantidadPiezas = element.cantidadPiezas3;
        this.invetarioFaltante1.cantidadM2 = element.cantidadCajas3;
        this.invetarioFaltante1.totalb1 = element.totalb3;
        this.invetarioFaltante1.sucursal = "Sucursal 2";
        this.invetarioFaltante.push(this.invetarioFaltante1);
      }
    });
    this.ajustarSaldos();
  }

  ajustarSaldos() {
    var producto = this.productosActivos.find(element=> element.PRODUCTO == this.productoEntregado);
    console.log(this.auditoria)
    this.invetarioP.forEach((element) => {
      switch (this.auditoria.sucursal.nombre) {
        case "matriz":
          this.auditoria.cajas_sistema= element.cantidadCajas;
          this.auditoria.piezas_sistema=  element.cantidadPiezas;
          this.auditoria.m2base = element.cantidadM2
          this.ubicaciones = producto.ubicacionSuc1
          break;
        case "sucursal1":
          this.auditoria.cajas_sistema= element.cantidadCajas2;
          this.auditoria.piezas_sistema=  element.cantidadPiezas2;
          this.auditoria.m2base = element.cantidadM2b2
          this.ubicaciones = producto.ubicacionSuc2
          break;
        case "sucursal2":
          this.auditoria.cajas_sistema= element.cantidadCajas3;
          this.auditoria.piezas_sistema=  element.cantidadPiezas3;
          this.auditoria.m2base = element.cantidadM2b3
          this.ubicaciones = producto.ubicacionSuc3
          break;
        default:
          break;
      }
    });
    this.calcularTotalM2();
    this.mostrarLoading = false;
  }


  cambiarValores() {
    this.invetarioP.forEach((element) => {
      element.cantidadCajas = Math.trunc(element.cantidadM2 / element.producto.M2);
      element.cantidadPiezas = parseInt(((element.cantidadM2 * element.producto.P_CAJA) / element.producto.M2 -element.cantidadCajas * element.producto.P_CAJA).toFixed(0));
      element.cantidadM2 = parseFloat(element.cantidadM2.toFixed(2));

      element.cantidadCajas2 = Math.trunc(element.cantidadM2b2 / element.producto.M2);
      element.cantidadPiezas2 = parseInt(((element.cantidadM2b2 * element.producto.P_CAJA) /element.producto.M2 - element.cantidadCajas2 * element.producto.P_CAJA).toFixed(0));
      element.cantidadM2b2 = parseFloat(element.cantidadM2b2.toFixed(2));

      element.cantidadCajas3 = Math.trunc(element.cantidadM2b3 / element.producto.M2);
      element.cantidadPiezas3 = parseInt(((element.cantidadM2b3 * element.producto.P_CAJA) /element.producto.M2 - element.cantidadCajas3 * element.producto.P_CAJA).toFixed(0));
      element.cantidadM2b3 = parseFloat(element.cantidadM2b3.toFixed(2));
    });
  }


  exportarPDF(){
    this.mensajeLoading = "Descargando"
    this.mostrarLoading = true;
    const documentDefinition = this.getDocumentDefinition();
    pdfMake.createPdf(documentDefinition).download("Auditoria " + this.dataAuditoria.idAuditoria, function () {});
    this.mostrarLoading = false;
  }


  getDocumentDefinition() {
    sessionStorage.setItem("resume", JSON.stringify("jj"));
    return {
      pageSize: "A4",
      pageOrientation: "portrait",
      content: [
        {
          columns: [
            [
              {
                columns: [
                  {
                    width: 320,
                    text: "AUDITORIA DE INVENTARIO 001 - 000",
                    bold: true,
                    fontSize: 18,
                  },
                  {
                    width: 200,
                    text: "NO 0000" + this.dataAuditoria.idAuditoria,
                    color: "red",
                    bold: true,
                    fontSize: 20,
                    alignment: "right",
                  },
                ],
              },
              { text: "Datos Auditoria", alignment: "center", bold: true },
              {
                //Desde aqui comienza los datos del cliente
                style: "tableExample",
                table: {
                  widths: [130, 365],
                  body: [
                    [
                      {
                        stack: [
                          {
                            type: "none",
                            bold: true,
                            fontSize: 9,
                            ul: [
                              "Fecha Inicio",
                              "Sucursal",
                            ],
                          },
                        ],
                      },
                      [
                        {
                          stack: [
                            {
                              type: "none",
                              fontSize: 9,
                              ul: [
                                "" + this.dataAuditoria.fecha_inicio,
                                "" + this.dataAuditoria.sucursal.nombre,
                              ],
                            },
                          ],
                        },
                      ],
                    ],
                  ],
                },
              },
            ],
            [],
          ],
        },

        this.getProductosAuditoria(this.auditoriaProductosleida),
      ],
      pageBreakBefore: function (
        currentNode,
        followingNodesOnPage,
        nodesOnNextPage,
        previousNodesOnPage
      ) {
        return (
          currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
        );
      },

      images: {
        mySuperImage: "data:image/jpeg;base64,...content...",
      },
      info: {
        title: "Auditoria",
        author: "this.resume.name",
        subject: "RESUME",
        keywords: "RESUME, ONLINE RESUME",
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: "underline",
        },
        textoPro: {
          bold: true,
          margin: [0, -12, 0, -5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableExample2: {
          margin: [-13, 5, 10, 15],
        },
        tableExample3: {
          margin: [-13, -10, 10, 15],
        },
        tableExample4: {
          margin: [10, -5, 0, 15],
        },
        texto6: {
          fontSize: 14,
          bold: true,
          alignment: "center",
        },
        name: {
          fontSize: 16,
          bold: true,
        },
        jobTitle: {
          fontSize: 14,
          bold: true,
          italics: true,
        },
        textFot: {
          alignment: "center",
          italics: true,
          color: "#bebebe",
          fontSize: 18,
        },
        tableHeader: {
          bold: true,
        },
        tableHeader2: {
          bold: true,
          fontSize: 10,
        },

        fondoFooter: {
          fontSize: 8,
          alignment: "center",
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
          margin: [15, 0, 0, 0],
        },
      },
    };
  }


  getProductosAuditoria(auditoriaProductosleida: auditoriasProductos[]) {
    return {
      table: {
        widths: ["34%", "7%", "7%", "7%", "7%", "8%", "8%", "11%", "11%"],
        alignment: "center",
        fontSize: 7,
        body: [
          [
            {
              text: "Producto",
              style: "tableHeader2",
              fontSize: 7,
              alignment: "center",
            },
            {
              text: "Cajas Sistema",
              style: "tableHeader2",
              fontSize: 7,
              alignment: "center",
            },
            {
              text: "Piezas Sistema",
              style: "tableHeader2",
              fontSize: 7,
              alignment: "center",
            },
            {
              text: "Cajas Físico",
              style: "tableHeader2",
              fontSize: 7,
              alignment: "center",
            },
            {
              text: "Piezas Físico",
              style: "tableHeader2",
              fontSize: 7,
              alignment: "center",
            },
            {
              text: "Cajas Diferencia",
              style: "tableHeader2",
              fontSize: 7,
              alignment: "center",
            },
            {
              text: "Piezas Diferencia",
              style: "tableHeader2",
              fontSize: 7,
              alignment: "center",
            },
            {
              text: "Condición",
              style: "tableHeader2",
              fontSize: 7,
              alignment: "center",
            },
            {
              text: "Impacto",
              style: "tableHeader2",
              fontSize: 7,
              alignment: "center",
            },
          ],

          ...auditoriaProductosleida.map((ed) => {
            return [
              { text: ed.nombreproducto, fontSize: 7, alignment: "center" },
              { text: ed.cajas_sistema, alignment: "center", fontSize: 7 },
              { text: ed.piezas_sistema, alignment: "center", fontSize: 7 },
              { text: ed.cajas_fisico, alignment: "center", fontSize: 7 },
              { text: ed.piezas_fisico, alignment: "center", fontSize: 7 },
              { text: ed.cajas_diferencia, alignment: "center", fontSize: 7 },
              { text: ed.piezas_diferencia, alignment: "center", fontSize: 7 },
              { text: ed.condicion, alignment: "center", fontSize: 7 },
              { text: ed.impacto, alignment: "center", fontSize: 7 },
            ];
          }),
        ],
      },
    };
  }

}
