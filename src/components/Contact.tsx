import { useState } from "react";
import { Mail, MapPin, Send, Github, Linkedin } from "lucide-react";
import { socialLinks } from "@/data/projects";
import SectionReveal from "./SectionReveal";

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formState.name.trim()) newErrors.name = "Name is required";
    if (!formState.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email))
      newErrors.email = "Invalid email address";
    if (!formState.message.trim()) newErrors.message = "Message is required";
    else if (formState.message.length > 1000)
      newErrors.message = "Message too long (max 1000 characters)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Form not connected yet — show success state
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 md:py-32 section-alt">
      <div className="max-w-5xl mx-auto px-6">
        <SectionReveal>
          <p className="font-mono text-primary text-sm mb-3 tracking-wide">
            Contact
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Let's Connect
          </h2>
          <p className="text-muted-foreground max-w-lg mb-12">
            Open to new opportunities and collaborations. Reach out via email
            or connect on social platforms.
          </p>
        </SectionReveal>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Info column */}
          <SectionReveal delay={100}>
            <div className="space-y-6">
              <a
                href={`mailto:${socialLinks.email}`}
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="p-2.5 rounded-lg border border-border group-hover:border-primary transition-colors">
                  <Mail size={18} />
                </div>
                <span className="text-sm">{socialLinks.email}</span>
              </a>

              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="p-2.5 rounded-lg border border-border">
                  <MapPin size={18} />
                </div>
                <span className="text-sm">Malang, Indonesia</span>
              </div>

              <div className="flex items-center gap-3 pt-4">
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
            </div>
          </SectionReveal>

          {/* Form column */}
          <SectionReveal delay={200}>
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="p-3 rounded-full bg-accent mb-4">
                  <Send size={20} className="text-primary" />
                </div>
                <p className="text-foreground font-medium mb-1">
                  Message received!
                </p>
                <p className="text-muted-foreground text-sm">
                  For now, please use email directly. Form backend coming soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-mono text-muted-foreground mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    maxLength={100}
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-mono text-muted-foreground mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    maxLength={255}
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-mono text-muted-foreground mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    maxLength={1000}
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                    placeholder="What would you like to discuss?"
                  />
                  {errors.message && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-lg hover:opacity-90 transition-opacity text-sm"
                >
                  <Send size={14} />
                  Send Message
                </button>
              </form>
            )}
          </SectionReveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
