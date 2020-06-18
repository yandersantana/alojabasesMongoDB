import { __decorate } from "tslib";
import { Component, Input } from '@angular/core';
let CalculadoraComponent = class CalculadoraComponent {
    constructor() {
        this.visible = false;
    }
    ngOnInit() {
    }
    print() {
        console.log(this.visible);
    }
};
__decorate([
    Input()
], CalculadoraComponent.prototype, "visible", void 0);
CalculadoraComponent = __decorate([
    Component({
        selector: 'app-calculadora',
        templateUrl: './calculadora.component.html',
        styleUrls: ['./calculadora.component.css']
    })
], CalculadoraComponent);
export { CalculadoraComponent };
//# sourceMappingURL=calculadora.component.js.map