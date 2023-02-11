import { Component, OnInit } from '@angular/core';
import { factura, venta } from '../ventas/venta';
import pdfMake from 'pdfmake/build/pdfmake';
import { parametrizacionsuc } from '../parametrizacion/parametrizacion';
import { ParametrizacionesService } from 'src/app/servicios/parametrizaciones.service';
import { FacturasService } from 'src/app/servicios/facturas.service';
import { ProformasService } from 'src/app/servicios/proformas.service';
import { NotasVentasService } from 'src/app/servicios/notas-ventas.service';
import Swal from 'sweetalert2';
import { user } from '../user/user';
import { AuthenService } from 'src/app/servicios/authen.service';
import { objDate } from '../transacciones/transacciones';
import { AuthService } from 'src/app/shared/services';
import { DatosConfiguracionService } from 'src/app/servicios/datosConfiguracion.service';

@Component({
  selector: 'app-registros-ventas',
  templateUrl: './registros-ventas.component.html',
  styleUrls: ['./registros-ventas.component.scss']
})
export class RegistrosVentasComponent implements OnInit {
  facturas:factura[]=[]
  facturasGlobales:factura[]=[]
  facturasTraidas:factura[]=[]
  notasVenta:factura[]=[]
  notasVentaGlobales:factura[]=[]
  cotizaciones:factura[]=[]
  cotizacionesGlobales:factura[]=[]
  factura:factura
  productosVendidos:venta[]=[]
  productosVendidos2:venta[]=[]
  tDocumento:string
  parametrizaciones:parametrizacionsuc[]=[]
  parametrizacionSucu:parametrizacionsuc
  correo:string
  nowdesde: Date = new Date();
  nowhasta: Date = new Date();
  tituloBusqueda  = "Facturas Generadas"
  mostrarSeccionFacturas = true;
  mostrarSeccionNotasVenta = false;
  mostrarSeccionCotizacion = false;
  tipoBusqueda = "Factura"

  menu2: string[] = [
    "Facturas",
    "Notas de Venta",
    "Cotizaciones"
  ];

  obj:objDate
  subtotal1:number=0
  Sdescuento:number=0
  subtotal2:number=0
  sIva0:number=0
  sIva12:number=0
  iva:number=0
  mostrarLoading:boolean=true;
  usuarioLogueado:user
  numeroFactura:string=""
  imagenLogotipo= ''
  mensajeLoading = "Cargando"

  constructor(public parametrizacionService:ParametrizacionesService,
    public authService: AuthService, 
    public notasventaService:NotasVentasService, 
    public facturasService:FacturasService,
    public authenService:AuthenService,
    public _configuracionService : DatosConfiguracionService,
    public proformasService:ProformasService) { 
    this.factura = new factura()
    this.obj = new objDate()
  }

  ngOnInit() {
    this.cargarUsuarioLogueado()
    this.setearFechaMensual()
    this.traerParametrizaciones()
    this.traerDatosConfiguracion()
  }

   traerDatosConfiguracion() {
    this._configuracionService.getDatosConfiguracion().subscribe((res) => {
      this.imagenLogotipo = res[0].urlImage;
    });
  }

  traerParametrizaciones(){
    this.parametrizacionService.getParametrizacion().subscribe(res => {
      this.parametrizaciones = res as parametrizacionsuc[];
   })
  }

  traerFacturas(){
    this.facturasGlobales=[]
    this.mostrarLoading=true;
    this.facturasService.getFacturas().subscribe(res => {
      this.facturasGlobales = res as factura[];
      this.separarRegistrosFacturas()
   })
  }

  traerProformas(){
    this.cotizacionesGlobales=[]
    this.mostrarLoading = true;
    this.proformasService.getProformas().subscribe(res => {
      this.cotizacionesGlobales = res as factura[];
      this.separarRegistrosCotizaciones()
   })
  }

  traerNotasVenta(){
    this.notasVentaGlobales=[]
    this.mostrarLoading = true;
    this.notasventaService.getNotasVentas().subscribe(res => {
      this.notasVentaGlobales = res as factura[];
      this.separarRegistrosNotasVenta()
   })
  }

