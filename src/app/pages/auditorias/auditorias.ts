import { producto } from '../ventas/venta'
import { Sucursal } from '../compras/compra'

export class auditoria{
  sucursal:Sucursal
  idAuditoria:number
  contrasena:string
  cantidad_productos:number
  fecha_inicio:Date
  estado:string
  fecha_fin:Date
  constructor(){
    this.fecha_inicio= new Date()
    this.fecha_fin= new Date()
    this.estado="Iniciada"
    this.cantidad_productos=0
  }

}




export class auditoriasProductos{
  idAud:string
  fecha:Date
  sucursal:Sucursal
  producto:producto
  cajas_sistema: number
  piezas_sistema: number
  cajas_fisico:number
  piezas_fisico: number
  cajas_danadas: number
  piezas_danadas: number
  valoracion:string
  observaciones:string
  constructor(){
    this.cajas_danadas=0
    this.cajas_fisico=0
    this.cajas_sistema=0
    this.piezas_danadas=0
    this.piezas_fisico=0
    this.piezas_sistema=0
  }

}