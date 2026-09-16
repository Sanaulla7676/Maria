import { MessageCircle, Phone } from 'lucide-react'

export function ChatWidget() {
  return (
    <div className="fixed right-[22px] bottom-[22px] z-[100] flex flex-col gap-3">
      <a
        href="https://wa.me/919916032291?text=Hi%20Maria%20Perfumes%2C%20I%27d%20like%20to%20know%20more%20about%20your%20fragrances."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="editorial-float-pulse w-[52px] h-[52px] rounded-full flex items-center justify-center text-white transition hover:scale-110"
        style={{ background: '#25d366' }}
      >
        <MessageCircle className="h-5 w-5" />
      </a>
      <a
        href="tel:+919916032291"
        aria-label="Call Maria Perfumes"
        className="editorial-float-pulse w-[52px] h-[52px] rounded-full flex items-center justify-center text-white transition hover:scale-110"
        style={{ background: '#111', animationDelay: '0.9s' }}
      >
        <Phone className="h-4 w-4" />
      </a>
    </div>
  )
}
