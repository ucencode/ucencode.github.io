import { socialLinks } from "@/data/about";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Clients", href: "#clients" },
  { label: "Contact", href: "#contact" },
];

const Footer = () => {
  const scrollTo = (href: string) => {
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs text-muted-foreground/60 text-center">
            © {new Date().getFullYear()} Ahmad Husein Hambali. All rights reserved.
          </p>
      </div>
    </footer>
  );
};

export default Footer;
