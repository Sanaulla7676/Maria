"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Heart, Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import type { Product, CartItem } from "@/lib/types";
import { toast } from "sonner";
import { getMariaFragrance, MARIA_PRICING } from "@/lib/maria-catalog";

const dayLabels = ["Day", "Night"];
const seasonIcons: Record<string, string> = { Winter: "❄", Spring: "✿", Summer: "☀", Autumn: "◒" };

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const profile = getMariaFragrance(slug);
  const [p, setP] = useState<Product | null>(null);
  const [vid, setVid] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabaseBrowser()
      .from("products")
      .select("*,product_images(*),product_variants(*)")
      .eq("slug", slug)
      .eq("active", true)
      .single()
      .then(({ data }) => {
        setP(data as Product);
        if (data?.product_variants?.[0]) setVid(data.product_variants[0].id);
      });
  }, [slug]);

  const activeVariants = p?.product_variants?.filter((x) => x.active) ?? [];
  const selectedVariant = activeVariants.find((x) => x.id === vid) ?? activeVariants[0];
  const size = selectedVariant?.size_ml ?? 30;
  const price = Number(selectedVariant?.price ?? MARIA_PRICING[size as 30 | 50 | 100]);
  const image = p?.product_images?.[0]?.image_url;
  const name = p?.name ?? profile?.name ?? "Maria Fragrance";
  const detail = profile;

  const add = () => {
    if (!p || !selectedVariant || selectedVariant.stock < 1) return toast.error("Currently unavailable");
    const old: CartItem[] = JSON.parse(localStorage.getItem("maria-cart") || "[]");
    const i = old.findIndex((x) => x.variantId === selectedVariant.id);
    if (i >= 0) old[i].quantity += quantity;
    else old.push({ productId: p.id, variantId: selectedVariant.id, productName: p.name, variantLabel: selectedVariant.label, price, quantity, imageUrl: image });
    localStorage.setItem("maria-cart", JSON.stringify(old));
    toast.success("Added to bag");
    router.push("/checkout");
  };

  if (!detail) return <main className="container py-32"><p>Loading fragrance…</p></main>;

  const rating = "Maria signature profile";

  return (
    <main className="min-h-screen pb-24">
      <div className="container py-7">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-black/60"><ArrowLeft size={15}/> Back to collection</Link>

        <section className="mt-7 overflow-hidden rounded-[32px] border border-[var(--line)] bg-[#eee7dc] shadow-luxe">
          <div className="px-5 pb-5 pt-7 md:px-9 md:pt-9">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="eyebrow">MARIA PERFUMES · SIGNATURE COLLECTION</p>
                <h1 className="font-display mt-2 text-5xl leading-none tracking-tight md:text-7xl">{name}</h1>
                <p className="mt-2 text-sm text-black/55">Maria 40% pure oil · inspired fragrance profile</p>
              </div>
              <button aria-label="Save fragrance" onClick={() => setSaved(!saved)} className={`rounded-full border p-3 transition ${saved ? "border-[var(--wine)] bg-[var(--wine)] text-white" : "border-black/15 bg-white/70"}`}><Heart size={18} fill={saved ? "currentColor" : "none"}/></button>
            </div>
          </div>

          <div className="grid gap-5 px-5 pb-5 md:grid-cols-[.82fr_1.18fr] md:px-9 md:pb-9">
            <div className="relative min-h-[430px] overflow-hidden rounded-[26px] bg-gradient-to-br from-[#d9c9b7] via-[#eee6dc] to-[#cbb9a6]">
              {image ? <img src={image} alt={name} className="h-full min-h-[430px] w-full object-cover"/> : (
                <div className="flex h-full min-h-[430px] items-center justify-center p-10">
                  <div className="text-center">
                    <div className="mx-auto mb-7 h-64 w-28 rounded-[28px] border border-black/15 bg-gradient-to-r from-[#201c1a] via-[#8b806f] to-[#201c1a] shadow-2xl">
                      <div className="mt-16 border-y border-[#d8bd7c]/70 py-3 text-[9px] tracking-[.28em] text-[#e4cf9b]">MARIA</div>
                    </div>
                    <p className="font-display text-2xl">{name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[.2em] text-black/40">Owner product image pending</p>
                  </div>
                </div>
              )}
              <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold tracking-[.16em]">40% PURE OIL</span>
            </div>

            <div className="space-y-4">
              <ProfileCard title="main accords">
                <div className="space-y-2">
                  {detail.accords.map((accord) => <div key={accord.label} className="relative h-11 overflow-hidden rounded-lg bg-white/70"><div className="absolute inset-y-0 left-0 rounded-lg bg-[var(--wine)]/90" style={{ width: `${accord.value}%` }}/><span className="relative z-10 flex h-full items-center px-4 text-sm font-medium text-white mix-blend-difference">{accord.label}</span></div>)}
                </div>
              </ProfileCard>

              <ProfileCard title="fragrance profile">
                <div className="grid gap-2 sm:grid-cols-2">
                  <Metric icon="⌛" label="Longevity" value="Up to 12 h" />
                  <Metric icon="≈" label="Projection" value="Good" />
                  <Metric icon="✦" label="Concentration" value="40%" />
                  <Metric icon="◉" label="Format" value="Pure oil" />
                </div>
              </ProfileCard>

              <ProfileCard title="day time">
                <div className="grid grid-cols-2 overflow-hidden rounded-lg bg-[#d7d2d2]">
                  {dayLabels.map((label) => { const value = label === "Day" ? detail.day : detail.night; return <div key={label} className="relative h-12 overflow-hidden"><div className="absolute inset-y-0 left-0 bg-[#b4d9ef]" style={{ width: `${value}%` }}/><span className="relative z-10 flex h-full items-center justify-center text-sm">{label === "Day" ? "☀" : "☾"} {label}</span></div> })}
                </div>
              </ProfileCard>

              <ProfileCard title="seasons">
                <div className="grid grid-cols-2 gap-2">
                  {detail.seasons.map((season) => <div key={season.label} className="relative h-12 overflow-hidden rounded-lg bg-[#d7d2d2]"><div className="absolute inset-y-0 left-0 bg-[#b9d9b1]" style={{ width: `${season.value}%` }}/><span className="relative z-10 flex h-full items-center gap-2 px-3 text-sm">{seasonIcons[season.label]} {season.label}</span></div>)}
                </div>
              </ProfileCard>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-7 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-[28px] border border-[var(--line)] bg-white p-6 md:p-8">
            <div className="flex items-center justify-between gap-4"><p className="eyebrow">notes</p><Sparkles size={18} className="text-[var(--gold)]"/></div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {detail.notes.map((note) => <div key={note} className="rounded-2xl border border-[var(--line)] bg-[#faf7f2] p-4"><div className="mb-3 h-14 rounded-xl bg-gradient-to-br from-[#efe3d0] to-[#c8b69c]"/><p className="font-display text-lg leading-tight">{note}</p></div>)}
            </div>
            <div className="mt-7 rounded-2xl bg-[#f4eee6] p-5"><p className="eyebrow">mood</p><p className="mt-2 font-display text-2xl">{detail.mood}</p></div>
          </div>

          <aside className="h-fit rounded-[28px] border border-[var(--line)] bg-white p-6 shadow-luxe md:p-8 lg:sticky lg:top-24">
            <p className="eyebrow">choose your size</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {([30, 50, 100] as const).map((value) => { const active = size === value; return <button key={value} onClick={() => { const match = activeVariants.find((x) => x.size_ml === value); if (match) setVid(match.id); }} className={`rounded-2xl border p-3 text-left transition ${active ? "border-[var(--wine)] bg-[var(--wine)] text-white" : "border-[var(--line)] bg-[#faf7f2]"}`}><span className="block text-sm font-semibold">{value}ml</span><span className="mt-1 block text-xs opacity-75">₹{MARIA_PRICING[value].toLocaleString("en-IN")}</span></button> })}
            </div>
            <div className="mt-6 border-y border-[var(--line)] py-5"><div className="flex items-end justify-between"><span className="text-sm text-black/55">Your selection</span><strong className="font-display text-4xl">₹{(price * quantity).toLocaleString("en-IN")}</strong></div><p className="mt-1 text-right text-xs text-black/40">{size}ml · {rating}</p></div>
            <div className="mt-5 flex items-center justify-between"><span className="text-sm">Quantity</span><div className="flex items-center gap-3 rounded-full border border-[var(--line)] px-2 py-1"><button aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="rounded-full p-2"><Minus size={14}/></button><strong>{quantity}</strong><button aria-label="Increase quantity" onClick={() => setQuantity(Math.min(20, quantity + 1))} className="rounded-full p-2"><Plus size={14}/></button></div></div>
            <button onClick={add} className="btn btn-primary mt-6 w-full"><ShoppingBag size={16}/> Add to bag</button>
            <div className="mt-4 grid gap-2 text-xs text-black/55"><p className="flex gap-2"><Check size={15} className="text-[var(--gold)]"/>40% concentration · pure oil format</p><p className="flex gap-2"><Check size={15} className="text-[var(--gold)]"/>Designed for long-lasting wear and good projection</p><p className="flex gap-2"><Check size={15} className="text-[var(--gold)]"/>UPI payment with manual verification</p></div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function ProfileCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-[22px] bg-white/80 p-4 shadow-sm"><h2 className="mb-3 text-xs lowercase tracking-[.05em] text-black/45">{title}</h2>{children}</section>;
}

function Metric({ icon, label, value }: { icon: string; label: string; value: string }) {
  return <div className="rounded-xl bg-[#faf7f2] px-3 py-3"><span className="block text-xs text-black/45">{icon} {label}</span><strong className="mt-1 block text-sm">{value}</strong></div>;
}
