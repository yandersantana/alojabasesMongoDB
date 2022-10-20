import { Component, OnInit, ViewChild } from "@angular/core";
import { objDate, transaccion } from "./transacciones";
import { DxDataGridComponent } from "devextreme-angular";
import { TransaccionesService } from "src/app/servicios/transacciones.service";
import { user } from "../user/user";
import { AuthenService } from "src/app/servicios/authen.service";
import DataSource from "devextreme/data/data_source";
import { ProductoService } from "src/app/servicios/producto.service";
import { producto } from "../ventas/venta";
import { productoTransaccion } from "../consolidado/consolidado";
import { AuthService } from "src/app/shared/services";
import Swal from "sweetalert2";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: "app-transacciones",
  templateUrl: "./transacciones.component.html",
  styleUrls: ["./transacciones.component.scss"],
})
export class TransaccionesComponent implements OnInit {
  transacciones: transaccion[] = [];
  transaccionesGenerales: transaccion[] = [];
  transaccionesGlobales: transaccion[] = [];
  popupvisible: boolean = false;
  mostrarLoading: boolean = true;
  correo: string;
  usuarioLogueado: user;
  obj: objDate;
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  productos22: DataSource;
  productos: producto[] = [];
  isBusqGeneral:boolean = true;
  nombreProducto : string = "";
  proTransaccion: productoTransaccion;
  mensajeLoading = "Cargando..";
  menu1: string[] = ["Búsqueda General", "Búsqueda Individual"];
  @ViewChild("datag2") dataGrid2: DxDataGridComponent;
  constructor(
    public transaccionesService: TransaccionesService,
    public authenService: AuthenService,
    public authService: AuthService,
    public _productoService : ProductoService,
    public _decimalPipe : DecimalPipe
  ) {}

  ngOnInit() {
    this.proTransaccion = new productoTransaccion();
    this.nowdesde.setDate(this.nowdesde.getDate() - 15);
    this.cargarUsuarioLogueado();
    //this.traerTransaccionesPorRango();
  }

  traerTransaccionesPorRango() {
    this.transaccionesGlobales = [];
    this.mensajeLoading = "Cargando Transacciones";
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);

