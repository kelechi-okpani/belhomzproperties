'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BelhomzLoader = () => {
  // SVG Path variants for the "drawing" effect
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 2, 
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror" as const,
        repeatDelay: 0.5
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.8,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-950 z-[9999]">
      <div className="relative flex flex-col items-center">
        {/* The Animated Logo */}
        <svg 
          width="200" 
          height="100" 
          viewBox="0 0 240 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.g 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-slate-900 dark:text-white"
          >
            {/* Main Roof Structure */}
            <motion.path 
              d="M100 45 L120 15 L140 45" 
            //   variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
            {/* Structural Detail */}
            <motion.path 
              d="M120 25 L120 55" 
            //   variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
            <motion.path 
              d="M130 55 L130 35 L145 35 L145 55" 
            //   variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
          </motion.g>

          {/* Animated Text */}
          <motion.text 
            x="120" 
            y="85" 
            textAnchor="middle"
            fontFamily="system-ui, sans-serif" 
            fontSize="28" 
            fill="currentColor"
            className="text-slate-900 dark:text-white"
            // variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            <tspan fontWeight="300">Bel</tspan><tspan fontWeight="700">Homz</tspan>
          </motion.text>
        </svg>

        {/* Minimalist Progress Bar */}
        <motion.div 
          className="w-32 h-[1px] bg-slate-100 dark:bg-slate-800 mt-6 overflow-hidden rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div 
            className="h-full bg-slate-400 dark:bg-slate-500"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default BelhomzLoader;