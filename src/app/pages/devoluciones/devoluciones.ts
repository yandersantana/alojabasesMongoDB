import { producto, sucursal } from "../ventas/venta";
import { Sucursal } from "../compras/compra";

export class devolucion {
  cliente: string;
  usuario: string;
  observaciones: string;
  sucursal: Sucursal;
  fecha: Date;
  fecha_transaccion: string;
  id_devolucion: number;
  totalDevolucion: number;
  num_documento: number;
  tipo_documento: string;
  estado: string;
  productosDevueltos: productosDevueltos[] = [];
  constructor() {
    this.usuario = "";
    this.estado = "Pendiente";
  }
}

export class productosDevueltos {
  producto: producto;
  cantFactCajas: number;
  cantFactPiezas: number;
  cantDevueltaCajas: number;
  REFERENCIA: string;
  cantDevueltaPiezas: number;
  cantDevueltam2: number;
  cantDevueltam2Flo: number;
  motivo: string;
  justificacion: string;
  devolucion_id: number;
  valorunitario: number;
  valorunitariopiezas: number;
  total: number;
  constructor() {
    this.cantDevueltaCajas = 0;
    this.cantDevueltaPiezas = 0;
    this.justificacion = "";
  }
}

export class tipoDocEliminacion {
  tipoDocumento: string;
  nroDocumento: string;
  constructor() {}
}
