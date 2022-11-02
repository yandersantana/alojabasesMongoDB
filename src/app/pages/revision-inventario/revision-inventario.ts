export class controlInventario{
  _id: string
  sucursal: string
  idDocumento: number
  responsable: string
  nombreClasificacion: string
  fecha_inicio: Date
  estado: string
  notas: string
  constructor(){
    this.fecha_inicio = new Date()
    this.estado="Iniciada"
    this.responsable = " "
    this.nombreClasificacion = " "
    this.sucursal = " "
    this.notas = " "
  }
}



export class detalleProductoRevisado{
  _id: string
  idReferenciaRevision: number
  producto: string
  fecha: Date
  estado: string
  detalle : string
  novedades : string
  cajas : number
  piezas : number
  m2_conteo : number
  cajas_sistema : number
  piezas_sistema : number
  m2_sistema : number
  cajas_diferencia : number
  piezas_diferencia : number
  m2_diferencia : number
  resultado : string
  estadoRevision : string
  constructor(){
    this.fecha = new Date()
    this.estado="Iniciada"
    this.cajas = 0
    this.piezas = 0
    this.m2_conteo = 0
    this.m2_diferencia = 0
    this.m2_diferencia = 0
    this.cajas_diferencia = 0
    this.cajas_sistema = 0
    this.piezas_diferencia = 0
    this.piezas_sistema = 0
    this.estadoRevision = "Pendiente"
  }
}



export class comparacionResultadosRevision{
  _id: string
  idReferenciaRevision: number
  producto: string
  fecha: Date
  estado: string
  detalle : string
  novedades : string
  cajas_sistema : number
  piezas_sistema : number
  m2_sistema : number
  cajas_conteo : number
  piezas_conteo : number
  m2_conteo : number
  cajas_diferencia : number
  piezas_diferencia : number
  m2_diferencia : number
  resultado : string
  sucursal: string
  responsable: string
  nombreClasificacion: string
  estadoRevision: string
  constructor(){
    this.cajas_sistema = 0
    this.piezas_sistema = 0
    this.m2_sistema = 0
    this.cajas_conteo = 0
    this.piezas_conteo = 0
    this.m2_conteo = 0
    this.cajas_diferencia = 0
    this.piezas_diferencia = 0
    this.m2_diferencia = 0
  }
}



export class controlRevisionProductos{
  _id: string
  idReferenciaRevision: number
  producto: string
  diferenciaDias : string
  fecha: Date
  estado: string
  detalle : string
  novedades : string
  cajas_sistema : number
  piezas_sistema : number
  m2_sistema : number
  cajas_conteo : number
  piezas_conteo : number
  m2_conteo : number
  cajas_diferencia : number
  piezas_diferencia : number
  m2_diferencia : number
  resultado : string
  sucursal: string
  responsable: string
  nombreClasificacion: string
  constructor(){
    this.cajas_sistema = 0
    this.piezas_sistema = 0
    this.m2_sistema = 0
    this.cajas_conteo = 0
    this.piezas_conteo = 0
    this.m2_conteo = 0
    this.cajas_diferencia = 0
    this.piezas_diferencia = 0
    this.m2_diferencia = 0
    this.diferenciaDias = ""
  }
}
