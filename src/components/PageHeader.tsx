interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="bg-gradient-to-br from-primary to-primary-dark py-12 text-white sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-lg text-blue-100">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
