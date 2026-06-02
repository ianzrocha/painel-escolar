import { forwardRef } from "react";

export const UserCheckIcon = forwardRef<SVGSVGElement, { className?: string }>(({ className }, ref) => {
  return (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"} aria-hidden="true">
      <path d="m16 11 2 2 4-4"></path>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
    </svg>
  );
});
