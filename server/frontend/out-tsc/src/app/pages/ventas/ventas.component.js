import { __awaiter, __decorate } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { factura, cliente, venta } from './venta';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
let VentasComponent = class VentasComponent {
    constructor(db, afAuth, alerts) {
        this.db = db;
        this.afAuth = afAuth;
        this.alerts = alerts;
        this.now = new Date();
        this.maxDate = new Date();
        this.minDate = new Date();
        this.productos = [];
        this.clientes = [];
        this.clientes2 = [];
        this.facturas = [];
        this.compras = [];
        this.productosVendidos = [];
        this.newButtonEnabled = true;
        this.medida = "m2";
        this.visibleCalculadora = false;
        this.pdf = new PdfMakeWrapper();
        this.dateToday = Date.now();
        this.totalcomprador = 0;
        this.anadirProducto = (e) => {
            this.newButtonEnabled = true;
            this.productosVendidos.push(new venta());
        };
        this.ct = "";
        this.factura = new factura();
        this.factura.fecha = new Date();
        this.maxDate = new Date(this.maxDate.setDate(this.maxDate.getDate() - 2));
        this.minDate = this.now;
        this.productosVendidos.push(new venta);
        this.sucursales = [];
    }
    //se ejecuta apenas se carga la pantalla
    ngOnInit() {
        this.getSucursales();
        this.getProductos();
        this.getFactureros();
        this.getClientes();
        this.getFacturas();
        this.db.collection('/compras').valueChanges().subscribe((data) => {
            this.compras = data;
        });
        //leo la variable de memoria almacenada con el usuario 
        //this.factura.cliente=new cliente()
        this.factura.username = sessionStorage.getItem('user');
        this.factura.cliente.tventa = "Normal";
        this.factura.cliente.t_cliente = "C1";
    }
    getSucursales() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.collection('factureros').snapshotChanges().subscribe((sucursales) => {
                sucursales.forEach((nt) => {
                    this.sucursales.push(nt.payload.doc.id);
                });
            });
            ;
        });
    }
    getProductos() {
        return __awaiter(this, void 0, void 0, function* () {
            //REVISAR OPTIMIZACION
            yield this.db.collection('productos').snapshotChanges().subscribe((productos) => {
                this.productos = [];
                productos.forEach((nt) => {
                    this.productos.push(nt.payload.doc.data());
                });
            });
            ;
        });
    }
    getFactureros() {
        return __awaiter(this, void 0, void 0, function* () {
            //REVISAR OPTIMIZACION
            yield this.db.collection('factureros').doc('matriz').snapshotChanges().subscribe((facturero) => {
                console.log(facturero.payload.data());
                this.factura.documento_n = facturero.payload.data()['n_factura'] + 1;
            });
            ;
        });
    }
    getClientes() {
        return __awaiter(this, void 0, void 0, function* () {
            //REVISAR OPTIMIZACION
            yield this.db.collection('clientes').snapshotChanges().subscribe((clientes) => {
                this.clientes = [];
                clientes.forEach((element) => {
                    this.clientes.push(element.payload.doc.data());
                });
            });
            ;
        });
    }
    getFacturas() {
        return __awaiter(this, void 0, void 0, function* () {
            //REVISAR OPTIMIZACION
            yield this.db.collection('facturas').snapshotChanges().subscribe((facturas) => {
                this.facturas = [];
                facturas.forEach((element) => {
                    this.facturas.push(element.payload.doc.data());
                });
            });
            ;
        });
    }
    verCalculadora(e) {
        this.visibleCalculadora = true;
        //console.log(this.productosVendidos[this.productosVendidos.length - 1].producto.REFERENCIA)
        if (this.productosVendidos[this.productosVendidos.length - 1].producto != undefined) {
            this.sePuedeCalcular = true;
        }
        else {
            this.sePuedeCalcular = true;
        }
    }
    stringIsNumber(s) {
        var x = +s; // made cast obvious for demonstration
        return x.toString() === s;
    }
    //VA A COGER SIEMPRE EL ULTIMO
    setSelectedProducto(i) {
        this.selected = i;
    }
    calcularMetros(e) {
        if (this.stringIsNumber(e.event.key)) { //on focus
            this.ct = this.ct + e.event.key;
            let tmp = this.productosVendidos[this.selected];
            this.productos.forEach(element => {
                if (element.REFERENCIA == tmp.producto.REFERENCIA) {
                    let metros = (element.M2 * tmp.cantidad) + (this.cantidadPiezas * element.M2 / element.P_CAJA);
                    this.valorEnM2 = metros;
                }
            });
        }
    }
    obtenerDatosDeProductoParaUnDetalle(e, i) {
        //se debe validar por e
        let compra;
        this.newButtonEnabled = false;
        compra = this.compras.filter(x => x.producto == e.value)[0];
        this.productosVendidos[i].disponible = compra.cantidad;
        this.productosVendidos[i].precio_min = compra.precio * compra.porcentaje_ganancia / 100 + compra.precio;
        this.calcularEquivalencia(e, i);
    }
    getClientNames() {
        let names = [];
        this.clientes.forEach(element => {
            names.push(element.cliente_nombre);
        });
        return names;
    }
    getClientRUC() {
        let clientesruc = [];
        this.clientes.forEach(element => {
            clientesruc.push(element.ruc);
        });
        return clientesruc;
    }
    deleteProductoVendido(i) {
        if (this.productosVendidos.length > 1) {
            this.productosVendidos.splice(i, 1);
            this.calcularTotalFactura();
        }
        else {
            alert("Las facturas deben tener al menos un producto");
        }
    }
    setClienteData(e) {
        this.clientes.forEach(element => {
            if (element.cliente_nombre == e.component._changedValue) {
                this.factura.cliente = element;
                this.factura.cliente.cliente_nombre = element.cliente_nombre;
                this.factura.cliente.direccion = element.direccion;
                this.factura.cliente.celular = element.celular;
                //this.factura.cliente.t_cliente="45"
            }
        });
        this.calcularTipoCliente();
    }
    buscarCliente(e) {
        console.log("entre por aqui");
        console.log("aquisi" + this.factura.cliente.ruc + " 2 " + this.factura.cliente.cliente_nombre);
        this.clientes.forEach(element => {
            if (element.ruc == this.factura.cliente.ruc) {
                this.factura.cliente = element;
                this.factura.cliente.cliente_nombre = element.cliente_nombre;
                this.factura.cliente.direccion = element.direccion;
                this.factura.cliente.celular = element.celular;
                this.mensaje = element.cliente_nombre;
                console.log("corazon333" + this.mensaje);
            }
        });
        this.calcularTipoCliente();
    }
    guardarDatosCliente() {
        this.getClientes();
        console.log("entre para guardar");
        console.log("entre y voy a calcular" + this.factura.cliente.ruc);
        this.clientes.forEach(element => {
            if (element.ruc == this.factura.cliente.ruc) {
                this.factura.cliente = element;
                console.log("entre y si encontrew");
            }
        });
    }
    //CALCULO DE TIPO DE CLIENTE
    calcularTipoCliente() {
        console.log("entre aqui a buscar facturas");
        let contador = 0;
        this.facturas.forEach(element => {
            if (element.dni_comprador == this.factura.cliente.ruc) {
                this.totalcomprador = this.totalcomprador + element.total;
                contador++;
            }
        });
        console.log("El total de ventas es" + this.totalcomprador);
        if (this.totalcomprador >= 0 && this.totalcomprador <= 100) {
            this.factura.cliente.t_cliente = "C" + contador;
        }
        else if (this.totalcomprador >= 101 && this.totalcomprador <= 500) {
            this.factura.cliente.t_cliente = "B" + contador;
        }
        else if (this.totalcomprador >= 501 && this.totalcomprador <= 1000) {
            this.factura.cliente.t_cliente = "A" + contador;
        }
        else if (this.totalcomprador >= 1001 && this.totalcomprador <= 3000) {
            this.factura.cliente.t_cliente = "AA" + contador;
        }
        else if (this.totalcomprador >= 3000) {
            this.factura.cliente.t_cliente = "AAA" + contador;
        }
        else {
            this.factura.cliente.t_cliente = "C";
        }
    }
    carcularTotalProducto(e, i) {
        console.log("ssssss");
        console.log(e);
        this.calcularTotalRow(i);
        this.calcularTotalFactura();
    }
    calcularDisponibilidadProducto(e, i) {
        this.productosSolicitados = this.productosVendidos[i].disponible - this.productosVendidos[i].cantidad;
        this.calcularTotalFactura();
        //this.alerts.setMessage('All the fields are required','error');
        if (this.productosVendidos[i].cantidad > this.productosVendidos[i].disponible) {
            //this.productosVendidos[i].cantidad=this.productosVendidos[i].disponible
            this.showModal(e, i);
            this.calcularEquivalencia(e, i);
            this.calcularTotalFactura();
            this.productosVendidos[i].pedir = true;
            //console.log("holasi"+this.showModal())
        }
        /* setTimeout(function () {
          console.log();
       }, 5000); */
    }
    calcularTotalFactura() {
        this.factura.total = 0;
        this.productosVendidos.forEach(element => {
            console.log(element.seleccionado);
            if (element.seleccionado)
                this.factura.total = element.total + this.factura.total;
        });
    }
    cambiarEstadoSeleccionado(e) {
        console.log(e);
        this.calcularTotalFactura();
    }
    calcularEquivalencia(e, i) {
        this.productos.forEach(element => {
            console.log(this.productosVendidos[i].producto.REFERENCIA);
            console.log(element.REFERENCIA);
            console.log(this.productosVendidos[i].cantidad);
            if (element.PRODUCTO == this.productosVendidos[i].producto.REFERENCIA) {
                let cajas = Math.trunc(this.productosVendidos[i].cantidad / element.M2);
                let piezas = Math.trunc(this.productosVendidos[i].cantidad * element.P_CAJA / element.M2) - (cajas * element.P_CAJA);
                this.productosVendidos[i].equivalencia = cajas + "C " + piezas + "P";
            }
        });
    }
    calcularTotalRow(i) {
        this.productosVendidos[i].total = this.productosVendidos[i].cantidad * this.productosVendidos[i].precio_venta;
        console.log("aqui estoy mostrandi");
        console.log(this.productosVendidos[this.productosVendidos.length - 1].cantidad);
        console.log(this.productosVendidos[this.productosVendidos.length - 1].precio_venta);
        console.log(this.productosVendidos[this.productosVendidos.length - 1].total);
    }
    showModal(e, i) {
        /* Swal.fire({
          title: 'Cantidad no disponible!',
          text: 'Desea hacer un pedido del producto?',
          icon: 'warning',
          confirmButtonText: 'Ok'
        }) */
        Swal.fire({
            title: 'Cantidad no disponible',
            text: "Desea hacer un pedido del producto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                Swal.fire('Producto solicitado!', 'Tu producto ha sido añadido con éxito', 'success');
                // For more information about handling dismissals please visit
                // https://sweetalert2.github.io/#handling-dismissals
            }
            else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelado!', 'Se ha cancelado su orden.', 'error');
                this.deleteProductoVendido(i);
            }
        });
    }
    /*generarNombresProductos() {
      this.productos.forEach(element => {
        element.nombreComercial = element.clasificacion + " - " + element.nombre + " - " + element.dimension + " - " + element.calidad
      });
    }
  */
    crearPDF() {
        const documentDefinition = this.getDocumentDefinition();
        pdfMake.createPdf(documentDefinition).open();
        /* const documentDefinition = this.getDocumentDefinition();
        this.pdf.add(documentDefinition);
      this.pdf.add("Hello world")
        try {
          this.pdf.create().download();
        } catch (err) {
          alert(err);
        } */ 
    }
    setearNFactura() {
        let nf = this.factura.documento_n;
        let num = ('' + nf).length;
        console.log("el numero es" + num);
        switch (num) {
            case 1:
                this.numeroFactura = "00000" + nf;
                break;
            case 2:
                this.numeroFactura = "0000" + nf;
                break;
            case 3:
                this.numeroFactura = "000" + nf;
                break;
            case 4:
                this.numeroFactura = "00" + nf;
                break;
            case 5:
                this.numeroFactura = "0" + nf;
                break;
            case 6:
                //this.numeroFactura= nf
                break;
            default:
        }
    }
    getDocumentDefinition() {
        //var fecha2 = this.datePipe.transform(new Date(),"dd-MM-yyyy");
        //console.log("holaaaa"+fecha2); 
        this.setearNFactura();
        sessionStorage.setItem('resume', JSON.stringify("jj"));
        return {
            content: [
                {
                    text: 'RESUME',
                    bold: true,
                    fontSize: 20,
                    alignment: 'center',
                    margin: [0, 0, 0, 20]
                }, {},
                {
                    columns: [
                        [{
                                columns: [{
                                        width: 300,
                                        text: "FORERO DELGADO JUAN ",
                                    },
                                    {
                                        width: 300,
                                        text: "FECHA:17/03/2020 ",
                                    },
                                ]
                            },
                            {
                                text: "RUC: 0961654563",
                            },
                            {
                                text: "Fecha de impresión: " + this.factura.fecha,
                            },
                            {
                                text: "Venta de materiales para acabados de construcción, porcelanatos, cerámicas ",
                            },
                            {
                                text: "Dirección: Av. Juan Montalvo entre Seminario y Olmedo 423 ",
                            },
                            {
                                text: "Teléfonos: 0986951573 - 0997975089 - Milagro ",
                            },
                            {
                                text: "Auto SRI 1124706493",
                            }, {
                                columns: [{
                                        width: 300,
                                        text: "FACTURA 001-001-000 ",
                                        bold: true,
                                        fontSize: 20,
                                    },
                                    {
                                        width: 300,
                                        text: "NO " + this.numeroFactura,
                                        color: 'red',
                                        bold: true,
                                        fontSize: 20,
                                    },
                                ]
                            },
                            {
                                columns: [{
                                        width: 300,
                                        text: "Fecha de Autorización 29 de Abril 2019 ",
                                    },
                                    {
                                        width: 300,
                                        text: "Vendedor: " + this.factura.username,
                                    },
                                ]
                            }, {
                                //Desde aqui comienza los datos del cliente
                                style: 'tableExample',
                                table: {
                                    widths: [100, 400],
                                    body: [
                                        [
                                            {
                                                stack: [
                                                    {
                                                        type: 'none',
                                                        bold: true,
                                                        ul: [
                                                            'Cliente',
                                                            'Contacto',
                                                            "Dirección",
                                                            "Teléfonos"
                                                        ]
                                                    }
                                                ]
                                            },
                                            [{
                                                    stack: [
                                                        {
                                                            type: 'none',
                                                            ul: [
                                                                '' + this.factura.cliente.cliente_nombre,
                                                                '' + this.factura.cliente.direccion,
                                                                '' + this.factura.cliente.direccion,
                                                                '' + this.factura.cliente.celular,
                                                            ]
                                                        }
                                                    ]
                                                },
                                            ],
                                        ]
                                    ]
                                }
                            },
                            //aqui termina
                            {
                                columns: [{
                                        width: 100,
                                        text: "Cliente ",
                                    },
                                    {
                                        width: 300,
                                        text: "" + this.factura.cliente.cliente_nombre,
                                        background: '#F1F2F3'
                                    },
                                ]
                            }, {
                                columns: [{
                                        width: 100,
                                        text: "Contacto ",
                                    },
                                    {
                                        width: 300,
                                        text: "" + this.factura.cliente.cliente_nombre,
                                        background: '#F1F2F3'
                                    },
                                ]
                            }, {
                                columns: [{
                                        width: 100,
                                        text: "Dirección ",
                                    },
                                    {
                                        width: 300,
                                        text: "" + this.factura.cliente.cliente_nombre,
                                        background: '#F1F2F3'
                                    },
                                ]
                            }, {
                                columns: [{
                                        width: 100,
                                        text: "Teléfonos ",
                                    },
                                    {
                                        width: 300,
                                        background: '#F1F2F3',
                                        text: "" + this.factura.cliente.cliente_nombre,
                                        fillColor: '#2361AE',
                                    },
                                ]
                            },
                            {
                                text: "Cliente : " + this.factura.cliente.cliente_nombre,
                                style: 'name'
                            },
                            {
                                text: "Contacto : " + this.factura.cliente.celular,
                            },
                            {
                                text: 'Dirección : ' + this.factura.cliente.t_cliente,
                            },
                            {
                                text: 'Teléfonos : ' + this.factura.cliente.direccion,
                            },
                        ],
                        []
                    ]
                },
                {
                    text: 'Skills',
                    style: 'header'
                },
            ], images: {
                mySuperImage: 'data:image/jpeg;base64,...content...'
            },
            info: {
                title: "this.resume.name" + '_RESUME',
                author: "this.resume.name",
                subject: 'RESUME',
                keywords: 'RESUME, ONLINE RESUME',
            },
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 20, 0, 10],
                    decoration: 'underline'
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                name: {
                    fontSize: 16,
                    bold: true
                },
                jobTitle: {
                    fontSize: 14,
                    bold: true,
                    italics: true
                },
                sign: {
                    margin: [0, 50, 0, 10],
                    alignment: 'right',
                    italics: true
                },
                tableHeader: {
                    bold: true,
                }
            }
        };
    }
    generarFactura(e) {
        //SE DEBE GRABAR EL ENCABEZADO DE LA FACTURA Y SU DETALLE EN LA BASE DE DATOS
        //validar todo 
        //grabar en usuarios
        //grabar en factura
        //grabar en productodetalle
        //transacciones
        //cliente: new cliente();
        this.factura.dni_comprador = this.factura.cliente.ruc;
        this.factura.cliente.cliente_nombre = this.mensaje;
        console.log("el arreglo de clientes tiene" + this.factura.cliente);
        //this.clientes2.push(this.factura.cliente)
        //const budgets = this.factura.cliente.map((obj)=> {return Object.assign({}, obj)});
        this.cliente3 = new cliente();
        this.cliente3.cliente_nombre = this.factura.cliente.cliente_nombre;
        this.cliente3.direccion = this.factura.cliente.cliente_nombre;
        this.cliente3.ruc = this.factura.cliente.cliente_nombre;
        this.cliente3.tventa = this.factura.cliente.cliente_nombre;
        this.cliente3.t_cliente = this.factura.cliente.cliente_nombre;
        console.log("ddddd" + this.cliente3.cliente_nombre);
        //this.factura.cliente=this.cliente3
        //const budgets = arrayOfBudget.map((obj)=> {return Object.assign({}, obj)});
        //this.factura.cliente = new cliente()
        console.log("Vamos a generar" + this.mensaje);
        console.log("voy a presentar " + this.factura.cliente.cliente_nombre + "ruc" + this.factura.cliente.ruc);
        console.log("Presentando antes de asignar...." + this.factura.cliente.cliente_nombre);
        this.factura.cliente.cliente_nombre = this.mensaje;
        console.log("Presentando..." + this.mensaje);
        console.log("Presentando despues de asignar...." + this.factura.cliente.cliente_nombre);
        //voy a probar
        console.log("Voy a guardar nombre" + this.factura.cliente.cliente_nombre);
        console.log("Voy a guardar ruc" + this.factura.cliente.ruc);
        console.log("Voy a guardar tcliente" + this.factura.cliente.t_cliente);
        console.log("Voy a guardar tventa" + this.factura.cliente.tventa);
        console.log("Voy a guardar celular" + this.factura.cliente.celular);
        console.log("Voy a guardar dni" + this.factura.dni_comprador);
        console.log("Voy a guardar username" + this.factura.username);
        console.log("Voy a guardar documenton" + this.factura.documento_n);
        console.log("Voy a guardar fecha" + this.factura.fecha);
        console.log("Voy a guardar total" + this.factura.total);
        //this.guardarDatosCliente()
        //Guardo cedula cliente para realizar calculo tipo cliente
        this.factura.dni_comprador = this.factura.cliente.ruc;
        if (this.ventasForm.instance.validate().isValid) {
            let grabar = true;
            this.clientes.forEach(element => {
                if (element.ruc == this.factura.cliente.ruc)
                    this.factura.cliente.cliente_nombre = element.cliente_nombre;
                grabar = false;
            });
            this.factura.cliente = this.factura.cliente;
            new Promise((resolve, reject) => {
                //      if(grabar)
                this.db
                    .collection("/clientes")
                    .doc(this.factura.cliente.ruc).set(Object.assign({}, this.factura.cliente))
                    .then(res => { }, err => reject(err));
                //console.log("los datos"+this.factura.cliente.cliente_nombre)
                this.db
                    .collection("/facturas")
                    .doc(this.factura.documento_n.toString()).set(Object.assign({}, Object.assign({}, this.factura)))
                    .then(res => { }, err => reject(err));
                this.db
                    .collection("/factureros")
                    .doc("matriz").set({ n_factura: this.factura.documento_n })
                    .then(res => { }, err => reject(err));
                /* this.productosVendidos.forEach(element => {
                  element.factura_id = this.factura.documento_n
                  console.log("aqui inicio"+element);
                  console.log("aqui inicio"+element.factura_id);
                  console.log("cantidad"+element.cantidad);
                  console.log("aqui inicio"+element.disponible);
                  console.log("aqui inicio"+element.entregar);
                  console.log("equivalencia"+element.equivalencia);
                  console.log("producto"+element.producto.REFERENCIA);
                  console.log("aqui inicio"+this.factura.cliente);
                  this.db.collection("/productosVendidos").add({ ... element})
                  .then(res => { }, err => reject(err)); */
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
                //});
            });
        }
        //window.location.reload();
        this.getFactureros();
        this.crearPDF();
    }
};
__decorate([
    ViewChild('ventasForm', { static: false })
], VentasComponent.prototype, "ventasForm", void 0);
__decorate([
    ViewChild("data2", { static: false })
], VentasComponent.prototype, "dataGrid", void 0);
VentasComponent = __decorate([
    Component({
        selector: 'app-ventas',
        templateUrl: './ventas.component.html',
        styleUrls: ['./ventas.component.css'],
        providers: [DatePipe]
    })
], VentasComponent);
export { VentasComponent };
/* generarCotizacion(e) {
   //SE DEBE GRABAR EL ENCABEZADO DE LA FACTURA Y SU DETALLE EN LA BASE DE DATOS
   //validar todo
   //grabar en usuarios
   //grabar en factura
   //grabar en productodetalle
   //transacciones
   if(this.ventasForm.instance.validate().isValid){
     let grabar = true
     this.clientes.forEach(element => {
       if(element.ruc == this.factura.cliente.ruc)
         grabar = false
     });

     new Promise<any>((resolve, reject) => {
       if(grabar)
         this.db
           .collection("/clientes")
           .doc(this.factura.cliente.ruc).set({ ...this.factura.cliente })
           .then(res => { }, err => reject(err));
       this.db
         .collection("/cotizaciones")
         .add({ ...this.factura })
         .then(res => { }, err => reject(err));
       this.productosVendidos.forEach(element => {
         /*this.db.collection("/productosVendidos")
         .doc(i.toString()).set({ ...element })
         .then(res => { }, err => reject(err));

         this.transaccion = new transaccion()
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

         i++*/
/*      });
    });
  }
      
  }
/*generarNotaDeVenta(e) {
  let i = 0
  //SE DEBE GRABAR EL ENCABEZADO DE LA FACTURA Y SU DETALLE EN LA BASE DE DATOS
  //validar todo
  //grabar en usuarios
  //grabar en factura
  //grabar en productodetalle
  //transacciones
  if(this.ventasForm.instance.validate().isValid){
    let grabar = true
    this.clientes.forEach(element => {
      if(element.ruc == this.factura.cliente.ruc)
        grabar = false
    });

    new Promise<any>((resolve, reject) => {
      if(grabar)
        this.db
          .collection("/clientes")
          .doc(this.factura.cliente.ruc).set({ ...this.factura.cliente })
          .then(res => { }, err => reject(err));
      this.db
        .collection("/notas_venta")
        .doc(i.toString()).set({ ...this.factura })
        .then(res => { }, err => reject(err));
      this.productosVendidos.forEach(element => {
        this.db.collection("/productosVendidos")
        .doc(i.toString()).set({ ...element })
        .then(res => { }, err => reject(err));

        /*this.transaccion = new transaccion()
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

        i++*/
/*    });
  });
}
  
}
}*/
//# sourceMappingURL=ventas.component.js.map