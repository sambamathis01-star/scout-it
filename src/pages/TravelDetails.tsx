import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Hotel, 
  Laptop, 
  Smartphone,
  Send,
  User,
  CheckCircle,
  XCircle
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { TravelRequest, ChatMessage } from "@/types/travel";
import { useToast } from "@/hooks/use-toast";

// Mock data - would come from API
const mockTravel: TravelRequest = {
  id: '1',
  requesterName: 'Marie Dubois',
  requesterEmail: 'marie.dubois@company.com',
  purpose: 'Salon professionnel Tech Summit 2024',
  destination: {
    city: 'Paris',
    address: '123 Avenue des Champs-Élysées, 75008 Paris'
  },
  dates: {
    start: '2024-01-15',
    end: '2024-01-17'
  },
  schedule: {
    arrivalTime: '09:00',
    arrivalPreference: 'morning',
    departureTime: '18:00',
    departurePreference: 'evening'
  },
  accommodation: {
    hotelPreference: 'Hôtel 4 étoiles proche du salon',
    location: 'Près des Champs-Élysées'
  },
  equipment: {
    laptop: true,
    simCard: true,
    other: 'Tablette pour présentation'
  },
  status: 'pending',
  createdAt: '2024-01-10',
  validatorNotes: ''
};

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    travelId: '1',
    sender: 'Marie Dubois',
    senderType: 'requester',
    message: 'Bonjour, j\'aimerais préciser que je préfère un hôtel avec accès au wifi rapide pour les présentations.',
    timestamp: '2024-01-10T10:30:00Z'
  },
  {
    id: '2',
    travelId: '1',
    sender: 'Validateur',
    senderType: 'validator',
    message: 'Noté ! J\'ai plusieurs options d\'hôtels 4 étoiles dans le secteur avec wifi haut débit. Avez-vous une préférence de chaîne hôtelière ?',
    timestamp: '2024-01-10T14:15:00Z'
  }
];

const TravelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [travel] = useState<TravelRequest>(mockTravel);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [validatorNotes, setValidatorNotes] = useState(travel.validatorNotes || "");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      travelId: travel.id,
      sender: 'Validateur',
      senderType: 'validator',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, message]);
    setNewMessage("");
    
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé au demandeur.",
    });
  };

  const handleApprove = () => {
    toast({
      title: "Voyage approuvé",
      description: "La demande de voyage a été validée avec succès.",
    });
  };

  const handleReject = () => {
    toast({
      title: "Voyage refusé",
      description: "La demande de voyage a été refusée.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{travel.purpose}</h1>
            <p className="text-muted-foreground">Demande de {travel.requesterName}</p>
          </div>
          <StatusBadge status={travel.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Travel Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations du demandeur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{travel.requesterName}</p>
                  <p className="text-sm text-muted-foreground">{travel.requesterEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Objet du voyage</p>
                  <p className="text-sm">{travel.purpose}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Destination
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{travel.destination.city}</p>
                <p className="text-sm text-muted-foreground">{travel.destination.address}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Planning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Dates</p>
                  <p className="text-sm">Du {formatDate(travel.dates.start)} au {formatDate(travel.dates.end)}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2">Horaires souhaités</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Arrivée: {travel.schedule.arrivalTime}</span>
                      <Badge variant="outline" className="text-xs">
                        {travel.schedule.arrivalPreference === 'morning' ? 'Matin' : 
                         travel.schedule.arrivalPreference === 'evening' ? 'Soir' : 
                         travel.schedule.arrivalPreference === 'both' ? 'Flexible' : 'Heure précise'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Départ: {travel.schedule.departureTime}</span>
                      <Badge variant="outline" className="text-xs">
                        {travel.schedule.departurePreference === 'evening' ? 'Soir' : 
                         travel.schedule.departurePreference === 'next_day' ? 'Lendemain' : 
                         travel.schedule.departurePreference === 'both' ? 'Flexible' : 'Heure précise'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="h-5 w-5" />
                  Hébergement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Préférence</p>
                  <p className="text-sm text-muted-foreground">{travel.accommodation.hotelPreference}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Localisation souhaitée</p>
                  <p className="text-sm text-muted-foreground">{travel.accommodation.location}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Équipements demandés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {travel.equipment.laptop && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Laptop className="h-3 w-3" />
                      Ordinateur portable
                    </Badge>
                  )}
                  {travel.equipment.simCard && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Smartphone className="h-3 w-3" />
                      Carte SIM
                    </Badge>
                  )}
                  {travel.equipment.other && (
                    <Badge variant="outline">
                      {travel.equipment.other}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Validator Actions */}
            {travel.status === 'pending' && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions du valideur</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Notes de validation</label>
                    <Textarea
                      placeholder="Ajoutez vos commentaires..."
                      value={validatorNotes}
                      onChange={(e) => setValidatorNotes(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleApprove} className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approuver
                    </Button>
                    <Button variant="destructive" onClick={handleReject} className="flex-1">
                      <XCircle className="h-4 w-4 mr-2" />
                      Refuser
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Discussion</CardTitle>
              <p className="text-sm text-muted-foreground">
                Échangez avec le demandeur pour organiser le voyage
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-96 w-full border rounded-md p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderType === 'validator' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-lg ${
                          message.senderType === 'validator'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Tapez votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TravelDetails;