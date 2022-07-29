import {
  Component,
  OnInit,
  ViewChild
} from "@angular/core";
import { Producto, bodega, productosObsequio } from "./producto";
import { Observable } from "rxjs";
import {
  DxFormComponent,
  DxSelectBoxComponent,
  DxDataGridComponent,
} from "devextreme-angular";
import { OrdenDeCompra, Sucursal } from "../compras/compra";
import { producto, contadoresDocumentos } from "../ventas/venta";
import { FacturaProveedor } from "../orden-compra/ordencompra";
import {
  ProductoDetalleEntrega,
  ProductoDetalleCompra,
  RemisionProductos,
  ControlProductos,
  PrecioProductos,
} from "../producto/producto";
import {
  AngularFirestore,
} from "angularfire2/firestore";
import Swal from "sweetalert2";
import pdfMake from "pdfmake/build/pdfmake";
import { objDate, tipoBusquedaTransaccion, transaccion } from "../transacciones/transacciones";
import { parametrizacionsuc } from "../parametrizacion/parametrizacion";
import { ParametrizacionesService } from "src/app/servicios/parametrizaciones.service";
import { ContadoresDocumentosService } from "src/app/servicios/contadores-documentos.service";
import { SucursalesService } from "src/app/servicios/sucursales.service";
import { OrdenesCompraService } from "src/app/servicios/ordenes-compra.service";
import { BodegaService } from "src/app/servicios/bodega.service";
import { ProductoService } from "src/app/servicios/producto.service";
import { TransaccionesService } from "src/app/servicios/transacciones.service";
import { ProductosObsequioService } from "src/app/servicios/productos-obsequio.service";
import { FacturasProveedorService } from "src/app/servicios/facturas-proveedor.service";
import { RemisionesService } from "src/app/servicios/remisiones.service";
import { ProductosIngresadosService } from "src/app/servicios/productos-ingresados.service";
import { user } from "../user/user";
import { AuthenService } from "src/app/servicios/authen.service";
import { AuthService } from "src/app/shared/services";
import { DatosConfiguracionService } from "src/app/servicios/datosConfiguracion.service";
import { CombosService } from "src/app/servicios/combos.service";
import { comboProducto, ProductoCombo } from "../catalogo/catalogo";

@Component({
  selector: "app-producto",
  templateUrl: "./producto.component.html",
  styleUrls: ["./producto.component.css"],
})
export class ProductoComponent implements OnInit {
  producto: Producto;
  public items: Observable<any[]>;
  productosComprados: ProductoDetalleCompra[] = [];
  productosSolicitados: ProductoDetalleCompra[] = [];
  productosComprados3: ProductoDetalleCompra[] = [];
  productosEntregados: ProductoDetalleEntrega[] = [];
  productosEntregadosBase: ProductoDetalleEntrega[] = [];
  productosEntregadosBase2: ProductoDetalleEntrega[] = [];
  productosControlIngresados: ProductoDetalleEntrega[] = [];
  facturaProveedor: FacturaProveedor[] = [];
  facturaProveedor2: FacturaProveedor[] = [];
  facturaProveedor3: FacturaProveedor[] = [];
  transaccion: transaccion;
  ordenleida: OrdenDeCompra;
  ordenleida2: OrdenDeCompra;
  productosControl: ControlProductos[] = [];
  productosControlFinal: ControlProductos[] = [];
  remisiones: RemisionProductos[] = [];
  remisionesRechazadas: RemisionProductos[] = [];
  remisionesEliminadas: RemisionProductos[] = [];
  remisionesAprobadas: RemisionProductos[] = [];
  preciosProductos: PrecioProductos[] = [];
  precioP: PrecioProductos;
  productoIngresado: ControlProductos;
  ordenesCompra: OrdenDeCompra[] = [];
  remisionProducto: RemisionProductos;
  remisionProductoleido: RemisionProductos;
  productosEntregados1: ProductoDetalleEntrega;
  solNum: number = 0;
  productos: producto[] = [];
  productos2: producto[] = [];
  clasificaciones: string[] = ["Ceramica", "Porcelanato", "Inodoros"];
  uniMedida: string[] = ["Unidad", "Metros2", "Juego"];
  estadoAct: string[] = ["Activo", "Inactivo"];
  locales: Sucursal[] = [];
  nuevaBodega: bodega;
  bodegas: bodega[] = [];
  bodegas2: bodega[] = [];
  menuDevolucion: string[] = [
    "Defectuoso",
    "Roto",
    "Referencia no solicitada",
    "Vencido",
  ];

  menuEstadoRecibo: string[] = [
    "Ok",
    "Por revisar",
    "Incompleto",
    "Defectuoso",
    "Roto",
    "Referencia no solicitada",
    "Vencido",
  ];

  var1: boolean = true;
  var2: boolean = true;
  var3: boolean = true;
  var4: boolean = true;

  busquedaTransaccion: tipoBusquedaTransaccion;

  imagenLogotipo = '';

  //datos de la remision
  NfactProveedor: number = 0;
  fecha1: Date = new Date();
  nremisionEnt: string = "";
  fechaRecibo: Date = new Date();
  productosObsequios: productosObsequio[] = [];
  productosObsequios2: productosObsequio[] = [];
  productosObsequiosBase: productosObsequio[] = [];

  parametrizaciones: parametrizacionsuc[] = [];
  parametrizacionSucu: parametrizacionsuc;

  productoObsequio: productosObsequio;
  Id_remision: number = 0;
  placa: string = "";
  nombre_transportador: string = "";
  nombre_recibe: string = "";
  newButtonEnabled2: boolean = false;
  contIngresos: number = 0;
  numeroFactura: string;
  menu1: string[] = [
    "Remisión de Productos",
    "Remisiones Mensuales",
    "Remisiones Globales",
  ];
  mostrarLoading: boolean = false;
  solicitudNOrden = 0;
  contadorTabla: number = 0;
  datoNsolicitud: number = 0;
  number_transaccion: number = 0;
  facturas: string[];
  cantidadP: number = 0;
  ifFacturaP: string;
  contadorp2: number = 0;
  contadorp3: number = 0;
  contadorDev: number = 0;
  contadorDev2: number = 0;
  saldo: number = 0;
  saldo2: number = 0;
  checkSi = false;
  checkNo = false;
  transacciones: transaccion[] = [];
  showFilterRow: boolean;
  solicitudOrdenC: number = 0;
  usuarioLogueado: user;
  productoLlamado: string = "";
  contadores: contadoresDocumentos[] = [];
  contadorFirebase: contadoresDocumentos[] = [];
  correo: string = "";
  mensajeLoading = "Cargando..."
  obj: objDate;
  @ViewChild("selectId") selectBox: DxSelectBoxComponent;
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("datag2") dataGrid2: DxDataGridComponent;

  @ViewChild("productoForm", { static: false }) dxForm: DxFormComponent;

  constructor(
    private db: AngularFirestore,
    public authenService: AuthenService,
    public authService: AuthService,
    public parametrizacionService: ParametrizacionesService,
    public productosObservice: ProductosObsequioService,
    public productosIngresadoService: ProductosIngresadosService,
    public remisionesService: RemisionesService,
    public facturasProveedorService: FacturasProveedorService,
    public transaccionesService: TransaccionesService,
    public productoService: ProductoService,
    public productosObsequioService: ProductosObsequioService,
    public bodegasService: BodegaService,
    public ordenesService: OrdenesCompraService,
    public sucursalesService: SucursalesService,
    public _configuracionService : DatosConfiguracionService,
    public contadoresService: ContadoresDocumentosService,
    public _combosService : CombosService
  ) {
    setTimeout(() => {
    }, 3000);
    this.producto = new Producto();
    this.remisionProducto = new RemisionProductos();
    this.showFilterRow = true;
    this.obj = new objDate();
  }

