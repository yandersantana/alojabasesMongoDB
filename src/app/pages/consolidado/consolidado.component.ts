import { Component, OnInit } from "@angular/core";
import { producto, productosPendientesEntrega } from "../ventas/venta";
import { transaccion } from "../transacciones/transacciones";
import {
  clasificacionActualizacion,
  inventario,
  invFaltanteSucursal,
  productoActualizable,
  productoMultiple,
  productosPorFiltros,
  productoTransaccion,
} from "./consolidado";
import { TransaccionesService } from "src/app/servicios/transacciones.service";
import { ProductoService } from "src/app/servicios/producto.service";
import { ProductosPendientesService } from "src/app/servicios/productos-pendientes.service";
import Swal from "sweetalert2";
import { BodegaService } from "src/app/servicios/bodega.service";
import { bodega } from "../producto/producto";
import { user } from "../user/user";
import { AuthenService } from "src/app/servicios/authen.service";
import DataSource from "devextreme/data/data_source";
import { OpcionesCatalogoService } from "src/app/servicios/opciones-catalogo.service";
import { catalogo, opcionesCatalogo, ProductoCombo, productosCombo } from "../catalogo/catalogo";
import { AuthService } from "src/app/shared/services";
import { CombosService } from "src/app/servicios/combos.service";
import { CatalogoService } from "src/app/servicios/catalogo.service";
import { TransaccionesRevisionProductoService } from "src/app/servicios/transaccionesRevisionProducto.service";
import { comparacionResultadosRevision } from "../revision-inventario/revision-inventario";
import { resolve } from "dns";

@Component({
  selector: "app-consolidado",
  templateUrl: "./consolidado.component.html",
  styleUrls: ["./consolidado.component.scss"],
})
export class ConsolidadoComponent implements OnInit {
  menu1: string[] = [
    "Busqueda Individual",
    "Busqueda Por Filtros",
    "Inventario General",
    "Inventario Contable",
    "Inventario Valorizado",
    "Actualizacion Productos",
  ];

  opMenu = "Busqueda Individual"

  valorMenu = "Busqueda Individual"
  mostrarLoading: boolean = false;
  popupVisible: boolean = false;
  popupVisibleNotas: boolean = false;
  popupVisiblePendientes: boolean = false;
  productos: producto[] = [];
  arregloUbicaciones1: string[] = [];
  arregloUbicaciones2: string[] = [];
  arregloUbicaciones3: string[] = [];
  arregloNotas: string[] = [];
  transacciones: transaccion[] = [];
  invetarioP: inventario[] = [];
  invetarioFaltante1: invFaltanteSucursal;
  invetarioFaltante: invFaltanteSucursal[] = [];
  invetarioProd: inventario;
  productosPendientes: productosPendientesEntrega[] = [];
  productosPendientesNoEN: productosPendientesEntrega[] = [];
  productosPendientesNoENLista: productosPendientesEntrega[] = [];
  listaClasificacion: clasificacionActualizacion[] = [];
  transaccionesProductosRevisados : comparacionResultadosRevision[]=[];
  listadoCategorias: string[] = [];
  nombreClasificacion : string = ""
  bodegas: bodega[] = [];
  bodegasMatriz: string = "";
  bodegasSucursal1: string = "";
  bodegasSucursal2: string = "";
  prodActualizable: productoActualizable;
  ubicacion1: string = "";
  ubicacion2: string = "";
  ubicacion3: string = "";
  nombreReferencia: string = "";
  nombreCasa: string = "";
  nota: string = "";
  nameProducto: string = "";
  nombreProducto: string = "";
  correo: string;
  usuarioLogueado: user;
  proTransaccion: productoTransaccion;
  productos22: DataSource;
  mensajeLoading = "Cargando los datos";
  imagenPrincipal : string
  totalCajas =0;
  totalPiezas = 0;
  totalM2 = 0;
  mostrarUser = false;
  mostrarAdmin = false;
  mostrarBusquedaIndividual = true;
  mostrarBusquedaPorFiltros = false;
  mostrarActualizacion = false;
  opcionesCatalogo: opcionesCatalogo[]=[]
  productosCatalogo:catalogo[]=[]
  catalogoLeido : catalogo
  transaccion : transaccion

  tiposBusqueda: string[] = [
      'Normal',
      'Contable'
  ];
  tipoBusqueda = "Normal"
  cantidadProductos = 0;
  titulo = "";
  popupVisibleImagenes = false;
  popupVi = false;
  imagenes:string[]
  imagenesData:string[]

  valor1 = 100
  valor2 = 100 
  valor3 = 100

  constructor(
    public bodegasService: BodegaService,
    public authenService: AuthenService,
    public authService: AuthService,
    public transaccionesService: TransaccionesService,
    public productosPendientesService: ProductosPendientesService,
    public productoService: ProductoService,
    public opcionesService : OpcionesCatalogoService,
    public _comboService : CombosService,
    public _transaccionesRevisionProductoService : TransaccionesRevisionProductoService,
    public _catalogoService: CatalogoService
  ) {
    this.proTransaccion = new productoTransaccion();
    this.prodActualizable = new productoActualizable();
  }

  ngOnInit() {
    this.cargarUsuarioLogueado();
    this.traerCatalogoUnitarios();
    this.traerProductosUnitarios();
    this.traerOpcionesCatalogo();
    this.traerBodegas();    
  }

  traerOpcionesCatalogo(){
    this.opcionesService.getOpciones().subscribe(res => {
      this.opcionesCatalogo = res as opcionesCatalogo[];
      this.llenarCombos()
   })
  }


  traerCatalogo(){
    this.productosCatalogo = [];
    this._catalogoService.getCatalogoActivos().subscribe(res => {
      this.productosCatalogo = res as catalogo[];
      this.traerProductos();
   })
  }


  traerCatalogoUnitarios(){
    this.productosCatalogo = [];
    this._catalogoService.getCatalogoActivos().subscribe(res => {
      this.productosCatalogo = res as catalogo[];
   })
  }

  llenarCombos(){
    this.opcionesCatalogo.forEach(element=>{
         element.arrayClasificación.forEach(element=>{
           var clasi = new clasificacionActualizacion()
           clasi.nombreClasificacion = element
           this.listaClasificacion.push(clasi)
           this.listadoCategorias.push(clasi.nombreClasificacion)
           this.listadoCategorias.sort(function(a, b) {
            return a.localeCompare(b);
          });
         })
    })


    
  }

