import { producto } from '../ventas/venta'


export class catalogo{
    _id:number
    PRODUCTO:string
    NOMBRE_PRODUCTO:string
    CLASIFICA:string
    REFERENCIA:string
    UNIDAD:string
    DIM:string
    NOMBRE_COMERCIAL:string
    P_CAJA:number
    M2:number
    CAL:string
    CASA:string
    TIPO:string
    ORIGEN:string
    APLICACION:string
    VIGENCIA:string
    FEC_PRODUCCION:string
    CANT_MINIMA:number
    ESTADO:string
    notas:string
    porcentaje_ganancia:number
    IMAGEN:[]
    IMAGEN_PRINCIPAL:string
    estado2:string
    precio:number
    ubicacion1:string[]=[]
    ubicacion2:string[]=[]
    ubicacion3:string[]=[]

   
    constructor(){
            this.PRODUCTO="",
            this.CLASIFICA="",
            this.REFERENCIA="",
            this.UNIDAD="",
            this.DIM="",
            this.NOMBRE_COMERCIAL="",
            this.P_CAJA=0
            this.estado2="Activo"
            this.notas=""
    }
}


export class opcionesCatalogo{
    arrayClasificación: []
    arrayUnidades: []
    constructor(){

    }
}

export class comboProducto{
    nombreCombo:string
    cantidadProductos:number
    arrayProductos:productosCombo[]=[]
    precioVenta:number
    constructor(){
        this.precioVenta=0
    }
}

export class productosCombo{
    producto:producto
    nombreProducto:string
    cantidad:number
    precioMin:number
    costo:number
    precioCombo:number
    precioVenta:number
    calculo:number
    constructor(){
        this.cantidad=1
    }
}