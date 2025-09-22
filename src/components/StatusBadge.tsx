import { Badge } from "@/components/ui/badge";
import { TravelStatus } from "@/types/travel";

interface StatusBadgeProps {
  status: TravelStatus;
}

const statusConfig = {
  pending: {
    label: "En attente",
    variant: "secondary" as const,
  },
  approved: {
    label: "Validé",
    variant: "default" as const,
  },
  in_progress: {
    label: "En cours",
    variant: "outline" as const,
  },
  completed: {
    label: "Terminé",
    variant: "secondary" as const,
  },
  rejected: {
    label: "Refusé",
    variant: "destructive" as const,
  },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} className="font-medium">
      {config.label}
    </Badge>
  );
};