  traerTransacciones() {
    this.transacciones = [];
    this.invetarioP = [];
    this.invetarioFaltante = [];
    this.productosPendientes = [];
    this.productosPendientesNoEN = [];
    this.mostrarLoading = true;
    this.transaccionesService.getTransaccion().subscribe((res) => {
      this.transacciones = res as transaccion[];
      this.traerCatalogo();
      
    });
  }

  traerTransaccionesMultiples() {
    this.transacciones = [];
    this.invetarioP = [];
    this.invetarioFaltante = [];
    this.productosPendientes = [];
    this.productosPendientesNoEN = [];
    this.mostrarLoading = true;
    var productoM = new productoMultiple();
    var arregloProductos = [];
    this.productos.forEach(element=>{ arregloProductos.push(element.PRODUCTO)})
    productoM.array = arregloProductos;
    this.transaccionesService.getTransaccionesPorProductoMultiple(productoM).subscribe((res) => {
      this.transacciones = res as transaccion[];
      this.cargarDatos();
    });
  }


  traerProductosPorFiltros() {
    var productoFiltro = new productosPorFiltros();
    productoFiltro.clasificacion = this.nombreClasificacion
    productoFiltro.nombreCasa = this.nombreCasa
    productoFiltro.nombreReferencia = this.nombreReferencia

    var filtro1 = productoFiltro.clasificacion == "" ? false : true
    var filtro2 = productoFiltro.nombreCasa == "" ? false : true
    var filtro3 = productoFiltro.nombreReferencia == "" ? false : true

    if(productoFiltro.clasificacion == "" && productoFiltro.nombreCasa == "" && productoFiltro.nombreReferencia == ""){
      Swal.fire("Error!", "No hay ningún filtro para aplicar", "error");
      return;
    }

    if(filtro1 == true && filtro2 == false && filtro3 == false)
      this.traerProductosFiltrados(1, productoFiltro);

    else if(filtro1 == true && filtro2 == true && filtro3 == false)
      this.traerProductosFiltrados(2, productoFiltro);

    else if(filtro1 == true && filtro2 == true && filtro3 == true)
      this.traerProductosFiltrados(3, productoFiltro);
    
    else if(filtro1 == false && filtro2 == true && filtro3 == false)
      this.traerProductosFiltrados(4, productoFiltro);

    else if(filtro1 == false && filtro2 == true && filtro3 == true)
      this.traerProductosFiltrados(5, productoFiltro);

    else if(filtro1 == false && filtro2 == false && filtro3 == true)
      this.traerProductosFiltrados(6, productoFiltro);

    else if(filtro1 == true && filtro2 == false && filtro3 == true)
      this.traerProductosFiltrados(7, productoFiltro);
  
  }

  traerProductosFiltrados(num : number, productoFiltro : productosPorFiltros){
    switch (num) {
        case 1:
          this.productoService.getProductosPorFiltros1(productoFiltro).subscribe((res) => {
            this.productos = res as producto[];
            this.traerTransaccionesMultiples();
          });
          break;
        case 2:
          this.productoService.getProductosPorFiltros2(productoFiltro).subscribe((res) => {
            this.productos = res as producto[];
            this.traerTransaccionesMultiples();
          });
          break;
        case 3:
          this.productoService.getProductosPorFiltros3(productoFiltro).subscribe((res) => {
            this.productos = res as producto[];
            this.traerTransaccionesMultiples();
          });
          break;
        case 4:
          this.productoService.getProductosPorFiltros4(productoFiltro).subscribe((res) => {
            this.productos = res as producto[];
            this.traerTransaccionesMultiples();
          });
          break;
        case 5:
          this.productoService.getProductosPorFiltros5(productoFiltro).subscribe((res) => {
            this.productos = res as producto[];
            this.traerTransaccionesMultiples();
          });
          break;
        case 6:
          this.productoService.getProductosPorFiltros6(productoFiltro).subscribe((res) => {
            this.productos = res as producto[];
            this.traerTransaccionesMultiples();
          });
          break;
        case 7:
          this.productoService.getProductosPorFiltros7(productoFiltro).subscribe((res) => {
            this.productos = res as producto[];
            this.traerTransaccionesMultiples();
          });
          break;

        default:
          break;
      }
  }




  traerTransaccionesPorProducto() {
    var existe = false;
    this.proTransaccion.nombre = this.nombreProducto;
    this.invetarioP.forEach((element2) => {
      if (this.proTransaccion.nombre == element2.producto.PRODUCTO) {
        existe = true;
      }
    });
    if (!existe) {
      this.mensajeLoading = "Buscando transacciones";
      this.mostrarLoading = true;

      this.transaccionesService
      .getTransaccionesPorProducto(this.proTransaccion)
      .subscribe((res) => {
        this.transacciones = res as transaccion[];
        this.traerProductosPendientesPorNombre();
        this.cargarDatosProductoUnitario();
      });
      
      
    } else {
      Swal.fire("Error!", "El producto ya se encuentra en la lista", "error");
    }

  }



  buscarCombo(nombreCombo){
    var combo = new ProductoCombo();
    combo.PRODUCTO = nombreCombo;
    this._comboService.getComboPorNombre(combo).subscribe(res => {
      var listado = res as ProductoCombo[];
      this.buscarProductosCombo(listado[0].productosCombo);
    })
  }

   buscarProductosCombo(listado : productosCombo[]){   
    this.mostrarLoading = true;
    this.cantidadProductos = 0; 
    listado.forEach(element => {
      this.productos.forEach(element2 => {
        if(element.nombreProducto == element2.PRODUCTO)
          this.traerTransaccionesPorProductoCombo2(element2, element)
      });
    });
  }



  traerProductos() {
    this.productoService.getProductosActivos().subscribe((res) => {
      this.productos = res as producto[];
      this.productos.forEach((element) => {
        element.DIMENSION = this.productosCatalogo?.find(element2=> element.PRODUCTO == element2.PRODUCTO)?.DIM;
        element.IMAGEN_PRINCIPAL = this.productosCatalogo?.find(element2=> element.PRODUCTO == element2.PRODUCTO)?.IMAGEN_PRINCIPAL;
      } )
      this.cargarDatos();
      this.cargarClasificacion();
    });
  }

  cargarClasificacion(){
    this.listaClasificacion.forEach(element=>{
      var cont = 0;
      this.productos.forEach(element2=>{
        if(element.nombreClasificacion == element2.CLASIFICA)
          cont++
      })
      element.cantidadProductos = cont;
    })
  }

  traerProductosUnitarios() {
    this.mostrarLoading = true;
    this.productos = [];
    this.productoService.getProductosActivos().subscribe((res) => {
      this.productos = res as producto[];
      this.separarProducto();
      this.mostrarLoading = false;
    });
  }

