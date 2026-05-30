"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
          phone: form.phone,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome to KNOKS!");
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="KNOKS"
            width={140}
            height={46}
            className="h-10 w-auto mx-auto mb-4"
          />
        </Link>
        <p className="text-silver/40 text-xs font-heading tracking-[0.2em]">
          CREATE YOUR ACCOUNT
        </p>
      </div>

      <div className="bg-charcoal border border-border p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="John Doe"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="john@example.com"
          />
          <Input
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={handleChange("phone")}
            placeholder="9876543210"
          />
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange("password")}
              placeholder="Min 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-silver/30 hover:text-silver"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <Input
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            placeholder="Re-enter password"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            size="lg"
            isLoading={loading}
          >
            Create Account
          </Button>
        </form>

        <p className="text-center text-silver/40 text-sm font-body mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-red hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
