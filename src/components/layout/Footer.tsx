import Link from "next/link";
import { company, contact } from "@/data/company";
import { footerQuickLinks } from "@/data/navigation";
import { verticals, serviceHref } from "@/data/verticals";
import { isPublishable } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { PendingBadge } from "@/components/ui/PendingBadge";

export function Footer() {
  const contactRows = [contact.email, contact.phone, contact.office].filter((c) => isPublishable(c.status));
  const social = contact.social.filter((s) => isPublishable(s.status));
  return (
    <footer data-nav-theme="dark" className="bg-maroon text-white">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-20">
        <div>
          <Logo />
          <p className="mt-6 max-w-xs font-display text-2xl leading-snug text-white/90">{company.positioning}.</p>
          <p className="mt-4 text-sm text-gold-pale">
            {company.tagline[0]} {company.tagline[1]}
          </p>
        </div>
        <FooterList title="Services" links={verticals.map((v) => ({ label: v.title, href: serviceHref(v) }))} />
        <FooterList title="Company" links={footerQuickLinks} />
        <div>
          <h2 className="eyebrow text-gold-pale">Contact</h2>
          <ul className="mt-5 space-y-3 text-sm text-white/80">
            {contactRows.map((c) => (
              <li key={c.label} className="flex flex-wrap items-center gap-2">
                <span className="text-white/50">{c.label}:</span> {c.value} <PendingBadge status={c.status} />
              </li>
            ))}
            <li>
              <a href={contact.website.href} className="hover:text-gold-pale">
                {contact.website.value}
              </a>
            </li>
          </ul>
          {social.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-4 text-sm">
              {social.map((s) => (
                <li key={s.label} className="flex items-center gap-2">
                  <a href={s.href} className="text-white/80 hover:text-gold-pale">
                    {s.label}
                  </a>
                  <PendingBadge status={s.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container-page flex flex-col gap-3 pt-6 pb-[calc(1.5rem+var(--safe-bottom))] text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© <CopyrightYear /> Adidev. All Rights Reserved.</p>
          <p className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms & Conditions</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="eyebrow text-gold-pale">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-white/80 transition-colors hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Cached with the static shell; refreshed on each deploy. */
async function CopyrightYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}
