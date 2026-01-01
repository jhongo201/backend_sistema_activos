import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { saveSubscription, sendNotificationToUser } from '../services/push.service';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authMiddleware);

/**
 * Suscribir dispositivo a notificaciones push
 */
router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const subscription = req.body;
    const userId = (req as any).user.UsuarioID;
    
    console.log('📱 [PUSH] Nueva suscripción para usuario:', userId);
    
    await saveSubscription(userId, subscription);
    
    res.json({ success: true, message: 'Suscripción guardada exitosamente' });
  } catch (error: any) {
    console.error('❌ [PUSH] Error al guardar suscripción:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Enviar notificación push a un usuario
 */
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { userId, title, body, icon, data } = req.body;
    
    console.log('📤 [PUSH] Enviando notificación a usuario:', userId);
    console.log('   - Título:', title);
    console.log('   - Mensaje:', body);
    
    await sendNotificationToUser(userId, {
      title,
      body,
      icon,
      data
    });
    
    res.json({ success: true, message: 'Notificación enviada' });
  } catch (error: any) {
    console.error('❌ [PUSH] Error al enviar notificación:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Obtener la clave pública VAPID para el frontend
 */
router.get('/vapid-public-key', (req: Request, res: Response) => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  
  if (!publicKey) {
    return res.status(500).json({ 
      success: false, 
      message: 'VAPID public key no configurada' 
    });
  }
  
  res.json({ success: true, publicKey });
});

export default router;
