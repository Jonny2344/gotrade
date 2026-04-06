import ContactForm from '../../components/ContactForm';

export const metadata = {
  title: 'Contact'
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-base px-4 py-16 text-slate-100 sm:px-6 sm:py-20">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/12 bg-brand-card/80 p-7 shadow-[0_30px_80px_rgba(2,8,23,0.5)] backdrop-blur-sm sm:p-10">
        <header>
          <h1 className="text-3xl font-semibold text-brand-text sm:text-4xl">Contact GoTrade</h1>
          <p className="mt-3 text-sm leading-7 text-brand-muted sm:text-base">
            Questions, feedback, or partnership enquiries — we'd love to hear from you.
          </p>
        </header>

        <ContactForm />

        <section className="mt-8 border-t border-white/12 pt-6">
          <p className="text-sm text-brand-muted sm:text-base">
            Or email us directly at{' '}
            <a
              href="mailto:hello@gotradeapp.co.uk"
              className="font-medium text-brand-blue transition duration-300 hover:underline hover:underline-offset-4"
            >
              hello@gotradeapp.co.uk
            </a>
          </p>
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
