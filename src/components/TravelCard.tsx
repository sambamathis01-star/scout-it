import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, Eye } from "lucide-react";
import { TravelRequest } from "@/types/travel";
import { StatusBadge } from "./StatusBadge";
import { useNavigate } from "react-router-dom";

interface TravelCardProps {
  travel: TravelRequest;
}

export const TravelCard = ({ travel }: TravelCardProps) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{travel.requesterName}</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              {travel.purpose}
            </p>
          </div>
          <StatusBadge status={travel.status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{travel.destination.city}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            Du {formatDate(travel.dates.start)} au {formatDate(travel.dates.end)}
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-1">
            {travel.equipment.laptop && (
              <Badge variant="outline" className="text-xs">Ordinateur</Badge>
            )}
            {travel.equipment.simCard && (
              <Badge variant="outline" className="text-xs">Carte SIM</Badge>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/travel/${travel.id}`)}
            className="h-8"
          >
            <Eye className="h-4 w-4 mr-1" />
            Voir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};