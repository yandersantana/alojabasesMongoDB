export class Producto{
    nombre : string
    clasificacion:string
    referencia: string
    unidad:string	
    dimension:string
    nombre_comercial:string
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
    
}

export class ProductoDetalleVenta{
    seleccionado:boolean
    iva:boolean
    nombreComercial:string
    disponible:number
    precio_min:number
    cantidad:number
    equivalencia:number
    precio_venta:number
    total:number
    pedir:boolean
    entregar:boolean

    constructor() {
        this.seleccionado = true
        this.iva = true
        this.pedir =false
        this.entregar=true
    }
}