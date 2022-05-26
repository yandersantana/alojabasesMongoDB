import { Component, OnInit } from "@angular/core";
import { catalogo } from "../catalogo/catalogo";
import { CatalogoService } from "src/app/servicios/catalogo.service";
import { ActivatedRoute } from "@angular/router";
import { producto } from "../ventas/venta";
import { ProductoService } from "src/app/servicios/producto.service";
import { ControlPreciosService } from "src/app/servicios/control-precios.service";
import { PrecioEspecialService } from "src/app/servicios/precio-especial.service";
import { preciosEspeciales, precios } from "../control-precios/controlPrecios";
import { infoprod } from "../info-productos/info-productos";
import DataSource from "devextreme/data/data_source";
import { AuthenService } from "src/app/servicios/authen.service";
import { user } from "../user/user";
import { objDate, transaccion } from "../transacciones/transacciones";
import { TransaccionesService } from "src/app/servicios/transacciones.service";
import { productoTransaccion } from "../consolidado/consolidado";
import { AuthService } from "src/app/shared/services";
@Component({
  selector: "app-consultas",
  templateUrl: "./consultas.component.html",
  styleUrls: ["./consultas.component.scss"],
})
export class ConsultasComponent implements OnInit {
  catalogoLeido: catalogo;
  productoLeido: producto;
  productosActivos: producto[] = [];
  productos: producto[] = [];
  productosCatalogo: catalogo[] = [];
  idProducto: string = "";
  infoproducto: infoprod;
  imagenes: string[];
  precios: precios[] = [];
  productos22: DataSource;
  nombre_producto: string;
  usuarioLogueado: user;
  correo: string = "";
  preciosEspeciales: preciosEspeciales[] = [];
  mostrarTabla: boolean = false;
  prodSuc1 = 0;
  prodSuc2 = 0;
  prodSuc3 = 0;
  prodBod = 0;
  ubi1: string[] = [];
  ubi2: string[] = [];
  ubi3: string[] = [];
  obj: objDate;
  transaccionesGlobales: transaccion[] = [];
  transaccionesCompras: transaccion[] = [];
  proTransaccion: productoTransaccion;
  nombreProducto: string = "";
  mostrarGaleria: boolean = false;

  constructor(
    public authenService: AuthenService,
    public catalogoService: CatalogoService,
    public preciosEspecialesService: PrecioEspecialService,
    public preciosService: ControlPreciosService,
    private transaccionesService: TransaccionesService,
    private rutaActiva: ActivatedRoute,
    public authService: AuthService,
    public productoService: ProductoService
  ) {
    //this.idProducto = this.rutaActiva.snapshot.paramMap.get("id")
    this.infoproducto = new infoprod();
    this.proTransaccion = new productoTransaccion();
  }

  ngOnInit() {
    this.traerProductosCatalogo();
    this.traerPrecios();
    this.traerPreciosEspeciales();
    this.traerProductos();
    this.cargarUsuarioLogueado();
  }

  traerProductosCatalogo() {
    const promesaUser = new Promise((res, err) => {
      this.catalogoService.getCatalogo().subscribe((res) => {
        this.productosCatalogo = res as catalogo[];
        //this.traerProductoId()
      });
    });
  }

  traerTransaccionesPorRango() {
    this.mostrarTabla = true;
    this.transaccionesCompras = [];
    this.transaccionesGlobales = [];
    var fechaHoy = new Date();
    var fechaAnterior = new Date();
    fechaHoy.setDate(fechaHoy.getDate() + 1);
    fechaAnterior.setDate(fechaHoy.getDate() - 60);
    this.proTransaccion.nombre = this.nombre_producto;
    this.proTransaccion.fechaActual = fechaHoy;
    this.proTransaccion.fechaAnterior = fechaAnterior;
    this.transaccionesService
      .getTransaccionesPorProductoYFecha(this.proTransaccion)
      .subscribe((res) => {
        this.transaccionesGlobales = res as transaccion[];
        this.buscarTransacciones();
      });
  }