  ngOnInit() {
    this.setearFechaMensual();
    this.traerProductos();
    this.traerProductosObsequio();
    this.traerParametrizaciones();
    this.traerSucursales();
    this.traerContadoresDocumentos();
    this.traerBodegas();
    this.getIDDocumentos();
    this.cargarUsuarioLogueado();
    this.traerDatosConfiguracion();
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

  traerDatosConfiguracion() {
    this._configuracionService.getDatosConfiguracion().subscribe((res) => {
      this.imagenLogotipo = res[0].urlImage;
    });
  }

  crearBodega() {
    this.nuevaBodega = new bodega();
    this.nuevaBodega.nombre = "bodega1";
    this.nuevaBodega.direccion =
      "García Moreno #1203 entre 9 de Octubre y, Calle Rocafuerte, Garcia Moreno, Milagro 091703";
    this.nuevaBodega.persona_responsable = "Juan Alberto";
    this.nuevaBodega.sucursal = "matriz";
    this.bodegasService.newBodegas(this.nuevaBodega).subscribe(
      (res) => {},
      (err) => {}
    );
  }

  traerParametrizaciones() {
    this.parametrizacionService.getParametrizacion().subscribe((res) => {
      this.parametrizaciones = res as parametrizacionsuc[];
    });
  }

  traerSucursales() {
    this.sucursalesService.getSucursales().subscribe((res) => {
      this.locales = res as Sucursal[];
    });
  }

  traerOrdenesCompra() {
    this.ordenesService.getOrden().subscribe((res) => {
      this.ordenesCompra = res as OrdenDeCompra[];
    });
  }

  traerfacturasProveedor() {
    this.facturasProveedorService.getFacturasProveedor().subscribe((res) => {
      this.facturaProveedor = res as FacturaProveedor[];
    });
  }

  traerBodegas() {
    this.bodegasService.getBodegas().subscribe((res) => {
      this.bodegas = res as bodega[];
    });
  }

  traerProductosObsequio() {
    this.productosObsequioService.getProductosObsequio().subscribe((res) => {
      this.productosObsequiosBase = res as productosObsequio[];
    });
  }

  traerProductosIngresados() {
    this.productosIngresadoService.getProductosIngresados().subscribe((res) => {
      this.productosEntregadosBase = res as ProductoDetalleEntrega[];
    });
  }

  traerProductos() {
    this.mostrarLoading = true
    this.productoService.getProductosActivos().subscribe((res) => {
      this.productos = res as producto[];
      this.mostrarLoading = false;
    });
  }

  traerTransacciones() {
    this.transaccionesService.getTransaccion().subscribe((res) => {
      this.transacciones = res as transaccion[];
    });
  }

  traerRemisiones() {
    this.remisiones = [];
    this.remisionesRechazadas = [];
    this.remisionesAprobadas = [];
    this.remisionesEliminadas = [];
    this.mostrarLoading = true;
    this.remisionesService.getRemisiones().subscribe((res) => {
      this.remisiones = res as RemisionProductos[];
      this.asignarValores();
    });
  }

  traerRemisionesMensuales() {
    this.remisiones = [];
    this.remisionesRechazadas = [];
    this.remisionesAprobadas = [];
    this.remisionesEliminadas = [];
    this.mostrarLoading = true;
    this.remisionesService.getRemisionesMensuales(this.obj).subscribe((res) => {
      this.remisiones = res as RemisionProductos[];
      this.asignarValores();
    });
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

  traerContadoresDocumentos() {
    this.contadoresService.getContadores().subscribe((res) => {
      this.contadores = res as contadoresDocumentos[];
      this.asignarIDdocumentos();
    });
  }

  asignarIDdocumentos() {
    this.number_transaccion = this.contadores[0].transacciones_Ndocumento + 1;
    this.Id_remision = this.contadores[0].contRemisiones_Ndocumento + 1;
  }

  async getIDDocumentos() {
    //REVISAR OPTIMIZACION
    await this.db
      .collection("consectivosBaseMongoDB")
      .valueChanges()
      .subscribe((data: contadoresDocumentos[]) => {
        if (data != null) this.contadorFirebase = data;
        this.asignarIDdocumentos2();
      });
  }

  asignarIDdocumentos2() {
    this.number_transaccion =
      this.contadorFirebase[0].transacciones_Ndocumento + 1;
    this.Id_remision = this.contadorFirebase[0].contRemisiones_Ndocumento + 1;
  }

  getCourseFile = (e) => {
    this.cargarDatosRemisión(e.row.data);
  };

  getCourseFile2 = (e) => {
    //this.eliminarRemision(e.row.data)
    this.traerProductosIngresadosPorOrden(e.row.data);
  };

  getCourseFile6 = (e) => {
    this.rechazarEliminacion(e.row.data);
  };

  getCourseFile3 = (e) => {
    this.rechazarRemisión(e.row.data);
  };

  rechazarRemisión(e: any) {
    Swal.fire({
      title: "Remisión #" + e.id_remision,
      text: "Motivo de rechazo",
      icon: "warning",
      input: "textarea",
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        // var num:string
        var data2 = "";
        data2 = e.id_remision + "";
        this.remisionesService
          .updateRechazarRemision(e, "Rechazada", result.value)
          .subscribe(
            (res) => {
              Swal.close();
              Swal.fire({
                title: "Correcto",
                text: "Un administrador aprobará su eliminación de remisión",
                icon: "success",
                confirmButtonText: "Ok",
              }).then((result) => {
                window.location.reload();
                //this.asignarValores()
              });
            },
            (err) => {
              alert("error");
            }
          );
        //this.db.collection('/remisionProductos').doc( data2).update({"estado" :"Rechazada","msjAdmin":result.value})
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
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado!", "error");
      }
    });
  }

  onExporting(e) {
    e.component.beginUpdate();
    e.component.columnOption("nombre_recibe", "visible", true);
    e.component.columnOption("msjAdmin", "visible", true);
  }
  onExported(e) {
    e.component.columnOption("nombre_recibe", "visible", false);
    e.component.columnOption("msjAdmin", "visible", false);

    e.component.endUpdate();
  }


  traerProductosIngresadosPorOrden(e: any){
    var newFacturaP = new ProductoDetalleEntrega()
    newFacturaP.numeroOrden = e.num_orden
    this.productosIngresadoService.getProductosIngresadosPorOrden(newFacturaP).subscribe((res) => {
      this.productosEntregadosBase = res as ProductoDetalleEntrega[];
      this.compararCantidades(e)
    });
  }

  compararCantidades(e: any) {
    this.productosEntregadosBase.forEach((element) => {
      if (element.numeroRemision == e.id_remision && e.num_orden == element.numeroOrden) {
        this.productosEntregadosBase2.push(element);
      }
    });
    var suma = 0;
    var contIn = 0;
    this.productosEntregadosBase2.forEach((element) => {
      this.productos.forEach((element2) => {
        if (element.nombreComercial.PRODUCTO == element2.PRODUCTO) {
          suma = element.metros2;
          switch (e.sucursal) {
            case "matriz":
              if (suma >= element2.sucursal1) {
                contIn++;
              }
              break;
            case "sucursal1":
              if (suma >= element2.sucursal2) {
                contIn++;
              }
              break;
            case "sucursal2":
              if (suma >= element2.sucursal3) {
                contIn++;
              }
              break;
            default:
          }
        }
      });
    });

    if (contIn == 0) {
      this.eliminarRemision(e);
    } else {
      Swal.fire({
        title: "Error",
        text: "No hay inventario suficiente para realizar la anulación",
        icon: "error",
      });
    }
  }

  cambiarEstadoSeleccionado(e) {
    if (this.checkSi) {
      this.facturaProveedor.forEach((element) => {
        if (element.nSolicitud == this.datoNsolicitud) {
          this.solicitudOrdenC = element.documento_solicitud;
          this.facturaProveedor2.push(element);
          this.remisionProducto.nombre_proveedor = element.proveedor;
        }
      });
    } else {
      var cont = 0;
      this.facturaProveedor2.forEach((element) => {
        cont++;
      });
      if (cont >= 0) {
        this.facturaProveedor2.forEach((element) => {
          this.facturaProveedor2.splice(0);
        });
      }
    }
  }

  eliminarRemision(e: any) {
     var newOrden = new OrdenDeCompra()
    newOrden.n_orden = e.num_orden
    this.ordenesService.getOrdenEspecifica(newOrden).subscribe((res) => {
      this.ordenesCompra = res as OrdenDeCompra[];
    });

    var facturaP = new FacturaProveedor()
    facturaP.nSolicitud = e.num_orden
    this.facturasProveedorService.getFacturasDocumento(facturaP).subscribe((res) => {
      this.facturaProveedor = res as FacturaProveedor[];
      this.continuarEliminando(e)
    });  

   
  }


  continuarEliminando(e:any){
    var data = "";
    var sumaProductos = 0;
    var num1: number = 0;
    var num2: number = 0;
    var num3: number = 0;
    data = e.id_remision + "";
    this.facturaProveedor.forEach((element) => {
      if (element.nSolicitud == e.num_orden && element.nFactura == e.num_FactPro) {
        this.ifFacturaP = element._id;
      }
    });

    Swal.fire({
      title: "Eliminar Remisión",
      text: "Se eliminará definitivamente la remisión #" + e.id_remision,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.mensajeGuardando();
        new Promise<any>((resolve, reject) => {
          var entre: boolean = true;
          this.remisionesService.updateEstado(e, "Eliminada").subscribe(
            (res) => {
              console.log(res + "entre por si");
            },
            (err) => {
              alert("error");
            }
          );
          this.facturasProveedorService
            .updateEstado3(this.ifFacturaP, "Por Ingresar")
            .subscribe(
              (res) => {
                console.log(res + "entre por si");
              },
              (err) => {
                alert("error");
              }
            );

          this.productosEntregadosBase.forEach((element) => {
            if (element.numeroRemision == e.id_remision) {
              this.productosEntregadosBase2.push(element);
            }
          });

          this.productosEntregadosBase2.forEach((element) => {
            this.productos.forEach((elemento1) => {
              if (elemento1.PRODUCTO == element.nombreComercial.PRODUCTO) {
                num1 = element.cantidadEntregada;
                num2 = elemento1.cantidad;
                num3 = element.cantidadDevuelta;
                sumaProductos = Number(num2) - Number(num1) + Number(num3);
                switch (e.sucursal) {
                  case "matriz":
                    num1 = element.cantidadEntregada;
                    num2 = elemento1.sucursal1;
                    num3 = element.cantidadDevuelta;
                    sumaProductos = Number(num2) - Number(num1) + Number(num3);
                    break;
                  case "sucursal1":
                    num1 = element.cantidadEntregada;
                    num2 = elemento1.sucursal2;
                    num3 = element.cantidadDevuelta;
                    sumaProductos = Number(num2) - Number(num1) + Number(num3);
                    break;
                  case "sucursal2":
                    num1 = element.cantidadEntregada;
                    num2 = elemento1.sucursal3;
                    num3 = element.cantidadDevuelta;
                    sumaProductos = Number(num2) - Number(num1) + Number(num3);
                    break;
                  default:
                }
              }
            });
            if (entre) {
              switch (e.sucursal) {
                case "matriz":
                  element.nombreComercial.sucursal1 = sumaProductos;
                  element.nombreComercial.bodegaProveedor = 0;
                  this.productoService
                    .updateProductoSucursal1Bodega(element.nombreComercial)
                    .subscribe(
                      (res) => {
                        console.log(res + "entre por si");
                      },
                      (err) => {
                        alert("error");
                      }
                    );
                  // this.db.collection('/productos').doc(element.nombreComercial.PRODUCTO).update({"sucursal1" :sumaProductos})
                  break;
                case "sucursal1":
                  element.nombreComercial.sucursal2 = sumaProductos;
                  element.nombreComercial.bodegaProveedor = 0;
                  this.productoService
                    .updateProductoSucursal2Bodega(element.nombreComercial)
                    .subscribe(
                      (res) => {
                        console.log(res + "entre por si");
                      },
                      (err) => {
                        alert("error");
                      }
                    );
                  //// this.db.collection('/productos').doc(element.nombreComercial.PRODUCTO).update({"sucursal2" :sumaProductos})
                  break;
                case "sucursal2":
                  element.nombreComercial.sucursal3 = sumaProductos;
                  element.nombreComercial.bodegaProveedor = 0;
                  this.productoService
                    .updateProductoSucursal3Bodega(element.nombreComercial)
                    .subscribe(
                      (res) => {
                        console.log(res + "entre por si");
                      },
                      (err) => {
                        alert("error");
                      }
                    );
                  // this.db.collection('/productos').doc(element.nombreComercial.PRODUCTO).update({"sucursal3" :sumaProductos})
                  break;
                default:
              }
              this.productosIngresadoService
                .updateEstadoIngreso(element, "Eliminado")
                .subscribe(
                  (res) => {
                    console.log(res + "termine1");
                  },
                  (err) => {
                    alert("error");
                  }
                );
            }
          });
          this.actualizarEstados(e);
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado!", "Se ha cancelado su proceso.", "error");
      }
    });

    this.eliminarTransacciones(e.id_remision, e.num_orden, e.num_FactPro);
  }

  eliminarTransacciones(num: number, num2: number , numFact : string) {
    this.busquedaTransaccion = new tipoBusquedaTransaccion()
    this.busquedaTransaccion.NumDocumento = numFact
    this.busquedaTransaccion.tipoTransaccion = "compra"
    this.transaccionesService.getTransaccionesPorTipoDocumento(this.busquedaTransaccion).subscribe(res => {
      this.transacciones = res as transaccion[];
      if(this.transacciones.length != 0){
        this.transacciones.forEach((element) => {
          if (element.factPro == num + "" && element.orden_compra == num2) {
            this.transaccionesService.deleteTransaccion(element).subscribe(
              (res) => {
                console.log(res + "termine1");
              },
              (err) => {
                alert("error");
              }
            );
          }
        });
      }else{
        Swal.fire("Cancelado!", "No hay transacciones.", "error");
      }
    }); 
  }

  cargarDatosRemisión(e: any) {
    // alert("voy a buscar la remision "+e.id_remision)
    /*var cont = 0;
    this.productosControlIngresados.forEach((element) => {
      cont++;
    });
    if (cont >= 0) {
      this.productosControlIngresados.forEach((element) => {
        this.productosControlIngresados.splice(0);
      });
    }*/
    this.mostrarLoading = true
    this.productosControlIngresados = []
     var newFacturaP = new ProductoDetalleEntrega()
    newFacturaP.numeroOrden = e.num_orden
    this.productosIngresadoService.getProductosIngresadosPorOrden(newFacturaP).subscribe((res) => {
      this.productosEntregadosBase = res as ProductoDetalleEntrega[];
      this.seguirCreando(e)
    });


    
  }

  seguirCreando(e:any){
    this.productosEntregadosBase.forEach((element) => {
      if ( e.id_remision == element.numeroRemision && e.num_orden == element.numeroOrden ) {
        this.productosControlIngresados.push(element);
      }
    });
    this.remisiones.forEach((element) => {
      if (element.id_remision == e.id_remision) {
        this.remisionProductoleido = element;
      }
    });
    this.limpiarArregloObsequios();
    this.productosObsequiosBase.forEach((element) => {
      if (element.idfactura == e.num_FactPro) {
        this.productosObsequios2.push(element);
      }
    });

    this.parametrizaciones.forEach((element) => {
      if (element.sucursal == this.remisionProductoleido.sucursal) {
        this.parametrizacionSucu = element;
      }
    });
    this.crearPDF();
  }

  limpiarArregloObsequios() {
    var cont = 0;
    this.productosObsequios2.forEach((element) => {
      cont++;
    });
    if (cont >= 0) {
      this.productosObsequios2.forEach((element) => {
        this.productosObsequios2.splice(0);
      });
    }
  }
  comparar(num: number) {

  }

  asignarValores() {
    this.remisiones.forEach((element) => {
      if (element.estado == "Rechazada") {
        this.remisionesRechazadas.push(element);
      } else if (element.estado == "Ingresado") {
        this.remisionesAprobadas.push(element);
      } else if (element.estado == "Eliminada") {
        this.remisionesEliminadas.push(element);
      }
    });

    this.mostrarLoading = false;
  }

  clearFilter() {
    this.dataGrid.instance.clearFilter();
  }

  actualizarProductossolicitados() {
    new Promise<any>((resolve, reject) => {
      this.productosControlFinal.forEach((element) => {
        this.ordenesService
          .updateEstadoProductos(
            this.ordenleida._id,
            element.nombre_comercial,
            element.estado
          )
          .subscribe(
            (res) => {
              console.log(res + "entre por si");
            },
            (err) => {
              alert("error");
            }
          );
      });
    });
    var contEstados = 0;

    this.productosComprados3 = this.productosComprados;
    this.productosComprados3.forEach((element) => {
      if (element.estado_remision == "COMPLETO") {
        contEstados++;
      }
    });


    if (contEstados == this.productosComprados3.length) {
      new Promise<any>((resolve, reject) => {
        this.ordenesService
          .updateEstadoOrden2(this.ordenleida, "COMPLETO")
          .subscribe(
            (res) => {
              console.log(res + "entre por si");
            },
            (err) => {
              alert("error");
            }
          );
      });
    } else {

      new Promise<any>((resolve, reject) => {
        this.ordenesService
          .updateEstadoOrden2(this.ordenleida, "PARCIAL")
          .subscribe(
            (res) => {
              console.log(res + "entre por si");
            },
            (err) => {
              alert("error");
            }
          );
      });
    }
  }

  g2() {
    var sum5 = 0;
    var sumatot = 0;
    this.productosEntregados.forEach((element) => {
      sum5 = 0;
      //sumatot=(parseInt(element.metros2.toFixed(0))*element.valorunitario)-((parseInt(element.metros2.toFixed(0))*element.valorunitario)*(element.descuentoGeneral/100))+sumatot
      sum5 =
        element.valorunitario * parseInt(element.metros2.toFixed(0)) -
        element.valorunitario *
          parseInt(element.metros2.toFixed(0)) *
          (element.descuentoProducto / 100);
      sumatot = sum5 - (sum5 * element.descuentoGeneral) / 100;
      //sumatot=(element.metros2*element.valorunitario)+
    });
    this.remisionProducto.total = sumatot;
  }

  calcularm2Obsequios(i: number) {
    this.productosObsequios[i].cantidadM2 =
      this.productosObsequios[i].producto.M2 *
        this.productosObsequios[i].cantidad +
      (this.productosObsequios[i].cantidadpiezas *
        this.productosObsequios[i].producto.M2) /
        this.productosObsequios[i].producto.P_CAJA;
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

  actualizarUbicacion(producto: ProductoDetalleEntrega) {
    //alert("dsdsdsd "+producto.ubicacion)
    var cont = 0;
    this.productos.forEach((element) => {
      if (element.PRODUCTO == producto.nombreComercial.PRODUCTO) {
        switch (this.remisionProducto.sucursal) {
          case "matriz":
            for (let index = 0; index < element.ubicacionSuc1.length; index++) {
              const element2 = element.ubicacionSuc1[index];
              if (element2 == producto.ubicacion) {
                cont++;
              }
            }
            if (cont == 0) {
              element.ubicacionSuc1.push(producto.ubicacion);
              this.productoService.updateProductoUbicaciones(element).subscribe(
                (res) => {},
                (err) => {
                  alert("error");
                }
              );
            }

            break;
          case "sucursal1":
            for (let index = 0; index < element.ubicacionSuc2.length; index++) {
              const element2 = element.ubicacionSuc2[index];
              if (element2 == producto.ubicacion) {
                cont++;
              }
            }
            if (cont == 0) {
              element.ubicacionSuc2.push(producto.ubicacion);
              this.productoService.updateProductoUbicaciones(element).subscribe(
                (res) => {},
                (err) => {
                  alert("error");
                }
              );
            }

            break;
          case "sucursal2":
            for (let index = 0; index < element.ubicacionSuc3.length; index++) {
              const element2 = element.ubicacionSuc3[index];
              if (element2 == producto.ubicacion) {
                cont++;
              }
            }
            if (cont == 0) {
              element.ubicacionSuc3.push(producto.ubicacion);
              this.productoService.updateProductoUbicaciones(element).subscribe(
                (res) => {},
                (err) => {
                  alert("error");
                }
              );
            }

            break;

          default:
            break;
        }
      }
    });
  }

  guardarRemision() {
    var sumatot = 0;
    var sum5 = 0;
    this.productosEntregados.forEach((element) => {
      this.actualizarUbicacion(element);
      //sumatot=(parseInt(element.metros2.toFixed(0))*element.valorunitario)-((parseInt(element.metros2.toFixed(0))*element.valorunitario)*(element.descuentoGeneral/100))+sumatot
      sum5 =
        element.valorunitario * element.metros2 -
        element.valorunitario *
          element.metros2 *
          (element.descuentoProducto / 100);
      sumatot = sum5 - (sum5 * element.descuentoGeneral) / 100 + sumatot;
      //sumatot=(element.metros2*element.valorunitario)+
    });
    //alert(sumatot)
    this.remisionProducto.total = parseFloat(sumatot.toFixed(2));
    var contVal = 0;
    var contVal2 = 0;
    this.remisionProducto.fechaP = this.fecha1;
    this.remisionProducto.id_remision = this.Id_remision;

    this.remisionProducto.nombre_recibe = this.nombre_recibe;
    this.remisionProducto.nombre_transportador = this.nombre_transportador;
    this.remisionProducto.fechaRecibo = this.fechaRecibo.toLocaleDateString();
    // this.remisionProducto.nombre_proveedor
    this.remisionProducto.num_orden = this.datoNsolicitud;
    this.remisionProducto.num_remEnt = this.nremisionEnt;
    this.remisionProducto.placa = this.placa;
    //this.remisionProducto.sucursal= this.Id_remision
    console.log("placa" + this.remisionProducto.placa);
    let num: string;
    num = this.remisionProducto.id_remision + "";
    var contacoincidencias = 0;

    if (
      this.remisionProducto.nombre_recibe != "" &&
      this.remisionProducto.nombre_transportador != "" &&
      this.remisionProducto.placa != "" &&
      this.remisionProducto.num_remEnt != "" &&
      this.remisionProducto.bodega != undefined
    ) {
      console.log("estan llenos");
      new Promise<any>((resolve, reject) => {
        this.setearNFactura2();
        this.actualizarProductossolicitados();
        //this.db.collection('/remisionProductos').doc(num).set({...Object.assign({},this.remisionProducto )}) ;
        // this.db.collection('/remisionProductos').doc("matriz").update({"documento_n" :this.Id_remision});

        //por revisar esta de aqui abajo
        //this.db.collection('/facturasProveedor').doc(this.ifFacturaP).update({"estado3" :"Ingresada"});
        this.facturasProveedorService
          .updateEstado3(this.ifFacturaP, "Ingresada")
          .subscribe(
            (res) => {},
            (err) => {}
          );
        this.remisionesService.newRemision(this.remisionProducto).subscribe(
          (res) => {
            this.contadores[0].contRemisiones_Ndocumento = this.Id_remision;
            this.contadoresService
              .updateContadoresIDRemisiones(this.contadores[0])
              .subscribe(
                (res) => {
                  this.db
                    .collection("/consectivosBaseMongoDB")
                    .doc("base")
                    .update({ contRemisiones_Ndocumento: this.Id_remision })
                    .then(
                      (res) => {},
                      (err) => err
                    );
                },
                (err) => {}
              );
          },
          (err) => {}
        );
        if (this.productosObsequios.length > 0) {
          //alert("entre a productos")
          //alert("SSS "+this.productosObsequios.length)
          this.productosObsequios.forEach((element) => {
            element.fecha = new Date().toLocaleDateString();
            element.idfactura = this.remisionProducto.num_FactPro;
            element.proveedor = this.remisionProducto.nombre_proveedor;

            this.productosObsequioService
              .newProductoObsequio(element)
              .subscribe(
                (res) => {},
                (err) => {
                  alert("error");
                }
              );
            this.transaccion = new transaccion();
            this.transaccion.fecha_mov = new Date().toLocaleString();
            this.transaccion.fecha_transaccion = this.fecha1;
            this.transaccion.sucursal = this.remisionProducto.sucursal;
            this.transaccion.totalsuma = 0;
            this.transaccion.bodega = this.remisionProducto.bodega;
            this.transaccion.documento = this.remisionProducto.num_FactPro;
            this.transaccion.orden_compra = this.remisionProducto.num_orden;
            this.transaccion.producto = element.producto.PRODUCTO;
            this.transaccion.cajas = element.cantidad;
            this.transaccion.costo_unitario = 0;
            this.transaccion.piezas = element.cantidadpiezas;
            this.transaccion.cantM2 = element.cantidadM2;
            this.transaccion.valor = 0;
            this.transaccion.totalsuma = 0;
            this.transaccion.observaciones = "";
            this.transaccion.tipo_transaccion = "compra_obs";
            this.transaccion.usu_autorizado = this.usuarioLogueado[0].username;
            this.transaccion.usuario = this.usuarioLogueado[0].username;
            this.transaccion.factPro = this.Id_remision + "";
            this.transaccion.proveedor = this.remisionProducto.nombre_proveedor;
            this.transaccion.idTransaccion = this.number_transaccion++;
            

            this.transaccionesService
              .newTransaccion(this.transaccion)
              .subscribe(
                (res) => {
                  this.contadores[0].transacciones_Ndocumento = this
                    .number_transaccion++;
                  this.contadoresService
                    .updateContadoresIDTransacciones(this.contadores[0])
                    .subscribe(
                      (res) => {
                        this.db
                          .collection("/consectivosBaseMongoDB")
                          .doc("base")
                          .update({
                            transacciones_Ndocumento: this.number_transaccion,
                          })
                          .then(
                            (res) => {
                              contVal2++, this.contadorValidaciones2(contVal2);
                            },
                            (err) => err
                          );
                      },
                      (err) => {
                        Swal.fire({
                          title: "Error al guardar",
                          text: "Revise e intente nuevamente",
                          icon: "error",
                        });
                      }
                    );
                },
                (err) => {}
              );
          });
        } else {
          this.seguirGuardando();
          // alert("pase directo")
        }
      }).then((res) => {
        console.log("finalice");
      });

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
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          Swal.fire({
            title: "Remisión creada",
            text: "Se ha guardado con éxito",
            icon: "success",
            confirmButtonText: "Ok",
          }).then((result) => {
            window.location.reload();
          });
        }
      });
    } else {
      Swal.fire("Error!", "Hay campos vacios", "error");
    }
  }

