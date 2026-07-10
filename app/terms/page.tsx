import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use | UnscrambleHQ',
  description: 'Terms governing use of UnscrambleHQ.',
}

export default function TermsPage() {
  return (
    <main className="bg-soft/40 px-4 py-12">
      <article className="container-page max-w-4xl rounded-3xl border border-line bg-white p-6 md:p-10">
        <h1 className="text-4xl font-black text-ink">Terms of Use</h1>

        <p className="mt-3 text-sm text-gray-500">
          Last updated: July 10, 2026
        </p>

        <Section title="Acceptance">
          By using UnscrambleHQ, you agree to these terms. Do not use the
          website if you do not agree.
        </Section>

        <Section title="Permitted use">
          You may use the website for personal, educational, research,
          and word-game purposes. Automated scraping, excessive
          requests, interference with the service, and attempts to
          bypass security controls are prohibited.
        </Section>

        <Section title="Accuracy">
          Word definitions, scores, relationships, suggestions, and
          generated insights are provided for informational purposes.
          We aim for accuracy but do not guarantee that every result is
          complete, current, or valid for every game, dictionary, or
          competition.
        </Section>

        <Section title="Intellectual property">
          The UnscrambleHQ design, software, branding, page structure,
          and original content are protected by applicable intellectual
          property laws.
        </Section>

        <Section title="Third-party services">
          The website may use third-party hosting, analytics,
          advertising, and technical services. Those services may have
          separate terms and privacy practices.
        </Section>

        <Section title="Service availability">
          We may modify, suspend, or discontinue features without
          guaranteeing continuous availability.
        </Section>

        <Section title="Limitation of liability">
          UnscrambleHQ is provided on an as-is and as-available basis.
          To the maximum extent permitted by law, we are not liable for
          losses resulting from reliance on website content or service
          interruptions.
        </Section>

        <Section title="Changes">
          These terms may be updated periodically. Continued use after
          an update constitutes acceptance of the revised terms.
        </Section>
      </article>
    </main>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-black text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-gray-700">
        {children}
      </p>
    </section>
  )
}