const express = require('express')
const app = express();
const cors = require('cors');
const path= require('path');

require('./database');

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(express.json());

const bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(express.static(path.join(__dirname,'frontend')));
app.use('/server/uploads', express.static('server/uploads'));

app.use('/usuario', require('./routes/userRoutes'));
app.use('/catalogo', require('./routes/catalogoRoutes'));
app.use('/clientes', require('./routes/clientesRoutes'));
app.use('/facturas', require('./routes/facturaRoutes'));
app.use('/proformas', require('./routes/proformasRoutes'));
app.use('/producto', require('./routes/productoRoutes'));
app.use('/opciones', require('./routes/opcionesCatRoutes'));
app.use('/sucursales', require('./routes/sucursalRoutes'));
app.use('/contadores', require('./routes/contadoresRoutes'));
app.use('/productosVendidos', require('./routes/productosVendidosRoutes'));
app.use('/productosComprados', require('./routes/productosCompradosRoutes'));
app.use('/productosPendientes', require('./routes/productosPendientesRoutes'));
app.use('/transaccion', require('./routes/transaccionesRoutes'));
app.use('/parametrizaciones', require('./routes/parametrizacionesRoutes'));
app.use('/proveedores', require('./routes/proveedorRoutes'));
app.use('/ordenesCompra', require('./routes/ordenCompraRoutes'));
app.use('/notasVenta', require('./routes/notasventaRoutes'));
app.use('/facturasProveedor', require('./routes/facturaProveedorRoutes'));
app.use('/detallePago', require('./routes/detallePagoRoutes'));
app.use('/pagoProveedor', require('./routes/pagoProveedorRoutes'));
app.use('/bodegas', require('./routes/bodegasRoutes'));
app.use('/remisiones', require('./routes/remisionRoutes'));
app.use('/productosObsequio', require('./routes/productosObsequioRoutes'));
app.use('/productosIngresados', require('./routes/productosIngresadosRoutes'));
app.use('/baja', require('./routes/bajasRoutes'));
app.use('/traslados', require('./routes/trasladosRoutes'));
app.use('/transportista', require('./routes/transportistaRoutes'));
app.use('/devoluciones', require('./routes/devolucionesRoutes'));
app.use('/productosEntregados', require('./routes/productosEntregadosRoutes'));
app.use('/documentoGenerado', require('./routes/documentoGeneradoRoutes'));
app.use('/upload', require('./routes/uploadRoutes'));
app.use('/precios', require('./routes/preciosRoutes'));
app.use('/auditorias', require('./routes/auditoriaRoutes'));
app.use('/auditoriasProductos', require('./routes/auditoriaProductoRoutes'));
app.use('/ingresosDiarios', require('./routes/ingresosRoutes'));
app.use('/reporteDetallado', require('./routes/reporteDetallado'));
app.use('/cuentas', require('./routes/cuentaRoutes'));
app.use('/subCuentas', require('./routes/subCuentaRoutes'));
app.use('/preciosEspeciales', require('./routes/precioEspecialRoutes'));
app.use('/transaccionFinanciera', require('./routes/transaccionesFinancierasRoutes'));
app.use('/reciboCaja', require('./routes/reciboCajaRoutes'));
app.use('/cuentaPorCobrar', require('./routes/cuentaPorCobrarRoutes'));
app.use('/cuentaPorPagar', require('./routes/cuentaPorPagarRoutes'));
app.use('/datosConfiguracion', require('./routes/datosConfiguracion'));
app.use('/comprobantePago', require('./routes/comprobantePagoRoutes'));
app.use('/centroCosto', require('./routes/centroCosto'));
app.use('/cajaMenor', require('./routes/cajaMenor'));
app.use('/beneficiario', require('./routes/beneficiario'));
app.use('/prestamos', require('./routes/prestamosRoutes'));
app.use('/comprobantePagoProveedor', require('./routes/comprobantePagoProveedores'));
app.use('/transaccionFacturas', require('./routes/transaccionesFacturasRoutes'));
app.use('/transaccionesCheques', require('./routes/transaccionesChequesRoutes'));
app.use('/cuentaBancaria', require('./routes/cuentaBancariaRoutes'));




//starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port 3000, Yes');
});

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});