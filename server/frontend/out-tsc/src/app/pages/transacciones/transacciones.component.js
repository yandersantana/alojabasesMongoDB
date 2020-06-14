import { __decorate } from "tslib";
import { Component } from '@angular/core';
let TransaccionesComponent = class TransaccionesComponent {
    constructor(db, afAuth) {
        this.db = db;
        this.afAuth = afAuth;
        this.transacciones = [];
    }
    ngOnInit() {
        this.db.collection('/transacciones').valueChanges().subscribe((data) => {
            this.transacciones = data;
        });
    }
};
TransaccionesComponent = __decorate([
    Component({
        selector: 'app-transacciones',
        templateUrl: './transacciones.component.html',
        styleUrls: ['./transacciones.component.scss']
    })
], TransaccionesComponent);
export { TransaccionesComponent };
//# sourceMappingURL=transacciones.component.js.map