
export class DetalleCajaMenor {
  ID: number;
  OrderNumber: number;
  OrderDate: string;
  TotalIngresos: number;
  TotalSalidas: number;
  TotalRC: number;
  Sub1: string;
  Sub2: string;
  SubCuenta: string;
  Cuenta: string;
  Orden: number;
  Notas: string;
  constructor(){
      this.TotalIngresos = 0;
      this.TotalSalidas = 0;
      this.TotalRC = 0;
      this.Notas = ""
  }
}

export class CajaMenor{
    _id : string
    idDocumento : number;
    fecha: Date;
    usuario: string
    sucursal: string
    estado: string
    totalIngresos: number;
    totalSalidas: number;
    totalRC: number;
    resultado: number;
    estadoCaja: string;
    constructor(){    
        this.estado = "Abierto"   //Cerrada
        this.totalIngresos = 0;
        this.totalSalidas = 0;
        this.totalRC = 0;
    }
}

export class FormatoImpresion{
    nombreCuenta : string
    listaSubCuentas : Array<DetalleCajaMenor>
    constructor(){

    }
}