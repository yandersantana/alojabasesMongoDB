import { producto } from '../ventas/venta'

export class precios{

    aplicacion:string
    cant1:number
    percent1:number
    cant2:number
    percent2:number
    cant3:number
    percent3:number

    constructor(){
        this.cant1=0
        this.cant2=0
        this.cant3=0
        this.percent1=0
        this.percent2=0
        this.percent3=0
    }
}


export class preciosGrupoDefinido{
    producto:producto
    precio:number
    aplicacion:string
    cant1:number
    percent1:number
    pventa1:number
    cant2:number
    percent2:number
    pventa2:number
    cant3:number
    percent3:number
    pventa3:number

    constructor(){
        this.cant1=0
        this.cant2=0
        this.cant3=0
        this.percent1=0
        this.percent2=0
        this.percent3=0
    }
}


export class preciosEspeciales{
    precioSocio:number
    precioDistribuidor:number
    constructor(){
        this.precioDistribuidor=0
        this.precioSocio=0
    }
}