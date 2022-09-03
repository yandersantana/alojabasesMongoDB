export class FacturaProveedor{
    _id:string
    fecha:Date
    fechaExpiracion:string
    nFactura:string
    nSolicitud:number
    total:number
    valorAbonado:number
    valorPagado:number
    valorDescuento:number
    proveedor:string
    productos:string[]
    estado:string
    estado2:string
    estado3:string
    estadoOrden:string
    idF:number
    documento_solicitud:number
    observaciones : string
    valorRestante : number
    constructor(){
        this.estado="PENDIENTE"
        this.estado2="Aceptada"
        this.estado3="Por ingresar"
        this.valorAbonado = 0;
        this.valorPagado = 0;
        this.valorDescuento = 0;
        this.observaciones = "";
    }
}

export class PagoProveedor{
    n_cheque:string
    fecha_transaccion:string
    fecha_factura: string
    nombre_banco: string
    n_cuenta:number
    fecha_pago: string
    valor:number=0
    beneficiario: string
    estado : string
    constructor(){}
}


export class DetallePagoProveedor{
    idPago:number
    n_cheque:string
    nombre_banco: string
    fact_proveedor: string
    beneficiario: string
    orden_compra:number
    fecha_vencimiento: string
    fecha_pago:string
    valor:number
    no_conformidad:number
    total:number
    observaciones:string
    id_factura:number
    estado:string
    constructor(){
        this.no_conformidad=0
        this.estado="Por Pagar"
    }
}