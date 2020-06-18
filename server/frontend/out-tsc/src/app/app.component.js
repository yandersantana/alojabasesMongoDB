import { __decorate } from "tslib";
import { Component, HostBinding } from '@angular/core';
let AppComponent = class AppComponent {
    constructor(authService, screen, appInfo) {
        this.authService = authService;
        this.screen = screen;
        this.appInfo = appInfo;
        this.formatsDateTest = [
            'dd/MM/yyyy'
        ];
        this.dateNow = new Date();
        this.dateNowISO = this.dateNow.toISOString();
        this.dateNowMilliseconds = this.dateNow.getTime();
    }
    get getClass() {
        return Object.keys(this.screen.sizes).filter(cl => this.screen.sizes[cl]).join(' ');
    }
    isAutorized() {
        return this.authService.isLoggedIn;
    }
};
__decorate([
    HostBinding('class')
], AppComponent.prototype, "getClass", null);
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map