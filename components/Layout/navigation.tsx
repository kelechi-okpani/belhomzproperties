"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-b py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-black tracking-tighter text-primary">
          BELHOMZ<span className="text-foreground">.</span>
        </Link>
        
        <div className="hidden md:flex gap-8 text-sm font-medium">
          {["Buy", "Rent", "Sell", "Agents"].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`} className="hover:text-primary transition-colors">
              {item}
            </Link>
          ))}
        </div>

        <Button size="sm" className="rounded-full px-6">List Property</Button>
      </div>
    </motion.nav>
  );
}