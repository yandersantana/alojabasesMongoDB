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
    productosBaja:productosBajas[]=[]
    constructor(){
        this.estado="Pendiente"
    }
}


export class productosBajas{
    producto:producto
    REFERENCIA:string
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