"use client";
import React, { useEffect, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";
import { XIcon, CheckCircleIcon, AlertCircleIcon, InfoIcon } from "lucide-react";

const toastVariants = cva(
  "pointer-events-auto flex w-full items-center justify-between space-x-4 rounded-lg border p-4 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "border-gray-200 bg-white text-gray-800",
        success: "border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800",
        error: "border-red-100 bg-red-50 text-red-800",
        info: "border-blue-100 bg-blue-50 text-blue-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title: string;
  description?: string;
  onClose?: () => void;
  duration?: number;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, title, description, onClose, duration = 5000, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose?.();
        }, 300); // Wait for fade-out animation
      }, duration);

      return () => clearTimeout(timer);
    }, [duration, onClose]);

    const IconComponent = variant === "success" 
      ? CheckCircleIcon 
      : variant === "error" 
      ? AlertCircleIcon 
      : InfoIcon;

    return isVisible ? (
      <div
        ref={ref}
        className={cn(
          toastVariants({ variant }),
          "transform transition-all duration-300 ease-in-out",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          className
        )}
        {...props}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <IconComponent className={cn(
              "h-5 w-5",
              variant === "success" ? "text-green-600" : 
              variant === "error" ? "text-red-600" : 
              "text-blue-600"
            )} />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">{title}</h3>
            {description && <div className="mt-1 text-sm text-gray-500">{description}</div>}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => {
              onClose?.();
            }, 300);
          }}
          className="flex-shrink-0 rounded-md p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <XIcon className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    ) : null;
  }
);

Toast.displayName = "Toast";

export { Toast, toastVariants };