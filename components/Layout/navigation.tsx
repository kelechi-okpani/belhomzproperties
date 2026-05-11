"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { BelhomzLogo } from "../utils/BelhomzLogo";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Properties", href: "/properties" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
          isScrolled 
            ? "bg-background/90 backdrop-blur-xl border-b border-white/5 py-3" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          <Link href="/" className="relative z-[110]">
            <BelhomzLogo className="text-foreground w-32 md:w-40 h-auto" />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/properties" className="hidden lg:inline-block cursor-pointer">

            <Button 
              size="sm" 
              className="hidden sm:flex rounded-full h-10 cursor-pointer px-8  bg-foreground text-background hover:bg-primary hover:text-white transition-all font-bold uppercase tracking-tighter text-[10px]"
            >
              View Property <ArrowUpRight size={12} className="ml-1" />
            </Button>
</Link>
            {/* TOGGLE BUTTON: Stays visible above the drawer */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 relative z-[120] text-foreground hover:bg-white/5 rounded-full transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE DRAWER: More compact and focused */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dark Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[105] bg-black/60 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-[400px] z-[110] bg-background border-l border-white/5 shadow-2xl flex flex-col lg:hidden"
            >
              <div className="flex flex-col h-full p-8 pt-24">
                <div className="space-y-6">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-8">Navigation</p>
                  {navLinks.map((link, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      key={link.name}
                    >
                      <Link 
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-2xl font-bold tracking-tight hover:text-primary transition-colors inline-block"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-auto pt-12 border-t border-white/5">
                <Link href="/properties" className="cursor-pointer">
                <Button size="lg" className="cursor-pointer w-full h-14 rounded-xl text-sm font-bold uppercase tracking-widest mb-6">
                    View Properties
                  </Button>
                </Link>
                  
                  <div className="space-y-2 opacity-50">
                    <p className="text-[10px] uppercase tracking-widest font-bold">Abuja Headquarters</p>
                    <p className="text-[10px] uppercase tracking-widest font-bold">Nigeria / 2026</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}