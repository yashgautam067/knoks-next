"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { INDIAN_STATES } from "@/types";
import { cn } from "@/lib/utils";

const deliverySchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required").max(10, "Phone must be 10 digits"),
  line1: z.string().min(5, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Valid pincode required").max(6, "Pincode must be 6 digits"),
  deliveryType: z.enum(["standard", "express"]),
});

export type DeliveryFormData = z.infer<typeof deliverySchema>;

interface DeliveryFormProps {
  onSubmit: (data: DeliveryFormData) => void;
  defaultValues?: Partial<DeliveryFormData>;
  subtotal: number;
}

export default function DeliveryForm({
  onSubmit,
  defaultValues,
  subtotal,
}: DeliveryFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      deliveryType: "standard",
      ...defaultValues,
    },
  });

  const deliveryType = watch("deliveryType");
  const freeShipping = subtotal >= 99900;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          placeholder="John Doe"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <Input
          label="Email *"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <Input
        label="Phone *"
        type="tel"
        placeholder="9876543210"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <Input
        label="Address Line 1 *"
        placeholder="House/Flat No., Street"
        error={errors.line1?.message}
        {...register("line1")}
      />

      <Input
        label="Address Line 2"
        placeholder="Landmark, Area (Optional)"
        {...register("line2")}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="City *"
          placeholder="Mumbai"
          error={errors.city?.message}
          {...register("city")}
        />

        <div className="w-full">
          <label className="block text-sm font-body text-silver mb-2 uppercase tracking-wider">
            State *
          </label>
          <select
            {...register("state")}
            className="w-full bg-card border border-border text-cream px-4 py-3 font-body text-sm focus:outline-none focus:border-red focus:ring-1 focus:ring-red/20 transition-colors"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="mt-1.5 text-xs text-red font-body">
              {errors.state.message}
            </p>
          )}
        </div>

        <Input
          label="Pincode *"
          placeholder="400001"
          error={errors.pincode?.message}
          {...register("pincode")}
        />
      </div>

      {/* Delivery Type */}
      <div>
        <label className="block text-sm font-body text-silver mb-3 uppercase tracking-wider">
          Delivery Option
        </label>
        <div className="space-y-3">
          <label
            className={cn(
              "flex items-center gap-4 p-4 border cursor-pointer transition-all",
              deliveryType === "standard"
                ? "border-red bg-red/5"
                : "border-border hover:border-silver/50"
            )}
          >
            <input
              type="radio"
              value="standard"
              {...register("deliveryType")}
              className="sr-only"
            />
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                deliveryType === "standard"
                  ? "border-red"
                  : "border-border"
              )}
            >
              {deliveryType === "standard" && (
                <div className="w-2.5 h-2.5 rounded-full bg-red" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-cream text-sm font-body font-medium">
                Standard Delivery
              </p>
              <p className="text-silver/50 text-xs font-body mt-0.5">
                5-7 business days
              </p>
            </div>
            <span className="text-cream font-mono text-sm">
              {freeShipping ? "FREE" : "₹60"}
            </span>
          </label>

          <label
            className={cn(
              "flex items-center gap-4 p-4 border cursor-pointer transition-all",
              deliveryType === "express"
                ? "border-red bg-red/5"
                : "border-border hover:border-silver/50"
            )}
          >
            <input
              type="radio"
              value="express"
              {...register("deliveryType")}
              className="sr-only"
            />
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                deliveryType === "express"
                  ? "border-red"
                  : "border-border"
              )}
            >
              {deliveryType === "express" && (
                <div className="w-2.5 h-2.5 rounded-full bg-red" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-cream text-sm font-body font-medium">
                Express Delivery
              </p>
              <p className="text-silver/50 text-xs font-body mt-0.5">
                2-3 business days
              </p>
            </div>
            <span className="text-cream font-mono text-sm">₹149</span>
          </label>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isSubmitting}
      >
        Continue to Payment
      </Button>
    </form>
  );
}
