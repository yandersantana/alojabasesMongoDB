import { ProductoDetalleCompra } from '../producto/producto'

export class compra{
    cantidad:number
    contacto:string
    fecha:Date
    porcentaje_ganancia:number
    precio:number
    producto:string
    referencia: string
}

export class OrdenDeCompra{
    _id:string
    fecha:string
    usuario:string
    usuarioAth:string
    fechaEntrega:string
    contacto:string
    documento:number
    proveedor:Proveedor
    sucursal:Sucursal
    lugarentrega:string
    condpago:string
    costeUnitaTransport:number
    otrosCostosGen:number
    otrosDescuentosGen:number
    observaciones:string
    total:number
    productoDetalle:ProductoDetalleCompra
    estado:string
    subtotal:number
    secuencia:string
    n_orden:number=0
    fechaAP:string
    msjAdmin:string
    msjGeneral:string
    subtotalIva:number
    subtotalDetalles:number
    subtDetalles2:number
    TotalIva:number
    tipo:string
    factPro:string
    estadoOrden:string
    estadoIngreso:string
    productosComprados:ProductoDetalleCompra[]=[]
    constructor(){
        //this.proveedor = new Proveedor()
        this.sucursal = new Sucursal()
        this.otrosCostosGen=0
        this.costeUnitaTransport=0
        this.usuarioAth=""
        this.tipo="Pedido"
        this.factPro=""
        this.estadoOrden=""
        this.msjGeneral=""
        this.estadoIngreso=""
       
        //this.productoDetalle=new ProductoDetalleCompra()
    }
}

export class Proveedor{
    _id:string
    nombre_proveedor:string
    ruc:string
    direccion:string
    celular:string
    contacto:string
    constructor(){
        //this.nombre_proveedor = ""
    }
}
export class Sucursal{
    sucursalTipo:string
    nombre:string
    nombreComercial:string
    contacto:string
    celular:string
    direccion:string

    constructor(){
        //this.nombre = ""
    }
}


export class Producto {
    _id:string
    CAL: string
    CASA: string
    CLASIFICA: string
    ESTADO: string
    M2: number
    P_CAJA: number
    PRODUCTO: string
    REFERENCIA: string
    DIMENSION: string
    UNIDAD: string
    APLICACION: string
    cantidad: number
    IMAGEN_PRINCIPAL: string
    precio: number
    porcentaje_ganancia: number
    nombre_comercial:string
    sucursal1:number
    sucursal2:number
    sucursal3:number
    suc1Pendiente:number
    suc2Pendiente:number
    suc3Pendiente:number
    ubicacionSuc1:string[]=[]
    ubicacionSuc2:string[]=[]
    ubicacionSuc3:string[]=[]
    notas:string[]=[]
    bodegaProveedor:number
    ultimoPrecioCompra:number
    ultimaFechaCompra:string
    precio1:number
    precio2:number
    precio3:number
    constructor(
        ) {
}
}