  buscarTransacciones() {
    this.transaccionesGlobales.forEach((element) => {
      if (
        element.tipo_transaccion == "venta-not" ||
        element.tipo_transaccion == "venta-fact"
      ) {
        this.transaccionesCompras.push(element);
      }
    });
    //this.mostrarTabla = fals
  }

  traerPrecios() {
    this.preciosService.getPrecio().subscribe((res) => {
      this.precios = res as precios[];
    });
  }

  traerPreciosEspeciales() {
    this.preciosEspecialesService.getPrecio().subscribe((res) => {
      this.preciosEspeciales = res as preciosEspeciales[];
    });
  }

  traerProductoId() {
    this.productoService.getProductobyId(this.idProducto).subscribe((res) => {
      this.productoLeido = res as producto;
      this.cargarProductoTabla();
    });
  }

  traerProductos() {
    this.productoService.getProductosActivos().subscribe((res) => {
      this.productos = res as producto[];
      this.llenarComboProductos();
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
          if (this.usuarioLogueado[0].rol == "Usuario Web") {
            var z = document.getElementById("galeria");
            z.style.display = "block";
          } else {
            var z = document.getElementById("galeria2");
            z.style.display = "block";
          }

          if(this.usuarioLogueado[0].status == "Inactivo")
              this.authService.logOut();
        },
        (err) => {}
      );
    });
  }

  llenarComboProductos() {
    this.productos22 = new DataSource({
      store: this.productos,
      sort: [{ field: "PRODUCTO", asc: true }],
    });
  }

  obtenerDatosDeProductoParaUnDetalle() {
    this.mostrarTabla = false;
    this.transaccionesCompras = [];
    this.transaccionesGlobales = [];
    this.productos.forEach((element) => {
      if (element.PRODUCTO == this.nombre_producto) {
        this.productoLeido = element;
      }
    });
    this.cargarProductoTabla();
  }

  mostrarEliminar() {
    this.nombre_producto = "";
  }

  cargarProductoTabla() {
    this.infoproducto.producto = this.productoLeido.PRODUCTO;
    this.infoproducto.precioCosto = this.productoLeido.precio;
    this.infoproducto.productoLeido = this.productoLeido;
    this.infoproducto.piezas = this.productoLeido.P_CAJA;
    this.infoproducto.metros = this.productoLeido.M2;
    this.infoproducto.fabrica = "";

    this.infoproducto.disponibilidad =
      this.productoLeido.sucursal1 +
      "M  - " +
      this.productoLeido.sucursal2 +
      "S1  - " +
      this.productoLeido.sucursal3 +
      "S2  - " +
      this.productoLeido.bodegaProveedor +
      "P ";
    this.prodSuc1 = parseFloat(this.productoLeido.sucursal1.toFixed(2));
    this.prodSuc2 = parseFloat(this.productoLeido.sucursal2.toFixed(2));
    this.prodSuc3 = parseFloat(this.productoLeido.sucursal3.toFixed(2));
    this.prodBod = parseFloat(
      Number(this.productoLeido.bodegaProveedor).toFixed(2)
    );
    if (this.prodSuc1 < 0) {
      this.prodSuc1 = 0;
    }
    if (this.prodSuc2 < 0) {
      this.prodSuc2 = 0;
    }
    if (this.prodSuc3 < 0) {
      this.prodSuc3 = 0;
    }
    if (this.prodBod < 0) {
      this.prodBod = 0;
    }
    this.infoproducto.ubicacion =
      "M(" +
      this.productoLeido.ubicacionSuc1 +
      ") - " +
      "S1(" +
      this.productoLeido.ubicacionSuc2 +
      ") - " +
      "S2(" +
      this.productoLeido.ubicacionSuc3 +
      ") ";
    this.ubi1 = this.productoLeido.ubicacionSuc1;
    this.ubi2 = this.productoLeido.ubicacionSuc2;
    this.ubi3 = this.productoLeido.ubicacionSuc3;
    //this.infoproducto.notas = this.productoLeido.notas;
    this.infoproducto.notas = ""
    this.productoLeido.notas.forEach((element) => {
      this.infoproducto.notas = element +" , "+ this.infoproducto.notas
    });

    this.productosCatalogo.forEach((element) => {
      if (element.PRODUCTO == this.infoproducto.producto) {
        //this.infoproducto.notas = element.notas;
        this.infoproducto.fabrica = element.CASA;
        this.imagenes = element.IMAGEN;
      }
    });
    if (this.imagenes.length > 0) {
      this.mostrarGaleria = true;
    }

    this.infoproducto.cantidad = 1;
    this.infoproducto.precioCliente = parseFloat(
      (
        this.infoproducto.productoLeido.precio *
          (this.infoproducto.productoLeido.porcentaje_ganancia / 100) +
        this.infoproducto.productoLeido.precio
      ).toFixed(2)
    );
    this.precios.forEach((element) => {
      if (element.aplicacion == this.infoproducto.productoLeido.APLICACION) {
        if (
          this.infoproducto.cantidad > 0 &&
          this.infoproducto.cantidad <= element.cant1
        ) {
          this.infoproducto.precioCliente = parseFloat(
            (
              (this.infoproducto.productoLeido.precio * element.percent1) /
                100 +
              this.infoproducto.productoLeido.precio
            ).toFixed(2)
          );
        }
        if (
          this.infoproducto.cantidad > element.cant1 &&
          this.infoproducto.cantidad <= element.cant2
        ) {
          this.infoproducto.precioCliente = parseFloat(
            (
              (this.infoproducto.productoLeido.precio * element.percent2) /
                100 +
              this.infoproducto.productoLeido.precio
            ).toFixed(2)
          );
        }

        if (this.infoproducto.cantidad > element.cant2) {
          this.infoproducto.precioCliente = parseFloat(
            (
              (this.infoproducto.productoLeido.precio * element.percent3) /
                100 +
              this.infoproducto.productoLeido.precio
            ).toFixed(2)
          );
        }
      }
    });

    //precio distribuidor
    this.infoproducto.precioDist = parseFloat(
      (
        (this.infoproducto.productoLeido.precio *
          this.preciosEspeciales[0].precioDistribuidor) /
          100 +
        this.infoproducto.productoLeido.precio
      ).toFixed(2)
    );
    //precio socio
    this.infoproducto.precioSocio = parseFloat(
      (
        (this.infoproducto.productoLeido.precio *
          this.preciosEspeciales[0].precioSocio) /
          100 +
        this.infoproducto.productoLeido.precio
      ).toFixed(2)
    );
  }

  actualizarDato(event: any) {
    this.infoproducto.cantidad = event.target.textContent;
    this.precios.forEach((element) => {
      if (element.aplicacion == this.infoproducto.productoLeido.APLICACION) {
        if (
          this.infoproducto.cantidad > 0 &&
          this.infoproducto.cantidad <= element.cant1
        ) {
          this.infoproducto.precioCliente = parseFloat(
            (
              (this.infoproducto.productoLeido.precio * element.percent1) /
                100 +
              this.infoproducto.productoLeido.precio
            ).toFixed(2)
          );
        }
        if (
          this.infoproducto.cantidad > element.cant1 &&
          this.infoproducto.cantidad <= element.cant2
        ) {
          this.infoproducto.precioCliente = parseFloat(
            (
              (this.infoproducto.productoLeido.precio * element.percent2) /
                100 +
              this.infoproducto.productoLeido.precio
            ).toFixed(2)
          );
        }

        if (this.infoproducto.cantidad > element.cant2) {
          this.infoproducto.precioCliente = parseFloat(
            (
              (this.infoproducto.productoLeido.precio * element.percent3) /
                100 +
              this.infoproducto.productoLeido.precio
            ).toFixed(2)
          );
        }
      }
    });
  }
}
