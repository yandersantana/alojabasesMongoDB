import { producto } from '../ventas/venta'


export class infoprod{
  producto:string
  productoLeido:producto
  piezas:number
  metros:number
  cantidad:number
  disponibilidad:string
  fabrica:string
  ubicacion:string
  precioSocio:number
  precioDist:number
  precioCliente:number
  notas:string
  constructor(){
     this.cantidad=0
  }
}