import { createFileRoute, Link } from "@tanstack/react-router";
import { StaffView } from "@/ported/components/views/StaffView";
import { listPublicStaff } from "@/lib/publicContent.functions";
import { getPageSeo, type PageSeo } from "@/lib/pageSeo.functions";
import { buildRouteHead } from "@/lib/routeHead";

const title = "Our Staff — Manyang Disability Foundation";
const description =
  "Meet the staff leading Manyang Disability Foundation's work for people with disabilities.";

export const Route = createFileRoute("/staff")({
  loader: async () => {
    const [staff, seo] = await Promise.all([
      listPublicStaff(),
      getPageSeo({ data: { pageKey: "staff" } }).catch((): PageSeo => ({})),
    ]);
    return { staff, seo };
  },
  head: ({ loaderData }) => {
    const base = buildRouteHead({
      path: "/staff",
      defaultTitle: title,
      defaultDescription: description,
      seo: loaderData?.seo,
    });
    const staff = loaderData?.staff ?? [];
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "Manyang Disability Foundation staff",
            description,
            url: "https://manyangdisabilityfoundation.org/staff",
            mainEntity: {
              "@type": "Organization",
              name: "Manyang Disability Foundation",
              employee: staff.map((member) => ({
                "@type": "Person",
                name: member.full_name,
                jobTitle: member.role_title,
                ...(member.photo_url ? { image: member.photo_url } : {}),
              })),
            },
          }),
        },
      ],
    };
  },
  errorComponent: StaffUnavailable,
  notFoundComponent: StaffUnavailable,
  component: StaffPage,
});

function StaffPage() {
  const { staff } = Route.useLoaderData();
  return <StaffView staff={staff} />;
}

function StaffUnavailable() {
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