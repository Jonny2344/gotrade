const links = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#demo', label: 'Demo' },
  { href: '#waitlist', label: 'Waitlist' }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <a href="#" className="text-xl font-semibold tracking-tight text-white">
          GoTrade
        </a>

        <ul className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          {links.map(link => (
            <li key={link.href}>
              <a className="transition hover:text-brand-orange" href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#waitlist"
          className="rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition duration-300 hover:-translate-y-0.5 hover:bg-orange-500"
        >
          Join Waitlist
        </a>
      </nav>
    </header>
  );
}
