import { Component, OnInit, ViewChild, Pipe } from '@angular/core';
import { OrdenDeCompra, compra, Proveedor,Sucursal,Producto} from './compra';
import { ProductoDetalleCompra } from '../producto/producto';
import { transaccion } from '../transacciones/transacciones';
import { DxFormComponent } from 'devextreme-angular';
import { dxFormGroupItem } from 'devextreme/ui/form';
import pdfMake from 'pdfmake/build/pdfmake';
import Swal from 'sweetalert2';
import { producto, contadoresDocumentos, venta } from '../ventas/venta';
import { DatePipe } from '@angular/common';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { catalogo } from '../catalogo/catalogo';
import { TransaccionesService } from 'src/app/servicios/transacciones.service';
import { ProductosVendidosService } from 'src/app/servicios/productos-vendidos.service';
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { ContadoresDocumentosService } from 'src/app/servicios/contadores-documentos.service';
import { CatalogoService } from 'src/app/servicios/catalogo.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { SucursalesService } from 'src/app/servicios/sucursales.service';
import { ProveedoresService } from 'src/app/servicios/proveedores.service';
import { OrdenesCompraService } from 'src/app/servicios/ordenes-compra.service';
import { ProductosCompradosService } from 'src/app/servicios/productos-comprados.service';
import { AuthenService } from 'src/app/servicios/authen.service';
import DataSource from "devextreme/data/data_source";
import { user } from '../user/user';
import { AuthService } from 'src/app/shared/services';
import { FacturasProveedorService } from 'src/app/servicios/facturas-proveedor.service';
import { DatosConfiguracionService } from 'src/app/servicios/datosConfiguracion.service';
import { inventario, productoTransaccion } from '../consolidado/consolidado';
@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {
  ordenDeCompra : OrdenDeCompra;
  now: Date = new Date();
  now3: Date = new Date();
  productos: Producto[] = []
  productosActivos: Producto[] = []
  
  productos2: producto[] = []
  proveedores:Proveedor[] = []
  locales: Sucursal[] = []
  transacciones:transaccion[] = []
  sePuedeCalcular:Boolean
  compras: compra[] = []
  transaccion:transaccion
  productosComprados: ProductoDetalleCompra[] = []
  newButtonEnabled: boolean = true
  medida: string = "m2"
  cantidad: number
  parametrizaciones:parametrizacionsuc[]=[]
  parametrizacionSucu:parametrizacionsuc
  cantidadPiezas: number
  mensaje2:string
  costeUnitaTransport:number=0
  otrosCostosGen:number=0
  otrosDescuentosGen:number=0
  numeroFactura:string
  condicionPagos: string[] = [
    "Contado",
    "30 días",
    "30 - 60",
    "60 - 90"
  ];
  subtotal:number=0
  subtotal1:number=0
  subtDesc:number=0
  subtMenosDesc:number=0
  subtotalFactura1:number=0
  subtotalFactura2:number=0
  subtotalIva:number=0
  subtotalGeneral2:number=0
  subtCostosGenerales:number=0
  subtOtrsoDesc:number=0

  

  //procesos para inventario
  proTransaccion: productoTransaccion = new productoTransaccion();
  invetarioP:inventario[]=[]
  invetarioProd:inventario;
  mostrarLoading = false;
  mensajeLoading = "Cargando";
  productosVendidos: venta[] = []

  imagenLogotipo = "";

  @ViewChild('espacio') dataContainer: dxFormGroupItem;
  @ViewChild('comprasForm', { static: false }) comprasForm: DxFormComponent;
  pipe = new DatePipe('en-US');
  factproveedor:string
  seleccion:boolean=false
  visibleCalculadora: boolean = false
  now2 = Date.now();
  mySimpleFormat = this.pipe.transform(this.now2, 'MM/dd/yyyy');
  usuario:string
  pdfDocGenerator
  catalogoLeido:catalogo
  tipoConversiones: string[] = [
    "De cajas a m2",
    "De m2 a cajas"
  ];

  imagenes:string[]
  titulo:string=""
  productosCatalogo:catalogo[]=[]
  contadores:contadoresDocumentos[]
  valorEnM2:number=0
  calp:number=0
  imagenPrincipal:string
  popupVi:boolean=false
  imagenesData:string[]
  calmetros:number=0
  caltotal:number=0
  correo:string=""
  cantidadcal: number=0
  disponibilidadProducto:string=""
  popupvisible:boolean=false
  usuarioLogueado:user
  productos22: DataSource;
  constructor(public authenService: AuthenService,public authService: AuthService, public transaccionesService: TransaccionesService,public productosCompradosService: ProductosCompradosService, public ordenesService: OrdenesCompraService, public proveedoresService:ProveedoresService, public productosVenService:ProductosVendidosService,public parametrizacionService:ParametrizacionesService, public contadoresService: ContadoresDocumentosService, public catalogoService: CatalogoService, 
    public _configuracionService : DatosConfiguracionService,
    public _facturasProveedorService : FacturasProveedorService,
    public productoService:ProductoService,public sucursalesService: SucursalesService) {
    this.ordenDeCompra = new OrdenDeCompra()
    this.ordenDeCompra.fecha = this.now.toDateString()  
    this.ordenDeCompra.fechaEntrega = new Date().toDateString()
    this.productosComprados.push(new ProductoDetalleCompra)
    this.ordenDeCompra.costeUnitaTransport=this.costeUnitaTransport
    this.ordenDeCompra.otrosCostosGen= this.otrosCostosGen
    this.ordenDeCompra.condpago="Contado"
    this.ordenDeCompra.observaciones=""
    this.ordenDeCompra.usuario = sessionStorage.getItem('user') 
    
  }


  ngOnInit() {
    this.cargarUsuarioLogueado()
    this.traerDatosConfiguracion()
    this.traerProductos()
    this.traerParametrizaciones()
    this.traerProductosCatalogo()
    this.traerSucursales()
    this.traerProveedores()
    this.traerContadoresDocumentos()
  }


  traerDatosConfiguracion() {
    this._configuracionService.getDatosConfiguracion().subscribe((res) => {
      this.imagenLogotipo = res[0].urlImage;
    });
  }
  

  cargarUsuarioLogueado() {
    const promesaUser = new Promise((res, err) => {
      if (localStorage.getItem("maily") != '') {
        this.correo = localStorage.getItem("maily");
      }
      this.authenService.getUserLogueado(this.correo)
        .subscribe(
          res => {
            this.usuarioLogueado = res as user;
            this.ordenDeCompra.usuario = this.usuarioLogueado[0].username
            if(this.usuarioLogueado[0].status == "Inactivo")
              this.authService.logOut();

          },
          err => {
          }
        )
    });
  }

  traerProveedores(){
    this.proveedoresService.getProveedor().subscribe(res => {
      this.proveedores = res as Proveedor[];
   })
  }
  
  traerSucursales(){
    this.sucursalesService.getSucursales().subscribe(res => {
      this.locales = res as Sucursal[];
   })
  }

  traerProductos(){
    this.productoService.getProducto().subscribe(res => {
      this.productosActivos = res as producto[];
      this.llenarPR()
      this.llenarComboProductos()
   })
  }

  traerProductosCatalogo(){
    this.catalogoService.getCatalogo().subscribe(res => {
      this.productosCatalogo = res as catalogo[];
   })
  }

  traerParametrizaciones(){
    this.parametrizacionService.getParametrizacion().subscribe(res => {
      this.parametrizaciones = res as parametrizacionsuc[];
   })
  }

  async traerContadoresDocumentos(){
    await this.contadoresService.getContadores().subscribe(res => {
      this.contadores = res as contadoresDocumentos[];
      this.ordenDeCompra.documento =this.contadores[0].ordenesCompra_Ndocumento+1
      //this.asignarIDdocumentos()
   })
  }

  asignarIDdocumentos(){
   // this.ordenDeCompra.documento =this.contadores[0].ordenesCompra_Ndocumento+1
    this.ordenDeCompra.documento =this.contadores[0].ordenesCompra_Ndocumento+1
  }

  

  llenarComboProductos(){
    this.productosActivos.forEach(element=>{
      if(element.ESTADO == "ACTIVO"){
        this.productos.push(element)
      }
    })
     this.productos22 = new DataSource({  
      store: this.productos,  
      sort: [{ field: "PRODUCTO", asc: true }],    
    });
  }

  anadirProducto = (e) => {
    this.newButtonEnabled = true
    let contadoProductos=0
    this.productosComprados.forEach(element=>{
      contadoProductos++
    })
      
      console.log("hay"+contadoProductos)
      if(contadoProductos>=5 && contadoProductos<=10){
        this.dataContainer.cssClass="altura1"
      }else if(contadoProductos>=11 && contadoProductos<=15){
        this.dataContainer.cssClass="altura2"
      }else if(contadoProductos>=16 && contadoProductos<=20){
        this.dataContainer.cssClass="altura3"
      }else if(contadoProductos>=21 && contadoProductos<=25){
        this.dataContainer.cssClass="altura4"
      }else if(contadoProductos>=26){
        this.dataContainer.cssClass="altura5"
      }

    this.productosComprados.push(new ProductoDetalleCompra())

  }


stringIsNumber(s) {
    var x = +s; // made cast obvious for demonstration
    return x.toString() === s;
}

  ct:string = ""
  selected:number
  //VA A COGER SIEMPRE EL ULTIMO

setSelectedProducto(i:number){
  this.selected=i 
}


  obtenerDatosDeProductoParaUnDetalle(e, i:number) {
    this.productos.forEach(element => {
      if (element.PRODUCTO == e.value) {
        

        this.productosComprados[i].rotacion = 0
        this.productosComprados[i].precio_cos = element.precio
        this.productosComprados[i].nombreComercial = element
        this.productosComprados[i].desct=0
      }
    })

    var cont=0
    this.productosComprados.forEach(element=>{
      if(element.nombreComercial.PRODUCTO == e.value)
        cont++;
    })

    this.newButtonEnabled = false
  
    if(cont<2){
      this.productos.forEach(element => {
        if (element.PRODUCTO == e.value) {
          this.traerTransaccionesPorProducto(element,i);
          switch (this.ordenDeCompra.sucursal.nombre) { 
            
            case "matriz":
              this.productosComprados[i].disponible = element.sucursal1
              break;
            case "sucursal1":
              this.productosComprados[i].disponible = element.sucursal2
              break;
            case "sucursal2":
              this.productosComprados[i].disponible = element.sucursal3
                break;
            default:
              //alert(this.ordenDeCompra.sucursal.nombre)
          }
        if(this.productosComprados[i].disponible<0){
          this.productosComprados[i].disponible=0
        }
          this.productosComprados[i].rotacion = 0
          this.productosComprados[i].precio_cos = element.precio
          this.productosComprados[i].nombreComercial = element
        this.productosComprados[i].desct=0
        }
      })
    }else{
      Swal.fire(
        'Alerta',
        'Ya tiene detallado este producto',
        'warning'
      )
      this.deleteProductoVendido(i)
    }
    this.calcularEquivalencia(e,i)
  }



  verCalculadora(e) {
    this.visibleCalculadora = true
  }


  obtenerDatosSucursal(e){
    this.locales.forEach(element=> {
      if(e.value == element.nombre){
        this.ordenDeCompra.sucursal=element
          this.ordenDeCompra.sucursal.celular=element.celular
          this.ordenDeCompra.sucursal.nombre=element.nombre
          this.ordenDeCompra.sucursal.direccion=element.direccion
          this.ordenDeCompra.sucursal.contacto=element.contacto
      }
    })
    
  }
  mostrarMensaje(){
    let timerInterval
      Swal.fire({
        title: 'Guardando Documento!',
        html: 'Procesando',
        timerProgressBar: true,
        onBeforeOpen: () => {
          Swal.showLoading()
          timerInterval = setInterval(() => {
            const content = Swal.getContent()
            if (content) {
              const b = content.querySelector('b')
              
            }
          }, 100)
        },
        onClose: () => {
          clearInterval(timerInterval)
        }
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
                Swal.fire({
                    title: 'Solicitud guardada',
                    text: 'Su solicitud de compra fue guardada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                  }).then((result) => {
                    window.location.reload()
                  })
        }
      })
  }



  crearPDF(){
    this.buscarDatosSucursal()
    const documentDefinition = this.getDocumentDefinition();
    //const pdfDocGenerator = pdfMake.createPdf(documentDefinition)
    var numor=this.ordenDeCompra.documento
    pdfMake.createPdf(documentDefinition).download('Orden de Compra '+numor, function(response) { Swal.close(),
      Swal.fire({
        title: 'Solicitud guardada',
        text: 'Su solicitud de compra fue guardada con éxito',
        icon: 'success',
        confirmButtonText: 'Ok'
      }).then((result) => {
        window.location.reload()
      }) });
    this.mostrarMensaje()
    
  }

  descargarPDF(){
    this.pdfDocGenerator.download('Orden de Compra '+this.ordenDeCompra.documento, function(response) {Swal.close()  });
  }

  mostrarMensajePDF(){
    alert("si entre")
    let timerInterval
    Swal.fire({
      title: 'Creando Documento!',
      html: 'Procesando',
      timerProgressBar: true,
      onBeforeOpen: () => {
        Swal.showLoading()
        timerInterval = setInterval(() => {
          const content = Swal.getContent()
          if (content) {
            const b = content.querySelector('b')
            
          }
        }, 100)
      },
      onClose: () => {
        clearInterval(timerInterval)
      }
    })

  }
    
    
  setearNFactura(){
          let nf=this.ordenDeCompra.documento
          let num=('' + nf).length
          console.log("el numero es"+num)
          switch (num) {
            case 1:
                this.numeroFactura="00000"+nf
                break;
            case 2:
                this.numeroFactura="0000"+nf
                break;
            case 3:
                this.numeroFactura="000"+nf
                break; 
            case 4:
                this.numeroFactura="00"+nf
                break; 
            case 5:
                this.numeroFactura="0"+nf
                break;
            case 6:
                //this.numeroFactura= nf
                break;    
            default:
        }
  }
    

  deleteProductoVendido(i){
    if(this.productosComprados.length > 1){
      this.productosComprados.splice(i,1);
      this.calcularTotalFactura()
    }
    else{
      alert("Las facturas deben tener al menos un producto")
    }
  }

  setClienteData(e){
    this.proveedores.forEach(element => {
      if(element.nombre_proveedor == e.component._changedValue){
        this.ordenDeCompra.proveedor= element
        this.ordenDeCompra.proveedor.celular= element.celular
        
        this.ordenDeCompra.proveedor.direccion= element.direccion
        this.ordenDeCompra.proveedor.nombre_proveedor= element.nombre_proveedor
        this.ordenDeCompra.proveedor.contacto= element.contacto
        this.ordenDeCompra.proveedor.ruc= element.ruc
        this.mensaje2=element.nombre_proveedor
      }
    }); 
  }

  obtenerDatosCalculadora(e){
    this.productos2.forEach(element=>{
      if(element.PRODUCTO == e.value){
        this.calp=element.P_CAJA
        this.calmetros=element.M2
      }
    })
    this.calcularMetros(e)
  }
  obtenerDatosCalculadora2(e){
    this.productos2.forEach(element=>{
      if(element.PRODUCTO == e.value){
        this.calp=element.P_CAJA
        this.calmetros=element.M2
      }
    })
    this.calcularMetros2(e)
  }

  llenarPR(){
    this.productosActivos.forEach(element=>{
     /*  if(element.CLASIFICA== "Porcelanatos" || element.CLASIFICA=="Ceramicas"  || element.CLASIFICA=="Cerámicas"){
          this.productos2.push(element)
      } */
      if(element.UNIDAD == "Metros"){
        this.productos2.push(element)
      }
    })
  }


  enviar(num:number){
    console.log("acabo de recibir "+ num)
    this.imagenPrincipal= this.imagenesData[num]
  }
  
  opcionMenu(e){
    var x = document.getElementById("op1");
    var y = document.getElementById("op2");

    switch (e.value) {
      case "De cajas a m2":
        x.style.display = "block";
        y.style.display="none";
       break;

      case "De m2 a cajas":
        x.style.display = "none";
        y.style.display="block";
        break;
      default:    
    }     
  }

  calcularMetros(e) {
    console.log("entre a calcualr")
    console.log("entre a calcualr"+this.cantidadcal)
    console.log("entre a calcualr"+this.calp)
    console.log("entre a calcualr"+this.valorEnM2)
    console.log("entre a calcualr"+this.calmetros)
    console.log("entre a calcualr"+this.calp)
    console.log("entre a calcualr"+(this.calmetros*this.cantidadcal))
   // console.log("entre a calcualr"+(this.valorEnM2*this.calmetros/this.calp))

     // this.caltotal= (this.calmetros * this.cantidadcal)
      this.caltotal=parseFloat(((this.calmetros*this.cantidadcal)+((this.valorEnM2*this.calmetros)/this.calp)).toFixed(2))
      
    
  }


  
