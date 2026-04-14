"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  name: string;
}

export default function CheckboxField({
  label,
  description,
  checked,
  onCheckedChange,
  name,
}: CheckboxFieldProps) {
  return (
    <div className="flex items-start space-x-3 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors">
      <Checkbox
        id={name}
        checked={checked}
        onCheckedChange={(val) => onCheckedChange(val === true)}
        className="mt-0.5"
      />
      <div className="space-y-1">
        <Label htmlFor={name} className="cursor-pointer font-medium">
          {label}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
