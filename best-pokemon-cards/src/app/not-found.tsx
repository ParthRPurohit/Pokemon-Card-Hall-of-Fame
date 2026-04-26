import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <div className="card-panel w-full max-w-xl p-10">
        <p className="section-kicker">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--ink-strong)]">
          Pokemon entry not found
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--ink-soft)]">
          This MVP only includes 10 seeded Gen 1 Pokemon so far.
        </p>
        <Link href="/" className="mt-8 inline-flex rounded-full button-primary">
          Return home
        </Link>
      </div>
    </main>
  );
}