  seguirGuardando() {
    //alert("eer")
    var contVal = 0;
    var contacoincidencias = 0;
    new Promise<any>((resolve, reject) => {
      var suma2P = 0;
      this.productosEntregados.forEach((element) => {
        var sum2 = 0;
        /*             this.db.collection("/productosIngresados").add({ ...Object.assign({}, element)})
          .then(res => { console.log("logrado" + contacoincidencias),contacoincidencias++}, err => reject(err)); */
        this.productosIngresadoService.newProductoIngresado(element).subscribe(
          (res) => {
            console.log("logrado" + contacoincidencias), contacoincidencias++;
          },
          (err) => {
            alert("error");
          }
        );
        this.transaccion = new transaccion();
        //this.transaccion.fecha_mov = new Date(this.transaccion.marca_temporal.getDate())
        this.transaccion.fecha_mov = new Date().toLocaleString();
        this.transaccion.fecha_transaccion = this.fecha1;
        this.transaccion.sucursal = this.remisionProducto.sucursal;
        this.transaccion.bodega = this.remisionProducto.bodega;
        this.transaccion.documento = this.remisionProducto.num_FactPro;
        this.transaccion.producto = element.nombreComercial.PRODUCTO;
        this.transaccion.orden_compra = this.remisionProducto.num_orden;
        this.transaccion.cajas = element.cantidadEntregada;
        this.transaccion.piezas = element.cantidadEntregadapiezas;
        this.transaccion.observaciones = "";
        this.transaccion.costo_unitario = element.nombreComercial.precio;
        this.transaccion.tipo_transaccion = "compra";
        this.transaccion.movimiento = 1;
        this.transaccion.valor = element.valorunitario;
        sum2 =
          element.valorunitario -
          element.valorunitario * (element.descuentoProducto / 100);
        this.transaccion.valor = sum2 - sum2 * (element.descuentoGeneral / 100);
        this.transaccion.cantM2 = parseInt(element.metros2.toFixed(0));
        this.transaccion.proveedor = this.remisionProducto.nombre_proveedor;
        suma2P =
          parseInt(element.metros2.toFixed(0)) * element.valorunitario -
          parseInt(element.metros2.toFixed(0)) *
            element.valorunitario *
            (element.descuentoProducto / 100);
        console.log(
          "voy a mostrar el desc.prod " +
            element.descuentoProducto +
            " de " +
            element.nombreComercial.PRODUCTO
        );
        this.transaccion.totalsuma =
          suma2P - suma2P * (element.descuentoGeneral / 100);
        //this.transaccion.totalsuma=element.valortotal-(element.valortotal*(element.descuentoGeneral/100))
        //this.transaccion.totalsuma=element.valortotal-(element.valortotal*(element.descuentoGeneral/100))
        this.transaccion.usu_autorizado = this.usuarioLogueado[0].username;
        this.transaccion.usuario = this.usuarioLogueado[0].username;
        this.transaccion.factPro = this.Id_remision + "";
        this.transaccion.idTransaccion = this.number_transaccion++;
        this.transaccion.observaciones = element.observaciones;

        this.transaccionesService.newTransaccion(this.transaccion).subscribe(
          (res) => {
            this.contadores[0].transacciones_Ndocumento = this
              .number_transaccion++;
            this.contadoresService
              .updateContadoresIDTransacciones(this.contadores[0])
              .subscribe(
                (res) => {
                  this.db
                    .collection("/consectivosBaseMongoDB")
                    .doc("base")
                    .update({
                      transacciones_Ndocumento: this.number_transaccion,
                    })
                    .then(
                      (res) => {
                        contVal++, this.contadorValidaciones(contVal);
                      },
                      (err) => err
                    );
                },
                (err) => {
                  Swal.fire({
                    title: "Error al guardar",
                    text: "Revise e intente nuevamente",
                    icon: "error",
                  });
                }
              );
          },
          (err) => {}
        );
      });
    });
  }

