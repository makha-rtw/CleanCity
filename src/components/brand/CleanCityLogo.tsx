import React from "react";

interface CleanCityLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function CleanCityLogo({
  className = "",
  showText = true,
  size = "md",
}: CleanCityLogoProps) {
  const boxSize =
    size === "sm" ? "w-8 h-8" : size === "lg" ? "w-10 h-10" : "w-9 h-9";
  const textSize =
    size === "sm" ? "text-base" : size === "lg" ? "text-xl" : "text-lg";

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div
        className={`relative flex items-center justify-center rounded-xl bg-ink text-surface ${boxSize}`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path
            d="M24.5 11.5A9 9 0 1 0 24.5 24.5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M23 10.5C26.5 9.5 29 11.5 28.5 15C25 15.5 22.5 13.5 23 10.5Z"
            fill="#41C889"
          />
        </svg>
      </div>

      {showText ? (
        <span
          translate="no"
          className={`font-semibold tracking-tight text-ink ${textSize}`}
        >
          CleanCity
        </span>
      ) : null}
    </div>
  );
}
