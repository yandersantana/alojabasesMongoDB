

export class CodDescuento{
     _id: string
    codigo : string
    estado : string
    generadoPor : string

    constructor(){
        this.estado = "Activo"  //Cancelada cuando se establezca el pago
    }
}

