import { Component, OnInit, ViewChild } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "angularfire2/firestore";
import {
  detalleTraslados,
  traslados,
  transportista,
  productosSucursal,
} from "./traslados";
import { Sucursal } from "../compras/compra";
import { bodega } from "../producto/producto";
import { producto, contadoresDocumentos } from "../ventas/venta";
import { objDate, transaccion } from "../transacciones/transacciones";
import Swal from "sweetalert2";
import pdfMake from "pdfmake/build/pdfmake";
import { DxDataGridComponent } from "devextreme-angular";
import dxSelectBox from "devextreme/ui/select_box";
import { parametrizacionsuc } from "../parametrizacion/parametrizacion";
import { ParametrizacionesService } from "src/app/servicios/parametrizaciones.service";
import { SucursalesService } from "src/app/servicios/sucursales.service";
import { BodegaService } from "src/app/servicios/bodega.service";
import { TransaccionesService } from "src/app/servicios/transacciones.service";
import { ProductoService } from "src/app/servicios/producto.service";
import { ContadoresDocumentosService } from "src/app/servicios/contadores-documentos.service";
import { TransportistaService } from "src/app/servicios/transportista.service";
import { TrasladosService } from "src/app/servicios/traslados.service";
import { AuthenService } from "src/app/servicios/authen.service";
import { user } from "../user/user";
import DataSource from "devextreme/data/data_source";
import { AuthService } from "src/app/shared/services";
import { DatosConfiguracionService } from "src/app/servicios/datosConfiguracion.service";
import { ProductoCombo, productosCombo } from "../catalogo/catalogo";
import { CombosService } from "src/app/servicios/combos.service";
import { inventario, productoTransaccion } from "../consolidado/consolidado";

@Component({
  selector: "app-traslados",
  templateUrl: "./traslados.component.html",
  styleUrls: ["./traslados.component.scss"],
})
export class TrasladosComponent implements OnInit {
  nombre_transportista: string;
  identificacion: string;
  celular: string;
  tipo_vehiculo: string;
  placa: string;
  id2: number;
  now: Date;
  sucursal_origen: string;
  bodega_origen: string;
  sucursal_destino: string;
  bodega_destino: string;
  observaciones: string = "";
  traslados: traslados;
  trasladosG: traslados[] = [];
  trasladosGlobales: traslados[] = [];
  trasladosEnviados: traslados[] = [];
  trasladosRecibidos: traslados[] = [];
  trasladosEliminados: traslados[] = [];
  trasladosGR: traslados[] = [];
  number_transaccion = 0;
  numeroFactura: string;
  cantidadProductos = 0;
  detalleTraslados: detalleTraslados[] = [];
  detalleTrasladosBase: detalleTraslados[] = [];
  detalleTraslado: detalleTraslados;
  locales: Sucursal[] = [];
  locales2: Sucursal[] = [];
  bodegas: bodega[] = [];
  transportistas: transportista[] = [];
  bodegasorigen: bodega[] = [];
  bodegasdestino: bodega[] = [];
  productos: producto[] = [];
  productosActivos: producto[] = [];
  mostrar = false;
  valor2 = 100;
  valor3 = 100;
  bloquearBtn = false;

  //procesos para inventario
  proTransaccion: productoTransaccion = new productoTransaccion();
  invetarioP:inventario[]=[]
  invetarioProd:inventario

  productos2: producto[] = [];
  productosTraslado: producto[] = [];
  transaccion: transaccion;
  transportista: transportista;
  seleccion: boolean = true;
  bodegaExternaSeleccion: boolean = false;
  textpiezas1: boolean = false;
  varL: boolean = true;
  readSuc: boolean = false;
  transacciones: transaccion[] = [];
  productosSucursal: productosSucursal[] = [];
  productosSucursal2: productosSucursal[] = [];

  parametrizaciones: parametrizacionsuc[] = [];
  parametrizacionSucu: parametrizacionsuc;
  contadores: contadoresDocumentos[] = [];
  variablesucursal: string = "";
  var1: string = "matriz";
  facturaNp: number = 0;
  mensajeLoading = "";
  sucursalUsuario = "";

  sucursalesDefault: string[] = ["matriz", "sucursal1", "sucursal2"];

  menuUnidades: string[] = ["Unidad", "Cajas", "Cajas/Piezas", "Bultos"];

  menu1: string[] = ["Traslados", "Traslados Mensuales", "Traslados Globales"];
  correo: string = "";
  usuarioLogueado: user;
  imagenLogotipo = "";
  
  @ViewChild("datag4") dataGrid2: DxDataGridComponent;
  @ViewChild("selectId") select: dxSelectBox;
  expensesCollection3: AngularFirestoreCollection<transaccion>;
  contadorFirebase: contadoresDocumentos[] = [];
  productos22: DataSource;
  bodegaExterna: Sucursal = new Sucursal();
  obj: objDate;
  mostrarLoading: boolean = false;
  constructor(
    private db: AngularFirestore,
    public parametrizacionService: ParametrizacionesService,
    public authenService: AuthenService,
    public trasladosService: TrasladosService,
    public transportistasService: TransportistaService,
    public contadoresService: ContadoresDocumentosService,
    public productoService: ProductoService,
    public bodegasService: BodegaService,
    public authService: AuthService,
    public _comboService : CombosService,
    public _configuracionService : DatosConfiguracionService,
    public transaccionesService: TransaccionesService,
    public sucursalesService: SucursalesService
  ) {
    this.traslados = new traslados();
    this.transportista = new transportista();
    this.detalleTraslado = new detalleTraslados();
    this.detalleTraslados.push(new detalleTraslados());
    this.now = new Date();
    this.obj = new objDate();
  }

  ngOnInit() {
    this.traerSucursales();
    this.setearFechaMensual();
    this.traerParametrizaciones();
    this.traerBodegas();
    this.traerProductos();
    this.traerTransportistas();
    this.traerContadoresDocumentos();
    this.getIDDocumentos();
    this.traerTransacciones();
    this.traerDatosConfiguracion();
  }

  traerDatosConfiguracion() {
    this._configuracionService.getDatosConfiguracion().subscribe((res) => {
      this.imagenLogotipo = res[0].urlImage;
    });
  }

  cargarUsuarioLogueado() {
    this.sucursalUsuario = "matriz"
    new Promise((res, err) => {
      if (localStorage.getItem("maily") != "") 
        this.correo = localStorage.getItem("maily");

      this.authenService.getUserLogueado(this.correo).subscribe(
        (res) => {
          this.usuarioLogueado = res as user;
          this.sucursalUsuario = this.usuarioLogueado[0].sucursal
          localStorage.setItem('sucursal',  this.sucursalUsuario);
          localStorage.setItem('rol',  this.usuarioLogueado[0].rol);
          if (this.usuarioLogueado[0].rol == "Usuario") {
            var z = document.getElementById("admin1");
            z.style.display = "none";
          }else if (this.usuarioLogueado[0].rol == "Administrador") 
             this.mostrar = true;
          

          if(this.usuarioLogueado[0].status == "Inactivo")
              this.authService.logOut();

          this.validarRol();
        },
        (err) => {}
      );
    });
  }