  separarProducto() {
    this.productos22 = new DataSource({
      store: this.productos,
      sort: [{ field: "PRODUCTO", asc: true }],
    });
  }

  traerBodegas() {
    this.bodegasService.getBodegas().subscribe((res) => {
      this.bodegas = res as bodega[];
      this.separarBodegas();
    });
  }

  cargarUsuarioLogueado() {
    const promesaUser = new Promise((res, err) => {
      if (localStorage.getItem("maily") != "") {
        this.correo = localStorage.getItem("maily");
      }
      this.authenService.getUserLogueado(this.correo).subscribe(
        (res) => {
          this.usuarioLogueado = res as user;
          if(this.usuarioLogueado[0].status == "Inactivo")
              this.authService.logOut();
        },
        (err) => {}
      );
    });
  }

  clearForm(){
    this.nombreProducto = "";
  }

  separarBodegas() {
    this.bodegas.forEach((element) => {
      switch (element.sucursal) {
        case "matriz":
          this.bodegasMatriz = element.nombre + " , " + this.bodegasMatriz;
          break;
        case "sucursal1":
          this.bodegasSucursal1 =
            element.nombre + " , " + this.bodegasSucursal1;
          break;
        case "sucursal2":
          this.bodegasSucursal2 =
            element.nombre + " ,  " + this.bodegasSucursal2;
          break;

        default:
          break;
      }
    });
  }

  traerProductosPendientes() {
    this.productosPendientesService.getProductoPendiente().subscribe((res) => {
      this.productosPendientes = res as productosPendientesEntrega[];
      this.separarEntregas();
    });
  }


  traerTransaccionesRevisionesProductos(){
    this._transaccionesRevisionProductoService.getTransacciones().subscribe(res => {
      this.transaccionesProductosRevisados = res as comparacionResultadosRevision[];
    })
  }
  

  traerProductosPendientesPorNombre() {
    this.productosPendientesService.getPendientesPorProducto(this.proTransaccion).subscribe((res) => {
      this.productosPendientes = res as productosPendientesEntrega[];
      this.separarEntregas();
    });
  }

  actualizarUbicaciones() {
    this.popupVisible = false;
    this.productos.forEach((element) => {
      if (element.PRODUCTO == this.nameProducto) {
        element.ubicacionSuc1 = this.arregloUbicaciones1;
        element.ubicacionSuc2 = this.arregloUbicaciones2;
        element.ubicacionSuc3 = this.arregloUbicaciones3;
        this.productoService.updateProductoUbicaciones(element).subscribe(
          (res) => {
            Swal.fire({
              title: "Correcto",
              text: "Su proceso se realizó con éxito",
              icon: "success",
              confirmButtonText: "Ok",
            }).then((result) => {
              window.location.reload();
            });
          },
          (err) => {
            alert("error");
          }
        );
      }
    });
  }

  actualizarNotas() {
    this.popupVisibleNotas = false;
    this.productos.forEach((element) => {
      if (element.PRODUCTO == this.nameProducto) {
        element.notas = this.arregloNotas;
        this.productoService.updateProductoNotas(element).subscribe(
          (res) => {
            Swal.fire({
              title: "Correcto",
              text: "Su proceso se realizó con éxito",
              icon: "success",
              confirmButtonText: "Ok",
            }).then((result) => {
              window.location.reload();
            });
          },
          (err) => {
            alert("error");
          }
        );
      }
    });
  }

  separarEntregas() {
    this.productosPendientes.forEach((element) => {
      if (element.estado == "PENDIENTE") 
        this.productosPendientesNoEN.push(element);
    });
    this.calcularPendientes();
  }

  calcularPendientes(){
    this.productosPendientes.forEach((element) => {
      this.totalCajas += element.cajas;
      this.totalPiezas += element.piezas;
      this.totalM2 += element.cantM2;
    });
  }

  nuevaUbicacion1() {
    this.arregloUbicaciones1.push(this.ubicacion1);
  }

  nuevaUbicacion2() {
    this.arregloUbicaciones2.push(this.ubicacion2);
  }

  nuevaUbicacion3() {
    this.arregloUbicaciones3.push(this.ubicacion3);
  }

  nuevaNota() {
    this.arregloNotas.push(this.nota);
  }

  eliminar1(id: number) {
    this.arregloUbicaciones1.splice(id, 1);
  }

  eliminar2(id: number) {
    this.arregloUbicaciones2.splice(id, 1);
  }

  eliminar3(id: number) {
    this.arregloUbicaciones3.splice(id, 1);
  }

  eliminar4(id: number) {
    this.arregloNotas.splice(id, 1);
  }

  modificar1(id: number, event: any) {
    this.arregloUbicaciones1[id] = event.target.textContent;
  }

  modificar2(id: number, event: any) {
    this.arregloUbicaciones2[id] = event.target.textContent;
  }

  modificar3(id: number, event: any) {
    this.arregloUbicaciones3[id] = event.target.textContent;
  }

  modificar4(id: number, event: any) {
    this.arregloNotas[id] = event.target.textContent;
  }

  comenzarConsolidado() {
    this.traerProductos();
    this.traerTransacciones();
  }

