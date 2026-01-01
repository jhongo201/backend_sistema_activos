import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import NotificacionService from '../services/notificacion.service';

interface SocketWithUser extends Socket {
  user?: any;
}

/**
 * Configurar Socket.IO con autenticación JWT
 */
export const setupSocketIO = (httpServer: HTTPServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:4200',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Middleware de autenticación
  io.use((socket: SocketWithUser, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      socket.user = decoded;
      next();
    } catch (error) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  // Eventos de conexión
  io.on('connection', (socket: SocketWithUser) => {
    const usuarioId = socket.user?.UsuarioID;
    console.log(`✅ Usuario ${usuarioId} conectado al WebSocket`);

    // Unir al usuario a su room personal
    socket.join(`user_${usuarioId}`);

    // Evento: Cliente solicita marcar notificación como leída
    socket.on('notification:mark-read', async (notificacionId: number) => {
      try {
        // Aquí podrías llamar al servicio para marcar como leída
        console.log(`Marcando notificación ${notificacionId} como leída para usuario ${usuarioId}`);
        
        // Emitir confirmación al cliente
        socket.emit('notification:read-success', { notificacionId });
      } catch (error) {
        console.error('Error al marcar notificación:', error);
        socket.emit('notification:error', { message: 'Error al marcar notificación como leída' });
      }
    });

    // Evento: Cliente solicita marcar todas como leídas
    socket.on('notification:mark-all-read', async () => {
      try {
        console.log(`Marcando todas las notificaciones como leídas para usuario ${usuarioId}`);
        socket.emit('notification:all-read-success');
      } catch (error) {
        console.error('Error al marcar todas:', error);
        socket.emit('notification:error', { message: 'Error al marcar todas como leídas' });
      }
    });

    // Evento: Cliente solicita eliminar notificación
    socket.on('notification:delete', async (notificacionId: number) => {
      try {
        console.log(`Eliminando notificación ${notificacionId} para usuario ${usuarioId}`);
        socket.emit('notification:delete-success', { notificacionId });
      } catch (error) {
        console.error('Error al eliminar notificación:', error);
        socket.emit('notification:error', { message: 'Error al eliminar notificación' });
      }
    });

    // Desconexión
    socket.on('disconnect', () => {
      console.log(`❌ Usuario ${usuarioId} desconectado del WebSocket`);
    });
  });

  // Pasar instancia de Socket.IO al servicio de notificaciones
  NotificacionService.setIO(io);

  console.log('🔌 Socket.IO configurado correctamente');

  return io;
};

/**
 * Emitir notificación a un usuario específico
 * (puede ser llamado desde cualquier parte del backend)
 */
export const emitNotification = (io: SocketIOServer, usuarioId: number, notification: any) => {
  io.to(`user_${usuarioId}`).emit('notification:new', notification);
};