  isCloneIconDisabled(e) {
    this.sucursalUsuario = localStorage.getItem("sucursal");
    var rol = localStorage.getItem("rol");

    if(rol == "Administrador")
      return true;

    if(e.row.data.sucursal_destino.nombre == this.sucursalUsuario)
      return true;
    else 
      return false;
  }


  separarRegistrosTraslados() {
    if (this.usuarioLogueado[0].rol != "Administrador") {
      switch (this.usuarioLogueado[0].sucursal) {
        case "matriz":
          this.trasladosGlobales.forEach((element) => {
            if (element.sucursal_origen.nombre == "matriz") {
              this.trasladosG.push(element);
            }
          });
          this.asignarValores();
          break;
        case "sucursal1":
          this.trasladosGlobales.forEach((element) => {
            if (element.sucursal_origen.nombre == "sucursal1") {
              this.trasladosG.push(element);
            }
          });
          this.asignarValores();
          break;
        case "sucursal2":
          this.trasladosGlobales.forEach((element) => {
            if (element.sucursal_origen.nombre == "sucursal2") {
              this.trasladosG.push(element);
            }
          });
          this.asignarValores();
          break;
        default:
          break;
      }
    } else {
      this.trasladosG = this.trasladosGlobales;
    }
    this.asignarValores();
  }

  validarRol() {
    this.sucursal_origen = this.usuarioLogueado[0].sucursal;
    this.variablesucursal = this.usuarioLogueado[0].sucursal;
    this.obtenerDatos(this.variablesucursal);
    this.bodegas.forEach((element) => {
      if (element.sucursal == this.sucursal_origen) {
        this.bodegasorigen.push(element);
      }
    });
    if (
      this.usuarioLogueado[0].rol == "Administrador" ||
      this.usuarioLogueado[0].rol == "Supervisor"
    ) {
      var x = document.getElementById("admin");
      x.style.display = "block";
      this.varL = false;
    }
  }

  traerParametrizaciones() {
    this.parametrizacionService.getParametrizacion().subscribe((res) => {
      this.parametrizaciones = res as parametrizacionsuc[];
    });
  }

  traerSucursales() {
    this.sucursalesService.getSucursales().subscribe((res) => {
      this.locales = res as Sucursal[];
      this.cargarUsuarioLogueado();
    });
  }

  traerBodegas() {
    this.bodegasService.getBodegas().subscribe((res) => {
      this.bodegas = res as bodega[];
    });
  }

  traerTransacciones() {
    this.transaccionesService.getTransaccion().subscribe((res) => {
      this.transacciones = res as transaccion[];
    });
  }

  traerProductos() {
    this.productoService.getProductosActivos().subscribe((res) => {
      this.productosActivos = res as producto[];
      this.productos = res as producto[];
      this.llenarC();
    });
  }

  llenarC() {
    this.productos22 = new DataSource({
      store: this.productos,
      sort: [{ field: "PRODUCTO", asc: true }],
    });
  }

  traerTransportistas() {
    this.transportistasService.getTransportistas().subscribe((res) => {
      this.transportistas = res as transportista[];
    });
  }

  traerTraslados() {
    this.trasladosG = [];
    this.trasladosGR = [];
    this.trasladosEnviados = [];
    this.trasladosEliminados = [];
    this.trasladosRecibidos = [];
    this.mostrarLoading = true;
    this.trasladosService.getTraslado().subscribe((res) => {
      this.trasladosG = res as traslados[];
      this.asignarValores();
    });
  }

  traerTrasladosMensuales() {
    this.trasladosG = [];
    this.trasladosGR = [];
    this.trasladosEnviados = [];
    this.trasladosEliminados = [];
    this.trasladosRecibidos = [];
    this.mostrarLoading = true;
    this.trasladosService.getTrasladosMensuales(this.obj).subscribe((res) => {
      this.trasladosG = res as traslados[];
      this.asignarValores();
    });
  }

  traerContadoresDocumentos() {
    this.contadoresService.getContadores().subscribe((res) => {
      this.contadores = res as contadoresDocumentos[];
      this.asignarIDdocumentos();
    });
  }

  asignarIDdocumentos() {
    this.id2 = this.contadores[0].contTraslados_Ndocumento + 1;
  }

  setearFechaMensual() {
    var fechaHoy = new Date();
    var fechaAnterior = new Date();
    fechaHoy.setDate(fechaHoy.getDate() + 1);
    fechaAnterior.setDate(fechaHoy.getDate() - 30);
    this.obj = new objDate();
    this.obj.fechaActual = fechaHoy;
    this.obj.fechaAnterior = fechaAnterior;
  }

  async getIDDocumentos() {
    await this.db
      .collection("consectivosBaseMongoDB")
      .valueChanges()
      .subscribe((data: contadoresDocumentos[]) => {
        if (data != null) this.contadorFirebase = data;
        this.asignarIDdocumentos2();
      });
  }

  asignarIDdocumentos2() {
    this.number_transaccion = this.contadorFirebase[0].transacciones_Ndocumento + 1;
  }

  asignarValores() {
    this.trasladosG.forEach((element) => {
      if (element.estado == "Rechazado") {
        this.trasladosGR.push(element);
      } else if (element.estado == "ENVIADO") {
        this.trasladosEnviados.push(element);
      } else if (element.estado == "RECIBIDO") {
        this.trasladosRecibidos.push(element);
      } else if (element.estado == "ELIMINADO") {
        this.trasladosEliminados.push(element);
      }
    });
    this.mostrarLoading = false;
  }

 

  mostrarC(e) {
    if (this.seleccion) {
      this.varL = false;
    } else {
      this.varL = true;
    }
  }

  activarBodegaExterna(e) {
    this.bodegaExterna.nombre = "Bodega Externa";
    this.bodegaExterna.direccion = "S/D";
    this.bodegaExterna.celular = "S/D";
    this.bodegaExterna.nombreComercial = "S/D";
    this.bodegaExterna.contacto = "S/D";
    this.bodegaExterna.sucursalTipo = "S/D";
    if (this.bodegaExternaSeleccion) {
      this.readSuc = true;
      this.traslados.sucursal_destino = this.bodegaExterna;
      this.traslados.bodega_destino = "Bodega Externa";
      this.bodegasdestino = null;
      this.locales2 = null;
    } else {
      this.readSuc = false;
    }
  }

  llenarComboProductos2() {
    this.productosActivos.forEach((element) => {
      if (element.ESTADO == "ACTIVO") {
        this.productos.push(element);
      }
    });
  }

  asignarsucursalD(e) {
    this.variablesucursal = e.value;
    this.sucursal_origen = this.variablesucursal;
  }

