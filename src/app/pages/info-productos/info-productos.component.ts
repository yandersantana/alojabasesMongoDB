import { Component, OnInit } from '@angular/core';
import { catalogo } from '../catalogo/catalogo';
import { CatalogoService } from 'src/app/servicios/catalogo.service';
import { ActivatedRoute } from '@angular/router';
import { producto } from '../ventas/venta';
import { ProductoService } from 'src/app/servicios/producto.service';
import { infoprod } from './info-productos';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { element } from 'protractor';

@Component({
  selector: 'app-info-productos',
  templateUrl: './info-productos.component.html',
  styleUrls: ['./info-productos.component.scss']
})
export class InfoProductosComponent implements OnInit {
  catalogoLeido:catalogo
  productoLeido:producto
  productosActivos:producto[]=[]
  productosCatalogo:catalogo[]=[]
  idProducto:string=""
  infoproducto: infoprod
  imagenes:string[]

  constructor(public catalogoService: CatalogoService, private rutaActiva: ActivatedRoute,public productoService:ProductoService) {
    this.idProducto = this.rutaActiva.snapshot.paramMap.get("id")
    this.infoproducto = new infoprod()
   }

  ngOnInit() {
    this.traerProductosCatalogo()
    
  }

  traerProductosCatalogo(){
    const promesaUser = new Promise((res, err)=>{
    this.catalogoService.getCatalogo().subscribe(res => {
      this.productosCatalogo = res as catalogo[];
      this.traerProductoId()
   })
  });
   
  }

  traerProductoId(){

    this.productoService.getProductobyId(this.idProducto).subscribe(res => {
      this.productoLeido = res as producto;
      this.cargarProductoTabla()
   })
  }

  traerProductos(){
    this.productoService.getProducto().subscribe(res => {
      this.productoLeido = res as producto;
   })
   //this.cargarProductoTabla()
  }

  cargarProductoTabla(){
    this.infoproducto.producto = this.productoLeido.PRODUCTO
    this.infoproducto.piezas = this.productoLeido.P_CAJA
    this.infoproducto.metros = this.productoLeido.M2
    this.infoproducto.fabrica = ""
    this.infoproducto.disponibilidad = this.productoLeido.sucursal1+"M "+this.productoLeido.sucursal2+"S1 "+this.productoLeido.sucursal3+"S2 "+this.productoLeido.bodegaProveedor+"P "
    this.infoproducto.ubicacion = "Suc1 ("+this.productoLeido.ubicacionSuc1+") " +"Suc2 ("+this.productoLeido.ubicacionSuc2+") "+"Suc3 ("+this.productoLeido.ubicacionSuc3+") "
    this.infoproducto.precioCliente= 0
    this.infoproducto.precioDist= 0
    this.infoproducto.precioSocio= 0
    this.infoproducto.notas= ""

//alert(this.productosCatalogo.length)
    this.productosCatalogo.forEach(element=>{
      if(element.PRODUCTO == this.infoproducto.producto ){
        //alert("ssss")
        this.infoproducto.fabrica = element.CASA
        this.imagenes= element.IMAGEN
      }
    })
  }

}
