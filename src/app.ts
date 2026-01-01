import express, { Application, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import sequelize, { testConnection } from './config/database';
import routes from './routes';
import setupAssociations from './models/associations';
import { setupSocketIO } from './config/socket.config';
import { iniciarCronSeguros } from './controllers/seguros.controller';
import notificacionRoutes from './routes/notificacion.routes';
import contratoRoutes from './routes/contrato.routes';
import segurosRoutes from './routes/seguros.routes';
import exportRoutes from './routes/export.routes';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app: Application = express();

// Middlewares globales
app.use(helmet()); // Seguridad
app.use(cors({
  origin: [
    'http://localhost:4200', // Angular
    'http://localhost:5173', // Vite
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ].filter((url, index, self) => self.indexOf(url) === index), // Eliminar duplicados
  credentials: true,
}));
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded

// Rutas
app.use('/api', routes);
app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/contratos', contratoRoutes);
app.use('/api/seguros', segurosRoutes);
app.use('/api/export', exportRoutes);

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API del Sistema de Control de Activos',
    version: '1.0.0',
  });
});

// Ruta para verificar estado
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Manejo de rutas no encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Manejo de errores global
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
});

// Puerto
const PORT = process.env.PORT || 5000;

// Crear servidor HTTP (necesario para Socket.IO)
const httpServer = http.createServer(app);

// Configurar Socket.IO
const io = setupSocketIO(httpServer);

// Iniciar servidor
const startServer = async () => {
  try {
    // Probar conexión a base de datos
    await testConnection();

    // Configurar asociaciones entre modelos
    setupAssociations();

    // Sincronizar modelos (solo en desarrollo)
    // NOTA: Deshabilitado temporalmente - usar migraciones SQL manuales
    // if (process.env.NODE_ENV === 'development') {
    //   await sequelize.sync({ alter: false });
    //   console.log('✅ Modelos sincronizados con la base de datos');
    // }
    console.log('✅ Usando migraciones SQL manuales (sync deshabilitado)');

    // Iniciar servidor HTTP
    httpServer.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log(`🔌 WebSocket activo`);
      
      // Iniciar cron jobs
      iniciarCronSeguros();
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

// Iniciar
startServer();

export default app;
export { io }; // Exportar para usar en otros servicios