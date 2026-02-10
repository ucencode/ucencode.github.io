import { Mail, Linkedin } from "lucide-react";
import { socialLinks } from "@/data/about";
import SectionReveal from "./SectionReveal";

const Contact = () => {
  return (
    <section id="contact" className="py-24 md:py-32 section-alt">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid place-items-center">
          <SectionReveal>
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card/70 px-8 py-10 text-center shadow-sm">
              <p className="font-mono text-primary text-sm mb-3 tracking-wide">
                Contact
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Let's Connect
              </h2>
              <p className="text-muted-foreground mb-8">
                <span className="block">
                  Feel free to reach out via email or connect with me on
                  LinkedIn.
                </span>
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Mail size={16} />
                  Email Me
                </a>
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </a>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                {socialLinks.email}
              </p>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
