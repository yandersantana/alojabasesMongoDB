export class CuentaPorPagar{
     _id: string
    fecha: Date
    sucursal: string
    beneficiario: string
    rucBeneficiario: string
    comprobanteId: string
    numDocumento: string
    valor : number
    notas: string
    estado: string
    constructor(){
        this.estado = "Activa"  //Cancelada cuando se establezca el pago
    }
}