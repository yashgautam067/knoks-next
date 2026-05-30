"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckoutStepperProps {
  currentStep: number;
  steps?: string[];
}

export default function CheckoutStepper({
  currentStep,
  steps = ["Delivery", "Payment", "Confirmation"],
}: CheckoutStepperProps) {
  return (
    <div className="flex items-center justify-center w-full max-w-lg mx-auto mb-8 md:mb-12">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          {/* Step */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-xs font-heading tracking-wider transition-all duration-300",
                index < currentStep
                  ? "bg-red text-cream"
                  : index === currentStep
                  ? "bg-red/20 border-2 border-red text-red"
                  : "bg-card border border-border text-silver/30"
              )}
            >
              {index < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={cn(
                "text-[10px] md:text-xs font-heading tracking-widest uppercase mt-2",
                index <= currentStep ? "text-cream" : "text-silver/30"
              )}
            >
              {step}
            </span>
          </div>

          {/* Connector */}
          {index < steps.length - 1 && (
            <div className="flex-1 mx-2 md:mx-4">
              <div className="relative h-[2px] bg-border">
                <div
                  className="absolute inset-y-0 left-0 bg-red transition-all duration-500"
                  style={{
                    width: index < currentStep ? "100%" : "0%",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
