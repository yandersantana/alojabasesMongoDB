import { producto } from '../ventas/venta'
import { Sucursal } from '../compras/compra'

export class auditoria{
  sucursal:Sucursal
  idAuditoria:number
  contrasena:string
  cantidad_productos:number
  fecha_inicio:string
  estado:string
  fecha_fin:string
  auditado:string
  constructor(){
    this.fecha_inicio= new Date().toLocaleDateString()
    //this.fecha_fin= new Date().toLocaleDateString()
    this.estado="Iniciada"
    this.cantidad_productos=0
    this.auditado= ""
  }

}




export class auditoriasProductos{
  _id:string
  idPrincipal:number
  auditado:string
  idAud:string
  fecha:string
  auditor:string
  ubicacion:string
  sucursal:Sucursal
  producto:producto
  nombreproducto:string
  cajas_sistema: number
  piezas_sistema: number
  cajas_fisico:number
  piezas_fisico: number
  cajas_danadas: number
  piezas_danadas: number
  cajas_diferencia: number
  piezas_diferencia: number
  valoracion:string
  observaciones:string
  m2base:number
  m2fisico:number
  m2daño:number
  m2diferencia:number
  impacto:number
  condicion:string
  impactoDanado:number
  constructor(){
    this.cajas_danadas=0
    this.cajas_fisico=0
    this.cajas_sistema=0
    this.piezas_danadas=0
    this.piezas_fisico=0
    this.piezas_sistema=0
    this.cajas_diferencia=0
    this.piezas_diferencia=0
    this.impacto=0
    this.condicion="OK"
    //this.ubicacion=""
  }

}