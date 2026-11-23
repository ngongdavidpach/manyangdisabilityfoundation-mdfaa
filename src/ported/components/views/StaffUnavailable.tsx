import { Link } from "@tanstack/react-router";

export function StaffUnavailable() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-slate-950">Staff page unavailable</h1>
      <p className="mt-3 text-slate-600">Please try again, or return to the homepage.</p>
      <Link to="/" className="mt-6 inline-flex rounded-md bg-blue-900 px-4 py-2 text-sm font-bold text-white">
        Go home
      </Link>
    </section>
  );
}

export function StaffNotFound() {
  return <StaffUnavailable />;
}
