import { Reveal } from "@/components/ui/Reveal";
import { theme } from "@/styles/theme";

const benefits = [
  {
    title: "Tax-Efficient Ownership",
    description:
      "Dubai offers zero income tax on rental yields and capital gains for qualifying investors.",
  },
  {
    title: "Golden Visa Eligibility",
    description:
      "Qualifying property investments can unlock long-term UAE residency for you and your family.",
  },
  {
    title: "Payment Plan Flexibility",
    description:
      "Off-plan projects feature structured milestones — booking, construction, and handover schedules.",
  },
  {
    title: "Institutional-Grade Developers",
    description:
      "Partner with RERA-regulated developers delivering master communities across prime corridors.",
  },
] as const;

export function InvestmentBenefitsSection() {
  return (
    <section
      className="bg-black text-white"
      aria-labelledby="benefits-heading"
    >
      <div className={theme.components.section.wrapper}>
        <Reveal className="mb-12 max-w-3xl text-center mx-auto">
          <p className="mb-4 text-[0.6875rem] font-semibold tracking-[0.28em] text-[#E63946] uppercase">
            Why Dubai
          </p>
          <h2
            id="benefits-heading"
            className={theme.components.section.titleOnDark}
          >
            Investment Benefits
          </h2>
          <p className={theme.components.section.subtitleOnDark}>
            CredXP curates opportunities aligned with Dubai&apos;s investor-friendly framework and
            global demand for luxury real estate.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <Reveal key={benefit.title} delay={index * 0.08}>
              <article className={`h-full p-6 ${theme.components.card.dark}`}>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-white">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  {benefit.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
