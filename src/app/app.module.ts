import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import {
  SideNavOuterToolbarModule,
  SideNavInnerToolbarModule,
  SingleCardModule,
} from "./layouts";
import { FooterModule, LoginFormModule } from "./shared/components";
import { AuthService, ScreenService, AppInfoService } from "./shared/services";
import { AppRoutingModule } from "./app-routing.module";
import { VentasComponent } from "./pages/ventas/ventas.component";
import { ComprasComponent } from "./pages/compras/compras.component";
import { CalculadoraComponent } from "./pages/ventas/calculadora/calculadora.component";
import { ProductoComponent } from "./pages/producto/producto.component";
import {
  DxButtonModule,
  DxTextBoxModule,
  DxFormModule,
  DxDataGridModule,
  DxSelectBoxModule,
  DxCheckBoxModule,
  DxNumberBoxModule,
  DxPopupModule,
  DxDateBoxModule,
  DxValidatorModule,
  DxAutocompleteModule,
  DxTemplateModule,
  DxFileUploaderModule,
  DxGalleryModule,
  DxScrollViewModule,
  DxAccordionModule,
  DxLoadIndicatorModule,
  DxLoadPanelModule,
  DxListModule,
  DxTextAreaModule,
  DxRadioGroupModule,
  DxMenuModule,
} from "devextreme-angular";
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { environment } from "src/environments/environment";
import { TransaccionesComponent } from "./pages/transacciones/transacciones.component";
import {
  LocationStrategy,
  HashLocationStrategy,
  DecimalPipe,
} from "@angular/common";

import { AlertsModule } from "angular-alert-module";
import {
  OrdenCompraComponent,
  StringifyEmployeesPipe,
} from "./pages/orden-compra/orden-compra.component";
import { ProveedoresComponent } from "./pages/proveedores/proveedores.component";
import { TrasladosComponent } from "./pages/traslados/traslados.component";
import { AnulacionesComponent } from "./pages/anulaciones/anulaciones.component";
import { BajasComponent } from "./pages/bajas/bajas.component";
import { CambiosComponent } from "./pages/cambios/cambios.component";
import { CatalogoComponent } from "./pages/catalogo/catalogo.component";
import { ConsolidadoComponent } from "./pages/consolidado/consolidado.component";
import { DevolucionesComponent } from "./pages/devoluciones/devoluciones.component";
import { RegistrosVentasComponent } from "./pages/registros-ventas/registros-ventas.component";
import { FormsModule } from "@angular/forms";
import { PinchZoomModule } from "ngx-pinch-zoom";
import { ParametrizacionComponent } from "./pages/parametrizacion/parametrizacion.component";
import { EntregasPComponent } from "./pages/entregas-p/entregas-p.component";
import { HttpClientModule } from "@angular/common/http";
import { UserComponent } from "./pages/user/user.component";
import { ClientesComponent } from "./pages/clientes/clientes.component";
import { CalculadorasComponent } from "./pages/calculadora/calculadora.component";
import { ControlPreciosComponent } from "./pages/control-precios/control-precios.component";
import { AuditoriasComponent } from "./pages/auditorias/auditorias.component";
import { BodegasComponent } from "./pages/bodegas/bodegas.component";
import { AuditoriaClComponent } from "./pages/auditoria-cl/auditoria-cl.component";
import { QRCodeModule } from "angularx-qrcode";
import { GenerarQRComponent } from "./pages/generar-qr/generar-qr.component";
import { InfoProductosComponent } from "./pages/info-productos/info-productos.component";
import { ConsultasComponent } from "./pages/consultas/consultas.component";
import { Auditoria2Component } from "./pages/auditorias/auditoria2/auditoria2.component";
import { AudTablaComponent } from "./pages/auditorias/aud-tabla/aud-tabla.component";
import { ConsultasGrupoComponent } from "./pages/consultas-grupo/consultas-grupo.component";
import { IndicadoresComponent } from "./pages/indicadores/indicadores.component";
import { LoadingComponent } from "./pages/loading/loading.component";
import { ReporteDetalladoComponent } from "./pages/reportes/reporte-detallado/reporte-detallado.component";
import { ReporteGlobalComponent } from "./pages/reportes/reporte-global/reporte-global.component";
import { IngresoDiarioComponent } from "./pages/reportes/ingreso-diario/ingreso-diario.component";
import { AdministracionCuentasComponent } from "./pages/administracion-cuentas/administracion-cuentas.component";
import { CajaMenorComponent } from "./pages/cajaMenor/caja-menor.component";
import { ReciboCajaComponent } from "./pages/reciboCaja/recibo-caja.component";
import { TransaccionesFinancierasComponent } from "./pages/transaccionesFinancieras/transaccionesFinancieras.component";
import { ComprobantePagoComponent } from "./pages/comprobante-pago/comprobante-pago.component";
import { LoadingMessaggeComponent } from "./pages/loading-message/loading-messagge.component";
import { ComprobantePagoProveedoresComponent } from "./pages/comprobante-pago-proveedores/comprobante-pago-proveedores.component";
import { DxoToolbarModule } from "devextreme-angular/ui/nested";
import { CuentaPorPagarComponent } from "./pages/cuentasPorPagar/cuentasPorPagar.component";
import { CuentaPorCobrarComponent } from "./pages/cuentasPorCobrar/cuentasPorCobrar.component";
import { PrestamosComponent } from "./pages/prestamos/prestamos.component";
import { ReciboCajaPrestamosComponent } from "./pages/reciboCaja/reciboCaja-prestamos/recibo-caja-prestamos.component";
import { RegistroFacturasComponent } from "./pages/registro-facturas/registro-facturas.component";
import { ComprobantePagoProveedoresDirectoComponent } from "./pages/comprobante-pago-proveedores-directo/comprobante-pago-proveedores-directo.component";
import { BasePagoProveedoresComponent } from "./pages/base-pagos-proveedores/base-pagos-proveedores.component";
import { GestionPagoChequesComponent } from "./pages/gestion-pago-cheques/gestion-pago-cheques.component";
import { TransaccionesNominasComponent } from "./pages/transaccionesNominas/transaccionesNominas.component";
import { RevionInventarioComponent } from "./pages/revision-inventario/revision-inventario.component";
import { StockMinimoComponent } from "./pages/stock-minimo/stock-minimo.component";
import { StockLocalesComponent } from "./pages/stock-locales/stock-locales.component";
import { VentasNuevoComponent } from "./pages/ventas copy/ventas-nuevo.component";

