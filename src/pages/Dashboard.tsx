import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TravelCard } from "@/components/TravelCard";
import { EquipmentTableView } from "@/components/EquipmentTableView";
import { EquipmentCalendarView } from "@/components/EquipmentCalendarView";
import { Plus, Search, Plane, Users, CheckCircle, Monitor, Calendar, Table } from "lucide-react";
import { TravelRequest } from "@/types/travel";
import { useNavigate } from "react-router-dom";

// Mock data - in real app would come from API
const mockTravels: TravelRequest[] = [
  {
    id: '1',
    requesterName: 'Marie Dubois',
    requesterEmail: 'marie.dubois@company.com',
    purpose: 'Salon professionnel',
    destination: {
      city: 'Paris',
      address: '123 Avenue des Champs-Élysées'
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
      hotelPreference: 'Hôtel proche du salon',
      location: 'Près des Champs-Élysées'
    },
    equipment: {
      laptop: true,
      simCard: true,
      other: ''
    },
    status: 'pending',
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    requesterName: 'Thomas Martin',
    requesterEmail: 'thomas.martin@company.com',
    purpose: 'Visite client',
    destination: {
      city: 'Lyon',
      address: '45 Rue de la République'
    },
    dates: {
      start: '2024-01-20',
      end: '2024-01-21'
    },
    schedule: {
      arrivalTime: '14:00',
      arrivalPreference: 'specific',
      departureTime: '16:00',
      departurePreference: 'next_day'
    },
    accommodation: {
      hotelPreference: 'Hôtel centre-ville',
      location: 'Centre de Lyon'
    },
    equipment: {
      laptop: true,
      simCard: false,
      other: 'Tablette'
    },
    status: 'approved',
    createdAt: '2024-01-08'
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filterTravels = (status?: string) => {
    let filtered = mockTravels;
    
    if (status && status !== 'all') {
      filtered = filtered.filter(travel => travel.status === status);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(travel => 
        travel.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        travel.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        travel.destination.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getStats = () => {
    return {
      total: mockTravels.length,
      pending: mockTravels.filter(t => t.status === 'pending').length,
      approved: mockTravels.filter(t => t.status === 'approved').length,
      inProgress: mockTravels.filter(t => t.status === 'in_progress').length
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des Voyages</h1>
            <p className="text-muted-foreground">
              Suivez et validez les demandes de déplacement de vos équipes
            </p>
          </div>
          <Button 
            onClick={() => navigate('/request')}
            className="bg-gradient-to-r from-primary to-primary-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Users className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Validés</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.approved}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En cours</CardTitle>
              <Plane className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.inProgress}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="travels" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="travels" className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Demandes de voyage
            </TabsTrigger>
            <TabsTrigger value="equipment-table" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Équipements - Tableau
            </TabsTrigger>
            <TabsTrigger value="equipment-calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Équipements - Calendrier
            </TabsTrigger>
          </TabsList>

          {/* Travel Requests Tab */}
          <TabsContent value="travels" className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, destination ou objet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Travel Status Tabs */}
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="pending">En attente</TabsTrigger>
                <TabsTrigger value="approved">Validés</TabsTrigger>
                <TabsTrigger value="in_progress">En cours</TabsTrigger>
                <TabsTrigger value="completed">Terminés</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filterTravels().map((travel) => (
                    <TravelCard key={travel.id} travel={travel} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filterTravels('pending').map((travel) => (
                    <TravelCard key={travel.id} travel={travel} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="approved" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filterTravels('approved').map((travel) => (
                    <TravelCard key={travel.id} travel={travel} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="in_progress" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filterTravels('in_progress').map((travel) => (
                    <TravelCard key={travel.id} travel={travel} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filterTravels('completed').map((travel) => (
                    <TravelCard key={travel.id} travel={travel} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Equipment Table View Tab */}
          <TabsContent value="equipment-table">
            <EquipmentTableView />
          </TabsContent>

          {/* Equipment Calendar View Tab */}
          <TabsContent value="equipment-calendar">
            <EquipmentCalendarView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;