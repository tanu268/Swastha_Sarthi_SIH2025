import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

export function GlassCard({ children, className, hover = false, style }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "glass-card rounded-xl p-6",
        hover && "hover-lift hover:bg-glass-medium transition-all duration-300",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}