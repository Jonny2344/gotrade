const steps = [
  {
    number: '🔎',
    title: 'Scan or search a product',
    copy: 'Use your camera or type the product name.'
  },
  {
    number: '📊',
    title: 'Compare nearby suppliers',
    copy: 'Review price, stock, and distance at a glance.'
  },
  {
    number: '✅',
    title: 'Choose and take action',
    copy: 'Pick the best option and move immediately.'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-wrap section-space">
      <div className="section-inner">
        <div className="fade-up mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-blue">How It Works</p>
          <h2 className="mt-2 text-4xl font-semibold text-brand-text sm:text-5xl">Three steps to smarter sourcing</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3 md:gap-9">
          {steps.map((step, index) => (
            <article
              key={step.number}
              className="fade-up glass soft-ring relative rounded-2xl p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(59,130,246,0.18),0_20px_44px_rgba(249,115,22,0.14)]"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <p className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/20 text-xl font-bold text-[#93c5fd]">
                {step.number}
              </p>
              <h3 className="mt-5 text-xl font-semibold text-brand-text">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-muted/88 sm:text-base">{step.copy}</p>
              {index < steps.length - 1 && (
                <div className="pointer-events-none absolute -right-8 top-1/2 hidden w-16 -translate-y-1/2 items-center justify-center gap-2 md:flex">
                  <span className="h-px w-10 bg-gradient-to-r from-brand-blue/80 to-brand-orange/80 flow-pulse" />
                  <span className="text-2xl text-brand-blue drop-shadow-[0_0_10px_rgba(59,130,246,0.45)] flow-pulse">→</span>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
