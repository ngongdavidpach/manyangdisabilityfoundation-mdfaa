import { createFileRoute } from "@tanstack/react-router";
import { StaffUnavailable, StaffNotFound } from "@/ported/components/views/StaffUnavailable";
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
  notFoundComponent: StaffNotFound,
  component: StaffPage,
});

function StaffPage() {
  const { staff } = Route.useLoaderData();
  return <StaffView staff={staff} />;
}
