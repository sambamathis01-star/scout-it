import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Laptop, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Search,
  Eye,
  MapPin
} from "lucide-react";
import { Equipment } from "@/types/equipment";
import { EquipmentModal } from "./EquipmentModal";

// Import avatars
import marieDuboisAvatar from "@/assets/avatars/marie-dubois.jpg";
import thomasMartinAvatar from "@/assets/avatars/thomas-martin.jpg";
import sophieLaurentAvatar from "@/assets/avatars/sophie-laurent.jpg";

// Mock equipment data
const mockEquipments: Equipment[] = [
  {
    id: 'laptop-001',
    type: 'laptop',
    model: 'MacBook Pro 16"',
    serialNumber: 'MBP-2024-001',
    currentUser: 'Marie Dubois',
    currentLocation: 'Paris',
    status: 'assigned'
  },
  {
    id: 'laptop-002',
    type: 'laptop',
    model: 'Dell XPS 15',
    serialNumber: 'DELL-2024-002',
    currentUser: 'Thomas Martin',
    currentLocation: 'Lyon',
    status: 'in_transit'
  },
  {
    id: 'simcard-001',
    type: 'simcard',
    model: 'Orange Business 5G',
    serialNumber: 'SIM-2024-001',
    currentUser: 'Marie Dubois',
    currentLocation: 'Paris',
    status: 'assigned'
  },
  {
    id: 'tablet-001',
    type: 'tablet',
    model: 'iPad Pro 12.9"',
    serialNumber: 'IPAD-2024-001',
    status: 'available'
  },
  {
    id: 'laptop-003',
    type: 'laptop',
    model: 'ThinkPad X1 Carbon',
    serialNumber: 'TP-2024-003',
    currentUser: 'Sophie Laurent',
    currentLocation: 'Marseille',
    status: 'assigned'
  }
];

const userAvatars: Record<string, string> = {
  'Marie Dubois': marieDuboisAvatar,
  'Thomas Martin': thomasMartinAvatar,
  'Sophie Laurent': sophieLaurentAvatar,
};

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

export const EquipmentTableView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredEquipments = mockEquipments.filter(equipment =>
    equipment.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.currentUser?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.currentLocation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEquipmentClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEquipment(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Suivi des Équipements
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher par modèle, numéro de série, utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Équipement</TableHead>
                <TableHead>Modèle</TableHead>
                <TableHead>N° Série</TableHead>
                <TableHead>Utilisateur actuel</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipments.map((equipment) => (
                <TableRow key={equipment.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getEquipmentIcon(equipment.type)}
                      <span className="font-medium capitalize">{equipment.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{equipment.model}</TableCell>
                  <TableCell className="font-mono text-sm">{equipment.serialNumber}</TableCell>
                  <TableCell>
                    {equipment.currentUser ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage 
                            src={userAvatars[equipment.currentUser]} 
                            alt={equipment.currentUser} 
                          />
                          <AvatarFallback>
                            {equipment.currentUser.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{equipment.currentUser}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Non assigné</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {equipment.currentLocation ? (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{equipment.currentLocation}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(equipment.status)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEquipmentClick(equipment)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EquipmentModal
        equipment={selectedEquipment}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};