@NgModule({
  declarations: [
    AppComponent,
    VentasComponent,
    ComprasComponent,
    CalculadoraComponent,
    ProductoComponent,
    TransaccionesComponent,
    OrdenCompraComponent,
    StringifyEmployeesPipe,
    ProveedoresComponent,
    TrasladosComponent,
    AnulacionesComponent,
    BajasComponent,
    CambiosComponent,
    CatalogoComponent,
    ConsolidadoComponent,
    DevolucionesComponent,
    RegistrosVentasComponent,
    ParametrizacionComponent,
    EntregasPComponent,
    UserComponent,
    ClientesComponent,
    CalculadorasComponent,
    ControlPreciosComponent,
    AuditoriasComponent,
    BodegasComponent,
    AuditoriaClComponent,
    GenerarQRComponent,
    InfoProductosComponent,
    ConsultasComponent,
    Auditoria2Component,
    AudTablaComponent,
    ConsultasGrupoComponent,
    IndicadoresComponent,
    LoadingComponent,
    ReporteDetalladoComponent,
    ReporteGlobalComponent,
    IngresoDiarioComponent,
    AdministracionCuentasComponent,
    CajaMenorComponent,
    ReciboCajaComponent,
    CuentaPorCobrarComponent,
    TransaccionesFinancierasComponent,
    ComprobantePagoComponent,
    LoadingMessaggeComponent,
    ComprobantePagoProveedoresComponent,
    CuentaPorPagarComponent,
    PrestamosComponent,
    ReciboCajaPrestamosComponent,
    ReciboCajaPrestamosComponent,
    RegistroFacturasComponent,
    ComprobantePagoProveedoresDirectoComponent,
    BasePagoProveedoresComponent,
    GestionPagoChequesComponent,
    TransaccionesNominasComponent,
    RevionInventarioComponent,
    StockMinimoComponent,
    StockLocalesComponent,
    VentasNuevoComponent
  ],
  imports: [
    BrowserModule,
    SideNavOuterToolbarModule,
    SideNavInnerToolbarModule,
    SingleCardModule,
    FooterModule,
    LoginFormModule,
    AppRoutingModule,
    HttpClientModule,
    DxButtonModule,
    DxTextBoxModule,
    DxListModule,
    DxFormModule,
    PinchZoomModule,
    DxDataGridModule,
    DxFileUploaderModule,
    DxGalleryModule,
    DxLoadPanelModule,
    DxAccordionModule,
    DxLoadIndicatorModule,
    DxSelectBoxModule,
    FormsModule,
    DxCheckBoxModule,
    DxScrollViewModule,
    DxNumberBoxModule,
    QRCodeModule,
    DxPopupModule,
    DxDateBoxModule,
    DxAutocompleteModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    DxValidatorModule,
    DxTemplateModule,
    DxTextAreaModule,
    DxoToolbarModule,
    AlertsModule.forRoot(),
    DxRadioGroupModule,
    DxMenuModule
  ],
  exports: [CatalogoComponent],
  providers: [
    AuthService,
    ScreenService,
    DecimalPipe,
    AppInfoService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
