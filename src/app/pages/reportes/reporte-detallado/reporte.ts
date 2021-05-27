export class reporteDetallado {
  fecha: Date;
  VDiariaMatriz: number;
  DevDiariaMatriz: number;
  VDiariaSucursal1: number;
  DevDiariaSucursal1: number;
  VDiariaTotal: number;
  MatUBruta: number;
  MatPorcentaje: number;
  Suc1UBruta: number;
  Suc1Porcentaje: number;
  sumaTotal: number;
  validacionMatriz: number;
  validacionSucursal1: number;
  notas:string[]=[]

  constructor() {}
}

export class reporteGlobal {
  mes: string;
  numMes: number;
  VMesMatriz: number;
  VMesSucursal1: number;
  VMesTotal: number;
  PorcentajeMes:number;
  constructor() {}
}



export class reporteDetalladoCompras {
  fecha: Date;
  numMes: number;
  ComprasDiariasDirectas: number;
  ComprasDiariasIndirectas: number;
  comprasDiariasTotalDirectas: number;
  comprasDiariasTotalIndirectas: number;
  comprasDiariasTotales: number;
  constructor() {}
}


export class reporteGlobalCompras {
  mes: string;
  fecha: Date;
  numMes: number;
  ComprasMesDirectas: number;
  ComprasMesIndirectas: number;
  comprasMesTotal: number;
  constructor() {}
}

export class reporteGlobalIndicadores {
  mes: string;
  numMes: number;
  comprasTotales: number;
  ventasTotales: number;
  indDiferencia: number;
  constructor() {}
}