export class CuentaPorCobrar{
     _id: string
    fecha: Date
    sucursal: string
    cliente: string
    rucCliente: string
    rCajaId: string
    documentoVenta: string
    numDocumento: string
    valor : number
    valorFactura : number
    tipo_doc : string
    tipoPago: string
    notas: string
    estado: string
    fecha_deuda : Date
    constructor(){
        this.estado = "Activa"  //Cancelada cuando se establezca el pago
    }
}

