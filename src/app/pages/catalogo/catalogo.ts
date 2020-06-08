

export class catalogo{
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
    IMAGEN:[]
    IMAGEN_PRINCIPAL:string
    estado2:string

   
    constructor(){
            this.PRODUCTO="",
            this.CLASIFICA="",
            this.REFERENCIA="",
            this.UNIDAD="",
            this.DIM="",
            this.NOMBRE_COMERCIAL="",
            this.P_CAJA=0
            this.estado2="Activo"
    }
}


export class opcionesCatalogo{
    arrayClasificación: []
    arrayUnidades: []
constructor(){

}
}