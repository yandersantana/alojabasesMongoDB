import { producto } from '../ventas/venta'


export class baja{
    usuario:string
    observaciones:string
    sucursal:string
    fecha:string
    fecha_transaccion:string
    id_baja:number
    totalBajas:number
    estado:string
    constructor(){
        this.estado="Pendiente"
    }
}


export class productosBajas{
    producto:producto
    cantFactCajas:number
    cantFactPiezas:number
    causa:string
    justificacion:string
    baja_id:number
    valorunitario:number
    costo:number
    responsable:string
    valorunitariopiezas:number
    total:number
    cantbajam2:number
    constructor(){
        this.cantFactCajas=0
        this.cantFactPiezas=0
    }
}