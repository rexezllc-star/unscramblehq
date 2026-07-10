import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact UnscrambleHQ',
  description:
    'Contact UnscrambleHQ regarding feedback, corrections, privacy, or support.',
}

export default function ContactPage() {
  const email =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    'support@unscramblehq.com'

  return (
    <main className="bg-soft/40 px-4 py-12">
      <article className="container-page max-w-3xl rounded-3xl border border-line bg-white p-6 md:p-10">
        <h1 className="text-4xl font-black text-ink">Contact Us</h1>

        <p className="mt-5 text-base leading-8 text-gray-700">
          Contact UnscrambleHQ regarding website feedback, word
          corrections, technical problems, privacy requests, advertising
          inquiries, or general support.
        </p>

        <div className="mt-8 rounded-2xl bg-soft p-6">
          <p className="text-xs font-black uppercase tracking-widest text-gray-500">
            Email
          </p>

          <a
            href={`mailto:${email}`}
            className="mt-2 block break-all text-lg font-black text-brand"
          >
            {email}
          </a>
        </div>

        <p className="mt-6 text-sm leading-7 text-gray-600">
          Please include the relevant page URL when reporting an issue
          with a word, definition, score, or site feature.
        </p>
      </article>
    </main>
  )
}