mostrarPopup(e,i:number){
  console.log("este es sss  "+JSON.stringify(this.productosComprados[i].nombreComercial))
  console.log("Productos "+this.productosCatalogo.length)
  this.productosCatalogo.forEach(element=>{
    console.log("22 "+element.PRODUCTO)
    
    if(element.PRODUCTO == this.productosComprados[i].nombreComercial.PRODUCTO){
      this.imagenes= element.IMAGEN
      this.titulo=element.PRODUCTO
      this.catalogoLeido = element
      this.catalogoLeido.ubicacion1 = this.productosComprados[i].nombreComercial.ubicacionSuc1
      this.catalogoLeido.ubicacion2 = this.productosComprados[i].nombreComercial.ubicacionSuc2
      this.catalogoLeido.ubicacion3 = this.productosComprados[i].nombreComercial.ubicacionSuc3
      console.log("encontre")
      this.disponibilidadProducto=this.productosComprados[i].nombreComercial.sucursal1.toFixed(0)+"M    "+
      this.productosComprados[i].nombreComercial.sucursal2.toFixed(0)+"S1    "+this.productosComprados[i].nombreComercial.sucursal3.toFixed(0)+"S2  "+this.productosComprados[i].nombreComercial.bodegaProveedor.toFixed(0)+"P  "
    }
  })
  this.popupvisible=true 
}

