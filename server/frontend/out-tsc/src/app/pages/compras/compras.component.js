import { __decorate } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { OrdenDeCompra } from './compra';
import { ProductoDetalleCompra } from '../producto/producto';
let ComprasComponent = class ComprasComponent {
    constructor(db, afAuth) {
        this.db = db;
        this.afAuth = afAuth;
        this.now = new Date();
        this.productos = [];
        this.proveedores = [];
        this.compras = [];
        this.productosComprados = [];
        this.newButtonEnabled = true;
        this.medida = "m2";
        this.anadirProducto = (e) => {
            this.newButtonEnabled = true;
            this.productosComprados.push(new ProductoDetalleCompra());
        };
        this.ct = "";
        this.ordenDeCompra = new OrdenDeCompra();
        this.ordenDeCompra.fecha = new Date();
        this.productosComprados.push(new ProductoDetalleCompra);
    }
    //se ejecuta apenas se carga la pantalla
    ngOnInit() {
        this.db.collection('/productos').valueChanges().subscribe((data) => {
            this.productos = data;
            this.generarNombresProductos();
            console.log(this.productos);
        });
        this.db.collection('/compras').valueChanges().subscribe((data) => {
            this.compras = data;
        });
        this.db.collection('/proveedores').valueChanges().subscribe((data) => {
            if (data != null)
                this.proveedores = data;
        });
        this.db.collection('/ordenesDeCompra').doc('matriz').valueChanges().subscribe(data => {
            console.log(data);
            if (data != null)
                this.ordenDeCompra.documento = data['n_factura'];
        });
        this.ordenDeCompra.contacto = this.afAuth.auth.currentUser.email;
    }
    stringIsNumber(s) {
        var x = +s; // made cast obvious for demonstration
        return x.toString() === s;
    }
    //VA A COGER SIEMPRE EL ULTIMO
    setSelectedProducto(i) {
        this.selected = i;
    }
    obtenerDatosDeProductoParaUnDetalle(e, i) {
        //se debe validar por e
        let compra;
        this.newButtonEnabled = false;
        compra = this.compras.filter(x => x.producto == e.value)[0];
        this.productosComprados[i].disponible = compra.cantidad;
        this.productosComprados[i].precio_comercial = compra.precio * compra.porcentaje_ganancia / 100 + compra.precio;
    }
    deleteProductoVendido(i) {
        if (this.productosComprados.length > 1) {
            this.productosComprados.splice(i, 1);
            this.calcularTotalFactura();
        }
        else {
            alert("Las facturas deben tener al menos un producto");
        }
    }
    setClienteData(e) {
        this.proveedores.forEach(element => {
            if (element.nombre == e.component._changedValue)
                this.ordenDeCompra.proveedor = element;
        });
    }
    carcularTotalProducto(e, i) {
        console.log(e);
        this.calcularTotalRow(i);
        this.calcularTotalFactura();
    }
    calcularTotalFactura() {
        this.ordenDeCompra.total = 0;
        this.productosComprados.forEach(element => {
            console.log(element.seleccionado);
            if (element.seleccionado)
                this.ordenDeCompra.total = element.total + this.ordenDeCompra.total;
        });
    }
    cambiarEstadoSeleccionado(e) {
        console.log(e);
        this.calcularTotalFactura();
    }
    calcularTotalRow(i) {
        this.productosComprados[i].total = this.productosComprados[i].cantidad * this.productosComprados[i].precio_comercial;
    }
    generarNombresProductos() {
        this.productos.forEach(element => {
            element.nombreComercial = element.clasificacion + " - " + element.nombre + " - " + element.dimension + " - " + element.calidad;
        });
    }
    generarSolicitudDeCompra(e) {
        //SE DEBE GRABAR EL ENCABEZADO DE LA FACTURA Y SU DETALLE EN LA BASE DE DATOS
        //validar todo 
        //grabar en usuarios
        //grabar en factura
        //grabar en productodetalle
        //transacciones
        if (this.comprasForm.instance.validate().isValid) {
            let grabar = true;
            this.proveedores.forEach(element => {
                if (element.ruc == this.ordenDeCompra.proveedor.ruc)
                    grabar = false;
            });
            new Promise((resolve, reject) => {
                if (grabar)
                    this.db
                        .collection("/proveedores")
                        .doc(this.ordenDeCompra.proveedor.ruc).set(Object.assign({}, this.ordenDeCompra.proveedor))
                        .then(res => { }, err => reject(err));
                this.db
                    .collection("/ordenesDeCompra")
                    .doc(this.ordenDeCompra.documento.toString()).set(Object.assign({}, this.ordenDeCompra))
                    .then(res => { }, err => reject(err));
                this.productosComprados.forEach(element => {
                    element.orden_compra = this.ordenDeCompra.documento;
                    this.db.collection("/productosComprados").add(Object.assign({}, element))
                        .then(res => { }, err => reject(err));
                    /*    this.transaccion = new transaccion()
                        this.transaccion.marca_temporal = new Date(this.transaccion.marca_temporal.getDate())
                        this.transaccion.fecha=this.factura.fecha
                        this.transaccion.sucursal="Milagro"
                        this.transaccion.documento=null
                        this.transaccion.producto=element.nombreComercial
                        this.transaccion.cajas=null
                        this.transaccion.piezas=element.cantidad*-1
              
                        this.db.collection("/transacciones")
                        .add({ ...this.transaccion })
                        .then(res => { }, err => reject(err));
              */
                });
            });
        }
    }
};
__decorate([
    ViewChild('comprasForm', { static: false })
], ComprasComponent.prototype, "comprasForm", void 0);
ComprasComponent = __decorate([
    Component({
        selector: 'app-compras',
        templateUrl: './compras.component.html',
        styleUrls: ['./compras.component.css']
    })
], ComprasComponent);
export { ComprasComponent };
//# sourceMappingURL=compras.component.js.map