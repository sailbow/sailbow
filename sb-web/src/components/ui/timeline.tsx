"use client";

import { motion } from "framer-motion";

interface TimelineProps {
  steps: string[];
  currentStep: number;
}

export default function Timeline({ steps, currentStep }: TimelineProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          <motion.div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              index === currentStep ? "bg-primary" : "bg-muted"
            }`}
            initial={false}
            animate={{
              scale: index + 1 === currentStep ? 1.2 : 1,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
          >
            <span
              className={`text-sm ${index < currentStep ? "text-primary-foreground" : "text-muted-foreground"}`}
            >
              {index + 1} d
            </span>
          </motion.div>
          <span className="mt-2 text-xs">{step}</span>
        </div>
      ))}
    </div>
  );
}
