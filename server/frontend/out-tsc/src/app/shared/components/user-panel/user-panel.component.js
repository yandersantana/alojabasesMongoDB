import { __decorate } from "tslib";
import { Component, NgModule, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxListModule } from 'devextreme-angular/ui/list';
import { DxContextMenuModule } from 'devextreme-angular/ui/context-menu';
let UserPanelComponent = class UserPanelComponent {
    constructor(afAuth) {
        this.afAuth = afAuth;
        this.user = sessionStorage.getItem("user");
    }
};
__decorate([
    Input()
], UserPanelComponent.prototype, "menuItems", void 0);
__decorate([
    Input()
], UserPanelComponent.prototype, "menuMode", void 0);
UserPanelComponent = __decorate([
    Component({
        selector: 'app-user-panel',
        templateUrl: 'user-panel.component.html',
        styleUrls: ['./user-panel.component.scss']
    })
], UserPanelComponent);
export { UserPanelComponent };
let UserPanelModule = class UserPanelModule {
};
UserPanelModule = __decorate([
    NgModule({
        imports: [
            DxListModule,
            DxContextMenuModule,
            CommonModule
        ],
        declarations: [UserPanelComponent],
        exports: [UserPanelComponent]
    })
], UserPanelModule);
export { UserPanelModule };
//# sourceMappingURL=user-panel.component.js.map