  //Transacciones realizadas en el mes----->
  traerFacturasMensuales(){
    this.facturasGlobales=[]
    this.mostrarLoading=true;
    this.facturasService.getFacturasMensuales(this.obj).subscribe(res => {
      this.facturasGlobales = res as factura[];
      this.separarRegistrosFacturas()
   })
  }

  traerProformasMensuales(){
    this.cotizacionesGlobales=[]
    this.mostrarLoading = true;
    this.proformasService.getProformasMensuales(this.obj).subscribe(res => {
      this.cotizacionesGlobales = res as factura[];
      this.separarRegistrosCotizaciones()
   })
  }

  traerNotasVentaMensuales(){
    this.notasVentaGlobales=[]
    this.mostrarLoading=true;
    this.notasventaService.getNotasVentasMensuales(this.obj).subscribe(res => {
      this.notasVentaGlobales = res as factura[];
      this.separarRegistrosNotasVenta()
   })
  }


  setearFechaMensual(){
    var fechaHoy = new Date();
    var fechaAnterior = new Date();
    fechaHoy.setDate(fechaHoy.getDate() + 1);
    fechaAnterior.setDate(fechaHoy.getDate() - 30);
    this.obj = new objDate();
    this.obj.fechaActual = fechaHoy;
    this.obj.fechaAnterior = fechaAnterior;
  }


  cargarUsuarioLogueado() {
    new Promise((res, err) => {
      if (localStorage.getItem("maily") != '')
        this.correo = localStorage.getItem("maily");

      this.authenService.getUserLogueado(this.correo)
        .subscribe(
          res => {
            this.usuarioLogueado = res as user;
            if(this.usuarioLogueado[0].status == "Inactivo")
              this.authService.logOut();

            this.traerFacturasMensuales()
          },
          err => {}
        )
    });
  }

  separarRegistrosFacturas(){
    if(this.usuarioLogueado[0].rol!="Administrador"){
      switch (this.usuarioLogueado[0].sucursal) {
        case "matriz":
          this.facturasGlobales.forEach(element=>{
            if(element.sucursal == "matriz"){
              this.facturas.push(element)
            }
          })
          break;
        case "sucursal1":
          this.facturasGlobales.forEach(element=>{
            if(element.sucursal == "sucursal1"){
              this.facturas.push(element)
            }
          })
          break;
        case "sucursal2":
          this.facturasGlobales.forEach(element=>{
            if(element.sucursal == "sucursal2"){
              this.facturas.push(element)
            }
          })
            break;
        default:
          break;
      }
    }else{
      this.facturas=this.facturasGlobales
    }
    this.mostrarLoading=false;
  }



  traerRegistrosPorRango() {
    this.facturas = [];
    this.notasVenta = [];
    this.cotizaciones = [];
    this.mostrarLoading = true;
    this.obj = new objDate();
    this.obj.fechaActual = this.nowhasta;
    this.obj.fechaAnterior = this.nowdesde;
    this.obj.fechaAnterior.setHours(0, 0, 0, 0);
    switch (this.tipoBusqueda) {
      case "Factura":
        this.facturasService.getFacturasPorRango(this.obj).subscribe(res => {
          this.facturasGlobales = res as factura[];
          this.separarRegistrosFacturas();
        })
        break;
      case "Nota de Venta":
        this.notasventaService.getNotasVentaPorRango(this.obj).subscribe(res => {
          this.notasVentaGlobales = res as factura[];
          this.separarRegistrosNotasVenta();
        })
        break;
      case "Cotizacion":
        this.proformasService.getProformasPorRango(this.obj).subscribe(res => {
          this.cotizacionesGlobales = res as factura[];
          this.separarRegistrosCotizaciones();
        })
        break;
    
      default:
        break;
    }
  }



