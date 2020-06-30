import { sucursal } from '../ventas/venta'
import { Sucursal } from '../compras/compra'


export class traslados{
    /* nombre_transportista:string
    identificacion:string
    celular:string
    tipo_vehiculo:string
    placa:string */
    idT:number
    transportista:transportista
    sucursal_origen:Sucursal
    bodega_origen:string
    sucursal_destino:Sucursal
    bodega_destino:string
    observaciones:string
    fecha:string
    estado:string
    usuario:string
    detalleTraslados:detalleTraslados[]=[]
    constructor(){
        this.estado="Listo"
       // this.sucursal_origen= new sucursal
    }

}

export class detalleTraslados{
    cajas:number
    piezas:number
    producto:string
    tipo:string
    id:number
    observaciones:string
    cantidadm2:number
    constructor(){
        this.cajas=0
        this.piezas=0
        this.tipo=" "
        this.observaciones=""
    }
}

export class transportista{
    _id:string
    nombre:string
    identificacion:string
    celular:string
    placa:string
    vehiculo:string
    constructor(){

    }
}

export class productosSucursal{
    productos:[]
    constructor(){

    }
}