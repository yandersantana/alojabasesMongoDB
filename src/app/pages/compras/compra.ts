import { Producto } from '../producto/producto'

export class compra{
    cantidad:number
    contacto:string
    fecha:Date
    porcentaje_ganancia:number
    precio:number
    producto:string
}

export class OrdenDeCompra{
    fecha:Date
    fechaEntrega:Date
    contacto:string
    documento:number
    proveedor:Proveedor
    sucursal:Sucursal
    lugarentrega:string
    condpago:string
    costeUnitaTransport:number
    otrosCostosGen:number
    otrosDescuentosGen:number
    observaciones:string
    total:number
    constructor(){
        this.proveedor = new Proveedor()
    }
}

export class Proveedor{
    nombre:string
    ruc:string
    direccion:string
    celular:string

    constructor(){
        this.nombre = ""
    }
}
export class Sucursal{
    nombre:string
    contacto:string
    celular:string

    constructor(){
        this.nombre = ""
    }
}
