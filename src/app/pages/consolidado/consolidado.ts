import { producto } from "../ventas/venta";

export class inventario {
  producto: producto;
  cantidadCajas: number;
  cantidadCajas2: number;
  cantidadCajas3: number;
  cantidadPiezas: number;
  cantidadPiezas2: number;
  cantidadPiezas3: number;
  valorUnitario: number;
  cantidadM2: number;
  cantidadM2b2: number;
  cantidadM2b3: number;
  totalb1: number;
  totalb2: number;
  totalb3: number;
  bodega: string;
  ultimoPrecioCompra: number;
  ultimaFechaCompra: string;
  ultimaFechaRevisionMatriz: Date;
  ultimaFechaRevisionSucursal1: Date;
  ultimaFechaRevisionSucursal2: Date;
  diasRestantesMatriz: string;
  diasRestantesSucursal1: string;
  diasRestantesSucursal2: string;
  notas: string[];
  execute: boolean;
  requiereActualizacion : string;
  porUtilidad : number;
  valorProducto : number;
  IMAGEN_PRINCIPAL : string;
  constructor() {}
}

export class invFaltanteSucursal {
  producto: producto;
  cantidadCajas: number;
  cantidadPiezas: number;
  cantidadM2: number;
  totalb1: number;
  sucursal: string;
  constructor() {}
}

export class productoTransaccion {
  nombre: string;
  fechaActual: Date;
  fechaAnterior: Date;
  constructor() {}
}

export class categorias{
  nombreClasificacion :string;
  constructor(){}
}

export class productoActualizable {
  producto: producto;
  suc1: number;
  suc2: number;
  suc3: number;
  constructor() {}
}

export class productoMultiple {
  array: string[];
  constructor() {}
}


export class productosPorFiltros {
  clasificacion: string;
  nombreCasa: string;
  nombreReferencia: string;
  constructor() {}
}


export class clasificacionActualizacion{
  nombreClasificacion : string;
  cantidadProductos : number;
  constructor(){

  }
}

export class productosPorFiltrosMultiple {
  clasificacion: string[];
  nombreCasa: string;
  nombreReferencia: string;
  constructor() {}
}
