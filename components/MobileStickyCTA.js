export default function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-brand-bg/95 p-3 backdrop-blur-lg sm:hidden">
      <a
        href="#waitlist"
        className="block w-full rounded-full bg-brand-orange px-5 py-3 text-center text-sm font-semibold text-brand-text shadow-[0_10px_24px_rgba(249,115,22,0.4)] transition duration-300 hover:bg-[#fb8b3d]"
      >
        Join Waitlist
      </a>
    </div>
  );
}
