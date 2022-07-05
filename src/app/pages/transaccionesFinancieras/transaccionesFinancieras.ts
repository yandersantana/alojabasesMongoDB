export class TransaccionesFinancieras{
    _id: string
    fecha: Date
    sucursal: string
    cliente: string
    rCajaId: string
    documentoVenta: string
    numDocumento: string
    cedula: string
    valor : number
    tipoPago: string
    cuenta: string
    subCuenta: string
    soporte: string
    dias: number
    vencimiento: string
    notas: string
    tipoCuenta: string
    tipoTransaccion : string
    id_documento : number
    isContabilizada : boolean
    referenciaPrestamo : string
    beneficiario : string
    proveedor : string
    centroCosto : string
    ordenCompra : number
    numFactura : string
    constructor(){
        this.isContabilizada = true;
    }
}
