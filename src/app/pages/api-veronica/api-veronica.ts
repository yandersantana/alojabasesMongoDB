/* -------------------PROCESO FACTURACION VERONICA--------------------------------- */

export class FacturaModel{
    campoAdicional : CampoAdicionalModel[]
    detalles : ComprobanteDetalle[]
    codDoc : string
    estab : string
    fechaEmision : string
    moneda : string
    pagos : PagosModel[]
    ptoEmi : string
    receptor : ReceptorModel
    ruc : string
    secuencial : string
    version : string
    constructor(){
        this.campoAdicional = []
        this.detalles = []
        this.codDoc = "01"
        this.estab = "001"
        this.fechaEmision = ""
        this.moneda = "DOLAR"
        this.pagos = []
        this.ptoEmi = "001"
        this.receptor = new ReceptorModel()
        this.ruc = ""
        this.secuencial = ""
        this.version = "1.0.0"
    }
}


export class CampoAdicionalModel{
    nombre : string
    value : string
    constructor(){
        this.nombre = ""
        this.value = ""
    }
}


export class ComprobanteDetalle {
    cantidad : number
    codigoAuxiliar : string
    codigoPrincipal : string
    descripcion : string
    descuento : number
    detAdicional : DetAdicional[]
    impuesto : ImpuestoModel[]
    precioUnitario : number
    constructor(){
        this.cantidad = 0
        this.codigoAuxiliar = ""
        this.codigoAuxiliar = ""
        this.descripcion = ""
        this.descuento = 0
        this.detAdicional = []
        this.impuesto = []

    }
}


export class DetAdicional{
    nombre : string
    valor : string
    constructor(){
        this.nombre = ""
        this.valor = ""
    }
}


export class ImpuestoModel{
    baseImponible: number
    codigo: string
    codigoPorcentaje: string
    tarifa: number
    valor: number
    constructor(){
        this.baseImponible = 0
        this.codigo = "2"
        this.codigoPorcentaje = "2"
        this.tarifa = 0
        this.valor = 0
    }
}

export class PagosModel{
    formaPago : string
    plazo : string
    total : number
    unidadTiempo : string
    constructor(){
        this.formaPago = "01"  //DEFECTO CONTADO
        this.plazo = "0"
        this.total = 0
        this.unidadTiempo = "Dias"
    }
}

export class ReceptorModel{
    direccion : string
    identificacion : string
    propina : number
    razonSocial : string
    tipoIdentificacion : string
    constructor(){
        this.direccion = ""
        this.identificacion = ""
        this.propina = 0
        this.razonSocial = ""
        this.identificacion = ""
    }
}




// ----------------MODELO PARA OBTENCION DE CONSECUTIVO------------------


export class ConsecutivoDto{
    success : boolean
    result : Establecimiento[]
    constructor(){

    }
}

export class Establecimiento{
    establecimiento : EstablecimientoDto
}


export class EstablecimientoDto{
    id : string
    codigo : string
    direccion : string
    habilitado : boolean
    puntosEmision : PuntoEmision[]
    constructor(){

    }
}

export class PuntoEmision{
    id : string
    establecimientoId : string
    codigoPuntoEcodigoEstablecimiento : string
    codigoPuntoEmision : string
    habilitado : boolean
    secuencialFactura : string
    constructor(){

    }
}
