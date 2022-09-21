import { Component, OnInit, ViewChild } from '@angular/core';
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { SucursalesService } from 'src/app/servicios/sucursales.service';
import { ProductoService } from 'src/app/servicios/producto.service';
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
import { comparacionResultadosRevision, controlInventario, controlRevisionProductos, detalleProductoRevisado } from './revision-inventario';
import { auditoria, coincidencias } from '../auditorias/auditorias';
import { RevisionInventarioService } from 'src/app/servicios/revision-inventario.service';
import { RevisionInventarioProductoService } from 'src/app/servicios/revision-inventario-productos.service';
import { TransaccionesService } from 'src/app/servicios/transacciones.service';
import { element } from 'protractor';
import { TransaccionesRevisionProductoService } from 'src/app/servicios/transaccionesRevisionProducto.service';

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
  revisionIniciada: controlInventario = new controlInventario()
  listadoComparacionResultados : comparacionResultadosRevision[]=[]
  transaccionesProductosRevisados : comparacionResultadosRevision[]=[]
  listadoControlesRevisiones : controlRevisionProductos[]=[]
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
  isNew = true;
  mostrarbtn = false;
  verListadoComparacion = false;
  bloquearBtn = false;
  
  menuIngresos: string[] = [
    "Nueva Revision",
    "Ver Listado"
  ];

  menu: string[] = [
    "Nueva Revision",
    "Ver Transacciones",
    "Listado Productos",
  ];

  verListadoTransacciones = false;
  verListadoProductos = false;
  seccionNew = true;
  mostrarMenu = true;



  locales: Sucursal[]=[]
  productosActivos: producto[]=[]
  productos: producto[]=[]
  nombreSucursal:string
  number_transaccion:number=0

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

  sucursalesLista: string[] = [
    'Matriz',
    'Sucursal1',
    'Sucursal2'
  ];

  sucursal = "Matriz"

  

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
    public _transaccionesService : TransaccionesService,
    public _transaccionesRevisionProductoService : TransaccionesRevisionProductoService,
    public authService: AuthService,
    private rutaActiva: ActivatedRoute,
    public authenService:AuthenService, 
    
    public parametrizacionService: ParametrizacionesService,
    public sucursalesService: SucursalesService , 
    public productoService:ProductoService) { 
      this.proTransaccion = new productoTransaccion();
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
    this.traerSucursales()
    this.traerOpcionesCatalogo()
    this.traerContadoresDocumentos()
    this.traerRevisionesInventario()
  }



  traerOpcionesCatalogo(){
    this._opcionesCatalogoService.getOpciones().subscribe(res => {
      this.opcionesCatalogo = res as opcionesCatalogo[];
      this.llenarCombos()
    })
  }


  traerRevisionesInventario(){
    this.listadoRevisiones = [];
    this._revisionInventarioService.getRevisionesIniciadas().subscribe(res => {
      this.listadoRevisiones = res as controlInventario[];
      if(this.idRevision != "0"){
        var revision = this.listadoRevisiones.find(element=> element.idDocumento == Number(this.idRevision))
        if(revision != null){
          this.traerRevisionesInventarioProductosPorId()
        }
        else{
          this.bloquearboton = true;
          this.mostrarMensajeGenerico(2,"El proceso de revision ha culminado")
        }
          
      }
      this.separarRevisiones()
      
    })
  }

  traerRevisionesInventarioProductosPorId(){
    this.listadoProductosRevisados = [];
    this._revisionInventarioProductoService.getRevisionesProductosPorId(this.idRevision).subscribe(res => {
      this.listadoProductosRevisados = res as detalleProductoRevisado[];
    })
  }

  traertransaccionesProductosRevisados(){
    this.transaccionesProductosRevisados = [];
    this._transaccionesRevisionProductoService.getTransacciones().subscribe(res => {
      this.transaccionesProductosRevisados = res as comparacionResultadosRevision[];
    })
  }

  generarListadoControlInventario(sucursal : string){
    this.transaccionesProductosRevisados = [];
    this.listadoControlesRevisiones = [];
    this._transaccionesRevisionProductoService.getTransacciones().subscribe(res => {
      this.transaccionesProductosRevisados = res as comparacionResultadosRevision[];
      this.productosActivos.forEach(element=>{
        var newControl = new controlRevisionProductos()
        newControl.producto = element.PRODUCTO
        var datos = this.transaccionesProductosRevisados.filter(element2=>element2.producto == element.PRODUCTO && element2.sucursal == sucursal);
        var data = datos[datos?.length-1];
        let days = new Date().getDay() - new Date(data?.fecha).getDay();
        newControl.cajas_diferencia = data?.cajas_diferencia ?? 0;
        newControl.piezas_diferencia = data?.piezas_diferencia ?? 0;
        newControl.fecha = data?.fecha;
        newControl.resultado = data?.resultado;
        newControl.detalle = data?.detalle;
        newControl.idReferenciaRevision = data?.idReferenciaRevision;
        newControl.novedades = data?.novedades;
        newControl.responsable = data?.responsable;
        newControl.nombreClasificacion = element.CLASIFICA;
        newControl.diferenciaDias = days.toString() != "NaN" ? days.toString() : "";
        this.listadoControlesRevisiones.push(newControl)
      })
    })
    //this.listadoControlesRevisiones.sort(this.SortArray)
    
  }

  SortArray(x, y){
    if (x.producto < y.producto) {return -1;}
    if (x.producto > y.producto) {return 1;}
    return 0;
  }

  separarRevisiones(){
    this.listadoRevisionesIniciadas = [];
    this.listadoRevisiones.forEach(element=>{
      if(element.estado == "Iniciada")
        this.listadoRevisionesIniciadas.push(element)
    })
    this.traerProductos()
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
    this.bloquearboton = false;
    this.listadoProductosRevisados.forEach(element=>{
        if(element.producto == e.value){
          this.bloquearboton = true;
          this.mostrarMensajeGenerico(2,"El producto ya se encuentra revisado")
          return;
        }
    })
  }

  traerTransaccionesPorProducto(nombreProducto, indice) {
    this.mensajeLoading = "Buscando datos";
    this.mostrarLoading = true;
    this.proTransaccion.nombre = nombreProducto;
    this._transaccionesService.getTransaccionesPorProducto(this.proTransaccion).subscribe((res) => {
      this.transacciones = res as transaccion[];
      this.cargarDatosProductoUnitario(nombreProducto, indice);
    });

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
    if(this.productosActivos.length == 0){
      this.mostrarLoading = true;
      this.productoService.getProductosActivos().subscribe(res => {
        this.productosActivos = res as producto[];
        this.llenarComboProductos()
      })
    }
  }


  llenarComboProductos(){
    if(this.idRevision != "0"){
      var rev = this.listadoRevisiones?.find(element=>element.idDocumento == Number(this.idRevision));
      var categoria = rev?.nombreClasificacion;
      if(categoria != null){
        this.productos = this.productosActivos;
        this.productos = this.productos.filter(element=> element.CLASIFICA == categoria);
        this.productos22 = new DataSource({  
          store: this.productos,  
          sort: [{ field: "PRODUCTO", asc: true }],    
        });
      }
      this.mostrarLoading = false;
    }
    else{
      this.mostrarLoading = false;
      this.productos22 = new DataSource({  
        store: this.productosActivos,  
        sort: [{ field: "PRODUCTO", asc: true }],    
      });
    }
      
  }

  cerrarRevision(){
    var cont = 0;
    this.mensajeLoading = "Guardando Transacciones.."
    this.mostrarLoading = true;
    this.listadoComparacionResultados.forEach(element=>{
      
      this._transaccionesRevisionProductoService.newTransaccion(element).subscribe( 
        res => { 
          cont++;
          this.actualizarEstadoRevision(cont)  }, 
        err => { this.mostrarMensajeGenerico(2,"Se ha producido un error al guardar")
      })
    })
  }


  actualizarEstadoRevision(contador : number){
    console.log(contador)
    console.log(this.listadoComparacionResultados)
    if(contador == this.listadoComparacionResultados.length){
      this._revisionInventarioService.updateEstado(this.revisionIniciada._id , "Finalizada").subscribe( 
      res => { 
        this.mostrarLoading = false;
        Swal.close()
        Swal.fire({
          title: 'Correcto',
          text: 'Se realizó su proceso con éxito',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          window.location.reload()
        })}, 
      err => { this.mostrarMensajeGenerico(2,"Se ha producido un error al guardar")})
    }
    
  }


  onExporting2 (e) {
    e.component.beginUpdate();
    e.component.columnOption("idReferenciaRevision", "visible", true);
    e.component.columnOption("sucursal", "visible", true);
    e.component.columnOption("responsable", "visible", true);
    e.component.columnOption("nombreClasificacion", "visible", true);
  };


  onExported2 (e) {
    e.component.columnOption("idReferenciaRevision", "visible", false);
    e.component.columnOption("sucursal", "visible", false);
    e.component.columnOption("responsable", "visible", false);
    e.component.columnOption("nombreClasificacion", "visible", false);
    e.component.endUpdate();
  }


  onExporting3 (e) {
    e.component.beginUpdate();
    e.component.columnOption("responsable", "visible", true);
    e.component.columnOption("nombreClasificacion", "visible", true);
    e.component.columnOption("cajas_sistema", "visible", true);
    e.component.columnOption("piezas_sistema", "visible", true);
    e.component.columnOption("cajas_conteo", "visible", true);
    e.component.columnOption("piezas_conteo", "visible", true);
    e.component.columnOption("detalle", "visible", true);
    
  };
  onExported3 (e) {
    e.component.columnOption("responsable", "visible", false);
    e.component.columnOption("nombreClasificacion", "visible", false);
    e.component.columnOption("cajas_sistema", "visible", false);
    e.component.columnOption("piezas_sistema", "visible", false);
    e.component.columnOption("cajas_conteo", "visible", false);
    e.component.columnOption("piezas_conteo", "visible", false);
    e.component.columnOption("detalle", "visible", false);
    e.component.endUpdate();
  }

  opcionMenuIngresos(e){
    switch (e.value) {
      case  "Nueva Revision":
          this.isNew = true;
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


  opcionMenuPrincipal(e){
    switch (e.value) {
      case  "Nueva Revision":
          this.seccionNew = true;
          this.newAud = true;
          this.verListadoTransacciones = false;
          this.verListadoProductos = false;
       break;
      case "Ver Transacciones":
          if(this.transaccionesProductosRevisados.length == 0) 
            this.traertransaccionesProductosRevisados();
          this.seccionNew = false;
          this.newAud = false;
          this.newIngreso = false;
          this.verListadoIngreso = false;
          this.verListadoTransacciones = true;
          this.verListadoProductos = false;
        break;
      case "Listado Productos":
          if(this.listadoControlesRevisiones.length == 0) 
            this.generarListadoControlInventario("matriz")
          this.seccionNew = false;
          this.newAud = false;
          this.newIngreso = false;
          this.verListadoIngreso = false;
          this.verListadoTransacciones = false;
          this.verListadoProductos = true;
        break;
      default:    
    }     
  }



  verLista(id:number){
    this.mostrarbtn = true;
    //this.mostrarLoading = true;
    this.verListadoComparacion = true;
    this.newAud = false;
    this.listadoProductosRevisados = [];
    var idP = id;
    this.revisionIniciada = this.listadoRevisionesIniciadas.find(element=> element.idDocumento == id);
    this._revisionInventarioProductoService.getRevisionesProductosPorId(id.toString()).subscribe(res => {
      this.listadoProductosRevisados = res as detalleProductoRevisado[];
      this.crearListadoComparacion();
    })
  }

  retornar(){
    this.verListadoComparacion = false;
    this.newAud = true;
    this.mostrarbtn = false;
  }


  crearListadoComparacion(){
    this.listadoProductosRevisados.forEach((element, index)=>{
      var newComparacion = new comparacionResultadosRevision();
      newComparacion._id = element._id
      newComparacion.producto = element.producto
      newComparacion.novedades = element.novedades
      newComparacion.cajas_conteo = element.cajas
      newComparacion.piezas_conteo = element.piezas
      newComparacion.detalle = element.detalle
      newComparacion.fecha = element.fecha
      newComparacion.sucursal = this.revisionIniciada.sucursal
      newComparacion.responsable = this.revisionIniciada.responsable
      newComparacion.idReferenciaRevision = this.revisionIniciada.idDocumento
      newComparacion.nombreClasificacion = this.revisionIniciada.nombreClasificacion
      this.traerTransaccionesPorProducto(element.producto , index )
      this.listadoComparacionResultados.push(newComparacion)
    })
  }

  enviarMsjWhatsapp(revision : controlInventario){
    this.linkRevision = "Link de revision: "+'http://159.223.107.115:3000/#/revision-inventario/' + revision.idDocumento
    window.open('https://api.whatsapp.com/send?text='+this.linkRevision);
  }

  copiarLink(revision : controlInventario){
    this.linkRevision = "http://159.223.107.115:3000/#/revision-inventario/" + revision.idDocumento
    this.popupVisible = true;
  }


  verEdit= (e) =>{
    this.editarPro(e.row.data)
  }

  verEdit2= (e) =>{
    this.editarPro2(e.row.data)
  }

  eliminarProd = (e) => {
    this.eliminarRevisionProducto(e.row.data)
  }

  eliminarProd2 = (e) => {
    this.eliminarRevisionProducto2(e.row.data)
  }

  editarPro(e:any){
    this.productoRevisado = e
    this.newIngreso = true;
    this.verListadoIngreso = false;
    this.isNew = false;
  }

  editarPro2(e:any){
    this.productoRevisado._id = e._id
    this.productoRevisado.producto = e.producto
    this.productoRevisado.cajas = e.cajas_conteo
    this.productoRevisado.piezas = e.piezas_conteo
    this.productoRevisado.detalle = e.detalle
    this.productoRevisado.novedades = e.novedades
    this.mostrarSeccionIngresos = true;
    this.seccionNew = false;
    this.isNew = false;
    this.mostrarMenu = false;
  }


opcionRadioTipos(e){
    switch (e.value) {
      case "Matriz":
        this.generarListadoControlInventario("matriz")
        break;
      case "Sucursal1":
        this.generarListadoControlInventario("sucursal1")
        break;
      case "Sucursal2":
        this.generarListadoControlInventario("sucursal2")
        break;
      default:    
    }      
  }


 
  guardarRegistro(){
    this._revisionInventarioService.newRevisionInventario(this.newControlInventario).subscribe( 
      res => {  this.actualizarContador(); }, 
      err => {  this.mostrarMensajeGenerico(2,"Se ha producido un error al guardar")})
  }

  validarRevision(){

    this.newControlInventario.fecha_inicio = this.fecha_inicio;
    this.newControlInventario.nombreClasificacion = this.nombreClasificacion;
    this.newControlInventario.sucursal = this.nameSucursal;

    if(this.newControlInventario.responsable == " "){
      this.mostrarMensajeGenerico(2,"Ingrese un responsable")
      return;
    }
    if(this.newControlInventario.sucursal == ""){
      this.mostrarMensajeGenerico(2,"Escoja una sucursal")
      return;
    }
    if(this.newControlInventario.nombreClasificacion == ""){
      this.mostrarMensajeGenerico(2,"Escoja un grupo de producto")
      return;
    }

    var data = this.listadoRevisionesIniciadas.find(element => element.sucursal == this.newControlInventario.sucursal && element.nombreClasificacion == this.newControlInventario.nombreClasificacion)
    console.log(data)
    if(data != null){
      this.mostrarMensajeGenerico(2,"Ya hay una revisión iniciada con los mismos datos");
      return;
    }

    this.obtenerId();
      
  }

  obtenerId(){
    this.mensajeLoading = "Guardando";
    this.mostrarLoading = true;
    var IdNum = new Promise<any>((resolve, reject) => {
      try {
        this._revisionInventarioService.getRevisionPorIdConsecutivo(this.newControlInventario).subscribe(res => {
        var listado = res as controlInventario[];
          if(listado.length == 0){
            resolve("listo");
          }else{
            this.newControlInventario.idDocumento = this.newControlInventario.idDocumento + 1
            this.obtenerId();
          }         
          },(err) => {});
      } catch (error) {
      } 
    })

    IdNum.then((data) => {
      this.guardarRegistro();
    })
  }


  guardarRegistroProducto(){
    this.mensajeLoading = "Guardando.."
    this.mostrarLoading = true;
    this.productoRevisado.idReferenciaRevision = Number(this.idRevision);

    this._revisionInventarioProductoService.newRevisionInventarioProducto(this.productoRevisado).subscribe( 
      res => {  this.mostrarLoading = false;
                this.reiniciarFormulario();
                this.mostrarMensajeGenerico(1,"Se ha registrado con éxito") }, 
      err => {  this.mostrarMensajeGenerico(2,"Se ha producido un error al guardar")})
  }


  actualizarRegistroProducto(){
    this.mensajeLoading = "Guardando.."
    this.mostrarLoading = true;
    this._revisionInventarioProductoService.updateRevisionProducto(this.productoRevisado).subscribe( 
    res => {  this.mostrarLoading = false;
              Swal.fire({
                title: 'Producto Actualizado',
                text: 'Se ha actualizado con éxito',
                icon: 'success',
                confirmButtonText: 'Ok'
              }).then((result) => {
                window.location.reload()
              })
              }, 
              //this.mostrarMensajeGenerico(1,"Se ha actualizado con éxito") }, 
    err => {  this.mostrarMensajeGenerico(2,"Se ha producido un error al guardar")})
  }

  reiniciarFormulario(){
    this.productoRevisado = new detalleProductoRevisado();
    this.traerRevisionesInventarioProductosPorId()
  }


  actualizarContador(){
    this.contadores[0].revisionInventario_Ndocumento = this.newControlInventario.idDocumento
    this._contadoresService.updateIdRevisionInventario(this.contadores[0]).subscribe( res => {
      this.mostrarMensajeGenerico(1,"Se ha registrado con éxito")
      this.mostrarLoading = false;
      this.newControlInventario.responsable = ""
      this.traerRevisionesInventario();
    },err => {})
  }


  eliminarRevisionProducto(e:any){
    Swal.fire({
      title: 'Alerta',
      text: "Está seguro de eliminar el producto revisado?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this._revisionInventarioProductoService.deleteRevisionProducto(e).subscribe(res => {
          this.reiniciarFormulario();
          this.mostrarMensajeGenerico(1,"Se realizó su proceso con éxito")
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


  eliminarRevisionProducto2(e:any){
    Swal.fire({
      title: 'Alerta',
      text: "Está seguro de eliminar el producto revisado?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this._revisionInventarioProductoService.deleteRevisionProducto(e).subscribe(res => {
          this.listadoComparacionResultados = this.listadoComparacionResultados.filter(element=> element._id !== e._id)
          this.mostrarMensajeGenerico(1,"Se realizó su proceso con éxito")
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



  eliminarRevisionIniciada(e : any){
    this.listadoProductosRevisados = [];
    this._revisionInventarioProductoService.getRevisionesProductosPorId(e.idDocumento.toString()).subscribe(res => {
      var listado = res as detalleProductoRevisado[];
      if(listado.length == 0){
        Swal.fire({
          title: 'Alerta',
          text: "Está seguro de eliminar el proceso de revisión #" + e.idDocumento,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            this._revisionInventarioService.deleteRevision(e).subscribe(res => {
              this.traerRevisionesInventario();
              this.mostrarMensajeGenerico(1,"Se realizó su proceso con éxito")
            })
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Cancelado!',
              'Se ha cancelado su proceso.',
              'error'
            )
          }
        })
      }else{
        this.mostrarMensajeGenerico(2,"Ya hay productos revisados para este item")
      }
    })
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

            if(this.usuarioLogueado[0].rol == "Administrador")
              this.mostrarBloqueo = true;
              
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
  cargarDatosProductoUnitario(nombreProducto, indice: number) {
    var contCajas = 0;
    var contCajas2 = 0;
    var contCajas3 = 0;
    var contPiezas = 0;
    var contPiezas2 = 0;
    var contPiezas3 = 0;
    for (let index = 0; index < this.productosActivos.length; index++) {
      const element2 = this.productosActivos[index];

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
      if (this.invetarioProd.producto.PRODUCTO == nombreProducto)
        this.invetarioP.push(this.invetarioProd);

      contCajas = 0;
      contPiezas = 0;
      contCajas2 = 0;
      contPiezas2 = 0;
      contCajas3 = 0;
      contPiezas3 = 0;
    }
    this.transformarM2(indice);
  }

  //desde aqui comienza seccion de consolidado

  
  transformarM2(indice) {
    this.invetarioP.forEach((element) => {
      element.cantidadM2 = parseFloat((element.producto.M2 * element.cantidadCajas +(element.cantidadPiezas * element.producto.M2) /element.producto.P_CAJA).toFixed(2));
      element.cantidadM2b2 = parseFloat((element.producto.M2 * element.cantidadCajas2 +(element.cantidadPiezas2 * element.producto.M2) / element.producto.P_CAJA).toFixed(2));
      element.cantidadM2b3 = parseFloat((element.producto.M2 * element.cantidadCajas3 +(element.cantidadPiezas3 * element.producto.M2) /element.producto.P_CAJA).toFixed(2));
      element.totalb1 = parseFloat((element.cantidadM2 * element.producto.precio).toFixed(2));
      element.totalb2 = parseFloat((element.cantidadM2b2 * element.producto.precio).toFixed(2));
      element.totalb3 = parseFloat((element.cantidadM2b3 * element.producto.precio).toFixed(2));
    });
    this.cambiarValores();
    this.controlarInventario(indice);
  }


  controlarInventario(indice:number) {
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
    this.ajustarSaldos(indice);
  }

  ajustarSaldos(indice:number) {
    this.invetarioP.forEach((element) => {
      this.newControlInventario.sucursal = "matriz"
      switch (this.newControlInventario.sucursal) {
        case "matriz":
          this.listadoComparacionResultados[indice].cajas_sistema = element.cantidadCajas;
          this.listadoComparacionResultados[indice].piezas_sistema = element.cantidadPiezas;
          this.listadoComparacionResultados[indice].m2_sistema = element.cantidadM2;
          break;
        case "sucursal1":
          this.listadoComparacionResultados[indice].cajas_sistema = element.cantidadCajas2;
          this.listadoComparacionResultados[indice].piezas_sistema = element.cantidadPiezas2;
          this.listadoComparacionResultados[indice].m2_sistema = element.cantidadM2b2;
          break;
        case "sucursal2":
          this.listadoComparacionResultados[indice].cajas_sistema = element.cantidadCajas3;
          this.listadoComparacionResultados[indice].piezas_sistema = element.cantidadPiezas3;
          this.listadoComparacionResultados[indice].m2_sistema = element.cantidadM2b3;
          break;
        default:
          break;
      }
    });

    var prod = this.productosActivos.find(element=> element.PRODUCTO == this.listadoComparacionResultados[indice].producto)
    this.listadoComparacionResultados[indice].m2_conteo=parseFloat(((prod.M2*this.listadoComparacionResultados[indice].cajas_conteo)+((this.listadoComparacionResultados[indice].piezas_conteo*prod.M2)/prod.P_CAJA)).toFixed(2))
    

    if(prod.CLASIFICA != "Ceramicas" && prod.CLASIFICA != "Porcelanatos" ){
      this.listadoComparacionResultados[indice].m2_diferencia=this.listadoComparacionResultados[indice].m2_conteo - this.listadoComparacionResultados[indice].m2_sistema
    }else{
      if(this.listadoComparacionResultados[indice].m2_conteo < this.listadoComparacionResultados[indice].m2_sistema)
        this.listadoComparacionResultados[indice].m2_diferencia = this.listadoComparacionResultados[indice].m2_conteo - this.listadoComparacionResultados[indice].m2_sistema - 0.04
      else
        this.listadoComparacionResultados[indice].m2_diferencia = this.listadoComparacionResultados[indice].m2_conteo - this.listadoComparacionResultados[indice].m2_sistema + 0.03
    }

    //if(this.listadoComparacionResultados[indice].m2_diferencia < 0)
      //this.listadoComparacionResultados[indice].m2_diferencia = this.listadoComparacionResultados[indice].m2_diferencia * -1


      /* if(this.editAuditoria.m2fisico<this.editAuditoria.m2base){
        this.editAuditoria.m2diferencia=this.editAuditoria.m2fisico-this.editAuditoria.m2base-0.04
      }else{
        this.editAuditoria.m2diferencia=this.editAuditoria.m2fisico-this.editAuditoria.m2base+0.03
      } */


    this.listadoComparacionResultados[indice].cajas_diferencia=Math.trunc(this.listadoComparacionResultados[indice].m2_diferencia / prod.M2);
    this.listadoComparacionResultados[indice].piezas_diferencia=Math.trunc(this.listadoComparacionResultados[indice].m2_diferencia * prod.P_CAJA /prod.M2) - (this.listadoComparacionResultados[indice].cajas_diferencia * prod.P_CAJA);

    if(this.listadoComparacionResultados[indice].m2_diferencia > 0)
      this.listadoComparacionResultados[indice].resultado = "SOBRANTE"
    else if (this.listadoComparacionResultados[indice].m2_diferencia < 0)
      this.listadoComparacionResultados[indice].resultado = "FALTANTE"
    else
      this.listadoComparacionResultados[indice].resultado = "OK"

    //this.calcularTotalM2();
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

      if(element.cantidadM2 < 0){
        element.cantidadCajas = 0;
        element.cantidadPiezas = 0;
        element.cantidadM2 = 0;
      }
      if(element.cantidadM2b2 < 0){
        element.cantidadCajas2 = 0;
        element.cantidadPiezas2 = 0;
        element.cantidadM2b2 = 0;
      }
      if(element.cantidadM2b3 < 0){
        element.cantidadCajas3 = 0;
        element.cantidadPiezas3 = 0;
        element.cantidadM2b3 = 0;
      }
    });
  }



}
