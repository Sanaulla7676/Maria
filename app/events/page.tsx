import Link from 'next/link'
import { Gift, Sparkles, Building2, Wand2, ArrowRight, CheckCircle2 } from 'lucide-react'
import { eventTypes, mariaServices } from '@/lib/maria-business'
import { Reveal } from '@/app/_components/ui/Reveal'
import { ParallaxHero } from '@/app/_components/ui/ParallaxHero'
import { HorizontalScrollGallery } from '@/app/_components/ui/HorizontalScrollGallery'

const serviceIcons = [Gift, Sparkles, Wand2, Building2]

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ submitted?: string }> }) {
  const submitted = (await searchParams).submitted === '1'

  return (
    <main className="bg-white">

      {/* NEW LIVE EVENT STALL HERO VIDEO — existing event content remains below */}
      <section aria-label="Maria Perfumes live event stall hero video" className="relative w-full overflow-hidden bg-white">
        <div className="w-full">
          <video
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            className="block aspect-video w-full object-cover object-center"
            poster=""
          >
            <source src="https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/ea3c6a2a-5a7a-4117-9736-8fe6b535ea00.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* PARALLAX HERO */}
      <ParallaxHero video="/hero-video2.mp4">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-5">
          <span className="text-white font-semibold text-xs uppercase tracking-[0.3em] bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/50 inline-block text-wine-700">
            Maria Events &amp; Gifting
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-white leading-tight">
            Make your celebration <span className="gold-text-gradient font-semibold">smell unforgettable</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-light max-w-xl mx-auto leading-relaxed">
            Premium return gifts, customized fragrances and dedicated live perfume stalls for weddings, Haldi, birthdays and corporate events.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-bold uppercase tracking-wider">
            <a href="#event-enquiry" className="gold-button-gradient text-white px-7 py-3.5 rounded-full shadow-xl hover:scale-105 transition flex items-center gap-2">
              Plan an Event <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <Link href="/shop" className="bg-white/90 backdrop-blur-sm text-wine-800 px-7 py-3.5 rounded-full border border-champagne-400/50 hover:border-champagne-400 transition">
              Shop Signature Perfumes
            </Link>
          </div>
        </div>
      </ParallaxHero>

      {/* SERVICES — horizontal scroll story */}
      <section className="editorial-shell pt-20">
        <Reveal className="text-center max-w-2xl mx-auto space-y-3 mb-4 px-6">
          <span className="text-wine-600 font-semibold text-xs uppercase tracking-[0.2em]">Maria Services</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#10243a]">Return-Gift Perfume Stalls</h2>
          <p className="text-sm text-slate-600 font-light">Scroll to explore how we bring the fragrance bar to your event.</p>
        </Reveal>
        <HorizontalScrollGallery>
          {mariaServices.map((service, i) => {
            const Icon = serviceIcons[i % serviceIcons.length]
            return (
              <div
                key={service.title}
                className="w-[78vw] sm:w-[420px] shrink-0 h-[60vh] max-h-[460px] bg-gradient-to-br from-white to-[#eef7ff] border border-wine-200 rounded-[2.5rem] p-10 flex flex-col justify-between shadow-2xl"
              >
                <div>
                  <span className="text-wine-500/70 font-serif text-sm">{String(i + 1).padStart(2, '0')}</span>
                  <div className="w-14 h-14 rounded-2xl gold-button-gradient text-white flex items-center justify-center text-xl shadow-lg my-5">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#10243a] mb-3">{service.title}</h3>
                  <p className="text-sm text-slate-600 font-light leading-relaxed">{service.description}</p>
                </div>
              </div>
            )
          })}
        </HorizontalScrollGallery>
      </section>

      {/* EVENT TYPES */}
      <section className="editorial-shell py-16 border-y border-champagne-500/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal className="text-center space-y-3 mb-10">
            <span className="text-wine-600 font-semibold text-xs uppercase tracking-[0.2em]">Choose Your Occasion</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white">Every celebration, one signature scent</h2>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {eventTypes.map((type, i) => (
              <Reveal key={type} delay={i * 0.06}>
                <div className="bg-[#eef7ff] border border-wine-200 rounded-2xl py-6 text-center text-wine-700 font-serif font-semibold text-lg hover:border-champagne-400 hover:scale-105 transition-all">
                  {type}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ENQUIRY */}
      <section id="event-enquiry" className="max-w-4xl mx-auto px-6 lg:px-8 py-20">
        <Reveal className="text-center space-y-3 mb-10">
          <span className="text-wine-600 font-semibold text-xs uppercase tracking-[0.2em]">Request a Quotation</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wine-950">
            {submitted ? 'Enquiry received.' : "Let's design the gifting around your event."}
          </h2>
          <p className="text-sm text-slate-500 font-light">
            {submitted ? 'Maria has received your request. Keep your phone available for follow-up.' : 'Share the essentials — Maria can follow up with product, customization, stall and bulk-order options.'}
          </p>
        </Reveal>

        {submitted ? (
          <Reveal className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm p-6 rounded-3xl flex items-center gap-3 justify-center">
            <CheckCircle2 className="h-5 w-5 shrink-0" /> Your event enquiry was submitted successfully.
          </Reveal>
        ) : (
          <Reveal className="bg-white border border-slate-200/80 shadow-sm rounded-3xl p-8">
            <form action="/api/events/enquiry" method="post" className="grid gap-4 sm:grid-cols-2 text-xs">
              <label className="space-y-1.5">
                <span className="font-semibold text-slate-700 block">Name</span>
                <input name="name" required placeholder="Your name" className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-wine-800" />
              </label>
              <label className="space-y-1.5">
                <span className="font-semibold text-slate-700 block">WhatsApp / Phone</span>
                <input name="phone" required placeholder="+91" className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-wine-800" />
              </label>
              <label className="space-y-1.5">
                <span className="font-semibold text-slate-700 block">Email</span>
                <input name="email" type="email" placeholder="you@example.com" className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-wine-800" />
              </label>
              <label className="space-y-1.5">
                <span className="font-semibold text-slate-700 block">Event Type</span>
                <select name="eventType" defaultValue="Wedding" className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none font-medium">
                  {eventTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="font-semibold text-slate-700 block">Event Date</span>
                <input name="eventDate" type="date" className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none" />
              </label>
              <label className="space-y-1.5">
                <span className="font-semibold text-slate-700 block">Guest Count</span>
                <input name="guestCount" type="number" min="1" placeholder="Approx. guests" className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none" />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="font-semibold text-slate-700 block">Venue / City</span>
                <input name="venue" placeholder="Event location" className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none" />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="font-semibold text-slate-700 block">Customization</span>
                <input name="customization" placeholder="Bottle, label, logo, packaging..." className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none" />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="font-semibold text-slate-700 block">Tell us more</span>
                <textarea name="message" rows={4} placeholder="What are you looking for?" className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none resize-none" />
              </label>
              <button type="submit" className="sm:col-span-2 gold-button-gradient text-white font-bold py-3.5 rounded-xl uppercase tracking-wider shadow-md hover:opacity-95 transition mt-2">
                Request Quote
              </button>
            </form>
          </Reveal>
        )}
      </section>
    </main>
  )
}
