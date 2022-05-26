export class AgendaPago{
    fecha: Date
    banco1Nombre?: string
    valor1?: number 
    banco2Nombre?: string
    valor2?: number
    banco3Nombre?: string
    valor3?: number
    banco4Nombre?: string
    valor4?: number
    banco5Nombre?: string
    valor5?: number
    banco6Nombre?: string
    valor6?: number
    totalColumna? : number
    listaPagos : ArrayPagos []
    constructor(){
    } 
}


export class ArrayPagos{
    cuenta : string
    valor : number
    constructor(){
        this.valor = 0;
    }
}


export class Banco{
    nombre: string
    valor: number
    constructor(){
    }
}


export class Nota{
    fecha: Date
    descripcion: string
    tipo : string
    constructor(){
        
    }
}