  actualizarEstado() {
    var contEstados = 0;
    this.productosComprados3.forEach((element) => {
      if (element.estado_remision == "COMPLETO") {
        contEstados++;
      }
    });
    if (contEstados == this.productosComprados3.length) {
      new Promise<any>((resolve, reject) => {
        // this.db.collection('/ordenesDeCompra').doc(this.solicitudNOrden+"").update({"estadoOrden":"COMPLETO"})
        this.ordenesService
          .updateEstadoOrden2(this.ordenleida, "COMPLETO")
          .subscribe(
            (res) => {
              console.log(res + "entre por si");
            },
            (err) => {
              alert("error");
            }
          );
      });
    } else {
      new Promise<any>((resolve, reject) => {
        this.ordenesService
          .updateEstadoOrden2(this.ordenleida, "PARCIAL")
          .subscribe(
            (res) => {
              console.log(res + "entre por si");
            },
            (err) => {
              alert("error");
            }
          );
        //this.db.collection('/ordenesDeCompra').doc(this.solicitudOrdenC+"").update({"estadoOrden" :"PARCIAL"})
      });
    }
  }

  contadorValidaciones(i: number) {
    if (this.productosEntregados.length == i) {
      console.log("recien termine");
      this.actualizarEstado();
      this.actualizarProductos();
    } else {
      console.log("no he entrado " + i);
    }
  }

