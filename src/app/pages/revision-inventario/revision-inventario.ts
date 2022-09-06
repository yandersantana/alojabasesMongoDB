export class controlInventario{
  sucursal: string
  idDocumento: number
  responsable: string
  nombreClasificacion: string
  fecha_inicio: Date
  estado: string
  constructor(){
    this.fecha_inicio = new Date()
    this.estado="Iniciada"
  }
}



export class detalleProductoRevisado{
  idReferenciaRevision: number
  producto: string
  fecha: Date
  estado: string
  detalle : string
  novedades : string
  cajas : number
  piezas : number
  constructor(){
    this.fecha = new Date()
    this.estado="Iniciada"
    this.cajas = 0
    this.piezas = 0
  }
}

