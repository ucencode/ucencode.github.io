import { experience, experienceSummary } from "@/data/experience";
import SectionReveal from "./SectionReveal";

const Experience = () => {
  return (
    <section id="experience" className="py-24 md:py-32 section-alt">
      <div className="max-w-5xl mx-auto px-6">
        <SectionReveal>
          <p className="font-mono text-primary text-sm mb-3 tracking-wide">
            Experience
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            {experienceSummary.title}
          </h2>
          <p className="text-muted-foreground max-w-lg mb-12">
            {experienceSummary.subtitle}
          </p>
        </SectionReveal>

        <div className="grid lg:grid-cols-[1.4fr,0.6fr] gap-10 lg:gap-14">
          <div className="relative pl-10 border-l border-border/60 space-y-10">
            {experience.map((item, index) => (
              <SectionReveal key={`${item.company}-${item.year}`} delay={index * 90}>
                <div className="relative">
                  <span className="absolute -left-[24px] top-0.5 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                  <p className="font-mono text-xs text-primary mb-2 tracking-wide">
                    {item.year}
                  </p>
                  <h3 className="text-base md:text-lg font-semibold text-foreground">
                    {item.position}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.company}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mb-3">
                    {item.location}
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    {item.bullets.map((bullet, bulletIndex) => (
                      <li
                        key={`${item.company}-bullet-${bulletIndex}`}
                        className="flex items-start gap-3"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </SectionReveal>
            ))}
          </div>

          <div className="space-y-6">
            <SectionReveal delay={150}>
              <div className="rounded-lg border border-border bg-card p-6">
                <p className="font-mono text-xs text-primary mb-2 tracking-wide">
                  Highlights
                </p>
                <h3 className="text-base font-semibold text-foreground mb-3">
                  {experienceSummary.subtitle}
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  {experienceSummary.points.map((point, index) => (
                    <li
                      key={`focus-${index}`}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>

            <SectionReveal delay={220}>
              <div className="rounded-lg border border-border/60 bg-gradient-to-br from-secondary to-muted p-6">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {experienceSummary.note}
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
