import { OperacionComercial } from "../reciboCaja/recibo-caja"

export class ComprobantePago{
    idDocumento: number
    fecha: Date
    documento: string
    centroCosto: string
    usuario: string
    sucursal: string
    beneficiario: string
    proveedor: string
    ruc: string
    telefono: string
    total:number
    observaciones:string
    estadoComprobante: string
    operacionesComercialesList: Array<OperacionComercial>
    constructor(){
        this.total = 0;
        this.observaciones = "";
        this.fecha = new Date();
        this.estadoComprobante = "Activo";
    }
}




