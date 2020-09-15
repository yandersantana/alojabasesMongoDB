import { producto } from '../ventas/venta';


export class inventario{
    producto:producto
    cantidadCajas:number
    cantidadCajas2:number
    cantidadCajas3:number
    cantidadPiezas:number
    cantidadPiezas2:number
    cantidadPiezas3:number
    valorUnitario:number
    cantidadM2:number
    cantidadM2b2:number
    cantidadM2b3:number
    totalb1:number
    totalb2:number
    totalb3:number
    bodega:string
    ultimoPrecioCompra:number
    ultimaFechaCompra:string
    notas:string[]
    constructor(){

    }
}

export class invFaltanteSucursal{
    producto:producto
    cantidadCajas:number
    cantidadPiezas:number
    cantidadM2:number
    totalb1:number
    sucursal:string
    constructor(){

    }
}