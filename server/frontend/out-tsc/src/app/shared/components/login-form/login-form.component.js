import { __decorate } from "tslib";
import { Component, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxCheckBoxModule } from 'devextreme-angular/ui/check-box';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxValidatorModule } from 'devextreme-angular/ui/validator';
import { DxValidationGroupModule } from 'devextreme-angular/ui/validation-group';
import { AngularFireModule } from 'angularfire2';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
let LoginFormComponent = class LoginFormComponent {
    constructor(authService, appInfo, spinner) {
        this.authService = authService;
        this.appInfo = appInfo;
        this.spinner = spinner;
        this.login = '';
        this.password = '';
    }
    onLoginClick(e) {
        this.spinner.show();
        if (!this.validateLogin.instance.validate().isValid) {
            return;
        }
        this.authService.logIn(this.login, this.password);
        this.validateLogin.instance.reset();
        this.spinner.hide();
    }
};
__decorate([
    ViewChild("validateLogin", { static: false })
], LoginFormComponent.prototype, "validateLogin", void 0);
LoginFormComponent = __decorate([
    Component({
        selector: 'app-login-form',
        templateUrl: './login-form.component.html',
        styleUrls: ['./login-form.component.scss']
    })
], LoginFormComponent);
export { LoginFormComponent };
let LoginFormModule = class LoginFormModule {
};
LoginFormModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            RouterModule,
            DxButtonModule,
            DxCheckBoxModule,
            DxTextBoxModule,
            DxValidatorModule,
            DxValidationGroupModule,
            AngularFireModule.initializeApp(environment.firebase),
            AngularFirestoreModule,
            AngularFireAuthModule,
            NgxSpinnerModule,
            BrowserAnimationsModule
        ],
        declarations: [LoginFormComponent],
        exports: [LoginFormComponent]
    })
], LoginFormModule);
export { LoginFormModule };
//# sourceMappingURL=login-form.component.js.map