  cargarDatosProductoUnitario() {
    var contCajas = 0;
    var contCajas2 = 0;
    var contCajas3 = 0;
    var contPiezas = 0;
    var contPiezas2 = 0;
    var contPiezas3 = 0;
    for (let index = 0; index < this.productos.length; index++) {
      const element2 = this.productos[index];

      this.transacciones.forEach((element) => {
        if (
          element2.PRODUCTO == element.producto &&
          element.sucursal == "matriz"
        ) {
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
        } else if (
          element2.PRODUCTO == element.producto &&
          element.sucursal == "sucursal1"
        ) {
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
        } else if (
          element2.PRODUCTO == element.producto &&
          element.sucursal == "sucursal2"
        ) {
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
      this.invetarioProd = new inventario();
      this.invetarioProd.producto = element2;
      this.invetarioProd.cantidadCajas = contCajas;
      this.invetarioProd.cantidadCajas2 = contCajas2;
      this.invetarioProd.cantidadCajas3 = contCajas3;

      this.invetarioProd.cantidadPiezas = contPiezas;
      this.invetarioProd.cantidadPiezas2 = contPiezas2;
      this.invetarioProd.cantidadPiezas3 = contPiezas3;
      //this.invetarioProd.bodega= "S1 ("+this.bodegasMatriz+" ) S2 ("+this.bodegasSucursal1+") S3("+this.bodegasSucursal2+")"
      this.invetarioProd.bodega =
        "  S1 (" + element2.ubicacionSuc1 +
        ") S2 (" +element2.ubicacionSuc2 +
        ") S3(" + element2.ubicacionSuc3 +")";

      this.invetarioProd.ultimoPrecioCompra = element2.ultimoPrecioCompra;
      this.invetarioProd.ultimaFechaCompra = element2.ultimaFechaCompra;
      this.invetarioProd.porUtilidad = element2.porcentaje_ganancia;
      this.invetarioProd.IMAGEN_PRINCIPAL = this.productosCatalogo?.find(element=> element.PRODUCTO == element2.PRODUCTO)?.IMAGEN_PRINCIPAL;
      this.invetarioProd.valorProducto = (element2.porcentaje_ganancia * element2.precio) + element2.precio ;
      this.invetarioProd.notas = element2.notas;
      this.invetarioProd.execute = false;
      if (this.invetarioProd.producto.PRODUCTO == this.nombreProducto) 
        this.invetarioP.push(this.invetarioProd);
      
      contCajas = 0;
      contPiezas = 0;
      contCajas2 = 0;
      contPiezas2 = 0;
      contCajas3 = 0;
      contPiezas3 = 0;
    }
    this.transformarM2();
    //this.sumarProductosRestados()
  }

  cargarDatos() {
    var contCajas = 0;
    var contCajas2 = 0;
    var contCajas3 = 0;
    var contPiezas = 0;
    var contPiezas2 = 0;
    var contPiezas3 = 0;
    for (let index = 0; index < this.productos.length; index++) {
      const element2 = this.productos[index];

      this.transacciones.forEach((element) => {
        if (element2.PRODUCTO == element.producto && element.sucursal == "matriz") {
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
        } else if (
          element2.PRODUCTO == element.producto &&
          element.sucursal == "sucursal1"
        ) {
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
        } else if (
          element2.PRODUCTO == element.producto &&
          element.sucursal == "sucursal2"
        ) {
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
      //this.invetarioProd.bodega= "S1 ("+this.bodegasMatriz+" ) S2 ("+this.bodegasSucursal1+") S3("+this.bodegasSucursal2+")"
      this.invetarioProd.bodega = "S1 (" +element2.ubicacionSuc1 +" ) S2 (" + element2.ubicacionSuc2 +") S3(" +  element2.ubicacionSuc3 + ")";

      this.invetarioProd.ultimoPrecioCompra = element2.ultimoPrecioCompra;
      this.invetarioProd.porUtilidad = element2.porcentaje_ganancia;
      this.invetarioProd.IMAGEN_PRINCIPAL = this.productosCatalogo?.find(element=> element.PRODUCTO == element2.PRODUCTO)?.IMAGEN_PRINCIPAL;
      this.invetarioProd.valorProducto = ((element2.porcentaje_ganancia * element2.precio)/100) + element2.precio ;
      this.invetarioProd.ultimaFechaCompra = element2.ultimaFechaCompra;

      //MATRIZ
      var datos = this.transaccionesProductosRevisados.filter(element3=>element3.producto == element2.PRODUCTO && element3.sucursal == "matriz");
      var data = datos?.length == 1 ? datos[0] : datos[datos?.length-1] ;
      let days = this.diferenciaEntreDiasEnDias(new Date(data?.fecha), new Date());
      this.invetarioProd.ultimaFechaRevisionMatriz = data?.fecha;
      this.invetarioProd.diasRestantesMatriz = days.toString() != "NaN" ? days.toString() : "";
      //SUCURSAL1
      var datos2 = this.transaccionesProductosRevisados.filter(element3=>element3.producto == element2.PRODUCTO && element3.sucursal == "sucursal1");
      var data2 = datos2?.length == 1 ? datos2[0] : datos2[datos2?.length-1] ;
      let days2 = this.diferenciaEntreDiasEnDias(new Date(data2?.fecha), new Date());
      this.invetarioProd.ultimaFechaRevisionSucursal1 = data2?.fecha;
      this.invetarioProd.diasRestantesSucursal1 = days2.toString() != "NaN" ? days2.toString() : "";
      //SUCURSAL2
      var datos3 = this.transaccionesProductosRevisados.filter(element3=>element3.producto == element2.PRODUCTO && element3.sucursal == "sucursal2");
      var data3 = datos3?.length == 1 ? datos3[0] : datos3[datos3?.length-1] ;
      let days3 = this.diferenciaEntreDiasEnDias(new Date(data3?.fecha), new Date());
      this.invetarioProd.ultimaFechaRevisionSucursal2 = data3?.fecha;
      this.invetarioProd.diasRestantesSucursal2 = days3.toString() != "NaN" ? days3.toString() : "";

      this.invetarioProd.notas = element2.notas;
      this.invetarioP.push(this.invetarioProd);

      contCajas = 0;
      contPiezas = 0;
      contCajas2 = 0;
      contPiezas2 = 0;
      contCajas3 = 0;
      contPiezas3 = 0;
    }
    this.transformarM2();
    this.sumarProductosRestados()
  }

  diferenciaEntreDiasEnDias(a, b){
    var MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / MILISENGUNDOS_POR_DIA);
  }


  sumarProductosRestados() {
    for (let index = 0; index < this.productos.length; index++) {
      const element = this.productos[index];
      this.invetarioP.forEach((element2) => {
        if (!element2.execute) {
          if (element.PRODUCTO == element2.producto.PRODUCTO) {
            element2.cantidadM2 = element2.cantidadM2;
            element2.cantidadM2b2 = element2.cantidadM2b2;
            element2.cantidadM2b3 = element2.cantidadM2b3;
            element2.execute = true;
          }
        }
      });
    }
    //this.transformarM2()
  }

  mensajeActualizando() {
    let timerInterval;
    Swal.fire({
      title: "Actualizando !",
      html: "Procesando",
      timerProgressBar: true,
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
        timerInterval = setInterval(() => {
          const content = Swal.getContent();
          if (content) {
          }
        }, 100);
      },
      onClose: () => {
        clearInterval(timerInterval);
      },
    });
  }

  mensajeActualizar() {
    Swal.fire({
      title: "Alerta",
      text: "Está seguro de realizar la actualización, este proceso actualizará los productos existentes ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      allowOutsideClick: false,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.actualizarInventario();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado!", "Se ha cancelado su proceso.", "error");
      }
    });
  }


  mensajeActualizarTransacciones() {
    Swal.fire({
      title: "Alerta",
      text: "Está seguro de realizar un ajuste a las transacciones, este proceso marcará como no válidas las transacciones antiguas e insertará una transacción de ajuste",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      allowOutsideClick: false,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) 
        this.realizarActualizacionTransacciones();
      else if (result.dismiss === Swal.DismissReason.cancel) 
        Swal.fire("Cancelado!", "Se ha cancelado su proceso.", "error");
    });
  }


  realizarActualizacionTransacciones(){
    this.mensajeLoading = "Realizando ajustes"
    this.mostrarLoading = true;
    var contadorProductos = 0;
    this.invetarioP.forEach((element) => {
      this.transaccion = new transaccion()
      this.transaccion.fecha_mov = new Date().toLocaleString()
      this.transaccion.fecha_transaccion = new Date()
      this.transaccion.sucursal = "matriz"
      this.transaccion.totalsuma = 0
      this.transaccion.bodega = "12"
      this.transaccion.costo_unitario = element.producto.precio
      this.transaccion.documento = "000000"
      this.transaccion.factPro = ""
      this.transaccion.maestro = ""
      this.transaccion.producto = element.producto.PRODUCTO
      this.transaccion.observaciones = "Ajuste automatico de transacciones "+ new Date().toLocaleDateString()
      if(element.cantidadCajas < 0 || element.cantidadPiezas < 0){
        this.transaccion.cajas = element.cantidadCajas*(-1)
        this.transaccion.piezas = element.cantidadPiezas*(-1)
        this.transaccion.cantM2 = element.cantidadM2*(-1)
        this.transaccion.valor = 0
        this.transaccion.totalsuma = 0
        this.transaccion.tipo_transaccion = "ajuste-faltante"
        this.transaccion.movimiento = -1
      }else{
        this.transaccion.cajas = element.cantidadCajas
        this.transaccion.piezas = element.cantidadPiezas
        this.transaccion.cantM2 = element.cantidadM2
        this.transaccion.valor = 0
        this.transaccion.totalsuma = 0
        this.transaccion.tipo_transaccion = "ajuste-sobrante"
        this.transaccion.movimiento = 1
      }
        
      this.transaccion.usu_autorizado = this.usuarioLogueado[0].username
      this.transaccion.usuario = this.usuarioLogueado[0].username
      this.transaccion.idTransaccion = 0
      this.transaccion.cliente = ""


      var p1 = new Promise((resolve, reject) => {
        this.transaccionesService.newTransaccion(this.transaccion).subscribe(
          res => { resolve(true)},
          err => { })
      });


      this.transaccion = new transaccion()
      this.transaccion.fecha_mov = new Date().toLocaleString()
      this.transaccion.fecha_transaccion = new Date()
      this.transaccion.sucursal = "sucursal1"
      this.transaccion.totalsuma = 0
      this.transaccion.bodega = "12"
      this.transaccion.costo_unitario = element.producto.precio
      this.transaccion.documento = "000000"
      this.transaccion.factPro = ""
      this.transaccion.maestro = ""
      this.transaccion.producto = element.producto.PRODUCTO
      this.transaccion.observaciones = "Ajuste automatico de transacciones "+ new Date().toLocaleDateString()
      if(element.cantidadCajas2 < 0 || element.cantidadPiezas2 < 0){
        this.transaccion.cajas = element.cantidadCajas2*(-1)
        this.transaccion.piezas = element.cantidadPiezas2*(-1)
        this.transaccion.cantM2 = element.cantidadM2b2*(-1)
        this.transaccion.valor = 0
        this.transaccion.totalsuma = 0
        this.transaccion.tipo_transaccion = "ajuste-faltante"
        this.transaccion.movimiento = -1
      }else{
        this.transaccion.cajas = element.cantidadCajas2
        this.transaccion.piezas = element.cantidadPiezas2
        this.transaccion.cantM2 = element.cantidadM2b2
        this.transaccion.valor = 0
        this.transaccion.totalsuma = 0
        this.transaccion.tipo_transaccion = "ajuste-sobrante"
        this.transaccion.movimiento = 1
      }
        
      this.transaccion.usu_autorizado = this.usuarioLogueado[0].username
      this.transaccion.usuario = this.usuarioLogueado[0].username
      this.transaccion.idTransaccion = 0
      this.transaccion.cliente = ""


      var p2 = new Promise((resolve, reject) => {
        this.transaccionesService.newTransaccion(this.transaccion).subscribe(
          res => { resolve(true)},
          err => { })
      });

      Promise.all([p1, p2]).then(values => {
        contadorProductos++;
        if(contadorProductos == this.invetarioP.length)
          this.actualizarTransaccionesEstado();
      });  
      
    }); 
  }


  actualizarTransaccionesEstado(){
    var cont= 0;
    this.transacciones.forEach((element) => {
      this.transaccionesService.updateEstadoTransaccion(element).subscribe(
          res => { cont++;this.mostrarMensajeActualizacion(cont)},
          err => { })
    })
  }

  mostrarMensajeActualizacion(contador:number){
    console.log(contador)
    if(contador == this.transacciones.length){
      this.mostrarLoading = false;
      Swal.fire("Correcto!", "Se guardaron sus cambios con éxito", "success"); 
    }   
  }


  async actualizarInventario() {
    var m2s1 = 0;
    var m2s2 = 0;
    var m2s3 = 0;
    var contVal = 0;
    this.mensajeActualizando();
    this.invetarioP.forEach(async (element) => {
      m2s1 = parseFloat(element.cantidadM2.toFixed(2));
      m2s2 = parseFloat(element.cantidadM2b2.toFixed(2));
      m2s3 = parseFloat(element.cantidadM2b3.toFixed(2));
      element.producto.sucursal1 = m2s1;
      element.producto.sucursal2 = m2s2;
      element.producto.sucursal3 = m2s3;
      
      if (element.producto.ultimoPrecioCompra != undefined || element.producto.ultimoPrecioCompra != null) {
        element.producto.precio = element.producto.ultimoPrecioCompra;
      }else{
       element.producto.precio = element.producto.precio;
      }
      this.prodActualizable = new productoActualizable();
      this.prodActualizable.producto = element.producto;
      this.prodActualizable.suc1 = m2s1;
      this.prodActualizable.suc2 = m2s2;
      this.prodActualizable.suc3 = m2s3;
        
      this.productoService
        .updateProductosSucursalesNuevo(this.prodActualizable)
        .subscribe(
          (res) => {
            contVal++,
              this.contadorValidaciones2(contVal)

          },
          (err) => {

            contVal++,
              this.contadorValidaciones2(contVal)
          }
        );
    });
  }


  async actualizarInventarioPorClasificacion(e) {
    var m2s1 = 0;
    var m2s2 = 0;
    var m2s3 = 0;
    var contVal = 0;
    this.mensajeActualizando();
    var contador = 0;
    this.productos.forEach(element => {
      if(element.CLASIFICA == e.nombreClasificacion)
        contador++
    })
    var cont2=0
    this.invetarioP.forEach(async (element) => {
      if(element.producto.CLASIFICA == e.nombreClasificacion){
        cont2++
        m2s1 = parseFloat(element.cantidadM2.toFixed(2));
        m2s2 = parseFloat(element.cantidadM2b2.toFixed(2));
        m2s3 = parseFloat(element.cantidadM2b3.toFixed(2));
        element.producto.sucursal1 = m2s1;
        element.producto.sucursal2 = m2s2;
        element.producto.sucursal3 = m2s3;
        
        if (element.producto.ultimoPrecioCompra != undefined || element.producto.ultimoPrecioCompra != null) {
          element.producto.precio = element.producto.ultimoPrecioCompra;
        }else{
        element.producto.precio = element.producto.precio;
        }
        this.prodActualizable = new productoActualizable();
        this.prodActualizable.producto = element.producto;
        this.prodActualizable.suc1 = m2s1;
        this.prodActualizable.suc2 = m2s2;
        this.prodActualizable.suc3 = m2s3;
          
        this.productoService.updateProductosSucursalesNuevo(this.prodActualizable).subscribe(
          (res) => {
            contVal++,
            this.contadorValidacionesClasificacion(contVal,contador)
          },
          (err) => {
            contVal++,
            this.contadorValidacionesClasificacion(contVal,contador)
          });
        }
      }); 
  }

  contadorValidaciones2(i: number) {
    if (this.invetarioP.length == i) {
      Swal.close();
      Swal.fire({
        title: "Correcto",
        text: "Se ha realizado con exito su actualizacion",
        icon: "success",
        confirmButtonText: "Ok",
      }).then((result) => {
        window.location.reload();
      });
    }
  }

  contadorValidacionesClasificacion(i: number, total:number) {
    if (total == i) {
      Swal.close();
      Swal.fire({
        title: "Correcto",
        text: "Se ha realizado con exito su actualizacion",
        icon: "success",
        confirmButtonText: "Ok",
      }).then((result) => {
        //window.location.reload();
      });
    } 
  }

  opcionMenu(e) {
    this.valorMenu = e.value;
    switch (e.value) {
      case "Inventario General":
        this.tipoBusqueda = "Normal"
        this.traerTransacciones();
        this.traerProductosPendientes();
        this.mostrarUser = true;
        this.mostrarAdmin = false;
        this.mostrarBusquedaIndividual = false;
        this.mostrarBusquedaPorFiltros = false;
        this.mostrarActualizacion = false;
        break;
      case "Inventario Contable":
        this.tipoBusqueda = "Contable"
        this.traerTransacciones();
        this.traerProductosPendientes();
        this.traerTransaccionesRevisionesProductos();
        this.mostrarUser = true;
        this.mostrarAdmin = false;
        this.mostrarBusquedaIndividual = false;
        this.mostrarBusquedaPorFiltros = false;
        this.mostrarActualizacion = false;
        break;
      case "Inventario Valorizado":
        this.traerTransacciones();
        this.traerProductosPendientes();
        this.mostrarUser = false;
        this.mostrarAdmin = true;
        this.mostrarBusquedaIndividual = false;
        this.mostrarBusquedaPorFiltros = false;
        this.mostrarActualizacion = false;
        break;
      case "Busqueda Individual":
        this.tipoBusqueda = "Normal"
        this.transacciones = [];
        this.invetarioP = [];
        this.invetarioFaltante = [];
        this.mostrarUser = false;
        this.mostrarAdmin = false;
        this.mostrarBusquedaIndividual = true;
        this.mostrarBusquedaPorFiltros = false;
        this.mostrarActualizacion = false;
        break;
      case "Busqueda Por Filtros":
        this.tipoBusqueda = "Normal"
        this.transacciones = [];
        this.invetarioP = [];
        this.invetarioFaltante = [];
        this.mostrarUser = false;
        this.mostrarAdmin = false;
        this.traerTransaccionesRevisionesProductos();
        this.mostrarBusquedaIndividual = false;
        this.mostrarBusquedaPorFiltros = true;
        this.mostrarActualizacion = false;
        if(this.productosCatalogo.length == 0)
          this.traerCatalogoUnitarios()
        break;
      case "Actualizacion Productos":
        this.tipoBusqueda = "Normal"
        this.traerTransacciones();
        this.traerProductosPendientes();
        this.mostrarUser = false;
        this.mostrarAdmin = false;
        this.mostrarBusquedaIndividual = false;
        this.mostrarBusquedaPorFiltros = false;
        this.mostrarActualizacion = true;
      default:
    }
  }

  transformarM2() {
    this.invetarioP.forEach((element) => {
      element.cantidadM2 = parseFloat(
        (
          element.producto.M2 * element.cantidadCajas +
          (element.cantidadPiezas * element.producto.M2) /
            element.producto.P_CAJA
        ).toFixed(2)
      );
      element.cantidadM2b2 = parseFloat(
        (
          element.producto.M2 * element.cantidadCajas2 +
          (element.cantidadPiezas2 * element.producto.M2) /
            element.producto.P_CAJA
        ).toFixed(2)
      );
      element.cantidadM2b3 = parseFloat(
        (
          element.producto.M2 * element.cantidadCajas3 +
          (element.cantidadPiezas3 * element.producto.M2) /
            element.producto.P_CAJA
        ).toFixed(2)
      );
      element.totalb1 = parseFloat(
        (element.cantidadM2 * element.producto.precio).toFixed(2)
      );
      element.totalb2 = parseFloat(
        (element.cantidadM2b2 * element.producto.precio).toFixed(2)
      );
      element.totalb3 = parseFloat(
        (element.cantidadM2b3 * element.producto.precio).toFixed(2)
      );
    });
    //this.sumarProductosRestados();
    this.cambiarValores();

    this.controlarInventario();
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
    if(this.valorMenu != "Inventario Contable"){
      if(this.tipoBusqueda == "Normal"){
        this.invetarioP.forEach((element) => {
          if (element.cantidadM2 <= 0) {
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
        });
      }



      if(this.valorMenu == "Busqueda Individual"){
        var producto = this.productos.find(element=> element.PRODUCTO == this.nombreProducto)
        if(producto.CLASIFICA == "COMBO")
          this.buscarCombo(this.nombreProducto)
      }
      
      
    }

    
     
    
    this.mostrarLoading = false;



    this.invetarioP.forEach((element) => {
      var requiere = false;
      this.productos.forEach(element2 =>{
        if(element.producto.PRODUCTO == element2.PRODUCTO){
          if(element.cantidadM2 != element2.sucursal1)
            requiere = true;
          else if(element.cantidadM2b2 != element2.sucursal2)
            requiere = true;
          else if(element.cantidadM2b3 != element2.sucursal3)
            requiere = true;
        }
      })
      element.requiereActualizacion = requiere ? "SI":"NO"
    });
    // this.actualizarInventario()
  }

  cambiarValores() {
    this.invetarioP.forEach((element) => {
      element.cantidadCajas = Math.trunc(
        element.cantidadM2 / element.producto.M2
      );
      element.cantidadPiezas = parseInt(
        (
          (element.cantidadM2 * element.producto.P_CAJA) / element.producto.M2 -
          element.cantidadCajas * element.producto.P_CAJA
        ).toFixed(0)
      );
      element.cantidadM2 = parseFloat(element.cantidadM2.toFixed(2));

      element.cantidadCajas2 = Math.trunc(
        element.cantidadM2b2 / element.producto.M2
      );
      element.cantidadPiezas2 = parseInt(
        (
          (element.cantidadM2b2 * element.producto.P_CAJA) /
            element.producto.M2 -
          element.cantidadCajas2 * element.producto.P_CAJA
        ).toFixed(0)
      );
      element.cantidadM2b2 = parseFloat(element.cantidadM2b2.toFixed(2));

      element.cantidadCajas3 = Math.trunc(
        element.cantidadM2b3 / element.producto.M2
      );
      element.cantidadPiezas3 = parseInt(
        (
          (element.cantidadM2b3 * element.producto.P_CAJA) /
            element.producto.M2 -
          element.cantidadCajas3 * element.producto.P_CAJA
        ).toFixed(0)
      );
      element.cantidadM2b3 = parseFloat(element.cantidadM2b3.toFixed(2));
    });
  }

  onExporting(e) {
    e.component.beginUpdate();
    e.component.columnOption("cantidadM2", "visible", true);
    e.component.columnOption("cantidadM2b2", "visible", true);
    e.component.columnOption("producto.CLASIFICA", "visible", true);
    e.component.columnOption("producto.precio", "visible", true);
    e.component.columnOption("bodega", "visible", true);
    e.component.columnOption("ultimoPrecioCompra", "visible", true);
    e.component.columnOption("porUtilidad", "visible", true);
    e.component.columnOption("valorProducto", "visible", true);
    e.component.columnOption("ultimaFechaCompra", "visible", true);
    e.component.columnOption("notas", "visible", true);
  }

  onExported(e) {
    e.component.columnOption("cantidadM2", "visible", false);
    e.component.columnOption("cantidadM2b2", "visible", false);
    e.component.columnOption("producto.CLASIFICA", "visible", false);
    e.component.columnOption("producto.precio", "visible", false);
    e.component.columnOption("bodega", "visible", false);
    e.component.columnOption("ultimoPrecioCompra", "visible", false);
    e.component.columnOption("porUtilidad", "visible", false);
    e.component.columnOption("valorProducto", "visible", false);
    e.component.columnOption("ultimaFechaCompra", "visible", false);
    e.component.columnOption("notas", "visible", false);
    e.component.endUpdate();
  }

  onExporting2(e) {
    e.component.beginUpdate();
    e.component.columnOption("producto.CLASIFICA", "visible", true);
    e.component.columnOption("producto.DIMENSION", "visible", true);
    e.component.columnOption("producto.REFERENCIA", "visible", true);
    e.component.columnOption("producto.precio", "visible", true);
    e.component.columnOption("bodega", "visible", true);
    e.component.columnOption("ultimoPrecioCompra", "visible", true);
    e.component.columnOption("ultimaFechaCompra", "visible", true);
    e.component.columnOption("ultimaFechaRevisionMatriz", "visible", true);
    e.component.columnOption("diasRestantesMatriz", "visible", true);
    e.component.columnOption("ultimaFechaRevisionSucursal1", "visible", true);
    e.component.columnOption("diasRestantesSucursal1", "visible", true);
    e.component.columnOption("ultimaFechaRevisionSucursal2", "visible", true);
    e.component.columnOption("diasRestantesSucursal2", "visible", true);
    e.component.columnOption("notas", "visible", true);
  }
  onExported2(e) {
    e.component.columnOption("producto.CLASIFICA", "visible", false);
    e.component.columnOption("producto.DIMENSION", "visible", false);
    e.component.columnOption("producto.REFERENCIA", "visible", false);
    e.component.columnOption("producto.precio", "visible", false);
    e.component.columnOption("bodega", "visible", false);
    e.component.columnOption("ultimoPrecioCompra", "visible", false);
    e.component.columnOption("ultimaFechaCompra", "visible", false);
    e.component.columnOption("ultimaFechaRevisionMatriz", "visible", false);
    e.component.columnOption("diasRestantesMatriz", "visible", false);
    e.component.columnOption("ultimaFechaRevisionSucursal1", "visible", false);
    e.component.columnOption("diasRestantesSucursal1", "visible", false);
    e.component.columnOption("ultimaFechaRevisionSucursal2", "visible", false);
    e.component.columnOption("diasRestantesSucursal2", "visible", false);
    e.component.columnOption("notas", "visible", false);
    e.component.endUpdate();
  }

  mostrarUbicacion = (e) => {
    this.mostrarPopup(e.row.data);
  };

  mostrarNotas = (e) => {
    this.mostrarPopupNotas(e.row.data);
  };

  mostrarProductos = (e) => {
    this.mostrarPopupProductos(e.row.data);
  }

  mostrarProductosGeneral = (e) => {
    this.mostrarPopupProductos(e.row.data);
  }

  updateInventarioClasificacion = (e) => {
    this.actualizarInventarioPorClasificacion(e.row.data);
  };

  mostrarPopup(e: any) {
    this.nameProducto = e.producto.PRODUCTO;
    this.productos.forEach((element) => {
      if (element.PRODUCTO == e.producto.PRODUCTO) {
        this.arregloUbicaciones1 = element.ubicacionSuc1;
        this.arregloUbicaciones2 = element.ubicacionSuc2;
        this.arregloUbicaciones3 = element.ubicacionSuc3;
      }
    });
    this.popupVisible = true;
  }

  mostrarPopupNotas(e: any) {
    this.nameProducto = e.producto.PRODUCTO;
    this.productos.forEach((element) => {
      if (element.PRODUCTO == e.producto.PRODUCTO) {
        this.arregloNotas = element.notas;
      }
    });
    this.popupVisibleNotas = true;
  }

  mostrarPopupProductos(e: any) {
    this.arregloNotas = [];
    this.totalCajas = 0;
    this.totalPiezas = 0;
    this.totalM2 = 0;
    this.productosPendientesNoENLista = [];
    this.nameProducto = e.producto.PRODUCTO;
    this.productos.forEach((element) => {
      if (element.PRODUCTO == e.producto.PRODUCTO) {
        this.arregloNotas = element.notas;
      }
    });

    this.productosPendientesNoEN.forEach((element) => {
      if (element.producto.PRODUCTO == e.producto.PRODUCTO) 
        this.productosPendientesNoENLista.push(element);
    });

    this.productosPendientesNoENLista.forEach((element) => {
      this.totalCajas += element.cajas;
      this.totalPiezas += element.piezas;
      this.totalM2 += element.cantM2;
    });

    
    this.popupVisiblePendientes = true;
  }



  mostrarPopupImagenes(producto:string){
    this.titulo = producto
    this.productosCatalogo.forEach(element=>{
      if(element.PRODUCTO == producto){
        this.catalogoLeido= element
        this.imagenes=element.IMAGEN
      }
    })
    this.popupVisibleImagenes= true
  }

  enviar(num:number){
    this.imagenPrincipal= this.imagenesData[num]
  }


  verGaleria(imagenes:string[]){
    this.popupVisibleImagenes = false
    this.popupVi=true
    this.imagenesData = imagenes
    this.imagenPrincipal = this.imagenesData[0]
  }


  traerTransaccionesPorProductoCombo2(nombreProducto: producto, productoCombo : productosCombo) {
    this.cantidadProductos++;
    this.transacciones = [];
    this.proTransaccion.nombre = nombreProducto.PRODUCTO;
    var numero = this.invetarioP.length -1
    var p1 = new Promise((resolve, reject) => {
        this.transaccionesService.getTransaccionesPorProducto(this.proTransaccion).toPromise()
            .then( res => { 
              this.transacciones = res as transaccion[];
              var contCajas = 0;
              var contCajas2 = 0;
              var contCajas3 = 0;
              var contPiezas = 0;
              var contPiezas2 = 0;
              var contPiezas3 = 0;

              this.transacciones.forEach((element) => {
                if ( nombreProducto.PRODUCTO == element.producto && element.sucursal == "matriz") {
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
                } else if ( nombreProducto.PRODUCTO == element.producto && element.sucursal == "sucursal1") {
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
                } else if ( nombreProducto.PRODUCTO == element.producto && element.sucursal == "sucursal2") {
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

              var invetarioP = [];
              this.invetarioProd = new inventario();
              this.invetarioProd.producto = nombreProducto;
              this.invetarioProd.cantidadCajas = contCajas;
              this.invetarioProd.cantidadCajas2 = contCajas2;
              this.invetarioProd.cantidadCajas3 = contCajas3;

              this.invetarioProd.cantidadPiezas = contPiezas;
              this.invetarioProd.cantidadPiezas2 = contPiezas2;
              this.invetarioProd.cantidadPiezas3 = contPiezas3;
              invetarioP.push(this.invetarioProd);


              contCajas = 0;
              contPiezas = 0;
              contCajas2 = 0;
              contPiezas2 = 0;
              contCajas3 = 0;
              contPiezas3 = 0;



              //seccion2

              invetarioP.forEach((element) => {
                element.cantidadM2 = parseFloat( (element.producto.M2 * element.cantidadCajas +(element.cantidadPiezas * element.producto.M2) / element.producto.P_CAJA ).toFixed(2));
                element.cantidadM2b2 = parseFloat(
                  (
                    element.producto.M2 * element.cantidadCajas2 +
                    (element.cantidadPiezas2 * element.producto.M2) / element.producto.P_CAJA
                  ).toFixed(2)
                );
                element.cantidadM2b3 = parseFloat(
                  (
                    element.producto.M2 * element.cantidadCajas3 +
                    (element.cantidadPiezas3 * element.producto.M2) / element.producto.P_CAJA
                  ).toFixed(2)
                );
                element.totalb1 = parseFloat( (element.cantidadM2 * element.producto.precio).toFixed(2) );
                element.totalb2 = parseFloat((element.cantidadM2b2 * element.producto.precio).toFixed(2));
                element.totalb3 = parseFloat( (element.cantidadM2b3 * element.producto.precio).toFixed(2));
              });

              //seccion3
              invetarioP.forEach((element) => {
                element.cantidadCajas = Math.trunc( element.cantidadM2 / element.producto.M2);
                element.cantidadPiezas = parseInt( ((element.cantidadM2 * element.producto.P_CAJA) / element.producto.M2 - element.cantidadCajas * element.producto.P_CAJA).toFixed(0));
                element.cantidadM2 = parseFloat(element.cantidadM2.toFixed(2)) / productoCombo.cantidad;

                element.cantidadCajas2 = Math.trunc( element.cantidadM2b2 / element.producto.M2);
                element.cantidadPiezas2 = parseInt(((element.cantidadM2b2 * element.producto.P_CAJA) / element.producto.M2 - element.cantidadCajas2 * element.producto.P_CAJA).toFixed(0));
                element.cantidadM2b2 = parseFloat(element.cantidadM2b2.toFixed(2)) / productoCombo.cantidad;;

                element.cantidadCajas3 = Math.trunc( element.cantidadM2b3 / element.producto.M2);
                element.cantidadPiezas3 = parseInt(((element.cantidadM2b3 * element.producto.P_CAJA) / element.producto.M2 - element.cantidadCajas3 * element.producto.P_CAJA).toFixed(0));
                element.cantidadM2b3 = parseFloat(element.cantidadM2b3.toFixed(2)) / productoCombo.cantidad;;

                if(element.cantidadM2<0) element.cantidadM2 = 0
                if(element.cantidadM2b2<0) element.cantidadM2b2 = 0
                if(element.cantidadM2b3<0) element.cantidadM2b3 = 0


                if(element.cantidadM2 < this.valor1)
                  this.valor1 = Math.trunc(element.cantidadM2) 

                if(element.cantidadM2b2 < this.valor2 )
                  this.valor2 = Math.trunc(element.cantidadM2b2)

                if(element.cantidadM2b3 < this.valor3)
                  this.valor3 = Math.trunc(element.cantidadM2b3)

                this.invetarioP[numero].cantidadM2 = this.valor1
                this.invetarioP[numero].cantidadCajas = this.valor1
                this.invetarioP[numero].cantidadM2b2 = this.valor2
                this.invetarioP[numero].cantidadCajas2 = this.valor2
                this.invetarioP[numero].cantidadM2b3 = this.valor3
                this.invetarioP[numero].cantidadCajas3 = this.valor3
              });

              this.mostrarLoading = false;

              })
            .catch((err) => { });
    });
  }


}
