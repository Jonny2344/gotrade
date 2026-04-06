const logos = ['NorthBuild', 'PipeFlow', 'SwiftElec', 'PrimeFix', 'UrbanWorks'];

export default function SocialProof() {
  return (
    <section className="section-wrap py-10 sm:py-12">
      <div className="section-inner fade-up rounded-2xl border border-white/10 bg-slate-900/55 p-5 sm:p-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-slate-400 sm:text-sm">
          Trusted by growing trade teams
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-center sm:grid-cols-3 lg:grid-cols-5">
          {logos.map(logo => (
            <div
              key={logo}
              className="rounded-xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm font-semibold text-slate-200 transition duration-300 hover:border-brand-orange/40 hover:text-white"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