mostrarDivUbicaciones(){
  var x = document.getElementById("bodegUbi");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

verGaleria(imagenes:string[]){
  console.log("viendo galerIA")
  this.popupvisible=false
  this.popupVi=true
   this.imagenesData=imagenes
   this.imagenPrincipal= this.imagenesData[0]
}




  calcularMetros2(e) {
      this.cantidadcal=Math.trunc((this.caltotal+0.01) / this.calmetros);
      
      this.valorEnM2=Math.trunc((this.caltotal+0.01) * this.calp / this.calmetros) - (this.cantidadcal * this.calp);
      
      console.log("entre a calcualr"+this.caltotal)
      console.log("entre a calcualr"+this.calmetros)
      console.log("entre a calcualr"+this.cantidadcal)
      console.log("entre a calcualr"+this.cantidadcal)
    console.log("entre a calcualr"+this.calp)
    console.log("entre a calcualr"+this.valorEnM2)
    
    console.log("entre a calcualr"+this.calp)
      console.log("ss "+(this.caltotal*this.calp/this.calmetros))
      console.log("ss "+(this.cantidadcal*this.calp))
     
    
  }



  carcularTotalProducto(e, i:number) {
 
    this.calcularTotalRow(i)
    this.calcularTotalFactura()
    this.calcularEquivalencia(e,i)
  }

  calcularEquivalencia(e, i:number) {
    console.log("Entre por aqui"+i)
    this.productos.forEach(element => {
      if(element.PRODUCTO == this.productosComprados[i].nombreComercial.PRODUCTO){
        let cajas = Math.trunc(this.productosComprados[i].cantidad / element.M2);
        let piezas = Math.trunc(this.productosComprados[i].cantidad * element.P_CAJA / element.M2) - (cajas * element.P_CAJA);
        console.log("mirando productos por caja"+element.P_CAJA)
        this.productosComprados[i].equivalencia = cajas + "C " + piezas + "P"
      }
    })
    //this.asignarProducto(e,i)
  }

  calcularTotalFactura2(){
    
    let subtotal2=0
    let subtotal4=0

    this.ordenDeCompra.total = 0
    this.ordenDeCompra.subtotal = 0
    this.productosComprados.forEach(element => {
      //console.log(element.seleccionado)
      //if(element.seleccionado)
      this.ordenDeCompra.total = element.total + this.ordenDeCompra.total 
      this.ordenDeCompra.subtotal = element.subtotal + this.ordenDeCompra.subtotal 

    });
    this.subtotalFactura1=(this.ordenDeCompra.subtotal/1.12)
    this.subtotalFactura2=this.ordenDeCompra.total/1.12
    
    console.log("lalalala"+this.subtotal)
    this.subtotal = this.ordenDeCompra.total +this.costeUnitaTransport+this.otrosCostosGen
    //this.factura.total=parseFloat((this.factura.total+ this.factura.coste_transporte).toFixed(2)) 
    if(this.otrosDescuentosGen>=1){
      subtotal2= ((this.otrosDescuentosGen/100)*this.subtotalFactura2)
      subtotal4= ((this.otrosDescuentosGen/100)*this.ordenDeCompra.total)
      console.log("entre por aqui a restar"+subtotal2)
      //this.ordenDeCompra.total= this.subtotal-subtotal2
      this.ordenDeCompra.total= parseFloat((this.subtotal-subtotal4).toFixed(2))

    }else{
      this.ordenDeCompra.total=this.subtotal
    }
    this.subtotal1 =this.subtotal
    this.subtMenosDesc=this.subtotalFactura2-this.subtotalFactura1
    //this.subtDesc= subtotal2
    this.subtotalGeneral2= this.subtotalFactura2-subtotal2
    this.subtCostosGenerales=this.otrosCostosGen/1.12
    this.subtotalIva=(this.subtCostosGenerales+this.subtotalGeneral2)*0.12
    this.subtOtrsoDesc=subtotal2
     
    //desde aqui comienza los totales
    this.subtotal1 =this.subtotal/1.12
    //console.log("He sumado ")




    //desde aqui comienzo con otros valores
  }


  calcularTotalFactura(){
    
    let subtotal2=0
    let subtotal4=0

    this.ordenDeCompra.total = 0
    this.ordenDeCompra.subtotal = 0
    this.ordenDeCompra.subtotalIva = 0
    this.ordenDeCompra.subtotalDetalles=0
    this.ordenDeCompra.subtDetalles2=0
    this.productosComprados.forEach(element => {
      //console.log(element.seleccionado)
      //if(element.seleccionado)
      this.ordenDeCompra.total = element.total + this.ordenDeCompra.total 
      this.ordenDeCompra.subtotal = element.subtotal + this.ordenDeCompra.subtotal 
      this.ordenDeCompra.subtotalIva= element.subtIva+ this.ordenDeCompra.subtotalIva
      this.ordenDeCompra.subtotalDetalles= element.subtDet + this.ordenDeCompra.subtotalDetalles
      this.ordenDeCompra.subtDetalles2= element.subtDetP + this.ordenDeCompra.subtDetalles2
    });
    this.subtotalFactura1=(this.ordenDeCompra.subtotal/1.12)
    this.subtotalFactura2=this.ordenDeCompra.total/1.12
    
    let suma=0
    let suma2=0
    let suma3=0
    //suma=((this.ordenDeCompra.subtotalIva)/1.12)+(this.otrosCostosGen-(this.otrosCostosGen/1.12))
    suma3=(this.otrosCostosGen-(this.otrosCostosGen/1.12))
    suma= ((this.ordenDeCompra.subtotalIva)/1.12)-(((this.ordenDeCompra.subtotalIva)/1.12)*(this.otrosDescuentosGen/100))+suma3
    
    //+(this.otrosCostosGen-(this.otrosCostosGen/1.12))
   // suma3=(this.otrosCostosGen-(this.otrosCostosGen/1.12))
    //suma2=(this.ordenDeCompra.subtotalIva+ (this.otrosCostosGen-(this.otrosCostosGen/1.12)))

    console.log("el subtotal de iva es"+ suma)
    console.log("el subtotal de iva con los detalles es "+  this.ordenDeCompra.subtotalDetalles)
    console.log("el subtotal Principal de iva con los detalles es "+ this.ordenDeCompra.subtDetalles2)
    //console.log("voy a sumar  con "+ suma3)
    //console.log("el subtotal de IVA2"+ suma2)

    this.subtotal = this.ordenDeCompra.total +this.costeUnitaTransport+this.otrosCostosGen
    //this.factura.total=parseFloat((this.factura.total+ this.factura.coste_transporte).toFixed(2)) 
    if(this.otrosDescuentosGen>=1){
      subtotal2= ((this.otrosDescuentosGen/100)*this.ordenDeCompra.subtotalDetalles)
      subtotal4= ((this.otrosDescuentosGen/100)*this.ordenDeCompra.total)
      console.log("entre por aqui a restar"+subtotal2)
      //this.ordenDeCompra.total= this.subtotal-subtotal2
      this.ordenDeCompra.total= parseFloat((this.subtotal-subtotal4).toFixed(2))

    }else{
      this.ordenDeCompra.total=parseFloat(this.subtotal.toFixed(2))
    }
    this.subtotal1 =this.subtotal
    this.subtMenosDesc=this.ordenDeCompra.subtotalDetalles-this.ordenDeCompra.subtDetalles2
    //this.subtDesc= subtotal2
    this.subtotalGeneral2= this.ordenDeCompra.subtotalDetalles-subtotal2
    this.subtCostosGenerales=this.otrosCostosGen/1.12
    this.ordenDeCompra.TotalIva=suma
    this.subtOtrsoDesc=subtotal2
     
    //desde aqui comienza los totales
    this.subtotal1 =this.subtotal/1.12
    //console.log("He sumado ")




    //desde aqui comienzo con otros valores
  }


cambiarEstadoSeleccionado(e){
  console.log(e)
  this.calcularTotalFactura()
}

  obtenerTipoPago(e){
    this.ordenDeCompra.condpago=e.value

  }


  calcularTotalRow(i:number) {
    console.log("aqui estoy mostrandO TOTAL des"+this.productosComprados[i].desct)
    this.productosComprados[i].total = parseFloat((this.productosComprados[i].cantidad * this.productosComprados[i].precio_compra).toFixed(2))
    let calculo= ((this.productosComprados[i].desct/100) * this.productosComprados[i].total);
    console.log("aqui estoy mostrandO TOTAL"+calculo)
    this.productosComprados[i].subtotal=this.productosComprados[i].total
    this.productosComprados[i].total =this.productosComprados[i].total -calculo
    if(this.productosComprados[i].iva){
      this.productosComprados[i].subtIva=this.productosComprados[i].total*0.12
      this.productosComprados[i].subtDet=this.productosComprados[i].total/1.12
      this.productosComprados[i].subtDetP=this.productosComprados[i].subtotal/1.12
      console.log("esto quiero mostrar"+this.productosComprados[i].subtDetP)
    }else{
      this.productosComprados[i].subtIva=0
      this.productosComprados[i].subtDet=this.productosComprados[i].total
      this.productosComprados[i].subtDetP=this.productosComprados[i].subtotal
      console.log("esto quiero mostrar"+this.productosComprados[i].subtDetP)
    }
  }

  calcularTotalRow2(i:number) {
    console.log("aqui estoy mostrandO TOTAL des"+this.productosComprados[i].desct)
    this.productosComprados[i].total = parseFloat((this.productosComprados[i].cantidad * this.productosComprados[i].precio_compra).toFixed(2))
    let calculo= ((this.productosComprados[i].desct/100) * this.productosComprados[i].total);
    console.log("aqui estoy mostrandO TOTAL"+calculo)
    this.productosComprados[i].subtotal=this.productosComprados[i].total
    this.productosComprados[i].total =this.productosComprados[i].total -calculo
    if(this.productosComprados[i].iva == true){
      console.log("Esta seleccionado")
    }else{
      console.log("No Esta seleccionado")
    }
  }
 
  calcularDescuento(e,i:number){
    let calculo= ((this.productosComprados[i].desct/100) * this.productosComprados[i].total);
    console.log("el descuento es"+calculo);
    this.calcularTotalRow(i)
    this.calcularTotalFactura()  
  }

  calcularDetalleTotales(){
    //subtotal1:number=0
 // subtDesc:number=0
  this.subtotal1 =this.subtotal
    this.subtDesc= this.ordenDeCompra.total-this.subtotal
  }

  buscarDatosSucursal(){
    this.parametrizaciones.forEach(element=>{
      if(element.sucursal == this.ordenDeCompra.sucursal.nombre){
        this.parametrizacionSucu= element
      }
    })
  }


  getDocumentDefinition() {

    sessionStorage.setItem('resume', JSON.stringify("jj"));
    //let tipoDocumento="Factura";
    return {
      pageSize: 'A4',
      content: [
        {
          columns: [{
            image: this.imagenLogotipo,
          width: 100,
          margin: [0, 20, 0, 10],
          },
          {
            width:410,
            margin: [0, 20, 0, 10],
            text: "Fecha:   "+this.mySimpleFormat,
            alignment:"right"
          },
          ]
          
          //alignment: 'center'
        }, {

     
        },
        
        {
          columns: [
            
            [
              {
              
              text: this.parametrizacionSucu.razon_social,
            },
            {
              text: "RUC: "+this.parametrizacionSucu.ruc,
            },
            {
              text: "Fecha de impresión: "+this.ordenDeCompra.fecha, fontSize:10
            },
            {
              text: "Venta de materiales para acabados de construcción, porcelanatos, cerámicas ", fontSize:9
            },
            {
              text: "Dirección: "+this.parametrizacionSucu.direccion,
            },
            {
              text: "Teléfonos: "+this.parametrizacionSucu.telefonos,
            },
            {
              text: "Auto SRI "+this.parametrizacionSucu.sri,
            },{
              columns: [{
              width:300,
              text: "SOLICITUD / COMPRA 001-000 ",
              bold: true,
              fontSize: 20,
            },
            {
              width:215,
              text: "NO "+this.numeroFactura,
              color: 'red',
              bold: true,
              fontSize: 20,
              alignment:"right"
            },
            ]
            },
            {
            //Desde aqui comienza los datos del cliente
            style: 'tableExample',
            table: {
              widths: [130,365],
              body: [
                [
                  {
                    stack: [
                      {
                        type: 'none',
                        bold: true,
                        ul: [
                          'Sucursal',
                          'Contacto',
                          "Fecha de entrega",
                          "Lugar de entrega",
                          "Usuario"
                        ]
                      }
                    ]
                  },
                  [{
                    stack: [
                      {
                        type: 'none',
                        ul: [
                          ''+this.ordenDeCompra.sucursal.nombre,
                          ''+this.ordenDeCompra.sucursal.contacto,
                          ''+this.ordenDeCompra.fechaEntrega,
                          ''+this.ordenDeCompra.lugarentrega,
                          ''+this.ordenDeCompra.usuario,
                        ]
                      }
                    ]
                  },
                  ],
                 
                ]
              ]
            }
            },

            //aqui termina{}
            {
              text:"Datos del Proveedor",alignment:"center",style:"textoPro"
            },
            {
              //Desde aqui comienza los datos del cliente
              style: 'tableExample',
              table: {
                widths: [130,365],
                body: [
                  [
                    {
                      stack: [
                        {
                          type: 'none',
                          bold: true,
                          ul: [
                            'Proveedor',
                            'Contacto',
                            "Dirección",
                            "Teléfonos",
                            "Condición/Pago"
                          ],
                        },
                        
                      ]
                    },
                    [{
                      stack: [
                        {
                          type: 'none',
                          ul: [
                            ''+this.ordenDeCompra.proveedor.nombre_proveedor,
                            ''+this.ordenDeCompra.proveedor.contacto,
                            ''+this.ordenDeCompra.proveedor.direccion,
                            ''+this.ordenDeCompra.proveedor.celular,
                            ''+this.ordenDeCompra.condpago,
                          ]
                        },
                      ]
                    },
                    ],
                   
                  ]
                ]
              }
              },
            ],
            [
              
            ]
          ]
        },
       
        
        this.getProductosVendidos(this.productosComprados),
        {
          //espacio en blanco despues de detalle de productos
          text: " ",
        },
        {
          text:"Otros valores",
          style: 'texto6'
        },

        {
          columns: [{

            type: 'none',
            ul: [
                  {
                    style: 'tableExample2',
                    table: {
                      widths: [250],
                      heights:105,
                      body: [
                        [
                          {text: 'Observaciones: '+this.ordenDeCompra.observaciones},
                        ]
                      ]
                    },

                  },{
                    style: 'tableExample3',
                  
                    table: {
                      widths: ["*"],
                      heights:70,
                      body: [
                        [
                          {
                            stack: [
                              {
                                type: 'none',
                                
                                fontSize: 8,
                                ul: [
                                  
                                  ' ',
                                  ' ',
                                  ' ',
                                  ' ',
                                  ' ',
                                  {text:'Firma de recibo a conformidad' , alignment:'center'}
                                ]
                              }
                            ]
                          }
                        ]
                      ]
                    },

                  }
            ]
            
            
        },
        {
          //Desde aqui comienza los datos del cliente
          style: 'tableExample',
         
          table: {
            widths: [125,100],
            body: [
              [ { text: 'Subtotal', bold: true ,style: "detalleTotales"}, {text:this.ordenDeCompra.subtDetalles2.toFixed(2), style:"totales" }],
              [ { text: 'Descuento', bold: true ,style: "detalleTotales"}, {text:this.subtMenosDesc.toFixed(2), style:"totales" }],
              [ { text: 'Subt.Desc', bold: true ,style: "detalleTotales"}, {text:this.ordenDeCompra.subtotalDetalles.toFixed(2), style:"totales" }],
              [ { text: 'Otros desc.(%)', bold: true , style: "detalleTotales" }, {text:this.ordenDeCompra.otrosDescuentosGen +" %", style:"totales" } ],              
              [ { text: 'Otros Descuentos', bold: true ,style: "detalleTotales"}, {text:this.subtOtrsoDesc.toFixed(2) , style:"totales" }],
              [ { text: 'Subtotal 2', bold: true ,style: "detalleTotales"}, {text:this.subtotalGeneral2.toFixed(2), style:"totales" }],             
              [ { text: 'Costos Seguro', bold: true, style: "detalleTotales" }, {text:this.subtCostosGenerales.toFixed(2), style:"totales" } ],
              [ { text: 'Iva', bold: true ,style: "detalleTotales"}, {text:this.ordenDeCompra.TotalIva.toFixed(2), style:"totales" } ],
              [ { text: 'Cost/Unit/Trans.', bold: true ,style: "detalleTotales"}, {text:this.ordenDeCompra.costeUnitaTransport.toFixed(2), style:"totales" } ],
              [ { text: 'Total', bold: true, style: "detalleTotales" }, {text:this.ordenDeCompra.total.toFixed(2), style:"totales" } ]
            ]
          }
          },
        ]
        },
        this.getDatosFooter(),
       
        
      ],
      footer: function (currentPage, pageCount) {
        return {
          table: {
            body: [
              
              [{text: 'ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL   ORIGINAL ', alignment: 'center', style:"textFot"}],
            ]
          },
          layout: 'noBorders'
        };
      }, pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
        return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
     },
      
      images: {
        mySuperImage: 'data:image/jpeg;base64,...content...'
      },
      info: {
        title: "Factura" + '_RESUME',
        author: "this.resume.name",
        subject: 'RESUME',
        keywords: 'RESUME, ONLINE RESUME',
      },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 20, 0, 10],
            decoration: 'underline'
          },
          textoPro:{
            bold: true,
            margin: [0, -12, 0, -5]
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          },
          tableExample2: {
            margin: [-13, 5, 10, 15]
          },
          tableExample3: {
            margin: [-13, -10, 10, 15]
          },
          tableExample4: {
            margin: [10, -5, 0, 15]
          },
          texto6: {
            fontSize: 14,
            bold: true,
            alignment: "center"
          },
          name: {
            fontSize: 16,
            bold: true
          },
          jobTitle: {
            fontSize: 14,
            bold: true,
            italics: true
          },
          textFot: {   
            alignment: 'center',
            italics: true,
            color: "#bebebe",
            fontSize:18,
          },
          tableHeader: {
            bold: true,
          },
          tableHeader2: {
            bold: true,
            fontSize:10,
          },
          
          fondoFooter: {
            fontSize: 8,
            alignment: "center"
          },
          totales: {
            margin: [0, 0, 15, 0],
            alignment: "right",
          },
          totales2: {
            margin: [0, 0, 5, 0],
            alignment: "right",
          },
          detalleTotales: {
            margin: [15, 0, 0, 0]
          }
        }
    };
  } 


  getProductosVendidos(productos: ProductoDetalleCompra[]) {
    return {
      table: {
        widths: ["10%","6%","52%","10%","9%","13%"],
        alignment:'center',
        body: [
          
          [{
            text: 'Cantidad',
            style: 'tableHeader2',
            alignment: 'center'
          },
          {
            text: 'Unid.',
            style: 'tableHeader2',
            alignment: 'center'
          },
          {
            text: 'Producto',
            style: 'tableHeader2',
            alignment: 'center'
          },
          {
            text: 'V/Unid',
            style: 'tableHeader2'
            , alignment: 'center'
          },
          {
            text: 'Dscto(%)',
            style: 'tableHeader2'
            , alignment: 'center'
          },
          {
            text: 'Total',
            style: 'tableHeader2'
            , alignment: 'center'
          },
          
          ],
          
          ...productos.map(ed =>{
            return [ { text: ed.cantidad, alignment: 'center' },{text:ed.nombreComercial.UNIDAD,fontSize:8,alignment:"center"},ed.nombreComercial.PRODUCTO, {text:ed.precio_compra.toFixed(2), alignment:"center"}, {text:ed.desct, alignment:"center"}, {text:ed.total.toFixed(2), alignment:"right",style:"totales2"}];
            
          }),
        ]
      }
    };
  }


  getOtrosValores() {
    return {
      table: {
        widths: ["80%","20%"],
        alignment:'center',
        body: [
          
          [{
            text: 'Descripción',
            style: 'tableHeader2',
            alignment: 'center'
          },
          {
            text: 'Total',
            style: 'tableHeader2',
            alignment: 'center'
          },
          ],
          [{
            text: "Transporte",
            alignment: 'center'
          },
          {
            text: ' '+this.ordenDeCompra.costeUnitaTransport,   
            alignment: 'center'
          },
          ],
          
        ]
      }
    };
  }



  getDatosFooter() {
    return {
      table: {
        widths: ["*"],         
        alignment:'center',
        body: [
          
          [{
            text: 'Matriz Principal: Milagro, Avenida Juan Montalvo entre seminario y Olmedo 13 ',
            style: 'fondoFooter',
            alignment: 'center',
            border: [false, true, false, false]
          },    
          ], [{
            text: 'Celular 0997945089, 0986951573, Sucursal Triunfo: Avenida 8 de abril, via Bucay',
            style: 'fondoFooter',
            alignment: 'center',
            border: [false, false, false, false]
          },    
          ], [{
            text: 'Telefono 04-2011018, correo juanforerod@gmail.com',
            style: 'fondoFooter',
            alignment: 'center',
            border: [false, false, false, true]
          },    
          ],    
        ],
      },	
      fillColor: "#eeeeee",    
    };
  }

  mostrarC(e){
    if(this.seleccion){
      var x = document.getElementById("esconder");
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    }else{
      var x = document.getElementById("esconder");
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    }
    
  }

  crearProveedor(){
    console.log("mostrando lcint"+JSON.stringify(this.ordenDeCompra.proveedor))
    if(this.ordenDeCompra.proveedor._id) {
      this.proveedoresService.updateProveedor(this.ordenDeCompra.proveedor).subscribe(
        res => {
          console.log(res + "entre por si");
        },
        err => {
          Swal.fire({
            title: err.error,
            text: 'Revise e intente nuevamente',
            icon: 'error'
          })
        })
    } else {
      this.proveedoresService.newProveedor(this.ordenDeCompra.proveedor).subscribe(
        res => {
          console.log(res + "entre por si");
        },
        err => {
          Swal.fire({
            title: err.error,
            text: 'Revise e intente nuevamente',
            icon: 'error'
          })
        })
    }
  }

  guardarOrden(){
    this.ordenesService.newOrden(this.ordenDeCompra).subscribe(
      res => {
        console.log(res + "entre por si");
        this.actualizarFactureroOrden()
        this.crearPDF()
      },
      err => {
        Swal.fire({
          title: err.error,
          text: 'Revise e intente nuevamente',
          icon: 'error'
        })
      }) 
  }

  actualizarFactureroOrden(){
    this.contadores[0].ordenesCompra_Ndocumento = this.ordenDeCompra.documento
    this.contadoresService.updateContadoresIDOrdenes(this.contadores[0]).subscribe(
      res => {
        console.log(res + "entre por si");
      },
      err => {
        Swal.fire({
          title: err.error,
          text: 'Revise e intente nuevamente',
          icon: 'error'
        })
      })
  }




  generarSolicitudDeCompra(e) {
    this.ordenDeCompra.msjAdmin=" "
    var contpro=0
    var contVal=0
    this.ordenDeCompra.n_orden =0
    this.ordenDeCompra.secuencia=" "
    this.ordenDeCompra.fechaAP=this.now.toLocaleDateString()
    var bandera:boolean=true
    this.productosComprados.forEach(element => {
      contpro++
      if(element.total==0)
        bandera=false
    });

    if(contpro>=1 &&bandera){
    this.ordenDeCompra.proveedor.nombre_proveedor= this.mensaje2
    this.ordenDeCompra.fecha = this.now.toLocaleDateString()
    this.ordenDeCompra.fechaEntrega = this.now3.toLocaleDateString()
    this.ordenDeCompra.costeUnitaTransport=this.costeUnitaTransport
    this.ordenDeCompra.otrosCostosGen=this.otrosCostosGen
    
    if(this.seleccion){
      this.ordenDeCompra.tipo= "Entregado"
      this.ordenDeCompra.factPro= this.factproveedor
    }
    
    this.ordenDeCompra.otrosDescuentosGen=this.otrosDescuentosGen
    this.ordenDeCompra.productosComprados=this.productosComprados
    this.ordenDeCompra.estado="Pendiente"
    if(this.comprasForm.instance.validate().isValid){
      let grabar = true
      this.proveedores.forEach(element => {
        if(element.ruc == this.ordenDeCompra.proveedor.ruc)
          grabar = false
      });
      this.setearNFactura()
      new Promise<any>((resolve, reject) => {
        this.crearProveedor()
        this.guardarOrden()
        this.productosComprados.forEach(element => {
          element.orden_compra = 0
          element.solicitud_n = this.ordenDeCompra.documento
          element.descGeneral=this.otrosDescuentosGen
          element.descProducto=element.desct
          var cant=0
          cant= element.nombreComercial.bodegaProveedor+ element.cantidad
          element.nombreComercial.bodegaProveedor=cant

          if(this.seleccion){
            
          }else{
          }

        });
      });
      this.mostrarMensaje()
    }else{
      Swal.fire(
        'Error',
        'Error al crear el documento',
        'error'
      )
    }
  } else{
    Swal.fire(
      'Error',
      'Error no hay productos en la lista',
      'error'
    )

  }
  
    }

    contadorValidaciones(i:number){
      if(this.productosComprados.length==i)
          this.crearPDF()

    }






