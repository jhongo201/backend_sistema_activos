import webpush, { PushSubscription } from 'web-push';

// Configurar VAPID solo si las claves están en el .env
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:tu-email@ejemplo.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  console.log('✅ Web Push VAPID configurado');
} else {
  console.warn('⚠️ VAPID keys no configuradas. Ejecuta generateVapidKeys() para generarlas');
}

/**
 * Generar claves VAPID (ejecutar solo una vez)
 * Guarda las claves en tu archivo .env
 */
export function generateVapidKeys() {
  const vapidKeys = webpush.generateVAPIDKeys();
  console.log('\n📧 Claves VAPID generadas:');
  console.log('Agrega estas claves a tu archivo .env:\n');
  console.log(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
  console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}\n`);
  return vapidKeys;
}

/**
 * Guardar suscripción de push
 * TODO: Implementar modelo de base de datos para suscripciones
 */
export async function saveSubscription(userId: number, subscription: PushSubscription) {
  console.log('💾 Guardando suscripción para usuario:', userId);
  console.log('Suscripción:', JSON.stringify(subscription));
  
  // TODO: Crear modelo PushSubscription y guardar en BD
  // await PushSubscription.create({
  //   UsuarioID: userId,
  //   Endpoint: subscription.endpoint,
  //   Keys: JSON.stringify(subscription.keys),
  //   FechaCreacion: new Date()
  // });
  
  return { success: true, message: 'Suscripción guardada' };
}

/**
 * Enviar notificación push a una suscripción específica
 */
export async function sendNotification(
  subscription: PushSubscription,
  payload: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: any;
  }
) {
  try {
    const notificationPayload = JSON.stringify({
      notification: {
        title: payload.title,
        body: payload.body,
        icon: payload.icon || '/icon-192x192.png',
        badge: payload.badge || '/badge-72x72.png',
        data: payload.data || {}
      }
    });

    await webpush.sendNotification(subscription, notificationPayload);
    console.log('✅ Notificación push enviada');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error al enviar notificación push:', error);
    
    // Si la suscripción expiró o es inválida, eliminarla de la BD
    if (error.statusCode === 410) {
      console.log('🗑️ Suscripción expirada, eliminar de BD');
      // TODO: Eliminar suscripción de la base de datos
    }
    
    throw error;
  }
}

/**
 * Enviar notificación a todos los dispositivos de un usuario
 * TODO: Implementar cuando tengamos el modelo de suscripciones
 */
export async function sendNotificationToUser(userId: number, payload: any) {
  console.log(`📤 Enviando notificación a usuario ${userId}`);
  
  // TODO: Obtener todas las suscripciones del usuario de la BD
  // const subscriptions = await PushSubscription.findAll({
  //   where: { UsuarioID: userId }
  // });
  
  // for (const sub of subscriptions) {
  //   try {
  //     await sendNotification(JSON.parse(sub.Keys), payload);
  //   } catch (error) {
  //     console.error('Error enviando a suscripción:', error);
  //   }
  // }
  
  return { success: true, message: 'Notificaciones enviadas' };
}