const features = [
  {
    title: 'Scan Products',
    copy: 'Take a photo to instantly identify the product.',
    icon: '📷'
  },
  {
    title: 'Compare Prices',
    copy: 'Compare supplier prices in seconds.',
    icon: '💸'
  },
  {
    title: 'Find Nearby Stock',
    copy: 'Locate nearby stock before you travel.',
    icon: '📍'
  },
  {
    title: 'Fast Action',
    copy: 'Navigate, reserve, or order in one tap.',
    icon: '⚡'
  }
];

export default function Features() {
  return (
    <section id="features" className="section-wrap section-space">
      <div className="section-inner">
        <div className="fade-up mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-blue">Features</p>
          <h2 className="mt-2 text-4xl font-semibold text-brand-text sm:text-5xl">Everything you need to source faster</h2>
        </div>

        <div className="grid auto-rows-fr items-stretch gap-6 sm:grid-cols-2 lg:gap-7">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="fade-up glass soft-ring flex h-full flex-col rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-9 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_14px_34px_rgba(2,8,23,0.28)] transition duration-300 hover:-translate-y-1 hover:border-brand-orange/45 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_40px_rgba(59,130,246,0.18),0_20px_44px_rgba(249,115,22,0.12)]"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <p className="text-3xl" aria-hidden="true">{feature.icon}</p>
              <h3 className="mt-5 text-xl font-semibold text-brand-text">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-muted/88 sm:text-base">{feature.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
