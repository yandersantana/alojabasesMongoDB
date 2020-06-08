import { producto } from '../ventas/venta';


export class devolucion{
    cliente:string
    usuario:string
    observaciones:string
    sucursal:string
    fecha:string
    fecha_transaccion:string
    id_devolucion:number
    totalDevolucion:number
    num_documento:number
    tipo_documento:string
    estado:string
    constructor(){
        this.usuario="q@q.com"
        this.estado="Pendiente"
    }
}

export class productosDevueltos{
    producto:producto
    cantFactCajas:number
    cantFactPiezas:number
    cantDevueltaCajas:number
    cantDevueltaPiezas:number
    cantDevueltam2:number
    cantDevueltam2Flo:number
    motivo:string
    justificacion:string
    devolucion_id:number
    valorunitario:number
    valorunitariopiezas:number
    total:number
    constructor(){
        this.cantDevueltaCajas=0
        this.cantDevueltaPiezas=0
        this.justificacion=""
    }
}