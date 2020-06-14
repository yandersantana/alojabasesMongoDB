import { __decorate } from "tslib";
import { Component, NgModule, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPanelModule } from '../user-panel/user-panel.component';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
let HeaderComponent = class HeaderComponent {
    constructor(authService) {
        this.authService = authService;
        this.menuToggle = new EventEmitter();
        this.menuToggleEnabled = false;
        this.userMenuItems = [{
                text: 'Salir',
                icon: 'runner',
                onClick: () => {
                    this.authService.logOut();
                }
            }];
        this.toggleMenu = () => {
            this.menuToggle.emit();
        };
    }
};
__decorate([
    Output()
], HeaderComponent.prototype, "menuToggle", void 0);
__decorate([
    Input()
], HeaderComponent.prototype, "menuToggleEnabled", void 0);
__decorate([
    Input()
], HeaderComponent.prototype, "title", void 0);
HeaderComponent = __decorate([
    Component({
        selector: 'app-header',
        templateUrl: 'header.component.html',
        styleUrls: ['./header.component.scss']
    })
], HeaderComponent);
export { HeaderComponent };
let HeaderModule = class HeaderModule {
};
HeaderModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            DxButtonModule,
            UserPanelModule,
            DxToolbarModule
        ],
        declarations: [HeaderComponent],
        exports: [HeaderComponent]
    })
], HeaderModule);
export { HeaderModule };
//# sourceMappingURL=header.component.js.map