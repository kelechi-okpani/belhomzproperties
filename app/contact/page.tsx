'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  MapPin, 
  Clock, 
  Globe, 
  MessageSquare,
  ArrowUpRight,
  ChevronDown,
  Check,
  Home,
  BarChart3,
  Shield,
  HardHat
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const contactChannels = [
  {
    icon: MapPin,
    title: "The Abuja Desk",
    details: "Maitama District, Abuja, Nigeria",
    description: "Physical consultations available by appointment at our headquarters."
  },
  {
    icon: Globe,
    title: "Global Reach",
    details: "invest@belhomz.com",
    description: "Tailored infrastructure for diaspora and international stakeholders."
  },
  {
    icon: Clock,
    title: "Operational Window",
    details: "08:00 — 18:00 WAT",
    description: "Standard business hours across all Nigerian service zones."
  }
];

const inquiryOptions = [
  { 
    id: "acquisition", 
    label: "Estate Acquisition", 
    description: "Private procurement of luxury residential assets.",
    icon: Home 
  },
  { 
    id: "portfolio", 
    label: "Asset Management", 
    description: "Optimizing yields for global property portfolios.",
    icon: BarChart3 
  },
  { 
    id: "divestment", 
    label: "Property Divestment", 
    description: "Strategic listing and sale of premium holdings.",
    icon: Shield 
  },
  { 
    id: "development", 
    label: "Structural Advisory", 
    description: "Consultation for high-performance developments.",
    icon: HardHat 
  },
];

export default function ContactPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(inquiryOptions[0]);

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-20">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* REFINED EDITORIAL HEADER */}
        <header className="mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-[1px] w-8 bg-primary/60" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold">
                Inquiry Management
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
              Secure Your <br /> 
              <span className="relative inline-block">
                Handshake
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="absolute -bottom-2 left-0 h-[2px] bg-primary/20"
                />
              </span>
              <span className="text-muted-foreground/40 font-light italic ml-3">.</span>
            </h1>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative pl-8"
            >
              <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary via-primary/20 to-transparent" />
              <p className="text-lg md:text-xl text-muted-foreground/80 max-w-xl leading-relaxed font-medium">
                Whether acquiring a legacy estate in Abuja or diversifying a portfolio, 
                our desk facilitates high-performance transitions for the global elite.
              </p>
            </motion.div>
          </motion.div>
        </header>

        {/* INTERFACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* LEFT: Channels */}
          <div className="lg:col-span-5 space-y-12">
            <div className="grid grid-cols-1 gap-6">
              {contactChannels.map((item, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={item.title}
                  className="p-8 rounded-[2rem] bg-secondary/30 border border-border hover:border-primary/50 transition-all"
                >
                  <item.icon className="text-primary mb-6" size={24} />
                  <h3 className="text-sm font-bold mb-2 uppercase tracking-widest">{item.title}</h3>
                  <p className="text-xl font-bold mb-2">{item.details}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="p-8 rounded-[2rem] bg-primary text-primary-foreground">
              <MessageSquare size={32} className="mb-6" />
              <h4 className="text-2xl font-bold tracking-tighter mb-2">Priority WhatsApp</h4>
              <p className="font-medium mb-6 opacity-90 text-sm">Immediate response for active acquisitions and valuations.</p>
              <Button variant="outline" className="w-full rounded-xl bg-transparent border-primary-foreground/20 hover:bg-primary-foreground hover:text-primary font-bold">
                CONNECT NOW
              </Button>
            </div>
          </div>

          {/* RIGHT: High-Performance Intake Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="lg:col-span-7 bg-secondary/10 border border-border rounded-[3rem] p-8 md:p-16 relative overflow-visible"
          >
            <form className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 ml-1">Full Name</label>
                  <Input 
                    placeholder="E.g. Samuel Okoro" 
                    className="h-16 bg-background/50 border-border rounded-xl focus:border-primary transition-all px-6"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 ml-1">Email Address</label>
                  <Input 
                    type="email" 
                    placeholder="name@domain.com" 
                    className="h-16 bg-background/50 border-border rounded-xl focus:border-primary transition-all px-6"
                  />
                </div>
              </div>

              {/* PROFESSIONAL CONCIERGE DROPDOWN */}
              <div className="space-y-3 relative">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/60 ml-1">
                  Service Classification
                </label>
                
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className={`w-full h-20 bg-background/50 border transition-all duration-300 px-8 rounded-2xl flex items-center justify-between group ${
                    isOpen ? "border-primary ring-1 ring-primary/20" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="p-2 rounded-lg bg-secondary border border-border text-primary">
                      <selected.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 leading-none mb-1.5">Selected Interest</p>
                      <p className="text-lg font-bold tracking-tight leading-none">{selected.label}</p>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`transition-transform duration-500 text-muted-foreground ${isOpen ? "rotate-180 text-primary" : ""}`} 
                    size={20} 
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <>
                      <div className="fixed inset-0 z-[120]" onClick={() => setIsOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-[calc(100%+8px)] left-0 w-full bg-background border border-border rounded-[2rem] shadow-2xl z-[130] overflow-hidden p-3"
                      >
                        <div className="grid grid-cols-1 gap-1">
                          {inquiryOptions.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => {
                                setSelected(option);
                                setIsOpen(false);
                              }}
                              className={`flex items-center justify-between p-4 rounded-2xl transition-all group text-left ${
                                selected.id === option.id 
                                ? "bg-primary text-primary-foreground" 
                                : "hover:bg-secondary"
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${selected.id === option.id ? "bg-white/20" : "bg-secondary border border-border"}`}>
                                  <option.icon size={18} />
                                </div>
                                <div>
                                  <p className="font-bold tracking-tight text-base">{option.label}</p>
                                  <p className={`text-xs ${selected.id === option.id ? "opacity-80" : "text-muted-foreground"}`}>
                                    {option.description}
                                  </p>
                                </div>
                              </div>
                              {selected.id === option.id && <Check size={18} strokeWidth={3} />}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 ml-1">Message</label>
                <Textarea 
                  placeholder="Describe your requirements..." 
                  className="min-h-[160px] bg-background/50 border-border rounded-2xl focus:border-primary transition-all p-6"
                />
              </div>

              <Button className="w-full h-20 rounded-2xl bg-foreground text-background hover:bg-primary hover:text-white transition-all text-lg font-bold group">
                TRANSMIT INQUIRY 
                <Send size={18} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
              
              <div className="flex justify-between items-center opacity-30 pt-4">
                <p className="text-[10px] uppercase tracking-widest font-bold">ABV / HQ / 2026</p>
                <p className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                  Encrypted <ArrowUpRight size={10} />
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}