import { __decorate } from "tslib";
import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxScrollViewModule } from 'devextreme-angular/ui/scroll-view';
let SingleCardComponent = class SingleCardComponent {
    constructor() { }
};
SingleCardComponent = __decorate([
    Component({
        selector: 'app-single-card',
        templateUrl: './single-card.component.html',
        styleUrls: ['./single-card.component.scss']
    })
], SingleCardComponent);
export { SingleCardComponent };
let SingleCardModule = class SingleCardModule {
};
SingleCardModule = __decorate([
    NgModule({
        imports: [CommonModule, DxScrollViewModule],
        exports: [SingleCardComponent],
        declarations: [SingleCardComponent]
    })
], SingleCardModule);
export { SingleCardModule };
//# sourceMappingURL=single-card.component.js.map