import { Button } from "@/components/ui/Button";
import { notFoundPage as c } from "@/content/pages/notFound";

export default function NotFound() {
  return (
    <section data-nav-theme="dark" className="flex min-h-[80svh] items-center bg-navy text-white">
      <div className="container-page pt-24">
        <p className="eyebrow text-gold-pale">{c.eyebrow}</p>
        <h1 className="display mt-5 text-5xl lg:text-7xl">{c.title}</h1>
        <p className="mt-5 max-w-lg text-white/70">{c.copy}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={c.primary.href}>{c.primary.label}</Button>
          <Button href={c.secondary.href} variant="outline-light">{c.secondary.label}</Button>
        </div>
      </div>
    </section>
  );
}
