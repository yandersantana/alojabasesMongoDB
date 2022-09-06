import { Component, OnInit, ViewChild } from '@angular/core';
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { SucursalesService } from 'src/app/servicios/sucursales.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { Sucursal } from '../compras/compra';
import { producto, contadoresDocumentos } from '../ventas/venta';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import Swal from 'sweetalert2';
import { transaccion } from '../transacciones/transacciones';
import { clasificacionActualizacion, inventario, invFaltanteSucursal, productoTransaccion } from '../consolidado/consolidado';
import { user } from '../user/user';
import { AuthenService } from 'src/app/servicios/authen.service';
import { DxDataGridComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services';
import { OpcionesCatalogoService } from 'src/app/servicios/opciones-catalogo.service';
import { opcionesCatalogo } from '../catalogo/catalogo';
import { controlInventario, detalleProductoRevisado } from './revision-inventario';
import { auditoria, auditoriasProductos, coincidencias } from '../auditorias/auditorias';
import { RevisionInventarioService } from 'src/app/servicios/revision-inventario.service';
import { RevisionInventarioProductoService } from 'src/app/servicios/revision-inventario-productos.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-revision-inventario',
  templateUrl: './revision-inventario.component.html',
  styleUrls: ['./revision-inventario.component.scss']
})

export class RevionInventarioComponent implements OnInit {
  opcionesCatalogo: opcionesCatalogo[]=[]
  listaClasificacion: clasificacionActualizacion[] = [];
  nombreClasificacion = ""
  newControlInventario: controlInventario
  listadoRevisiones: controlInventario[]=[]
  listadoProductosRevisados: detalleProductoRevisado[]=[]
  listadoRevisionesIniciadas: controlInventario[]=[]
  linkRevision =""
  popupVisible = false;
  idRevision = "";
  mostrarCreacion = false;;
  mostrarSeccionIngresos = false;
  valoracion = "";
  productoRevisado : detalleProductoRevisado;
  bloquearboton = false;
  newIngreso = true;
  verListadoIngreso = false;
  menuIngresos: string[] = [
    "Nueva Revision",
    "Ver Listado"
  ];



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


  constructor(
    public _opcionesCatalogoService : OpcionesCatalogoService,
    public _revisionInventarioService : RevisionInventarioService,
    public _revisionInventarioProductoService : RevisionInventarioProductoService,
    public _contadoresService:ContadoresDocumentosService,
    public authService: AuthService,
    private rutaActiva: ActivatedRoute,
    private router:Router,
    public authenService:AuthenService, 
    
    public parametrizacionService: ParametrizacionesService,
    public sucursalesService: SucursalesService , 
    public productoService:ProductoService) { 
      this.newControlInventario = new controlInventario()
      this.productoRevisado = new detalleProductoRevisado()
      this.menuGlobal= this.menuSupervisor
      this.idRevision = this.rutaActiva.snapshot.paramMap.get("id")
      if(this.idRevision == "0")
        this.mostrarCreacion = true
      else  
        this.mostrarSeccionIngresos = true;
  }

  ngOnInit() {
    this.traerParametrizaciones()
    this.traerSucursales()
    this.traerOpcionesCatalogo()
    this.traerContadoresDocumentos()
    this.traerRevisionesInventario()
    this.traerProductos()

    if(this.idRevision != "0")
      this.traerRevisionesInventarioProductosPorId()
    
    
    /*this.traerAuditoriasProductos()
    this.cargarUsuarioLogueado()
    this.getIDDocumentos() */
  }



  traerOpcionesCatalogo(){
    this._opcionesCatalogoService.getOpciones().subscribe(res => {
      this.opcionesCatalogo = res as opcionesCatalogo[];
      this.llenarCombos()
    })
  }


  traerRevisionesInventario(){
    this._revisionInventarioService.getRevisiones().subscribe(res => {
      this.listadoRevisiones = res as controlInventario[];
      this.separarRevisiones()
    })
  }

  traerRevisionesInventarioProductosPorId(){
    this.listadoProductosRevisados = [];
    this._revisionInventarioProductoService.getRevisionesProductosPorId(this.idRevision).subscribe(res => {
      this.listadoProductosRevisados = res as detalleProductoRevisado[];
    })
  }

  separarRevisiones(){
    this.listadoRevisiones.forEach(element=>{
      if(element.estado == "Iniciada")
        this.listadoRevisionesIniciadas.push(element)
    })
  }


  llenarCombos(){
    this.opcionesCatalogo.forEach(element=>{
      element.arrayClasificación.forEach(element=>{
        var clasi = new clasificacionActualizacion()
        clasi.nombreClasificacion = element
        this.listaClasificacion.push(clasi)
      })
    })
  }

