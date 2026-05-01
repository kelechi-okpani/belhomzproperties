"use client";

import { motion } from "framer-motion";
import { Search, Users, FileCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Curated Discovery",
    description: "Browse our exclusive portfolio of verified properties across Abuja's most sought-after districts.",
    icon: <Search className="w-8 h-8" />,
    color: "bg-blue-500/10",
  },
  {
    id: "02",
    title: "Expert Consultation",
    description: "Partner with our dedicated consultants to align your lifestyle needs with the perfect architectural match.",
    icon: <Users className="w-8 h-8" />,
    color: "bg-amber-500/10",
  },
  {
    id: "03",
    title: "Secure Acquisition",
    description: "Experience a seamless closing process with absolute legal transparency and verified title delivery.",
    icon: <FileCheck className="w-8 h-8" />,
    color: "bg-emerald-500/10",
  }
];

export default function HowWeWork() {
  return (
    <section className="py-24 px-6 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Text */}
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-primary font-black uppercase tracking-[0.3em] text-sm"
          >
            Our Approach
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mt-4 mb-6 tracking-tight"
          >
            How We Define <span className="text-muted-foreground italic">Excellence.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed"
          >
            We are driven by integrity and the pursuit of innovative concepts that fuel 
            world-class customer satisfaction in the Nigerian real estate market.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-12 relative">
          
          {/* Animated Connecting Lines (Visible on Desktop) */}
          <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-[2px] border-t-2 border-dashed border-muted/30 -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative group p-8 rounded-[2rem] bg-secondary/20 hover:bg-secondary/40 transition-all duration-500 border border-transparent hover:border-primary/10"
            >
              {/* Step Number Background */}
              <div className="absolute -top-6 -right-2 text-8xl font-black text-primary/5 select-none transition-colors group-hover:text-primary/10">
                {step.id}
              </div>

              {/* Icon Circle */}
              <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500`}>
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {step.description}
              </p>

              <button className="flex items-center gap-2 text-sm font-bold text-primary group/link">
                Learn More <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}