export class transaccion{
    idTransaccion:number
    fecha_transaccion:string
    fecha_mov:string
    sucursal:string
    bodega:string
    tipo_transaccion:string
    totalsuma:number
    documento:string
    producto:string
    cajas:number
    piezas:number
    usu_autorizado:string
    usuario:string
    observaciones:string
    factPro:string
    valor:number
    cliente:string
    proveedor:string
    orden_compra:number
    cantM2:number
    movimiento:number
   /*  marca_temporal:Date = new Date()
    fecha:Date
    sucursal:string
    transaccion:string
    documento:string
    producto:string
    cajas:number
    piezas:number */
    constructor(){
        this.valor=0
    }
}