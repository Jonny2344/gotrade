function SocialIcon({ label, path, href = '#' }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/18 bg-brand-card/95 text-brand-muted shadow-[0_10px_24px_rgba(2,8,23,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/60 hover:text-brand-text hover:shadow-[0_14px_30px_rgba(59,130,246,0.28)]"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-[1.15rem] w-[1.15rem]">
        <path d={path} />
      </svg>
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-white/12 px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-9 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <p className="text-xl font-semibold text-brand-text">GoTrade</p>
          <p className="mt-1 text-sm text-brand-muted">Scan. Find. Save. Fast.</p>
        </div>

        <ul className="flex flex-wrap gap-6 text-sm text-brand-muted">
          <li><a href="/contact" className="transition duration-300 hover:text-brand-blue hover:underline hover:underline-offset-4 hover:-translate-y-0.5 inline-flex">Contact</a></li>
          <li><a href="/privacy-policy" className="transition duration-300 hover:text-brand-blue hover:underline hover:underline-offset-4">Privacy Policy</a></li>
        </ul>

        <div className="flex justify-center gap-4 sm:justify-end">
          <SocialIcon label="Instagram" href="https://www.instagram.com/gotradeuk?igsh=MXNqZzRtNW9tbWdlbg%3D%3D&utm_source=qr" path="M7 7h10v10H7zM9.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0zm6.8-4.8h.01" />
          <SocialIcon label="TikTok" href="https://www.tiktok.com/@gotradeapp?_r=1&_t=ZN-95JJuLemdAQ" path="M14.6 6.2c.9 1.1 2.1 1.7 3.4 1.8v2.4a5.7 5.7 0 0 1-3.4-1.1v4.9a4.9 4.9 0 1 1-4.9-4.9c.3 0 .6 0 .9.1v2.4a2.5 2.5 0 1 0 1.6 2.4V4.8h2.4z" />
          <SocialIcon label="X" href="https://x.com/gotradeuk?s=21" path="M5 5l14 14M19 5L5 19" />
        </div>
      </div>
    </footer>
  );
}
