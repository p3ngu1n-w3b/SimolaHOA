import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  eyebrow,
  className,
  children,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={cn("estate-gradient text-white", className)}>
      <div className="container py-12 md:py-16">
        {eyebrow && (
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-estate-gold">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base text-white/80 md:text-lg">{description}</p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
