import { Component, OnInit } from '@angular/core';
import { catalogo } from '../catalogo/catalogo';
import { CatalogoService } from 'src/app/servicios/catalogo.service';
import { ActivatedRoute } from '@angular/router';
import { producto } from '../ventas/venta';
import { ProductoService } from 'src/app/servicios/producto.service';

import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { element } from 'protractor';
import { ControlPreciosService } from 'src/app/servicios/control-precios.service';
import { PrecioEspecialService } from 'src/app/servicios/precio-especial.service';
import { preciosEspeciales, precios } from '../control-precios/controlPrecios';
import { infoprod } from '../info-productos/info-productos';
import DataSource from 'devextreme/data/data_source';
@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.scss']
})
export class ConsultasComponent implements OnInit {
  catalogoLeido:catalogo
  productoLeido:producto
  productosActivos:producto[]=[]
  productos:producto[]=[]
  productosCatalogo:catalogo[]=[]
  idProducto:string=""
  infoproducto: infoprod
  imagenes:string[]
  precios:precios[]=[]
  productos22: DataSource;
  nombre_producto:string
  preciosEspeciales:preciosEspeciales[]=[]

  constructor(public catalogoService: CatalogoService,public preciosEspecialesService:PrecioEspecialService,public preciosService:ControlPreciosService, private rutaActiva: ActivatedRoute,public productoService:ProductoService) {
    //this.idProducto = this.rutaActiva.snapshot.paramMap.get("id")
    this.infoproducto = new infoprod()
   }

  ngOnInit() {
    this.traerProductosCatalogo()
    this.traerPrecios()
    this.traerPreciosEspeciales()
    this.traerProductos()
  }

  traerProductosCatalogo(){
    const promesaUser = new Promise((res, err)=>{
    this.catalogoService.getCatalogo().subscribe(res => {
      this.productosCatalogo = res as catalogo[];
      //this.traerProductoId()
   })
  });
   
  }

  traerPrecios(){
    this.preciosService.getPrecio().subscribe(res => {
      this.precios = res as precios[];
   })
  }

  traerPreciosEspeciales(){
    this.preciosEspecialesService.getPrecio().subscribe(res => {
      this.preciosEspeciales = res as preciosEspeciales[];
   })
  }

  traerProductoId(){

    this.productoService.getProductobyId(this.idProducto).subscribe(res => {
      this.productoLeido = res as producto;
      this.cargarProductoTabla()
   })
  }

  traerProductos(){
    this.productoService.getProducto().subscribe(res => {
      this.productosActivos = res as producto[];
      this.llenarComboProductos()
   })
   
  }

  llenarComboProductos(){
    this.productosActivos.forEach(element=>{
      if(element.ESTADO == "ACTIVO"){
        this.productos.push(element)
      }
    })
    console.log("s "+this.productos.length)

    this.productos22 = new DataSource({  
      store: this.productos,  
      sort: [{ field: "PRODUCTO", asc: true }],    
    });
  }

  obtenerDatosDeProductoParaUnDetalle(){
    console.log("ddd"+this.nombre_producto)
    this.productosActivos.forEach(element=>{
      if(element.PRODUCTO == this.nombre_producto){
        this.productoLeido= element
      }
    })
    this.cargarProductoTabla()
  }

  cargarProductoTabla(){
    this.infoproducto.producto = this.productoLeido.PRODUCTO
    this.infoproducto.productoLeido = this.productoLeido
    this.infoproducto.piezas = this.productoLeido.P_CAJA
    this.infoproducto.metros = this.productoLeido.M2
    this.infoproducto.fabrica = ""
    this.infoproducto.disponibilidad = this.productoLeido.sucursal1+"M "+this.productoLeido.sucursal2+"S1 "+this.productoLeido.sucursal3+"S2 "+this.productoLeido.bodegaProveedor+"P "
    this.infoproducto.ubicacion = "Suc1 ("+this.productoLeido.ubicacionSuc1+") " +"Suc2 ("+this.productoLeido.ubicacionSuc2+") "+"Suc3 ("+this.productoLeido.ubicacionSuc3+") "

    
    this.productosCatalogo.forEach(element=>{
      if(element.PRODUCTO == this.infoproducto.producto ){
        this.infoproducto.notas= element.notas
        this.infoproducto.fabrica = element.CASA
        this.imagenes= element.IMAGEN
      }
    })
    this.infoproducto.cantidad=1
    this.infoproducto.precioCliente = this.infoproducto.productoLeido.precio
    this.precios.forEach(element=>{
      if(element.aplicacion == this.infoproducto.productoLeido.APLICACION){
        if(this.infoproducto.cantidad >0 && this.infoproducto.cantidad <=element.cant1){
          this.infoproducto.precioCliente = parseFloat((this.infoproducto.productoLeido.precio * element.percent1 / 100 + this.infoproducto.productoLeido.precio).toFixed(2))
          
        }
        if(this.infoproducto.cantidad >element.cant1 && this.infoproducto.cantidad <=element.cant2){
          this.infoproducto.precioCliente = parseFloat((this.infoproducto.productoLeido.precio * element.percent2 / 100 + this.infoproducto.productoLeido.precio).toFixed(2))
          
        }

        if(this.infoproducto.cantidad >element.cant2){
          this.infoproducto.precioCliente = parseFloat((this.infoproducto.productoLeido.precio * element.percent3 / 100 + this.infoproducto.productoLeido.precio).toFixed(2))
         
        }
      }
    })
     
  //precio distribuidor
  this.infoproducto.precioDist=parseFloat((this.infoproducto.productoLeido.precio * this.preciosEspeciales[0].precioDistribuidor / 100 + this.infoproducto.productoLeido.precio).toFixed(2))
  //precio socio
  this.infoproducto.precioSocio=parseFloat((this.infoproducto.productoLeido.precio * this.preciosEspeciales[0].precioSocio / 100 + this.infoproducto.productoLeido.precio).toFixed(2))
  }



  
  actualizarDato( event: any) {
     this.infoproducto.cantidad = event.target.textContent;
     this.precios.forEach(element=>{
      if(element.aplicacion == this.infoproducto.productoLeido.APLICACION){
        if(this.infoproducto.cantidad >0 && this.infoproducto.cantidad <=element.cant1){
          this.infoproducto.precioCliente = parseFloat((this.infoproducto.productoLeido.precio * element.percent1 / 100 + this.infoproducto.productoLeido.precio).toFixed(2))
          
        }
        if(this.infoproducto.cantidad >element.cant1 && this.infoproducto.cantidad <=element.cant2){
          this.infoproducto.precioCliente = parseFloat((this.infoproducto.productoLeido.precio * element.percent2 / 100 + this.infoproducto.productoLeido.precio).toFixed(2))
        }

        if(this.infoproducto.cantidad >element.cant2){
          this.infoproducto.precioCliente = parseFloat((this.infoproducto.productoLeido.precio * element.percent3 / 100 + this.infoproducto.productoLeido.precio).toFixed(2))
         
        }
      }
    })
   }

}
