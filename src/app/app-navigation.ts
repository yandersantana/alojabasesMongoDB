export const navigation = [
  {
    text: 'Home',
    path: '/home',
    icon: 'home'
  },
  {
    text: 'Comercial',  
    icon: 'home',
    items: [{
        text: 'Ventas',
        path: '/ventas',
        }, {
          text: 'Registros Ventas',
          path:"/registrosVentas"
        }, {
          text: 'Cambios',
          path:"/cambios"
        }, {
          text: 'Devoluciones',
          path:"/devoluciones"    
         }, {
          text: 'Entrega Productos',
          path:"/Entrega_productos"    
         }
  ]
  },
  {
    text: 'Inventarios',  
    icon: 'home',
    items: [{
        text: 'Transacciones',
        path: '/transacciones',
        }, {
          text: 'Consolidado',
          path: '/consolidado',
        }, {
          text: 'Traslados',
          path: '/traslados',
        },{
          text: 'Catalago',
          path: '/catalogo',   
        },
         {
          text: 'Bajas',
          path: '/bajas',
         
    }]
  },
  {
    text: 'Compras',  
    icon: 'home',
    items: [{
        text: 'Generar OC',
        path: '/compras',
       
      },{
        text: 'Ordenes de compra',
        path: '/OrdenCompra',
       
      }, {
        text: 'Fact Proveedor',
        path: '/proveedores',
       
      }, {
        text: 'Remisiones',
        path: '/productos',
       
      }]
  },
/*   {
    text: 'Administración',  
    icon: 'home',
    items: [{
        text: 'Anulaciones',
        path: '/anulaciones',
      }, {
        text: 'Cierres',
      
      }, {
        text: 'Parametrización',
        path: '/parametrizacion',
      }, {
        text: 'Usuarios',
        path: '/usuarios',
      }, 
      {
        text: 'Caja menor',
      
      }]
  }, */
  {
    text: 'Profile',
    path: '/profile',
    icon: 'home'
  },

];



export const navigationAdmin = [
  {
    text: 'Home',
    path: '/home',
    icon: 'home'
  },
  {
    text: 'Herramientas',
    icon: 'home',
    items: [{
      text: 'Calculadora',
      path: '/calculadora',
      }]
  },
  {
    text: 'Comercial',  
    icon: 'fa fa-check-circle-o',
    items: [{
        text: 'Ventas',
        path: '/ventas',
        }, {
          text: 'Registros Ventas',
          path:"/registrosVentas"
        }, {
          text: 'Cambios',
          path:"/cambios"
        }, {
          text: 'Devoluciones',
          path:"/devoluciones"    
         }, {
          text: 'Entrega Productos',
          path:"/Entrega_productos"    
         }
  ]
  },
  {
    text: 'Inventarios',  
    icon: 'contentlayout',
    items: [{
        text: 'Transacciones',
        path: '/transacciones',
        }, {
          text: 'Consolidado',
          path: '/consolidado',
        }, {
          text: 'Traslados',
          path: '/traslados',
        },{
          text: 'Catalago',
          path: '/catalogo',   
        },
         {
          text: 'Bajas',
          path: '/bajas',
         
    }]
  },
  {
    text: 'Compras',  
    icon: 'money',
    items: [{
        text: 'Generar OC',
        path: '/compras',
       
      },{
        text: 'Ordenes de compra',
        path: '/OrdenCompra',
       
      }, {
        text: 'Fact Proveedor',
        path: '/proveedores',
       
      }, {
        text: 'Remisiones',
        path: '/productos',
       
      }]
  },
  {
    text: 'Administración',  
    icon: 'fa fa-lock',
    items: [ {
        text: 'Cierres',
      
      }, {
        text: 'Parametrización',
        items: [{
          text: 'Anulaciones',
         
        }, {
          text: 'Cierres',
        
        }, {
          text: 'Presentación',
        }, 
        {
          text: 'Datos Fuente',
          path:"/parametrizacion",
        },
        {
          text: 'IVA',
        
        },
        {
          text: 'Matriz Precios',
          path: '/precios',
        }]
        
      }, 
      {
        text: 'Usuarios',
        path: '/usuarios',
      },
      {
        text: 'Clientes',
        path: '/clientes',
      },
      {
        text: 'Bodegas',
        path: '/bodegas',
      },
      /* {
        text: 'Control Precios',
        path: '/precios',
      }, */
     ]
  },
  {
    text: 'Financiero',  
    icon: 'fa fa-money',
    items: [{
        text: 'P&G Negocio',
        path: '',
       
      },{
        text: 'Indicadores',
        path: '',
       
      }]
  },
  {
    text: 'Contable',  
    icon: 'fa fa-bar-chart',
    items: [{
        text: 'Caja menos',
        path: '',
       
      },{
        text: 'Registros Caja',
        path: '',
       
      }, {
        text: 'Recibos de Caja',
        path: '',
       
      }, {
        text: 'Cuentas por Cobrar',
        path: '',
      }, {
        text: 'Cuentas por Pagar',
        path: '',
      }, {
        text: 'Anulaciones',
        path: '/anulaciones',
      }, {
        text: 'Activos Fijos',
        path: '',
      }]
  },
  {
    text: 'Auditorias',  
    icon: 'fa fa-list-alt',
    items: [{
        text: 'Auditorias de Inventario',
        path: '/auditorias',
       
      }]
  },
  {
    text: 'Recurso Humano',  
    icon: 'fa fa-users',
    items: [{
        text: 'Creación colaboradores',
        path: '',
      },{
        text: 'Ficha Personal',
        path: '',      
      },{
        text: 'Administración Personal',
        path: '',      
      },{
        text: 'Novedades Personal',
        path: '',      
      }]
  },
  {
    text: 'Operaciones',  
    icon: 'fa fa-spinner',
    items: [{
        text: 'Tiquets',
        path: '',
      }]
  },
  {
    text: 'Tutoriales',
    path: '',
    icon: 'home'
  },
  {
    
  },
  {
    
  },

];
