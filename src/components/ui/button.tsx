import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Swastha Sarthi custom variants
        hero: "bg-gradient-to-r from-accent-cyan to-accent-purple text-primary-foreground font-bold hover:scale-105 hover:shadow-2xl btn-glow",
        glass: "glass-card text-foreground hover:bg-glass-medium hover:scale-105 hover-lift",
        glow: "bg-gradient-to-r from-accent-purple to-accent-coral text-white hover:scale-105 glow-purple",
        success: "bg-gradient-to-r from-accent-emerald to-accent-cyan text-white hover:scale-105 glow-cyan",
        warning: "bg-gradient-to-r from-accent-coral to-accent-yellow text-bg-deep hover:scale-105 glow-coral",
        minimal: "bg-glass-light text-muted-foreground border border-border hover:bg-glass-medium hover:text-foreground",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-13 rounded-lg px-8 text-base",
        xl: "h-16 rounded-xl px-12 text-lg font-bold",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
