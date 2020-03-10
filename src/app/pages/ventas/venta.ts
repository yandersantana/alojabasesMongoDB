import { Producto } from '../producto/producto'


export class producto {
        CAL: string
        CASA: string
        CLASIFICA: string
        ESTADO: string
        M2: number
        P_CAJA: number
        PRODUCTO: string
        REFERENCIA: string
        UNIDAD: string
        constructor(
            ) {
    }
}

export class venta {
        cantidad: number
        disponible: number
        entregar: boolean
        equivalencia: string
        iva: boolean
        producto: producto
        pedir: boolean
        seleccionado: boolean
        precio_min: number
        precio_venta: number
        total: number
        tipo_documento_emitido: string
        factura_id : number
        constructor() {
        this.pedir = false
        this.iva = true
        this.seleccionado = true
        this.entregar = false
        this.cantidad = 1 
        this.producto = new producto()
    }
}

export class cliente {
        cliente_nombre: string
        t_cliente: string
        ruc: string
        direccion: string
        celular: string
        constructor(
            ) { }
}
export class factura {
        documento_n : number
        sucursal : sucursal
        fecha: Date
        total: number = 0
        username: string
        cliente: cliente
        tipo_venta: number
        observaciones: string
        coste_transporte: number
        constructor(
            ) { 
                this.cliente = new cliente()
    }
}



export class proveedor {
        proveedor_nombre: string
        ruc: string
        direccion: string
        celular: string
        constructor(
            ) { }
}

export class orden_compra {
        proveedor: proveedor
        fecha_entrega :Date
        sucursal: sucursal
        lugar_entrega: string
        cond_pago: string
        coste_unita_transporte: number
        otros_costos_gen: number
        otros_descuentos_gen: number
        total: number
        constructor(
            ) { 
                this.proveedor = new proveedor()
            }
}

export class compra {
        cantidad: number
        disponible: number
        rot: number
        producto: producto
        precio_costo: number
        precio_compra: number
        dcto: number
        total: number
        orden_compra: orden_compra
        constructor(
            ) { 
                
            }
}

export class sucursal {
        sucursal_nombre: string
        direccion: string
        constructor(
            ){

            }
    
}

export class nota_venta{
        fecha: Date
        total: number = 0
        vendedor: string
        cliente: cliente
        tipo_venta: number
        observaciones: string
        coste_transporte: number
        constructor(
            ){
                this.cliente = new cliente()
            }
    
}

export class cotizacion{
        fecha: Date
        total: number = 0
        vendedor: string
        cliente: cliente
        tipo_venta: number
        observaciones: string
        coste_transporte: number
        constructor(
            ){
                this.cliente=new cliente()
            }
}

export class cotizado {
        cantidad: number
        producto: producto
        precio_venta: number
        total: number
        cotizacion: cotizacion
        constructor(
            ){

            }
}
