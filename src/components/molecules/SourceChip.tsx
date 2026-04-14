import { Badge } from "@/components/ui/badge";

interface SourceChipProps {
  source: string;
}

export default function SourceChip({ source }: SourceChipProps) {
  return (
    <Badge variant="outline" className="text-xs">
      {source}
    </Badge>
  );
}
