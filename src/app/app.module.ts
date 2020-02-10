import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VentasComponent } from './ventas/ventas.component';
import { Ventas2Component } from './ventas2/ventas2.component';
import { DxButtonModule, DxFormModule, DxDataGridModule, DxTextBoxModule, DxSelectBoxModule, DxCheckBoxModule, DxNumberBoxModule, DxPopupModule } from 'devextreme-angular';
import { ProductoComponent } from './producto/producto.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { ComprasComponent } from './compras/compras.component';
import { CalculadoraComponent } from './ventas/calculadora/calculadora.component';

@NgModule({
  declarations: [
    AppComponent,
    VentasComponent,
    Ventas2Component,
    ProductoComponent,
    ComprasComponent,
    CalculadoraComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxButtonModule,
    DxTextBoxModule,
    DxFormModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxNumberBoxModule,
    DxPopupModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
