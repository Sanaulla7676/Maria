import Link from 'next/link'
import { Gift, Sparkles, Building2, Wand2, ArrowRight, CheckCircle2 } from 'lucide-react'
import { eventTypes, mariaServices } from '@/lib/maria-business'
import { Reveal } from '@/app/_components/ui/Reveal'
import { HorizontalScrollGallery } from '@/app/_components/ui/HorizontalScrollGallery'

const serviceIcons = [Gift, Sparkles, Wand2, Building2]

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ submitted?: string }> }) {
  const submitted = (await searchParams).submitted === '1'

  return (
    <main className="events-page min-h-screen overflow-hidden bg-[#f7fbf8] text-[#123d3a]">
      <header className="sticky top-0 z-50 border-b border-[#0d5b55]/10 bg-[#f8fbf9]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[66px] max-w-[1560px] items-center justify-between px-4 sm:px-7 lg:px-10">
          <Link href="/" className="flex items-center gap-3" aria-label="Maria Perfumes home">
            <img src="https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/68b3ce37-06f1-4cb2-8192-c830549bf3c4.jpg" alt="Maria Perfumes" className="h-12 w-11 rounded-lg object-contain" draggable={false} />
            <span className="hidden text-[9px] font-extrabold uppercase tracking-[0.24em] text-[#184b47] sm:block">Live Event Stall</span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {[
              ['Home', '/'],
              ['Live Stall', '#live-stall'],
              ['Services', '#services'],
              ['Occasions', '#occasions'],
              ['Enquiry', '#event-enquiry'],
            ].map(([label, href]) => (
              <a key={label} href={href} className="events-nav-link text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#184b47]">
                {label}
              </a>
            ))}
          </nav>
          <a href="#event-enquiry" className="inline-flex items-center gap-2 rounded-full bg-[#d6ae52] px-5 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#173b38] shadow-[0_10px_30px_rgba(214,174,82,.22)] transition hover:-translate-y-0.5 hover:bg-[#e4be63]">
            Plan Your Stall <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </header>


      {/* NEW LIVE EVENT STALL HERO VIDEO — existing event content remains below */}
      <section id="live-stall" aria-label="Maria Perfumes live event stall hero video" className="relative h-[calc(100svh-66px)] min-h-[72svh] overflow-hidden bg-[#0e4f4a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(255,255,255,.14),transparent_24rem),radial-gradient(circle_at_82%_12%,rgba(214,174,82,.16),transparent_26rem)]" />
        <div className="relative flex h-full w-full flex-col justify-end">
          <div className="group relative h-full w-full overflow-hidden bg-black">
            <video
              autoPlay
              muted
              playsInline
              loop
              preload="auto"
              className="absolute inset-0 block h-full w-full object-cover object-center transition duration-[1800ms] ease-out"
            >
              <source src="https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/772e3639-f09b-45b6-8125-8e528496296a.mp4" type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#063c38]/75 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-6 max-w-2xl sm:bottom-12 sm:left-10 lg:left-14">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.30em] text-[#efd488]">Maria Perfumes · Live Event Experience</p>
              <h1 className="mt-2 font-serif text-3xl font-semibold leading-[.98] text-white sm:text-5xl lg:text-6xl">Bring the fragrance experience to your event.</h1>
              <a href="#event-enquiry" className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#efd488]/70 bg-[#d6ae52] px-5 py-3 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#173b38] shadow-lg transition hover:-translate-y-0.5">
                Plan Your Stall <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
          <span className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 text-[8px] font-bold uppercase tracking-[0.3em] text-white/55">Scroll to explore</span>
        </div>
      </section>

      {/* HERO MESSAGE */}
      <section className="relative overflow-hidden border-b border-[#0d5b55]/10 bg-[#f7fbf8]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_.8fr] lg:items-end lg:py-20">
          <Reveal>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.30em] text-[#0b6a63]">Maria Events &amp; Gifting</span>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-[1.01] text-[#123d3a] sm:text-5xl lg:text-6xl">
              A fragrance experience people
              <span className="block text-[#0b6a63]">remember after the event.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-xl text-sm leading-7 text-[#5a6e6a]">
              Discover, sample, personalize and take home a scent experience built into your celebration. The stall becomes part of the event, not just another display counter.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SERVICES — horizontal scroll story */}
      <section id="services" className="relative overflow-hidden bg-[#f7fbf8] py-20 lg:py-24">
        <Reveal className="text-center max-w-2xl mx-auto space-y-3 mb-4 px-6">
          <span className="text-[#0b6a63] font-semibold text-xs uppercase tracking-[0.2em]">Maria Services</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#10243a]">Return-Gift Perfume Stalls</h2>
          <p className="text-sm text-slate-600 font-light">Scroll to explore how we bring the fragrance bar to your event.</p>
        </Reveal>
        <HorizontalScrollGallery>
          {mariaServices.map((service, i) => {
            const Icon = serviceIcons[i % serviceIcons.length]
            return (
              <div
                key={service.title}
                className="event-card-glow w-[78vw] shrink-0 rounded-[2rem] border border-[#0d5b55]/10 bg-white p-8 shadow-[0_20px_60px_rgba(20,76,70,.08)] transition duration-500 hover:-translate-y-2 sm:w-[420px] sm:rounded-[2.5rem] sm:p-10"
              >
                <div>
                  <span className="text-[#0b6a63]/70 font-serif text-sm">{String(i + 1).padStart(2, '0')}</span>
                  <div className="w-14 h-14 rounded-2xl bg-[#0e4f4a] text-[#efd488] flex items-center justify-center text-xl shadow-lg my-5">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#123d3a] mb-3">{service.title}</h3>
                  <p className="text-sm text-[#607875] font-light leading-relaxed">{service.description}</p>
                </div>
              </div>
            )
          })}
        </HorizontalScrollGallery>
      </section>

      {/* LIVE STALL VIDEO */}
      <section className="relative overflow-hidden border-t border-[#0d5b55]/10 bg-[#eef6f3] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.30em] text-[#0b6a63]">Maria Live in Action</span>
              <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-[#123d3a] sm:text-4xl">
                See the experience, not just the stall.
              </h2>
            </div>
            <p className="max-w-md text-xs leading-6 text-[#607875]">
              A real glimpse of how guests discover, sample and create their Maria fragrance experience at a live event.
            </p>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-[#0d5b55]/10 bg-black shadow-[0_28px_80px_rgba(20,76,70,.14)]">
            <video
              autoPlay
              muted
              playsInline
              loop
              preload="metadata"
              controls={false}
              className="block aspect-video h-auto w-full object-cover"
            >
              <source
                src="https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/c773e119-170f-4d5c-b7ce-e9defb3d3f8f.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>
      </section>

      {/* EVENT TYPES */}
      <section id="occasions" className="relative overflow-hidden border-y border-[#0d5b55]/10 bg-[#0e4f4a] py-16 text-white lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal className="max-w-2xl space-y-3 mb-10">
            <span className="text-wine-600 font-semibold text-xs uppercase tracking-[0.2em]">Choose Your Occasion</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-white">Every celebration, one signature scent.</h2>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {eventTypes.map((type, i) => (
              <Reveal key={type} delay={i * 0.06}>
                <div className="group rounded-2xl border border-white/10 bg-white/[0.055] py-6 text-center font-serif text-lg font-semibold text-white shadow-[0_14px_40px_rgba(0,0,0,.10)] transition duration-500 hover:-translate-y-1 hover:border-[#efd488]/45 hover:bg-white/[0.09]">
                  {type}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM QR */}
      <section className="relative overflow-hidden border-t border-[#0d5b55]/10 bg-white py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 md:grid-cols-[1fr_auto]">
          <div className="max-w-xl">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.30em] text-[#0b6a63]">Follow the live experience</span>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-[1.02] text-[#123d3a] sm:text-5xl">
              See Maria Perfume Bar
              <span className="block text-[#0b6a63]">behind the event.</span>
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#5a6e6a]">
              Scan the QR code to visit our Instagram, discover live-event moments, perfume experiences and the latest Maria Perfume Bar updates.
            </p>
            <a
              href="https://instagram.com/maria_perfumebar_"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0e4f4a] px-6 py-3 text-[10px] font-extrabold uppercase tracking-[0.17em] text-white shadow-[0_10px_30px_rgba(14,79,74,.18)] transition hover:-translate-y-0.5 hover:bg-[#0b6a63]"
            >
              @maria_perfumebar_ <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="group relative w-full max-w-[300px] justify-self-center rounded-[30px] border border-[#0d5b55]/10 bg-[#f7fbf8] p-4 shadow-[0_25px_65px_rgba(20,76,70,.12)] sm:p-5 md:justify-self-end">
            <div className="overflow-hidden rounded-[22px] bg-white">
              <img
                src="https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/e2f7c174-8154-44c6-bf29-5120821e3879.png"
                alt="Scan to follow Maria Perfume Bar on Instagram"
                className="block h-auto w-full object-contain transition duration-500 group-hover:scale-[1.01]"
                draggable={false}
              />
            </div>
            <p className="mt-3 text-center text-[8px] font-extrabold uppercase tracking-[0.22em] text-[#0b6a63]">
              Scan · Follow · Discover
            </p>
          </div>
        </div>
      </section>

      {/* ENQUIRY */}
      <section id="event-enquiry" className="relative overflow-hidden bg-[#f4f0e7] px-0 py-20 lg:py-24">
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
          <Reveal className="rounded-[30px] border border-[#1d3936]/10 bg-white p-8 shadow-[0_25px_70px_rgba(38,61,57,.10)] sm:p-10">
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
