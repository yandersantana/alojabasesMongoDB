import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule, SideNavInnerToolbarModule, SingleCardModule } from './layouts';
import { FooterModule, LoginFormModule } from './shared/components';
import { AuthService, ScreenService, AppInfoService } from './shared/services';
import { AppRoutingModule } from './app-routing.module';
import { VentasComponent } from './pages/ventas/ventas.component';
import { ComprasComponent } from './pages/compras/compras.component';
import { CalculadoraComponent } from './pages/ventas/calculadora/calculadora.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { DxButtonModule, DxTextBoxModule, DxFormModule, DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxNumberBoxModule, DxPopupModule, DxDateBoxModule, DxValidatorModule, DxAutocompleteModule, DxTemplateModule } from 'devextreme-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from 'src/environments/environment';
import { TransaccionesComponent } from './pages/transacciones/transacciones.component';

@NgModule({
  declarations: [
    AppComponent,
    VentasComponent,
    ComprasComponent,
    CalculadoraComponent,
    ProductoComponent,
    TransaccionesComponent
  ],
  imports: [
    BrowserModule,
    SideNavOuterToolbarModule,
    SideNavInnerToolbarModule,
    SingleCardModule,
    FooterModule,
    LoginFormModule,
    AppRoutingModule,
    DxButtonModule,
    DxTextBoxModule,
    DxFormModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxNumberBoxModule,
    DxPopupModule,
    DxDateBoxModule,
    DxAutocompleteModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    DxValidatorModule,
    DxTemplateModule,
  ],
  providers: [AuthService, ScreenService, AppInfoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
