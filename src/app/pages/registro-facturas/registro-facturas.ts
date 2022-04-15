export class Prestamos{
     _id: string
    fecha: Date
    sucursal: string
    cliente: string
    rucCliente: string
    documentoVenta: string
    numDocumento: string
    valor : number
    valorDeuda : number
    tipo_doc : string
    tipoPago: string
    notas: string
    estado: string
    fecha_deuda : Date
    beneficiario: string
    proveedor: string
    ruc: string
    telefono: string
    comprobanteId : string
    total:number
    observaciones:string

    constructor(){
        this.estado = "Activa"  //Cancelada cuando se establezca el pago
    }
}