  traerValoresGlobales(){
    switch (this.tipoBusqueda) {
      case "Factura":
        this.traerFacturas();
        break;
      case "Nota de Venta":
        this.traerNotasVenta();
        break;
      case "Cotizacion":
        this.traerProformas();
        break;
      default:
        break;
    }
  }



  separarRegistrosNotasVenta(){
    if(this.usuarioLogueado[0].rol!="Administrador"){
      switch (this.usuarioLogueado[0].sucursal) {
        case "matriz":
          this.notasVentaGlobales.forEach(element=>{
            if(element.sucursal == "matriz"){
              this.notasVenta.push(element)
            }
          })
          break;
        case "sucursal1":
          this.notasVentaGlobales.forEach(element=>{
            if(element.sucursal == "sucursal1"){
              this.notasVenta.push(element)
            }
          })
          break;
        case "sucursal2":
          this.notasVentaGlobales.forEach(element=>{
            if(element.sucursal == "sucursal2"){
              this.notasVenta.push(element)
            }
          })
            break;
        default:
          break;
      }
    }else{
      this.notasVenta=this.notasVentaGlobales
    }
    this.mostrarLoading = false;
  }

  separarRegistrosCotizaciones(){
    if(this.usuarioLogueado[0].rol!="Administrador"){
      switch (this.usuarioLogueado[0].sucursal) {
        case "matriz":
          this.cotizacionesGlobales.forEach(element=>{
            if(element.sucursal == "matriz"){
              this.cotizaciones.push(element)
            }
          })
          break;
        case "sucursal1":
          this.cotizacionesGlobales.forEach(element=>{
            if(element.sucursal == "sucursal1"){
              this.cotizaciones.push(element)
            }
          })
          break;
        case "sucursal2":
          this.cotizacionesGlobales.forEach(element=>{
            if(element.sucursal == "sucursal2"){
              this.cotizaciones.push(element)
            }
          })
            break;
        default:
          break;
      }
    }
    else
      this.cotizaciones=this.cotizacionesGlobales
    
    this.mostrarLoading=false;
  }



  getCourseFile = (e) => {  
    this.cargarFactura(e.row.data)  
  }
  getCourseFile2 = (e) => {  
    this.cargarNotaVenta(e.row.data)  
  }
  getCourseFile3 = (e) => {  
    this.cargarCotización(e.row.data)  
  }

  mostrarNotas = (e) => {  
    this.popupNotas(e.row.data)  
  }

  mostrarNotasCtiza= (e) => {  
    this.popupNotasCoti(e.row.data)  
  }

  mostrarNotasVenta= (e) => {  
    this.popupNotasVenta(e.row.data)  
  }

