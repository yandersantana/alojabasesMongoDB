import { __decorate } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { Producto } from './producto';
let ProductoComponent = class ProductoComponent {
    constructor(db) {
        this.db = db;
        this.clasificaciones = ['Ceramica', 'Porcelanato', 'Inodoros'];
        this.uniMedida = ['Unidad', 'Metros2', 'Juego'];
        this.estadoAct = ['Activo', 'Inactivo',];
        this.producto = new Producto();
        this.items = db.collection('/productos').valueChanges();
        console.log(this.items);
    }
    ngOnInit() {
    }
    click(e) {
        if (this.dxForm.instance.validate().isValid) {
            this.db.collection('/productos').add(this.dxForm.formData).then(_ => { alert("Se ha añadido un producto"); this.dxForm.instance.resetValues(); });
        }
    }
};
__decorate([
    ViewChild("productoForm", { static: false })
], ProductoComponent.prototype, "dxForm", void 0);
ProductoComponent = __decorate([
    Component({
        selector: 'app-producto',
        templateUrl: './producto.component.html',
        styleUrls: ['./producto.component.css']
    })
], ProductoComponent);
export { ProductoComponent };
//# sourceMappingURL=producto.component.js.map