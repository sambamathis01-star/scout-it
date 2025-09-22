import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CalendarIcon, 
  MapPin, 
  User, 
  Laptop,
  Smartphone,
  Eye
} from "lucide-react";
import { fr } from "date-fns/locale";
import { format, isSameDay, parseISO } from "date-fns";
import { EquipmentModal } from "./EquipmentModal";
import { Equipment } from "@/types/equipment";

// Import avatars
import marieDuboisAvatar from "@/assets/avatars/marie-dubois.jpg";
import thomasMartinAvatar from "@/assets/avatars/thomas-martin.jpg";
import sophieLaurentAvatar from "@/assets/avatars/sophie-laurent.jpg";

interface TravelEvent {
  id: string;
  userName: string;
  userAvatar: string;
  destination: string;
  startDate: string;
  endDate: string;
  purpose: string;
  equipments: Equipment[];
}

// Mock travel events data
const mockTravelEvents: TravelEvent[] = [
  {
    id: '1',
    userName: 'Marie Dubois',
    userAvatar: marieDuboisAvatar,
    destination: 'Paris',
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    purpose: 'Salon professionnel Tech Summit 2024',
    equipments: [
      {
        id: 'laptop-001',
        type: 'laptop',
        model: 'MacBook Pro 16"',
        serialNumber: 'MBP-2024-001',
        status: 'assigned'
      },
      {
        id: 'simcard-001',
        type: 'simcard',
        model: 'Orange Business 5G',
        serialNumber: 'SIM-2024-001',
        status: 'assigned'
      }
    ]
  },
  {
    id: '2',
    userName: 'Thomas Martin',
    userAvatar: thomasMartinAvatar,
    destination: 'Lyon',
    startDate: '2024-01-20',
    endDate: '2024-01-21',
    purpose: 'Visite client stratégique',
    equipments: [
      {
        id: 'laptop-002',
        type: 'laptop',
        model: 'Dell XPS 15',
        serialNumber: 'DELL-2024-002',
        status: 'in_transit'
      }
    ]
  },
  {
    id: '3',
    userName: 'Sophie Laurent',
    userAvatar: sophieLaurentAvatar,
    destination: 'Marseille',
    startDate: '2024-01-25',
    endDate: '2024-01-26',
    purpose: 'Formation technique',
    equipments: [
      {
        id: 'laptop-003',
        type: 'laptop',
        model: 'ThinkPad X1 Carbon',
        serialNumber: 'TP-2024-003',
        status: 'assigned'
      }
    ]
  }
];

const getEquipmentIcon = (type: string) => {
  switch (type) {
    case 'laptop':
      return <Laptop className="h-3 w-3" />;
    case 'simcard':
      return <Smartphone className="h-3 w-3" />;
    default:
      return <Laptop className="h-3 w-3" />;
  }
};

export const EquipmentCalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getEventsForDate = (date: Date) => {
    return mockTravelEvents.filter(event => {
      const startDate = parseISO(event.startDate);
      const endDate = parseISO(event.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  const getAllEventDates = () => {
    const dates: Date[] = [];
    mockTravelEvents.forEach(event => {
      const startDate = parseISO(event.startDate);
      const endDate = parseISO(event.endDate);
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
    });
    return dates;
  };

  const eventDates = getAllEventDates();
  const selectedDateEvents = getEventsForDate(selectedDate);

  const handleEquipmentClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEquipment(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendrier des Déplacements
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            locale={fr}
            className="rounded-md border"
            modifiers={{
              hasEvents: eventDates
            }}
            modifiersStyles={{
              hasEvents: {
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                fontWeight: 'bold'
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Events for selected date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Déplacements du {format(selectedDate, 'PP', { locale: fr })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <Card key={event.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={event.userAvatar} alt={event.userName} />
                            <AvatarFallback>
                              {event.userName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{event.userName}</p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {event.destination}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {event.purpose}
                        </p>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Équipements assignés:</p>
                          <div className="flex flex-wrap gap-2">
                            {event.equipments.map((equipment) => (
                              <Button
                                key={equipment.id}
                                variant="outline"
                                size="sm"
                                onClick={() => handleEquipmentClick(equipment)}
                                className="h-8 text-xs"
                              >
                                {getEquipmentIcon(equipment.type)}
                                <span className="ml-1">{equipment.model}</span>
                                <Eye className="h-3 w-3 ml-1" />
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {format(parseISO(event.startDate), 'dd MMM', { locale: fr })} - {format(parseISO(event.endDate), 'dd MMM', { locale: fr })}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun déplacement prévu pour cette date</p>
              </div>
            )}
          </ScrollArea>
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