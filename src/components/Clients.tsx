import { ExternalLink } from "lucide-react";
import { clients } from "@/data/projects";
import SectionReveal from "./SectionReveal";

const Clients = () => {
  return (
    <section id="clients" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <SectionReveal>
          <p className="font-mono text-primary text-sm mb-3 tracking-wide">
            Clients
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Companies I've Worked With
          </h2>
          <p className="text-muted-foreground max-w-lg mb-12">
            Organizations that trusted me with their digital products and
            systems.
          </p>
        </SectionReveal>

        <SectionReveal delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {clients.map((client) => (
              <a
                key={client.name}
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 p-6 rounded-lg border border-border bg-card hover:border-primary/40 transition-all duration-300"
              >
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {client.name}
                </span>
                <ExternalLink
                  size={12}
                  className="text-muted-foreground/40 group-hover:text-primary transition-colors"
                />
              </a>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

export default Clients;
