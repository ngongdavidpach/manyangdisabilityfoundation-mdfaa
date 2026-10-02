import { createFileRoute, notFound } from "@tanstack/react-router";
import { CsrSponsorshipView } from "../ported/components/views/CsrSponsorshipView";
import { getVisibilityFlags } from "../lib/visibility.functions";

export const Route = createFileRoute("/csr-sponsorship")({
  loader: async () => {
    const { csrVisible } = await getVisibilityFlags();
    if (!csrVisible) throw notFound();
    return { csrVisible };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: "CSR Sponsorship — Manyang Disability Foundation" },
      {
        name: "description",
        content:
          "Corporate Social Responsibility partnership tiers and downloadable prospectus for sponsoring mobility-aid shipments to East Africa.",
      },
      { property: "og:title", content: "CSR Sponsorship — Manyang Disability Foundation" },
      {
        property: "og:description",
        content:
          "Sponsor large equipment shipments. Download the prospectus and sponsorship tier list.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:url",
        content: "https://manyangdisabilityfoundation.org/csr-sponsorship",
      },
      ...(loaderData?.csrVisible ? [] : [{ name: "robots", content: "noindex, nofollow" }]),
    ],
    links: [
      {
        rel: "canonical",
        href: "https://manyangdisabilityfoundation.org/csr-sponsorship",
      },
    ],
  }),
  component: CsrSponsorshipView,
});
