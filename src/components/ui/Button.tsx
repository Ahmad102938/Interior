import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline-light" | "outline-dark" | "ghost-light" | "ghost-dark" | "navy";

const variants: Record<Variant, string> = {
  primary: "bg-maroon text-white border border-maroon hover:bg-maroon-light hover:border-maroon-light",
  navy: "bg-navy text-white border border-navy hover:bg-navy-deep",
  "outline-light": "border border-white/35 text-white hover:border-gold-pale hover:text-gold-pale",
  "outline-dark": "border border-navy/25 text-navy hover:border-navy hover:bg-navy hover:text-white",
  "ghost-light": "text-gold-pale hover:text-white px-0!",
  "ghost-dark": "text-maroon hover:text-navy px-0!",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">;

export function Button({ href, children, variant = "primary", className, arrow = true, ...rest }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-12 items-center justify-center gap-2.5 px-5 text-[0.75rem] font-semibold whitespace-nowrap uppercase tracking-[0.1em] transition-colors duration-300 sm:px-6 sm:text-[0.8125rem] sm:tracking-[0.12em]",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
      {arrow && (
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      )}
    </Link>
  );
}