  contadorValidaciones2(i: number) {
    if (this.productosObsequios.length == i) {
      this.actualizarProductos2();
      // alert("ssssssssssssssss")
    } else {
      console.log("no he entrado " + i);
    }
  }

  mostrarEliminar() {
    console.log("entre aqui");
    if (this.dataGrid2.instance.columnOption("bt2").visible == false) {
      this.dataGrid2.instance.columnOption("bt2", "visible", true);
      this.dataGrid2.instance.columnOption("bt1", "visible", false);
    } else {
      this.dataGrid2.instance.columnOption("bt2", "visible", false);
      this.dataGrid2.instance.columnOption("bt1", "visible", true);
    }
  }

  actualizarProductos2() {
    var sumaProductos = 0;
    var num1: number = 0;
    var num2: number = 0;
    var num3: number = 0;
    var contVr = 0;
    var contVr2 = 0;
    var precio = 0;
    var contIng: number = 0;
    var entre: boolean = true;
    var cantDis = 0;

    this.productosObsequios.forEach((element) => {
      precio = 0;
      this.productos.forEach((elemento1) => {
        if (elemento1.PRODUCTO == element.producto.PRODUCTO) {
          switch (this.remisionProducto.sucursal) {
            case "matriz":
              num1 = parseInt(element.cantidadM2.toFixed(0));
              num2 = elemento1.sucursal1;
              sumaProductos = Number(num1) + Number(num2);
              precio = elemento1.precio;
              break;
            case "sucursal1":
              num1 = parseInt(element.cantidadM2.toFixed(0));
              num2 = elemento1.sucursal2;
              sumaProductos = Number(num1) + Number(num2);
              precio = elemento1.precio;
              break;
            case "sucursal2":
              num1 = parseInt(element.cantidadM2.toFixed(0));
              num2 = elemento1.sucursal3;
              sumaProductos = Number(num1) + Number(num2);
              precio = elemento1.precio;
              break;
            default:
          }
        }
      });
      if (entre) {
        new Promise<any>((resolve, reject) => {
          switch (this.remisionProducto.sucursal) {
            case "matriz":
              this.productoService
                .updateProductoSucursal1ComD(
                  element.producto,
                  sumaProductos,
                  precio
                )
                .subscribe(
                  (res) => {
                    contVr2++, this.validarentrada2(contVr2);
                  },
                  (err) => {
                    alert("error");
                  }
                );
              break;
            case "sucursal1":
              this.productoService
                .updateProductoSucursal2ComD(
                  element.producto,
                  sumaProductos,
                  precio
                )
                .subscribe(
                  (res) => {
                    contVr2++, this.validarentrada2(contVr2);
                  },
                  (err) => {
                    alert("error");
                  }
                );
              break;
            case "sucursal2":
              this.productoService
                .updateProductoSucursal3ComD(
                  element.producto,
                  sumaProductos,
                  precio
                )
                .subscribe(
                  (res) => {
                    contVr2++, this.validarentrada2(contVr2);
                  },
                  (err) => {
                    alert("error");
                  }
                );
              break;
            default:
          }
        });
      }
    });
  }

  actualizarProductos() {
    var precio1 = 0;
    var precio2 = 0;
    var precio3 = 0;
    var sumaProductos = 0;
    var num1: number = 0;
    var num2: number = 0;
    var num3: number = 0;
    var contVr = 0;
    var contIng: number = 0;
    var entre: boolean = true;
    var cantDis = 0;

    this.productosEntregados.forEach((element) => {
      this.productos.forEach((elemento1) => {
        if (elemento1.PRODUCTO == element.nombreComercial.PRODUCTO) {
          precio1 = elemento1.precio2;
          precio2 = elemento1.precio3;
          precio3 = element.precio;
          //alert(JSON.stringify(elemento1))
          cantDis =
            elemento1.bodegaProveedor - parseInt(element.metros2.toFixed(0));
          element.nombreComercial.bodegaProveedor = cantDis;
          this.productoService
            .updateProductoBodegaProveedor(element.nombreComercial)
            .subscribe(
              (res) => {
                console.log(res + "entre por si");
              },
              (err) => {
                Swal.fire({
                  title: err.error,
                  text: "Revise e intente nuevamente",
                  icon: "error",
                });
              }
            );
          switch (this.remisionProducto.sucursal) {
            case "matriz":
              num1 = parseInt(element.metros2.toFixed(0));
              num2 = elemento1.sucursal1;
              sumaProductos = Number(num1) + Number(num2);
              break;
            case "sucursal1":
              num1 = parseInt(element.metros2.toFixed(0));
              num2 = elemento1.sucursal2;
              sumaProductos = Number(num1) + Number(num2);
              break;
            case "sucursal2":
              num1 = parseInt(element.metros2.toFixed(0));
              num2 = elemento1.sucursal3;
              sumaProductos = Number(num1) + Number(num2);
              break;
            default:
          }
        }
      });
      if (entre) {
        new Promise<any>((resolve, reject) => {
          switch (this.remisionProducto.sucursal) {
            case "matriz":
              element.nombreComercial.ultimoPrecioCompra = element.precio;
              element.nombreComercial.ultimaFechaCompra = new Date().toLocaleString();
              element.nombreComercial.precio1 = precio1;
              element.nombreComercial.precio2 = precio2;
              element.nombreComercial.precio3 = precio3;
              if (precio1 == null) {
                precio1 = 0;
              }
              if (precio2 == null) {
                precio2 = 0;
              }
              element.nombreComercial.precio = parseFloat(
                ((precio1 + precio2 + precio3) / 3).toFixed(2)
              );
              if (precio1 == 0) {
                element.nombreComercial.precio = parseFloat(
                  ((precio2 + precio3) / 2).toFixed(2)
                );
              }
              if (precio2 == 0) {
                element.nombreComercial.precio = precio3;
              }

              this.productoService
                .updateProductoSucursal1ComD(
                  element.nombreComercial,
                  sumaProductos,
                  element.precio
                )
                .subscribe(
                  (res) => {
                    contVr++, this.validarentrada(contVr);
                  },
                  (err) => {
                    alert("error");
                  }
                );
              break;
            case "sucursal1":
              element.nombreComercial.ultimoPrecioCompra = element.precio;
              element.nombreComercial.ultimaFechaCompra = new Date().toLocaleString();
              element.nombreComercial.precio1 = precio1;
              element.nombreComercial.precio2 = precio2;
              element.nombreComercial.precio3 = precio3;
              if (precio1 == null) {
                precio1 = 0;
              }
              if (precio2 == null) {
                precio2 = 0;
              }
              element.nombreComercial.precio = parseFloat(
                ((precio1 + precio2 + precio3) / 3).toFixed(2)
              );
              if (precio1 == 0) {
                element.nombreComercial.precio = parseFloat(
                  ((precio2 + precio3) / 2).toFixed(2)
                );
              }
              if (precio2 == 0) {
                element.nombreComercial.precio = precio3;
              }
              this.productoService
                .updateProductoSucursal2ComD(
                  element.nombreComercial,
                  sumaProductos,
                  element.precio
                )
                .subscribe(
                  (res) => {
                    contVr++, this.validarentrada(contVr);
                  },
                  (err) => {
                    alert("error");
                  }
                );
              break;

            case "sucursal2":
              element.nombreComercial.ultimoPrecioCompra = element.precio;
              element.nombreComercial.ultimaFechaCompra = new Date().toLocaleString();
              element.nombreComercial.precio1 = precio1;
              element.nombreComercial.precio2 = precio2;
              element.nombreComercial.precio3 = precio3;
              if (precio1 == null) {
                precio1 = 0;
              }
              if (precio2 == null) {
                precio2 = 0;
              }
              element.nombreComercial.precio = parseFloat(
                ((precio1 + precio2 + precio3) / 3).toFixed(2)
              );
              if (precio1 == 0) {
                element.nombreComercial.precio = parseFloat(
                  ((precio2 + precio3) / 2).toFixed(2)
                );
              }
              if (precio2 == 0) {
                element.nombreComercial.precio = precio3;
              }
              this.productoService
                .updateProductoSucursal3ComD(
                  element.nombreComercial,
                  sumaProductos,
                  element.precio
                )
                .subscribe(
                  (res) => {
                    contVr++, this.validarentrada(contVr);
                  },
                  (err) => {
                    alert("error");
                  }
                );
              break;
            default:
          }
        });

        console.log("entre porque el contador esta en " + contIng);
      }
      //contIng++
    });

    /*   this.preciosProductos.forEach(element=>{
        this.db.collection("/precioProductos").add({ ...element })
       })
       console.log("Productos entregados"+ this.productosEntregados.length)
       console.log("el total es"+ this.preciosProductos.length)
       console.log("finaliceeeee") */
  }

