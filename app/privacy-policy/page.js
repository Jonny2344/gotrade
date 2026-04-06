export const metadata = {
  title: 'Privacy Policy',
  alternates: {
    canonical: '/privacy-policy'
  }
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-base px-4 py-16 text-slate-100 sm:px-6 sm:py-20">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/12 bg-brand-card/80 p-7 shadow-[0_30px_80px_rgba(2,8,23,0.5)] backdrop-blur-sm sm:p-10">
        <h1 className="text-3xl font-semibold text-brand-text sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-brand-muted">Last updated: April 6, 2026</p>

        <p className="mt-7 text-sm leading-7 text-brand-muted sm:text-base">
          GoTrade ("we", "our", "us") respects your privacy and is committed to protecting your personal data.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-brand-text">Information We Collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-7 text-brand-muted sm:text-base">
            <li>Email address (when users join the waitlist)</li>
            <li>Usage data (how users interact with the site)</li>
            <li>Device and browser information</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-brand-text">How We Use Your Information</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-7 text-brand-muted sm:text-base">
            <li>Provide and improve our service</li>
            <li>Notify users about updates and product launches</li>
            <li>Analyse usage to improve performance</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-brand-text">Data Sharing</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-7 text-brand-muted sm:text-base">
            <li>We do not sell personal data</li>
            <li>
              We may share data with trusted third-party services (e.g. analytics tools, email providers) to operate
              the platform
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-brand-text">Data Storage</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-7 text-brand-muted sm:text-base">
            <li>Data is stored securely</li>
            <li>Data is only kept as long as necessary</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-brand-text">Your Rights</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-7 text-brand-muted sm:text-base">
            <li>Access your data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-brand-text">Cookies</h2>
          <p className="mt-3 text-sm leading-7 text-brand-muted sm:text-base">
            We may use cookies to improve user experience and analyse traffic.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-brand-text">Contact</h2>
          <p className="mt-3 text-sm leading-7 text-brand-muted sm:text-base">
            If users have questions, they can contact: support@gotradeapp.co.uk
          </p>
        </section>

        <section className="mt-8 border-t border-white/12 pt-6">
          <p className="text-sm leading-7 text-brand-muted sm:text-base">This policy may be updated from time to time.</p>
          <a
            href="/"
            className="mt-4 inline-flex text-sm font-medium text-brand-blue transition duration-300 hover:underline hover:underline-offset-4"
          >
            Back to home
          </a>
        </section>
      </div>
    </main>
  );
}
