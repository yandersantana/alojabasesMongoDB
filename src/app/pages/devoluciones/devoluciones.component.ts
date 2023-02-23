import { Component, OnInit } from "@angular/core";

import {
  devolucion,
  productosDevueltos,
  tipoDocEliminacion,
} from "./devoluciones";
import pdfMake from "pdfmake/build/pdfmake";
import {
  factura,
  producto,
  contadoresDocumentos,
  productosPendientesEntrega,
  venta
} from "../ventas/venta";
import Swal from "sweetalert2";
import { objDate, tipoBusquedaTransaccion, transaccion } from "../transacciones/transacciones";
import { OrdenDeCompra, Sucursal } from "../compras/compra";
import { parametrizacionsuc } from "../parametrizacion/parametrizacion";
import { ParametrizacionesService } from "src/app/servicios/parametrizaciones.service";
import { SucursalesService } from "src/app/servicios/sucursales.service";
import { ProductoService } from "src/app/servicios/producto.service";
import { OrdenesCompraService } from "src/app/servicios/ordenes-compra.service";
import { FacturasService } from "src/app/servicios/facturas.service";
import { NotasVentasService } from "src/app/servicios/notas-ventas.service";
import { ContadoresDocumentosService } from "src/app/servicios/contadores-documentos.service";
import { DevolucionesService } from "src/app/servicios/devoluciones.service";
import { TransaccionesService } from "src/app/servicios/transacciones.service";
import { user } from "../user/user";
import { AuthenService } from "src/app/servicios/authen.service";
import DataSource from "devextreme/data/data_source";
import { ProductosPendientesService } from "src/app/servicios/productos-pendientes.service";
import { TransaccionesFinancieras } from "../transaccionesFinancieras/transaccionesFinancieras";
import { TransaccionesFinancierasService } from "src/app/servicios/transaccionesFinancieras.service";
import { DatosConfiguracionService } from "src/app/servicios/datosConfiguracion.service";
import { dataDocumento } from "../reciboCaja/recibo-caja";
import { CajaMenor } from "../cajaMenor/caja-menor";
import { CajaMenorService } from "src/app/servicios/cajaMenor.service";
import { AuthService } from "src/app/shared/services";
import { AngularFirestore } from "angularfire2/firestore";
import { ProductoCombo, productosCombo } from "../catalogo/catalogo";
import { CombosService } from "src/app/servicios/combos.service";
import { element } from "protractor";

@Component({
  selector: "app-devoluciones",
  templateUrl: "./devoluciones.component.html",
  styleUrls: ["./devoluciones.component.scss"],
})
export class DevolucionesComponent implements OnInit {
  idDocumento: number;
  cliente: string;
  usuario: string = "";
  observaciones: string = "";
  sucursal: string;
  locales: Sucursal[] = [];
  fecha: Date = new Date();
  fecha_transaccion: string;
  contap2: number = 0;
  id_devolucion: number;
  facturas: factura[] = [];
  productosFactura: producto[] = [];
  devoluciones: devolucion[] = [];
  listadoDevoluciones: devolucion[] = [];
  devolucionesGlobales: devolucion[] = [];
  devolucionesPendientes: devolucion[] = [];
  devolucionesAprobadas: devolucion[] = [];
  devolucionesRechazadas: devolucion[] = [];
  devolucionesAnuladas: devolucion[] = [];
  transaccionesFinancieras: TransaccionesFinancieras [] = []
  devolucioLeida: devolucion;
  productos: producto[] = [];
  facturaTraida: factura;
  usuarioLogueado: user;
  mostrarLoading: boolean = false;
  mostrarLoadingFactura: boolean = false;
  notas_venta: factura[] = [];
  datosDocumento: dataDocumento[] = []
  menuDocumento: string[] = ["Factura", "Nota de Venta"];
  textoDatosFactura=""
  arrayFacturas: factura[] = [];
  busquedaTransaccion: tipoBusquedaTransaccion; 

  menuMotivo: string[] = [
    "Caducidad",
    "Cambio",
    "Daño",
    "Defectos fábrica",
    "Otros",
  ];
  menu1: string[] = ["Devoluciones", "Listado Devoluciones"];


  sucursalesDefault: string[] = ["matriz", "sucursal1", "sucursal2"];

  menuPrincipalRoles: string[];
  valorMenu = ""

  imagenLogotipo ="";

  variablesucursal: string = "Milagro";
  total: number = 0;
  devolucion: devolucion;
  varProducto: string;
  numeroFactura: string;
  number_transaccion: number = 0;
  transaccion: transaccion;
  productosDevueltos: productosDevueltos[] = [];
  productosDevueltosBase: productosDevueltos[] = [];
  productosDevueltosCarga: productosDevueltos[] = [];
  ordenesCompra: OrdenDeCompra[] = [];
  productosVendidos: venta[] = [];
  productosVendidos2: venta[] = [];
  parametrizaciones: parametrizacionsuc[] = [];
  parametrizacionSucu: parametrizacionsuc;
  contadores: contadoresDocumentos[] = [];
  contadorFirebase: contadoresDocumentos[] = [];
  productosPendientes: productosPendientesEntrega[] = [];
  correo: string = "";
  productos22: DataSource;
  isUsuario = false;
  mensajeLoading = "Cargando.."

  obj: objDate;
  mostrarNewDevolucion = true;
  mostrarListado = false;
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  estados: string[] = [
      'Pendientes',
      'Aprobadas',
      'Anuladas',
      'Rechazadas',
  ];
  mostrarAprobacion = false;
  mostrarAnulacion = false;
  listadoProductosCombo : productosCombo[];