  obtenerDatos(sucursal: string) {
    this.locales.forEach((element) => {
      if (element.nombre == sucursal) {
        this.traslados.sucursal_origen = element;
      }
    });
    this.bodegasorigen = [];
    this.bodegas.forEach((element) => {
      if (element.sucursal == sucursal) {
        this.bodegasorigen.push(element);
      }
    });
    this.compararlocales();
  }

  obtenerDatosSucursalOrigen(e) {
    this.locales.forEach((element) => {
      if (element.nombre == e.value)
        this.traslados.sucursal_origen = element;
    });

    this.bodegasorigen = [];
    this.bodegas.forEach((element) => {
      if (element.sucursal == e.value) 
        this.bodegasorigen.push(element);
    });
    this.compararlocales();
    this.llenarComboProductos(e);
  }

  setTransportista(e) {
    this.transportistas.forEach((element) => {
      if (element.nombre == this.nombre_transportista) {
        this.traslados.transportista = element;
        this.nombre_transportista = element.nombre;
        this.celular = element.celular;
        this.identificacion = element.identificacion;
        this.placa = element.placa;
        this.tipo_vehiculo = element.vehiculo;
      }
    });
  }

  llenarComboProductos(e) {
    this.productosTraslado = this.productos;
  }

  obtenerDatosSucursalDestino(e) {
    this.locales.forEach((element) => {
      if (element.nombre == e.value) {
        this.traslados.sucursal_destino = element;
      }
    });
    this.bodegasdestino = [];
    this.bodegas.forEach((element) => {
      if (element.sucursal == e.value) {
        this.bodegasdestino.push(element);
      }
    });
  }


  obtenerDatosBodegaOrigen(e) {
    this.traslados.bodega_origen = e.value;
  }
  obtenerDatosBodegaDestino(e) {
    this.traslados.bodega_destino = e.value;
  }

  anadirProducto = (e) => {
    this.detalleTraslados.push(new detalleTraslados());
  };

  obtenerTipo(e, i: number) {
    this.detalleTraslados[i].tipo = e.value;
  }

  getCourseFile = (e) => {
    this.cargarDatosRemisión(e.row.data);
  };

  cargarDatosRemisión(e: any) {
    this.detalleTraslados = [];
    this.trasladosG.forEach((element) => {
      if (e.idT == element.idT) {
        this.traslados = element;
        this.detalleTraslados = element.detalleTraslados;
      }
    });

    this.parametrizaciones.forEach((element) => {
      if(element.sucursal == this.traslados.sucursal_origen.nombre)
        this.parametrizacionSucu = element;
    });
    this.crearPDF();
  }

  opcionMenu(e) {
    var x = document.getElementById("traslados");
    var y = document.getElementById("historial");
    var z = document.getElementById("existencias");

    switch (e.value) {
      case "Traslados":
        x.style.display = "block";
        y.style.display = "none";
        z.style.display = "none";
        this.detalleTraslados = [];
        this.detalleTraslados.push(new detalleTraslados());
        break;
      case "Traslados Mensuales":
        this.traerTrasladosMensuales();
        x.style.display = "none";
        y.style.display = "block";
        z.style.display = "none";
        break;
      case "Traslados Globales":
        this.traerTraslados();
        x.style.display = "none";
        y.style.display = "block";
        z.style.display = "none";
        break;
      case "Existencias Productos":
        x.style.display = "none";
        y.style.display = "none";
        z.style.display = "block";
        break;
      default:
    }
  }

  mostrarEliminar() {
    if (this.dataGrid2.instance.columnOption("bt2").visible == false) {
      this.dataGrid2.instance.columnOption("bt2", "visible", true);
      this.dataGrid2.instance.columnOption("bt1", "visible", false);
    } else {
      this.dataGrid2.instance.columnOption("bt2", "visible", false);
      this.dataGrid2.instance.columnOption("bt1", "visible", true);
    }
  }

  getCourseFile3 = (e) => {
    this.rechazarTraslado(e.row.data);
  };

  getCourseFile4 = (e) => {
    this.eliminarRemision(e.row.data);
  };

  getCourseRecibido = (e) => {
    this.guardarTrasladoRecpcion(e.row.data);
  };

