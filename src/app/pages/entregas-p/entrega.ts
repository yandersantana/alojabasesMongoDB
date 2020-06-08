import { productosPendientesEntrega } from '../ventas/venta'


export class entregaProductos{
    id_documento:number
    productoPorEntregar: productosPendientesEntrega
    cajas:number
    piezas:number
    m2:number
    fecha:string
    identrega:number
    estado:string
    constructor(){
        this.fecha= new Date().toLocaleString()
        this.estado="ENTREGADO"
    }
}

export class documentoGenerado{
    idDocumento:number
    Ndocumento:number
    tipoDocumento:string
    arreEntregas:entregaProductos[]=[]
    fecha:string
    fechaEntrega:string
    observaciones:string
    estado:string
    constructor(){
        this.estado="ENTREGADO"
    }
}