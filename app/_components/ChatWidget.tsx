import { MessageCircle } from 'lucide-react'

export function ChatWidget() {
  return (
    <a
      href="https://wa.me/919916032291?text=Hi%20Maria%20Perfumes%2C%20I%27d%20like%20to%20know%20more%20about%20your%20fragrances."
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 wine-gradient text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl border border-champagne-400/40 flex items-center gap-2.5 hover:scale-105 transition"
    >
      <MessageCircle className="h-4 w-4 text-champagne-300" />
      <span className="text-xs font-semibold">Chat on WhatsApp</span>
    </a>
  )
}
