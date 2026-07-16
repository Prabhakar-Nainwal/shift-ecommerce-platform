import { Headphones, Watch, Headset } from "lucide-react";
import twsImage from "../../assets/products/tws-earbuds.png";
import watchImage from "../../assets/products/smartwatch.png";
import headphonesImage from "../../assets/products/headphones.png";
import { useNavigate, Link } from "react-router-dom";

const products = [
  {
    name: "TWS",
    tagline: "Pure silence. Pure sound.",
    icon: Headset,
    image: twsImage,
    imageAlt: "Red and black wireless TWS earbuds with charging case",
  },
  {
    name: "Smart Watches",
    tagline: "Time that moves with you.",
    icon: Watch,
    image: watchImage,
    imageAlt: "Red and black smartwatch with fitness display",
  },
  {
    name: "Headphones",
    tagline: "Feel every beat.",
    icon: Headphones,
    image: headphonesImage,
    imageAlt: "Red and black over-ear wireless headphones",
  },
];

export default function BodySection() {
  const navigate = useNavigate();
  return (
    <section className="relative w-full min-h-[50vh] overflow-hidden bg-gradient-to-br from-[oklch(0.14_0.01_0)] via-[oklch(0.22_0.02_0)] to-[oklch(0.18_0.01_0)]">
      {/* Ambient red glow */}
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.22 25 / 0.4) 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-40 h-[24rem] w-[24rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, oklch(0.55 0.22 25) 18%, transparent) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto flex h-full min-h-[50vh] w-full max-w-7xl flex-col items-center justify-between gap-8 px-6 py-12 lg:flex-row lg:py-0">
        {/* Text / Quote */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[oklch(0.65_0.18_30)]">
            Featured Tech
          </p>
          <h2 className="max-w-xl text-4xl font-bold leading-tight text-[oklch(0.98_0.01_0)] sm:text-5xl lg:text-6xl">
            Sound. Time. Style.{" "}
            <span className="text-[oklch(0.55_0.22_25)]">Redefined.</span>
          </h2>
          <blockquote className="mt-5 max-w-md text-lg italic text-[oklch(0.98_0.01_0_/_0.8)]">
            “Innovation in every beat, step, and second.”
          </blockquote>
          <button onClick={() => navigate("/shop")} className="mt-8 inline-flex items-center justify-center rounded-full bg-[oklch(0.55_0.22_25)] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[oklch(0.55_0.22_25)/0.3] transition-all hover:bg-[oklch(0.65_0.18_30)] hover:shadow-[oklch(0.55_0.22_25)/0.5]">
            Explore Collection
          </button>
        </div>

        {/* Product cards */}
        <div className="flex w-full flex-1 flex-wrap items-center justify-center gap-5 lg:justify-end">
          {products.map((product) => (
            <Link
              to={`/shop?category=${encodeURIComponent(product.name)}`}
              key={product.name}
            >
              <div
                className="group relative flex w-36 flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:-translate-y-2 hover:border-[oklch(0.55_0.22_25)/0.4] hover:bg-white/10 sm:w-40"
              >
                <div className="relative mb-3 flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
                  <img
                    src={product.image}
                    alt={product.imageAlt}
                    width={512}
                    height={512}
                    loading="lazy"
                    className="h-full w-full object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-2 text-[oklch(0.98_0.01_0)]">
                  <product.icon className="h-4 w-4 text-[oklch(0.55_0.22_25)]" />
                  <span className="text-sm font-semibold">{product.name}</span>
                </div>
                <p className="mt-1 text-center text-xs text-[oklch(0.98_0.01_0_/_0.7)]">{product.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}