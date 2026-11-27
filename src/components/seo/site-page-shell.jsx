import Link from 'next/link';
import Logo from '@/components/shared/logo/logo';

/**
 * Same background as the main tool; content sits in a tool-like white card.
 * Logo placement mirrors the home tool page (desktop corner + compact on mobile).
 */
export default function SitePageShell({
  children,
  backHref = '/',
  backLabel = '← Back to SpeakFlow tool',
}) {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat px-3 py-6 sm:px-5 sm:py-10 md:px-8 md:py-12"
      style={{ backgroundImage: "url('/images/bg.webp')" }}
    >
      {/* Desktop: same corner placement as the main tool */}
      <div className="pointer-events-auto absolute top-4 left-4 hidden md:block lg:top-[20px] lg:left-[50px] z-10">
        <Logo variant="color" eager width={200} height={71} />
      </div>

      <div className="mx-auto w-full max-w-3xl">
        {/* Mobile / tablet: logo above the card */}
        <div className="mb-4 flex justify-center md:hidden">
          <Logo variant="color" eager width={160} height={57} />
        </div>

        <div className="rounded-2xl border-2 border-teal-700 bg-white shadow-lg overflow-hidden">
          <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 flex flex-col gap-6 sm:gap-8 text-[var(--text-main,#0f1d2d)]">
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
