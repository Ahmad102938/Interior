import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section data-nav-theme="dark" className="flex min-h-[80svh] items-center bg-navy text-white">
      <div className="container-page pt-24">
        <p className="eyebrow text-gold-pale">404</p>
        <h1 className="display mt-5 text-5xl lg:text-7xl">This page isn&apos;t available.</h1>
        <p className="mt-5 max-w-lg text-white/70">It may have moved, or the content is not published yet.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/contact" variant="outline-light">Contact us</Button>
        </div>
      </div>
    </section>
  );
}