//------------1481
traerTransaccionesPorProducto(nombreProducto: producto,numero : number) {
    this.invetarioP = [];
    this.mostrarLoading = true;
    this.proTransaccion.nombre = nombreProducto.PRODUCTO;
    this.transaccionesService.getTransaccionesPorProducto(this.proTransaccion)
      .subscribe((res) => {
        this.transacciones = res as transaccion[];
        this.cargarDatosProductoUnitario(nombreProducto,numero);
      });
  }


  cargarDatosProductoUnitario(nombreProducto : producto , numero : number) {
    var contCajas = 0;
    var contCajas2 = 0;
    var contCajas3 = 0;
    var contPiezas = 0;
    var contPiezas2 = 0;
    var contPiezas3 = 0;

    this.transacciones.forEach((element) => {
      if ( nombreProducto.PRODUCTO == element.producto && element.sucursal == "matriz") {
        switch (element.tipo_transaccion) {
          case "devolucion":
            contCajas = Number(element.cajas) + contCajas;
            contPiezas = Number(element.piezas) + contPiezas;
            break;
          case "compra-dir":
            contCajas = Number(contCajas) + Number(element.cajas);
            contPiezas = Number(contPiezas) + Number(element.piezas);
            break;
          case "compra":
            contCajas = Number(contCajas) + Number(element.cajas);
            contPiezas = Number(contPiezas) + Number(element.piezas);
            break;
          case "compra_obs":
            contCajas = Number(contCajas) + Number(element.cajas);
            contPiezas = Number(contPiezas) + Number(element.piezas);
            break;
          case "ajuste-faltante":
            contCajas = Number(contCajas) - Number(element.cajas);
            contPiezas = Number(contPiezas) - Number(element.piezas);
            break;
          case "baja":
            contCajas = Number(contCajas) - Number(element.cajas);
            contPiezas = Number(contPiezas) - Number(element.piezas);
            break;
          case "venta-fact":
            contCajas = Number(contCajas) - Number(element.cajas);
            contPiezas = Number(contPiezas) - Number(element.piezas);
            break;
          case "venta-not":
            contCajas = Number(contCajas) - Number(element.cajas);
            contPiezas = Number(contPiezas) - Number(element.piezas);
            break;
          case "traslado1":
            contCajas = Number(contCajas) - Number(element.cajas);
            contPiezas = Number(contPiezas) - Number(element.piezas);
            break;
          case "traslado2":
            contCajas = Number(contCajas) + Number(element.cajas);
            contPiezas = Number(contPiezas) + Number(element.piezas);
            break;
          case "ajuste-sobrante":
            contCajas = Number(contCajas) + Number(element.cajas);
            contPiezas = Number(contPiezas) + Number(element.piezas);

            break;
          default:
        }
      } else if ( nombreProducto.PRODUCTO == element.producto && element.sucursal == "sucursal1") {
        switch (element.tipo_transaccion) {
          case "devolucion":
            contCajas2 = Number(element.cajas) + contCajas2;
            contPiezas2 = Number(element.piezas) + contPiezas2;
            break;
          case "compra-dir":
            contCajas2 = Number(contCajas2) + Number(element.cajas);
            contPiezas2 = Number(contPiezas2) + Number(element.piezas);
            break;
          case "compra":
            contCajas2 = Number(contCajas2) + Number(element.cajas);
            contPiezas2 = Number(contPiezas2) + Number(element.piezas);
            break;
          case "compra_obs":
            contCajas2 = Number(contCajas2) + Number(element.cajas);
            contPiezas2 = Number(contPiezas2) + Number(element.piezas);
            break;
          case "ajuste-faltante":
            contCajas2 = Number(contCajas2) - Number(element.cajas);
            contPiezas2 = Number(contPiezas2) - Number(element.piezas);
            break;
          case "baja":
            contCajas2 = Number(contCajas2) - Number(element.cajas);
            contPiezas2 = Number(contPiezas2) - Number(element.piezas);
            break;
          case "venta-fact":
            contCajas2 = Number(contCajas2) - Number(element.cajas);
            contPiezas2 = Number(contPiezas2) - Number(element.piezas);
            break;
          case "venta-not":
            contCajas2 = Number(contCajas2) - Number(element.cajas);
            contPiezas2 = Number(contPiezas2) - Number(element.piezas);
            break;
          case "traslado1":
            contCajas2 = Number(contCajas2) - Number(element.cajas);
            contPiezas2 = Number(contPiezas2) - Number(element.piezas);
            break;
          case "traslado2":
            contCajas2 = Number(contCajas2) + Number(element.cajas);
            contPiezas2 = Number(contPiezas2) + Number(element.piezas);
            break;
          case "ajuste-sobrante":
            contCajas2 = Number(contCajas2) + Number(element.cajas);
            contPiezas2 = Number(contPiezas2) + Number(element.piezas);
            break;
          default:
        }
      } else if ( nombreProducto.PRODUCTO == element.producto && element.sucursal == "sucursal2") {
        switch (element.tipo_transaccion) {
          case "devolucion":
            contCajas3 = Number(element.cajas) + contCajas3;
            contPiezas3 = Number(element.piezas) + contPiezas3;
            break;
          case "compra-dir":
            contCajas3 = Number(contCajas3) + Number(element.cajas);
            contPiezas3 = Number(contPiezas3) + Number(element.piezas);
            break;
          case "compra":
            contCajas3 = Number(contCajas3) + Number(element.cajas);
            contPiezas3 = Number(contPiezas3) + Number(element.piezas);
            break;
          case "compra_obs":
            contCajas3 = Number(contCajas3) + Number(element.cajas);
            contPiezas3 = Number(contPiezas3) + Number(element.piezas);
            break;
          case "ajuste-faltante":
            contCajas3 = Number(contCajas3) - Number(element.cajas);
            contPiezas3 = Number(contPiezas3) - Number(element.piezas);
            break;
          case "baja":
            contCajas3 = Number(contCajas3) - Number(element.cajas);
            contPiezas3 = Number(contPiezas3) - Number(element.piezas);
            break;
          case "venta-fact":
            contCajas3 = Number(contCajas3) - Number(element.cajas);
            contPiezas3 = Number(contPiezas3) - Number(element.piezas);
            break;
          case "venta-not":
            contCajas3 = Number(contCajas3) - Number(element.cajas);
            contPiezas3 = Number(contPiezas3) - Number(element.piezas);
            break;
          case "traslado1":
            contCajas3 = Number(contCajas3) - Number(element.cajas);
            contPiezas3 = Number(contPiezas3) - Number(element.piezas);
            break;
          case "traslado2":
            contCajas3 = Number(contCajas3) + Number(element.cajas);
            contPiezas3 = Number(contPiezas3) + Number(element.piezas);
            break;
          case "ajuste-sobrante":
            contCajas3 = Number(contCajas3) + Number(element.cajas);
            contPiezas3 = Number(contPiezas3) + Number(element.piezas);
            break;

          default:
        }
      }
    });
    var cantidadRestante = 0;
    this.invetarioProd = new inventario();
    this.invetarioProd.producto = nombreProducto;
    this.invetarioProd.cantidadCajas = contCajas;
    this.invetarioProd.cantidadCajas2 = contCajas2;
    this.invetarioProd.cantidadCajas3 = contCajas3;

    this.invetarioProd.cantidadPiezas = contPiezas;
    this.invetarioProd.cantidadPiezas2 = contPiezas2;
    this.invetarioProd.cantidadPiezas3 = contPiezas3;
    this.invetarioP.push(this.invetarioProd);


    contCajas = 0;
    contPiezas = 0;
    contCajas2 = 0;
    contPiezas2 = 0;
    contCajas3 = 0;
    contPiezas3 = 0;
    
    this.transformarM2_1(numero);
  }



  transformarM2_1(numero: number) {
    this.invetarioP.forEach((element) => {
      element.cantidadM2 = parseFloat( (element.producto.M2 * element.cantidadCajas +(element.cantidadPiezas * element.producto.M2) / element.producto.P_CAJA ).toFixed(2));
      element.cantidadM2b2 = parseFloat(
        (
          element.producto.M2 * element.cantidadCajas2 +
          (element.cantidadPiezas2 * element.producto.M2) / element.producto.P_CAJA
        ).toFixed(2)
      );
      element.cantidadM2b3 = parseFloat(
        (
          element.producto.M2 * element.cantidadCajas3 +
          (element.cantidadPiezas3 * element.producto.M2) / element.producto.P_CAJA
        ).toFixed(2)
      );
      element.totalb1 = parseFloat( (element.cantidadM2 * element.producto.precio).toFixed(2) );
      element.totalb2 = parseFloat((element.cantidadM2b2 * element.producto.precio).toFixed(2));
      element.totalb3 = parseFloat( (element.cantidadM2b3 * element.producto.precio).toFixed(2));
    });
    this.cambiarValores2(numero);
  }


  cambiarValores2(numero : number) {
    this.invetarioP.forEach((element) => {
      element.cantidadCajas = Math.trunc( element.cantidadM2 / element.producto.M2);
      element.cantidadPiezas = parseInt(
        (
          (element.cantidadM2 * element.producto.P_CAJA) / element.producto.M2 -
          element.cantidadCajas * element.producto.P_CAJA
        ).toFixed(0)
      );
      element.cantidadM2 = parseFloat(element.cantidadM2.toFixed(2));

      element.cantidadCajas2 = Math.trunc( element.cantidadM2b2 / element.producto.M2);
      element.cantidadPiezas2 = parseInt(
        (
          (element.cantidadM2b2 * element.producto.P_CAJA) /
            element.producto.M2 -
          element.cantidadCajas2 * element.producto.P_CAJA
        ).toFixed(0)
      );
      element.cantidadM2b2 = parseFloat(element.cantidadM2b2.toFixed(2));

      element.cantidadCajas3 = Math.trunc( element.cantidadM2b3 / element.producto.M2);
      element.cantidadPiezas3 = parseInt(
        (
          (element.cantidadM2b3 * element.producto.P_CAJA) /
            element.producto.M2 -
          element.cantidadCajas3 * element.producto.P_CAJA
        ).toFixed(0)
      );
      element.cantidadM2b3 = parseFloat(element.cantidadM2b3.toFixed(2));
    });

    switch (this.ordenDeCompra.sucursal.nombre) {
      case "matriz":
        this.productosComprados[numero].disponible = this.invetarioP[0].cantidadM2;
        break;
      case "sucursal1":
        this.productosComprados[numero].disponible = this.invetarioP[0].cantidadM2b2;
        break;
      case "sucursal2":
        this.productosComprados[numero].disponible = this.invetarioP[0].cantidadM2b3;
        break;
      default:
    }

    if(this.productosComprados[numero].disponible < 0)
      this.productosComprados[numero].disponible = 0
    
    this.mostrarLoading = false;
  }




    
  

}

