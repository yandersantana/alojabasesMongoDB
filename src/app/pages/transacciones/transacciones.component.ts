import { Component, OnInit, ViewChild } from "@angular/core";
import { objDate, transaccion } from "./transacciones";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore } from "angularfire2/firestore";
import { DxDataGridComponent } from "devextreme-angular";
import { TransaccionesService } from "src/app/servicios/transacciones.service";
import { user } from "../user/user";
import { AuthenService } from "src/app/servicios/authen.service";

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
  menu1: string[] = ["Transacciones Mensuales", "Transacciones Globales"];
  @ViewChild("datag2") dataGrid2: DxDataGridComponent;
  constructor(
    public transaccionesService: TransaccionesService,
    public authenService: AuthenService
  ) {}

  ngOnInit() {
    this.cargarUsuarioLogueado();
    this.traerTransaccionesPorRango();
  }

  traerTransaccionesPorRango() {
    this.transaccionesGlobales = [];
    this.mostrarLoading = true;
    var fechaHoy = new Date();
    var fechaAnterior = new Date();
    fechaHoy.setDate(fechaHoy.getDate() + 1);
    fechaAnterior.setDate(fechaHoy.getDate() - 30);
    this.obj = new objDate();
    this.obj.fechaActual = fechaHoy;
    this.obj.fechaAnterior = fechaAnterior;
    this.transaccionesService.getTransaccionesPorRango(this.obj).subscribe(
      (res) => {
        this.transaccionesGlobales = res as transaccion[];
        this.separarTransacciones();
      },
      () => {}
    );
  }

  traerTransacciones() {
    this.transaccionesGlobales = [];
    this.mostrarLoading = true;
    this.transaccionesService.getTransaccion().subscribe(
      (res) => {
        this.transaccionesGlobales = res as transaccion[];
        this.separarTransacciones();
      },
      () => {}
    );
  }

  opcionMenu(e) {
    //var x = document.getElementById("menu1");
    //var y = document.getElementById("menu2");

    switch (e.value) {
      case "Transacciones Mensuales":
        //x.style.display = "block";
        //y.style.display="none";
        this.traerTransaccionesPorRango();

        break;

      case "Transacciones Globales":
        this.traerTransacciones();
        //x.style.display = "none";
        //y.style.display="block";

        break;

      default:
    }
  }

  separarTransacciones() {
    console.log("ssssssssss");
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
      this.terminarLoading();
    }
    //this.mostrarLoading=false
  }

  terminarLoading() {
    this.mostrarLoading = false;
  }

  cargarUsuarioLogueado() {
    const promesaUser = new Promise((res, err) => {
      if (localStorage.getItem("maily") != "") {
        this.correo = localStorage.getItem("maily");
      }
      this.authenService.getUserLogueado(this.correo).subscribe(
        (res) => {
          this.usuarioLogueado = res as user;
          if (this.usuarioLogueado[0].rol == "Usuario") {
          } else {
          }
        },
        (err) => {}
      );
    });
  }

  restarDias() {
    var fechaHoy = new Date();
    var fechaAnterior = new Date();
    fechaHoy.setDate(fechaHoy.getDate() + 1);
    fechaAnterior.setDate(fechaHoy.getDate() - 15);
    console.log("la fecha es", fechaHoy, fechaAnterior);
  }

  mostrarpopup() {
    this.popupvisible = true;
  }

  onRowPrepared(e) {}

  onExporting(e) {
    e.component.beginUpdate();
    e.component.columnOption("fecha_mov", "visible", true);
    e.component.columnOption("bodega", "visible", true);
    e.component.columnOption("valor", "visible", true);
    e.component.columnOption("rucSucursal", "visible", true);
    e.component.columnOption("usu_autorizado", "visible", true);
    e.component.columnOption("usuario", "visible", true);
    e.component.columnOption("observaciones", "visible", true);
    e.component.columnOption("cliente", "visible", true);
    e.component.columnOption("costo_unitario", "visible", true);
    e.component.columnOption("cantM2", "visible", true);
    e.component.columnOption("proveedor", "visible", true);
    e.component.columnOption("maestro", "visible", true);
    e.component.columnOption("movimiento", "visible", true);
  }
  onExported(e) {
    e.component.columnOption("fecha_mov", "visible", false);
    e.component.columnOption("bodega", "visible", false);
    e.component.columnOption("valor", "visible", false);
    e.component.columnOption("usu_autorizado", "visible", false);
    e.component.columnOption("usuario", "visible", false);
    e.component.columnOption("rucSucursal", "visible", false);
    e.component.columnOption("cliente", "visible", false);
    e.component.columnOption("cantM2", "visible", false);
    e.component.columnOption("costo_unitario", "visible", false);
    e.component.columnOption("proveedor", "visible", false);
    e.component.columnOption("movimiento", "visible", false);
    e.component.columnOption("maestro", "visible", false);
    e.component.columnOption("observaciones", "visible", false);
    e.component.endUpdate();
  }
}
