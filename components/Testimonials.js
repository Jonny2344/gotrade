const testimonials = [
  {
    quote: 'GoTrade cut our supplier search time in half. We price and source before leaving the van.',
    name: 'Liam Carter',
    role: 'Operations Lead, NorthBuild'
  },
  {
    quote: 'Emergency jobs are easier now. We find in-stock alternatives instantly and stay on schedule.',
    name: 'Sophie Khan',
    role: 'Project Manager, SwiftElec'
  },
  {
    quote: 'The mobile flow feels built for trades. It is quick, clear, and saves margin every week.',
    name: 'Marcus Doyle',
    role: 'Owner, PipeFlow Services'
  }
];

export default function Testimonials() {
  return (
    <section className="section-wrap section-space">
      <div className="section-inner">
        <div className="fade-up mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Customer Stories</p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Built to convert time into profit</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <article
              key={item.name}
              className="fade-up glass soft-ring rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/60"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <p className="text-sm leading-relaxed text-slate-200">"{item.quote}"</p>
              <p className="mt-5 text-sm font-semibold text-white">{item.name}</p>
              <p className="text-xs text-slate-400">{item.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
