import { __decorate } from "tslib";
import { Component, NgModule, Input, ViewChild } from '@angular/core';
import { SideNavigationMenuModule, HeaderModule } from '../../shared/components';
import { DxDrawerModule } from 'devextreme-angular/ui/drawer';
import { DxScrollViewModule, DxScrollViewComponent } from 'devextreme-angular/ui/scroll-view';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
import { CommonModule } from '@angular/common';
import { navigation } from '../../app-navigation';
import { NavigationEnd } from '@angular/router';
let SideNavInnerToolbarComponent = class SideNavInnerToolbarComponent {
    constructor(screen, router) {
        this.screen = screen;
        this.router = router;
        this.menuItems = navigation;
        this.selectedRoute = '';
        this.temporaryMenuOpened = false;
        this.menuMode = 'shrink';
        this.menuRevealMode = 'expand';
        this.minMenuSize = 0;
        this.shaderEnabled = false;
        this.toggleMenu = (e) => {
            this.menuOpened = !this.menuOpened;
            e.event.stopPropagation();
        };
    }
    ngOnInit() {
        this.menuOpened = this.screen.sizes['screen-large'];
        this.router.events.subscribe(val => {
            if (val instanceof NavigationEnd) {
                this.selectedRoute = val.urlAfterRedirects.split('?')[0];
            }
        });
        this.screen.changed.subscribe(() => this.updateDrawer());
        this.updateDrawer();
    }
    updateDrawer() {
        const isXSmall = this.screen.sizes['screen-x-small'];
        const isLarge = this.screen.sizes['screen-large'];
        this.menuMode = isLarge ? 'shrink' : 'overlap';
        this.menuRevealMode = isXSmall ? 'slide' : 'expand';
        this.minMenuSize = isXSmall ? 0 : 60;
        this.shaderEnabled = !isLarge;
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
            }
            else {
                this.router.navigate([path]);
                this.scrollView.instance.scrollTo(0);
            }
            if (this.hideMenuAfterNavigation) {
                this.temporaryMenuOpened = false;
                this.menuOpened = false;
                pointerEvent.stopPropagation();
            }
        }
        else {
            pointerEvent.preventDefault();
        }
    }
    navigationClick() {
        if (this.showMenuAfterClick) {
            this.temporaryMenuOpened = true;
            this.menuOpened = true;
        }
    }
};
__decorate([
    ViewChild(DxScrollViewComponent, { static: true })
], SideNavInnerToolbarComponent.prototype, "scrollView", void 0);
__decorate([
    Input()
], SideNavInnerToolbarComponent.prototype, "title", void 0);
SideNavInnerToolbarComponent = __decorate([
    Component({
        selector: 'app-side-nav-inner-toolbar',
        templateUrl: './side-nav-inner-toolbar.component.html',
        styleUrls: ['./side-nav-inner-toolbar.component.scss']
    })
], SideNavInnerToolbarComponent);
export { SideNavInnerToolbarComponent };
let SideNavInnerToolbarModule = class SideNavInnerToolbarModule {
};
SideNavInnerToolbarModule = __decorate([
    NgModule({
        imports: [SideNavigationMenuModule, DxDrawerModule, HeaderModule, DxToolbarModule, DxScrollViewModule, CommonModule],
        exports: [SideNavInnerToolbarComponent],
        declarations: [SideNavInnerToolbarComponent]
    })
], SideNavInnerToolbarModule);
export { SideNavInnerToolbarModule };
//# sourceMappingURL=side-nav-inner-toolbar.component.js.map