    if(this.isBusqGeneral){
      this.transaccionesService.getTransaccionesPorRango(this.obj).subscribe(
        (res) => {
          this.transaccionesGlobales = res as transaccion[];
          this.separarTransacciones();
        },
        () => {}
      );
    }else{
      this.proTransaccion.nombre = this.nombreProducto;
      this.proTransaccion.fechaActual = this.obj.fechaActual;
      this.proTransaccion.fechaAnterior = this.obj.fechaAnterior;
      this.transaccionesService.getTransaccionesPorProductoYFecha(this.proTransaccion).subscribe((res) => {
          this.transaccionesGlobales = res as transaccion[];
          this.separarTransacciones();
      });

    }
    
  }

  traerTransacciones() {
    this.transaccionesGlobales = [];
    this.mensajeLoading = "Cargando Transacciones";
    this.mostrarLoading = true;
    if(this.isBusqGeneral){
      this.transaccionesService.getTransaccion().subscribe(
        (res) => {
          this.transaccionesGlobales = res as transaccion[];
          this.separarTransacciones();
        },
        () => {}
      );
    }else{
      this.proTransaccion.nombre = this.nombreProducto;
      this.transaccionesService.getTransaccionesPorProducto(this.proTransaccion).subscribe((res) => {
        this.transaccionesGlobales = res as transaccion[];
        this.separarTransacciones();
      });
    }
    
  }

  traerProductosUnitarios() {
    this.mensajeLoading = "Cargando Productos";
    this.mostrarLoading = true;
    this.productos = [];
    this._productoService.getProductosActivos().subscribe((res) => {
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


  opcionMenu(e) {
    switch (e.value) {
      case "Búsqueda General":
        this.isBusqGeneral = true;
        break;

      case "Búsqueda Individual":
        this.isBusqGeneral = false;
        if(this.productos.length == 0)
          this.traerProductosUnitarios();
        break;

      default:
    }
  }

  separarTransacciones() {
    this.transacciones = [];
    if (this.usuarioLogueado[0].rol != "Administrador") {
      switch (this.usuarioLogueado[0].sucursal) {
        case "matriz":
          this.transaccionesGlobales.forEach((element) => {
            if (element.sucursal == "matriz") {
              this.transacciones.push(element);
            }
          });
          this.terminarLoading();
          break;
        case "sucursal1":
          this.transaccionesGlobales.forEach((element) => {
            if (element.sucursal == "sucursal1") {
              this.transacciones.push(element);
            }
          });
          this.terminarLoading();
          break;
        case "sucursal2":
          this.transaccionesGlobales.forEach((element) => {
            if (element.sucursal == "sucursal2") {
              this.transacciones.push(element);
            }
          });
          this.terminarLoading();
          break;
        default:
          break;
      }
    } else {
      this.transacciones = this.transaccionesGlobales;
      /* this.transaccionesGlobales.forEach((element) => {
        //var data = element.totalsuma?.toString()
        element.totalsuma = Number(this._decimalPipe.transform(element.totalsuma,"1.2-2"))
       // element.totalsuma = Number(element.totalsuma.toFixed(2).toString())
      }); */
      this.terminarLoading();
    }
  }

  terminarLoading() {
    this.mostrarLoading = false;
  }

  cargarUsuarioLogueado() {
    new Promise((res, err) => {
      if (localStorage.getItem("maily") != "") 
        this.correo = localStorage.getItem("maily");

      this.authenService.getUserLogueado(this.correo).subscribe(
        (res) => { 
          this.usuarioLogueado = res as user;
          this.traerTransaccionesPorRango();
          if(this.usuarioLogueado[0].status == "Inactivo")
            this.authService.logOut();
        },
        (err) => {}
      );
    });
  }

  mostrarpopup() {
    this.popupvisible = true;
  }

  mostrarNotas = (e) => {
    console.log(e)
    var data = e.row.data;
    console.log(data)
    Swal.fire({
      title: 'Actualización Producto',
      text: "Está seguro que desea marcar como entregado el producto "+data.producto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.mensajeLoading = "Actualizando"
        this.mostrarLoading = true;
        this.transaccionesService.updateTransaccionEntrega(data).subscribe(
          res => {this.mostrarLoading = false;
                  Swal.fire({ title: "Correcto", text: "Se ha actualizado su transacción", icon: 'success' })
                  this.traerTransaccionesPorRango();},
          err => {this.mostrarLoading = false;
                  Swal.fire({ title: "Error", text: "Error al actualizar estado", icon: 'error'})})
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.mostrarLoading = false;
        Swal.fire({title: "Error", text: "Se ha cancelado su proceso", icon: 'error'})
      }
    })
  };

  isCloneIconDisabled(e) {
    if(e.row.data.mcaEntregado == "NO")
      return true;
    else 
      return false;
  }


  onRowPrepared(e) {}

  
  onExporting(e) {
    e.component.beginUpdate();
    e.component.columnOption("fecha_mov", "visible", true);
    e.component.columnOption("bodega", "visible", true);
    e.component.columnOption("rucSucursal", "visible", true);
    e.component.columnOption("usu_autorizado", "visible", true);
    e.component.columnOption("usuario", "visible", true);
    e.component.columnOption("observaciones", "visible", true);
    e.component.columnOption("costo_unitario", "visible", true);
    e.component.columnOption("maestro", "visible", true);
    e.component.columnOption("movimiento", "visible", true);
    e.component.columnOption("nombreUsuario", "visible", true);
    e.component.columnOption("nombreVendedor", "visible", true);
  }


  onExported(e) {
    e.component.columnOption("fecha_mov", "visible", false);
    e.component.columnOption("bodega", "visible", false);
    e.component.columnOption("usu_autorizado", "visible", false);
    e.component.columnOption("usuario", "visible", false);
    e.component.columnOption("rucSucursal", "visible", false);
    e.component.columnOption("costo_unitario", "visible", false);
    e.component.columnOption("movimiento", "visible", false);
    e.component.columnOption("maestro", "visible", false);
    e.component.columnOption("observaciones", "visible", false);
    e.component.columnOption("nombreUsuario", "visible", false);
    e.component.columnOption("nombreVendedor", "visible", false);
    e.component.endUpdate();
  }
}
