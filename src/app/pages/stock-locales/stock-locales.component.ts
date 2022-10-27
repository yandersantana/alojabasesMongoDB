import { Component, OnInit } from "@angular/core";
import { producto, productosPendientesEntrega } from "../ventas/venta";
import { transaccion } from "../transacciones/transacciones";
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
import { clasificacionActualizacion, inventario, invFaltanteSucursal, productoActualizable, productoMultiple, productosPorFiltros, productoTransaccion } from "../consolidado/consolidado";
import { stockLocal } from "./stock-locales";
import { ProductosStockLocalesService } from "src/app/servicios/productoStock.service";

@Component({
  selector: "app-stock-locales",
  templateUrl: "./stock-locales.component.html",
  styleUrls: ["./stock-locales.component.scss"],
})
export class StockLocalesComponent implements OnInit {
  menu1: string[] = [];

  menuAdministracion: string[] = [
    "Administracion",
    "Stock Por Filtros",
    "Stock General"
  ];

  menuUsuario: string[] = [
    "Stock Por Filtros",
    "Stock General"
  ];

  opMenu = "Administracion"

  valorMenu = "Administracion"
  mostrarLoading: boolean = false;
  mostrarStockMinimoGeneral = false;
  mostrarAdministracion = true;
  mostrarBusquedaPorFiltros = false;
  dataMatriz = true;
  dataSucursal1 = false;
  dataSucursal2 = false;
  selectedRows: stockLocal[];

  sucursales: string[] = [
    'Matriz',
    'Sucursal1',
    'Sucursal2'
  ];

  sucursalSeleccionada = "Matriz"

  productosTraidos: producto[] = [];
  productos: producto[] = [];
  productosStockTraidos: stockLocal[] = [];
  arregloUbicaciones1: string[] = [];
  arregloUbicaciones2: string[] = [];
  arregloUbicaciones3: string[] = [];
  arregloNotas: string[] = [];
  transacciones: transaccion[] = [];
  invetarioP: inventario[] = [];
  invetarioMinimoProductos: inventario[] = [];
  invetarioMinimoProductosMatriz: inventario[] = [];
  invetarioMinimoProductosSucursal1: inventario[] = [];
  invetarioMinimoProductosSucursal2: inventario[] = [];
  invetarioFaltante1: invFaltanteSucursal;
  invetarioFaltante: invFaltanteSucursal[] = [];
  invetarioProd: inventario;
  productosPendientes: productosPendientesEntrega[] = [];
  productosPendientesNoEN: productosPendientesEntrega[] = [];
  productosPendientesNoENLista: productosPendientesEntrega[] = [];
  listaClasificacion: clasificacionActualizacion[] = [];
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
  totalCajas =0;
  totalPiezas = 0;
  totalM2 = 0;
  
  opcionesCatalogo: opcionesCatalogo[]=[]
  productosCatalogo:catalogo[]=[]
  listadoStockLocales : stockLocal[]=[]
  listaProductosStock : stockLocal[]=[]

