/* import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from './shared/components';
import { AuthGuardService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DisplayDataComponent } from './pages/display-data/display-data.component';
import { DxDataGridModule, DxFormModule } from 'devextreme-angular';
import { VentasComponent } from './pages/ventas/ventas.component';
import { ComprasComponent } from './pages/compras/compras.component';
import { OrdenCompraComponent } from './pages/orden-compra/orden-compra.component';
import { TransaccionesComponent } from './pages/transacciones/transacciones.component';

const routes: Routes = [
  {
    path: 'display-data',
    component: DisplayDataComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'login-form',
    component: LoginFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'compras',
    component: ComprasComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'ventas',
    component: VentasComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'transacciones',
    component: TransaccionesComponent,
    canActivate: [ AuthGuardService ]
  },
  
  {
    path: 'OrdenCompra',
    component: OrdenCompraComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [ AuthGuardService ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), DxDataGridModule, DxFormModule],
  providers: [AuthGuardService],
  exports: [RouterModule],
  declarations: [HomeComponent, ProfileComponent, DisplayDataComponent]
})
export class AppRoutingModule { }
 */


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from './shared/components';
import { AuthGuardService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DisplayDataComponent } from './pages/display-data/display-data.component';
import { DxDataGridModule, DxFormModule } from 'devextreme-angular';
import { VentasComponent } from './pages/ventas/ventas.component';

import { TransaccionesComponent } from './pages/transacciones/transacciones.component';
import { OrdenCompraComponent } from './pages/orden-compra/orden-compra.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { TrasladosComponent } from './pages/traslados/traslados.component';
import { CambiosComponent } from './pages/cambios/cambios.component';
import { AnulacionesComponent } from './pages/anulaciones/anulaciones.component';
import { BajasComponent } from './pages/bajas/bajas.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { ComprasComponent } from './pages/compras/compras.component';
import { DevolucionesComponent } from './pages/devoluciones/devoluciones.component';
import { ConsolidadoComponent } from './pages/consolidado/consolidado.component';

import { RegistrosVentasComponent } from './pages/registros-ventas/registros-ventas.component';
import { EntregasPComponent } from './pages/entregas-p/entregas-p.component';
import { ParametrizacionComponent } from './pages/parametrizacion/parametrizacion.component';
import { UserComponent } from './pages/user/user.component';
import { VerifyAuthGuard } from './verify-auth.guard';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ControlPreciosComponent } from './pages/control-precios/control-precios.component';
import { CalculadorasComponent } from './pages/calculadora/calculadora.component';
import { CalculadoraComponent } from './pages/ventas/calculadora/calculadora.component';
import { AuditoriasComponent } from './pages/auditorias/auditorias.component';
import { BodegasComponent } from './pages/bodegas/bodegas.component';
import { AuditoriaClComponent } from './pages/auditoria-cl/auditoria-cl.component';
import { GenerarQRComponent } from './pages/generar-qr/generar-qr.component';
import { InfoProductosComponent } from './pages/info-productos/info-productos.component';
import { ConsultasComponent } from './pages/consultas/consultas.component';
import { Auditoria2Component } from './pages/auditorias/auditoria2/auditoria2.component';
import { AudTablaComponent } from './pages/auditorias/aud-tabla/aud-tabla.component';
import { ConsultasGrupoComponent } from './pages/consultas-grupo/consultas-grupo.component';
import { IndicadoresComponent } from './pages/indicadores/indicadores.component';


const routes: Routes = [
  {
    path: 'display-data',
    component: DisplayDataComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'login-form',
    component: LoginFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'compras',
    component: ComprasComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'ventas',
    component: VentasComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'transacciones',
    component: TransaccionesComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'OrdenCompra',
    component: OrdenCompraComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'Entrega_productos',
    component: EntregasPComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'productos',
    component: ProductoComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'calculadora',
    component:CalculadorasComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'consultas',
    component:ConsultasComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'consultas-grupo',
    component:ConsultasGrupoComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'parametrizacion',
    canActivate: [ AuthGuardService ],
    data: { roles: ['Administrador'] } ,
    component: ParametrizacionComponent,
    
  },
  {
    path: 'menu-indicadores',
    canActivate: [ AuthGuardService ],
    data: { roles: ['Administrador'] } ,
    component: IndicadoresComponent,
    
  },
  {
    path: 'usuarios',
    canActivate: [ AuthGuardService ],
    data: { roles: ['Administrador'] } ,
    component: UserComponent
  },
  {
    path: 'clientes',
    canActivate: [ AuthGuardService ],
    data: { roles: ['Administrador'] } ,
    component: ClientesComponent
  },
  {
    path: 'precios',
    canActivate: [ AuthGuardService ],
    data: { roles: ['Administrador'] } ,
    component: ControlPreciosComponent
  },
  {
    path: 'proveedores',
    component: ProveedoresComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'traslados',
    component: TrasladosComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'registrosVentas',
    component: RegistrosVentasComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'cambios',
    component: CambiosComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'devoluciones',
    component: DevolucionesComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'anulaciones',
    component: AnulacionesComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'bajas',
    component: BajasComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'consolidado',
    component: ConsolidadoComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'catalogo',
    component: CatalogoComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'info-productos/:id',
    component: InfoProductosComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'bodegas',
    component: BodegasComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'auditorias',
    component: AuditoriasComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'auditorias/novedades',
    component: Auditoria2Component,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'auditorias/tabla',
    component:   AudTablaComponent,
    canActivate: [ AuthGuardService ]
  },

  {
    path: 'auditorias2',
    component: AuditoriaClComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'generador-qr',
    component: GenerarQRComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: '**',
    redirectTo: 'home',
    canActivate: [ AuthGuardService ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), DxDataGridModule, DxFormModule],
  providers: [AuthGuardService],
  exports: [RouterModule],
  declarations: [HomeComponent, ProfileComponent, DisplayDataComponent]
})
export class AppRoutingModule { }