"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFieldProps {
  label: string;
  error?: string;
  value?: string;
  onValueChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  name: string;
}

function handleChange(
  onValueChange: (value: string) => void
): (value: string | null) => void {
  return (value) => {
    if (value !== null) {
      onValueChange(value);
    }
  };
}

export default function SelectField({
  label,
  error,
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  required,
  name,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select value={value ?? ""} onValueChange={handleChange(onValueChange)}>
        <SelectTrigger id={name} className={error ? "border-red-500" : ""}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
