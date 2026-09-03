export default function Section({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <section className="section-lg content-pad scroll-mt-20">
        <h2 className="text-3xl font-semibold mb-6">{title}</h2>
        <div className="text-gray-600">{children}</div>
      </section>
    );
  }