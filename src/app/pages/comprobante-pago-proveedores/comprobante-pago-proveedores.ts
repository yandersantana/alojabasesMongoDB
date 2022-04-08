
export class FacturasAPagar{
    numFactura: number
    valor: number
    valorAbonado: number
    saldos: number
    valorCancelar: number
    estado: string
    observaciones:string
    constructor(){
        this.valor = 0;
        this.valorAbonado = 0;
        this.saldos = 0;
        this.valorCancelar = 0;
        this.observaciones = "";
    }
}

export class ComprobantePagoProveedor{
    idDocumento : number
    fechaComprobante : Date
    giradoA : string
    usuario : string
    referencia : string
    nombreProveedor : string
    sucursal : string
    estadoComprobante : string
    transaccionesFacturas : TransaccionesFacturas []
    transaccionesCheques : TransaccionChequesGirado []
    constructor(){
        this.fechaComprobante = new Date
        this.estadoComprobante = "Activo"
    }
}



export class TransaccionChequesGirado{
    idComprobante: string
    idPago : number
    numCheque: number
    banco : string
    cuenta : string
    fechaPago : string
    fechaPagoDate : Date
    valor : number
    facturas : string
    proveedor: string
    usuario: string
    estado: string
    observaciones: string
    constructor(){
        this.valor = 0;
        this.estado = "Cubierto"
        this.observaciones = "";
    }
}


export class TransaccionesFacturas{
    idComprobante: string
    idFactura: string
    numFactura: number
    fechaFactura : Date
    valorFactura : number
    valorCancelado : number
    valorAbonado : number
    valorSaldos: number
    numCheque : string
    banco : string
    cuenta : string
    fechaPago : string
    proveedor: string
    usuario: string
    estado: string
    observaciones: string
    constructor(){
        this.valorFactura = 0;
        this.valorCancelado = 0;
        this.valorAbonado = 0;
        this.observaciones = "";
        this.estado = "Pendiente";
    }
}