  popupNotasVenta(e){
    Swal.fire({
      title: "Notas",
      icon: 'warning',
      input: 'textarea',
      inputValue: e.nota,
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        e.nota=result.value
        this.notasventaService.actualizarNota(e,result.value).subscribe( res => {
          Swal.fire({
            title: 'Correcto',
            text: 'Su proceso se realizó con éxito',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            window.location.reload()
          })}, err => {alert("error")})
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  popupNotasCoti(e){
    Swal.fire({
      title: "Notas",
      icon: 'warning',
      input: 'textarea',
      inputValue: e.nota,
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        e.nota=result.value
        this.proformasService.actualizarNota(e,result.value).subscribe( res => {
          Swal.fire({
            title: 'Correcto',
            text: 'Su proceso se realizó con éxito',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            window.location.reload()
          })}, err => {alert("error")})
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  popupNotas(e){
    Swal.fire({
      title: "Notas",
      icon: 'warning',
      input: 'textarea',
      inputValue: e.nota,
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        e.nota=result.value
        this.facturasService.actualizarNota(e,result.value).subscribe( res => {
          Swal.fire({
            title: 'Correcto',
            text: 'Su proceso se realizó con éxito',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            window.location.reload()
          })}, err => {alert("error")})
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Se ha cancelado su proceso.',
          'error'
        )
      }
    })
  }

  cargarFactura(e){
    this.mostrarMensaje();
    this.limpiarArregloPFact()
    this.facturas.forEach(element=>{
      if(e.documento_n == element.documento_n){
        this.factura= element
        this.productosVendidos2=this.factura.productosVendidos
      }
    })
    
    this.productosVendidos.forEach(element=>{
      if(element.factura_id== e.documento_n && element.tipoDocumentoVenta=="Factura"){
        this.productosVendidos2.push(element)
      }
    })
    this.parametrizaciones.forEach(element=>{
      if(element.sucursal == this.factura.sucursal)
        this.parametrizacionSucu= element

    })
    this.tDocumento="Factura"
    
    try {
      this.crearPDF(e)
    } catch(e) {
      Swal.fire({
        title: 'Error',
        text: 'Estimado usuario hay un error al generar su documento, por favor contactese con el área de sistemas',
        icon: 'error',
      })
    }
  }

  //cargar Nota de Venta
  cargarNotaVenta(e){
    this.mostrarMensaje();
    this.limpiarArregloPFact()
    this.notasVenta.forEach(element=>{
      if(e.documento_n == element.documento_n){
       this.factura= element
       this.productosVendidos2=element.productosVendidos
      }
    })
    
    this.parametrizaciones.forEach(element=>{
      if(element.sucursal == this.factura.sucursal){
        this.parametrizacionSucu= element
      }
    })
    this.tDocumento="NOTA DE VENTA 001"
    try {
      this.crearPDF(e)
    } catch(e) {
      Swal.fire({
        title: 'Error',
        text: 'Estimado usuario hay un error al generar su documento, por favor contactese con el área de sistemas',
        icon: 'error',
      })
    }
  }


  //cargar Cotizacion
  cargarCotización(e){
    this.mostrarMensaje();
    this.limpiarArregloPFact()
    this.cotizaciones.forEach(element=>{
      if(e.documento_n == element.documento_n){
       this.factura= element
       this.productosVendidos2=element.productosVendidos
      }
    })

    this.parametrizaciones.forEach(element=>{
      if(element.sucursal == this.factura.sucursal){
        this.parametrizacionSucu= element
      }
    })
    this.tDocumento="PROFORMA 000 001"
    try {
      this.crearPDF(e)
    } catch(e) {
      Swal.fire({
        title: 'Error',
        text: 'Estimado usuario hay un error al generar su documento, por favor contactese con el área de sistemas',
        icon: 'error',
      })
    }
  }
  


  opcionMenu(e){
    this.setearFechaMensual();
    switch (e.value) {
      case "Facturas":
        this.tituloBusqueda = "Facturas Generadas"
        this.tipoBusqueda = "Factura"
        this.mostrarSeccionFacturas = true;
        this.mostrarSeccionNotasVenta = false;
        this.mostrarSeccionCotizacion = false;
        this.traerFacturasMensuales();
       break;
  
      case "Notas de Venta":
        this.tituloBusqueda = "Notas de Venta Generadas"
        this.tipoBusqueda = "Nota de Venta"
        this.traerNotasVentaMensuales();
        this.mostrarSeccionFacturas = false;
        this.mostrarSeccionNotasVenta = true;
        this.mostrarSeccionCotizacion = false;
        break;

      case "Cotizaciones":
        this.tituloBusqueda = "Cotizaciones Generadas"
        this.tipoBusqueda = "Cotizacion"
        this.traerProformasMensuales();
        this.mostrarSeccionFacturas = false;
        this.mostrarSeccionNotasVenta = false;
        this.mostrarSeccionCotizacion = true;
        break;
      default:    
    }     
  }


  mostrarMensaje(){
    let timerInterval
      Swal.fire({
        title: 'Descargando Documento...',
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

      })
  }



  crearPDF(e){
    this.factura.username = this.factura.nombreUsuario == undefined ? this.factura.username : this.factura.nombreUsuario
    this.factura.nombreVendedor = this.factura.nombreVendedor == undefined ? " " : this.factura.nombreVendedor
    if(this.tDocumento == "Factura"){
      const documentDefinition = this.getDocumentDefinition();
      var generacion = new Promise<any>((resolve, reject) => {
        pdfMake.createPdf(documentDefinition).download('Factura '+e.documento_n, function(response) {
          Swal.close(),
          Swal.fire({
            title: 'Descarga completa',
            text: 'Se descargó su documento con éxito',
            icon: 'success',
          })
        });
      })

    }else if(this.tDocumento == "NOTA DE VENTA 001"){
      const documentDefinition = this.getDocumentDefinitionNotaVenta();
      pdfMake.createPdf(documentDefinition).download('Nota de Venta '+e.documento_n, function(response) { 
        Swal.close(),
        Swal.fire({
          title: 'Descarga completa',
          text: 'Se descargó su documento con éxito',
          icon: 'success',
        })
      });

    }else if(this.tDocumento == "PROFORMA 000 001"){
      const documentDefinition = this.getDocumentDefinitionCotizacion();
      pdfMake.createPdf(documentDefinition).download('Proforma '+e.documento_n, function(response) { 
        Swal.close(),
        Swal.fire({
          title: 'Descarga completa',
          text: 'Se descargó su documento con éxito',
          icon: 'success',
        })
      });
    }
  }


  limpiarArregloPFact(){
    var cont=0
    this.productosVendidos2.forEach(element=>{
      cont++
    })
    if(cont>=0){
      this.productosVendidos2.forEach(element=>{
        this.productosVendidos2.splice(0)
      })
    }
  }

  onExporting (e) {
    e.component.beginUpdate();
    e.component.columnOption("fecha2", "visible", true);
    e.component.columnOption("cliente.ruc", "visible", true);
    e.component.columnOption("tipo_venta", "visible", true);
    e.component.columnOption("cotizacion", "visible", true);
    e.component.columnOption("username", "visible", true);
    e.component.columnOption("coste_transportea", "visible", true);
    e.component.columnOption("maestro", "visible", true);
    e.component.columnOption("observaciones", "visible", true); 
    e.component.columnOption("nota", "visible", true); 
  };
  onExported (e) {
    e.component.columnOption("fecha2", "visible", false);
    e.component.columnOption("cliente.ruc", "visible", false);
    e.component.columnOption("tipo_venta", "visible", false);
    e.component.columnOption("cotizacion", "visible", false);
    e.component.columnOption("username", "visible", false);
    e.component.columnOption("coste_transportea", "visible", false);
    e.component.columnOption("maestro", "visible", false);
    e.component.columnOption("observaciones", "visible", false);
    e.component.columnOption("nota", "visible", false);
    e.component.endUpdate();
  }

  calcularValoresFactura(){
   this.subtotal1=(((this.factura.total+this.factura.coste_transporte)-this.factura.coste_transporte)/1.12)+this.factura.coste_transporte
   this.Sdescuento=this.factura.subtotalF1-this.factura.subtotalF2
   this.subtotal2=this.subtotal1-this.Sdescuento
   this.sIva0= this.factura.coste_transporte;
   this.sIva12=this.subtotal2-this.sIva0
   this.iva= this.sIva12*0.12
  }

  setearNFactura(){
    let nf=this.factura.documento_n
    let num=('' + nf).length
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
          break;    
      default:
    }
   }



   getDocumentDefinitionCotizacion() {
    this.setearNFactura()
    this.calcularValoresFactura()
    sessionStorage.setItem('resume', JSON.stringify("jj"));
    return {
      pageSize: 'A4',
      content: [
        {
          columns: [{
          image:this.imagenLogotipo,
          width: 100,
          margin: [0, 20, 0, 10],
          },
          {
            width:410,
            margin: [0, 20, 0, 10],
            text: "Fecha:   "+this.factura.fecha2,
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
              text: "Fecha de impresión: "+this.factura.fecha, fontSize:10
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
              columns: [{
              width:300,
              text: " "+this.tDocumento,
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
              columns: [{
              width:300,
              text: "Fecha de Autorización "+this.parametrizacionSucu.fecha,
            },
            {
              width:215,
              text: "Usuario: "+ this.factura.username,
              alignment:"right"
            },
            ]
            
            },{
            //Desde aqui comienza los datos del cliente
            style: 'tableExample',
            table: {
              widths: [100,395],
              body: [
                [
                  {
                    stack: [
                      {
                        type: 'none',
                        bold: true,
                        ul: [
                          'Cliente',
                          'Contacto',
                          "Dirección",
                          "Teléfonos",
                          "Fecha/Cad"
                        ]
                      }
                    ]
                  },
                  [{
                    stack: [
                      {
                        type: 'none',
                        ul: [
                          ''+this.factura.cliente.cliente_nombre,
                          ''+this.factura.cliente.direccion,
                          ''+this.factura.cliente.direccion,
                          ''+this.factura.cliente.celular,
                          ''+this.factura.fecha2,
                        ]
                      }
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
       
        
        this.getProductosVendidosCotizacion(this.productosVendidos2),
        {
          //espacio en blanco despues de detalle de productos
          text: " ",
        },
        {
          text:"Otros valores",
          style: 'texto6'
        },
        this.getOtrosValores(),
  
        {
          //absolutePosition: {x: 40, y: 600},
          columns: [{
            type: 'none',
            style: 'tableExample',
            table: {
              widths: [250],
              heights:70,
              body: [
                [
                  {
                    stack: [
                      {
                        type: 'none',
                        fontSize: 9,
                        ul: [
                          {text:'Vendedor: ' + this.factura.nombreVendedor, alignment:'left'},
                          {text: 'Observaciones: '+this.factura.observaciones+ " / "}
                        ]
                      }
                    ]
                  }
                ]
              ]
            },    
        },
        {
          //Desde aqui comienza los datos del cliente
          style: 'tableExample4',
          table: {
            widths: [125,100],
            body: [
              [ { text: 'Valor', bold: true ,style: "detalleTotales"}, {text:this.subtotal1.toFixed(2), style:"totales" }],
              [ { text: 'Otros descuentos', bold: true ,style: "detalleTotales"}, {text:this.Sdescuento.toFixed(2), style:"totales" } ],
              [ { text: 'Subtotal', bold: true, style: "detalleTotales" }, {text:this.subtotal2.toFixed(2), style:"totales" } ],
              [ { text: 'Total', bold: true, style: "detalleTotales" }, {text:this.factura.total.toFixed(2), style:"totales" } ]
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
          texto6: {
            fontSize: 14,
            bold: true,
            alignment: "center"
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
            margin: [10, 5, 0, 15]
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


  getProductosVendidosCotizacion(productos: venta[]) {
    return {
      table: {
        widths: ["8%","6%","54%","10%","9%","13%"],
        alignment:'center',
        body: [
          
          [{
            text: 'Cant.',
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
            return [ { text: ed.cantidad, alignment: 'center' },{text:ed.producto.UNIDAD,fontSize:8,alignment:"center"},ed.producto.nombre_comercial, {text:ed.precio_venta.toFixed(2), alignment:"center"}, {text:ed.descuento, alignment:"center"}, {text:ed.total.toFixed(2), alignment:"right",style:"totales2"}];
            
          }),          
        ]
      }
    };
  }


  getDocumentDefinition() {
    this.setearNFactura()
    this.calcularValoresFactura()
    sessionStorage.setItem('resume', JSON.stringify("jj"));
    let tipoDocumento="Factura";
    return {
      pageSize: 'A4',
      content: [
        {
          columns: [{
           image:this.imagenLogotipo,
          width: 100,
          margin: [0, 20, 0, 10],
          },
          {
            width:410,
            margin: [0, 20, 0, 10],
            text: "Fecha:   "+this.factura.fecha2,
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
              text: "Fecha de impresión: "+this.factura.fecha, fontSize:10
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
              text: "FACTURA 001-001-000 ",
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
              columns: [{
              width:300,
              text: "Fecha de Autorización "+this.parametrizacionSucu.fecha,
            },
            {
              width:215,
              text: "Usuario: "+ this.factura.username,
              alignment:"right"
            },
            ]
            
            },{
            //Desde aqui comienza los datos del cliente
            style: 'tableExample',
            table: {
              widths: [100,395],
              body: [
                [
                  {
                    stack: [
                      {
                        type: 'none',
                        bold: true,
                        ul: [
                          'Cliente',
                          'Contacto',
                          "Dirección",
                          "Teléfonos"
                        ]
                      }
                    ]
                  },
                  [{
                    stack: [
                      {
                        type: 'none',
                        ul: [
                          ''+this.factura.cliente.cliente_nombre,
                          ''+this.factura.cliente.direccion,
                          ''+this.factura.cliente.direccion,
                          ''+this.factura.cliente.celular,
                        ]
                      }
                    ]
                  },
                  ],
                 
                ]
              ]
            }
            },

            //aqui termina
            
            
            
            ],
            [
              
            ]
          ]
        },
       
        
        this.getProductosVendidos(this.productosVendidos2),
        {
          //espacio en blanco despues de detalle de productos
          text: " ",
        },
        {
          text:"Otros valores",
          style: 'texto6'
        },
        this.getOtrosValores(),
  
  
        {
          //absolutePosition: {x: 40, y: 600},
          columns: [{

            type: 'none',
            ul: [
                  {
                    style: 'tableExample2',
                    table: {
                      widths: [250],
                      heights:70,
                      body: [
                        [
                          {
                            stack: [
                              {
                                type: 'none',
                                fontSize: 9,
                                ul: [
                                  {text:'Vendedor: ' + this.factura.nombreVendedor, alignment:'left'},
                                  {text: 'Observaciones: '+this.factura.observaciones+ " / "}
                                ]
                              }
                            ]
                          }
                        ]
                      ]
                    },

                  },{
                    style: 'tableExample3',
                  
                    table: {
                      widths: ["*"],
                      heights:40,
                      body: [
                        [
                          {
                            stack: [
                              {
                                type: 'none',
                                
                                fontSize: 8,
                                ul: [
                                  'Nota: despues de 30 dias no se aceptan reclamos ni devoluciones',
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
              [ { text: 'Subtotal', bold: true ,style: "detalleTotales"}, {text: this.factura.subtotalF1.toFixed(2), style:"totales" }],
              [ { text: 'Otros descuentos', bold: true ,style: "detalleTotales"}, {text:this.Sdescuento.toFixed(2), style:"totales" } ],
              [ { text: 'Subtotal', bold: true, style: "detalleTotales" }, {text: this.factura.subtotalF2.toFixed(2), style:"totales" } ],
              [ { text: 'Tarifa 0', bold: true , style: "detalleTotales" }, {text:this.sIva0.toFixed(2), style:"totales" } ],
              [ { text: 'Tarifa 12', bold: true ,style: "detalleTotales"}, {text: this.factura.subtotalF2.toFixed(2) , style:"totales" }],
              [ { text: '12% IVA', bold: true ,style: "detalleTotales"}, {text: this.factura.totalIva.toFixed(2), style:"totales" } ],
              [ { text: 'Total', bold: true, style: "detalleTotales" }, {text:this.factura.total.toFixed(2), style:"totales" } ]
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



  getDocumentDefinitionNotaVenta() {
    this.setearNFactura()
    this.calcularValoresFactura()
    sessionStorage.setItem('resume', JSON.stringify("jj"));
    let tipoDocumento="Factura";
    return {
      pageSize: 'A4',
      content: [
        {
          columns: [{
          image:this.imagenLogotipo,
          width: 100,
          margin: [0, 20, 0, 10],
          },
          {
            width:410,
            margin: [0, 20, 0, 10],
            text: "Fecha:   "+this.factura.fecha2,
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
              text: "Fecha de impresión: "+this.factura.fecha, fontSize:10
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
              columns: [{
              width:300,
              text: " "+this.tDocumento,
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
              columns: [{
              width:300,
              text: "Fecha de Autorización "+this.parametrizacionSucu.fecha,
            },
            {
              width:215,
              text: "Usuario: " + this.factura.username,
              alignment:"right"
            },
            ]
            
            },{
            //Desde aqui comienza los datos del cliente
            style: 'tableExample',
            table: {
              widths: [100,395],
              body: [
                [
                  {
                    stack: [
                      {
                        type: 'none',
                        bold: true,
                        ul: [
                          'Cliente',
                          'Contacto',
                          "Dirección",
                          "Teléfonos"
                        ]
                      }
                    ]
                  },
                  [{
                    stack: [
                      {
                        type: 'none',
                        ul: [
                          ''+this.factura.cliente.cliente_nombre,
                          ''+this.factura.cliente.direccion,
                          ''+this.factura.cliente.direccion,
                          ''+this.factura.cliente.celular,
                        ]
                      }
                    ]
                  },
                  ],
                 
                ]
              ]
            }
            },

            //aqui termina
            
            
            
            ],
            [
              
            ]
          ]
        },
       
        
        this.getProductosVendidos(this.productosVendidos2),
        {
          //espacio en blanco despues de detalle de productos
          text: " ",
        },
        {
          text:"Otros valores",
          style: 'texto6'
        },
        this.getOtrosValores(),
  
        {
          //absolutePosition: {x: 40, y: 600},
          columns: [{

            type: 'none',
            style: 'tableExample',
                    table: {
                      widths: [250],
                      heights:70,
                      body: [
                        [
                          {
                            stack: [
                              {
                                type: 'none',
                                fontSize: 9,
                                ul: [
                                  {text:'Vendedor: ' + this.factura.nombreVendedor, alignment:'left'},
                                  {text: 'Observaciones: '+this.factura.observaciones+ " / "}
                                ]
                              }
                            ]
                          }
                        ]
                      ]
                    },    
        },
        {
          //Desde aqui comienza los datos del cliente
          style: 'tableExample4',
         
          table: {
            widths: [125,100],
            body: [
              [ { text: 'Valor', bold: true ,style: "detalleTotales"}, {text:this.subtotal1.toFixed(2), style:"totales" }],
              [ { text: 'Otros descuentos', bold: true ,style: "detalleTotales"}, {text:this.Sdescuento.toFixed(2), style:"totales" } ],
              [ { text: 'Subtotal', bold: true, style: "detalleTotales" }, {text:this.subtotal2.toFixed(2), style:"totales" } ],
              [ { text: 'Total', bold: true, style: "detalleTotales" }, {text:this.factura.total.toFixed(2), style:"totales" } ]
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
          texto6: {
            fontSize: 14,
            bold: true,
            alignment: "center"
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
            margin: [10, 5, 0, 15]
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
            text: ' '+this.factura.coste_transporte,
           
            alignment: 'center'
          },
          ],
          
        ]
      }
    };
  }


  getProductosVendidos(productos: venta[]){
    let productos2:venta[]=[]
    productos.forEach(element=>{
      if(element.entregar==true){
          element.tipoDocumentoVenta="E"
      }else{
        element.tipoDocumentoVenta="P"
      }
      productos2.push(element)
    })
    return {
      table: {
        widths: ["8%","6%","53%","9%","7%","13%","4%"],
        alignment:'center',
        body: [
          
          [{
            text: 'Cant.',
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
          
          {
            text: 'Est',
            style: 'tableHeader', 
            alignment: 'center'
          }
          ],
          
          ...productos2.map(ed =>{
            return [ { text: ed.cantidad, alignment: 'center' },{text:ed.producto.UNIDAD,fontSize:8,alignment:"center"},ed.producto.PRODUCTO, {text:ed.precio_venta.toFixed(2), alignment:"center"}, {text:ed.descuento, alignment:"center"}, {text:ed.total.toFixed(2), alignment:"right",style:"totales2"},
            {text:ed.tipoDocumentoVenta, alignment:"center",style:"totales2"}];
            
          }),
        ]
      }
    };
  }
}
