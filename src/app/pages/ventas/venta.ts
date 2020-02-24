import { Producto } from '../producto/producto'

export class Factura{
    fecha:Date
    vendedor:string
    documento:string
    cliente:string
    costeTransporte:number
    observaciones:string
    total:number = 0 
    tcliente:String
    tventa:String
    ruc:string
    direccion:string
    celular:String
}

export class Cliente{
    nombre:string
    ruc:string
    direccion:string
}
