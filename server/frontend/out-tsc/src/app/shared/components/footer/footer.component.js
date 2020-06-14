import { __decorate } from "tslib";
import { Component, NgModule } from '@angular/core';
let FooterComponent = class FooterComponent {
};
FooterComponent = __decorate([
    Component({
        selector: 'app-footer',
        template: `
    <footer><ng-content></ng-content></footer>
  `,
        styleUrls: ['./footer.component.scss']
    })
], FooterComponent);
export { FooterComponent };
let FooterModule = class FooterModule {
};
FooterModule = __decorate([
    NgModule({
        declarations: [FooterComponent],
        exports: [FooterComponent]
    })
], FooterModule);
export { FooterModule };
//# sourceMappingURL=footer.component.js.map