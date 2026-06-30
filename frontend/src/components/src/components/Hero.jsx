import { useState, useEffect, useCallback } from "react";
import bannerHeadphones from "../assets/banner-headphones.png";
import bannerTws from "../assets/banner-tws.png";
import bannerSmartwatch from "../assets/banner-smartwatch.png";

const SLIDES = [
  {
    img: bannerHeadphones,
    tag: "New Drop",
    title: "Hear every pixel of victory.",
    desc: "Studio-grade 50mm drivers, AI-powered noise canceling mic, and 16.8M color RGB. Built for players who refuse to lose.",
    accent: "from-rose-500 to-orange-500",
  },
  {
    img: bannerTws,
    tag: "Bestseller",
    title: "Sound that moves with you.",
    desc: "Truly wireless earbuds with active noise cancellation, 30hr battery, and a fit engineered for all-day comfort.",
    accent: "from-violet-500 to-purple-600",
  },
  {
    img: bannerSmartwatch,
    tag: "Featured",
    title: "Style meets smart living.",
    desc: "Track health, manage notifications, and express your personality — all from your wrist.",
    accent: "from-emerald-500 to-teal-600",
  },
];

const AUTOPLAY_INTERVAL = 4500;

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index) => {
    setCurrent((index + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="my-14 w-full">
      <div className="mx-auto max-w-7xl px-6">
        {/* Sliding banner viewport */}
        <div className="relative overflow-hidden rounded-3xl shadow-xl bg-slate-900">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {SLIDES.map((s, i) => (
              <div
                key={i}
                className="relative w-full flex-shrink-0 h-[420px] md:h-[520px] flex flex-col md:flex-row"
              >
                {/* Left: Text */}
                <div className="relative z-10 flex flex-col justify-center flex-1 px-8 md:px-14 bg-slate-900">
                  <span
                    className={`inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r ${s.accent} px-3 py-1 text-xs font-semibold text-white mb-4`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
                    {s.tag}
                  </span>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-white">
                    {s.title}
                  </h1>
                  <p className="mt-5 text-sm md:text-base text-slate-300 max-w-md leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                {/* Right: Product Image */}
                <div className="relative flex-1 min-h-0 flex items-center justify-center overflow-hidden">
                  {/* Accent glow that blends into slate-900 */}
                  <div
                    className={`absolute w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br ${s.accent} opacity-20 blur-3xl`}
                  />
                  <img
                    src={s.img}
                    alt={s.title}
                    loading={i === 0 ? "eager" : "lazy"}
                    width={1024}
                    height={1024}
                    className="relative z-10 h-[75%] w-auto max-w-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Prev / Next arrows */}
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/15 backdrop-blur text-white grid place-items-center hover:bg-white/25 transition"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/15 backdrop-blur text-white grid place-items-center hover:bg-white/25 transition"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? `w-6 bg-gradient-to-r ${SLIDES[current].accent}`
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
