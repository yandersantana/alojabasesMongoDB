import { Producto } from '../producto/producto'

export class Factura{
    fecha:Date
    vendedor:string
    documento:number
    cliente:Cliente
    costeTransporte:number
    observaciones:string
    total:number = 0 
    constructor(){
        this.cliente = new Cliente()
    }
}

export class NotaVenta{
    fecha:Date
    vendedor:string
    documento:number
    cliente:Cliente
    costeTransporte:number
    observaciones:string
    total:number = 0 
    constructor(){
        this.cliente = new Cliente()
    }
}
export class Cotizacion{
    fecha:Date
    vendedor:string
    documento:number
    cliente:Cliente
    costeTransporte:number
    observaciones:string
    total:number = 0 
    constructor(){
        this.cliente = new Cliente()
    }
}

export class Cliente{
    nombre:string
    ruc:string
    direccion:string
    tcliente:number
    tventa:number
    celular:string

    constructor(){
        this.nombre = ""
    }
}
