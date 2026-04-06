import ProductPreview from './ProductPreview';

export default function Hero() {
  return (
    <section className="section-wrap section-space relative overflow-hidden pt-14 sm:pt-20">
      <div className="section-inner grid items-center gap-12 md:gap-16 lg:gap-24 md:grid-cols-2">
        <div className="fade-up">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.26em] text-brand-muted/60">
            GoTrade
          </p>
          <h1 className="text-balance text-3xl font-semibold leading-[1.05] text-brand-text sm:text-5xl lg:text-7xl">
            Scan. Find. Save. Fast.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-muted/88 sm:text-lg">
            Stop wasting time chasing suppliers. Find the right product, at the right price, in seconds.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#waitlist"
              className="rounded-full bg-brand-orange px-8 py-4 text-base font-semibold text-brand-text shadow-[0_14px_36px_rgba(249,115,22,0.38)] transition duration-300 hover:-translate-y-1 hover:bg-[#fb8b3d] hover:shadow-[0_18px_48px_rgba(249,115,22,0.5)]"
            >
              Join Waitlist
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/[0.02] px-6 py-3 text-center text-sm font-semibold text-brand-muted transition duration-300 hover:-translate-y-0.5 hover:border-brand-blue/70 hover:bg-brand-blue/12 hover:text-brand-text hover:shadow-[0_8px_24px_rgba(59,130,246,0.16)]"
            >
              Learn More
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-start gap-x-4 gap-y-3 text-sm text-brand-muted sm:flex-nowrap sm:gap-x-4 sm:gap-y-3 sm:text-base">
            <span className="inline-flex h-10 items-center whitespace-nowrap rounded-full border border-brand-blue/44 bg-brand-blue/25 px-5 font-semibold text-sky-100 shadow-[0_10px_24px_rgba(59,130,246,0.24)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_14px_30px_rgba(59,130,246,0.3)]">Built for UK trades</span>
            <span className="inline-flex h-10 items-center whitespace-nowrap rounded-full border border-emerald-300/32 bg-emerald-400/22 px-5 font-medium text-emerald-100/90 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_12px_28px_rgba(16,185,129,0.24)]">Live supplier data</span>
            <span className="inline-flex h-10 items-center whitespace-nowrap rounded-full border border-white/26 bg-white/[0.18] px-5 font-medium text-brand-muted/84 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_10px_22px_rgba(148,163,184,0.2)]">Now in beta</span>
          </div>

          <div className="mt-8 rounded-2xl border border-brand-blue/25 bg-brand-card/92 p-5 shadow-[0_18px_48px_rgba(2,8,23,0.42)] backdrop-blur-sm soft-ring sm:p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-brand-muted">Product stage</p>
            <p className="mt-4 text-sm leading-relaxed text-brand-muted/88 sm:text-base">
              GoTrade is currently in beta. We are working with early users to improve supplier coverage, search quality, and real-time stock accuracy.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-brand-muted/88 sm:text-base">
              Join early access to shape the product and get updates as new merchants and regions go live.
            </p>
          </div>
        </div>

        <div className="float-in floating-card relative" style={{ animationDelay: '120ms' }}>
          <div className="preview-halo" aria-hidden="true" />
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
