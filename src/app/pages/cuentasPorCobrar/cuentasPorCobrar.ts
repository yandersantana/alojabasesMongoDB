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
    tipoPago: string
    notas: string
    estado: string
    constructor(){
        this.estado = "Activa"  //Cancelada cuando se establezca el pago
    }
}