  tiposBusqueda: string[] = [
      'Normal',
      'Contable'
  ];
  tipoBusqueda = "Normal"
  cantidadProductos = 0;

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
    public _catalogoService: CatalogoService,
    public _productosLocalesStockService : ProductosStockLocalesService
  ) {
    this.proTransaccion = new productoTransaccion();
    this.prodActualizable = new productoActualizable();
  }

  ngOnInit() {
    this.cargarUsuarioLogueado();
    this.traerProductosUnitarios();
    this.traerOpcionesCatalogo();
    this.traerBodegas();
    this.traerCatalogoUnitario();
    this.traerStockProductosLocales();
    
  }

  traerOpcionesCatalogo(){
    this.opcionesService.getOpciones().subscribe(res => {
      this.opcionesCatalogo = res as opcionesCatalogo[];
      this.llenarCombos()
   })
  }


  traerCatalogo(){
    this._catalogoService.getCatalogoActivos().subscribe(res => {
      this.productosCatalogo = res as catalogo[];
      this.traerProductos();
   })
  }


  traerCatalogoUnitario(){
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

    if(productoFiltro.clasificacion == ""){
      Swal.fire("Error!", "No hay ninguna clasificación seleccionada", "error");
      return;
    }

    this.productoService.getProductosPorFiltros1(productoFiltro).subscribe((res) => {
      this.productosTraidos = res as producto[];
      this.traerProductosStockLocal();
      //this.traerTransaccionesMultiples();
    });
  }


  traerProductosStockLocal(){
    this.productos = [];
    var productoFiltro = new productosPorFiltros();
    productoFiltro.clasificacion = this.nombreClasificacion
    this._productosLocalesStockService.getProductosPorFiltros(productoFiltro).subscribe((res) => {
      this.productosStockTraidos = res as stockLocal[];
      var cont = 0;
      this.productosStockTraidos.forEach((element2) => {
        cont++;
        var prod = this.productosTraidos.find(x=>x.PRODUCTO == element2.PRODUCTO)
        if (prod != null)   
          this.productos.push(prod)
        
        if(cont == this.productosStockTraidos.length)
          this.traerTransaccionesMultiples();
      });
    });
  }
 



  opcionRadioTipos(e){
    this.invetarioMinimoProductosMatriz = [];
    this.sucursalSeleccionada = e.value;
    switch (e.value) {
      case "Matriz":
        this.dataMatriz = true;
        this.dataSucursal1 = false;
        this.dataSucursal2 = false;
        this.invetarioMinimoProductosMatriz = this.invetarioMinimoProductosMatriz;
        break;
      case "Sucursal1":
        this.dataMatriz = false;
        this.dataSucursal1 = true;
        this.dataSucursal2 = false;
        this.invetarioMinimoProductosMatriz = this.invetarioMinimoProductosSucursal1;
        break;
      case "Sucursal2":
        this.dataMatriz = false;
        this.dataSucursal1 = false;
        this.dataSucursal2 = true;
        this.invetarioMinimoProductosMatriz = this.invetarioMinimoProductosSucursal2;
        break;
      default:    
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
    this.mensajeLoading = "Cargando"
    this.mostrarLoading = true;
    this.productos = [];
    this.productoService.getProductosActivos().subscribe((res) => {
      this.productos = res as producto[];
      this.separarProducto();
    });
  }

  traerStockProductosLocales() {
    this.mostrarLoading = true;
    this.listaProductosStock = [];
    this._productosLocalesStockService.getProductosStock().subscribe((res) => {
      this.listaProductosStock = res as stockLocal[];
      this.mostrarLoading = false;
    });
  }

  traerTransaccionesStockGeneral(){
    this.mostrarLoading = true;
    this.productosStockTraidos = [];
    this._productosLocalesStockService.getProductosStock().subscribe((res) => {
      this.productosStockTraidos = res as stockLocal[];

      var prodTmp = this.productos;
      this.productos = [];
      var cont = 0 ;
      prodTmp.forEach((element) => {
        cont++;
        var prod = this.productosStockTraidos.find(x=>x.PRODUCTO == element.PRODUCTO)
        if (prod != null)   
          this.productos.push(element)
        
        if(cont == prodTmp.length)
          this.traerTransaccionesMultiples();
      });
    });
  }

  cargarSeleccion(){
    this.listadoStockLocales.forEach((element) => {
      var data = this.listaProductosStock.find(el => el.PRODUCTO == element.PRODUCTO);
      element.isSelected = data == null ? false : true;
      element.porcentaje = data?.porcentaje ?? 0;
    });

    this.selectedRows = this.listadoStockLocales.filter(el => el.isSelected == true)
    this.mostrarLoading = false;
    
  }

  separarProducto() {
    this.productos.forEach((element) => {
      var producto = new stockLocal();
      producto.PRODUCTO = element.PRODUCTO
      producto.CLASIFICA = element.CLASIFICA
      producto.precio = element.precio
      producto.porcentaje = 0
      this.listadoStockLocales.push(producto)
    });
    this.cargarSeleccion();
  }

  traerBodegas() {
    this.bodegasService.getBodegas().subscribe((res) => {
      this.bodegas = res as bodega[];
      this.separarBodegas();
    });
  }

  cargarUsuarioLogueado() {
    const promesaUser = new Promise((res, err) => {
      if (localStorage.getItem("maily") != "")
        this.correo = localStorage.getItem("maily");

      this.authenService.getUserLogueado(this.correo).subscribe(
        (res) => {
          this.usuarioLogueado = res as user;
          if(this.usuarioLogueado[0].rol == "Administrador"){
            this.menu1 = this.menuAdministracion
            this.opMenu = "Administracion"
            this.mostrarAdministracion = true;
          }else{
            this.menu1 = this.menuUsuario
            this.opMenu = "Stock Por Filtros"
            this.mostrarAdministracion = false;
            this.mostrarBusquedaPorFiltros = true;
          }
            

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

  traerProductosPendientesPorNombre() {
    this.productosPendientesService.getPendientesPorProducto(this.proTransaccion).subscribe((res) => {
      this.productosPendientes = res as productosPendientesEntrega[];
      this.separarEntregas();
    });
  }

  buscarProducto() {}

  

 

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
      this.invetarioProd.bodega =
        "  S1 (" + element2.ubicacionSuc1 +
        ") S2 (" +element2.ubicacionSuc2 +
        ") S3(" + element2.ubicacionSuc3 +")";

      this.invetarioProd.ultimoPrecioCompra = element2.ultimoPrecioCompra;
      this.invetarioProd.ultimaFechaCompra = element2.ultimaFechaCompra;
      this.invetarioProd.porUtilidad = element2.porcentaje_ganancia;
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
      this.invetarioProd.valorProducto = ((element2.porcentaje_ganancia * element2.precio)/100) + element2.precio ;
      this.invetarioProd.ultimaFechaCompra = element2.ultimaFechaCompra;
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


  guardarProductosStockLocal(){
    Swal.fire({
      title: "Alerta",
      text: "Está seguro de guardar los cambios",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      allowOutsideClick: false,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.actualizarStock();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado!", "Se ha cancelado su proceso.", "error");
      }
    });
  }

  actualizarStock() {
    this.mensajeLoading = "Comparando informacion..."
    this.mostrarLoading = true;
    var arrayNuevos : stockLocal[] = [];
    var arrayModificar : stockLocal[]  = [];
    var arrayEliminar : stockLocal[]  = [];
    this.selectedRows.forEach((element) => {
      var producto = this.listaProductosStock.find(x=> x.PRODUCTO == element.PRODUCTO);
      if(producto == null)
        arrayNuevos.push(element)
      else{
        if(producto.porcentaje != element.porcentaje){
          producto.porcentaje = element.porcentaje
          arrayModificar.push(producto)
        }
      }
    });

    this.listaProductosStock.forEach((element) => {
      var producto = this.selectedRows.find(x=> x.PRODUCTO == element.PRODUCTO);
      if(producto == null)
        arrayEliminar.push(element)
    });

    //Guardo los productos nuevos
    var p1 = new Promise((resolve, reject) => {
      var cont1 = 0;
      if(arrayNuevos.length == 0) resolve(true)
      arrayNuevos.forEach((element) => {
      this._productosLocalesStockService.newStockProductoLocal(element).subscribe(
        (res) => { cont1++;if(cont1 == arrayNuevos.length)resolve(true)},
        (err) => { alert("error al guardar")}
        );
      });
    });
    

    //Edito los productos que han sufrido alteracion
    var p2 = new Promise((resolve, reject) => {
      var cont2 = 0;
      if(arrayModificar.length == 0) resolve(true)
      arrayModificar.forEach((element) => {
        this._productosLocalesStockService.updateProductoStock(element).subscribe(
          (res) => { cont2++;if(cont2 == arrayModificar.length)resolve(true)},
          (err) => { alert("error al guardar")}
        );
      });
    });

    //Elimino los productos que ya no estan disponibles
    var p3 = new Promise((resolve, reject) => {
      var cont3 = 0;
      if(arrayEliminar.length == 0) resolve(true)
      arrayEliminar.forEach((element) => {
        this._productosLocalesStockService.deleteProductoStock(element).subscribe(
          (res) => { cont3++;if(cont3 == arrayEliminar.length)resolve(true)},
          (err) => { alert("error al guardar")}
        );
      });
    });

    

    if(arrayNuevos.length == 0 && arrayModificar.length == 0 && arrayNuevos.length == 0){
      this.mostrarLoading = false;
      Swal.fire("Cancelado!", "No existe información que actualizar", "error"); 
    }else {
      Promise.all([p1, p2, p3]).then(values => {
        console.log(values)
        this.mostrarLoading = false;
        Swal.fire("Correcto!", "Se guardaron sus cambios con éxito", "success"); 
      });
    }
      

  }


  validarActualizaciones(){

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
       case "Administracion":
        this.mostrarAdministracion = true;
        this.mostrarStockMinimoGeneral = false;
        this.mostrarBusquedaPorFiltros = false;
        break;
      case "Stock General":
        this.invetarioMinimoProductos = [];
        this.tipoBusqueda = "Normal"
        this.traerTransaccionesStockGeneral();
        this.mostrarAdministracion = false;
        this.mostrarStockMinimoGeneral = true;
        this.mostrarBusquedaPorFiltros = false;
        break;
      case "Stock Por Filtros":
        this.tipoBusqueda = "Normal"
        this.transacciones = [];
        this.invetarioP = [];
        this.invetarioFaltante = [];
        this.invetarioMinimoProductos = [];
        this.mostrarAdministracion = false;
        this.mostrarStockMinimoGeneral = false;
        this.mostrarBusquedaPorFiltros = true;
        break;
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

      this.invetarioP.forEach((element) => {
        element.cantidadM2 = element.cantidadM2 + element.cantidadM2b2 + element.cantidadM2b3;
        element.cantidadCajas = Math.trunc( element.cantidadM2 / element.producto.M2);
        element.cantidadPiezas = parseInt((
          (element.cantidadM2 * element.producto.P_CAJA) / element.producto.M2 -
          element.cantidadCajas * element.producto.P_CAJA
        ).toFixed(0));
        element.valorProducto = parseFloat(((element.producto.precio * (this.productosStockTraidos.find(x=>x.PRODUCTO == element.producto.PRODUCTO).porcentaje / 100)) + element.producto.precio).toFixed(2))
      });
      
      this.invetarioMinimoProductos = this.invetarioP
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
  }
  onExported2(e) {
    e.component.columnOption("producto.CLASIFICA", "visible", false);
    e.component.columnOption("producto.DIMENSION", "visible", false);
    e.component.columnOption("producto.REFERENCIA", "visible", false);
    e.component.columnOption("producto.precio", "visible", false);
    e.component.columnOption("bodega", "visible", false);
    e.component.columnOption("ultimoPrecioCompra", "visible", false);
    e.component.endUpdate();
  }

  updateInventarioClasificacion = (e) => {
    this.actualizarInventarioPorClasificacion(e.row.data);
  };



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
