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

