import { ArrowRight, ArrowDown } from "lucide-react";

const Hero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 hero-grid" aria-hidden="true" />
      <div className="absolute inset-0 hero-glow" aria-hidden="true" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-32">
        <p className="font-mono text-primary text-sm md:text-base mb-4 tracking-wide animate-fade-in">
          Backend & Systems Engineer
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6 animate-fade-up">
          Ahmad Husein Hambali
          <br />
        </h1>

        <p
          className="text-base md:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed animate-fade-up"
          style={{ animationDelay: "150ms" }}
        >
          Backend Engineer experienced in Node.js and TypeScript, specializing in building scalable systems and solving complex technical problems.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 animate-fade-up"
          style={{ animationDelay: "300ms" }}
        >
          <button
            onClick={() => scrollTo("projects")}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            View Projects
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="inline-flex items-center justify-center gap-2 border border-border text-foreground font-medium px-6 py-3 rounded-lg hover:bg-secondary transition-colors text-sm"
          >
            Get in Touch
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors animate-fade-in cursor-pointer"
        style={{ animationDelay: "600ms" }}
        aria-label="Scroll to about section"
      >
        <ArrowDown size={20} className="animate-bounce" />
      </button>
    </section>
  );
};

export default Hero;
