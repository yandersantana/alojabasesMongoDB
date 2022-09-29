import { producto } from "../ventas/venta";

export class stockMinimo {
  producto: producto;
  cantidadCajas: number;
  cantidadPiezas: number;
  cantidadM2: number;
  fechaUltimaCompra: Date;
  nombreProveedor: string;
  constructor() {}
}

