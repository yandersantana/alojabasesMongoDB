import { Producto, ProductoDetalleVenta } from '../producto/producto'


export class producto {
        _id:string
        CAL: string
        CASA: string
        CLASIFICA: string
        ESTADO: string
        M2: number
        P_CAJA: number
        PRODUCTO: string
        REFERENCIA: string
        UNIDAD: string
        APLICACION: string
        cantidad: number
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
        bodegaProveedor:number
        constructor(
            ) {
                this.REFERENCIA=""
    }
}

export class venta {
        cantidad: number
        disponible: number
        entregar: boolean
        equivalencia: string
        iva: boolean
        producto: producto
        pedir: boolean
        seleccionado: boolean
        precio_min: number
        REFERENCIA:string
        precio_venta: number
        total: number
        tipo_documento_emitido: string
        factura_id : number
        descuento: number
        subtotal:number=0
        tipoDocumentoVenta:string
        subtP2:number
        subtP1:number
        subtIva:number
        sucursal:string
        productosVendidos:ProductoDetalleVenta[]=[]
        constructor() {
        this.pedir = false
        this.iva = true
        this.seleccionado = true
        this.entregar = false
        this.cantidad = 0 
        this.descuento=0
        this.total=0
        this.producto = new producto()

    }
}

export class cliente {
        _id:string
        cliente_nombre: string
        ruc: string
        direccion: string
        celular: string
        tventa: string
        telefono:string
        correo:string
        nombreContacto:string
        direccionContacto:string
        ciudad:string
        celularContacto:string
        fechaNacimiento:string
        notas:string
        //datos Tributarios
        t_cliente: string
        regimen:string
        forma_pago:string
        dias_credito:number
        cupo_maximo:number
        tipoCliente:string
        estado:string
            constructor( ) { 
                this.telefono=""
                this.correo=""
                this.nombreContacto=""
                this.direccionContacto=""
                this.celularContacto=""
                this.fechaNacimiento=""
                this.notas=""
                this.regimen=""   
                this.forma_pago=""   
                this.estado=""   
                this.dias_credito=0   
                this.cupo_maximo=0   
            }          
}
export class factura {
        _id:string
        documento_n : number
        sucursal : string
        fecha: Date
        fecha2:string
        total: number = 0
        username: string
        cliente: cliente
        tipo_venta: string
        tipo_cliente: string
        observaciones: string
        coste_transporte: number=0
        dni_comprador:string
        totalDescuento:number=0
        tipoDocumento:string
        cotizacion:number
        subtotalF1:number
        subtotalF2:number
        totalIva:number
        totalDescuentos:number
        estado:string
        mensaje:string
        maestro:string
        rucFactura:string
        productosVendidos:venta[]=[]
        constructor(
            ) { 
                this.estado="CONTABILIZADA"
                this.mensaje=" "
                //this.cliente = new cliente()
    }
}



export class proveedor {
        proveedor_nombre: string
        ruc: string
        direccion: string
        celular: string
        constructor(
            ) { }
}

export class orden_compra {
        proveedor: proveedor
        fecha_entrega :Date
        sucursal: sucursal
        lugar_entrega: string
        cond_pago: string
        coste_unita_transporte: number
        otros_costos_gen: number
        otros_descuentos_gen: number
        total: number
        constructor(
            ) { 
                this.proveedor = new proveedor()
            }
}

export class compra {
        cantidad: number
        disponible: number
        rot: number
        producto: producto
        precio_costo: number
        precio_compra: number
        dcto: number
        total: number
        orden_compra: orden_compra
        referencia: string
        constructor(
            ) { 
                
            }
}

export class sucursal {
        sucursal_nombre: string
        direccion: string
        constructor(
            ){

            }
    
}

export class nota_venta{
        fecha: Date
        total: number = 0
        vendedor: string
        cliente: cliente
        tipo_venta: number
        observaciones: string
        coste_transporte: number
        constructor(
            ){
                this.cliente = new cliente()
            }
    
}

export class cotizacion{
        fecha: Date
        total: number = 0
        vendedor: string
        cliente: cliente
        tipo_venta: number
        observaciones: string
        coste_transporte: number
        n_documento:number
        venta: venta
        productos:Object
        producto: producto
        constructor(
            ){
                this.venta = new venta()
                //this.venta = new venta()
                //this.cliente=new cliente()
            }
}

export class cotizado {
        cantidad: number
        producto: producto
        precio_venta: number
        total: number
        cotizacion: cotizacion
        constructor(
            ){

            }
}


export class productosPendientesEntrega{
    id_Pedido:number
    fecha:string
    cliente:string
    celular	:string
    producto:producto	
    documento:number	
    sucursal:string	
    cajas:number
    piezas:number
    cantM2:number
    cajasPen:number
    piezasPen:number
    cantM2Pen:number
    cajasEntregadas:number
    piezasEntregadas:number
    m2Entregados:number
    valor_unitario:number	
    total:number
    usuario:string
    fechaEntrega:string
    estado:string
    tipo_documento:string
    constructor(){
        this.cajasEntregadas=0
        this.piezasEntregadas=0
        this.m2Entregados=0
    }

}



export class contadoresDocumentos{
    _id:string
    facturaMatriz_Ndocumento:number
    facturaSucursal1_Ndocumento:number
    facturaSucursal2_Ndocumento:number
    proformas_Ndocumento:number
    notasVenta_Ndocumento:number
    transacciones_Ndocumento:number
    ordenesCompra_Ndocumento:number
    ordenesCompraAprobadas_Ndocumento:number
    contFacturaProveedor_Ndocumento:number
    contRemisiones_Ndocumento:number
    contBajas_Ndocumento:number
    contTraslados_Ndocumento:number
    contDevoluciones_Ndocumento:number
    contDocumentoEntrega_Ndocumento:number
    contProductosPendientes_Ndocumento:number
    contProductosEntregadosSucursal_Ndocumento:number
    pagoProveedor_Ndocumento:number
    auditorias_Ndocumento:number
    constructor(){

    }
}