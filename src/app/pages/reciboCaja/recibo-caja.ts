import { SubCuenta } from "../administracion-cuentas/administracion-cuenta"

export class ReciboCaja{
    idDocumento: number
    fecha: string
    docVenta: string
    cliente: string
    ruc: string
    sucursal: string
    tipoPago: string
    numDocumento: string
    banco: string
    valorFactura: number
    valorRecargo: number
    valorPagoEfectivo: number
    valorOtros: number
    valorSaldos:number
    observaciones: string
    operacionesComercialesList: Array<OperacionComercial>
    constructor(){
        this.valorFactura = 0;
        this.valorOtros = 0;
        this.valorPagoEfectivo = 0;
        this.valorRecargo = 0;
        this.valorSaldos = 0;
    }
}

export class OperacionComercial{
    nombreCuenta: string
    idCuenta: string
    nombreSubcuenta: string
    idSubCuenta:string
    valor: number
    array: Array<SubCuenta>
    constructor(){
        this.valor = 0;
    }
}


export class TransaccionesFinancieras{
    _id: string
    fecha: Date
    sucursal: string
    cliente: string
    rCajaId: string
    documentoVenta: string
    numDocumento: string
    valor : number
    tipoPago: string
    cuenta: string
    subCuenta: string
    soporte: string
    dias: number
    vencimiento: string
    notas: string
    constructor(){

    }
}


