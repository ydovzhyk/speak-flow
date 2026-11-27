import Link from 'next/link';

/**
 * Same background as the main tool; content sits in a tool-like white card.
 */
export default function SitePageShell({ children, backHref = '/', backLabel = '← Back to SpeakFlow tool' }) {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat py-10 px-4"
      style={{ backgroundImage: "url('/images/bg.webp')" }}
    >
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border-2 border-teal-700 bg-white shadow-lg overflow-hidden">
          <div className="px-5 sm:px-8 py-8 sm:py-10 flex flex-col gap-8 text-[var(--text-main,#0f1d2d)]">
            <Link
              href={backHref}
              className="text-sm text-[var(--accent2,#017683)] hover:text-[var(--text-main,#0f1d2d)] w-fit"
            >
              {backLabel}
            </Link>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