  obtenerDetallesproducto(e){
    this.listadoProductosRevisados.forEach(element=>{
        if(element.producto == e.value){
          this.bloquearboton = true;
          this.mostrarMensajeGenerico(2,"El producto ya se encuentra revisado")
        }
    })
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

  
  traerContadoresDocumentos(){
    this._contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
      this.newControlInventario.idDocumento = this.contadores[0].revisionInventario_Ndocumento + 1
    })
  }


  traerProductos(){
    this.mostrarLoading = true;
    this.productoService.getProducto().subscribe(res => {
      this.productosActivos = res as producto[];
      this.llenarComboProductos()
   })
  }


  traerProductos2(){
    this.productoService.getProductosActivos().subscribe(res => {
      this.productos = res as producto[];
    // this.cargarDatos()
   })
  }

  llenarComboProductos(){
    this.productos = this.productosActivos;
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



  opcionMenuIngresos(e){
    switch (e.value) {
      case  "Nueva Revision":
          this.newIngreso = true;
          this.verListadoIngreso = false;
       break;
      case "Ver Listado":
          this.newIngreso = false;
          this.verListadoIngreso = true;
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

   verLista(id:number){
    this.mostrarLoading = true;
    this.mostrarTablaAuditoria = true;
    var z = document.getElementById("tabla3");
      z.style.display = "none";
      this.newAud = false;
    this.auditoriaProductosleida = []

    var newAuditoria = new auditoriasProductos();
    newAuditoria.idPrincipal = id;

  }

  enviarMsjWhatsapp(revision : controlInventario){
    var link = "http://localhost:4200/#/revision-inventario/" + revision.idDocumento
    window.open('https://api.whatsapp.com/send?text='+link);
  }

  copiarLink(revision : controlInventario){
    this.linkRevision = "http://localhost:4200/#/revision-inventario/" + revision.idDocumento
    this.popupVisible = true;
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


  




  mostrar(i:number){

  }

  guardarRegistro(){
    this.mensajeLoading = "Guardando.."
    this.mostrarLoading = true;
    this.newControlInventario.fecha_inicio = this.fecha_inicio;
    this.newControlInventario.nombreClasificacion = this.nombreClasificacion;
    this.newControlInventario.sucursal = this.nameSucursal;

    this._revisionInventarioService.newRevisionInventario(this.newControlInventario).subscribe( 
      res => {  this.actualizarContador(); }, 
      err => {  this.mostrarMensajeGenerico(2,"Se ha producido un error al guardar")})
  }


  guardarRegistroProducto(){
    this.mensajeLoading = "Guardando.."
    this.mostrarLoading = true;
    this.productoRevisado.idReferenciaRevision = Number(this.idRevision);

    this._revisionInventarioProductoService.newRevisionInventarioProducto(this.productoRevisado).subscribe( 
      res => {  this.mostrarLoading = false;
                this.mostrarMensajeGenerico(1,"Se ha registrado con éxito") }, 
      err => {  this.mostrarMensajeGenerico(2,"Se ha producido un error al guardar")})
  }


  actualizarContador(){
    this.contadores[0].revisionInventario_Ndocumento = this.newControlInventario.idDocumento
    this._contadoresService.updateIdRevisionInventario(this.contadores[0]).subscribe( res => {
      this.mostrarMensajeGenerico(1,"Se ha registrado con éxito")
      this.mostrarLoading = false;
    },err => {})
  }




guardarAuditoriaProducto(){
  
}

 guardarEditAuditoriaProducto(){
  
}

  finalizarAuditoria(i:number){
    
  }

  eliminarAuditoriaProducto(e:any){
    
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

  
  }

  contadorValidaciones(i:number){
    if(this.auditoriaProductosleida.length==i)
      this.actualizarProductos()
  }

  editarAuditoriaProducto(id:string,producto:string){
    this.auditoriaProductosBase.forEach(element=>{
      if(element.idAud ==id && element.nombreproducto == producto){
        this.editAuditoria = element
        this.editAuditoria.idAud = element.idAud
        this.productoEntregado= element.nombreproducto
        this.nombreSucursal= element.sucursal.nombre
        this.mostrarTablaAuditoria = true;
       // var x = document.getElementById("editAud");
          var y = document.getElementById("tablaAuditoria");
          //x.style.display = "block";
          y.style.display = "none";
      }
    })
  }


  actualizarProductos(){

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
              //this.mostrarPopupCodigo();
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
    this.menuGlobal = this.menu
    /* if(this.usuarioLogueado[0].rol == "Administrador"){
      this.menuGlobal = this.menu
    } */
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
    if(this.auditoria.producto.CLASIFICA != "Ceramicas" && this.auditoria.producto.CLASIFICA != "Porcelanatos" )
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
         // var y = document.getElementById("newAudGlobal");
          var z = document.getElementById("tabla3");
          x.style.display = "block";
         // y.style.display = "none";
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
    console.log(producto)
    this.invetarioP.forEach((element) => {
     /*  if (element.cantidadM2 <= 0) {
        element.cantidadCajas = 0;
        element.cantidadPiezas = 0;
        element.cantidadM2 = 0;
        element.totalb1 = 0;
      }
      if (element.cantidadM2b2 <= 0) {
        element.cantidadCajas2 = 0;
        element.cantidadPiezas2 = 0;
        element.cantidadM2b2 = 0;
        element.totalb2 = 0;
      }
      if (element.cantidadM2b3 <= 0) {
        element.cantidadCajas3 = 0;
        element.cantidadPiezas3 = 0;
        element.cantidadM2b3 = 0;
        element.totalb3 = 0;
      }
      */


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



}
