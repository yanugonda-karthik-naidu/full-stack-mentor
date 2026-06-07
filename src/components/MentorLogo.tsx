import { type ComponentProps } from "react";

import { cn } from "@/lib/utils";

type Props = ComponentProps<"svg"> & { size?: number };

export function MentorLogo({ size = 28, className, ...props }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="l2c-g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="oklch(0.72 0.18 78)" />
          <stop offset="100%" stopColor="oklch(0.62 0.2 32)" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#l2c-g)" />
      <path
        d="M13 14h6v12h-6zM24 14h6v3h-3v9h-3z"
        fill="oklch(0.18 0.05 270)"
      />
    </svg>
  );
}