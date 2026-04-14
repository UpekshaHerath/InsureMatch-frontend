"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export default function FormField({
  label,
  error,
  registration,
  type = "text",
  placeholder,
  required,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={registration.name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={registration.name}
        type={type}
        placeholder={placeholder}
        {...registration}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
