import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  ArrowLeft, 
  CalendarIcon, 
  MapPin, 
  Clock, 
  Hotel, 
  Laptop, 
  Smartphone,
  Send
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const TravelRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    requesterName: "",
    requesterEmail: "",
    purpose: "",
    destination: {
      city: "",
      address: ""
    },
    dates: {
      start: undefined as Date | undefined,
      end: undefined as Date | undefined
    },
    schedule: {
      arrivalTime: "",
      arrivalPreference: "morning",
      departureTime: "",
      departurePreference: "evening"
    },
    accommodation: {
      hotelPreference: "",
      location: ""
    },
    equipment: {
      laptop: false,
      simCard: false,
      other: ""
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.requesterName || !formData.requesterEmail || !formData.purpose || 
        !formData.destination.city || !formData.dates.start || !formData.dates.end) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
    toast({
      title: "Demande envoyée",
      description: "Votre demande de voyage a été soumise avec succès.",
    });
    
    navigate('/');
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else if (keys.length === 2) {
        const [key1, key2] = keys;
        return {
          ...prev,
          [key1]: {
            ...(prev[key1 as keyof typeof prev] as any),
            [key2]: value
          }
        };
      }
      return prev;
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
          <div>
            <h1 className="text-2xl font-bold">Nouvelle demande de voyage</h1>
            <p className="text-muted-foreground">Remplissez le formulaire pour soumettre votre demande</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    value={formData.requesterName}
                    onChange={(e) => updateFormData('requesterName', e.target.value)}
                    placeholder="Votre nom et prénom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.requesterEmail}
                    onChange={(e) => updateFormData('requesterEmail', e.target.value)}
                    placeholder="votre.email@company.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trip Purpose */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Objet du voyage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purpose">Objet du voyage *</Label>
                <Input
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => updateFormData('purpose', e.target.value)}
                  placeholder="Ex: Salon professionnel, Visite client, Formation..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Destination */}
          <Card>
            <CardHeader>
              <CardTitle>Destination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  value={formData.destination.city}
                  onChange={(e) => updateFormData('destination.city', e.target.value)}
                  placeholder="Paris, Lyon, Marseille..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse précise</Label>
                <Input
                  id="address"
                  value={formData.destination.address}
                  onChange={(e) => updateFormData('destination.address', e.target.value)}
                  placeholder="Adresse complète du lieu"
                />
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Dates du voyage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de début *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.dates.start && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dates.start ? (
                          format(formData.dates.start, "PPP", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dates.start}
                        onSelect={(date) => updateFormData('dates.start', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>Date de fin *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.dates.end && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dates.end ? (
                          format(formData.dates.end, "PPP", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dates.end}
                        onSelect={(date) => updateFormData('dates.end', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Préférences horaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Arrivée sur place</Label>
                  <div className="mt-2 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="arrivalTime">Heure souhaitée</Label>
                      <Input
                        id="arrivalTime"
                        type="time"
                        value={formData.schedule.arrivalTime}
                        onChange={(e) => updateFormData('schedule.arrivalTime', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Flexibilité</Label>
                      <RadioGroup
                        value={formData.schedule.arrivalPreference}
                        onValueChange={(value) => updateFormData('schedule.arrivalPreference', value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="morning" id="arr-morning" />
                          <Label htmlFor="arr-morning">Je veux y aller le matin</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="evening" id="arr-evening" />
                          <Label htmlFor="arr-evening">Je veux y aller la veille au soir</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="both" id="arr-both" />
                          <Label htmlFor="arr-both">Les deux me conviennent</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="specific" id="arr-specific" />
                          <Label htmlFor="arr-specific">À l'heure précise indiquée</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Départ</Label>
                  <div className="mt-2 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="departureTime">Heure de fin</Label>
                      <Input
                        id="departureTime"
                        type="time"
                        value={formData.schedule.departureTime}
                        onChange={(e) => updateFormData('schedule.departureTime', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Flexibilité</Label>
                      <RadioGroup
                        value={formData.schedule.departurePreference}
                        onValueChange={(value) => updateFormData('schedule.departurePreference', value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="evening" id="dep-evening" />
                          <Label htmlFor="dep-evening">Je veux repartir le soir</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="next_day" id="dep-next" />
                          <Label htmlFor="dep-next">Je veux repartir le lendemain</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="both" id="dep-both" />
                          <Label htmlFor="dep-both">Les deux me conviennent</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="specific" id="dep-specific" />
                          <Label htmlFor="dep-specific">À l'heure précise indiquée</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accommodation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="h-5 w-5" />
                Hébergement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hotelPref">Préférences hôtel</Label>
                <Input
                  id="hotelPref"
                  value={formData.accommodation.hotelPreference}
                  onChange={(e) => updateFormData('accommodation.hotelPreference', e.target.value)}
                  placeholder="Ex: Hôtel 4 étoiles, chaîne spécifique..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotelLocation">Localisation souhaitée</Label>
                <Input
                  id="hotelLocation"
                  value={formData.accommodation.location}
                  onChange={(e) => updateFormData('accommodation.location', e.target.value)}
                  placeholder="Ex: Proche du centre-ville, près de la gare..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card>
            <CardHeader>
              <CardTitle>Équipements nécessaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="laptop"
                    checked={formData.equipment.laptop}
                    onCheckedChange={(checked) => updateFormData('equipment.laptop', checked)}
                  />
                  <Label htmlFor="laptop" className="flex items-center gap-2">
                    <Laptop className="h-4 w-4" />
                    Ordinateur portable
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="simcard"
                    checked={formData.equipment.simCard}
                    onCheckedChange={(checked) => updateFormData('equipment.simCard', checked)}
                  />
                  <Label htmlFor="simcard" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Carte SIM
                  </Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otherEquipment">Autres équipements</Label>
                <Textarea
                  id="otherEquipment"
                  value={formData.equipment.other}
                  onChange={(e) => updateFormData('equipment.other', e.target.value)}
                  placeholder="Spécifiez d'autres équipements nécessaires..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card>
            <CardContent className="pt-6">
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary-glow">
                <Send className="h-4 w-4 mr-2" />
                Soumettre la demande
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default TravelRequest;