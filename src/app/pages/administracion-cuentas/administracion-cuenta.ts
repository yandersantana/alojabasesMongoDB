export class detalleCuenta{
    _id:string
    cuentas_List: Array<Cuenta>
    constructor(){
    }
}


export class Cuenta{
    _id:string
    nombre:string
    tipoCuenta:string
    sub_cuentaList: Array<SubCuenta>
    constructor(){
    }
}

export class SubCuenta{
    _id:string
    nombre:string
    idCuenta:string
    constructor(){
    }
}

export class CentroCosto{
    _id:string
    nombre:string
    constructor(){
    }
}

export class Beneficiario{
    _id:string
    nombre:string
    constructor(){
    }
}