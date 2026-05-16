import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const sectionItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
const onHomepage = pathname === "/";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (!onHomepage) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = sectionItems
        .map((item) => document.getElementById(item.href.slice(1)))
        .filter(Boolean) as HTMLElement[];

      for (let i = sections.length - 1; i >= 0; i--) {
        if (window.scrollY >= sections[i].offsetTop - 120) {
          setActiveSection(sectionItems[i].href.slice(1));
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.getElementById(href.slice(1));
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navItemClass = (href: string, base: string) =>
    cn(base, onHomepage && activeSection === href.slice(1)
      ? "text-primary"
      : "text-muted-foreground hover:text-foreground");

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="/"
          className="font-mono text-sm font-medium text-primary tracking-wide hover:opacity-80 transition-opacity"
        >
          ucen.dev
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {sectionItems.map((item) => onHomepage ? (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className={navItemClass(item.href, "px-3 py-1.5 text-sm rounded-md transition-colors duration-200")}
            >
              {item.label}
            </button>
          ) : (
            <a
              key={item.href}
              href={`/${item.href}`}
              className={navItemClass(item.href, "px-3 py-1.5 text-sm rounded-md transition-colors duration-200")}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-out border-b border-border bg-background/95 backdrop-blur-md",
          menuOpen ? "max-h-100 opacity-100" : "max-h-0 opacity-0 border-b-0"
        )}
      >
        <nav className="px-6 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
          {sectionItems.map((item) => onHomepage ? (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className={navItemClass(item.href, "text-left px-3 py-3 text-base rounded-md transition-colors")}
            >
              {item.label}
            </button>
          ) : (
            <a
              key={item.href}
              href={`/${item.href}`}
              className={navItemClass(item.href, "px-3 py-3 text-base rounded-md transition-colors")}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
