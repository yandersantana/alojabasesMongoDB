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
  {
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
        text: 'Caja menor',
      
      }]
  },
  {
    text: 'Profile',
    path: '/profile',
    icon: 'home'
  },

];
