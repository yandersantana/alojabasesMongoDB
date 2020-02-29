export class Producto{
    nombre : string
    clasificacion:string
    referencia: string
    unidad:string	
    dimension:string
    p_caja:number
    m_caja: number
    calidad: number
    casa: string
    cod_Bar: string
    image: string
    homologacion : string
    estado: string
    marca:string
    usuario:string
    nombreComercial:string
}

export class ProductoDetalleVenta{
    seleccionado:boolean
    iva:boolean
    nombreComercial:string
    disponible:number
    precio_min:number
    cantidad:number
    equivalencia:string
    precio_venta:number
    total:number
    pedir:boolean
    entregar:boolean
    factura:number
    constructor() {
        this.seleccionado = true
        this.iva = true
        this.pedir =false
        this.entregar=true
        this.cantidad=1
    }
}
export class ProductoDetalleCompra{
    seleccionado:boolean
    iva:boolean
    nombreComercial:string
    rotacion:number
    disponible:number
    precio_cos:number
    cantidad:number
    precio_comercial:number
    dto:number
    total:number
    orden_compra:number
    constructor() {
        this.seleccionado = true
        this.iva = true
        
        this.cantidad=1
    }
}