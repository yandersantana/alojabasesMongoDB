import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductoComponent } from './producto/producto.component';
import { VentasComponent } from './ventas/ventas.component';


const routes: Routes = [
  { path: 'ingresar_producto', component: ProductoComponent },
  { path: 'ventas',      component: VentasComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
