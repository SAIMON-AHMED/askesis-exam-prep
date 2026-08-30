import React from "react";

interface ButtonSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export function ButtonSpinner({
  size = 18,
  color = "currentColor",
  className = "",
}: ButtonSpinnerProps) {
  return (
    <svg
      className={`animate-spin-custom ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9.5"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        style={{ opacity: 0.25 }}
      />
      <path
        d="M12 2.5C17.2467 2.5 21.5 6.75329 21.5 12"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
