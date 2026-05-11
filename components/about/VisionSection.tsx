'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Eye, Target, Zap } from 'lucide-react';

const values = [
  {
    title: "Uncompromising Integrity",
    description: "Every transaction is backed by 100% title verification and transparent legal frameworks.",
    icon: ShieldCheck,
  },
  {
    title: "Future-Proof Vision",
    description: "We anticipate market shifts to ensure your investment remains high-yielding for generations.",
    icon: Eye,
  },
  {
    title: "Precision Execution",
    description: "Our approach focuses on performance-first architecture and seamless project delivery.",
    icon: Target,
  },
  {
    title: "High-Availability Living",
    description: "We prioritize infrastructure that ensures consistent power, security, and connectivity.",
    icon: Zap,
  }
];

export default function VisionSection() {
  return (
    <section className="py-24 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm uppercase tracking-[0.4em] text-primary/60 font-bold mb-4">Our DNA</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Built on <span className="text-muted-foreground font-light italic">Trust</span>, <br />
            Driven by <span className="text-muted-foreground font-light italic">Innovation.</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-[2rem] border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-all duration-500 cursor-default"
            >
              <div className="mb-6 p-4 rounded-2xl bg-secondary inline-block group-hover:bg-primary-foreground/10 group-hover:text-primary-foreground transition-colors">
                <value.icon size={28} strokeWidth={1.5} />
              </div>
              <h4 className="text-xl font-bold mb-4 tracking-tight">{value.title}</h4>
              <p className="text-muted-foreground group-hover:text-primary-foreground/80 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Vision Statement Quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 p-12 rounded-[3rem] border border-border bg-secondary/30 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Target size={200} />
          </div>
          <p className="text-2xl md:text-3xl font-medium max-w-4xl mx-auto leading-relaxed relative z-10">
            "Our vision is to become the primary bridge between architectural innovation and the high-end residential landscape in West Africa."
          </p>
          <p className="mt-6 font-bold uppercase tracking-widest text-sm text-primary/50">— The Belhomz Mission Statement</p>
        </motion.div>
      </div>
    </section>
  );
}