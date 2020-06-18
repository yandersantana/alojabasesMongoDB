

export class FacturaProveedor{
    fecha:string
    fechaExpiracion:string
    nFactura:string
    nSolicitud:number
    total:number
    proveedor:string
    productos:string[]
    estado:string
    estado2:string
    estado3:string
    idF:number
    documento_solicitud:number
    constructor(){
      this.estado="PENDIENTE"
      this.estado2="Aceptada"
      this.estado3="Por ingresar"
       
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
    constructor(){

    }
}

export class DetallePagoProveedor{
    idPago:number
    n_cheque:string
    nombre_banco: string
    fact_proveedor: string
    beneficiario: string
    orden_compra:number
    fecha_vencimiento: string
    valor:number
    no_conformidad:number
    total:number
    observaciones:string
    id_factura:number
    constructor(){
        this.no_conformidad=0

    }
}