  constructor(
    private db: AngularFirestore,
    public parametrizacionService: ParametrizacionesService,
    public authenService: AuthenService,
    public transaccionesService: TransaccionesService,
    public devolucionesService: DevolucionesService,
    public contadoresService: ContadoresDocumentosService,
    public notasVentaService: NotasVentasService,
    public facturasService: FacturasService,
    public productosPendientesService: ProductosPendientesService,
    public ordenesService: OrdenesCompraService,
    public sucursalesService: SucursalesService,
    public _transaccionFinancieraService : TransaccionesFinancierasService,
    public productoService: ProductoService,
    public authService: AuthService,
    public _comboService : CombosService,
    public _cajaMenorService : CajaMenorService,
    public _configuracionService : DatosConfiguracionService
  ) {
    this.devolucion = new devolucion();
    this.productosDevueltos.push(new productosDevueltos());
    this.menuPrincipalRoles = this.menu1;
  }

  ngOnInit() {
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.traerContadoresDocumentos();
    this.traerProductos();
    this.traerOrdenesCompra();
    this.traerParametrizaciones();
    this.getIDDocumentos();
    this.traerProductosPendientesEntrega();
    this.traerSucursales();
    this.traerDatosConfiguracion();
  }

  traerDatosConfiguracion() {
    this._configuracionService.getDatosConfiguracion().subscribe((res) => {
      this.imagenLogotipo = res[0].urlImage;
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
          this.devolucion.usuario = this.usuarioLogueado[0].username;
          this.usuario = this.usuarioLogueado[0].username;
          this.buscarSucursal(this.usuarioLogueado[0].sucursal);
          this.separarRegistrosDevoluciones();
          if (this.usuarioLogueado[0].rol == "Usuario")
            this.isUsuario = true;
          else {
            this.isUsuario = false;
            this.mostrarAprobacion = true
          }
            
          

          if(this.usuarioLogueado[0].status == "Inactivo")
              this.authService.logOut();

        },
        (err) => {}
      );
    });
  }

  traerComprobantesPagoPorRango() {
    this.limpiarArrays();
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    this.devolucionesService.getDevolucionesPorRango(this.obj).subscribe(res => {
      this.devoluciones = res as devolucion[];
      this.cargarDevoluciones();
    })
  }

  limpiarArrays(){
    this.devoluciones = []
    this.listadoDevoluciones = []
    this.devolucionesPendientes = []
    this.devolucionesAprobadas = []
    this.devolucionesAnuladas = []
    this.devolucionesRechazadas = []
  }


  opcionRadio(e){
    this.listadoDevoluciones = [];
      switch (e.value) {
        case "Pendientes":
          this.listadoDevoluciones = this.devolucionesPendientes
          if(!this.isUsuario){
            this.mostrarAnulacion = false
            this.mostrarAprobacion = true
          }
          
          break;
        case "Aprobadas":
          this.listadoDevoluciones = this.devolucionesAprobadas
          if(!this.isUsuario){
            this.mostrarAnulacion = true
            this.mostrarAprobacion = false
          }
          break;
        case "Anuladas":
          this.listadoDevoluciones = this.devolucionesAnuladas
          if(!this.isUsuario){
            this.mostrarAnulacion = false
            this.mostrarAprobacion = false
          }
            
          break;
        case "Rechazadas":
          this.listadoDevoluciones = this.devolucionesRechazadas
          if(!this.isUsuario){
            this.mostrarAnulacion = false
            this.mostrarAprobacion = false
          }
          break;
        default:    
    }   
  }



  buscarSucursal(sucursal: string) {
    this.locales.forEach((element) => {
      if (element.nombre == sucursal) {
        this.devolucion.sucursal = element;
        this.sucursal = element.nombre;
      }
    });
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

  traerProductos() {
    this.productoService.getProducto().subscribe((res) => {
      this.productos = res as producto[];
    });
  }

  traerOrdenesCompra() {
    this.ordenesService.getOrden().subscribe((res) => {
      this.ordenesCompra = res as OrdenDeCompra[];
    });
  }

  traerFacturas() {
    this.facturasService.getFacturas().subscribe((res) => {
      this.facturas = res as factura[];
      this.mostrarLoadingFactura = false;
      console.log("traje facturas");
    });
  }

  traerNotasVenta() {
    this.notasVentaService.getNotasVentas().subscribe((res) => {
      this.notas_venta = res as factura[];
      this.mostrarLoading = false;
      console.log("traje notas ventas");
    });
  }

  traerDevoluciones() {
    this.limpiarArrays();
    this.mostrarLoading = true;
    this.devolucionesService.getDevoluciones().subscribe((res) => {
      this.devoluciones = res as devolucion[];
      this.cargarDevoluciones();
    });
  }

  traerContadoresDocumentos() {
    this.contadoresService.getContadores().subscribe((res) => {
      this.contadores = res as contadoresDocumentos[];
      this.asignarIDdocumentos();
    });
  }

  separarRegistrosDevoluciones() {
    if (this.usuarioLogueado[0].rol != "Administrador") {
      switch (this.usuarioLogueado[0].sucursal) {
        case "matriz":
          this.devolucionesGlobales.forEach((element) => {
            if (element.sucursal.nombre == "matriz") {
              this.devoluciones.push(element);
            }
          });
          break;
        case "sucursal1":
          this.devolucionesGlobales.forEach((element) => {
            if (element.sucursal.nombre == "sucursal1") {
              this.devoluciones.push(element);
            }
          });
          break;
        case "sucursal2":
          this.devolucionesGlobales.forEach((element) => {
            if (element.sucursal.nombre == "sucursal2") {
              this.devoluciones.push(element);
            }
          });
          break;
        default:
          break;
      }
    } else {
      this.devoluciones = this.devolucionesGlobales;
    }
  }

  asignarIDdocumentos() {
    //this.number_transaccion=this.contadores[0].transacciones_Ndocumento+1
    this.id_devolucion = this.contadores[0].contDevoluciones_Ndocumento + 1;
  }

  traerProductosPendientesEntrega() {
    this.productosPendientesService
      .getProductosPendientesEntrega()
      .subscribe((res) => {
        this.productosPendientes = res as productosPendientesEntrega[];
      });
  }



  async getIDDocumentos() {
    //REVISAR OPTIMIZACION
    await this.db
      .collection("consectivosBaseMongoDB")
      .valueChanges()
      .subscribe((data: contadoresDocumentos[]) => {
        new Promise<any>((resolve, reject) => {
          if (data != null) {
            this.contadorFirebase = data;
          }
        });
        this.asignarIDdocumentos2();
      });
  }

  asignarIDdocumentos2() {
    this.number_transaccion = this.contadores[0].transacciones_Ndocumento + 1;
    //this.id_devolucion=this.contadores[0].contDevoluciones_Ndocumento+1
  }

  validarProductosPendientes(e) {
    var bandera = true;
    this.productosPendientes.forEach((element) => {
      if ( element.documento == this.idDocumento &&  element.tipo_documento == e.value ) 
        bandera = false;
    });

    this.obtenerDocumento(e);

  }

  obtenerDocumento(e) {
    this.mostrarLoading = true;
    var bandera = true;
    this.devolucion.tipo_documento = e.value;
    this.arrayFacturas = [];
    if (e.value == "Factura") {
      this.limpiarArreglo();
      this.facturasService.getFacturasDocumento(this.idDocumento).subscribe((res) => {
          this.arrayFacturas = res as factura[];
          this.llenarDatosCombo(this.arrayFacturas);
          bandera = false;
        });
      if (bandera) {
        this.cliente = "";
        this.fecha_transaccion = "";
        this.sucursal = "";
      }
    } else if (e.value == "Nota de Venta") {
      this.limpiarArreglo();
      this.notasVentaService.getNotasVemtaDocumento(this.idDocumento).subscribe((res) => {
          this.arrayFacturas = res as factura[];
          this.llenarDatosCombo(this.arrayFacturas);
          bandera = false;
        });

      if (bandera) {
        this.cliente = "";
        this.fecha_transaccion = "";
        this.sucursal = "";
      }
    }
    this.mostrarLoading = false;
  }

  
  llenarDatosCombo(array: factura[]){
    this.datosDocumento = [];
    array.forEach(element => {
      var object = new dataDocumento();
      object._id = element._id;
      object.nombreCliente = element.cliente.cliente_nombre;
      object.rucCliente = element.cliente.ruc;
      object.totalFactura = element.total.toString();
      object.valorInicialFactura = element.total.toString();
      object.tipo_documento = element.tipoDocumento;
      object.textoCombo = object.nombreCliente+" - "+object.rucCliente+" - "+object.totalFactura;
      object.fecha = element.fecha;
      object.fecha_deuda = element.fecha;
      object.sucursal = element.sucursal;
      console.log(object)
      this.datosDocumento.push(object);
    });
  }

  asignarDatos(e){
    this.textoDatosFactura = e.value.textoCombo;
    this.facturaTraida = this.arrayFacturas.find(element=> element._id == e.value._id);
    this.productosVendidos2 = this.facturaTraida.productosVendidos;
    this.productosVendidos2.forEach((element) => {
      if(element.producto.CLASIFICA == "COMBO" ) {
        var combo = new ProductoCombo();
        combo.PRODUCTO = element.producto.PRODUCTO;
        this.mensajeLoading = "Cargando Productos.."
        this.mostrarLoading = true;
        this._comboService.getComboPorNombre(combo).subscribe(res => {
          var listado = res as ProductoCombo[];
          this.listadoProductosCombo = listado[0].productosCombo 
          this.listadoProductosCombo.forEach((element2) => {
            var venta2 = new venta();
            venta2.cantidad = element.cantidad * element2.cantidad;
            venta2.producto = element2.producto;
            venta2.total = element2.precioVenta * element.cantidad;
            this.productosVendidos2.push(venta2)
          });
          this.mostrarLoading = false;
          //-----------eliminar repetidos del array
          let hash = {};
          this.productosVendidos2 = this.productosVendidos2.filter(o => hash[o.producto.PRODUCTO] ? false : hash[o.producto.PRODUCTO] = true);
          this.productosVendidos2.splice(this.productosVendidos2.indexOf(element), 1);
        })
      }

    });

   

     
   
    this.cliente = this.facturaTraida.cliente.cliente_nombre;
    this.fecha_transaccion = this.facturaTraida.fecha2;
    this.sucursal = this.facturaTraida.sucursal; 
    this.devolucion.ruc = this.facturaTraida.cliente.ruc;

  }


  obtenerDetalleProductosFact() {
    this.limpiarArreglo();
    this.productosVendidos.forEach((element) => {
      if (element.factura_id == this.idDocumento && element.tipoDocumentoVenta == "Factura") 
        this.productosVendidos2.push(element);

    });
  }

  cargarDevoluciones() {
    this.devoluciones.forEach((element) => {
      if (element.estado == "Pendiente") {
        this.devolucionesPendientes.push(element);
      } else if (element.estado == "Aprobado") {
        this.devolucionesAprobadas.push(element);
      } else if (element.estado == "Rechazado") {
        this.devolucionesRechazadas.push(element);
      } else if (element.estado == "Anulada") {
        this.devolucionesAnuladas.push(element);
      }
    });
    this.listadoDevoluciones = this.devolucionesPendientes;
    this.mostrarLoading = false;
  }

  obtenerDetalleProductosNot() {
    this.limpiarArreglo();
    this.productosVendidos.forEach((element) => {
      if (element.factura_id == this.idDocumento &&element.tipoDocumentoVenta == "Nota de Venta" ) {
        this.productosVendidos2.push(element);
      }
    });
  }

  limpiarArreglo() {
    var cont = 0;
    this.productosVendidos2.forEach((element) => {
      cont++;
    });
    if (cont >= 0) {
      this.productosVendidos2.forEach((element) => {
        this.productosVendidos2.splice(0);
      });
    }
  }

  obtenerDetallesDoc(e, i: number) {
    console.log(this.productosDevueltos)
    var existeP = this.productosDevueltos.filter(element=>element.REFERENCIA == this.productosDevueltos[i].REFERENCIA)
    if(existeP.length > 1){
      Swal.fire("Error", "El producto ya existe", "error");
      this.deleteProducto(e,i)
    }else{
      var canti = 0;
      this.productosVendidos2.forEach((element) => {
        if (element.producto.PRODUCTO == e.value) {
          canti = 0;

          this.productosDevueltos[i].producto = element.producto;
          this.productosDevueltos[i].cantFactCajas = Math.trunc(
            element.cantidad / element.producto.M2
          );
          this.productosDevueltos[i].cantFactPiezas =
            Math.trunc((element.cantidad * element.producto.P_CAJA) / element.producto.M2) -
            this.productosDevueltos[i].cantFactCajas * element.producto.P_CAJA;

          this.productosDevueltos[i].valorunitariopiezas =
            element.total /
              (element.producto.P_CAJA *
                this.productosDevueltos[i].cantFactCajas +
                this.productosDevueltos[i].cantFactPiezas) -
            (element.total /
              (element.producto.P_CAJA *
                this.productosDevueltos[i].cantFactCajas +
                this.productosDevueltos[i].cantFactPiezas)) *
              (element.descuento / 100);
          this.productosDevueltos[i].valorunitario =
            ((element.producto.P_CAJA * this.productosDevueltos[i].cantFactCajas +
              this.productosDevueltos[i].cantFactPiezas) /
              element.cantidad) *
            this.productosDevueltos[i].valorunitariopiezas;
          }
      });
    }
    
    
  }

  deleteProducto(e, i: number) {
    if (this.productosDevueltos.length > 1) {
      this.productosDevueltos.splice(i, 1);
    } else {
      Swal.fire("Alerta", "Debe tener al menos un producto", "warning");
    }
    this.calcularTotal();
  }

  transformarM2(e, i: number) {
    this.productosVendidos2.forEach((element) => {
      if (this.productosDevueltos[i].producto.PRODUCTO == element.producto.PRODUCTO) {
        this.productosDevueltos[i].cantDevueltam2 = parseInt(
          (
            element.producto.M2 * this.productosDevueltos[i].cantDevueltaCajas +
            (this.productosDevueltos[i].cantDevueltaPiezas *
              element.producto.M2) /
              element.producto.P_CAJA
          ).toFixed(0)
        );
        this.productosDevueltos[i].cantDevueltam2Flo = parseFloat(
          (
            element.producto.M2 * this.productosDevueltos[i].cantDevueltaCajas +
            (this.productosDevueltos[i].cantDevueltaPiezas *
              element.producto.M2) /
              element.producto.P_CAJA
          ).toFixed(2)
        );

        var cal1 = 0;
        var cal2 = 0;
        var prodEncontrado = this.listadoProductosCombo?.find(element2=>element2.nombreProducto == element.producto.PRODUCTO)

        cal1 = this.productosDevueltos[i].cantDevueltaCajas * element.producto.P_CAJA + this.productosDevueltos[i].cantDevueltaPiezas;
        
        if(prodEncontrado != null)
          cal2 = (this.productosDevueltos[i].cantFactCajas * element.producto.P_CAJA) * prodEncontrado.cantidad + this.productosDevueltos[i].cantFactPiezas;
        else
          cal2 = this.productosDevueltos[i].cantFactCajas * element.producto.P_CAJA + this.productosDevueltos[i].cantFactPiezas;

        if (cal1 > cal2) {
          alert("la cantidad es mayor");
          this.productosDevueltos[i].cantDevueltaCajas = 0;
          this.productosDevueltos[i].cantDevueltaPiezas = 0;
        }
      }
    });
    this.calcularValores2(e, i);
  }

  calcularValores(e, i: number) {
    this.productosVendidos2.forEach((element) => {
      if(this.productosDevueltos[i].producto.PRODUCTO == element.producto.PRODUCTO) {
        var cal1 = 0;
        cal1 = element.precio_venta * this.productosDevueltos[i].cantDevueltam2Flo;
        this.productosDevueltos[i].total = cal1 - cal1 * (element.descuento / 100);
      }
    });
    this.calcularTotal();
  }

  calcularValores2(e, i: number) {
    this.productosVendidos2.forEach((element) => {
      if ( this.productosDevueltos[i].producto.PRODUCTO == element.producto.PRODUCTO) {
        var cal1 = 0;
        cal1 =  this.productosDevueltos[i].cantDevueltaCajas * element.producto.P_CAJA + this.productosDevueltos[i].cantDevueltaPiezas;
        this.productosDevueltos[i].total = cal1 * this.productosDevueltos[i].valorunitariopiezas;
      }
    });
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = 0;
    this.productosDevueltos.forEach((element) => {this.total = parseFloat((element.total + this.total).toFixed(2));
    });
  }


  validarEstadoCaja(){
    this.devolucion.fecha = this.fecha;
    this.devolucion.fecha.setHours(0,0,0,0);
    this._cajaMenorService.getCajaMenorPorFecha(this.devolucion).subscribe(
      res => {
       var listaCaja = res as CajaMenor[];
        if(listaCaja.length != 0 ){
          var caja = listaCaja.find(element=>element.sucursal == this.devolucion.sucursal.nombre) ;
          if(caja != undefined){
            if(caja.sucursal == this.devolucion.sucursal.nombre && caja.estado == "Cerrada" )
              Swal.fire( "Atención","No puede generar registros para la fecha establecida, la caja menor se encuentra cerrada",'error')
            else
              this.guardarDevolucion()
          }else
            this.guardarDevolucion()
        }else
          this.guardarDevolucion()
      },
      (err) => {});
  }


  guardarDevolucion() {
    this.devolucion.cliente = this.cliente;
    this.devolucion.fecha = this.fecha;
    this.devolucion.fecha_transaccion = this.fecha_transaccion;
    this.devolucion.observaciones = this.observaciones;
    
    this.devolucion.usuario = this.usuario;
    this.devolucion.id_devolucion = this.id_devolucion;
    this.devolucion.totalDevolucion = this.total;
    this.devolucion.num_documento = this.idDocumento;
    this.devolucion.productosDevueltos = this.productosDevueltos;
    var contV = 0;
    var text = "";

    text = this.facturaTraida.observaciones + "/ Documento Devolucion " + this.id_devolucion;
    if (
      this.devolucion.cliente != undefined &&
      this.devolucion.fecha != undefined &&
      this.devolucion.sucursal != undefined &&
      this.devolucion.fecha_transaccion != undefined
    ) {
      this.mostrarMensaje();
      new Promise<any>((resolve, reject) => {
        this.devolucionesService.newDevolucion(this.devolucion).subscribe(
          (res) => {
            this.contadores[0].contDevoluciones_Ndocumento = this.id_devolucion;
            this.contadoresService
              .updateContadoresDevoluciones(this.contadores[0])
              .subscribe(
                (res) => {},
                (err) => {}
              );
          },
          (err) => {}
        );
        if (this.devolucion.tipo_documento == "Factura") {
          this.facturaTraida.observaciones = text;
          this.facturasService.updateFacturas(this.facturaTraida).subscribe(
            (res) => {
              this.confirmarDevolucion();
            },
            (err) => {
              alert("error");
            }
          );
        } else if (this.devolucion.tipo_documento == "Nota de Venta") {
          this.facturaTraida.observaciones = text;
          this.notasVentaService.updateNotasVenta(this.facturaTraida).subscribe(
            (res) => {
              this.confirmarDevolucion();
            },
            (err) => {}
          );
        }

      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Hay campos vacíos",
        icon: "error",
      });
    }
  }

  asignarsucursalD(e) {
    this.variablesucursal = e.value;
    this.locales.forEach((element) => {
      if (element.nombre == this.variablesucursal) {
        this.devolucion.sucursal = element;
      }
    });
  }

  getCourseFile = (e) => {
    this.cargarDatosDevolucion(e.row.data);
  };

  getCourseFile2 = (e) => {
    this.aceptarDevolucion(e.row.data);
  };
  getCourseFile3 = (e) => {
    this.rechazarDevolucion(e.row.data);
  };

  aprobarAnulacion = (e) => {
    this.anularDevolucion(e.row.data);
  };

  rechazarDevolucion(e: any) {
    Swal.fire({
      title: "Rechazar Devolución",
      text: "Desea rechazar la devolución #" + e.id_devolucion,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        new Promise<any>((resolve, reject) => {
          this.devolucionesService.updateEstado(e, "Rechazado").subscribe(
            (res) => {
              Swal.fire({
                title: "Correcto",
                text: "Se guardó con éxito",
                icon: "success",
                confirmButtonText: "Ok",
              }).then((result) => {
                window.location.reload();
              });
            },
            (err) => {}
          );
          //this.db.collection('/devoluciones').doc(e.id_devolucion+"").update({"estado":"Rechazado"}).then(res => {  }, err => alert(err));
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado!", "Se ha cancelado su proceso.", "error");
      }
    });
  }

  anularDevolucion(e: any) {
    Swal.fire({
      title: "Anular Devolución",
      text: "Desea anular la devolución #" + e.id_devolucion,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.mostrarMensaje();
        new Promise<any>((resolve, reject) => {
          this.devolucionesService.updateEstado(e, "Anulada").subscribe(
            (res) => { this.buscarProductos(e);},
            (err) => {}
          );
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado!", "Se ha cancelado su proceso.", "error");
      }
    });
  }

  buscarProductos(e: any) {
    var contVal = 0;
    this.devoluciones.forEach((element) => {
      if (element.id_devolucion == e.id_devolucion) {
        this.devolucioLeida = element;
        this.productosDevueltosCarga = element.productosDevueltos;
      }
    });
    this.actualizarProductosAnulacion(e.id_devolucion);
  }

  aceptarDevolucion(e: any) {
    Swal.fire({
      title: "Aceptar Devolución",
      text: "Desea aceptar la devolución #" + e.id_devolucion,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        new Promise<any>((resolve, reject) => {
          this.mostrarMensaje();
          this.devolucionesService.updateEstado(e, "Aprobado").subscribe(
            (res) => {this.realizarTransacciones(e);},
            (err) => {alert("error");}
          );
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado!", "Se ha cancelado su proceso.", "error");
      }
    });
  }

  mostrarMensaje() {
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
            const b = content.querySelector("b");
          }
        }, 100);
      },
      onClose: () => {
        clearInterval(timerInterval);
      },
    });
  }

  buscarProductosPendientes() {
    var bandera = true;

    this.productosDevueltos.forEach((element) => {
      this.productosPendientes.forEach((element1) => {
        if (
          element1.documento == this.idDocumento &&
          element1.tipo_documento == this.devolucion.tipo_documento &&
          element.producto.PRODUCTO == element1.producto.PRODUCTO
        ) {
          bandera = false;
        }
      });
    });

    if (bandera) {
      this.validarEstadoCaja();
    } else {
      Swal.fire({
        title: "Advertencia",
        text:
          "Los productos devueltos tienen solicitudes de entrega asociadas , desea continuar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          //this.mostrarMensaje()
          this.validarEstadoCaja();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelado!", "Se ha cancelado su proceso.", "error");
        }
      });
    }
  }

  realizarTransacciones(e: any) {
    var contVal = 0;
    this.devoluciones.forEach((element) => {
      if (element.id_devolucion == e.id_devolucion) {
        this.devolucioLeida = element;
        this.productosDevueltosCarga = element.productosDevueltos;
      }
    });

    new Promise<any>((resolve, reject) => {
      this.productosDevueltosCarga.forEach((element) => {
        this.generarTransaccionFinanciera(element)
        this.transaccion = new transaccion();
        this.transaccion.fecha_mov = new Date().toLocaleString();
        this.transaccion.fecha_transaccion = this.devolucioLeida.fecha;
        this.transaccion.sucursal = this.devolucioLeida.sucursal.nombre;
        this.transaccion.bodega = "bodega2";
        this.transaccion.documento = this.devolucioLeida.id_devolucion + "";
        this.transaccion.producto = element.producto.PRODUCTO;
        this.transaccion.costo_unitario = element.producto.precio;
        this.transaccion.cajas = element.cantDevueltaCajas;
        this.transaccion.piezas = element.cantDevueltaPiezas;
        this.transaccion.observaciones = element.justificacion;
        this.transaccion.tipo_transaccion = "devolucion";
        this.transaccion.movimiento = 1;
        this.transaccion.valor = element.valorunitario;
        this.transaccion.cantM2 = element.cantDevueltam2;
        this.transaccion.totalsuma = element.total;
        this.transaccion.usu_autorizado = this.devolucioLeida.usuario;
        this.transaccion.usuario = this.devolucioLeida.usuario;
        this.transaccion.factPro = this.devolucioLeida.num_documento + "";
        this.transaccion.idTransaccion = this.number_transaccion++;
        this.transaccionesService.newTransaccion(this.transaccion).subscribe(
          (res) => { contVal++, this.contadorValidaciones(contVal);},
          (err) => {}
        );
      });
    });
  }


  generarTransaccionFinanciera(producto : productosDevueltos){
    var nombreSubCuenta = ""
    if(this.devolucioLeida.tipo_documento == "Factura")
      nombreSubCuenta = "1.4.0 Factura"
    else if(this.devolucioLeida.tipo_documento == "Nota de Venta")
      nombreSubCuenta = "1.4.1 Nota_Venta"
    var transaccion = new TransaccionesFinancieras();
    transaccion.fecha = this.devolucioLeida.fecha;
    transaccion.sucursal = this.devolucioLeida.sucursal.nombre;
    transaccion.cliente = this.devolucioLeida.cliente;
    transaccion.rCajaId = "DV"+this.devolucioLeida.id_devolucion;
    transaccion.tipoTransaccion = "devolucion";
    transaccion.id_documento = this.devolucioLeida.id_devolucion;
    transaccion.documentoVenta = this.devolucioLeida.num_documento.toString();
    transaccion.cedula = this.devolucioLeida.ruc;
    transaccion.numDocumento = this.devolucioLeida.num_documento.toString();
    transaccion.valor = producto.total;
    transaccion.isContabilizada = true;
    transaccion.cuenta = "1.4 DEVOLUCIONES";
    transaccion.subCuenta = nombreSubCuenta;
    transaccion.notas = this.devolucioLeida.observaciones;
    transaccion.tipoCuenta = "Salidas";

    try {
      this._transaccionFinancieraService.newTransaccionFinanciera(transaccion).subscribe((res) => {},(err) => {});
    } catch (error) {
      Swal.fire("Error","Error al guardar la transaccion","error"); 
    }    
  }

  contadorValidaciones(i: number) {
    if (this.productosDevueltosCarga.length == i) {
      this.actualizarProductos();
    } else {
      console.log("no he entrado " + i);
    }
  }

  eliminarTransacciones(num: number) {
    var newTipoDocEliminacion = new tipoDocEliminacion();
    newTipoDocEliminacion.nroDocumento = num.toString();
    newTipoDocEliminacion.tipoDocumento = "devolucion";
    this.transaccionesService
      .deleteTransaccionPorDevoluciones(newTipoDocEliminacion)
      .subscribe(
        (res) => {
          console.log(res + "termine1");
        },
        (err) => {
          alert("error");
        }
      );
  }

  contadorValidaciones2(i: number) {
    if (this.productosDevueltosCarga.length == i) {
      console.log("recien termine");
      Swal.close();
      Swal.fire({
        title: "Devolucion Aprobada",
        text: "Se ha guardado con éxito",
        icon: "success",
        confirmButtonText: "Ok",
      }).then((result) => {
        window.location.reload();
      });
    } else {
      console.log("no he entrado actualizar" + i);
    }
  }

  contadorValidacionesAnulacion(i: number) {
    if (this.productosDevueltosCarga.length == i) {
      console.log("recien termine");
      Swal.close();
      Swal.fire({
        title: "Devolucion Anulada",
        text: "Se ha realizado con éxito",
        icon: "success",
        confirmButtonText: "Ok",
      }).then((result) => {
        window.location.reload();
      });
    } else {
      console.log("no he entrado actualizar" + i);
    }
  }

  confirmarDevolucion() {
    Swal.fire({
      title: "Devolucion Registrada",
      text: "Se ha guardado con éxito",
      icon: "success",
      confirmButtonText: "Ok",
    }).then((result) => {
      window.location.reload();
    });
  }

  contadorValidaciones3(i: number) {
    if (this.productosDevueltos.length == i) {
      console.log("recien termine");
      Swal.close();
    } else {
      console.log("no he entrado actualizar" + i);
    }
  }

  cargarDatosDevolucion(e: any) {
    // alert("voy a buscar la remision "+e.id_remision)
    var cont = 0;
    this.productosDevueltosCarga.forEach((element) => {
      cont++;
    });
    if (cont >= 0) {
      this.productosDevueltosCarga.forEach((element) => {
        this.productosDevueltosCarga.splice(0);
      });
    }

    this.devoluciones.forEach((element) => {
      if (element.id_devolucion == e.id_devolucion) {
        this.devolucioLeida = element;
        this.productosDevueltosCarga = element.productosDevueltos;
        //alert("ssd "+this.productosDevueltosCarga.length)
      }
    });

    this.parametrizaciones.forEach((element) => {
      if (element.sucursal == this.devolucioLeida.sucursal.nombre) {
        this.parametrizacionSucu = element;
        //alert("sdsd "+JSON.stringify(this.parametrizacionSucu))
      }
    });

    this.crearPDF();
  }

  opcionMenu(e) {
    switch (e.value) {
      case "Devoluciones":
        this.mostrarNewDevolucion = true;
        this.mostrarListado = false;
        break;

      case "Listado Devoluciones":
        this.mostrarNewDevolucion = false;
        this.mostrarListado = true;
        if(this.devoluciones.length == 0)
          this.traerComprobantesPagoPorRango();
        break;

      default:
    }
  }

  crearPDF() {
    console.log("entre  a creaar PDF");
    const documentDefinition = this.getDocumentDefinition();
    pdfMake
      .createPdf(documentDefinition)
      .download(
        "Devolucion " + this.devolucioLeida.id_devolucion,
        function () {}
      );
  }

  setearNFactura() {
    let nf = this.devolucioLeida.id_devolucion;
    let num = ("" + nf).length;
    console.log("el numero es" + num);
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
    this.setearNFactura();
    sessionStorage.setItem("Devolucion", JSON.stringify("jj"));
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
              text: " ",
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
                    width: 260,
                    text: "DEVOLUCIÓN  001 - 000",
                    bold: true,
                    fontSize: 20,
                  },
                  {
                    width: 260,
                    text: "NO " + this.numeroFactura,
                    color: "red",
                    bold: true,
                    fontSize: 20,
                    alignment: "right",
                  },
                ],
              },
              {
                //Desde aqui comienza los datos del cliente
                style: "tableExample",
                table: {
                  widths: [100, 140, 100, 140],
                  body: [
                    [
                      {
                        stack: [
                          {
                            type: "none",
                            bold: true,
                            fontSize: 9,
                            ul: ["Numero Doc.", "Tipo", "Cliente", "Sucursal"],
                          },
                        ],
                      },
                      {
                        stack: [
                          {
                            type: "none",
                            fontSize: 9,
                            ul: [
                              "" + this.devolucioLeida.num_documento,
                              "" + this.devolucioLeida.tipo_documento,
                              "" + this.devolucioLeida.cliente,
                              "" + this.devolucioLeida.sucursal.nombreComercial,
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
                            ul: ["Fecha", "Fecha/transaccion", "Usuario"],
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
                                "" + this.devolucioLeida.fecha.toLocaleString(),
                                "" + this.devolucioLeida.fecha_transaccion,
                                "" + this.devolucioLeida.usuario,
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

        this.getProductosIngresados2(this.productosDevueltosCarga),
        { text: " " },
        { text: " " },
        {
          text: "Observaciones:   " + this.devolucioLeida.observaciones,
          fontSize: 9,
        },

        { text: " " },
        {
          columns: [
            {
              width: 450,
              text: "Total:",
              bold: true,
              fontSize: 15,
              alignment: "right",
            },
            {
              width: 60,
              text: +this.devolucioLeida.totalDevolucion,
              bold: true,
              fontSize: 15,
              alignment: "right",
            },
          ],
        },
        { text: " " },
        { text: " " },
        { text: " " },
        {
          columns: [
            {
              text: "Firma conformidad entrega",
              width: 250,
              fontSize: 10,
              alignment: "right",
              margin: [55, 20, 40, 10],
            },
            {
              width: 250,
              margin: [40, 20, 20, 10],
              fontSize: 10,
              text: "Firma conformidad recibo ",
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

  getProductosIngresados2(productos: productosDevueltos[]) {
    return {
      /*  [{text: 'Header with Colspan = 2', style: 'tableHeader', colSpan: 2, alignment: 'center'}, {}, {text: 'Header 3', style: 'tableHeader', alignment: 'center'}], */
      table: {
        widths: ["40%", "9%", "9%", "7%", "15%", "20%"],
        alignment: "center",
        fontSize: 9,
        headerRows: 2,
        body: [
          [
            {
              text: "Producto",
              style: "tableHeader2",
              rowSpan: 2,
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Cantidad Devuelta",
              style: "tableHeader2",
              colSpan: 2,
              fontSize: 8,
              alignment: "center",
            },
            {},
            {
              text: "Total",
              style: "tableHeader2",
              rowSpan: 2,
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Motivo",
              style: "tableHeader2",
              rowSpan: 2,
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Justificación",
              rowSpan: 2,
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
          ],
          [
            {},
            {
              text: "Cajas",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Piezas",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {},
            {},
            {},
          ],

          ...productos.map((ed) => {
            return [
              { text: ed.producto.PRODUCTO, fontSize: 9 },
              { text: ed.cantDevueltaCajas, alignment: "center", fontSize: 9 },
              { text: ed.cantDevueltaPiezas, alignment: "center", fontSize: 9 },
              { text: ed.total.toFixed(2), alignment: "center", fontSize: 9 },
              { text: ed.motivo, alignment: "center", fontSize: 9 },
              { text: ed.justificacion, alignment: "center", fontSize: 9 },
            ];
          }),
        ],
      },
    };
  }

  actualizarProductos() {
    console.log("entre a actualizar");
    var sumaProductos = 0;
    var num1: number = 0;
    var num2: number = 0;
    var num3: number = 0;
    var cont2ing = 0;
    var contIng: number = 0;
    var entre: boolean = true;
    new Promise<any>((resolve, reject) => {
      this.productosDevueltosCarga.forEach((element) => {
        this.productos.forEach((elemento1) => {
          if (elemento1.PRODUCTO == element.producto.PRODUCTO) {
            switch (this.devolucioLeida.sucursal.nombre) {
              case "matriz":
                num1 = parseInt(element.cantDevueltam2.toFixed(0));
                num2 = elemento1.sucursal1;
                sumaProductos = Number(num2) + Number(num1);
                break;
              case "sucursal1":
                num1 = parseInt(element.cantDevueltam2.toFixed(0));
                num2 = elemento1.sucursal2;
                sumaProductos = Number(num2) + Number(num1);
                break;
              case "sucursal2":
                num1 = parseInt(element.cantDevueltam2.toFixed(0));
                num2 = elemento1.sucursal3;
                sumaProductos = Number(num2) + Number(num1);
                break;
              default:
            }
          }
        });
        if (entre) {
          switch (this.devolucioLeida.sucursal.nombre) {
            case "matriz":
              element.producto.sucursal1 = sumaProductos;
              this.productoService
                .updateProductoSucursal1(element.producto)
                .subscribe(
                  (res) => {
                    cont2ing++, this.contadorValidaciones2(cont2ing);
                  },
                  (err) => {
                    alert("error");
                  }
                );
              //this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal1" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));
              break;
            case "sucursal1":
              element.producto.sucursal2 = sumaProductos;
              this.productoService
                .updateProductoSucursal2(element.producto)
                .subscribe(
                  (res) => {
                    cont2ing++, this.contadorValidaciones2(cont2ing);
                  },
                  (err) => {
                    alert("error");
                  }
                );
              //this.db.collection('/productos').doc(element.producto.PRODUCTO).update({"sucursal2" :sumaProductos}).then(res => {cont2ing++, this.contadorValidaciones2(cont2ing)}, err => alert(err));
              break;
            case "sucursal2":
              //alert("entre aqui ")
              element.producto.sucursal3 = sumaProductos;
              this.productoService
                .updateProductoSucursal3(element.producto)
                .subscribe(
                  (res) => {
                    cont2ing++, this.contadorValidaciones2(cont2ing);
                  },
                  (err) => {
                    alert("error");
                  }
                );

              break;
            default:
          }
        }
      });
    });
  }

  eliminarTransaccionesFinancieras(){
    this.busquedaTransaccion = new tipoBusquedaTransaccion()
    this.busquedaTransaccion.NumDocumento = this.devolucioLeida.id_devolucion.toString();
    this.busquedaTransaccion.tipoTransaccion = "devolucion"
    this._transaccionFinancieraService.getTransaccionesPorTipoDocumento(this.busquedaTransaccion).subscribe(res => {
      this.transaccionesFinancieras = res as TransaccionesFinancieras[];
      if(this.transaccionesFinancieras.length != 0){
        this.transaccionesFinancieras.forEach(element=>{
          this._transaccionFinancieraService.deleteTransaccionFinanciera(element).subscribe( res => {}, err => {alert("error")})
        })
      }
    })
  }

  actualizarProductosAnulacion(num) {
    this.eliminarTransacciones(num);
    this.eliminarTransaccionesFinancieras();
    var sumaProductos = 0;
    var num1: number = 0;
    var num2: number = 0;
    var num3: number = 0;
    var cont2ing = 0;
    var contIng: number = 0;
    var entre: boolean = true;
    new Promise<any>((resolve, reject) => {
      this.productosDevueltosCarga.forEach((element) => {
        this.productos.forEach((elemento1) => {
          if (elemento1.PRODUCTO == element.producto.PRODUCTO) {
            switch (this.devolucioLeida.sucursal.nombre) {
              case "matriz":
                num1 = parseInt(element.cantDevueltam2.toFixed(0));
                num2 = elemento1.sucursal1;
                sumaProductos = Number(num2) - Number(num1);
                break;
              case "sucursal1":
                num1 = parseInt(element.cantDevueltam2.toFixed(0));
                num2 = elemento1.sucursal2;
                sumaProductos = Number(num2) - Number(num1);
                break;
              case "sucursal2":
                num1 = parseInt(element.cantDevueltam2.toFixed(0));
                num2 = elemento1.sucursal3;
                sumaProductos = Number(num2) - Number(num1);
                break;
              default:
            }
          }
        });
        if (entre) {
          switch (this.devolucioLeida.sucursal.nombre) {
            case "matriz":
              element.producto.sucursal1 = sumaProductos;
              this.productoService
                .updateProductoSucursal1(element.producto)
                .subscribe(
                  (res) => {
                    cont2ing++, this.contadorValidacionesAnulacion(cont2ing);
                  },
                  (err) => {
                    alert("error");
                  }
                );
              break;
            case "sucursal1":
              element.producto.sucursal2 = sumaProductos;
              this.productoService
                .updateProductoSucursal2(element.producto)
                .subscribe(
                  (res) => {
                    cont2ing++, this.contadorValidacionesAnulacion(cont2ing);
                  },
                  (err) => {
                    alert("error");
                  }
                );
              break;
            case "sucursal2":
              element.producto.sucursal3 = sumaProductos;
              this.productoService
                .updateProductoSucursal3(element.producto)
                .subscribe(
                  (res) => {
                    cont2ing++, this.contadorValidacionesAnulacion(cont2ing);
                  },
                  (err) => {
                    alert("error");
                  }
                );
              break;
            default:
          }
        }
      });
    });
  }

  anadirProducto(e) {
    this.productosDevueltos.push(new productosDevueltos());
  }
}
