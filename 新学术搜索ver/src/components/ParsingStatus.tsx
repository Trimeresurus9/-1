import React from 'react';
import { motion } from 'motion/react';
import { Info } from 'lucide-react';

export function ParsingStatus() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {/* Animated Scanning Icon */}
        <motion.div 
          className="mb-8 inline-block"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Circular arrows */}
            <motion.path
              d="M60 20 C 80 20, 100 40, 100 60"
              stroke="#1f2937"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <polygon 
              points="105,55 100,60 105,65" 
              fill="#1f2937"
            />

            <motion.path
              d="M60 100 C 40 100, 20 80, 20 60"
              stroke="#1f2937"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.75
              }}
            />
            <polygon 
              points="15,65 20,60 15,55" 
              fill="#1f2937"
            />

            {/* Magnifying glass in center */}
            <circle 
              cx="60" 
              cy="60" 
              r="20" 
              stroke="#374151"
              strokeWidth="3"
              fill="none"
            />
            <line
              x1="75"
              y1="75"
              x2="85"
              y2="85"
              stroke="#374151"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Main Text */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Analyzing Document...
        </h2>

        {/* Tip Card */}
        <motion.div 
          className="inline-flex items-start gap-3 max-w-md px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-sm text-left"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Info className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <span className="font-medium">Tip:</span> Documents may take some time to analyze, depending on the size and number. You can read the Original PDF while waiting.
          </div>
        </motion.div>

        {/* Progress indicator dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}