  validarentrada(i: number) {
    if (this.productosEntregados.length == i) {
      console.log("recien termine");
      this.crearPDF2();
    } else {
      console.log("no he entrado " + i);
    }
  }

  validarentrada2(i: number) {
    if (this.productosObsequios.length == i) {
      //this.traerProductos()
      new Promise<any>((resolve, reject) => {
        this.productoService.getProducto().subscribe((res) => {
          this.productos = res as producto[];
          this.seguirGuardando();
        });
      });
      console.log("finaliceeeeeeeeeeeeee");
    } else {
      console.log("no he entrado " + i);
    }
  }

  rechazarEliminacion(e: any) {
    var data2 = "";
    data2 = e.id_remision + "";
    console.log("data2 " + data2);
    console.log("entre por " + e.nFactura);

    Swal.fire({
      title: "Denegar eliminación",
      text: "Desea denegar la remisión #" + e.id_remision,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        //this.db.collection('/remisionProductos').doc( data2).update({"estado" :"Ingresado"})
        this.remisionesService.updateEstado(e, "Ingresado").subscribe(
          (res) => {
            console.log(res + "entre por si");
          },
          (err) => {
            alert("error");
          }
        );
        Swal.fire({
          title: "Correcto",
          text: "Se realizó su proceso con éxito",
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

  actualizarDatos3() {
    this.productosEntregados.forEach((element) => {
      this.productosIngresadoService.newProductoIngresado(element).subscribe(
        (res) => {
          console.log(res + "entre por si");
        },
        (err) => {
          alert("error");
        }
      );
      /* this.db.collection("/productosIngresados").add({ ...Object.assign({}, element)})
      .then(res => { }); */
      this.actualizarProductos();
    });
  }

  obtenerDatosSucursal(e) {
    this.locales.forEach((element) => {
      if (e.value == element.nombre) {
        this.remisionProducto.sucursal = element.nombre;
      }
    });
    console.log("entre a asignar" + this.remisionProducto.sucursal);
    this.limpiarArreglo5();
    this.bodegas.forEach((element) => {
      if (element.sucursal == e.value) {
        this.bodegas2.push(element);
      }
    });
  }

  limpiarArreglo5() {
    var cont = 0;
    this.bodegas2.forEach((element) => {
      cont++;
    });
    if (cont >= 0) {
      this.bodegas2.forEach((element) => {
        this.bodegas2.splice(0);
      });
    }
  }

  obtenerDatosBodega(e) {
    this.remisionProducto.bodega = e.value;
    console.log("es " + this.remisionProducto.bodega);
    /* this.bodegas.forEach(element=> {
      if(e.value == element.nombre){
        this.remisionProducto.bodega = element.nombre
      } */
  }

  begingUpdate() {
    //alert("estoy acyualizando")
  }

  endUpdate() {
    console.log("termine de actu");
  }

  obtenerDatosFactura(e) {
    // this.eliminarceldas()
    this.remisionProducto.num_FactPro = e.value;

    this.facturaProveedor.forEach((element) => {
      if (element.nFactura == e.value) {
        this.ifFacturaP = element._id;
        this.fecha1 = new Date(element.fecha);
        this.remisionProducto.total = element.total;
      }
    });
    //alert("el valor es "+e.value)
    this.contadorp2 = 0;
    this.contadorp3 = 0;
    this.contadorDev = 0;
    this.contadorDev2 = 0;
    this.saldo = 0;
    this.saldo2 = 0;
    this.llenarTabla(this.remisionProducto.num_FactPro);
  }

  nuevoObsequio() {
    this.productosObsequios.push(new productosObsequio());
  }

  listarObsequios() {
    this.productosObsequios.forEach((element) => {
      element.fecha = new Date().toLocaleDateString();
      element.idfactura = "5";
      element.proveedor = "ceramik";
      console.log(JSON.stringify(element));
    });
  }

  traerFacturasPorOrden(){
    this.mostrarLoading = true
    let numero = this.datoNsolicitud;
    var facturaP = new FacturaProveedor()
    facturaP.nSolicitud = numero
    this.facturasProveedorService.getFacturasDocumento(facturaP).subscribe((res) => {
      this.facturaProveedor = res as FacturaProveedor[];
      this.cargarFacturas()
    });
  }

  cargarFacturas() {
    if (this.contIngresos > 0) {
      window.location.reload();
    }
    this.contIngresos++;

    let numero = this.datoNsolicitud;
    var bandera: boolean = true;
    var cont = 0;
    /*this.facturaProveedor2.forEach((element) => {
      cont++;
    });
    if (cont >= 0) {
      this.facturaProveedor2.forEach((element) => {
        this.facturaProveedor2.splice(0);
      });
    }*/

    this.facturaProveedor.forEach((element) => {
      if (element.nSolicitud == numero && element.estado3 != "Ingresada") {
        this.solicitudOrdenC = element.documento_solicitud;
        this.facturaProveedor2.push(element);
        this.remisionProducto.nombre_proveedor = element.proveedor;
      }
    });

    if (this.facturaProveedor2.length > 0) {
      bandera = false;
      this.ejecutar(bandera);
    } else {
      bandera = true;
      this.ejecutar(bandera);
    }
    this.mostrarLoading = false;
  }

  ejecutar(bandera: boolean) {
    if (bandera) {
      Swal.fire("ERROR!", "No hay facturas que ingresar", "error");
    }
  }

  eliminarceldas() {
    console.log("entre aqui a eliminar");
    var elmtTable = document.getElementById("tabla1");
    var tableRows = elmtTable.getElementsByTagName("tr");
    var rowCount = tableRows.length;
    console.log("suma de rows " + rowCount);
    //elmtTable.removeChild(tableRows[5]);

    for (var x = rowCount - 1; x > 0; x--) {
      elmtTable.removeChild(tableRows[x]);
      console.log("entre al for");
    }
  }

  actualizarEstados(e: any) {
    var contre = 0;
    this.remisiones.forEach((element) => {
      if (element.num_orden == e.num_orden && element.estado != "Eliminada") {
        contre++;
      }
    });
    this.facturaProveedor.forEach((element) => {
      if (element.nSolicitud == e.num_orden) {
        this.solicitudOrdenC = element.documento_solicitud;
      }
    });
    this.ordenesCompra.forEach((element) => {
      if (e.num_orden == element.n_orden) {
        this.ordenleida2 = element;
      }
    });

    if (contre - 1 <= 0) {
      this.ordenesService
        .updateEstadoOrden2(this.ordenleida2, "PENDIENTE")
        .subscribe(
          (res) => {
            Swal.close();
            Swal.fire({
              title: "Remisión eliminada",
              text: "Se ha eliminado con éxito",
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
    } else {
      this.ordenesService
        .updateEstadoOrden2(this.ordenleida2, "PARCIAL")
        .subscribe(
          (res) => {
            Swal.close();
            Swal.fire({
              title: "Remisión eliminada",
              text: "Se ha eliminado con éxito",
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

  limpiarArreglo() {
    var cont = 0;
    this.productosSolicitados.forEach((element) => {
      cont++;
    });
    console.log("mostrando antes" + this.productosSolicitados.length);
    if (cont >= 0) {
      this.productosSolicitados.forEach((element) => {
        this.productosSolicitados.splice(0);
      });

      console.log("mostrando" + this.productosSolicitados.length);
    }
  }

  limpiarArreglo2() {
    var cont = 0;
    this.productosEntregados.forEach((element) => {
      cont++;
    });
    console.log("mostrando antes" + this.productosEntregados.length);
    if (cont >= 0) {
      this.productosEntregados.forEach((element) => {
        this.productosEntregados.splice(0);
      });

      console.log("mostrando" + this.productosEntregados.length);
    }
  }

  limpiarArreglo3() {
    var cont = 0;
    this.productosControl.forEach((element) => {
      cont++;
    });
    console.log("mostrando antes" + this.productosControl.length);
    if (cont >= 0) {
      this.productosControl.forEach((element) => {
        this.productosControl.splice(0);
      });

      console.log("mostrando" + this.productosControl.length);
    }
  }

  

  llenarTabla(num: string) {
    this.limpiarArreglo();
    this.limpiarArreglo2();
    this.limpiarArreglo3();
    let numero = this.datoNsolicitud;
    let solicitud = 0;

    /*this.ordenesCompra.forEach((element) => {
      if (element.n_orden == numero) {
        this.solicitudNOrden = element.documento;
        this.ordenleida = element;
        solicitud = element.documento;
        this.solNum = element.documento;
        this.productosComprados = element.productosComprados;
      }
    });*/

    var newOrden = new OrdenDeCompra()
    newOrden.n_orden = numero
    this.ordenesService.getOrdenEspecifica(newOrden).subscribe((res) => {
      this.ordenesCompra = res as OrdenDeCompra[];
      if(this.ordenesCompra.length != 0){
        this.seguirProceso(num)
      }else{
        Swal.fire("Error!", "No se ha podido traer la informacion", "error");
      }
      
    });


   
  }


  seguirProceso(num:string){
    let numero = this.datoNsolicitud;
    let solicitud = 0;
    this.ordenesCompra.forEach((element) => {
      if (element.n_orden == numero) {
        this.solicitudNOrden = element.documento;
        this.ordenleida = element;
        solicitud = element.documento;
        this.solNum = element.documento;
        this.productosComprados = element.productosComprados;
      }
    })
      
    var arregloProductos = [];
    this.facturaProveedor2.forEach((element) => {
      if (num == element.nFactura) {
        arregloProductos = element.productos;
      }
    });

    for (let index = 0; index < arregloProductos.length; index++) {
      this.productosComprados.forEach((element) => {
        if (arregloProductos[index] == element.nombreComercial.PRODUCTO) {
          this.productosSolicitados.push(element);
        }
      });
    }

    this.productosSolicitados.forEach((element) => {
      this.productosEntregados1 = new ProductoDetalleEntrega();
      this.productosEntregados1.nombreComercial = element.nombreComercial;
      this.productosEntregados1.cantidadSolicitada = element.cantidad;
      this.productosEntregados1.valorunitario = element.precio_compra;
      this.productosEntregados1.valortotal = element.total;
      this.productosEntregados1.descuentoGeneral = element.descGeneral;
      this.productosEntregados1.descuentoProducto = element.desct;
      this.productosEntregados1.cantidadSolicitadacajas = Math.trunc(
        element.cantidad / element.nombreComercial.M2
      );
      this.productosEntregados1.cantidadSolicitadapiezas =
        Math.trunc(
          (element.cantidad * element.nombreComercial.P_CAJA) /
            element.nombreComercial.M2
        ) -
        Math.trunc(element.cantidad / element.nombreComercial.M2) *
          element.nombreComercial.P_CAJA;
      this.productosEntregados1.fecha = this.fecha1;
      this.productosEntregados1.numeroOrden = this.datoNsolicitud;
      this.productosEntregados1.numeroRemision = this.Id_remision;
      this.productosEntregados1.precio = element.precio_compra;
      this.productosEntregados1.solicitud_compra = element.solicitud_n;
      //this.productosEntregados1.estado="Ok"
      this.productosEntregados.push(this.productosEntregados1);
    });
    this.obtenerProductosIngresados();
  
  }

  registrarDatos() {
    this.productosEntregados.forEach((element) => {
      console.log(
        "aquu mostrando el producto " +
          element.nombreComercial +
          " cantidadEntregada " +
          element.cantidadEntregada +
          "devo " +
          element.cantidadDevuelta +
          " obser" +
          element.observaciones
      );
    });
  }

  actualizarDato(id: number, property: string, event: any) {
    this.productosEntregados[id][property] = event.target.textContent;
    this.calcularm2(id);
    this.evaluarProductoCombo(this.productosEntregados[id].nombreComercial.PRODUCTO)
  }


  evaluarProductoCombo(nombreProducto : string){
    this.mensajeLoading = "Buscando Información ..."
    this.mostrarLoading = true;
    var combo = new producto();
    combo.PRODUCTO = nombreProducto
    this._combosService.getComboPorNombreProducto(combo).subscribe(res => {
      var combo = res as ProductoCombo[]; 
      this.mostrarLoading = false;
      if(combo.length != 0){
        Swal.fire({
          title: "Advertencia",
          text: "Estimado usuario este producto se encuentra disponible en "+combo.length+ " combos, recuerde actualizar los precios si el caso lo amerita",
          icon: "warning",
        });
      }
    })

  }



  calcularm2(id: number) {
    var m2Totales = 0;
    this.productosEntregados.forEach((element) => {
      element.metros2 =
        element.nombreComercial.M2 * element.cantidadEntregada +
        (element.cantidadEntregadapiezas * element.nombreComercial.M2) /
          element.nombreComercial.P_CAJA;
      element.metros2Devueltos =
        element.nombreComercial.M2 * element.cantidadDevuelta +
        (element.cantidadDevueltapiezas * element.nombreComercial.M2) /
          element.nombreComercial.P_CAJA;
      element.metros2totales = element.metros2 + element.metros2Devueltos;
    });

    this.productosControlFinal.forEach((element) => {
      if (
        this.productosEntregados[id].nombreComercial.PRODUCTO ==
        element.nombre_comercial
      ) {
        if (
          this.productosEntregados[id].metros2totales - 0.33 >
          element.saldom2
        ) {
          alert("la cantidad solicitada es mayor");
          this.productosEntregados[id].cantidadEntregada = 0;
          this.productosEntregados[id].cantidadEntregadapiezas = 0;
          this.productosEntregados[id].metros2 = 0;
          this.productosEntregados[id].cantidadDevuelta = 0;
          this.productosEntregados[id].cantidadDevueltapiezas = 0;
          this.productosEntregados[id].metros2Devueltos = 0;
          this.productosEntregados[id].metros2totales = 0;
          //this.newButtonEnabled2=true
        } else if (this.productosEntregados[id].metros2 == element.saldom2) {
          //alert("si es igual")
        } else {
          //this.productosEntregados[id][property]= event.target.textContent;
          this.newButtonEnabled2 = false;
        }
      }

      if (
        this.productosEntregados[id].nombreComercial.PRODUCTO ==
        element.nombre_comercial
      ) {
        var cantM2 =
          Number(this.productosEntregados[id].metros2) +
          Number(this.productosEntregados[id].metros2Devueltos);

        var cantidadCajas = Math.trunc(
          cantM2 / this.productosEntregados[id].nombreComercial.M2
        );
        var cantidadPiezas =
          Math.trunc(
            (cantM2 * this.productosEntregados[id].nombreComercial.P_CAJA) /
              this.productosEntregados[id].nombreComercial.M2
          ) -
          cantidadCajas * this.productosEntregados[id].nombreComercial.P_CAJA;

        if (
          cantidadCajas == element.saldo &&
          cantidadPiezas >= element.saldopiezas
        ) {
          element.estado = "COMPLETO";
        } else {
          element.estado = "INCOMPLETO";
        }
      }

      this.productosSolicitados.forEach((element2) => {
        if (element.nombre_comercial == element2.nombreComercial.PRODUCTO) {
          element2.estado_remision = element.estado;
        }
      });
    });

  }

  actualizarEstadoRec(i: number, e) {
    this.productosEntregados[i].estado = e.value;

  }

  actualizarMotDev(i: number, e) {
    this.productosEntregados[i].causaDevolucion = e.value;
  }

  obtenerProductosIngresados() {
    this.productosControlFinal = []
    var newFacturaP = new ProductoDetalleEntrega()
    newFacturaP.numeroOrden = this.datoNsolicitud
    this.productosIngresadoService.getProductosIngresadosPorOrden(newFacturaP).subscribe((res) => {
      this.productosEntregadosBase = res as ProductoDetalleEntrega[];
      this.cargarProductosOrden()
    });

    
  }


  cargarProductosOrden(){
    this.productosEntregadosBase.forEach((element) => {
      if (element.numeroOrden == this.datoNsolicitud && element.estadoIngreso != "Eliminado") {
        this.productoIngresado = new ControlProductos();
        this.productoIngresado.nombre_comercial = element.nombreComercial.PRODUCTO;
        this.productoIngresado.cantidadentregada = element.cantidadEntregada;
        this.productoIngresado.cantidadentregadapiezas = element.cantidadEntregadapiezas;
        this.productoIngresado.cantidadsolicitada = element.cantidadSolicitada;
        this.productoIngresado.cantidadDevuelta = element.cantidadDevuelta;
        this.productoIngresado.cantidadDevueltapiezas = element.cantidadDevueltapiezas;
        this.productoIngresado.fecha = element.fecha;
        this.productosControl.push(this.productoIngresado);
      }
    });

    let sum1,
      sum2 = 0;
    let calculot = 0;

    this.productosEntregados.forEach((element1) => {
      this.productosControl.forEach((element) => {
        if (element.nombre_comercial == element1.nombreComercial.PRODUCTO) {
          this.contadorp2 = Number(element.cantidadentregada) + this.contadorp2;
          this.contadorp3 =
            Number(element.cantidadentregadapiezas) + this.contadorp3;
          this.contadorDev =
            Number(element.cantidadDevuelta) + this.contadorDev;
          this.contadorDev2 =
            Number(element.cantidadDevueltapiezas) + this.contadorDev2;
        }
      });
      sum1 = Number(element1.cantidadSolicitadacajas) - this.contadorp2 - this.contadorDev;
      sum2 = Number(element1.cantidadSolicitadapiezas) - this.contadorp3 - this.contadorDev2;
      calculot = element1.nombreComercial.M2 * sum1 +(sum2 * element1.nombreComercial.M2) / element1.nombreComercial.P_CAJA;
      this.saldo = Math.trunc(calculot / element1.nombreComercial.M2);
      this.saldo2 =
        Math.trunc(
          (calculot * element1.nombreComercial.P_CAJA) /
            element1.nombreComercial.M2
        ) -
        this.saldo * element1.nombreComercial.P_CAJA;

      this.productoIngresado = new ControlProductos();
      this.productoIngresado.nombre_comercial =
        element1.nombreComercial.PRODUCTO;
      this.productoIngresado.cantidadentregada = this.contadorp2;
      this.productoIngresado.cantidadDevuelta = this.contadorDev;
      this.productoIngresado.cantidadDevueltapiezas = this.contadorDev2;
      this.productoIngresado.cantidadsolicitada = element1.cantidadSolicitada;
      this.productoIngresado.cantidadSolicitadacajas =
        "" +
        Math.trunc(element1.cantidadSolicitada / element1.nombreComercial.M2);
      this.productoIngresado.cantidadSolicitadapiezas =
        "" +
        (Math.trunc(
          (element1.cantidadSolicitada * element1.nombreComercial.P_CAJA) /
            element1.nombreComercial.M2
        ) -
          Math.trunc(
            element1.cantidadSolicitada / element1.nombreComercial.M2
          ) *
            element1.nombreComercial.P_CAJA);
      this.productoIngresado.cantidadentregadapiezas = this.contadorp3;
      this.productoIngresado.saldo = this.saldo;
      this.productoIngresado.saldopiezas = this.saldo2;
      this.productoIngresado.saldom2 = calculot;
      this.productoIngresado.solicitud_orden = element1.solicitud_compra;
      if (this.saldo > 0 || this.saldo2 > 0) {
        this.productoIngresado.estado = "INCOMPLETO";
      } else if (this.saldo == 0 || this.saldo == 0) {
        this.productoIngresado.estado = "COMPLETO";
      } else {
        this.productoIngresado.estado = "INCOMPLETO";
      }
      this.productosControlFinal.push(this.productoIngresado);
      this.contadorp2 = 0;
      this.contadorp3 = 0;
      this.contadorDev = 0;
      this.contadorDev2 = 0;
    });
  }

  ocultar() {
    var x = document.getElementById("ayuda");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  eliminarobsequio(i: number) {
    this.productosObsequios.splice(i, 1);
  }

  ocultar2() {
    //this.productosObsequios.push(new productosObsequio())
    var x = document.getElementById("obsequios");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  opcionMenu(e) {
    var x = document.getElementById("historial");
    var y = document.getElementById("busqueda");
    switch (e.value) {
      case "Remisión de Productos":
        x.style.display = "none";
        y.style.display = "block";
        break;
      case "Remisiones Mensuales":
        this.traerRemisionesMensuales();
        x.style.display = "block";
        y.style.display = "none";
        break;
      case "Remisiones Globales":
        this.traerRemisiones();
        x.style.display = "block";
        y.style.display = "none";
        break;
      default:
    }
  }

  setearNFactura() {
    let nf = this.remisionProductoleido.id_remision;
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

  setearNFactura2() {
    let nf = this.remisionProducto.id_remision;
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

  buscarDatosSucursal() {
    this.parametrizaciones.forEach((element) => {
      if (element.sucursal == this.remisionProducto.sucursal) {
        this.parametrizacionSucu = element;
      }
    });
  }

  validarObsequio(e, i) {
    this.productos.forEach((element) => {
      if (element.PRODUCTO == e.value) {
        this.productosObsequios[i].producto = element;
        this.productosObsequios[i].productoNombre = element.PRODUCTO;

        if (element.UNIDAD == "Metros")
          this.productosObsequios[i].bloqueo = false;
      }
    });
  }

  crearPDF() {
    const documentDefinition = this.getDocumentDefinition();
    pdfMake
      .createPdf(documentDefinition)
      .download(
        "Remision " + this.remisionProductoleido.id_remision,
        function () {}
      );
    this.mostrarLoading = false
  }

  crearPDF2() {
    this.buscarDatosSucursal();
    const documentDefinition = this.getDocumentDefinition2();
    pdfMake
      .createPdf(documentDefinition)
      .download(
        "Remision " + this.remisionProducto.id_remision,
        function (response) {
          Swal.close(),
            Swal.fire({
              title: "Remisión creada",
              text: "Se ha guardado con éxito",
              icon: "success",
              confirmButtonText: "Ok",
            }).then((result) => {
              window.location.reload();
            });
        }
      );
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
                    text: "REMISIÓN  001 - 000",
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
                            ul: [
                              "Numero Orden",
                              "Fecha",
                              "Sucursal",
                              "Nombre Proveedor",
                              "Factura proveedor",
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
                              "" + this.remisionProductoleido.num_orden,
                              "" +
                                this.remisionProductoleido.fechaP.toLocaleString(),
                              "" + this.remisionProductoleido.sucursal,
                              "" + this.remisionProductoleido.nombre_proveedor,
                              "" + this.remisionProductoleido.num_FactPro,
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
                              "N° Remisión/entrega",
                              "Nombre quien recibe",
                              "Bodega",
                              "Nombre transportador",
                              "Pl. Veh.Transport.",
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
                                "" + this.remisionProductoleido.num_remEnt,
                                "" + this.remisionProductoleido.nombre_recibe,
                                "" + this.remisionProductoleido.bodega,
                                "" +
                                  this.remisionProductoleido
                                    .nombre_transportador,
                                "" + this.remisionProductoleido.placa,
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

        this.getProductosIngresados2(this.productosControlIngresados),
        this.getProductosObsequio(this.productosObsequios2),
        { text: " " },
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

  getDocumentDefinition2() {
    sessionStorage.setItem("resume", JSON.stringify("jj"));
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
                text: "RUC:" + this.parametrizacionSucu.ruc,
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
                    text: "REMISIÓN  001 - 000",
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
                            style: "ultabla",
                            ul: [
                              { text: "Numero Orden", fontSize: 9 },
                              { text: "Fecha", fontSize: 9 },
                              { text: "Sucursal", fontSize: 9 },
                              { text: "Nombre Proveedor", fontSize: 9 },
                              { text: "Factura proveedor", fontSize: 9 },
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
                              "" + this.remisionProducto.num_orden,
                              "" +
                                this.remisionProducto.fechaP.toLocaleString(),
                              "" + this.remisionProducto.sucursal,
                              "" + this.remisionProducto.nombre_proveedor,
                              "" + this.remisionProducto.num_FactPro,
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
                              "N° Remisión/entrega",
                              "Nombre quien recibe",
                              "Bodega",
                              "Nombre transportador",
                              "Pl. Veh.Transport.",
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
                                "" + this.remisionProducto.num_remEnt,
                                "" + this.remisionProducto.nombre_recibe,
                                "" + this.remisionProducto.bodega,
                                "" + this.remisionProducto.nombre_transportador,
                                "" + this.remisionProducto.placa,
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

        this.getProductosIngresados2(this.productosEntregados),
        this.getProductosObsequio(this.productosObsequios),
        { text: " " },
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
              fontSize: 10,
              margin: [40, 20, 20, 10],
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
        ultabla: {
          fontSize: 9,
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

  getProductosObsequio(productos: productosObsequio[]) {
    if (productos.length >= 1) {
      return [
        {
          text: "Productos Obsequiados",
          fontSize: 9,
          margin: [90, 10, 5, 0],
          bold: true,
        },
        {
          table: {
            widths: ["36%", "7%", "7%"],
            alignment: "center",
            fontSize: 9,
            body: [
              [
                {
                  text: "Producto",
                  style: "tableHeader2",
                  fontSize: 8,
                  alignment: "center",
                },
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
              ],

              ...productos.map((ed) => {
                return [
                  { text: ed.producto.PRODUCTO, fontSize: 9 },
                  { text: ed.cantidad, alignment: "center", fontSize: 9 },
                  { text: ed.cantidadpiezas, alignment: "center", fontSize: 9 },
                ];
              }),
            ],
          },
        },
      ];
    }
  }

  getProductosIngresados2(productos: ProductoDetalleEntrega[]) {
    return {
      /*  [{text: 'Header with Colspan = 2', style: 'tableHeader', colSpan: 2, alignment: 'center'}, {}, {text: 'Header 3', style: 'tableHeader', alignment: 'center'}], */
      table: {
        widths: ["40%", "9%", "9%", "7%", "7%", "11%", "17%"],
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
              text: "Cantidad Entregada",
              style: "tableHeader2",
              colSpan: 2,
              fontSize: 8,
              alignment: "center",
            },
            {},
            {
              text: "Cantidad Devuelta",
              style: "tableHeader2",
              colSpan: 2,
              fontSize: 8,
              alignment: "center",
            },
            {},
            {
              text: "Estado/Causa",
              style: "tableHeader2",
              rowSpan: 2,
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Observaciones",
              rowSpan: 2,
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
          ],
          [
            {},
            {
              text: "(m2)",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
            {
              text: "Caj/Pzs",
              style: "tableHeader2",
              fontSize: 8,
              alignment: "center",
            },
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
          ],

          ...productos.map((ed) => {
            return [
              { text: ed.nombreComercial.PRODUCTO, fontSize: 9 },
              { text: ed.metros2.toFixed(2), alignment: "center", fontSize: 9 },
              {
                text:
                  ed.cantidadEntregada +
                  "C " +
                  ed.cantidadEntregadapiezas +
                  "P",
                alignment: "center",
                fontSize: 9,
              },
              { text: ed.cantidadDevuelta, alignment: "center", fontSize: 9 },
              {
                text: ed.cantidadDevueltapiezas,
                alignment: "center",
                fontSize: 9,
              },
              { text: ed.estado, alignment: "center", fontSize: 9 },
              { text: ed.observaciones, alignment: "center", fontSize: 9 },
            ];
          }),
        ],
      },
    };
  }
}
