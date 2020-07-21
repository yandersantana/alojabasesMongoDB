import { dxNumberBoxOptions } from 'devextreme/ui/number_box'
import { producto } from '../ventas/venta'

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
    ubicacionSuc1:string[]=[]
        ubicacionSuc2:string[]=[]
        ubicacionSuc3:string[]=[]
   /*  sucursal1:number
    sucursal2:number
    sucursal3:number */
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
        this.total=0
    }
}
export class ProductoDetalleCompra{
    seleccionado:boolean
    iva:boolean
    nombreComercial:producto
    rotacion:number
    disponible:number
    precio_cos:number
    cantidad:number
    REFERENCIA: string
    precio_compra:number
    desct:number
    total:number
    orden_compra:number
    solicitud_n:number
    subtotal:number
    subtIva:number
    subtDet:number
    subtDetP:number
    equivalencia:string
    descGeneral:number
    descProducto:number
    estado_remision:string
    constructor() {
        this.seleccionado = true
        this.iva = true
        this.equivalencia="0C 0P"
        this.cantidad=0
        this.total=0
        this.precio_compra=0
        this.descGeneral=0
        this.descProducto=0
        this.estado_remision=" "
    }
}



export class ProductoDetalleEntrega{ 
    nombreComercial:producto
    ubicacion:string
    cantidadEntregada:number
    cantidadEntregadapiezas:number
    metros2:number
    metros2Devueltos:number
    cantidadSolicitada:number
    cantidadSolicitadacajas:number
    cantidadSolicitadapiezas:number
    observaciones:string
    estado:string
    cantidadDevuelta:number
    cantidadDevueltapiezas:number
    causaDevolucion:string
    numeroOrden:number
    numeroRemision:number
    fecha:Date
    precio:number
    valorunitario:number
    valortotal:number
    estadoIngreso:string
    descuentoGeneral:number
    solicitud_compra:number
    descuentoProducto:number
    constructor() {
        this.cantidadEntregada=0
        this.cantidadEntregadapiezas=0
        this.observaciones= "S/O"
        this.cantidadDevuelta= 0
        this.cantidadDevueltapiezas= 0
        this.estado="Ok"
        this.descuentoProducto=0
        this.estadoIngreso="Ingresado"
        this.ubicacion=""
       
    }
}


export class RemisionProductos{
    num_orden:number
    num_FactPro:string
    fechaP: string
    num_remEnt:string
    fechaRecibo:string
    id_remision:number
    placa:string
    nombre_transportador:string
    nombre_recibe:string
    sucursal:string
    nombre_proveedor:string
    estado:string
    bodega:string
    msjAdmin:string
    total:number
    constructor(){
        this.estado="Ingresado"
        this.nombre_recibe=""
        this.msjAdmin=""
    } 
}


export class ControlProductos{
    nombre_comercial:string
    cantidadsolicitada:number
    cantidadSolicitadacajas:string
    cantidadSolicitadapiezas:string
    cantidadentregada:number
    cantidadentregadapiezas:number
    cantidadDevuelta:number
    cantidadDevueltapiezas:number
    saldo:number
    saldopiezas:number
    saldom2:number
    estado:string
    fecha:Date
    solicitud_orden:number
    constructor(){
        this.saldom2=0
    }
}

export class PrecioProductos{
    nombre_comercial:string
    fecha:Date
    precio:number
    n_orden:number
    constructor(){

    }
}

export class bodega{
    nombre:string
    persona_responsable:string
    id:number
    direccion:string
    sucursal:string
    constructor(){

    }
}


export class productosObsequio{
    cantidad:number
    cantidadpiezas:number
    cantidadM2:number
    producto:producto
    productoNombre:string
    idfactura:string
    proveedor:string
    fecha:string
    bloqueo:boolean
    constructor(){
        this.cantidadpiezas=0
        this.cantidadM2=0
        this.cantidad=0
        this.bloqueo=true
    }
}