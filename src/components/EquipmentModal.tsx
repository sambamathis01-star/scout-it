import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  MapPin, 
  User, 
  Laptop, 
  Smartphone, 
  Tablet,
  Monitor,
  Clock
} from "lucide-react";
import { Equipment, EquipmentHistory } from "@/types/equipment";

// Import avatars
import marieDuboisAvatar from "@/assets/avatars/marie-dubois.jpg";
import thomasMartinAvatar from "@/assets/avatars/thomas-martin.jpg";
import sophieLaurentAvatar from "@/assets/avatars/sophie-laurent.jpg";

interface EquipmentModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for equipment history
const mockHistory: EquipmentHistory[] = [
  {
    id: '1',
    equipmentId: 'laptop-001',
    userId: 'marie-001',
    userName: 'Marie Dubois',
    userAvatar: marieDuboisAvatar,
    travelId: '1',
    destination: 'Paris',
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    status: 'ongoing',
    purpose: 'Salon professionnel Tech Summit 2024'
  },
  {
    id: '2',
    equipmentId: 'laptop-001',
    userId: 'thomas-001',
    userName: 'Thomas Martin',
    userAvatar: thomasMartinAvatar,
    travelId: '2',
    destination: 'Lyon',
    startDate: '2024-01-08',
    endDate: '2024-01-10',
    status: 'completed',
    purpose: 'Formation technique'
  },
  {
    id: '3',
    equipmentId: 'laptop-001',
    userId: 'sophie-001',
    userName: 'Sophie Laurent',
    userAvatar: sophieLaurentAvatar,
    travelId: '3',
    destination: 'Marseille',
    startDate: '2023-12-20',
    endDate: '2023-12-22',
    status: 'completed',
    purpose: 'Réunion client stratégique'
  }
];

const getEquipmentIcon = (type: string) => {
  switch (type) {
    case 'laptop':
      return <Laptop className="h-4 w-4" />;
    case 'simcard':
      return <Smartphone className="h-4 w-4" />;
    case 'tablet':
      return <Tablet className="h-4 w-4" />;
    default:
      return <Monitor className="h-4 w-4" />;
  }
};

const getStatusBadge = (status: string) => {
  const config = {
    available: { label: 'Disponible', variant: 'secondary' as const },
    assigned: { label: 'Assigné', variant: 'default' as const },
    in_transit: { label: 'En transit', variant: 'outline' as const },
    maintenance: { label: 'Maintenance', variant: 'destructive' as const },
  };
  
  const statusConfig = config[status as keyof typeof config] || config.available;
  
  return (
    <Badge variant={statusConfig.variant}>
      {statusConfig.label}
    </Badge>
  );
};

const getHistoryStatusBadge = (status: string) => {
  const config = {
    completed: { label: 'Terminé', variant: 'secondary' as const },
    ongoing: { label: 'En cours', variant: 'default' as const },
    cancelled: { label: 'Annulé', variant: 'destructive' as const },
  };
  
  const statusConfig = config[status as keyof typeof config] || config.completed;
  
  return (
    <Badge variant={statusConfig.variant} className="text-xs">
      {statusConfig.label}
    </Badge>
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const EquipmentModal = ({ equipment, isOpen, onClose }: EquipmentModalProps) => {
  if (!equipment) return null;

  const equipmentHistory = mockHistory.filter(h => h.equipmentId === equipment.id);
  const currentUser = equipmentHistory.find(h => h.status === 'ongoing');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3">
            {getEquipmentIcon(equipment.type)}
            <div>
              <div className="flex items-center gap-2">
                {equipment.model}
                {getStatusBadge(equipment.status)}
              </div>
              <p className="text-sm text-muted-foreground font-normal">
                N° série: {equipment.serialNumber}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Assignment */}
          {currentUser && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Utilisateur actuel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={currentUser.userAvatar} alt={currentUser.userName} />
                    <AvatarFallback>
                      {currentUser.userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{currentUser.userName}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {currentUser.destination}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(currentUser.startDate)} - {formatDate(currentUser.endDate)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentUser.purpose}
                    </p>
                  </div>
                  {getHistoryStatusBadge(currentUser.status)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Equipment History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Historique des déplacements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {equipmentHistory.map((history, index) => (
                    <div key={history.id}>
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 mt-1">
                          <AvatarImage src={history.userAvatar} alt={history.userName} />
                          <AvatarFallback>
                            {history.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{history.userName}</p>
                              <p className="text-xs text-muted-foreground">
                                {history.purpose}
                              </p>
                            </div>
                            {getHistoryStatusBadge(history.status)}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {history.destination}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(history.startDate)} - {formatDate(history.endDate)}
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < equipmentHistory.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};