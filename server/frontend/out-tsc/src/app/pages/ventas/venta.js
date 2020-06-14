export class producto {
    constructor() {
    }
}
export class venta {
    constructor() {
        this.pedir = false;
        this.iva = true;
        this.seleccionado = true;
        this.entregar = false;
        this.cantidad = 1;
        this.producto = new producto();
    }
}
export class cliente {
    constructor() { }
}
export class factura {
    constructor() {
        this.total = 0;
        this.cliente = new cliente();
    }
}
export class proveedor {
    constructor() { }
}
export class orden_compra {
    constructor() {
        this.proveedor = new proveedor();
    }
}
export class compra {
    constructor() {
    }
}
export class sucursal {
    constructor() {
    }
}
export class nota_venta {
    constructor() {
        this.total = 0;
        this.cliente = new cliente();
    }
}
export class cotizacion {
    constructor() {
        this.total = 0;
        this.cliente = new cliente();
    }
}
export class cotizado {
    constructor() {
    }
}
//# sourceMappingURL=venta.js.map