import { Github, Linkedin, Mail } from "lucide-react";
import { socialLinks, coreStrengths, description } from "@/data/about";
import SectionReveal from "./SectionReveal";

const About = () => {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <SectionReveal>
          <p className="font-mono text-primary text-sm mb-3 tracking-wide">
            About
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            A bit about me
          </h2>
        </SectionReveal>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <SectionReveal delay={100}>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-8">
              <a
                href={`mailto:${socialLinks.email}`}
                aria-label="Email"
                className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Mail size={18} />
              </a>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Github size={18} />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </SectionReveal>

          <SectionReveal delay={200}>
            <h3 className="text-sm font-mono text-primary mb-4 tracking-wide">
              Core Strengths
            </h3>
            <ul className="space-y-3">
              {coreStrengths.map((strength, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
};

export default About;
