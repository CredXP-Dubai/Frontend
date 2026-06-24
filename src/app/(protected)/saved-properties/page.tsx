import Link from "next/link";
import { PortalShell } from "@/components/layout/PortalShell";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export default function SavedPropertiesPage() {
  return (
    <PortalShell
      eyebrow="Shortlist"
      title="Saved Properties"
      subtitle="Your curated collection of Dubai residences under consideration."
    >
      <Reveal>
        <div className="rounded-xl border border-black/10 bg-[#F7F7F7] p-10 text-center">
          <p className="font-[family-name:var(--font-display)] text-2xl text-black">
            No saved properties yet
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-black/55">
            Shortlist residences from our exclusive collection and they will appear here for
            easy comparison and advisory follow-up.
          </p>
          <div className="mt-8">
            <Button href="/#properties" variant="primary">
              Browse Properties
            </Button>
          </div>
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-sm text-black/45 transition-colors hover:text-[#C8102E]"
          >
            Return to portal
          </Link>
        </div>
      </Reveal>
    </PortalShell>
  );
}
