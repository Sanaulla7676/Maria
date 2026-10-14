export const MARIA_WHATSAPP_NUMBER = '919916032291'

export function buildMariaWhatsAppUrl(message: string): string {
  return `https://wa.me/${MARIA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
