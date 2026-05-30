import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "new"
    | "bestseller"
    | "limited"
    | "success"
    | "warning"
    | "danger"
    | "info";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-border text-silver",
    new: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    bestseller: "bg-gold/10 text-gold border border-gold/20",
    limited: "bg-red/10 text-red border border-red/20",
    success: "bg-green-500/10 text-green-400 border border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    danger: "bg-red/10 text-red border border-red/20",
    info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-[10px] font-heading tracking-widest uppercase",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
