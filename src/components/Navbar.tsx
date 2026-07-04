import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/understanding", label: "Hearing Loss" },
  { to: "/cochlear-implants", label: "Cochlear Implants" },
  { to: "/programs", label: "Programs" },
  { to: "/webinars", label: "Webinars" },
  { to: "/stories", label: "Stories" },
  { to: "/fundraisers", label: "Fundraisers" },
  { to: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Samaanya Foundation logo" className="h-12 w-auto" />
          <span className="hidden font-serif text-xl tracking-tight text-primary sm:inline">
            Samaanya Foundation
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "rounded text-sm font-medium transition-smooth hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive ? "text-accent" : "text-foreground/75",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="hero" size="default" className="rounded-full">
            <Link to="/donate">Donate</Link>
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          className="rounded-md p-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="flex flex-col gap-1 p-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-smooth",
                  location.pathname === l.to
                    ? "bg-primary-soft text-primary"
                    : "text-foreground/80 hover:bg-muted",
                )}
              >
                {l.label}
              </Link>
            ))}
            <Button asChild variant="hero" className="mt-3 rounded-full">
              <Link to="/donate" onClick={() => setOpen(false)}>
                Donate
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
