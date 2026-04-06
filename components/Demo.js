const mockResults = [
  { name: 'Bosch Circular Saw', price: '£146.75', distance: '4.0 miles', stock: 'In Stock' },
  { name: 'Makita Drill Kit', price: '£139.99', distance: '5.2 miles', stock: 'In Stock' },
  { name: 'Copper Pipe 15mm', price: '£21.80', distance: '6.1 miles', stock: 'Low Stock' }
];

export default function Demo() {
  return (
    <section id="demo" className="section-wrap section-space">
      <div className="section-inner grid items-center gap-10 lg:grid-cols-2">
        <div className="fade-up">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-amber">Product Demo</p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">See GoTrade in action</h2>
          <p className="mt-4 max-w-xl text-slate-300">
            A phone-first experience for teams that need decisions on-site. Spot the best option at a glance and move quickly.
          </p>
        </div>

        <div className="fade-up mx-auto w-full max-w-sm rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 shadow-2xl transition duration-300 hover:-translate-y-1 hover:shadow-sky-900/30" style={{ animationDelay: '120ms' }}>
          <div className="mx-auto mb-4 h-1.5 w-24 rounded-full bg-white/20" />
          <div className="mb-4 rounded-xl border border-white/10 bg-slate-900/70 p-3">
            <p className="text-xs uppercase tracking-widest text-slate-400">Search</p>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="Laser level"
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition duration-300 focus:border-brand-orange"
              />
              <button className="rounded-lg bg-brand-orange px-3 py-2 text-xs font-semibold text-white transition duration-300 hover:bg-orange-500">
                Go
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {mockResults.map(item => (
              <article key={item.name} className="rounded-xl border border-white/10 bg-slate-900/70 p-3 transition duration-300 hover:border-brand-orange/40">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-brand-orange/20 px-2 py-1 text-brand-amber">{item.price}</span>
                  <span className="rounded-full bg-sky-500/20 px-2 py-1 text-sky-300">{item.distance}</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-300">{item.stock}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
