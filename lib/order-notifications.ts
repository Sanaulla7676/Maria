import { z } from 'zod'

export const notificationEventSchema = z.enum([
  'payment_verified',
  'payment_failed',
  'order_processing',
  'order_shipped',
  'order_delivered',
  'order_cancelled',
])

export type NotificationEvent = z.infer<typeof notificationEventSchema>

export const notificationCopy: Record<NotificationEvent, { title: string; message: string }> = {
  payment_verified: { title: 'Payment verified', message: 'Your Maria payment has been verified and your order is moving to processing.' },
  payment_failed: { title: 'Payment needs attention', message: 'Your Maria payment could not be verified. Please review the payment details.' },
  order_processing: { title: 'Order processing', message: 'Your Maria order is now being prepared.' },
  order_shipped: { title: 'Order shipped', message: 'Your Maria order has shipped. Tracking details are available in your account.' },
  order_delivered: { title: 'Order delivered', message: 'Your Maria order has been marked delivered. Enjoy your fragrance.' },
  order_cancelled: { title: 'Order cancelled', message: 'Your Maria order has been cancelled.' },
}
