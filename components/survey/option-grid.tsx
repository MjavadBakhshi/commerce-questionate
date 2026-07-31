"use client";

import { cn } from "@/lib/utils";

interface OptionGridProps {
  options: readonly string[];
  value: string | string[];
  mode: "single" | "multi";
  maxSelections?: number;
  onChange: (value: string | string[]) => void;
  invalid?: boolean;
  describedBy?: string;
}

export function OptionGrid({
  options,
  value,
  mode,
  maxSelections,
  onChange,
  invalid,
  describedBy,
}: OptionGridProps) {
  const selected = mode === "single" ? [value as string].filter(Boolean) : (value as string[]);

  function handleSelect(option: string) {
    if (mode === "single") {
      onChange(option);
      return;
    }

    const current = selected;
    if (current.includes(option)) {
      onChange(current.filter((item) => item !== option));
      return;
    }

    if (maxSelections && current.length >= maxSelections) return;
    onChange([...current, option]);
  }

  const atMax =
    mode === "multi" && maxSelections !== undefined && selected.length >= maxSelections;

  return (
    <div
      role={mode === "single" ? "radiogroup" : "group"}
      aria-invalid={invalid}
      aria-describedby={describedBy}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {options.map((option) => {
        const isSelected = selected.includes(option);
        const isDisabled = atMax && !isSelected;

        return (
          <button
            key={option}
            type="button"
            role={mode === "single" ? "radio" : "checkbox"}
            aria-checked={isSelected}
            disabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => handleSelect(option)}
            className={cn(
              "rounded-xl border-2 px-4 py-3.5 text-start text-sm font-medium transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              isSelected
                ? "border-primary bg-primary text-primary-foreground shadow-md"
                : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent/50",
              isDisabled && "cursor-not-allowed opacity-45 hover:border-border hover:bg-card",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
