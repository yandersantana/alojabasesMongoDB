import { Component, OnInit, NgModule, Input, ViewChild } from '@angular/core';
import { SideNavigationMenuModule, HeaderModule } from '../../shared/components';
import { ScreenService } from '../../shared/services';
import { DxDrawerModule } from 'devextreme-angular/ui/drawer';
import { DxScrollViewModule, DxScrollViewComponent } from 'devextreme-angular/ui/scroll-view';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
import { CommonModule } from '@angular/common';

import { navigation, navigationAdmin, navigationInspector, navigationSupervisor, navigationWEB } from '../../app-navigation';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenService } from 'src/app/servicios/authen.service';
import { user } from 'src/app/pages/user/user';

@Component({
  selector: 'app-side-nav-inner-toolbar',
  templateUrl: './side-nav-inner-toolbar.component.html',
  styleUrls: ['./side-nav-inner-toolbar.component.scss']
})
export class SideNavInnerToolbarComponent implements OnInit {
  @ViewChild(DxScrollViewComponent, { static: true }) scrollView: DxScrollViewComponent;
  menuItems
  
 // menuItemsAdmin = navigationAdmin;
  selectedRoute = '';

  menuOpened: boolean;
  temporaryMenuOpened = false;
  user = {
    name: '',
    lastname: '',
    email: '',
    image: '',
    rol: ""
  } 
  @Input()
  title: string;

  menuMode = 'shrink';
  menuRevealMode = 'expand';
  minMenuSize = 0;
  shaderEnabled = false;
 correo:string=""
  constructor(private screen: ScreenService, private router: Router,public authenService:AuthenService) { }

  ngOnInit() {
    this.menuOpened = this.screen.sizes['screen-large'];

    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.selectedRoute = val.urlAfterRedirects.split('?')[0];
      }
    });

    this.screen.changed.subscribe(() => this.updateDrawer());

    this.updateDrawer();
    this.crearPerfil()
  }

  crearPerfil() {
    if (localStorage.getItem("maily") != '') {
      this.correo = localStorage.getItem("maily");

    }
    this.authenService.returnUserRol().subscribe((ordenes: user[]) => {
      new Promise<any>((resolve, reject) => {
        ordenes.forEach((nt) => {
        
          if (nt.email == this.correo) {
            this.user.name = nt.name;
            this.user.rol = nt.rol
            this.buscarRol()
          }
        })
      })
    })

  }

  buscarRol(){
    if(this.user.rol == "Administrador")
      this.menuItems = navigationAdmin
     
    else if(this.user.rol == "Usuario")
      this.menuItems = navigation

    else if(this.user.rol == "Supervisor")
      this.menuItems = navigationSupervisor

    else if(this.user.rol == "Inspector")
      this.menuItems = navigationInspector
    
    else
      this.menuItems = navigationWEB
    
  }

  updateDrawer() {
    const isXSmall = this.screen.sizes['screen-x-small'];
    const isLarge = this.screen.sizes['screen-large'];

    this.menuMode = isLarge ? 'shrink' : 'overlap';
    this.menuRevealMode = isXSmall ? 'slide' : 'expand';
    this.minMenuSize = isXSmall ? 0 : 60;
    this.shaderEnabled = !isLarge;
  }

  toggleMenu = (e) => {
    this.menuOpened = !this.menuOpened;
    e.event.stopPropagation();
  }

  get hideMenuAfterNavigation() {
    return this.menuMode === 'overlap' || this.temporaryMenuOpened;
  }

  get showMenuAfterClick() {
    return !this.menuOpened;
  }

  navigationChanged(event) {
    const path = event.itemData.path;
    const pointerEvent = event.event;

    if (path && this.menuOpened) {
      if (event.node.selected) {
        pointerEvent.preventDefault();
      } else {
        this.router.navigate([path]);
        this.scrollView.instance.scrollTo(0);
      }

      if (this.hideMenuAfterNavigation) {
        this.temporaryMenuOpened = false;
        this.menuOpened = false;
        pointerEvent.stopPropagation();
      }
    } else {
      pointerEvent.preventDefault();
    }
  }

  navigationClick() {
    if (this.showMenuAfterClick) {
      this.temporaryMenuOpened = true;
      this.menuOpened = true;
    }
  }
}

@NgModule({
  imports: [ SideNavigationMenuModule, DxDrawerModule, HeaderModule, DxToolbarModule, DxScrollViewModule, CommonModule ],
  exports: [ SideNavInnerToolbarComponent ],
  declarations: [ SideNavInnerToolbarComponent ]
})
export class SideNavInnerToolbarModule { }
