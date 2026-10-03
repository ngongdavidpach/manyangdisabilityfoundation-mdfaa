import { createFileRoute } from "@tanstack/react-router";
import { ContactView } from "../ported/components/views/ContactView";
import { getTurnstileSiteKey } from "../lib/contact.functions";
import { getVisibilityFlags } from "../lib/visibility.functions";

export const Route = createFileRoute("/contact")({
  loader: async () => {
    const [site, flags] = await Promise.all([
      getTurnstileSiteKey().catch(() => ({ siteKey: null as string | null })),
      getVisibilityFlags(),
    ]);
    return { siteKey: site.siteKey as string | null, ...flags };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.showPartnership !== false;
    const title = p
      ? "Contact & Partner Inquiries — Manyang Disability Foundation"
      : "Contact Us — Manyang Disability Foundation";
    const description = p
      ? "Reach the Manyang Disability Foundation team for partnerships, CSR sponsorships, media, and general inquiries."
      : "Reach the Manyang Disability Foundation team for media, volunteering, and general inquiries.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:url", content: "https://manyangdisabilityfoundation.org/contact" },
      ],
      links: [{ rel: "canonical", href: "https://manyangdisabilityfoundation.org/contact" }],
    };
  },
  component: ContactRoute,
});

function ContactRoute() {
  const { siteKey, showPartnership, csrVisible } = Route.useLoaderData();
  return <ContactView siteKey={siteKey} showPartnership={showPartnership} csrVisible={csrVisible} />;
}
