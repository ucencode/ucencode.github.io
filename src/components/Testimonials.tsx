import SectionReveal from "./SectionReveal";
import { socialLinks } from "@/data/about";

const recommendationsUrl = new URL(
  "details/recommendations/?detailScreenTabIndex=0",
  socialLinks.linkedin.endsWith("/") ? socialLinks.linkedin : `${socialLinks.linkedin}/`
).toString();

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <SectionReveal>
          <p className="font-mono text-primary text-sm mb-3 tracking-wide">
            Peer Recognition
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">
            What Colleagues Say
          </h2>
        </SectionReveal>

        <SectionReveal delay={120}>
          <div className="bg-[rgba(0,255,163,0.05)] border-l-[3px] border-[#00ffa3] p-6 rounded-lg my-5">
            <p className="italic text-[#e0e0e0] leading-relaxed text-[1.1rem]">
              "I had the privilege of leading Husein at Nosc AI, where he served
              as a Backend Engineer. Husein is the kind of engineer you want in
              your corner when building complex, high-performance systems. He
              built the billing, invoicing system and many core functionalities
              which were crucial for us. He is a fantastic asset to any
              engineering team that values code quality and integrity."
            </p>
            <div className="mt-6">
              <a
                href="https://www.linkedin.com/in/suryasurakhman/?locale=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:text-primary/80 hover:underline transition-colors"
              >
                -- Surya Surakhman
              </a>
              <p className="text-sm text-muted-foreground">
                Senior Fullstack Engineer
              </p>
              <p className="text-sm text-muted-foreground">
                Ex-Coupang &amp; HOOQ | Distributed Systems &amp; AI
              </p>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={200}>
          <a
            href={recommendationsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            View all recommendations on LinkedIn -&gt;
          </a>
        </SectionReveal>
      </div>
    </section>
  );
};

export default Testimonials;