  rechazarTraslado(e: any) {
    Swal.fire({
      title: "Eliminar Traslado",
      text: "Desea eliminar el traslado #" + e.idT,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.trasladosService.updateEstadoTraslado(e, "Rechazado").subscribe(
          (res) => {},
          (err) => { alert("error");}
        );
        Swal.fire({
          title: "Correcto",
          text: "Un administrador aprobará su eliminación",
          icon: "success",
          confirmButtonText: "Ok",
        }).then((result) => {
          window.location.reload();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado!", "Se ha cancelado su proceso.", "error");
      }
    });
  }

  eliminarRemision(e: any) {
    var data = "";
    data = e.id + "";
    Swal.fire({
      title: "Eliminar Traslado",
      text: "Se eliminará definitivamente el traslado #" + e.idT,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.mensajeGuardando();
        this.trasladosService.updateEstadoTraslado(e, "ELIMINADO").subscribe(
          (res) => {this.eliminarTransacciones(e);},
          (err) => { alert("error");}
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado!", "Se ha cancelado su proceso.", "error");
      }
    });
  }

  eliminarTransacciones(e) {
    this.transacciones.forEach((element) => {
      if (element.documento == e.idT && (element.tipo_transaccion == "traslado1" ||element.tipo_transaccion == "traslado2") ) {
        this.transaccionesService.deleteTransaccion(element).subscribe(
          (res) => {},
          (err) => { alert("error");}
        );
      }
    });

    this.actualizarProductosBase2(e);
  }

  mensajeGuardando() {
    let timerInterval;
    Swal.fire({
      title: "Guardando !",
      html: "Procesando",

      timerProgressBar: true,
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


  crearTransportista() {
    if (this.traslados.transportista._id) {
      this.transportistasService.updateTransportista(this.traslados.transportista).subscribe(
          (res) => {},
          (err) => {
            Swal.fire({
              title: "Error",
              text: "Revise e intente nuevamente",
              icon: "error",
            });
          }
        );
    } else {
      this.transportistasService.newTransportista(this.traslados.transportista).subscribe(
          (res) => {},
          (err) => {
            Swal.fire({
              title: "Error",
              text: "Revise e intente nuevamente",
              icon: "error",
            });
          }
        );
    }
  }

  validarGuardar() {
    var bandera = false;
    this.detalleTraslados.forEach((element) => {
      if (element.cantidadm2 == 0 || element.cantidadm2 == null) 
        bandera = true;
    });

    if (bandera) {
      Swal.fire({
        title: "Error",
        text: "Revise el detalle de los productos e intente nuevamente",
        icon: "error",
      });
    } else {
      this.bloquearBtn = true;
      this.guardarTraslado();
    }
  }

  guardarTrasladoRecpcion(e: any) {
    var contVal = 0;
    this.traslados = e;
    this.detalleTraslados = e.detalleTraslados;
    this.mensajeGuardando();
    this.detalleTraslados.forEach((element) => {
      element.id = this.id2;
      this.transaccion = new transaccion();
      this.transaccion.fecha_mov = new Date().toLocaleString();
      this.transaccion.fecha_transaccion = this.traslados.fecha;
      this.transaccion.sucursal = this.traslados.sucursal_destino.nombre;
      this.transaccion.totalsuma = 0;
      this.transaccion.bodega = this.traslados.bodega_destino;
      this.transaccion.documento = this.traslados.idT + "";
      this.transaccion.factPro = this.traslados.idT + "";
      this.transaccion.producto = element.producto;
      this.transaccion.cajas = element.cajas;
      this.transaccion.piezas = element.piezas;
      this.transaccion.cantM2 = element.cantidadm2;
      this.transaccion.observaciones = this.traslados.observaciones;
      this.transaccion.tipo_transaccion = "traslado2";
      this.transaccion.movimiento = 1;
      this.transaccion.usu_autorizado = this.usuarioLogueado[0].username;
      this.transaccion.usuario = this.usuarioLogueado[0].username;
      this.transaccion.idTransaccion = this.number_transaccion++;

      var producto = this.productos.find(element2=> element2.PRODUCTO == element.producto)
      if(producto?.CLASIFICA == "COMBO")
        this.generarTransaccionesComboProductos(element.producto, 2)

      this.transaccionesService.newTransaccion(this.transaccion).subscribe(
        (res) => { contVal++, this.contadorValidacionesRecibidos(e, contVal);},
        (err) => {}
      );
    });
    this.actualizarProductosBaseRecibios();
  }

  guardarTraslado() {
    if (this.bodegaExternaSeleccion) {
      this.traslados.sucursal_destino = this.bodegaExterna;
      this.traslados.bodega_destino = "BodegaExterna";
    }
    this.transportista._id = this.traslados.transportista._id
    this.transportista.identificacion = this.identificacion;
    this.transportista.nombre = this.nombre_transportista;
    this.transportista.celular = this.celular;
    this.transportista.placa = this.placa;
    this.transportista.vehiculo = this.tipo_vehiculo;
    var contVal = 0;
    this.traslados.idT = this.id2;
    this.traslados.transportista = this.transportista;
    this.traslados.observaciones = this.observaciones;
    this.traslados.detalleTraslados = this.detalleTraslados;
    this.traslados.fecha = this.now;
    var bandera = true;
    this.detalleTraslados.forEach((element) => {
      if (element.producto == undefined) {
        if (element.cajas == 0 || element.piezas == 0)
            bandera = false;
      }
    });
    if (
      this.traslados.transportista.identificacion != undefined &&
      this.traslados.transportista.nombre != undefined &&
      this.traslados.transportista.celular != undefined &&
      this.traslados.transportista.placa != undefined &&
      this.traslados.transportista.vehiculo != undefined &&
      this.traslados.sucursal_destino != undefined &&
      this.traslados.sucursal_origen != undefined &&
      this.traslados.bodega_destino != undefined &&
      this.traslados.bodega_origen != undefined &&
      bandera == true
    ) {
      this.mensajeGuardando();
      new Promise<any>((resolve, reject) => {
        this.crearTransportista();
        this.trasladosService.newTraslado(this.traslados).subscribe(
          (res) => {
            this.contadores[0].contTraslados_Ndocumento = this.id2;
            this.contadoresService.updateContadoresTraslados(this.contadores[0]).subscribe(
                (res) => {contVal++ ; this.contadorValidaciones(contVal)},
                (err) => {});},
          (err) => {}
        );
        this.detalleTraslados.forEach((element) => {
          element.id = this.id2;
          this.transaccion = new transaccion();
          this.transaccion.fecha_mov = new Date().toLocaleString();
          this.transaccion.fecha_transaccion = this.traslados.fecha;
          this.transaccion.sucursal = this.traslados.sucursal_origen.nombre;
          this.transaccion.totalsuma = 0;
          this.transaccion.bodega = this.traslados.bodega_origen;
          this.transaccion.documento = this.id2 + "";
          this.transaccion.factPro = this.id2 + "";
          this.transaccion.producto = element.producto;
          this.transaccion.cajas = element.cajas;
          this.transaccion.piezas = element.piezas;
          this.transaccion.cantM2 = element.cantidadm2;
          this.transaccion.observaciones = this.traslados.observaciones;
          this.transaccion.movimiento = -1;
          this.transaccion.tipo_transaccion = "traslado1";
          this.transaccion.usu_autorizado = this.usuarioLogueado[0].username;
          this.transaccion.usuario = this.usuarioLogueado[0].username;
          this.transaccion.idTransaccion = this.number_transaccion++;
          
          var producto = this.productos.find(element2=> element2.PRODUCTO == element.producto)
          if(producto?.CLASIFICA == "COMBO")
            this.generarTransaccionesComboProductos(element.producto, 1)

          this.transaccionesService.newTransaccion(this.transaccion).subscribe(
            (res) => {this.contadores[0].transacciones_Ndocumento = this.number_transaccion++; },
            (err) => {}
          );
        });
        this.actualizarProductosBase();
      });
    } else {
      Swal.fire("Error!", "Hay campos vacios", "error");
    }
  }


  generarTransaccionesComboProductos(nombreCombo : string, tipo : number){
    var combo = new ProductoCombo();
    combo.PRODUCTO = nombreCombo;
    this._comboService.getComboPorNombre(combo).subscribe(res => {
      var listado = res as ProductoCombo[];
      if(listado.length > 0){
        if(tipo == 1)
          this.agregarTransacciones(listado[0].productosCombo,nombreCombo)
        else if(tipo == 2)
          this.agregarTransaccionesRecepcion(listado[0].productosCombo,nombreCombo)
      }
        
    })
  }

  agregarTransacciones(productos : productosCombo[], nombreCombo: string){
    var contVal = 0;
    productos.forEach(element => {
      var proV = this.detalleTraslados.find(el => el.producto == nombreCombo)
      this.transaccion = new transaccion()
      this.transaccion.fecha_mov = new Date().toLocaleString()
      this.transaccion.fecha_transaccion = this.traslados.fecha;
      this.transaccion.sucursal = this.traslados.sucursal_origen.nombre;
      this.transaccion.totalsuma = 0;
      this.transaccion.bodega = "12"
      this.transaccion.valor = element.precioCombo
      this.transaccion.cantM2 = proV.cantidadm2 * element.cantidad
      this.transaccion.costo_unitario = element.precioMin
      this.transaccion.documento = this.id2 + "";
      this.transaccion.factPro = this.id2 + "";
      this.transaccion.producto = element.producto.PRODUCTO
      this.transaccion.cajas = proV.cantidadm2 * element.cantidad;
      this.transaccion.piezas = 0;
      this.transaccion.observaciones = this.traslados.observaciones;
      this.transaccion.tipo_transaccion = "traslado1";
      this.transaccion.movimiento = -1
      this.transaccion.usu_autorizado = this.usuarioLogueado[0].username;
      this.transaccion.usuario = this.usuarioLogueado[0].username;
      this.transaccion.idTransaccion = this.number_transaccion++;

      this.transaccionesService.newTransaccion(this.transaccion).subscribe(
        res => { contVal++, this.contadorGenerico(contVal, productos.length)},
        err => { this.mostrarMensajeGenerico(2,"Revise e intente nuevamente") })
    });
  }


  agregarTransaccionesRecepcion(productos : productosCombo[], nombreCombo: string){
    var contVal = 0;
    productos.forEach(element => {
      var proV = this.detalleTraslados.find(el => el.producto == nombreCombo)
      this.transaccion = new transaccion()
      this.transaccion.fecha_mov = new Date().toLocaleString()
      this.transaccion.fecha_transaccion = this.traslados.fecha;
      this.transaccion.sucursal = this.traslados.sucursal_destino.nombre;
      this.transaccion.totalsuma = 0;
      this.transaccion.bodega = this.traslados.bodega_destino;
      this.transaccion.valor = element.precioCombo
      this.transaccion.cantM2 = proV.cantidadm2 * element.cantidad;
      this.transaccion.costo_unitario = element.precioMin
      this.transaccion.documento = this.traslados.idT + "";
      this.transaccion.factPro = this.traslados.idT + "";
      this.transaccion.producto = element.producto.PRODUCTO
      this.transaccion.cajas = proV.cantidadm2 * element.cantidad;
      this.transaccion.piezas = 0;
      this.transaccion.observaciones = this.traslados.observaciones;
      this.transaccion.tipo_transaccion = "traslado2";
      this.transaccion.movimiento = 1
      this.transaccion.usu_autorizado = this.usuarioLogueado[0].username;
      this.transaccion.usuario = this.usuarioLogueado[0].username;
      this.transaccion.idTransaccion = this.number_transaccion++;

      this.transaccionesService.newTransaccion(this.transaccion).subscribe(
        res => { contVal++, this.contadorGenerico(contVal, productos.length)},
        err => { this.mostrarMensajeGenerico(2,"Revise e intente nuevamente") })
    });
  }



  contadorGenerico(cont1 : number, cont2: number){
    if(cont1 == cont2)  
      return true;
  }


  buscarDatosSucursal() {
    this.parametrizaciones.forEach((element) => {
      if (element.sucursal == this.traslados.sucursal_origen.nombre) 
        this.parametrizacionSucu = element;
    });
  }

  actualizarProductosBaseRecibios() {
    var restProd = 0;
    var sumProd = 0;
    for (let index = 0; index < this.productos.length; index++) {
      const element = this.productos[index];
      this.detalleTraslados.forEach((element2) => {
        sumProd = 0;
        if (element2.producto == element.PRODUCTO) {
          switch (this.traslados.sucursal_destino.nombre) {
            case "matriz":
              sumProd = element.sucursal1 + element2.cantidadm2;
              element.sucursal1 = sumProd;
              this.productoService.updateProductoSucursal1(element).subscribe(
                (res) => {},
                (err) => { alert("error");}
              );
              break;
            case "sucursal1":
              sumProd = element.sucursal2 + element2.cantidadm2;
              element.sucursal2 = sumProd;
              this.productoService.updateProductoSucursal2(element).subscribe(
                (res) => {},
                (err) => {alert("error"); }
              );
              break;
            case "sucursal2":
              sumProd = element.sucursal3 + element2.cantidadm2;
              element.sucursal3 = sumProd;
              this.productoService.updateProductoSucursal3(element).subscribe(
                (res) => {},
                (err) => {}
              );
            default:
          }
        }
      });
    }
  }

  actualizarProductosBase() {
    var restProd = 0;
    var sumProd = 0;
    for (let index = 0; index < this.productos.length; index++) {
      const element = this.productos[index];
      this.detalleTraslados.forEach((element2) => {
        restProd = 0;
        if (element2.producto == element.PRODUCTO) {
          switch (this.traslados.sucursal_origen.nombre) {
            case "matriz":
              restProd = element.sucursal1 - element2.cantidadm2;
              element.sucursal1 = restProd;
              this.productoService.updateProductoSucursal1(element).subscribe(
                (res) => {},
                (err) => { alert("error"); });
              break;
            case "sucursal1":
              restProd = element.sucursal2 - element2.cantidadm2;
              element.sucursal2 = restProd;
              this.productoService.updateProductoSucursal2(element).subscribe(
                (res) => { },
                (err) => { alert("error"); } );
             
              break;
            case "sucursal2":
              restProd = element.sucursal3 - element2.cantidadm2;
              element.sucursal3 = restProd;
              this.productoService.updateProductoSucursal3(element).subscribe(
                (res) => {},
                (err) => { alert("error"); }
              );
            default:
          }
        }
      });
    }

  }

  actualizarProductosBase2(e: any) {
    var restProd = 0;
    var sumProd = 0;
    var cont = 0;
    var contex = 0;
    this.detalleTraslados = [];

    this.trasladosGR.forEach((element) => {
      if (e.idT == element.idT) {
        this.traslados = element;
        this.detalleTraslados = element.detalleTraslados;
      }
    });

    for (let index = 0; index < this.productos.length; index++) {
      const element = this.productos[index];
      this.detalleTraslados.forEach((element2) => {
        restProd = 0;
        if (element2.producto == element.PRODUCTO) {
          switch (this.traslados.sucursal_origen.nombre) {
            case "matriz":
              restProd = element.sucursal1 + element2.cantidadm2;
              element.sucursal1 = restProd;
              this.productoService.updateProductoSucursal1(element).subscribe(
                (res) => {},
                (err) => { alert("error"); }
              );
              break;
            case "sucursal1":
              restProd = element.sucursal3 + element2.cantidadm2;
              element.sucursal2 = restProd;
              this.productoService.updateProductoSucursal2(element).subscribe(
                (res) => {},
                (err) => {alert("error");}
              );
              break;
            case "sucursal2":
              restProd = element.sucursal3 + element2.cantidadm2;
              element.sucursal3 = restProd;
              this.productoService.updateProductoSucursal3(element).subscribe(
                (res) => {},
                (err) => { alert("error");}
              );
            default:
          }
        }
      });
    }
    new Promise<any>((resolve, reject) => {
      for (let index = 0; index < this.productos.length; index++) {
        const element = this.productos[index];
        this.detalleTraslados.forEach((element2) => {
          sumProd = 0;
          if (element2.producto == element.PRODUCTO) {
            switch (this.traslados.sucursal_destino.nombre) {
              case "matriz":
                sumProd = element.sucursal1 - element2.cantidadm2;
                element.sucursal1 = sumProd;
                this.productoService.updateProductoSucursal1(element).subscribe(
                  (res) => {
                    contex++, this.contadorValidaciones2(contex);
                  },
                  (err) => {
                    alert("error");
                  }
                );
                break;
              case "sucursal1":
                sumProd = element.sucursal2 - element2.cantidadm2;
                element.sucursal2 = sumProd;
                this.productoService.updateProductoSucursal2(element).subscribe(
                  (res) => {
                    contex++, this.contadorValidaciones2(contex);
                  },
                  (err) => {
                    alert("error");
                  }
                );
                break;
              case "sucursal2":
                sumProd = element.sucursal3 - element2.cantidadm2;
                element.sucursal3 = sumProd;
                this.productoService.updateProductoSucursal3(element).subscribe(
                  (res) => {
                    contex++, this.contadorValidaciones2(contex);
                  },
                  (err) => {
                    alert("error");
                  }
                );
              default:
                contex++, this.contadorValidaciones2(contex);
            }
          }
        });
      }
    });
  }

  contadorValidaciones2(i: number) {
    if (this.detalleTraslados.length == i) {
      Swal.close();
      Swal.fire({
        title: "Traslado eliminado",
        text: "Se ha realizado con éxito",
        icon: "success",
        confirmButtonText: "Ok",
      }).then((result) => {
        window.location.reload();
      });
    } 
  }

  obtenerDetallesProducto(e, i: number) {
    this.productos.forEach((element) => {
      if (element.PRODUCTO == e.value) {
        if(element.CLASIFICA == "COMBO")
          this.buscarCombo(e.value, i)
        else
          this.traerTransaccionesPorProducto(element, i);

        switch (element.UNIDAD) {
          case "Metros":
            this.detalleTraslados[i].tipo = "Cajas / Piezas";
            break;
          case "Unidad":
            this.detalleTraslados[i].tipo = "Unidades";
            this.detalleTraslados[i].desPiezas = true;
            break;
          default:
            this.detalleTraslados[i].tipo = element.UNIDAD;
            break;
        }
      }
    });

    var producto = this.detalleTraslados.filter(element=>element.producto == e.value)
    if (producto.length > 1) {
      Swal.fire("Alerta", "Ya tiene detallado este producto", "warning");
      this.deleteProducto(i);
    }
  }

  buscarCombo(nombreCombo, num){
    var combo = new ProductoCombo();
    combo.PRODUCTO = nombreCombo;
    this._comboService.getComboPorNombre(combo).subscribe(res => {
      var listado = res as ProductoCombo[];
      this.buscarProductosCombo(listado[0].productosCombo, num);
    })
  }

  buscarProductosCombo(listado : productosCombo[], num : number){   
    this.mostrarLoading = true;
    this.cantidadProductos = 0; 
    listado.forEach(element => {
      this.productos.forEach(element2 => {
        if(element.nombreProducto == element2.PRODUCTO)
          this.traerTransaccionesPorProductoCombo2(element2, num , listado.length, element)
      });
    });
  }


  traerTransaccionesPorProducto(nombreProducto: producto,numero : number) {
    this.invetarioP = [];
    this.mostrarLoading = true;
    this.proTransaccion.nombre = nombreProducto.PRODUCTO;
    this.transaccionesService.getTransaccionesPorProducto(this.proTransaccion)
      .subscribe((res) => {
        this.transacciones = res as transaccion[];
        this.cargarDatosProductoUnitario(nombreProducto,numero);
      });
  }


  validarCantidad(i: number) {
    var cantm2 = 0;
    this.productos.forEach((element) => {
      if (element.PRODUCTO == this.detalleTraslados[i].producto) {
        cantm2 = parseFloat(( element.M2 * this.detalleTraslados[i].cajas +(this.detalleTraslados[i].piezas * element.M2) / element.P_CAJA ).toFixed(2));
        this.detalleTraslados[i].cantidadm2 = cantm2;

        switch (this.traslados.sucursal_origen.nombre) {
          case "matriz":
            if (cantm2 > element.sucursal1) {
              this.detalleTraslados[i].cajas = 0;
              this.detalleTraslados[i].piezas = 0;
              this.detalleTraslados[i].cantidadm2 = 0;
              this.mensajeExceso();
            }
            break;
          case "sucursal1":
            if (cantm2 > element.sucursal2) {
              this.detalleTraslados[i].cajas = 0;
              this.detalleTraslados[i].piezas = 0;
              this.detalleTraslados[i].cantidadm2 = 0;
              this.mensajeExceso();
            }
            break;
          case "sucursal2":
            if (cantm2 > element.sucursal3) {
              this.detalleTraslados[i].cajas = 0;
              this.detalleTraslados[i].piezas = 0;
              this.detalleTraslados[i].cantidadm2 = 0;
              this.mensajeExceso();
            }
          default:
        }
      }
    });
  }

  deleteProducto(i) {
    if (this.detalleTraslados.length > 1) {
      this.detalleTraslados.splice(i, 1);
    } else {
      Swal.fire(
        "Alerta",
        "Las facturas deben tener al menos un producto",
        "warning"
      );
    }
  }

  mensajeExceso() {
    Swal.fire(
      "Error",
      "Las cantidad excede el inventario del producto",
      "error"
    );
  }

  contadorValidacionesRecibidos(e, i: number) {
    if (this.detalleTraslados.length == i) {
      this.trasladosService.updateEstadoTraslado(e, "RECIBIDO").subscribe(
        (res) => {
          Swal.fire({
            title: "Traslado recibido",
            text: "Se ha guardado con éxito",
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
  }

  contadorValidaciones(i: number) {
    if (this.detalleTraslados.length == i) 
      this.guardarSalidaTraslado();
    
  }

  guardarSalidaTraslado() {
    this.buscarDatosSucursal();
    this.crearPDF();
    Swal.close();
    Swal.fire({
      title: "Traslado generado",
      text: "Se ha guardado con éxito",
      icon: "success",
      confirmButtonText: "Ok",
    }).then((result) => {
      window.location.reload();
    });
  }

  crearPDF() {
    const documentDefinition = this.getDocumentDefinition();
    pdfMake
      .createPdf(documentDefinition)
      .download("Traslado " + this.traslados.idT, function () {});
  }

  compararlocales() {
    var cont = 0;
    this.locales2.forEach((element) => {
      cont++;
    });
    if (cont >= 0) {
      this.locales2.forEach((element) => {
        this.locales2.splice(0);
      });
    }

    this.locales.forEach((element) => {
      if (element.nombre != this.traslados.sucursal_origen.nombre) {
        this.locales2.push(element);
      }
    });
  }

  setearNFactura() {
    let nf = this.traslados.idT;
    let num = ("" + nf).length;
    switch (num) {
      case 1:
        this.numeroFactura = "00000" + nf;
        break;
      case 2:
        this.numeroFactura = "0000" + nf;
        break;
      case 3:
        this.numeroFactura = "000" + nf;
        break;
      case 4:
        this.numeroFactura = "00" + nf;
        break;
      case 5:
        this.numeroFactura = "0" + nf;
        break;
      case 6:
        //this.numeroFactura= nf
        break;
      default:
    }
  }

  getDocumentDefinition() {
    this.buscarDatosSucursal();
    this.setearNFactura();

    sessionStorage.setItem("resume", JSON.stringify("jj"));
    //let tipoDocumento="Factura";
    return {
      pageSize: "A4",
      pageOrientation: "portrait",
      content: [
        {
          columns: [
            {
              image: this.imagenLogotipo,
              width: 100,
              margin: [0, 20, 0, 10],
            },
            {
              width: 410,
              margin: [0, 20, 0, 10],
              text: "Fecha : " + this.traslados.fecha.toLocaleString(),
              alignment: "right",
            },
          ],

          //alignment: 'center'
        },

        {
          columns: [
            [
              {
                text: this.parametrizacionSucu.razon_social,
              },
              {
                text: "RUC: " + this.parametrizacionSucu.ruc,
              },

              {
                text:
                  "Venta de materiales para acabados de construcción, porcelanatos, cerámicas ",
                fontSize: 9,
              },
              {
                text: "Dirección: " + this.parametrizacionSucu.direccion,
              },
              {
                text: "Teléfonos: " + this.parametrizacionSucu.telefonos,
              },
              {
                text: "Auto SRI " + this.parametrizacionSucu.sri,
              },
              {
                columns: [
                  {
                    width: 320,
                    text: "TRASLADO DE INVENTARIO  001 - 000",
                    bold: true,
                    fontSize: 18,
                  },
                  {
                    width: 200,
                    text: "NO " + this.numeroFactura,
                    color: "red",
                    bold: true,
                    fontSize: 20,
                    alignment: "right",
                  },
                ],
              },
              {
                columns: [
                  {
                    width: 250,
                    text: "Sucursal Origen",
                    bold: true,
                    fontSize: 12,
                    alignment: "center",
                  },
                  {
                    width: 250,
                    text: "Sucursal Destino",
                    bold: true,
                    fontSize: 12,
                    alignment: "center",
                  },
                ],
              },

              {
                //Desde aqui comienza los datos del cliente
                style: "tableExample",
                table: {
                  widths: [80, 160, 80, 160],
                  body: [
                    [
                      {
                        stack: [
                          {
                            type: "none",
                            bold: true,
                            fontSize: 9,
                            ul: [
                              "Sucursal",
                              "Dirección",
                              "Contacto",
                              "Teléfonos",
                              "Bodega",
                            ],
                          },
                        ],
                      },
                      {
                        stack: [
                          {
                            type: "none",
                            fontSize: 9,
                            ul: [
                              "" +
                                this.traslados.sucursal_origen.nombreComercial,
                              "" + this.traslados.sucursal_origen.direccion,
                              "" + this.traslados.sucursal_origen.contacto,
                              "" + this.traslados.sucursal_origen.celular,
                              "" + this.traslados.bodega_origen,
                            ],
                          },
                        ],
                      },
                      {
                        stack: [
                          {
                            type: "none",
                            bold: true,
                            fontSize: 9,
                            ul: [
                              "Sucursal",
                              "Dirección",
                              "Contacto",
                              "Teléfonos",
                              "Bodega",
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
                                "" +
                                  this.traslados.sucursal_destino
                                    .nombreComercial,
                                "" + this.traslados.sucursal_destino.direccion,
                                "" + this.traslados.sucursal_destino.contacto,
                                "" + this.traslados.sucursal_destino.celular,
                                "" + this.traslados.bodega_destino,
                              ],
                            },
                          ],
                        },
                      ],
                    ],
                  ],
                },
              },
              { text: "Datos Transportista", alignment: "center", bold: true },
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
                              "Nombre del Transportista",
                              "Identificación",
                              "Celular",
                              "Tipo de Vehículo/Color",
                              "Placa",
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
                                "" + this.traslados.transportista.nombre,
                                "" +
                                  this.traslados.transportista.identificacion,
                                "" + this.traslados.transportista.celular,
                                "" + this.traslados.transportista.vehiculo,
                                "" + this.traslados.transportista.placa,
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

        this.getProductosIngresados2(this.detalleTraslados),
        { text: " " },
        {
          text: "Observaciones: " + this.traslados.observaciones,
        },
        { text: " " },
        { text: " " },
        { text: " " },
        { text: " " },
        {
          columns: [
            {
              text: "Firma Emisor",
              width: 170,
              fontSize: 10,
              alignment: "right",
              margin: [40, 20, 20, 10],
            },
            {
              width: 170,
              margin: [50, 20, 20, 10],
              fontSize: 10,
              text: "Firma Transportador",
              alignment: "left",
            },
            {
              width: 170,
              margin: [40, 20, 20, 10],
              fontSize: 10,
              text: "Firma Destinatario",
              alignment: "left",
            },
          ],

          //alignment: 'center'
        },
      ],
      footer: function (currentPage, pageCount) {
        return {
          table: {
            body: [
              [
                {
                  text:
                    "  ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL ",
                  alignment: "center",
                  style: "textFot",
                },
              ],
            ],
          },
          layout: "noBorders",
        };
      },
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
        title: "Factura" + "_RESUME",
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

  getProductosIngresados2(productos: detalleTraslados[]) {
    return {
      table: {
        widths: ["15%", "15%", "45%", "25%"],
        alignment: "center",
        fontSize: 9,
        body: [
          [
            {
              text: "Cantidad",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Unidad",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Producto",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Observaciones",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
          ],

          ...productos.map((ed) => {
            return [
              {
                text: ed.cajas + "C " + ed.piezas + "P",
                fontSize: 9,
                alignment: "center",
              },
              { text: ed.tipo, alignment: "center", fontSize: 9 },
              { text: ed.producto, alignment: "center", fontSize: 9 },
              { text: ed.observaciones, alignment: "center", fontSize: 9 },
            ];
          }),
        ],
      },
    };
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





  //**************PROCESOS PARA CONSULTA DE DATOS ************/
  cargarDatosProductoUnitario(nombreProducto : producto , numero : number) {
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
    var cantidadRestante = 0;
    this.invetarioProd = new inventario();
    this.invetarioProd.producto = nombreProducto;
    this.invetarioProd.cantidadCajas = contCajas;
    this.invetarioProd.cantidadCajas2 = contCajas2;
    this.invetarioProd.cantidadCajas3 = contCajas3;

    this.invetarioProd.cantidadPiezas = contPiezas;
    this.invetarioProd.cantidadPiezas2 = contPiezas2;
    this.invetarioProd.cantidadPiezas3 = contPiezas3;
    this.invetarioP.push(this.invetarioProd);


    contCajas = 0;
    contPiezas = 0;
    contCajas2 = 0;
    contPiezas2 = 0;
    contCajas3 = 0;
    contPiezas3 = 0;
    
    this.transformarM2_1(numero);
  }

  transformarM2_1(numero: number) {
    this.invetarioP.forEach((element) => {
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
    this.cambiarValores2(numero);
  }


  cambiarValores2(numero : number) {
    this.invetarioP.forEach((element) => {
      element.cantidadCajas = Math.trunc( element.cantidadM2 / element.producto.M2);
      element.cantidadPiezas = parseInt(
        (
          (element.cantidadM2 * element.producto.P_CAJA) / element.producto.M2 -
          element.cantidadCajas * element.producto.P_CAJA
        ).toFixed(0)
      );
      element.cantidadM2 = parseFloat(element.cantidadM2.toFixed(2));

      element.cantidadCajas2 = Math.trunc( element.cantidadM2b2 / element.producto.M2);
      element.cantidadPiezas2 = parseInt(
        (
          (element.cantidadM2b2 * element.producto.P_CAJA) /
            element.producto.M2 -
          element.cantidadCajas2 * element.producto.P_CAJA
        ).toFixed(0)
      );
      element.cantidadM2b2 = parseFloat(element.cantidadM2b2.toFixed(2));

      element.cantidadCajas3 = Math.trunc( element.cantidadM2b3 / element.producto.M2);
      element.cantidadPiezas3 = parseInt(
        (
          (element.cantidadM2b3 * element.producto.P_CAJA) /
            element.producto.M2 -
          element.cantidadCajas3 * element.producto.P_CAJA
        ).toFixed(0)
      );
      element.cantidadM2b3 = parseFloat(element.cantidadM2b3.toFixed(2));
    });

    this.productos.forEach((element) => {
      if (element.PRODUCTO == this.detalleTraslados[numero].producto) {
        element.sucursal1 = this.invetarioP[0].cantidadM2;
        element.sucursal2 = this.invetarioP[0].cantidadM2b2;
        element.sucursal3 = this.invetarioP[0].cantidadM2b3;
      }
    });
    this.mostrarLoading = false;
  }

  //**************PROCESOS PARA CONSULTA DE DATOS PARA COMBOS ************/
  traerTransaccionesPorProductoCombo2(nombreProducto: producto, num : number, cantidadP: number, productoCombo : productosCombo) {
    this.cantidadProductos++;
    this.invetarioP = [];
    this.transacciones = [];
    this.proTransaccion.nombre = nombreProducto.PRODUCTO;
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

              this.invetarioP = [];
              this.invetarioProd = new inventario();
              this.invetarioProd.producto = nombreProducto;
              this.invetarioProd.cantidadCajas = contCajas;
              this.invetarioProd.cantidadCajas2 = contCajas2;
              this.invetarioProd.cantidadCajas3 = contCajas3;

              this.invetarioProd.cantidadPiezas = contPiezas;
              this.invetarioProd.cantidadPiezas2 = contPiezas2;
              this.invetarioProd.cantidadPiezas3 = contPiezas3;
              this.invetarioP.push(this.invetarioProd);


              contCajas = 0;
              contPiezas = 0;
              contCajas2 = 0;
              contPiezas2 = 0;
              contCajas3 = 0;
              contPiezas3 = 0;


              //seccion2

              this.invetarioP.forEach((element) => {
                element.cantidadM2 = parseFloat( (element.producto.M2 * element.cantidadCajas +(element.cantidadPiezas * element.producto.M2) / element.producto.P_CAJA ).toFixed(2));
                element.cantidadM2b2 = parseFloat( (element.producto.M2 * element.cantidadCajas2 +(element.cantidadPiezas2 * element.producto.M2) / element.producto.P_CAJA).toFixed(2) );
                element.cantidadM2b3 = parseFloat(
                  (element.producto.M2 * element.cantidadCajas3 +(element.cantidadPiezas3 * element.producto.M2) / element.producto.P_CAJA).toFixed(2)
                );
                element.totalb1 = parseFloat( (element.cantidadM2 * element.producto.precio).toFixed(2) );
                element.totalb2 = parseFloat((element.cantidadM2b2 * element.producto.precio).toFixed(2));
                element.totalb3 = parseFloat( (element.cantidadM2b3 * element.producto.precio).toFixed(2));
              });

              //seccion3
              this.invetarioP.forEach((element) => {
                element.cantidadCajas = Math.trunc( element.cantidadM2 / element.producto.M2);
                element.cantidadPiezas = parseInt(((element.cantidadM2 * element.producto.P_CAJA) / element.producto.M2 - element.cantidadCajas * element.producto.P_CAJA).toFixed(0));
                element.cantidadM2 = parseFloat(element.cantidadM2.toFixed(2));

                element.cantidadCajas2 = Math.trunc( element.cantidadM2b2 / element.producto.M2);
                element.cantidadPiezas2 = parseInt(((element.cantidadM2b2 * element.producto.P_CAJA) / element.producto.M2 - element.cantidadCajas2 * element.producto.P_CAJA).toFixed(0));
                element.cantidadM2b2 = parseFloat(element.cantidadM2b2.toFixed(2));

                element.cantidadCajas3 = Math.trunc( element.cantidadM2b3 / element.producto.M2);
                element.cantidadPiezas3 = parseInt( ((element.cantidadM2b3 * element.producto.P_CAJA) / element.producto.M2 - element.cantidadCajas3 * element.producto.P_CAJA).toFixed(0));
                element.cantidadM2b3 = parseFloat(element.cantidadM2b3.toFixed(2));
              });

              var disponible = 0;
              switch (this.traslados.sucursal_origen.nombre) {
                case "matriz":
                  disponible = this.invetarioP[0].cantidadM2;
                  break;
                case "sucursal1":
                  disponible = this.invetarioP[0].cantidadM2b2;
                  break;
                case "sucursal2":
                  disponible = this.invetarioP[0].cantidadM2b3;
                  break;
                default:
              }

              if(disponible < 0)
                disponible = 0

              this.valor2 = Math.trunc(Number(disponible) / productoCombo.cantidad) 

              if(this.valor2 < this.valor3)
                this.valor3 = this.valor2

              


              this.productos.forEach((element) => {
                if (element.PRODUCTO == this.detalleTraslados[num].producto) {
                  switch (this.traslados.sucursal_origen.nombre) {
                    case "matriz":
                      element.sucursal1 = this.valor3;
                      break;
                    case "sucursal1":
                      element.sucursal2 = this.valor3;
                      break;
                    case "sucursal2":
                      element.sucursal3 = this.valor3;
                      break;
                    default:
                  }
                }
              });

              if(cantidadP == this.cantidadProductos)
                this.mostrarLoading = false;


              resolve(disponible)})
            .catch((err) => { resolve(false)});
    });

    Promise.all([p1]).then(values => {

    });
  }


}

//1784
