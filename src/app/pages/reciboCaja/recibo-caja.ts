import { SubCuenta } from "../administracion-cuentas/administracion-cuenta"

export class ReciboCaja{
    idDocumento: number
    fecha: Date
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
    valorSaldos:number
    observaciones: string
    estadoRecibo: string
    tipoDoc: string
    operacionesComercialesList: Array<OperacionComercial>
    constructor(){
        this.docVenta = "";
        this.valorFactura = 0;
        this.valorPagoEfectivo = 0;
        this.valorRecargo = 0;
        this.valorSaldos = 0;
        this.observaciones = "";
        this.fecha = new Date();
        this.estadoRecibo = "Activo";
    }
}

export class OperacionComercial{
    tipoCuenta: string
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

export class dataDocumento{
    textoCombo : string
    nombreCliente : string
    rucCliente : string
    totalFactura : string
    valorInicialFactura : string
    _id : string
    fecha : Date
    fecha_deuda : Date
    sucursal : string
    num_documento : string
    tipo_documento : string
    constructor(){}
}




